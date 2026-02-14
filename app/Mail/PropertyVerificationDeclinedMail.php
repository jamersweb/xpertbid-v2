<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PropertyVerificationDeclinedMail extends Mailable
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
        return $this->subject('Property Verification Declined - XpertBid')
                    ->html("<h1>Property Verification Declined</h1><p>Your property verification request for <strong>{$this->verification->property_address}</strong> was declined.</p><p><strong>Reason:</strong> {$this->reason}</p>");
    }
}
