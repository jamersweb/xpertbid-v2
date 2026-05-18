<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionWonNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $listingTitle;
    public $winningBidAmount;
    public $auctionEnded;
    public $completePaymentLink;

    public function __construct($firstName, $listingTitle, $winningBidAmount, $auctionEnded, $completePaymentLink)
    {
        $this->firstName = $firstName;
        $this->listingTitle = $listingTitle;
        $this->winningBidAmount = $winningBidAmount;
        $this->auctionEnded = $auctionEnded;
        $this->completePaymentLink = $completePaymentLink;
    }

    public function build()
    {
        return $this->subject('Congratulations - You Have Won the Auction!')
            ->view('emails.auction_won_notification');
    }
}
