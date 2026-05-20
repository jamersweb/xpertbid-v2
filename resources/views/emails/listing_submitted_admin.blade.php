@extends('emails.layouts.master')

@section('content')
    <h1 style="color:#333333;margin-top:0;font-size:24px;">New Listing Submitted</h1>

    <p style="color:#555555;line-height:1.6;">
        A new listing has been submitted and is waiting for review.
    </p>

    <table class="info-table">
        <tr>
            <th>Seller Name</th>
            <td>{{ $sellerName }}</td>
        </tr>
        <tr>
            <th>Seller Email</th>
            <td>{{ $sellerEmail }}</td>
        </tr>
        <tr>
            <th>Listing Title</th>
            <td>{{ $listing->title }}</td>
        </tr>
        <tr>
            <th>Type</th>
            <td>{{ ucfirst(str_replace('_', ' ', (string) $listing->listing_type)) }}</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>{{ ucfirst((string) $listing->status) }}</td>
        </tr>
    </table>
@endsection

