@php
    // Normalize album to array and pick the first image as cover
    $album = $auction->album;
    if (is_string($album)) {
        $decoded = json_decode($album, true);
        $album = is_array($decoded) ? $decoded : [];
    }
    $cover = $auction->image ?? ($album[0] ?? null);

    // If you have named route for product page, replace with route('auctions.show', $auction->slug ?? $auction->id)
    $auctionUrl = url('/product/'.($auction->slug ?? $auction->id));
@endphp

@component('mail::message')
# Auction Status Updated

Hi {{ $auction->user->name ?? 'there' }},

Your auction **“{{ $auction->title }}”** has been updated and its status changed from **{{ ucfirst($oldStatus) }}** to **{{ ucfirst($newStatus) }}**.

@if ($newStatus === 'resubmit')
> **What this means:**  
> We’ve marked this listing as **Resubmit**. Please review the details/images and submit any required corrections so we can re-approve it quickly.
@endif

@component('mail::panel')
**Summary**

- **Category:** {{ $auction->category->name ?? ('#'.$auction->category_id) }}
- **Dates:** {{ \Illuminate\Support\Carbon::parse($auction->start_date)->format('d M Y') }}
  → {{ \Illuminate\Support\Carbon::parse($auction->end_date)->format('d M Y') }}
- **Reserve Price:** {{ number_format((float)$auction->reserve_price, 2) }}
- **Minimum Bid:** {{ number_format((float)$auction->minimum_bid, 2) }}
- **Year:** {{ $auction->product_year }}
- **Location:** {{ $auction->product_location }}
@if (!empty($auction->developer))
- **Developer:** {{ $auction->developer }}
@endif
@endcomponent

@if ($cover)
<p style="text-align:center;margin:10px 0;">
  <img src="{{ url(ltrim($cover, '/')) }}" alt="Cover Image" style="max-width:100%;border-radius:8px;">
</p>
@endif

@component('mail::button', ['url' => $auctionUrl])
View / Fix Your Listing
@endcomponent

If you need help, reply to this email or contact support.

Thanks,  
**{{ config('app.name') }}**  
@endcomponent
