<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserSignupConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public ?User $user;

    public function __construct(?User $user = null)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this
            ->subject('Welcome to XpertBid')
            ->view('emails.user_signup_confirmation')
            ->with([
                'user' => $this->user,
            ]);
    }
}
