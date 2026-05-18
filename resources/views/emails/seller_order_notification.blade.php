<!DOCTYPE html>
<html>

<head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>New Order for Your Items</title>
</head>

<body
       style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
       <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
              <h2 style="color: #28a745; margin-top: 0;">🎉 You have a new order!</h2>

              <p>Hello,</p>

              <p>
                     Great news! You have received a new order for your items on XpertBid.
              </p>

              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                     <h3 style="margin-top: 0; color: #23262F;">Order Info</h3>
                     <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                     <p><strong>Order Date:</strong>
                            {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y h:i A') }}</p>
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
                     <h3 style="margin-top: 0; color: #23262F;">Items to Ship</h3>
                     <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                   <tr style="border-bottom: 1px solid #eee;">
                                          <th style="text-align: left; padding: 8px;">Item</th>
                                          <th style="text-align: right; padding: 8px;">Qty</th>
                                          <th style="text-align: right; padding: 8px;">Price</th>
                                   </tr>
                            </thead>
                            <tbody>
                                   @foreach($items as $item)
                                          <tr>
                                                 <td style="padding: 8px;">{{ $item->auction->title ?? 'Item' }}</td>
                                                 <td style="text-align: right; padding: 8px;">{{ $item->quantity }}</td>
                                                 <td style="text-align: right; padding: 8px;">
                                                        {{ number_format($item->price, 2) }}</td>
                                          </tr>
                                   @endforeach
                            </tbody>
                     </table>
              </div>

              <p>Please proceed with shipping these items to the customer.</p>

              <p style="margin-top: 30px;">
                     Best regards,<br>
                     <strong>XpertBid Team</strong>
              </p>
       </div>
</body>

</html>