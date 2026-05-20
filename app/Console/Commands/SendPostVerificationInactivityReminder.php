<?php

namespace App\Console\Commands;

use App\Models\Bid;
use App\Models\Listing;
use App\Models\User;
use App\Services\MsgpkService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendPostVerificationInactivityReminder extends Command
{
    protected $signature = 'verification:send-post-verify-inactivity-reminders';

    protected $description = 'Send reminder to verified users who have not placed any bid or created any listing within 24 hours of verification approval.';

    public function handle(MsgpkService $msgpkService): int
    {
        $users = User::query()
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->where(function ($query) {
                $query->whereHas('individualVerification', function ($q) {
                    $q->whereIn('status', ['verified', 'approved']);
                })->orWhereHas('corporateVerification', function ($q) {
                    $q->whereIn('status', ['verified', 'approved']);
                });
            })
            ->with(['individualVerification', 'corporateVerification'])
            ->get();

        $sentCount = 0;
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
            if (!$verifiedAt || now()->lt($verifiedAt->copy()->addHours(24))) {
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

            try {
                $sent = $msgpkService->sendMessage((string) $user->phone, $message);
                if ($sent) {
                    Cache::put($cacheKey, now()->toISOString(), now()->addDays(30));
                    $sentCount++;
                } else {
                    $skippedCount++;
                }
            } catch (\Throwable $e) {
                $skippedCount++;
                Log::warning('Post verification inactivity reminder failed', [
                    'user_id' => $user->id,
                    'phone' => $user->phone,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Post-verification inactivity reminders processed. Sent: {$sentCount}, Skipped: {$skippedCount}");
        return self::SUCCESS;
    }
}

