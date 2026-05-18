<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invoice;

    public function __construct($invoice)
    {
        $this->invoice = $invoice;
    }

    public function build()
    {
        return $this->subject('Invoice from XpertBid')
            ->html(
                '<h1>Invoice</h1>' .
                '<p>Your invoice has been generated.</p>' .
                '<p><strong>Total:</strong> ' . e((string) ($this->invoice->final_cost ?? $this->invoice->total_cost ?? 'N/A')) . '</p>'
            );
    }
}
