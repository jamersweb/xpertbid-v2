@extends('emails.layouts.master')

@section('content')
<p>Dear {{ $firstName }},</p>

    <p>
        Congratulations! You have successfully won the auction for the following item on XpertBid:
    </p>

    <p>
        📦 <strong>Listing:</strong> {{ $listingTitle }}
    </p>
    <p>
        💰 <strong>Winning Bid Amount:</strong> {{ $winningBidAmount }}
    </p>
    <p>
        📅 <strong>Auction Ended:</strong> {{ $auctionEnded }}
    </p>

    <p>
        To complete the transaction, please proceed with payment at your earliest convenience. Once payment is confirmed, our team will initiate the shipping process and provide tracking details.
    </p>

    <p>
        <a href="{{ $completePaymentLink }}" class="payment-button">Complete Payment</a>
    </p>

    <p>
        For any queries or assistance, please reach out to <a href="mailto:support@xpertbid.com">support@xpertbid.com</a>. Thank you for participating in the XpertBid marketplace.
    </p>

    <p>Kind regards,</p>
    <p>XpertBid Customer Success Team</p>
@endsection
