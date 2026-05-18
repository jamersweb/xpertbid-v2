@component('mail::message')
# Identity Verification Update

Hello {{ $identity->full_legal_name ?? 'there' }},

Your identity verification status has changed from **{{ ucfirst($oldStatus) ?: '—' }}**
to **{{ ucfirst($newStatus) }}**.

@component('mail::panel')
**Summary**
- **User type:** {{ ucfirst($identity->user_type) }}
- **Country:** {{ $identity->country ?? '—' }}
- **Email:** {{ $identity->email_address ?? '—' }}

@if ($newStatus === 'verified')
✅ **You’re verified.** You can now submit or update listings without verification holds.
@elseif ($newStatus === 'not_verified')
ℹ️ **Action may be required.** Please review your details and resubmit if needed.
@endif
@endcomponent

If you have questions, just reply to this email.

Thanks,  
**{{ config('app.name') }}**
@endcomponent
