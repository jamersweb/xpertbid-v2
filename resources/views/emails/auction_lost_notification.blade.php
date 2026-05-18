<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Auction Ended – Your Bid Was Not the Highest</title>
</head>
<body>
    <p>Dear {{ $firstName }},</p>

    <p>
        The auction for <strong>{{ $listingTitle }}</strong> has ended. Unfortunately, your bid of <strong>{{ $yourBidAmount }}</strong> was outbid by another participant.
    </p>

    <p>We encourage you to:</p>
    <ul>
        <li>🔎 Explore Similar Listings – New lots are added daily.</li>
        <li>🔔 Set Bid Alerts – Get notified of similar opportunities.</li>
        <li>📊 Review Bidding Activity – Strategize for upcoming auctions.</li>
    </ul>

    <p>
        View your bidding history and recommendations: <a href="{{ $dashboardLink }}">{{ $dashboardLink }}</a>
    </p>

    <p>Thank you for being a valued member of XpertBid.</p>

    <p>Sincerely,</p>
    <p>XpertBid Team</p>
</body>
</html>
