<?php

namespace App\Listeners;

use App\Models\EmailLog;
use App\Models\User;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;

class LogSentEmail
{
    public function handle(MessageSent $event): void
    {
        try {
            $message = $event->message;
            $to = [];

            foreach (($message->getTo() ?? []) as $address) {
                $to[] = $address->getAddress();
            }

            if (empty($to)) {
                return;
            }

            $recipientEmail = implode(', ', $to);
            $subject = (string) $message->getSubject();
            $firstEmail = $to[0] ?? null;
            $user = $firstEmail ? User::where('email', $firstEmail)->first() : null;
            $type = $this->resolveType($event, $subject);

            $exists = EmailLog::where('recipient_email', $recipientEmail)
                ->where('subject', $subject)
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
                'status' => 'sent',
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to log sent email: ' . $e->getMessage());
        }
    }

    private function resolveType(MessageSent $event, string $subject): ?string
    {
        foreach (($event->data ?? []) as $value) {
            if ($value instanceof Mailable) {
                return class_basename($value);
            }
        }

        if (isset($event->data['__laravel_notification'])) {
            return class_basename($event->data['__laravel_notification']);
        }

        if (isset($event->data['__laravel_mailable'])) {
            return class_basename($event->data['__laravel_mailable']);
        }

        return $subject ? trim(explode('-', $subject)[0]) : null;
    }
}
