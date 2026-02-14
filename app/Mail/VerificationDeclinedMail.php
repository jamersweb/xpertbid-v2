<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationDeclinedMail extends Mailable
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
        return $this->subject('Verification Declined - XpertBid')
                    ->html("<h1>Verification Declined</h1><p>Your verification request ({$this->verification->id}) was declined.</p><p><strong>Reason:</strong> {$this->reason}</p>");
    }
}
