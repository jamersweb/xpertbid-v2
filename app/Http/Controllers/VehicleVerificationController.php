<?php

namespace App\Http\Controllers;

use App\Models\VehicleVerification;
use Illuminate\Http\Request;
use App\Mail\VehicleVerificationDeclinedMail;
use Illuminate\Support\Facades\Mail;
use App\Models\NewNotification;
use App\Models\User;




class VehicleVerificationController extends Controller
{
    public function index()
    {
        $verifications = VehicleVerification::with('user')->get();
        return view('vehicle_verifications.index', compact('verifications'));
    }

   public function edit(VehicleVerification $vehicleVerification)
{
    $vehicleVerification->load('auction' , 'user');  // user ke saath auction bhi load
    return view('vehicle_verifications.edit', [
      'verification' => $vehicleVerification
    ]);
}

public function store(Request $request)
{
    $user = $request->user() ?? abort(401, 'Unauthenticated.');

    $data = $request->validate([
        'vehicle_make_model'    => 'required|string',
        'year_of_manufacture'   => 'required|integer',
        'chassis_vin'           => 'required|string',
        'vehicle_documents'     => 'required|array|min:1|max:3',
        'vehicle_documents.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
         'auction_id' => 'required|exists:auctions,id',
       
    ]);

    $publicPaths = [];
    $destination = public_path('assets/images/vehicle_verifications');

    // ensure the directory exists
    if (! is_dir($destination)) {
        mkdir($destination, 0755, true);
    }

    foreach ($request->file('vehicle_documents') as $file) {
        // generate a unique filename
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        // move into public/assets/images/vehicle_verifications
        $file->move($destination, $filename);
        // record the publicly‐accessible URI
        $publicPaths[] = "assets/images/vehicle_verifications/{$filename}";
    }

    $record = VehicleVerification::create([
        'user_id'               => $user->id,
         'auction_id'         => $data['auction_id'],     
        'vehicle_make_model'    => $data['vehicle_make_model'],
        'year_of_manufacture'   => $data['year_of_manufacture'],
        'chassis_vin'           => $data['chassis_vin'],
        'vehicle_documents'     => $publicPaths,    // stored as JSON
       
        'status'                => 'not_verified',
    ]);

  return response()->json([
        'success'      => true,
        'message'      => 'Vehicle verification request submitted!',
      
    ], 201);
}
public function show($id)
{
    // Return JSON, not a Blade view, when called via API
    $verification = VehicleVerification::with(['user','auction'])
                         ->findOrFail($id);

    return response()->json($verification);
}

   public function update(Request $request, VehicleVerification $vehicleVerification)
{
    $data = $request->validate([
        'vehicle_make_model'    => 'required|string',
        'year_of_manufacture'   => 'required|integer',
        'chassis_vin'           => 'required|string',
        'vehicle_documents.*'   => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:2048',
    ]);

    // handle newly uploaded docs exactly like store()
    if ($files = $request->file('vehicle_documents')) {
        $destination = public_path('assets/images/vehicle_verifications');

        // ensure dir exists
        if (! is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        // get existing paths (array)
        $publicPaths = $vehicleVerification->vehicle_documents;
        if (is_string($publicPaths)) {
            $publicPaths = json_decode($publicPaths, true) ?: [];
        }

        // move each file & append URI
        foreach ($files as $file) {
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move($destination, $filename);
            $publicPaths[] = "assets/images/vehicle_verifications/{$filename}";
        }

        // overwrite vehicle_documents with combined array
        $data['vehicle_documents'] = $publicPaths;
    }

    // apply updates + status change
    $vehicleVerification->update(array_merge($data, [
        'status'         => 'resubmit',
        'decline_reason' => null,  // agar purana decline reason clear karna ho
    ]));

    return response()->json($vehicleVerification);
}


    public function destroy(VehicleVerification $vehicleVerification)
    {
        $vehicleVerification->delete();
        return back()->with('success','Deleted');
    }

    public function accept(VehicleVerification $vehicleVerification)
    {
        $vehicleVerification->update(['status'=>'verified']);
        
    // 2) in-app notification
    NewNotification::create([
        'user_id' => $vehicleVerification->user_id,
        'title'   => 'Vehicle Verification Approved',
         'type'      => 'bid',
        'message' => 'Good news! Your vehicle verification request (#'.$vehicleVerification->id.') has been approved.',
        // optionally: 'link' => "/vehicle-verify/{$vehicleVerification->id}"
    ]);
        return back()->with('success','Verified');
    }
public function decline(Request $request, VehicleVerification $vehicleVerification)
{
    $request->validate(['decline_reason' => 'required|string']);

    // 1) update status & reason
    $vehicleVerification->update([
        'status'         => 'declined',
        'decline_reason' => $request->decline_reason,
    ]);

    // 2) build the frontend “resubmit” URL
  
    $resubmitUrl = "https://www.xpertbid.com/vehicle-verify/{$vehicleVerification->id}";
 // 3) in-app notification
    NewNotification::create([
        'user_id' => $vehicleVerification->user_id,
        'title'   => 'Vehicle Verification Declined',
         'type'      => 'bid',
        'message' => 'Sorry, your verification (#'.$vehicleVerification->id.') was declined. Reason: '.$request->decline_reason,
        // optionally: 'link' => $resubmitUrl
    ]);
    // 3) send the mail
    Mail::to($vehicleVerification->user->email)
        ->send(new VehicleVerificationDeclinedMail(
            $vehicleVerification,
            $request->decline_reason,
            $resubmitUrl
        ));

    return back()->with('success','Declined & user notified');
}



}
