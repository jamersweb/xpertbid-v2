@extends('emails.layouts.master')

@section('content')
<p>Dear {{ $firstName }},</p>

    <p>
        We would like to inform you that the following change(s) were recently made to your XpertBid account:
    </p>

    <p>
        📝 <strong>Change Type:</strong> {{ $changeType }}
    </p>
    <p>
        🕒 <strong>Date & Time:</strong> {{ $timestamp }}
    </p>

    <p>
        If you made these changes, no action is required. If this was not authorized by you, please:
    </p>
    <ul>
        <li>Reset your password immediately.</li>
        <li>Contact our support team at <a href="mailto:support@xpertbid.com">support@xpertbid.com</a>.</li>
    </ul>

    <p>
        Maintaining your account's security and trust is our highest priority.
    </p>
    <p>Sincerely,</p>
    <p>XpertBid Security & Compliance Team</p>
@endsection
