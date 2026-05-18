@extends('emails.layouts.master')

@section('content')
@php
    $album = $auction->album;
    if (is_string($album)) {
        $decoded = json_decode($album, true);
        $album = is_array($decoded) ? $decoded : [];
    }

    $cover = $auction->image ?? ($album[0] ?? null);
    $auctionUrl = url('/product/' . ($auction->slug ?? $auction->id));
@endphp

<h1>Auction Status Updated</h1>

<p>Dear <strong>{{ $auction->user->name ?? 'User' }}</strong>,</p>

<p>
    Your auction <strong>"{{ $auction->title }}"</strong> status has changed from
    <span class="status-badge">{{ ucfirst($oldStatus) }}</span> to
    <span class="status-badge">{{ ucfirst($newStatus) }}</span>.
</p>

@if ($newStatus === 'resubmit')
    <p>
        This listing is marked as <span class="status-badge">Resubmit</span>. Please update required details and submit again.
    </p>
@endif

<table class="info-table" role="presentation">
    <tr>
        <th>Category</th>
        <td>{{ $auction->category->name ?? ('#' . $auction->category_id) }}</td>
    </tr>
    <tr>
        <th>Dates</th>
        <td>{{ \Illuminate\Support\Carbon::parse($auction->start_date)->format('d M Y') }} to {{ \Illuminate\Support\Carbon::parse($auction->end_date)->format('d M Y') }}</td>
    </tr>
    <tr>
        <th>Reserve Price</th>
        <td>{{ number_format((float) $auction->reserve_price, 2) }}</td>
    </tr>
    <tr>
        <th>Minimum Bid</th>
        <td>{{ number_format((float) $auction->minimum_bid, 2) }}</td>
    </tr>
    <tr>
        <th>Year</th>
        <td>{{ $auction->product_year }}</td>
    </tr>
    <tr>
        <th>Location</th>
        <td>{{ $auction->product_location }}</td>
    </tr>
    @if (!empty($auction->developer))
        <tr>
            <th>Developer</th>
            <td>{{ $auction->developer }}</td>
        </tr>
    @endif
</table>

@if ($cover)
    <p style="text-align:center; margin:14px 0;">
        <img src="{{ url(ltrim($cover, '/')) }}" alt="Cover Image" style="max-width:100%; border-radius:8px;">
    </p>
@endif

<p>
    <a class="btn-primary" href="{{ $auctionUrl }}" target="_blank" rel="noopener noreferrer">View / Fix Your Listing</a>
</p>

<p>If you need help, contact support any time.</p>
@endsection
