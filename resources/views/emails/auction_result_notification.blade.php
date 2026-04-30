<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subjectLine ?? 'Auction Update' }}</title>
</head>
<body style="margin:0; padding:0; background:#f5f7fb; font-family: Arial, sans-serif; color:#1f2937;">
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
                        <td style="padding:24px 22px 14px;">
                            <h2 style="margin:0; font-size:22px; line-height:1.3; color:#111827;">{{ $heading ?? 'Auction Update' }}</h2>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 22px 12px; font-size:15px; line-height:1.7; color:#374151;">
                            <p style="margin:0 0 14px;">{{ $message ?? '' }}</p>
                            <p style="margin:0 0 10px;"><strong>Listing:</strong> {{ $listing->title ?? 'N/A' }}</p>
                            @if(!empty($winningBid))
                                <p style="margin:0 0 10px;"><strong>Winning Bid:</strong> {{ number_format((float) $winningBid, 2) }}</p>
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:8px 22px 24px; font-size:14px; line-height:1.7; color:#4b5563;">
                            Thank you for using XpertBid.
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:14px 22px; background:#f9fafb; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280;">
                            This is an automated email from XpertBid.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

