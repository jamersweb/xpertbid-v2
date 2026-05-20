<?php

namespace App\Support;

use App\Models\User;
use App\Services\MsgpkService;
use Illuminate\Support\Facades\Log;

class SignupWelcomeMessageSender
{
    public static function send(User $user): void
    {
        $phone = trim((string) ($user->phone ?? ''));
        if ($phone === '') {
            return;
        }

        $firstName = trim((string) explode(' ', (string) ($user->name ?: 'there'))[0]);
        $message = self::buildMessage($firstName);

        try {
            $sent = app(MsgpkService::class)->sendMessage($phone, $message);

            if (!$sent) {
                Log::warning('Signup welcome message failed to send', [
                    'user_id' => $user->id,
                    'phone' => $phone,
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Signup welcome message exception', [
                'user_id' => $user->id,
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected static function buildMessage(string $firstName): string
    {
        return "Hi {$firstName}, 👋\n\n"
            . "Welcome to XpertBid!\n\n"
            . "Your account is ready. You can now explore listings, place bids, and start selling with confidence.\n\n"
            . "To get started:\n"
            . "- Complete your profile\n"
            . "- Verify your account\n"
            . "- Browse live auctions and marketplace deals\n\n"
            . "Login: https://xpertbid.com/dashboard\n\n"
            . "Need help? Reply to this message and our team will assist you.";
    }
}

