<?php

namespace App\Jobs;

use App\Services\MsgpkService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendVerificationReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     * Set to 1 so if the unofficial gateway fails, it discards/cancels without infinite retries.
     */
    public int $tries = 1;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 60;

    public function __construct(
        public int $userId,
        public string $phone,
        public string $message
    ) {}

    public function handle(MsgpkService $msgpkService): void
    {
        $cacheKey = "verification_reminder_24h_sent_user_{$this->userId}";

        // Deduplication safety check
        if (Cache::has($cacheKey)) {
            Log::info("Verification reminder already sent for user {$this->userId}. Skipping.");
            return;
        }

        try {
            $sent = $msgpkService->sendMessage($this->phone, $this->message);

            if ($sent) {
                Cache::put($cacheKey, now()->toISOString(), now()->addDays(30));
                Log::info("24h verification reminder sent successfully to user {$this->userId} ({$this->phone})");
            } else {
                Log::warning("24h verification reminder gateway returned failure for user {$this->userId} ({$this->phone})");
            }
        } catch (Throwable $e) {
            Log::warning("24h verification reminder exception for user {$this->userId}: " . $e->getMessage());
        }
    }
}

