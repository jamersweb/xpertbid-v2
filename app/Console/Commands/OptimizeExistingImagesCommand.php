<?php

namespace App\Console\Commands;

use App\Services\ImageOptimizerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class OptimizeExistingImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize-existing
                            {--dry-run : Preview changes without modifying files or database}
                            {--dir= : Specific directory to optimize (listing_images, auction, category_images)}
                            {--limit= : Limit the number of files to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan and optimize existing server images in listing_images, auction, and category_images to WebP with DB updates';

    /**
     * Execute the console command.
     */
    public function handle(ImageOptimizerService $optimizer): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $dirOption = $this->option('dir');
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;

        $targetDirectories = [
            'listing_images' => [
                'path' => public_path('assets/images/listing_images'),
                'type' => ImageOptimizerService::TYPE_LISTING,
                'label' => 'Listing Images (max 600px, 75% WebP)',
            ],
            'auction' => [
                'path' => public_path('assets/images/auction'),
                'type' => ImageOptimizerService::TYPE_AUCTION,
                'label' => 'Auction Images (max 600px, 75% WebP)',
            ],
            'category_images' => [
                'path' => public_path('assets/images/category_images'),
                'type' => ImageOptimizerService::TYPE_CATEGORY,
                'label' => 'Category Images (max 180px, 80% WebP)',
            ],
        ];

        if ($dirOption) {
            $key = strtolower(trim($dirOption));
            if (!isset($targetDirectories[$key])) {
                $this->error("Invalid --dir value. Must be one of: " . implode(', ', array_keys($targetDirectories)));
                return self::FAILURE;
            }
            $targetDirectories = [$key => $targetDirectories[$key]];
        }

        $this->newLine();
        $this->info("===============================================================");
        $this->info("       XpertBid Server Image Optimization Architecture         ");
        $this->info("===============================================================");

        if ($dryRun) {
            $this->warn(" >>> DRY-RUN MODE: No files will be modified or deleted. <<<");
            $this->warn(" >>> Simulated results and potential savings will be shown. <<<");
        } else {
            $this->comment(" Mode: LIVE EXECUTION (Files will be optimized and DB updated)");
        }
        $this->newLine();

        // Collect all eligible files
        $collectedFiles = [];
        foreach ($targetDirectories as $key => $config) {
            $dirPath = $config['path'];
            if (!File::isDirectory($dirPath)) {
                $this->warn("Directory not found: {$dirPath} (Skipping)");
                continue;
            }

            $files = File::files($dirPath);
            foreach ($files as $file) {
                $ext = strtolower($file->getExtension());
                if (in_array($ext, ImageOptimizerService::RASTER_EXTENSIONS, true)) {
                    $collectedFiles[] = [
                        'dir_key' => $key,
                        'dir_label' => $config['label'],
                        'type' => $config['type'],
                        'file' => $file,
                        'path' => $file->getRealPath(),
                    ];
                }
            }
        }

        $totalFound = count($collectedFiles);
        if ($totalFound === 0) {
            $this->info("No eligible image files found in target directories.");
            return self::SUCCESS;
        }

        if ($limit && $limit < $totalFound) {
            $collectedFiles = array_slice($collectedFiles, 0, $limit);
            $this->comment("Applied limit: processing {$limit} of {$totalFound} found images.");
        } else {
            $this->comment("Total eligible images to scan: {$totalFound}");
        }

        $this->newLine();

        $statsByDir = [];
        foreach ($targetDirectories as $key => $config) {
            $statsByDir[$key] = [
                'label' => $config['label'],
                'scanned' => 0,
                'optimized' => 0,
                'skipped' => 0,
                'failed' => 0,
                'orig_bytes' => 0,
                'new_bytes' => 0,
                'db_updated' => 0,
            ];
        }

        $failedItems = [];

        $bar = $this->output->createProgressBar(count($collectedFiles));
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% -- %message%');
        $bar->setMessage('Starting...');
        $bar->start();

        foreach ($collectedFiles as $item) {
            $dirKey = $item['dir_key'];
            $filename = basename($item['path']);
            $bar->setMessage(substr($filename, 0, 30));

            $statsByDir[$dirKey]['scanned']++;

            $res = $optimizer->optimize($item['path'], $item['type'], dryRun: $dryRun);

            $statsByDir[$dirKey]['orig_bytes'] += ($res['original_size'] ?? 0);
            $statsByDir[$dirKey]['new_bytes'] += ($res['new_size'] ?? 0);

            if (($res['status'] ?? '') === 'optimized') {
                $statsByDir[$dirKey]['optimized']++;
                $statsByDir[$dirKey]['db_updated'] += ($res['db_updated_rows'] ?? 0);
            } elseif (($res['status'] ?? '') === 'skipped') {
                $statsByDir[$dirKey]['skipped']++;
            } else {
                $statsByDir[$dirKey]['failed']++;
                $failedItems[] = [
                    'file' => $filename,
                    'dir' => $dirKey,
                    'reason' => $res['reason'] ?? 'Unknown error',
                ];
            }

            $bar->advance();
        }

        $bar->setMessage('Complete!');
        $bar->finish();
        $this->newLine(2);

        // Render Summary Table
        $tableRows = [];
        $totalScanned = 0;
        $totalOptimized = 0;
        $totalSkipped = 0;
        $totalFailed = 0;
        $totalOrigBytes = 0;
        $totalNewBytes = 0;
        $totalDbUpdated = 0;

        foreach ($statsByDir as $key => $st) {
            $savedBytes = max(0, $st['orig_bytes'] - $st['new_bytes']);
            $savingsPct = $st['orig_bytes'] > 0 ? (($savedBytes / $st['orig_bytes']) * 100) : 0;

            $tableRows[] = [
                $st['label'],
                $st['scanned'],
                $st['optimized'],
                $st['skipped'],
                $st['failed'],
                number_format($st['orig_bytes'] / (1024 * 1024), 2) . ' MB',
                number_format($st['new_bytes'] / (1024 * 1024), 2) . ' MB',
                number_format($savedBytes / (1024 * 1024), 2) . ' MB (' . number_format($savingsPct, 1) . '%)',
                $st['db_updated'],
            ];

            $totalScanned += $st['scanned'];
            $totalOptimized += $st['optimized'];
            $totalSkipped += $st['skipped'];
            $totalFailed += $st['failed'];
            $totalOrigBytes += $st['orig_bytes'];
            $totalNewBytes += $st['new_bytes'];
            $totalDbUpdated += $st['db_updated'];
        }

        $overallSavedBytes = max(0, $totalOrigBytes - $totalNewBytes);
        $overallSavingsPct = $totalOrigBytes > 0 ? (($overallSavedBytes / $totalOrigBytes) * 100) : 0;

        $tableHeaders = ['Directory Scope', 'Scanned', 'Optimized', 'Skipped', 'Failed', 'Original Size', 'New Size', 'Saved (MB / %)', 'DB Updated'];

        $this->table($tableHeaders, $tableRows);

        $this->info(sprintf(
            "TOTAL SUMMARY: %d files scanned | %d optimized | %d skipped | %d failed | Saved: %s MB (%s%%)%s",
            $totalScanned,
            $totalOptimized,
            $totalSkipped,
            $totalFailed,
            number_format($overallSavedBytes / (1024 * 1024), 2),
            number_format($overallSavingsPct, 1),
            $dryRun ? ' [DRY-RUN]' : ''
        ));

        if (!empty($failedItems)) {
            $this->newLine();
            $this->warn("Failed files count: " . count($failedItems));
            $this->table(
                ['File', 'Directory', 'Failure Reason'],
                array_slice($failedItems, 0, 10)
            );
            if (count($failedItems) > 10) {
                $this->comment("... and " . (count($failedItems) - 10) . " more failed files.");
            }
        }

        $this->newLine();
        if ($dryRun) {
            $this->comment("Preview complete! To execute these optimizations on the server for real, run:");
            $this->line("  <info>php artisan images:optimize-existing</info>");
        } else {
            $this->info("Image optimization completed successfully!");
        }

        return self::SUCCESS;
    }
}

