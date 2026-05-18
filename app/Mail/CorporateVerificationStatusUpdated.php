<?php

namespace App\Mail;

use App\Models\CorporateVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CorporateVerificationStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public CorporateVerification $verification;
    public string $oldStatus;
    public string $newStatus;

    public function __construct(CorporateVerification $verification, string $oldStatus, string $newStatus)
    {
        $this->verification = $verification;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function build()
    {
        return $this->subject("Your corporate verification status: {$this->newStatus}")
            ->markdown('emails.corporate.status-updated');
    }
}
