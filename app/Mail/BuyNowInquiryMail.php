<?php

namespace App\Mail;

use App\Models\BuyNowInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BuyNowInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public BuyNowInquiry $inquiry;

    public function __construct(BuyNowInquiry $inquiry)
    {
        $this->inquiry = $inquiry;
    }

    public function build()
    {
        return $this->subject('New Buy Now Inquiry - ' . $this->inquiry->auction_title)
            ->view('emails.buy-now-inquiry')
            ->with(['inquiry' => $this->inquiry]);
    }
}
