<!DOCTYPE html>
<html>
<body>
    <p>Dear {{ $auction->user->name }},</p>
    <p>Congratulations! Your auction titled <strong>{{ $auction->title }}</strong> has been <b>approved</b> and is now live on XpertBid.</p>
    <p>You can now receive bids on your auction.</p>
    <p>Thank you,<br/>XpertBid Team</p>
</body>
</html>
