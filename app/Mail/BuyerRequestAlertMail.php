<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BuyerRequestAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subjectLine,
        public string $recipientName,
        public string $heading,
        public array $paragraphs,
        public array $details,
        public string $ctaLabel,
        public string $ctaUrl,
        public ?string $secondaryLabel = null,
        public ?string $secondaryUrl = null,
    ) {
    }

    public function build()
    {
        return $this
            ->subject($this->subjectLine)
            ->view('emails.buyer_request_alert')
            ->with([
                'recipientName' => $this->recipientName,
                'heading' => $this->heading,
                'paragraphs' => $this->paragraphs,
                'details' => $this->details,
                'ctaLabel' => $this->ctaLabel,
                'ctaUrl' => $this->ctaUrl,
                'secondaryLabel' => $this->secondaryLabel,
                'secondaryUrl' => $this->secondaryUrl,
            ]);
    }
}
