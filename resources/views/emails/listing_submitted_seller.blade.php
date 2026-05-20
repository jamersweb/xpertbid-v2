@extends('emails.layouts.master')

@section('content')
    <h1 style="color:#333333;margin-top:0;font-size:24px;">Listing Submitted</h1>

    <p style="color:#555555;font-size:16px;">Dear {{ $sellerName }},</p>

    <p style="color:#555555;line-height:1.6;">
        Your listing has been submitted successfully and is now waiting for admin approval.
    </p>

    <table class="info-table">
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

    <p style="color:#888;font-size:14px;">We will notify you once review is completed.</p>
@endsection

