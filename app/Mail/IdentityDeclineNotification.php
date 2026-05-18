<?php

namespace App\Mail;

use App\Models\Identity;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class IdentityDeclineNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Identity $identity;
    public string $reason;
    public string $resubmitUrl;

    public function __construct(Identity $identity, ?string $reason = null, ?string $resubmitUrl = null)
    {
        $this->identity = $identity;
        $this->reason = $reason ?: (string) ($identity->decline_reason ?? 'Please review and resubmit your verification details.');
        $this->resubmitUrl = $resubmitUrl ?: rtrim(config('app.url'), '/') . '/profile?section=identity';
    }

    public function build()
    {
        return $this->subject('Your identity verification was declined')
            ->view('emails.identity_declined')
            ->with([
                'name' => $this->identity->full_legal_name ?: optional($this->identity->user)->name ?: 'there',
                'reason' => $this->reason,
                'resubmitUrl' => $this->resubmitUrl,
                'verification' => $this->identity,
            ]);
    }
}
