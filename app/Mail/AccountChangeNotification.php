<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountChangeNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $changeType;
    public $timestamp;

    /**
     * Create a new message instance.
     *
     * @param string $firstName   User ka naam
     * @param string $changeType  Kis type ka change hua (e.g., Profile Updated, Password Reset)
     * @param string $timestamp   Change ka waqt
     */
    public function __construct($firstName, $changeType, $timestamp)
    {
        $this->firstName = $firstName;
        $this->changeType = $changeType;
        $this->timestamp = $timestamp;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Notice of Account Changes on XpertBid')
            ->view('emails.account_change_notification');
    }
}
