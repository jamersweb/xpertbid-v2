@extends('emails.layouts.master')

@section('content')
<h1>Corporate Verification Update</h1>

<p>Dear <strong>{{ $user->name ?? 'User' }}</strong>,</p>

<p>
    Your corporate verification status is now:
    <span class="status-badge">{{ ucfirst($status) }}</span>
</p>

@if (!empty($note))
    <table class="info-table" role="presentation">
        <tr>
            <th>Note</th>
            <td>{{ $note }}</td>
        </tr>
    </table>
@endif

@if (!empty($resubmitUrl))
    <p>
        <a class="btn-primary" href="{{ $resubmitUrl }}" target="_blank" rel="noopener noreferrer">Verify Now</a>
    </p>
@endif

<p>Thank you for using XpertBid.</p>
@endsection
