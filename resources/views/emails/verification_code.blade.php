@extends('emails.layouts.master')

@section('content')
    <h1 style="color: #333333; margin-top: 0; font-size: 24px;">Your Verification Code</h1>

    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Use the code below to verify your account or complete your action. This code is valid for a limited time.
    </p>

    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #5356FB; letter-spacing: 5px;">{{ $code }}</span>
    </div>

    <p style="color: #555555; font-size: 14px;">
        If you didn't request this code, you can safely ignore this email.
    </p>
@endsection