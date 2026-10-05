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
                            {--fix-permissions : chmod private KYC dirs/files so the web user can read them}
                            {--clear-missing : Null out DB document paths whose files are missing (stops broken /kyc links)}';

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

        $ok = 0;
        $legacyOk = 0;
        $missingPrivate = 0;
        $missingLegacy = 0;
        $samplesPrivate = [];
        $samplesLegacy = [];
        $clearable = [];

        IndividualVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, &$ok, &$legacyOk, &$missingPrivate, &$missingLegacy, &$samplesPrivate, &$samplesLegacy, &$clearable) {
            foreach ($rows as $row) {
                foreach (['id_front_path' => 'front', 'id_back_path' => 'back'] as $column => $label) {
                    $key = $row->{$column};
                    $status = $this->classify($storage, $key);

                    if ($status === 'ok_private') {
                        $ok++;
                    } elseif ($status === 'ok_legacy') {
                        $legacyOk++;
                    } elseif ($status === 'missing_private') {
                        $missingPrivate++;
                        $clearable[] = ['type' => 'individual', 'id' => $row->id, 'column' => $column];
                        if (count($samplesPrivate) < 10) {
                            $samplesPrivate[] = "individual #{$row->id} {$label}: {$key}";
                        }
                    } elseif ($status === 'missing_legacy') {
                        $missingLegacy++;
                        $clearable[] = ['type' => 'individual', 'id' => $row->id, 'column' => $column];
                        if (count($samplesLegacy) < 10) {
                            $samplesLegacy[] = "individual #{$row->id} {$label}: {$key}";
                        }
                    }
                }
            }
        });

        CorporateVerification::query()->orderBy('id')->chunkById(100, function ($rows) use ($storage, &$ok, &$legacyOk, &$missingPrivate, &$missingLegacy, &$samplesPrivate, &$samplesLegacy, &$clearable) {
            foreach ($rows as $row) {
                $docs = is_array($row->business_documents) ? $row->business_documents : [];
                foreach ($docs as $index => $key) {
                    $status = $this->classify($storage, $key);

                    if ($status === 'ok_private') {
                        $ok++;
                    } elseif ($status === 'ok_legacy') {
                        $legacyOk++;
                    } elseif ($status === 'missing_private') {
                        $missingPrivate++;
                        $clearable[] = ['type' => 'corporate', 'id' => $row->id, 'index' => $index];
                        if (count($samplesPrivate) < 10) {
                            $samplesPrivate[] = "corporate #{$row->id} doc[{$index}]: {$key}";
                        }
                    } elseif ($status === 'missing_legacy') {
                        $missingLegacy++;
                        $clearable[] = ['type' => 'corporate', 'id' => $row->id, 'index' => $index];
                        if (count($samplesLegacy) < 10) {
                            $samplesLegacy[] = "corporate #{$row->id} doc[{$index}]: {$key}";
                        }
                    }
                }
            }
        });

        $this->newLine();
        $this->table(
            ['ok_private', 'ok_legacy_public', 'missing_private_key', 'missing_legacy_public'],
            [[$ok, $legacyOk, $missingPrivate, $missingLegacy]]
        );

        if ($samplesPrivate !== []) {
            $this->warn('Sample DB private keys with NO file on disk:');
            foreach ($samplesPrivate as $sample) {
                $this->line(' - '.$sample);
            }
        }

        if ($samplesLegacy !== []) {
            $this->warn('Sample DB public paths with NO file in public/:');
            foreach ($samplesLegacy as $sample) {
                $this->line(' - '.$sample);
            }
            $this->line('These were already missing before migrate (or public originals were deleted elsewhere).');
            $this->line('They cannot be recovered unless you restore from backup.');
        }

        if ($ok > 0) {
            $this->info("{$ok} document(s) are OK on the private disk — those /kyc URLs should work.");
        }

        if ($this->option('clear-missing') && $clearable !== []) {
            $cleared = $this->clearMissing($clearable);
            $this->info("Cleared {$cleared} missing document path(s) from DB.");
        } elseif ($missingPrivate + $missingLegacy > 0) {
            $this->line('To hide broken Front/Back links for missing files:');
            $this->line('  php artisan kyc:doctor --clear-missing');
        }

        return ($missingPrivate > 0) ? self::FAILURE : self::SUCCESS;
    }

    private function classify(KycDocumentStorage $storage, ?string $key): string
    {
        if (! filled($key) || $storage->isPlaceholder($key)) {
            return 'empty';
        }

        if ($storage->isLegacyPublicPath($key)) {
            $absolute = public_path(ltrim($key, '/'));

            return File::isFile($absolute) ? 'ok_legacy' : 'missing_legacy';
        }

        if ($storage->isStoredKey($key)) {
            return $storage->exists($key) ? 'ok_private' : 'missing_private';
        }

        return 'empty';
    }

    /**
     * @param  list<array<string, mixed>>  $clearable
     */
    private function clearMissing(array $clearable): int
    {
        $cleared = 0;
        $individualCols = [];
        $corporateIndexes = [];

        foreach ($clearable as $item) {
            if ($item['type'] === 'individual') {
                $individualCols[$item['id']][] = $item['column'];
            } else {
                $corporateIndexes[$item['id']][] = $item['index'];
            }
        }

        foreach ($individualCols as $id => $columns) {
            $row = IndividualVerification::find($id);
            if (! $row) {
                continue;
            }
            foreach (array_unique($columns) as $column) {
                // Columns are NOT NULL in DB — use empty string so filled() hides broken links.
                $row->{$column} = '';
                $cleared++;
            }
            $row->save();
        }

        foreach ($corporateIndexes as $id => $indexes) {
            $row = CorporateVerification::find($id);
            if (! $row) {
                continue;
            }
            $docs = is_array($row->business_documents) ? $row->business_documents : [];
            foreach ($indexes as $index) {
                if (array_key_exists($index, $docs)) {
                    unset($docs[$index]);
                    $cleared++;
                }
            }
            $row->business_documents = array_values($docs);
            $row->save();
        }

        return $cleared;
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
