<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentDeclinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;
    public ?string $reason;

    public function __construct(Order $order, ?string $reason = null)
    {
        $this->order = $order;
        $this->reason = $reason;
    }

    public function build()
    {
        return $this->subject('Payment Declined - Order #' . $this->order->order_number)
            ->view('emails.payment_declined')
            ->with([
                'order' => $this->order,
                'reason' => $this->reason,
            ]);
    }
}
