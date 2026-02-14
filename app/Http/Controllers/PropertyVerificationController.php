<?php
namespace App\Http\Controllers;

use App\Models\PropertyVerification;
use Illuminate\Http\Request;
use App\Mail\PropertyVerificationDeclinedMail;
use App\Models\NewNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class PropertyVerificationController extends Controller
{
    // Web: list
   public function index()
    {
        // load all verifications, eager-load user if needed
        $verifications = PropertyVerification::with('user')->get();
        return view('property_verifications.index', compact('verifications'));
    }
public function show($id)
{
    $verification = PropertyVerification::with(['user','auction'])
                        ->findOrFail($id);

    return response()->json($verification);
}
public function update(Request $request, $id)
{
    $pv = PropertyVerification::findOrFail($id);

    try {
        // 1) Validate everything you want to allow
        $validated = $request->validate([
            'property_type'       => 'required|string',
            'property_address'    => 'required|string',
            'title_deed_number'   => 'required|string',
            'property_documents'  => 'sometimes|array|min:1|max:3',
            'property_documents.*'=> 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // 2) Handle new document uploads
        if ($request->hasFile('property_documents')) {
            $paths = [];
            foreach ($request->file('property_documents') as $file) {
                $paths[] = $file->store('property_verifications', 'public');
            }
            $validated['property_documents'] = $paths;
        }

        // 3) Reset status & clear decline reason
        $validated += [
            'status'         => 'resubmit',
            'decline_reason' => null,
        ];

        // 4) Perform the update
        $pv->update($validated);

        // 5) Return JSON for your Next.js form to consume
        return response()->json($pv, 200);
    }
    catch (ValidationException $ve) {
        // return JSON errors if you want your React form to show them
        return response()->json([
            'message' => 'Validation failed',
            'errors'  => $ve->errors()
        ], 422);
    }
    catch (\Exception $e) {
        Log::error("PropertyVerification update failed: {$e->getMessage()}", [
            'id'   => $pv->id,
            'user' => $pv->user_id,
        ]);
        return response()->json([
            'message' => 'Something went wrong, please try again.'
        ], 500);
    }
}

    // Web/API: accept
    public function accept(PropertyVerification $propertyVerification)
    {
        $propertyVerification->update(['status'=>'verified']);
        return redirect()
        ->route('property-verifications.index')
        ->with('success', 'Verified');
    }
public function edit($id)
{
    // load the record, eager-load user & auction if needed
    $pv = PropertyVerification::with(['user','auction'])->findOrFail($id);

    // render your Blade edit form, passing the record
    // your view might be resources/views/property_verifications/edit.blade.php
    return view('property_verifications.edit', [
        'verification' => $pv,
    ]);
}
  public function decline(Request $request, $id)
    {
        $request->validate([
            'decline_reason' => 'required|string',
        ]);

        $pv = PropertyVerification::findOrFail($id);
        $pv->update([
            'status'         => 'declined',
            'decline_reason' => $request->decline_reason,
        ]);

        // build resubmit URL for frontend edit:
     //   $frontend    = rtrim(config('app.frontend_url') ?? env('FRONTEND_URL'), '/');
        $resubmitUrl = "https://xpertbid.com/property-verify/{$pv->id}";

        // send decline email
        Mail::to($pv->user->email)
            ->send(new PropertyVerificationDeclinedMail($pv, $request->decline_reason, $resubmitUrl));

        // in-app notification
        NewNotification::create([
            'user_id'   => $pv->user_id,
            'title'     => 'Property Verification Declined',
            'message'   => "Your property verification was declined: {$request->decline_reason}",
            'type'      => 'bid',
            'image_url' => NewNotification::getImageForType('bid'),
            'read_at'   => null,
        ]);

        return redirect()
        ->route('property-verifications.index')->with('success', 'Verification declined and user notified!');
    }
    // API: store
    public function store(Request $request)
    {
        $user = $request->user() ?? abort(401,'Unauthenticated.');
        $data = $request->validate([
            'property_type'      => 'required|string',
            'property_address'   => 'required|string',
            'title_deed_number'  => 'required|string',
            'property_documents' => 'required|array|min:1|max:3',
        'property_documents.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
          'auction_id'         => 'required|exists:auctions,id',
        ]);

         $paths = [];
    foreach ($request->file('property_documents') as $file) {
        // build a unique filename
        $filename = uniqid().'_'.time().'.'.$file->getClientOriginalExtension();
        // move it into public/assets/images/property_verifications
        $file->move(
            public_path('assets/images/property_verifications'),
            $filename
        );
        // save the *publicly*accessible path
        $paths[] = 'assets/images/property_verifications/'.$filename;
    }

        $pv = PropertyVerification::create([
            'user_id'             => $user->id,
            'property_type'       => $data['property_type'],
            'property_address'    => $data['property_address'],
            'title_deed_number'   => $data['title_deed_number'],
            'property_documents'  => $paths,
            'auction_id'             => $data['auction_id'],
        ]);

        return response()->json($pv,201);
    }
       public function destroy(PropertyVerification $propertyVerification)
    {
        $propertyVerification->delete();
        return back()->with('success', 'Record deleted.');
    }
}
