<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Store in database
       
    $contact = Contact::create($request->all());

    // Send email directly
    Mail::send([], [], function ($message) use ($contact) {
        $message->to('info@xpertbid.com')
            ->subject("New Contact: {$contact->subject}")
            ->html("
                <h1>New Contact Form Submission</h1>
                <p><strong>Name:</strong> {$contact->name}</p>
                <p><strong>Email:</strong> {$contact->email}</p>
                <p><strong>Subject:</strong> {$contact->subject}</p>
                <p><strong>Message:</strong><br>".nl2br($contact->message)."</p>
            ");
    });

        return response()->json(['message' => 'Your message has been sent successfully.'], 200);
    }
}

