<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\CorporateVerification;
use App\Models\Notification as NewNotification;
use App\Mail\CorporateVerificationAcceptedMail;
use App\Mail\CorporateVerificationDeclinedMail;
use Inertia\Inertia;

class CorporateVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = CorporateVerification::with('user');

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('legal_entity_name', 'LIKE', "%$search%")
                  ->orWhere('registered_address', 'LIKE', "%$search%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%");
                  });
            });
        }

        $verifications = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Verifications/Corporate', [
            'verifications' => $verifications,
            'filters' => $request->only(['search'])
        ]);
    }

    public function accept($id)
    {
        $cv = CorporateVerification::findOrFail($id);
        $cv->status = 'verified';
        $cv->save();

        try {
            Mail::to($cv->user->email)->send(new CorporateVerificationAcceptedMail($cv));
        } catch (\Exception $e) {}

        NewNotification::create([
            'user_id' => $cv->user_id,
            'title'   => 'Corporate Verification Accepted',
            'message' => 'Congratulations! Your corporate verification has been approved.',
            'type'    => 'wallet',
        ]);

        return redirect()->back()->with('success', 'Corporate verification accepted!');
    }

    public function decline(Request $request, $id)
    {
        $request->validate(['decline_reason' => 'required|string']);
        $cv = CorporateVerification::findOrFail($id);
        $cv->status = 'declined';
        $cv->decline_reason = $request->decline_reason;
        $cv->save();

        try {
            Mail::to($cv->user->email)->send(new CorporateVerificationDeclinedMail($cv, $request->decline_reason));
        } catch (\Exception $e) {}

        NewNotification::create([
            'user_id' => $cv->user_id,
            'title'   => 'Corporate Verification Declined',
            'message' => "Your corporate verification was declined: {$request->decline_reason}",
            'type'    => 'bid',
        ]);

        return redirect()->back()->with('success', 'Corporate verification declined!');
    }
}
