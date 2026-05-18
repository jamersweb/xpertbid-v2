@extends('emails.layouts.master')

@section('content')
<h1>Identity Verification Declined</h1>

<p>Dear <strong>{{ $name }}</strong>,</p>

<p>
    Your identity verification request has been
    <span class="status-badge">Declined</span>.
</p>

<table class="info-table" role="presentation">
    <tr>
        <th>Reason</th>
        <td>{{ $reason }}</td>
    </tr>
</table>

<p>Please correct this issue and submit your documents again.</p>

<p>
    <a class="btn-primary" href="{{ $resubmitUrl }}" target="_blank" rel="noopener noreferrer">Verify Now</a>
</p>

<p>Thank you,<br><strong>XpertBid Team</strong></p>
@endsection
