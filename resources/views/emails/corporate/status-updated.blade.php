@component('mail::message')
# Corporate Verification Status Updated

Hello {{ $verification->user->name ?? 'there' }},

Your corporate verification status changed from **{{ ucfirst($oldStatus) ?: '—' }}** to **{{ ucfirst($newStatus) }}**.

@component('mail::panel')
**Company:** {{ $verification->legal_entity_name }}  
**Country:** {{ $verification->country }}
@endcomponent

@if ($newStatus === 'resubmit')
Please review and re-submit the required documents to complete verification.
@endif

Thanks,  
**{{ config('app.name') }}**
@endcomponent
