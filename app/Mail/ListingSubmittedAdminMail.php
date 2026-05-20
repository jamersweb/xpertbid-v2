<?php

namespace App\Mail;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ListingSubmittedAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public Listing $listing;
    public string $sellerName;
    public string $sellerEmail;

    public function __construct(Listing $listing, string $sellerName, string $sellerEmail)
    {
        $this->listing = $listing;
        $this->sellerName = $sellerName;
        $this->sellerEmail = $sellerEmail;
    }

    public function build()
    {
        return $this->subject('New Listing Submitted for Review')
            ->view('emails.listing_submitted_admin');
    }
}

