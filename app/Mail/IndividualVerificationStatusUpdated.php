<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class IndividualVerificationStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;
    public $oldStatus;
    public $newStatus;

    public function __construct($verification, $oldStatus, $newStatus)
    {
        $this->verification = $verification;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function build()
    {
        return $this->subject('Verification Status Updated - XpertBid')
                    ->html("<h1>Verification Status Updated</h1><p>Your verification request status has changed from <strong>{$this->oldStatus}</strong> to <strong>{$this->newStatus}</strong>.</p>");
    }
}
