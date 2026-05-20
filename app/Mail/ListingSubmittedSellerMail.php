<?php

namespace App\Mail;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ListingSubmittedSellerMail extends Mailable
{
    use Queueable, SerializesModels;

    public Listing $listing;
    public string $sellerName;

    public function __construct(Listing $listing, string $sellerName)
    {
        $this->listing = $listing;
        $this->sellerName = $sellerName;
    }

    public function build()
    {
        return $this->subject('Listing Submitted for Approval')
            ->view('emails.listing_submitted_seller');
    }
}

