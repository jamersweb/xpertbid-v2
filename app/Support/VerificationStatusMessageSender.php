<?php

namespace App\Support;

use App\Models\User;
use App\Services\MsgpkService;
use Illuminate\Support\Facades\Log;

class VerificationStatusMessageSender
{
    public static function sendIndividualApproved(User $user): void
    {
        self::sendToUser($user, self::approvedMessage($user->name, 'Individual'));
    }

    public static function sendIndividualDeclined(User $user, string $reason): void
    {
        self::sendToUser($user, self::declinedMessage($user->name, 'Individual', $reason));
    }

    public static function sendCorporateApproved(User $user): void
    {
        self::sendToUser($user, self::approvedMessage($user->name, 'Corporate'));
    }

    public static function sendCorporateDeclined(User $user, string $reason): void
    {
        self::sendToUser($user, self::declinedMessage($user->name, 'Corporate', $reason));
    }

    protected static function approvedMessage(?string $name, string $type): string
    {
        $firstName = trim((string) explode(' ', (string) ($name ?: 'there'))[0]);

        return "Hi {$firstName},\n\n"
            . "Great news! Your {$type} verification has been approved on XpertBid.\n\n"
            . "You can now access full seller features and continue using your account without restrictions.\n\n"
            . "Dashboard: https://xpertbid.com/dashboard";
    }

    protected static function declinedMessage(?string $name, string $type, string $reason): string
    {
        $firstName = trim((string) explode(' ', (string) ($name ?: 'there'))[0]);
        $cleanReason = trim($reason) !== '' ? trim($reason) : 'Additional details were required.';

        return "Hi {$firstName},\n\n"
            . "Your {$type} verification was declined.\n"
            . "Reason: {$cleanReason}\n\n"
            . "Please review and resubmit here:\n"
            . "https://xpertbid.com/identity-verification\n\n"
            . "Need help? Contact support and we will guide you.";
    }

    protected static function sendToUser(User $user, string $message): void
    {
        $phone = trim((string) ($user->phone ?? ''));
        if ($phone === '') {
            return;
        }

        try {
            $sent = app(MsgpkService::class)->sendMessage($phone, $message);
            if (!$sent) {
                Log::warning('Verification status message failed to send', [
                    'user_id' => $user->id,
                    'phone' => $phone,
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Verification status message exception', [
                'user_id' => $user->id,
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

