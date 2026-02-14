<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationAcceptedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;

    public function __construct($verification)
    {
        $this->verification = $verification;
    }

    public function build()
    {
        return $this->subject('Verification Accepted - XpertBid')
                    ->html("<h1>Congratulations!</h1><p>Your verification request ({$this->verification->id}) has been accepted.</p>");
    }
}
