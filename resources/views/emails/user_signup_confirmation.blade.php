@extends('emails.layouts.master')

@section('content')
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">
                    <tr>
                        <td style="background:#1d4ed8; color:#ffffff; padding:18px 22px; font-size:20px; font-weight:700;">
                            XpertBid
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 22px 10px;">
                            <h2 style="margin:0; font-size:22px; color:#111827;">Welcome to XpertBid</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 22px 22px; font-size:15px; line-height:1.7; color:#374151;">
                            <p style="margin:0 0 10px;">Hi {{ $user->name ?? 'User' }},</p>
                            <p style="margin:0 0 10px;">Your account has been created successfully.</p>
                            <p style="margin:0;">You can now start bidding, buying, and listing on XpertBid.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
@endsection
