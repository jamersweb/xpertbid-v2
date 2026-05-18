<?php

namespace App\Support;

use App\Models\EmailLog;
use App\Models\User;
use Illuminate\Mail\Mailable;

class EmailLogRecorder
{
    public static function sent(array|string $recipients, ?string $subject, ?string $type = null): void
    {
        self::record($recipients, $subject, $type, 'sent');
    }

    public static function failed(array|string $recipients, ?string $subject, ?string $type = null, ?\Throwable $error = null): void
    {
        self::record($recipients, $subject, $type, 'failed', $error?->getMessage());
    }

    public static function failedMailable(array|string $recipients, Mailable $mailable, ?\Throwable $error = null): void
    {
        self::record(
            $recipients,
            method_exists($mailable, 'envelope') ? null : null,
            class_basename($mailable),
            'failed',
            $error?->getMessage()
        );
    }

    public static function record(
        array|string $recipients,
        ?string $subject,
        ?string $type,
        string $status,
        ?string $failureReason = null
    ): void {
        $recipientEmail = self::normalizeRecipients($recipients);

        if ($recipientEmail === '') {
            return;
        }

        $firstEmail = explode(',', $recipientEmail)[0] ?? null;
        $firstEmail = $firstEmail ? trim($firstEmail) : null;
        $user = $firstEmail ? User::where('email', $firstEmail)->first() : null;

        $subject = $subject ?: ($type ?: 'Email Notification');

        $exists = EmailLog::where('recipient_email', $recipientEmail)
            ->where('subject', $subject)
            ->where('status', $status)
            ->where('created_at', '>=', now()->subSeconds(5))
            ->exists();

        if ($exists) {
            return;
        }

        EmailLog::create([
            'user_id' => $user?->id,
            'recipient_email' => $recipientEmail,
            'subject' => $subject,
            'type' => $type,
            'sent_at' => now(),
            'status' => $status,
            'failure_reason' => $failureReason ? mb_substr($failureReason, 0, 5000) : null,
        ]);
    }

    public static function normalizeRecipients(array|string $recipients): string
    {
        $items = is_array($recipients) ? $recipients : [$recipients];

        return collect($items)
            ->map(function ($recipient) {
                if (is_string($recipient)) {
                    return $recipient;
                }

                if (is_object($recipient) && method_exists($recipient, 'getAddress')) {
                    return $recipient->getAddress();
                }

                return null;
            })
            ->filter()
            ->map(fn ($recipient) => trim($recipient))
            ->filter()
            ->unique()
            ->implode(', ');
    }
}
