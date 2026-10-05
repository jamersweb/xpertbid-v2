<?php

namespace App\Console\Commands;

use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Services\KycDocumentStorage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MigratePublicKycDocuments extends Command
{
    protected $signature = 'kyc:migrate-public-documents
                            {--apply : Persist migrated files and DB keys (default is dry-run)}
                            {--delete-public : Delete public originals after a successful copy}';

    protected $description = 'Move legacy public KYC documents into the private kyc disk and update DB keys';

    public function handle(KycDocumentStorage $storage): int
    {
        $apply = (bool) $this->option('apply');
        $deletePublic = (bool) $this->option('delete-public');

        $stats = [
            'individual_scanned' => 0,
            'individual_migrated' => 0,
            'corporate_scanned' => 0,
            'corporate_migrated' => 0,
            'files_copied' => 0,
            'files_deleted' => 0,
            'skipped' => 0,
            'failed' => 0,
        ];

        File::ensureDirectoryExists(storage_path('app/private/kyc'), 0755);
        @chmod(storage_path('app/private'), 0775);
        @chmod(storage_path('app/private/kyc'), 0775);

        $this->info($apply ? 'Applying KYC public→private migration…' : 'Dry run (pass --apply to persist)…');
        $this->line('Target disk root: '.storage_path('app/private/kyc'));

        IndividualVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, $apply, $deletePublic, &$stats) {
            foreach ($rows as $row) {
                $stats['individual_scanned']++;
                $changed = false;
                $folder = 'individual/'.$row->user_id;

                foreach (['id_front_path', 'id_back_path'] as $column) {
                    $result = $this->migratePath($storage, $row->{$column}, $folder, $apply, $deletePublic, $stats);
                    if ($result['status'] === 'migrated') {
                        $row->{$column} = $result['key'];
                        $changed = true;
                    } elseif ($result['status'] === 'failed') {
                        $stats['failed']++;
                    } elseif ($result['status'] !== 'empty') {
                        $stats['skipped']++;
                    }
                }

                if ($changed && $apply) {
                    $row->save();
                    $stats['individual_migrated']++;
                } elseif ($changed) {
                    $stats['individual_migrated']++;
                }
            }
        });

        CorporateVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, $apply, $deletePublic, &$stats) {
            foreach ($rows as $row) {
                $stats['corporate_scanned']++;
                $docs = is_array($row->business_documents) ? $row->business_documents : [];
                if ($docs === []) {
                    $stats['skipped']++;
                    continue;
                }

                $folder = 'corporate/'.$row->user_id;
                $newDocs = [];
                $changed = false;

                foreach ($docs as $path) {
                    $result = $this->migratePath($storage, $path, $folder, $apply, $deletePublic, $stats);
                    if ($result['status'] === 'migrated') {
                        $newDocs[] = $result['key'];
                        $changed = true;
                    } elseif ($result['status'] === 'already_private') {
                        $newDocs[] = $path;
                    } elseif ($result['status'] === 'failed') {
                        $stats['failed']++;
                        $newDocs[] = $path;
                    } else {
                        $stats['skipped']++;
                        if (filled($path)) {
                            $newDocs[] = $path;
                        }
                    }
                }

                if ($changed) {
                    if ($apply) {
                        $row->business_documents = $newDocs;
                        $row->save();
                    }
                    $stats['corporate_migrated']++;
                }
            }
        });

        $this->table(array_keys($stats), [array_values($stats)]);
        $this->line('Diagnose: php artisan kyc:doctor');
        $this->line('Fix perms: php artisan kyc:doctor --fix-permissions');

        return $stats['failed'] > 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * @param  array<string, int>  $stats
     * @return array{status: string, key?: string}
     */
    private function migratePath(
        KycDocumentStorage $storage,
        ?string $path,
        string $folder,
        bool $apply,
        bool $deletePublic,
        array &$stats
    ): array {
        if (! filled($path)) {
            return ['status' => 'empty'];
        }

        if ($storage->isPlaceholder($path)) {
            return ['status' => 'placeholder'];
        }

        if ($storage->isStoredKey($path) && ! $storage->isLegacyPublicPath($path)) {
            // Already private key — ensure the file actually exists on THIS server.
            if ($storage->exists($path) || $this->absoluteExists($storage, $path)) {
                return ['status' => 'already_private'];
            }

            $this->warn("Private key in DB but file missing on disk: {$path}");

            return ['status' => 'failed'];
        }

        if (! $storage->isLegacyPublicPath($path)) {
            return ['status' => 'unknown'];
        }

        $relative = ltrim($path, '/');
        $absolute = public_path($relative);

        if (! File::isFile($absolute)) {
            $this->warn("Missing public file (skipped): {$relative}");

            return ['status' => 'missing'];
        }

        $extension = strtolower(pathinfo($absolute, PATHINFO_EXTENSION) ?: 'bin');
        $newKey = trim($folder, '/').'/'.Str::uuid()->toString().'.'.$extension;

        if ($apply) {
            try {
                $destination = $storage->disk()->path($newKey);
            } catch (\Throwable $e) {
                $this->warn('KYC disk path() unavailable: '.$e->getMessage());

                return ['status' => 'failed'];
            }

            File::ensureDirectoryExists(dirname($destination), 0755);
            @chmod(dirname($destination), 0775);

            if (! @copy($absolute, $destination) || ! is_file($destination) || filesize($destination) < 1) {
                $this->warn("Could not copy to private disk: {$newKey}");

                return ['status' => 'failed'];
            }

            @chmod($destination, 0664);

            if (! $storage->exists($newKey) && ! is_file($destination)) {
                $this->warn("Copy reported ok but exists() failed: {$newKey}");

                return ['status' => 'failed'];
            }

            $stats['files_copied']++;

            if ($deletePublic) {
                File::delete($absolute);
                $stats['files_deleted']++;
            }
        } else {
            $this->line("Would migrate {$relative} → {$newKey}");
            $stats['files_copied']++;
        }

        return ['status' => 'migrated', 'key' => $newKey];
    }

    private function absoluteExists(KycDocumentStorage $storage, string $key): bool
    {
        try {
            return is_file($storage->disk()->path($key));
        } catch (\Throwable) {
            return false;
        }
    }
}
