<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #28a745; margin-top: 0;">Payment Approved</h2>
        
        <p>Dear {{ $order->billing_name }},</p>
        
        <p>We are pleased to inform you that your payment for order <strong>#{{ $order->order_number }}</strong> has been approved.</p>
        
        <p>Your order is now <strong>processing</strong> and will be prepared for shipment soon. You will receive further updates regarding your order status.</p>
        
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Total Amount:</strong> {{ number_format((float) $order->total, 2) }}</p>
            <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y') }}</p>
        </div>
        
        <p>If you have any questions or concerns, please feel free to contact our support team.</p>
        
        <p>Thank you for your purchase!</p>
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>XpertBid Team</strong>
        </p>
    </div>
</body>
</html>
