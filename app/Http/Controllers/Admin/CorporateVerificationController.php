<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use Illuminate\Http\Request;
use App\Support\LoggedMail as Mail;
use App\Models\CorporateVerification;
use App\Models\Notification as NewNotification;
use App\Mail\CorporateVerificationAcceptedMail;
use App\Mail\CorporateVerificationDeclinedMail;
use App\Support\VerificationStatusMessageSender;
use Inertia\Inertia;

class CorporateVerificationController extends Controller
{
    use StreamsCsvExports;

    public function index(Request $request)
    {
        $query = CorporateVerification::with(['user', 'mall']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('legal_entity_name', 'LIKE', "%$search%")
                  ->orWhere('registered_address', 'LIKE', "%$search%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%");
                  })
                  ->orWhereHas('mall', function ($mq) use ($search) {
                      $mq->where('name', 'LIKE', "%$search%");
                  });
            });
        }

        $verifications = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Verifications/Corporate', [
            'verifications' => $verifications,
            'filters' => $request->only(['search'])
        ]);
    }

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);
        $query = CorporateVerification::with(['user', 'mall'])
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to']);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('legal_entity_name', 'LIKE', "%{$search}%")
                    ->orWhere('registered_address', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('mall', function ($mq) use ($search) {
                        $mq->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        $verifications = $query->orderBy('created_at', 'desc')->get();
        $filename = 'corporate_verifications_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Legal Entity',
            'Entity Type',
            'Country',
            'Mall',
            'Registered Address',
            'Applicant',
            'Applicant Email',
            'Status',
            'Decline Reason',
            'Submitted At',
        ], $verifications->map(fn ($verification) => [
            $verification->id,
            $verification->legal_entity_name,
            $verification->entity_type,
            $verification->country,
            $verification->mall?->name,
            $verification->registered_address,
            $verification->user?->name,
            $verification->user?->email,
            $verification->status,
            $verification->decline_reason,
            optional($verification->created_at)->format('Y-m-d H:i:s'),
        ]));
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

        if ($cv->user) {
            VerificationStatusMessageSender::sendCorporateApproved($cv->user);
        }

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

        if ($cv->user) {
            VerificationStatusMessageSender::sendCorporateDeclined($cv->user, (string) $request->decline_reason);
        }

        return redirect()->back()->with('success', 'Corporate verification declined!');
    }
}
