<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewListingNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $firstName;
    public $listingTitle;
    public $auctionEnds;

    public function __construct($firstName, $listingTitle, $auctionEnds)
    {
        $this->firstName = $firstName;
        $this->listingTitle = $listingTitle;
        $this->auctionEnds = $auctionEnds;
    }

    public function build()
    {
        return $this->subject('Your Listing Is Now Live on XpertBid')
            ->view('emails.new_listing_notification');
    }
}
