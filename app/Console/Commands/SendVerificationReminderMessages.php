<?php

namespace App\Console\Commands;

use App\Jobs\SendVerificationReminderJob;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SendVerificationReminderMessages extends Command
{
    protected $signature = 'verification:send-24h-reminders';

    protected $description = 'Send verification reminder message to users who signed up 24 hours ago and have not submitted individual/corporate verification.';

    public function handle(): int
    {
        $now = now();
        Cache::forever('registration_reminder_last_run_at', $now->toDateTimeString());

        // Strict 24h window (created between 24 and 25 hours ago)
        $windowStart = $now->copy()->subHours(25);
        $windowEnd = $now->copy()->subHours(24);

        $users = User::query()
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->whereBetween('created_at', [$windowStart, $windowEnd])
            ->whereDoesntHave('individualVerification')
            ->whereDoesntHave('corporateVerification')
            ->get();

        $dispatchedCount = 0;
        $skippedCount = 0;

        foreach ($users as $user) {
            $phone = trim((string) $user->phone);
            if ($phone === '') {
                $skippedCount++;
                continue;
            }

            $cacheKey = "verification_reminder_24h_sent_user_{$user->id}";
            if (Cache::has($cacheKey)) {
                $skippedCount++;
                continue;
            }

            $firstName = trim((string) explode(' ', (string) ($user->name ?: 'there'))[0]);
            $message = "Hi {$firstName},\n\n"
                . "Your XpertBid account is now 24 hours old, but your Individual or Corporate verification is still pending.\n\n"
                . "Please complete your verification to unlock full account access and continue smoothly.\n\n"
                . "Complete verification here:\n"
                . "https://xpertbid.com/identity-verification\n\n"
                . "If you need help, our support team is here for you.";

            SendVerificationReminderJob::dispatch($user->id, $phone, $message);
            $dispatchedCount++;
        }

        $this->info("24h verification reminders processed. Dispatched: {$dispatchedCount}, Skipped: {$skippedCount}");
        return self::SUCCESS;
    }
}
