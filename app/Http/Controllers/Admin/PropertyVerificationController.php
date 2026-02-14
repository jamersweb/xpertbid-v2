<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\PropertyVerification;
use App\Models\Notification as NewNotification;
use App\Mail\PropertyVerificationDeclinedMail;
use Inertia\Inertia;

class PropertyVerificationController extends Controller
{
    public function index()
    {
        $verifications = PropertyVerification::with(['user', 'auction'])->orderBy('created_at', 'desc')->paginate(15);
        return Inertia::render('Admin/Verifications/Property', [
            'verifications' => $verifications
        ]);
    }

    public function accept($id)
    {
        $verification = PropertyVerification::findOrFail($id);
        $verification->status = 'verified';
        $verification->save();

        NewNotification::create([
            'user_id' => $verification->user_id,
            'title'   => 'Property Verification Approved',
            'message' => 'Good news! Your property verification request (#' . $verification->id . ') has been approved.',
            'type'    => 'bid',
        ]);

        return redirect()->back()->with('success', 'Verified');
    }

    public function decline(Request $request, $id)
    {
        $request->validate(['decline_reason' => 'required|string']);
        $verification = PropertyVerification::findOrFail($id);
        $verification->status = 'declined';
        $verification->decline_reason = $request->decline_reason;
        $verification->save();

        try {
            Mail::to($verification->user->email)->send(new PropertyVerificationDeclinedMail($verification, $request->decline_reason));
        } catch (\Exception $e) {}

        NewNotification::create([
            'user_id' => $verification->user_id,
            'title'   => 'Property Verification Declined',
            'message' => 'Sorry, your verification (#' . $verification->id . ') was declined. Reason: ' . $request->decline_reason,
            'type'    => 'bid',
        ]);

        return redirect()->back()->with('success', 'Declined');
    }
}
