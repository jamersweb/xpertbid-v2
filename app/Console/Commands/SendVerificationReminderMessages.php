<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\MsgpkService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendVerificationReminderMessages extends Command
{
    protected $signature = 'verification:send-24h-reminders';

    protected $description = 'Send verification reminder message to users who signed up 24+ hours ago and have not submitted individual/corporate verification.';

    public function handle(MsgpkService $msgpkService): int
    {
        $users = User::query()
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->where('created_at', '<=', now()->subHours(24))
            ->whereDoesntHave('individualVerification')
            ->whereDoesntHave('corporateVerification')
            ->get();

        $sentCount = 0;
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

            try {
                $sent = $msgpkService->sendMessage($phone, $message);
                if ($sent) {
                    Cache::put($cacheKey, now()->toISOString(), now()->addDays(30));
                    $sentCount++;
                } else {
                    $skippedCount++;
                }
            } catch (\Throwable $e) {
                $skippedCount++;
                Log::warning('24h verification reminder message failed', [
                    'user_id' => $user->id,
                    'phone' => $phone,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("24h verification reminders processed. Sent: {$sentCount}, Skipped: {$skippedCount}");
        return self::SUCCESS;
    }
}

