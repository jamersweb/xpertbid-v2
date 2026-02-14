<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\IndividualVerification;
use App\Models\NewNotification;
use App\Mail\VerificationAcceptedMail;
use App\Mail\VerificationDeclinedMail;
use App\Mail\IndividualVerificationStatusUpdated;

class IndividualVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = IndividualVerification::with('user');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
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

        // Date Range filtering
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                      ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Status filtering
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'a_to_z':
                $query->orderBy('full_legal_name', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('full_legal_name', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $verifications = $query->paginate(15)->withQueryString();

        if ($request->ajax()) {
            return view('individual_verifications.table_partial', compact('verifications'))->render();
        }

        return view('individual_verifications.index', compact('verifications'));
    }

    public function edit($id)
    {
        $verification = IndividualVerification::findOrFail($id);
        return view('individual_verifications.edit', compact('verification'));
    }

    public function show($id)
    {
        return IndividualVerification::with('user')->findOrFail($id);
    }

    // Store (Create) — sends initial "submitted/not_verified" email
    public function store(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'full_legal_name'     => 'required|string',
            'dob'                 => 'required|date',
            'nationality'         => 'nullable|string',
            'residential_address' => 'required|string',
            'id_front'            => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'id_back'             => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'contact_number'      => 'required|string',
            'email_address'       => 'required|email',
            'country'             => 'required|string',
            'document_type'       => 'required|string',
        ]);

        // Ensure upload dir exists
        $dest = public_path('assets/images/individuals');
        if (! is_dir($dest)) @mkdir($dest, 0755, true);

        // Front doc (optional)
        $frontPath = null;
        if ($request->hasFile('id_front')) {
            $frontFile = $request->file('id_front');
            $frontName = time().'_front.'.$frontFile->getClientOriginalExtension();
            $frontFile->move($dest, $frontName);
            $frontPath = 'assets/images/individuals/'.$frontName;
        }

        // Back doc (optional)
        $backPath = null;
        if ($request->hasFile('id_back')) {
            $backFile = $request->file('id_back');
            $backName = time().'_back.'.$backFile->getClientOriginalExtension();
            $backFile->move($dest, $backName);
            $backPath = 'assets/images/individuals/'.$backName;
        }

        // Create
        $iv = IndividualVerification::create([
            'user_id'             => $user->id,
            'full_legal_name'     => $data['full_legal_name'],
            'dob'                 => $data['dob'],
            'nationality'         => $data['nationality'] ?? null,
            'residential_address' => $data['residential_address'],
            'id_front_path'       => $frontPath,
            'id_back_path'        => $backPath,
            'contact_number'      => $data['contact_number'],
            'email_address'       => $data['email_address'],
            'country'             => $data['country'],
            'document_type'       => $data['document_type'],
            'status'              => 'not_verified', // initial
            'decline_reason'      => null,
        ]);

        // Email (submitted/not_verified) — safe fail + admin BCC
        try {
            $recipient = $iv->email_address ?: optional($iv->user)->email;
            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(config('app.admin_email'))
                    ->send(new IndividualVerificationStatusUpdated($iv, '—', $iv->status));
                    // ->queue(...) if you prefer queues
            }
        } catch (\Throwable $e) {
            // swallow — API still returns success
        }

        return response()->json($iv, 201);
    }

    // Update (Edit) — moves to resubmit and emails if status changed
    public function update(Request $request, $id)
    {
        $iv = IndividualVerification::findOrFail($id);

        $data = $request->validate([
            'full_legal_name'     => 'required|string',
            'dob'                 => 'required|date',
            'nationality'         => 'nullable|string',
            'residential_address' => 'required|string',
            'id_front'            => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'id_back'             => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'contact_number'      => 'required|string',
            'email_address'       => 'required|email',
            'country'             => 'required|string',
            'document_type'       => 'required|string',
        ]);

        $oldStatus = (string) ($iv->status ?? '');

        // Ensure dir exists
        $dest = public_path('assets/images/individuals');
        if (! is_dir($dest)) @mkdir($dest, 0755, true);

        // Files
        if ($request->hasFile('id_front')) {
            $f  = $request->file('id_front');
            $fn = time().'_front.'.$f->getClientOriginalExtension();
            $f->move($dest, $fn);
            $iv->id_front_path = 'assets/images/individuals/'.$fn;
        }
        if ($request->hasFile('id_back')) {
            $f  = $request->file('id_back');
            $fn = time().'_back.'.$f->getClientOriginalExtension();
            $f->move($dest, $fn);
            $iv->id_back_path = 'assets/images/individuals/'.$fn;
        }

        // Scalars
        $iv->update([
            'full_legal_name'     => $data['full_legal_name'],
            'dob'                 => $data['dob'],
            'nationality'         => $data['nationality'] ?? null,
            'residential_address' => $data['residential_address'],
            'contact_number'      => $data['contact_number'],
            'email_address'       => $data['email_address'],
            'country'             => $data['country'],
            'document_type'       => $data['document_type'],
        ]);

        // Move to resubmit & clear decline reason
        $iv->status         = 'resubmit';
        $iv->decline_reason = null;
        $iv->save();

        // Email if status changed
        if ($oldStatus !== $iv->status) {
            try {
                $recipient = $iv->email_address ?: optional($iv->user)->email;
                if ($recipient) {
                    Mail::to($recipient)
                        ->bcc(config('app.admin_email'))
                        ->send(new IndividualVerificationStatusUpdated($iv, $oldStatus, $iv->status));
                }
            } catch (\Throwable $e) {
                // swallow
            }
        }

        return response()->json($iv);
    }

    // Accept — verified + email + in-app notification
    public function accept($id)
    {
        $verification = IndividualVerification::findOrFail($id);
        $verification->status = 'verified';
        $verification->save();

        // Email — safe fail + admin BCC
        try {
            $recipient = $verification->email_address ?: optional($verification->user)->email;
            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(config('app.admin_email'))
                    ->send(new VerificationAcceptedMail($verification));
                    // ->queue(new VerificationAcceptedMail($verification));
            }
        } catch (\Throwable $e) {
            // swallow
        }

        // In-app notification
        NewNotification::create([
            'user_id'   => $verification->user_id,
            'title'     => 'Verification Accepted',
            'message'   => 'Mubarak! Aapki verification accept ho chuki hai.',
            'type'      => 'wallet',
            'image_url' => NewNotification::getImageForType('wallet'),
            'read_at'   => null,
        ]);

        return back()->with('success', 'Verification accepted and user notified!');
    }

    // Decline — declined + email + in-app notification
   // Decline — declined + email + in-app notification
public function decline(Request $request, $id)
{
    $request->validate(['decline_reason' => 'required|string']);

    $verification = IndividualVerification::findOrFail($id);
    $verification->status         = 'declined';
    $verification->decline_reason = $request->input('decline_reason');
    $verification->save();

    // Email — safe fail + admin BCC
    try {
        $recipient = $verification->email_address ?: optional($verification->user)->email;
        if ($recipient) {
            Mail::to($recipient)
                ->bcc(config('app.admin_email'))
                ->send(new VerificationDeclinedMail($verification, $request->input('decline_reason')));
            // ->queue(new VerificationDeclinedMail($verification)); // (optional) queue
        }
    } catch (\Throwable $e) {
        // swallow (no hard failure for API/UI flow)
    }

    // In-app notification (user sees reason as well)
  NewNotification::create([
    'user_id'   => $verification->user_id,
    'title'     => 'Verification Declined',
    'message'   => 'Unfortunately, your verification request was declined. Reason: ' .
                    ($verification->decline_reason ?? 'Not specified') .
                    '. Please review the details and resubmit your documents for verification.',
    'type'      => 'wallet', // keep consistent with your getImageForType usage
    'image_url' => NewNotification::getImageForType('wallet'),
    'read_at'   => null,
]);

    return back()->with('success', 'Verification declined and user notified!');
}
}