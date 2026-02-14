<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VehicleVerificationDeclinedMail extends Mailable
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
        return $this->subject('Vehicle Verification Declined - XpertBid')
                    ->html("<h1>Vehicle Verification Declined</h1><p>Your vehicle verification request for <strong>{$this->verification->vehicle_make_model}</strong> was declined.</p><p><strong>Reason:</strong> {$this->reason}</p>");
    }
}
