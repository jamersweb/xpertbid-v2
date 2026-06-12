@extends('emails.layouts.master')

@section('content')
<h1 style="margin:0 0 16px; color:#23262F; font-size:24px; line-height:1.3;">You have been outbid</h1>

<p style="margin:0 0 16px;">Dear {{ $recipientName }},</p>

<p style="margin:0 0 16px;">
       A new bid has been placed on <strong>{{ $listing->title ?? 'your listing' }}</strong>, and your previous bid is no longer the highest.
</p>

<table class="info-table">
       <tr>
              <th>Listing</th>
              <td>{{ $listing->title ?? 'N/A' }}</td>
       </tr>
       <tr>
              <th>Your Bid</th>
              <td>{{ number_format((float) $yourBidAmount) }} PKR</td>
       </tr>
       <tr>
              <th>New Highest Bid</th>
              <td>{{ number_format((float) $newBidAmount) }} PKR</td>
       </tr>
</table>

<p style="margin:0 0 20px;">
       Open the listing to place a higher bid if you are still interested.
</p>

<p style="margin:0 0 24px;">
       <a href="{{ $listingUrl }}" class="btn-primary">View Listing</a>
</p>

<p style="margin:0;">
       Thank you for using XpertBid.
</p>
@endsection
