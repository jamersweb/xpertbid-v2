<?php

namespace App\Jobs;

use App\Models\Bid;
use App\Models\Listing;
use App\Services\MsgpkService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendPostVerificationInactivityReminderJob implements ShouldQueue
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
        public string $message,
        public int $verifiedAtTimestamp
    ) {}

    public function handle(MsgpkService $msgpkService): void
    {
        $cacheKey = "post_verify_inactive_reminder_sent_user_{$this->userId}_{$this->verifiedAtTimestamp}";

        // Deduplication safety check
        if (Cache::has($cacheKey)) {
            Log::info("Post-verification inactivity reminder already sent for user {$this->userId}. Skipping.");
            return;
        }

        $verifiedAt = Carbon::createFromTimestamp($this->verifiedAtTimestamp);

        // Verify again if user placed any bids or listings since verification
        $hasBidsAfterVerification = Bid::query()
            ->where('user_id', $this->userId)
            ->where('created_at', '>=', $verifiedAt)
            ->exists();

        $hasListingsAfterVerification = Listing::query()
            ->where('user_id', $this->userId)
            ->where('created_at', '>=', $verifiedAt)
            ->exists();

        if ($hasBidsAfterVerification || $hasListingsAfterVerification) {
            Log::info("User {$this->userId} placed bid or listing after verification. Skipping reminder.");
            return;
        }

        try {
            $sent = $msgpkService->sendMessage($this->phone, $this->message);

            if ($sent) {
                Cache::put($cacheKey, now()->toISOString(), now()->addDays(30));
                Log::info("Post-verification inactivity reminder sent successfully to user {$this->userId} ({$this->phone})");
            } else {
                Log::warning("Post-verification inactivity reminder gateway returned failure for user {$this->userId} ({$this->phone})");
            }
        } catch (Throwable $e) {
            Log::warning("Post-verification inactivity reminder exception for user {$this->userId}: " . $e->getMessage());
        }
    }
}

