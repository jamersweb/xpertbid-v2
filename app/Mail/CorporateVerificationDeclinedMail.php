<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CorporateVerificationDeclinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verification;
    public $reason;

    public function __construct($verification, $reason)
    {
        $this->verification = $verification;
        $this->reason = $reason;
    }

    public function build()
    {
        return $this->subject('Corporate Verification Declined - XpertBid')
                    ->html("<h1>Corporate Verification Declined</h1><p>Your corporate verification for <strong>{$this->verification->legal_entity_name}</strong> was declined.</p><p><strong>Reason:</strong> {$this->reason}</p>");
    }
}
