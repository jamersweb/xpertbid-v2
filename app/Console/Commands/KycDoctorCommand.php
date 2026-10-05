<?php

namespace App\Console\Commands;

use App\Models\CorporateVerification;
use App\Models\IndividualVerification;
use App\Services\KycDocumentStorage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class KycDoctorCommand extends Command
{
    protected $signature = 'kyc:doctor
                            {--fix-permissions : chmod private KYC dirs/files so the web user can read them}';

    protected $description = 'Diagnose KYC private-disk paths vs DB keys (helps debug /kyc 404s after migrate)';

    public function handle(KycDocumentStorage $storage): int
    {
        $root = storage_path('app/private/kyc');
        $this->info('KYC disk root: '.$root);
        $this->line('Exists: '.(is_dir($root) ? 'yes' : 'NO'));
        $this->line('Readable: '.(is_readable($root) ? 'yes' : 'NO'));
        $this->line('Writable: '.(is_writable($root) ? 'yes' : 'NO'));

        if ($this->option('fix-permissions') && is_dir($root)) {
            $this->fixPermissions($root);
            $this->info('Permissions updated under '.$root);
        }

        $missing = 0;
        $ok = 0;
        $legacy = 0;
        $samples = [];

        IndividualVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, &$missing, &$ok, &$legacy, &$samples) {
            foreach ($rows as $row) {
                foreach (['id_front_path' => 'front', 'id_back_path' => 'back'] as $column => $label) {
                    $key = $row->{$column};
                    $status = $this->classify($storage, $key);
                    if ($status === 'ok') {
                        $ok++;
                    } elseif ($status === 'legacy') {
                        $legacy++;
                    } elseif ($status === 'missing_private') {
                        $missing++;
                        if (count($samples) < 15) {
                            $samples[] = "individual #{$row->id} {$label}: {$key}";
                        }
                    }
                }
            }
        });

        CorporateVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, &$missing, &$ok, &$legacy, &$samples) {
            foreach ($rows as $row) {
                $docs = is_array($row->business_documents) ? $row->business_documents : [];
                foreach ($docs as $index => $key) {
                    $status = $this->classify($storage, $key);
                    if ($status === 'ok') {
                        $ok++;
                    } elseif ($status === 'legacy') {
                        $legacy++;
                    } elseif ($status === 'missing_private') {
                        $missing++;
                        if (count($samples) < 15) {
                            $samples[] = "corporate #{$row->id} doc[{$index}]: {$key}";
                        }
                    }
                }
            }
        });

        $this->newLine();
        $this->table(['ok_on_disk', 'still_legacy_public', 'missing_private_file'], [[$ok, $legacy, $missing]]);

        if ($samples !== []) {
            $this->warn('Sample missing private files:');
            foreach ($samples as $sample) {
                $this->line(' - '.$sample);
            }
        }

        if ($missing > 0) {
            $this->error('DB points to private keys but files are missing on this server disk.');
            $this->line('Common causes:');
            $this->line(' 1) migrate ran in a different release/directory than the live app');
            $this->line(' 2) storage/ is not shared/persisted across deploys');
            $this->line(' 3) file ownership/permissions (try: php artisan kyc:doctor --fix-permissions)');
            $this->line(' 4) config cache outdated — run: php artisan config:clear && php artisan config:cache');
        }

        if ($legacy > 0) {
            $this->warn('Some rows still use public paths. Re-run: php artisan kyc:migrate-public-documents --apply');
        }

        return $missing > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function classify(KycDocumentStorage $storage, ?string $key): string
    {
        if (! filled($key) || $storage->isPlaceholder($key)) {
            return 'empty';
        }

        if ($storage->isLegacyPublicPath($key)) {
            $absolute = public_path(ltrim($key, '/'));

            return File::isFile($absolute) ? 'legacy' : 'missing_private';
        }

        if ($storage->isStoredKey($key)) {
            return $storage->exists($key) || $this->absoluteExists($storage, $key)
                ? 'ok'
                : 'missing_private';
        }

        return 'empty';
    }

    private function absoluteExists(KycDocumentStorage $storage, string $key): bool
    {
        try {
            return is_file($storage->disk()->path($key));
        } catch (\Throwable) {
            return false;
        }
    }

    private function fixPermissions(string $root): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        @chmod($root, 0775);

        foreach ($iterator as $item) {
            @chmod($item->getPathname(), $item->isDir() ? 0775 : 0664);
        }
    }
}
