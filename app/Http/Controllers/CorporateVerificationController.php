<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Support\LoggedMail as Mail;
use App\Models\CorporateVerification;
use App\Models\NewNotification;
use App\Mail\CorporateVerificationAcceptedMail;
use App\Mail\CorporateVerificationDeclinedMail;
use App\Mail\CorporateVerificationStatusUpdated;
use App\Services\KycDocumentStorage;

class CorporateVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = CorporateVerification::with('user');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('legal_entity_name', 'LIKE', "%$search%")
                    ->orWhere('id', 'LIKE', "%$search%")
                    ->orWhere('registered_address', 'LIKE', "%$search%")
                    ->orWhere('entity_type', 'LIKE', "%$search%")
                    ->orWhereHas('user', function ($uq) use ($search) {
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
                $query->orderBy('legal_entity_name', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('legal_entity_name', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $verifications = $query->paginate(15)->withQueryString();

        if ($request->ajax()) {
            return view('corporate_verifications.table_partial', compact('verifications'))->render();
        }

        return view('corporate_verifications.index', compact('verifications'));
    }

    public function edit($id)
    {
        $verification = CorporateVerification::findOrFail($id);
        return view('corporate_verifications.edit', compact('verification'));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->merge([
            'mall_id' => $request->filled('mall_id') ? $request->input('mall_id') : null,
        ]);

        $data = $request->validate([
            'legal_entity_name' => 'required|string',
            'registered_address' => 'required|string',
            'date_of_incorporation' => 'required|date',
            'entity_type' => 'required|string',
            'business_documents' => 'required|array|min:1|max:3',
            'business_documents.*' => 'file|mimes:jpg,jpeg,png,pdf|max:10240',
            'country' => 'required|string',
            'mall_id' => 'nullable|integer|exists:malls,id',
        ]);

        $kyc = app(KycDocumentStorage::class);
        $existing = CorporateVerification::where('user_id', $user->id)->first();
        $folder = 'corporate/' . $user->id;

        $relativePaths = [];
        foreach ($request->file('business_documents') as $file) {
            $relativePaths[] = $kyc->store($file, $folder);
        }

        if ($existing?->business_documents) {
            $kyc->deleteMany($existing->business_documents);
        }

        $updateData = [
            'legal_entity_name' => $data['legal_entity_name'],
            'registered_address' => $data['registered_address'],
            'date_of_incorporation' => $data['date_of_incorporation'],
            'entity_type' => $data['entity_type'],
            'country' => $data['country'],
            'mall_id' => $data['mall_id'] ?? null,
            'status' => 'not_verified',
            'decline_reason' => null,
            'business_documents' => $relativePaths,
        ];

        $cv = CorporateVerification::updateOrCreate(
            ['user_id' => $user->id],
            $updateData
        );

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Corporate verification submitted successfully.',
                'verification' => $cv,
            ]);
        }

        return redirect()->back()->with('success', 'Corporate verification submitted successfully.');
    }

    public function show($id)
    {
        return CorporateVerification::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cv = CorporateVerification::findOrFail($id);

        $request->merge([
            'mall_id' => $request->filled('mall_id') ? $request->input('mall_id') : null,
        ]);

        $data = $request->validate([
            'legal_entity_name' => 'required|string',
            'registered_address' => 'required|string',
            'date_of_incorporation' => 'required|date',
            'entity_type' => 'required|string',
            'business_documents' => 'sometimes|array|min:1|max:3',
            'business_documents.*' => 'file|mimes:jpg,jpeg,png,pdf|max:10240',
            'country' => 'required|string',
            'mall_id' => 'nullable|integer|exists:malls,id',
        ]);

        $oldStatus = (string) ($cv->status ?? '');

        if ($request->hasFile('business_documents')) {
            $kyc = app(KycDocumentStorage::class);
            $folder = 'corporate/' . $cv->user_id;

            if (is_array($cv->business_documents)) {
                $kyc->deleteMany($cv->business_documents);
            }

            $relativePaths = [];
            foreach ($request->file('business_documents') as $file) {
                $relativePaths[] = $kyc->store($file, $folder);
            }
            $cv->business_documents = $relativePaths;
        }

        // Update attributes
        $cv->update([
            'legal_entity_name' => $data['legal_entity_name'],
            'registered_address' => $data['registered_address'],
            'date_of_incorporation' => $data['date_of_incorporation'],
            'entity_type' => $data['entity_type'],
            'country' => $data['country'],
            'mall_id' => $data['mall_id'] ?? null,
        ]);

        // Mark for resubmit & clear decline reason
        $cv->status = 'resubmit';
        $cv->decline_reason = null;
        $cv->save();

        // Email if status actually changed
        $emailed = false;
        $mailError = null;
        $newStatus = (string) $cv->status;

        if ($oldStatus !== $newStatus) {
            try {
                $recipient = optional($cv->user)->email;
                if ($recipient) {
                    Mail::to($recipient)
                        ->bcc(config('app.admin_email'))
                        ->send(new CorporateVerificationStatusUpdated($cv, $oldStatus, $newStatus));
                    // ->queue(new CorporateVerificationStatusUpdated($cv, $oldStatus, $newStatus));
                    $emailed = true;
                }
            } catch (\Throwable $e) {
                $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
            }
        }

        return response()->json([
            'verification' => $cv,
            'email' => [
                'attempted' => ($oldStatus !== $newStatus),
                'sent' => $emailed,
                'error' => $mailError,
            ],
        ]);
    }

    public function destroy($id)
    {
        $verification = CorporateVerification::findOrFail($id);
        $verification->delete();

        return redirect()
            ->route('corporate-verifications.index')
            ->with('success', 'Corporate verification deleted successfully.');
    }

    public function accept($id)
    {
        $cv = CorporateVerification::findOrFail($id);
        $oldStatus = (string) ($cv->status ?? '');
        $cv->status = 'verified';
        $cv->save();

        // 1) send approval email (safe-fail + admin BCC)
        $emailed = false;
        $mailError = null;
        try {
            $recipient = optional($cv->user)->email;
            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(config('app.admin_email'))
                    ->send(new CorporateVerificationAcceptedMail($cv));
                // ->queue(new CorporateVerificationAcceptedMail($cv));
                $emailed = true;
            }
        } catch (\Throwable $e) {
            $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
        }

        // 2) in-app notification
        NewNotification::create([
            'user_id' => $cv->user_id,
            'title' => 'Corporate Verification Accepted',
            'message' => 'Congratulations! Your corporate verification has been approved.',
            'type' => 'wallet',
            'image_url' => NewNotification::getImageForType('wallet'),
            'read_at' => null,
        ]);

        return redirect()
            ->route('corporate-verifications.index')
            ->with('success', 'Corporate verification accepted and user notified!');
    }

    public function decline(Request $request, $id)
    {
        $request->validate(['decline_reason' => 'required|string']);

        $cv = CorporateVerification::findOrFail($id);
        $oldStatus = (string) ($cv->status ?? '');
        $cv->status = 'declined';
        $cv->decline_reason = $request->decline_reason;
        $cv->save();

        $resubmitUrl = 'http://xpertbid.com/corporate-verify/' . $cv->id;

        // 1) decline email (safe-fail + admin BCC)
        $emailed = false;
        $mailError = null;
        try {
            $recipient = optional($cv->user)->email;
            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(config('app.admin_email'))
                    ->send(new CorporateVerificationDeclinedMail($cv, $request->decline_reason, $resubmitUrl));
                // ->queue(new CorporateVerificationDeclinedMail(...));
                $emailed = true;
            }
        } catch (\Throwable $e) {
            $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
        }

        // 2) in-app notification
        NewNotification::create([
            'user_id' => $cv->user_id,
            'title' => 'Corporate Verification Declined',
            'message' => "Your corporate verification was declined: {$request->decline_reason}",
            'type' => 'bid',
            'image_url' => NewNotification::getImageForType('bid'),
            'read_at' => null,
        ]);

        return redirect()
            ->route('corporate-verifications.index')
            ->with('success', 'Corporate verification declined & user notified!');
    }
}
