@extends('emails.layouts.master')

@section('content')
    <h1 style="color: #333333; margin-top: 0; font-size: 24px;">Your Listing is Live!</h1>

    <p style="color: #555555; font-size: 16px;">
        Dear {{ $firstName }},
    </p>

    <p style="color: #555555; line-height: 1.6;">
        We’re pleased to inform you that your auction listing has been successfully published on XpertBid.
    </p>

    <table class="info-table">
        <tr>
            <th>Listing</th>
            <td>{{ $listingTitle }}</td>
        </tr>
        <tr>
            <th>Auction Ends On</th>
            <td>{{ $auctionEnds }}</td>
        </tr>
    </table>

    <p style="color: #555555; margin-top: 20px;">
        You can track real-time views, bids, and performance metrics via your Seller Dashboard.
    </p>

    <div style="background-color: #eef2ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="color: #5356FB; font-weight: bold; margin-bottom: 15px;">🚀 Want more visibility?</p>
        <p style="margin-bottom: 20px;">Consider using a <strong>Boosted Listing</strong> to feature your lot at the top.
        </p>
        <a href="https://www.xpertbid.com/MyListings" class="btn-primary">Boost Now</a>
    </div>

    <p style="color: #888; font-size: 14px;">
        We wish you a successful sale!
    </p>
@endsection