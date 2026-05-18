@extends('emails.layouts.master')

@section('title', 'XpertBid Email Template Preview')

@section('content')
       <h1>XpertBid Email Template Preview</h1>

       <p>
              Dear <strong>[user_name]</strong>,
       </p>

       <p>
              This preview route lets you check the email header, content area, footer logo, and social links without sending an email.
       </p>

       <p>
              Header logo is aligned to the left. Footer logo is centered, with social links below it.
       </p>

       <a href="{{ config('app.url') ?: url('/') }}" class="btn-primary" target="_blank" rel="noopener noreferrer">View XpertBid</a>

       <table class="info-table" role="presentation">
              <tr>
                     <th>Template</th>
                     <td>Header/Footer Preview</td>
              </tr>
              <tr>
                     <th>Status</th>
                     <td><span class="status-badge">Ready</span></td>
              </tr>
              <tr>
                     <th>Verification</th>
                     <td><span class="status-badge">Pending</span></td>
              </tr>
       </table>
@endsection
