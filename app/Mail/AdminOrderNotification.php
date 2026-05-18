<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminOrderNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        $subject = 'New Order Received - Order #' . $this->order->order_number;

        if ($this->order->is_promotion) {
            $subject .= ' (Order for featured listing)';
        }

        return $this->subject($subject)
            ->view('emails.admin_order_notification')
            ->with(['order' => $this->order]);
    }
}
