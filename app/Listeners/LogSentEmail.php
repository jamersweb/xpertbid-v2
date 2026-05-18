<?php

namespace App\Listeners;

use App\Support\EmailLogRecorder;
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

            $subject = (string) $message->getSubject();
            $type = $this->resolveType($event, $subject);

            EmailLogRecorder::sent($to, $subject, $type);
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
