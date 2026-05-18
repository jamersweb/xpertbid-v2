<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionDeclinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $auction;
    public string $editUrl;

    public function __construct($auction, string $editUrl)
    {
        $this->auction = $auction;
        $this->editUrl = $editUrl;
    }

    public function build()
    {
        return $this->subject('Your Auction Has Been Declined')
            ->view('emails.auction_declined');
    }
}
