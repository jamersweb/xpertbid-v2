<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CorporateVerificationAcceptedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;

    public function __construct($verification)
    {
        $this->verification = $verification;
    }

    public function build()
    {
        return $this->subject('Corporate Verification Accepted - XpertBid')
                    ->html("<h1>Congratulations!</h1><p>Your corporate verification for <strong>{$this->verification->legal_entity_name}</strong> has been accepted.</p>");
    }
}
