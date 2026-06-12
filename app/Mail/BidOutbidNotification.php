<?php

namespace App\Mail;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BidOutbidNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Listing $listing;
    public string $recipientName;
    public float $newBidAmount;
    public float $yourBidAmount;
    public string $listingUrl;

    public function __construct(Listing $listing, string $recipientName, float $newBidAmount, float $yourBidAmount, string $listingUrl)
    {
        $this->listing = $listing;
        $this->recipientName = $recipientName;
        $this->newBidAmount = $newBidAmount;
        $this->yourBidAmount = $yourBidAmount;
        $this->listingUrl = $listingUrl;
    }

    public function build()
    {
        return $this
            ->subject('You have been outbid on ' . ($this->listing->title ?? 'a listing'))
            ->view('emails.bid_outbid_notification')
            ->with([
                'listing' => $this->listing,
                'recipientName' => $this->recipientName,
                'newBidAmount' => $this->newBidAmount,
                'yourBidAmount' => $this->yourBidAmount,
                'listingUrl' => $this->listingUrl,
            ]);
    }
}
