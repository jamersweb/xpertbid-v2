<?php

namespace App\Console\Commands;

use App\Jobs\SendPostVerificationInactivityReminderJob;
use App\Models\Bid;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SendPostVerificationInactivityReminder extends Command
{
    protected $signature = 'verification:send-post-verify-inactivity-reminders';

    protected $description = 'Send reminder to verified users who have not placed any bid or created any listing within 24 hours of verification approval.';

    public function handle(): int
    {
        $now = now();
        Cache::forever('post_verify_reminder_last_run_at', $now->toDateTimeString());

        // Strict 24h window (verified between 24 and 25 hours ago)
        $windowStart = $now->copy()->subHours(25);
        $windowEnd = $now->copy()->subHours(24);

        $users = User::query()
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->where(function ($query) use ($windowStart, $windowEnd) {
                $query->whereHas('individualVerification', function ($q) use ($windowStart, $windowEnd) {
                    $q->whereIn('status', ['verified', 'approved'])
                        ->whereBetween('updated_at', [$windowStart, $windowEnd]);
                })->orWhereHas('corporateVerification', function ($q) use ($windowStart, $windowEnd) {
                    $q->whereIn('status', ['verified', 'approved'])
                        ->whereBetween('updated_at', [$windowStart, $windowEnd]);
                });
            })
            ->with(['individualVerification', 'corporateVerification'])
            ->get();

        $dispatchedCount = 0;
        $skippedCount = 0;

        foreach ($users as $user) {
            $individual = $user->individualVerification;
            $corporate = $user->corporateVerification;

            $timestamps = collect([
                $individual && in_array(strtolower((string) $individual->status), ['verified', 'approved'], true) ? $individual->updated_at : null,
                $corporate && in_array(strtolower((string) $corporate->status), ['verified', 'approved'], true) ? $corporate->updated_at : null,
            ])->filter();

            if ($timestamps->isEmpty()) {
                $skippedCount++;
                continue;
            }

            $verifiedAt = $timestamps->max();
            if (!$verifiedAt || $verifiedAt->lt($windowStart) || $verifiedAt->gt($windowEnd)) {
                $skippedCount++;
                continue;
            }

            $cacheKey = "post_verify_inactive_reminder_sent_user_{$user->id}_{$verifiedAt->timestamp}";
            if (Cache::has($cacheKey)) {
                $skippedCount++;
                continue;
            }

            $hasBidsAfterVerification = Bid::query()
                ->where('user_id', $user->id)
                ->where('created_at', '>=', $verifiedAt)
                ->exists();

            $hasListingsAfterVerification = Listing::query()
                ->where('user_id', $user->id)
                ->where('created_at', '>=', $verifiedAt)
                ->exists();

            if ($hasBidsAfterVerification || $hasListingsAfterVerification) {
                $skippedCount++;
                continue;
            }

            $firstName = trim((string) explode(' ', (string) ($user->name ?: 'there'))[0]);
            $message = "Hi {$firstName},\n\n"
                . "Your account was verified 24 hours ago, but you have not placed any bid or created any listing yet.\n\n"
                . "Start now to get the most out of XpertBid:\n"
                . "- Place your first bid\n"
                . "- Create your first listing\n\n"
                . "Go to: https://xpertbid.com/dashboard";

            SendPostVerificationInactivityReminderJob::dispatch(
                $user->id,
                (string) $user->phone,
                $message,
                $verifiedAt->timestamp
            );
            $dispatchedCount++;
        }

        $this->info("Post-verification inactivity reminders processed. Dispatched: {$dispatchedCount}, Skipped: {$skippedCount}");
        return self::SUCCESS;
    }
}
