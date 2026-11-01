@extends('emails.layouts.master')

@section('content')
<h1 style="margin:0 0 16px; color:#23262F; font-size:24px; line-height:1.3;">{{ $heading }}</h1>

<p style="margin:0 0 16px;">Hi {{ $recipientName }},</p>

@foreach ($paragraphs as $paragraph)
    <p style="margin:0 0 16px;">{{ $paragraph }}</p>
@endforeach

@if (!empty($details))
    <table class="info-table">
        @foreach ($details as $label => $value)
            <tr>
                <th>{{ $label }}</th>
                <td>{{ $value }}</td>
            </tr>
        @endforeach
    </table>
@endif

<p style="margin:0 0 24px;">
    <a href="{{ $ctaUrl }}" class="btn-primary">{{ $ctaLabel }}</a>
</p>

<p style="margin:0 0 12px; font-size:13px; color:#6b7280; word-break:break-all;">
    <a href="{{ $ctaUrl }}">{{ $ctaUrl }}</a>
</p>

@if (!empty($secondaryUrl) && !empty($secondaryLabel))
    <p style="margin:0 0 24px; font-size:14px;">
        <a href="{{ $secondaryUrl }}">{{ $secondaryLabel }}</a>
    </p>
@endif

<p style="margin:0;">— XpertBid Team</p>
@endsection
