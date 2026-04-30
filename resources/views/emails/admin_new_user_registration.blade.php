<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration</title>
</head>
<body style="margin:0; padding:0; background:#f5f7fb; font-family: Arial, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">
                    <tr>
                        <td style="background:#111827; color:#ffffff; padding:18px 22px; font-size:20px; font-weight:700;">
                            XpertBid Admin Alert
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 22px 10px;">
                            <h2 style="margin:0; font-size:22px; color:#111827;">New User Registered</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 22px 22px; font-size:15px; line-height:1.7; color:#374151;">
                            <p style="margin:0 0 8px;"><strong>Name:</strong> {{ $user->name ?? 'N/A' }}</p>
                            <p style="margin:0 0 8px;"><strong>Email:</strong> {{ $user->email ?? 'N/A' }}</p>
                            <p style="margin:0 0 8px;"><strong>Phone:</strong> {{ $user->phone ?? 'N/A' }}</p>
                            <p style="margin:0 0 8px;"><strong>Signup Source:</strong> {{ $user->signup_source ?? 'web' }}</p>
                            <p style="margin:0;"><strong>User ID:</strong> {{ $user->id }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

