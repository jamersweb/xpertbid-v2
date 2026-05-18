@extends('emails.layouts.master')

@section('content')
<h1>Congratulations!</h1>
    <p>Hello {{ $user->name }},</p>
    <p>Your listing <strong>{{ $listing->title }}</strong> has been successfully featured on our home page.</p>
    <p>Thank you for choosing XpertBid!</p>
@endsection
