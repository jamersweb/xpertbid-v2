@extends('emails.layouts.master')

@section('content')
<div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h2 style="color: #dc3545; margin-top: 0;">Payment Declined</h2>
        
        <p>Dear {{ $order->billing_name }},</p>
        
        <p>We regret to inform you that your order <strong>#{{ $order->order_number }}</strong> and payment have been rejected.</p>
        
        @if($reason)
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0;"><strong>Reason:</strong></p>
            <p style="margin: 5px 0 0 0;">{{ $reason }}</p>
        </div>
        @endif
        
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Total Amount:</strong> {{ number_format((float) $order->total, 2) }}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y') }}</p>
        </div>
        
        <p>For more information or if you have any questions regarding this decision, please contact XpertBid support team. We are here to assist you.</p>
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>XpertBid Team</strong>
        </p>
    </div>
@endsection
