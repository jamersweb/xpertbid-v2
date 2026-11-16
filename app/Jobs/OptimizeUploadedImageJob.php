<?php

namespace App\Jobs;

use App\Services\ImageOptimizerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class OptimizeUploadedImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     *
     * @param string $filePath Relative or absolute path to the stored image
     * @param string $type Target type: 'listing', 'auction', or 'category'
     * @param string|null $modelClass Optional Model class
     * @param int|null $modelId Optional Model ID
     * @param string|null $column Optional Model column
     */
    public function __construct(
        public string $filePath,
        public string $type = 'listing',
        public ?string $modelClass = null,
        public ?int $modelId = null,
        public ?string $column = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ImageOptimizerService $optimizer): void
    {
        $result = $optimizer->optimize($this->filePath, $this->type, dryRun: false);

        if (!$result['success'] && ($result['reason'] ?? '') === 'file_not_found') {
            Log::info("OptimizeUploadedImageJob: File not found or already removed: {$this->filePath}. Safely exiting.");
            return;
        }

        if (($result['status'] ?? '') === 'skipped') {
            Log::info("OptimizeUploadedImageJob: File skipped ({$result['reason']}): {$this->filePath}");
            return;
        }

        if (!$result['success']) {
            Log::warning("OptimizeUploadedImageJob failed for {$this->filePath}: " . ($result['reason'] ?? 'unknown error'));
            throw new \RuntimeException("Image optimization failed: " . ($result['reason'] ?? 'unknown'));
        }

        // If specific model/column reference was given, ensure that model's column is updated
        if ($this->modelClass && $this->modelId && $this->column && !empty($result['new_filename'])) {
            try {
                $model = $this->modelClass::find($this->modelId);
                if ($model) {
                    $currentVal = $model->getAttribute($this->column);
                    if (is_string($currentVal) && str_contains($currentVal, $result['old_filename'])) {
                        $newVal = str_replace($result['old_filename'], $result['new_filename'], $currentVal);
                        $model->update([$this->column => $newVal]);
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("OptimizeUploadedImageJob: Could not update specific model reference: " . $e->getMessage());
            }
        }

        Log::info("OptimizeUploadedImageJob completed successfully for {$this->filePath}. Saved: " . ($result['bytes_saved'] ?? 0) . " bytes.");
    }
}

