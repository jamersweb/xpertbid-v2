<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionLostNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $listingTitle;
    public $yourBidAmount;
    public $dashboardLink;

    public function __construct($firstName, $listingTitle, $yourBidAmount, $dashboardLink)
    {
        $this->firstName = $firstName;
        $this->listingTitle = $listingTitle;
        $this->yourBidAmount = $yourBidAmount;
        $this->dashboardLink = $dashboardLink;
    }

    public function build()
    {
        return $this->subject('Auction Ended - Your Bid Was Not the Highest')
            ->view('emails.auction_lost_notification');
    }
}
