<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use Illuminate\Http\Request;
use App\Support\LoggedMail as Mail;
use App\Models\IndividualVerification;
use App\Models\Notification as NewNotification;
use App\Mail\VerificationAcceptedMail;
use App\Mail\VerificationDeclinedMail;
use App\Mail\IndividualVerificationStatusUpdated;
use App\Support\VerificationStatusMessageSender;
use Inertia\Inertia;

class IndividualVerificationController extends Controller
{
    use StreamsCsvExports;

    public function index(Request $request)
    {
        $query = IndividualVerification::with('user');

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_legal_name', 'LIKE', "%$search%")
                  ->orWhere('id', 'LIKE', "%$search%")
                  ->orWhere('contact_number', 'LIKE', "%$search%")
                  ->orWhere('email_address', 'LIKE', "%$search%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%");
                  });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $verifications = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Verifications/Individual', [
            'verifications' => $verifications,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);
        $query = IndividualVerification::with('user')
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to']);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('full_legal_name', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('contact_number', 'LIKE', "%{$search}%")
                    ->orWhere('email_address', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $verifications = $query->orderBy('created_at', 'desc')->get();
        $filename = 'individual_verifications_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Applicant',
            'Email',
            'Phone',
            'User',
            'User Email',
            'Status',
            'Decline Reason',
            'Submitted At',
        ], $verifications->map(fn ($verification) => [
            $verification->id,
            $verification->full_legal_name,
            $verification->email_address,
            $verification->contact_number,
            $verification->user?->name,
            $verification->user?->email,
            $verification->status,
            $verification->decline_reason,
            optional($verification->created_at)->format('Y-m-d H:i:s'),
        ]));
    }

    public function accept($id)
    {
        $verification = IndividualVerification::findOrFail($id);
        $verification->status = 'verified';
        $verification->save();

        try {
            $recipient = $verification->email_address ?: optional($verification->user)->email;
            if ($recipient) {
                Mail::to($recipient)->send(new VerificationAcceptedMail($verification));
            }
        } catch (\Throwable $e) {
            \Log::error("Failed to send verification accepted mail: " . $e->getMessage());
        }

        NewNotification::create([
            'user_id'   => $verification->user_id,
            'title'     => 'Verification Accepted',
            'message'   => 'Mubarak! Aapki verification accept ho chuki hai.',
            'type'      => 'wallet',
            'read_at'   => null,
        ]);

        if ($verification->user) {
            VerificationStatusMessageSender::sendIndividualApproved($verification->user);
        }

        return redirect()->back()->with('success', 'Verification accepted and user notified!');
    }

    public function decline(Request $request, $id)
    {
        $request->validate(['decline_reason' => 'required|string']);

        $verification = IndividualVerification::findOrFail($id);
        $verification->status         = 'declined';
        $verification->decline_reason = $request->input('decline_reason');
        $verification->save();

        try {
            $recipient = $verification->email_address ?: optional($verification->user)->email;
            if ($recipient) {
                Mail::to($recipient)->send(new VerificationDeclinedMail($verification, $request->input('decline_reason')));
            }
        } catch (\Throwable $e) {
            \Log::error("Failed to send verification declined mail: " . $e->getMessage());
        }

        NewNotification::create([
            'user_id'   => $verification->user_id,
            'title'     => 'Verification Declined',
            'message'   => 'Unfortunately, your verification request was declined. Reason: ' . $verification->decline_reason,
            'type'      => 'wallet',
            'read_at'   => null,
        ]);

        if ($verification->user) {
            VerificationStatusMessageSender::sendIndividualDeclined($verification->user, (string) $verification->decline_reason);
        }

        return redirect()->back()->with('success', 'Verification declined and user notified!');
    }
}
