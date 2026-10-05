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

        $this->info($apply ? 'Applying KYC public→private migration…' : 'Dry run (pass --apply to persist)…');

        IndividualVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, $apply, $deletePublic, &$stats) {
            foreach ($rows as $row) {
                $stats['individual_scanned']++;
                $changed = false;
                $folder = 'individual/' . $row->user_id;

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

                $folder = 'corporate/' . $row->user_id;
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
        $this->line('After deploy: php artisan kyc:migrate-public-documents --apply --delete-public');

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
            return ['status' => 'already_private'];
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
        $newKey = trim($folder, '/') . '/' . Str::uuid()->toString() . '.' . $extension;

        if ($apply) {
            $stream = fopen($absolute, 'rb');
            if ($stream === false) {
                $this->warn("Could not read: {$relative}");

                return ['status' => 'failed'];
            }

            $stored = $storage->disk()->put($newKey, $stream);
            if (is_resource($stream)) {
                fclose($stream);
            }

            if (! $stored) {
                $this->warn("Could not store: {$newKey}");

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
}
