<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redirecting to PayFast</title>
</head>
<body>
    <p>Redirecting to PayFast for order {{ $order->order_number }}...</p>

    <form id="payfast-payment-form" method="post" action="{{ $postUrl }}">
        @foreach ($fields as $name => $value)
            <input type="hidden" name="{{ $name }}" value="{{ $value }}">
        @endforeach
    </form>

    <script>
        document.getElementById('payfast-payment-form').submit();
    </script>
</body>
</html>
