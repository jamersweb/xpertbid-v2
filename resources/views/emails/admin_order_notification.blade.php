<!DOCTYPE html>
<html>
<head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>New Order Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto;">
       <div style="background-color: #f8f9fa; padding: 20px;">
              <h2 style="color: #23262F; text-align: center; margin-bottom: 30px;">New Order Notification</h2>

              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                @if($order->is_promotion)
                    <p style="color: #27ae60; font-weight: bold; font-size: 16px; text-align: center; border: 2px dashed #27ae60; padding: 10px; margin-bottom: 15px;">
                        Order for featured listing
                    </p>
                @endif
                     <h3 style="margin-top: 0; color: #23262F;">Order Details</h3>
                     <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                     <p><strong>Order Date:</strong>
                            {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y h:i A') }}</p>
                     <p><strong>Total Amount:</strong> {{ number_format((float) $order->total, 2) }}</p>
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
                     <h3 style="margin-top: 0; color: #23262F;">Customer Details</h3>
                     <p><strong>Name:</strong> {{ $order->billing_name }}</p>
                     <p><strong>Email:</strong> {{ $order->billing_email }}</p>
                     <p><strong>Phone:</strong> {{ $order->billing_phone }}</p>
              </div>

              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                     <h3 style="margin-top: 0; color: #23262F;">Shipping Address</h3>
                     <p>{{ $order->shipping_name }}</p>
                     <p>{{ $order->shipping_address_line1 }}</p>
                     @if($order->shipping_address_line2)
                            <p>{{ $order->shipping_address_line2 }}</p>
                     @endif
                     <p>{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_postal_code }}</p>
                     <p>{{ $order->shipping_country }}</p>
              </div>

                     <h3 style="margin-top: 0; color: #23262F;">Items Ordered</h3>
                     <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                   <tr style="border-bottom: 1px solid #eee;">
                                          <th style="text-align: left; padding: 8px;">Item</th>
                                          <th style="text-align: right; padding: 8px;">Qty</th>
                                          <th style="text-align: right; padding: 8px;">Price</th>
                                          <th style="text-align: right; padding: 8px;">Total</th>
                                   </tr>
                            </thead>
                            <tbody>
                                   @foreach($order->items as $item)
                                          <tr>
                                                 <td style="padding: 8px;">{{ $item->auction->title ?? 'Item' }} (ID:
                                                        {{ $item->listing_id }})</td>
                                                 <td style="text-align: right; padding: 8px;">{{ $item->quantity }}</td>
                                                 <td style="text-align: right; padding: 8px;">
                                                        {{ number_format((float) $item->price, 2) }}</td>
                                                 <td style="text-align: right; padding: 8px;">
                                                        {{ number_format((float) $item->subtotal, 2) }}</td>
                                          </tr>
                                   @endforeach
                            </tbody>
                            <tfoot>
                                   <tr style="border-top: 1px solid #eee;">
                                          <td colspan="3" style="text-align: right; padding: 8px;"><strong>Total:</strong></td>
                                          <td style="text-align: right; padding: 8px;"><strong>{{ number_format((float) $order->total, 2) }}</strong></td>
                                   </tr>
                            </tfoot>
                     </table>
              </div>

              <p style="margin-top: 30px;">
                     <small>This is an automated notification from XpertBid Admin System.</small>
              </p>
       </div>
</body>

</html>
