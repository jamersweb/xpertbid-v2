<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #28a745; margin-top: 0;">Order Placed Successfully!</h2>

        <p>Hello {{ $order->billing_name }},</p>

        <p>
            Thank you for your order! We have received your order and it is now being processed.
        </p>

        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #23262F;">Order Info</h3>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Order Date:</strong>
                {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y h:i A') }}</p>
            <p><strong>Payment Method:</strong>
                @if($order->payment_method === 'cod')
                    Cash on Delivery
                @elseif($order->payment_method === 'bank_transfer')
                    XpertBid Bank Transfer
                @elseif($order->payment_method === 'stripe')
                    Credit/Debit Card
                @else
                    {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}
                @endif
            </p>
            <p><strong>Payment Status:</strong>
                <span style="color: {{ $order->payment_status === 'paid' ? '#27ae60' : '#f39c12' }};">
                    {{ ucfirst($order->payment_status) }}
                </span>
            </p>
        </div>

        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #23262F;">Shipping Address</h3>
            <p><strong>{{ $order->shipping_name }}</strong></p>
            <p>{{ $order->shipping_address_line1 }}</p>
            @if($order->shipping_address_line2)
                <p>{{ $order->shipping_address_line2 }}</p>
            @endif
            <p>{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_postal_code }}</p>
            <p>{{ $order->shipping_country }}</p>
            <p><strong>Phone:</strong> {{ $order->shipping_phone }}</p>
            <p><strong>Email:</strong> {{ $order->shipping_email }}</p>
        </div>

        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #23262F;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #eee;">
                        <th style="text-align: left; padding: 8px;">Item</th>
                        <th style="text-align: right; padding: 8px;">Qty</th>
                        <th style="text-align: right; padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                        <tr>
                            <td style="padding: 8px;">{{ $item->auction->title ?? 'Item' }}</td>
                            <td style="text-align: right; padding: 8px;">{{ $item->quantity }}</td>
                            <td style="text-align: right; padding: 8px;">
                                {{ number_format((float) $item->price, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                     <tr style="border-top: 1px solid #eee;">
                        <td colspan="2" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
                        <td style="text-align: right; padding: 8px;"><strong>{{ number_format((float) $order->total, 2) }}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <p>For any queries or assistance, please reach out to our support team at <a
                href="mailto:xpertbidofficial@gmail.com">xpertbidofficial@gmail.com</a>.</p>

        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>XpertBid Team</strong>
        </p>
    </div>
</body>

</html>
