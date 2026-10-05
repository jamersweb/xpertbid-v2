<?php

namespace App\Console\Commands;

use App\Models\IndividualVerification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RecoverLegacyKycPathsCommand extends Command
{
    protected $signature = 'kyc:recover-legacy-paths
                            {--dir= : Folder with legacy individuals images (default: public/assets/images/individuals)}
                            {--apply : Write recovered paths to DB (default dry-run)}
                            {--window=86400 : Max seconds between filename timestamp and verification created/updated time}';

    protected $description = 'Re-link empty individual KYC paths from a restored public individuals folder (timestamp heuristic)';

    public function handle(): int
    {
        $dir = $this->option('dir') ?: public_path('assets/images/individuals');
        $apply = (bool) $this->option('apply');
        $window = max(60, (int) $this->option('window'));

        if (! is_dir($dir)) {
            $this->error("Directory not found: {$dir}");

            return self::FAILURE;
        }

        $this->info(($apply ? 'APPLY' : 'DRY-RUN')." recovery from: {$dir}");
        $this->line('Match window: ±'.$window.' seconds');

        $files = collect(File::files($dir))
            ->filter(fn ($f) => preg_match('/^(\d+)_(front|back)\./i', $f->getFilename()))
            ->values();

        $fronts = [];
        $backs = [];
        foreach ($files as $file) {
            if (! preg_match('/^(\d+)_(front|back)\.(.+)$/i', $file->getFilename(), $m)) {
                continue;
            }
            $ts = (int) $m[1];
            $side = strtolower($m[2]);
            $rel = 'assets/images/individuals/'.$file->getFilename();
            if ($side === 'front') {
                $fronts[$ts] = $rel;
            } else {
                $backs[$ts] = $rel;
            }
        }

        $this->line('Found front files: '.count($fronts).', back files: '.count($backs));

        $candidates = IndividualVerification::query()
            ->where(function ($q) {
                $q->whereNull('id_front_path')
                    ->orWhere('id_front_path', '')
                    ->orWhere('id_front_path', 'like', 'assets/images/individuals/%');
            })
            ->orderBy('id')
            ->get();

        // Prefer empty paths first (cleared rows), then unresolved legacy.
        $empty = $candidates->filter(fn ($row) => ! filled($row->id_front_path) && ! filled($row->id_back_path));
        $this->line('Verifications with empty front+back paths: '.$empty->count());

        $usedFrontTs = [];
        $usedBackTs = [];
        $linked = 0;
        $partial = 0;

        foreach ($empty as $row) {
            $anchor = max(
                optional($row->updated_at)->getTimestamp() ?? 0,
                optional($row->created_at)->getTimestamp() ?? 0
            );

            $frontTs = $this->closestUnused(array_keys($fronts), $usedFrontTs, $anchor, $window);
            $backTs = $this->closestUnused(array_keys($backs), $usedBackTs, $anchor, $window);

            // Prefer same timestamp pair when both sides exist.
            if ($frontTs && isset($backs[$frontTs]) && ! isset($usedBackTs[$frontTs])) {
                $backTs = $frontTs;
            } elseif ($backTs && isset($fronts[$backTs]) && ! isset($usedFrontTs[$backTs])) {
                $frontTs = $backTs;
            }

            if (! $frontTs && ! $backTs) {
                continue;
            }

            $newFront = $frontTs ? $fronts[$frontTs] : '';
            $newBack = $backTs ? $backs[$backTs] : '';

            $this->line(sprintf(
                ' #%d (%s) → front=%s back=%s',
                $row->id,
                $row->full_legal_name ?: 'n/a',
                $newFront ?: '-',
                $newBack ?: '-'
            ));

            if ($apply) {
                if ($newFront !== '') {
                    $row->id_front_path = $newFront;
                    $usedFrontTs[$frontTs] = true;
                }
                if ($newBack !== '') {
                    $row->id_back_path = $newBack;
                    $usedBackTs[$backTs] = true;
                }
                $row->save();
            } else {
                if ($frontTs) {
                    $usedFrontTs[$frontTs] = true;
                }
                if ($backTs) {
                    $usedBackTs[$backTs] = true;
                }
            }

            if ($newFront && $newBack) {
                $linked++;
            } else {
                $partial++;
            }
        }

        $this->newLine();
        $this->table(['full_pairs', 'partial', 'mode'], [[$linked, $partial, $apply ? 'applied' : 'dry-run']]);

        if (! $apply) {
            $this->line('If matches look reasonable, run:');
            $this->line('  php artisan kyc:recover-legacy-paths --apply');
            $this->line('Then:');
            $this->line('  php artisan kyc:migrate-public-documents --apply');
            $this->line('  php artisan kyc:doctor');
        } else {
            $this->info('Paths restored to legacy public keys. Now migrate to private disk:');
            $this->line('  php artisan kyc:migrate-public-documents --apply');
        }

        $this->warn('Heuristic matching by upload timestamp — spot-check a few verified users after apply.');

        return self::SUCCESS;
    }

    /**
     * @param  list<int>  $timestamps
     * @param  array<int, bool>  $used
     */
    private function closestUnused(array $timestamps, array $used, int $anchor, int $window): ?int
    {
        if ($anchor <= 0 || $timestamps === []) {
            return null;
        }

        $best = null;
        $bestDiff = null;
        foreach ($timestamps as $ts) {
            if (isset($used[$ts])) {
                continue;
            }
            $diff = abs($ts - $anchor);
            if ($diff > $window) {
                continue;
            }
            if ($bestDiff === null || $diff < $bestDiff) {
                $best = $ts;
                $bestDiff = $diff;
            }
        }

        return $best;
    }
}
