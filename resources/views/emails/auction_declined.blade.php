<!DOCTYPE html>
<html>
<body>
    <p>Dear {{ $auction->user->name }},</p>
    <p>Your auction titled <strong>{{ $auction->title }}</strong> has been <b>declined</b> for the following reason:</p>
    <blockquote>{{ $auction->decline_reason }}</blockquote>
    <p>Please review and update your auction using the link below:</p>
    <a href="{{ $editUrl }}" style="display:inline-block;padding:10px 20px;background:#0069d9;color:#fff;text-decoration:none;border-radius:5px;">
        Edit Auction
    </a>
    <p>Thank you,<br/>XpertBid Team</p>
</body>
</html>
