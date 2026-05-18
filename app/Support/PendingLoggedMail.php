<?php

namespace App\Support;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class PendingLoggedMail
{
    private array|string $recipients;
    private array $bcc = [];

    public function __construct(array|string $recipients)
    {
        $this->recipients = $recipients;
    }

    public function bcc(array|string|null $recipients): self
    {
        if ($recipients) {
            $this->bcc = array_merge($this->bcc, is_array($recipients) ? $recipients : [$recipients]);
        }

        return $this;
    }

    public function send(Mailable $mailable): void
    {
        try {
            $pending = Mail::to($this->recipients);

            if (!empty($this->bcc)) {
                $pending->bcc($this->bcc);
            }

            $pending->send($mailable);
        } catch (\Throwable $e) {
            EmailLogRecorder::record(
                $this->recipients,
                $this->resolveSubject($mailable),
                class_basename($mailable),
                'failed',
                $e->getMessage()
            );

            throw $e;
        }
    }

    private function resolveSubject(Mailable $mailable): ?string
    {
        try {
            $mailable->build();
            return $mailable->subject ?? null;
        } catch (\Throwable) {
            return class_basename($mailable);
        }
    }
}
