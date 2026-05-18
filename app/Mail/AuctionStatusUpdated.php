<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AuctionStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $auction;
    public string $oldStatus;
    public string $newStatus;

    public function __construct($auction, string $oldStatus, string $newStatus)
    {
        $this->auction = $auction;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function build()
    {
        return $this->subject("Your listing status: {$this->newStatus}")
            ->markdown('emails.auctions.status-updated');
    }
}
