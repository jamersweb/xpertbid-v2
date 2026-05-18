<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionAcceptedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $auction;

    public function __construct($auction)
    {
        $this->auction = $auction;
    }

    public function build()
    {
        return $this->subject('Your Auction Has Been Approved!')
            ->view('emails.auction_accepted');
    }
}
