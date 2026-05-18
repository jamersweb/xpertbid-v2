@extends('emails.layouts.master')

@section('content')
    <h1 style="color: #333333; margin-top: 0; font-size: 24px; text-align: center;">New Buy Now Inquiry</h1>

    <p style="text-align: center; font-size: 16px; color: #666;">
        Someone wants to buy an item!
    </p>

    <h3 style="color: #5356FB; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Product Information
    </h3>
    <table class="info-table">
        <tr>
            <th>Product ID</th>
            <td>#{{ $inquiry->listing_id ?? $inquiry->auction_id }}</td>
        </tr>
        <tr>
            <th>Title</th>
            <td><strong>{{ $inquiry->auction_title }}</strong></td>
        </tr>
    </table>

    <h3 style="color: #5356FB; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Customer Information
    </h3>
    <table class="info-table">
        <tr>
            <th>Name</th>
            <td>{{ $inquiry->full_name }}</td>
        </tr>
        <tr>
            <th>Email</th>
            <td><a href="mailto:{{ $inquiry->email }}" style="color: #5356FB;">{{ $inquiry->email }}</a></td>
        </tr>
        <tr>
            <th>Phone</th>
            <td><a href="tel:{{ $inquiry->phone }}" style="color: #5356FB;">{{ $inquiry->phone }}</a></td>
        </tr>
        @if($inquiry->user_id)
            <tr>
                <th>User Status</th>
                <td>Registered Member (#{{ $inquiry->user_id }})</td>
            </tr>
        @endif
    </table>

    @if($inquiry->message)
        <div
            style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 4px; margin-top: 20px;">
            <strong>Customer Message:</strong><br>
            {{ $inquiry->message }}
        </div>
    @endif

    <div style="text-align: center; margin-top: 30px;">
        <p><strong>Contact this customer as soon as possible!</strong></p>
        <a href="mailto:{{ $inquiry->email }}?subject=Re: Buy Now Inquiry - {{ $inquiry->auction_title }}"
            class="btn-primary">Reply to Customer</a>
    </div>
@endsection
