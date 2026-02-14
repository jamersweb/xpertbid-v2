<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Identity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\IdentityDeclineNotification;
use Validator;
use App\Mail\IdentityStatusUpdated;

class IdentityController extends Controller
{
  public function index()
  {
      $identities = Identity::latest()->paginate(10);
      return view('identity.index', compact('identities'));
  }  
  public function edit($id)
{
    $identity = Identity::findOrFail($id);
    $countries = config('constants.countries'); // Or use DB source if dynamic

    return view('identity.edit', compact('identity', 'countries'));
}
   public function get_identity(Request $request)
{	
    $user_id = Auth::id();
    $identity = Identity::where('user_id',$user_id)->first();
    $countries = config('constants.countries'); // Or use DB source if dynamic

    return response()->json([
            "identity" => $identity,
      		"countries" => $countries
        ], 200);
}

public function store(Request $request)
{
    // 1) Validation rules
    $rules = [
        "user_type"             => "required|in:individual,corporate",
        // Individual fields
        "full_legal_name"       => "required_if:user_type,individual",
        "dob"                   => "required_if:user_type,individual|date",
        "nationality"           => "required_if:user_type,individual",
        "residential_address"   => "required_if:user_type,individual",
        "contact_number"        => "required_if:user_type,individual",
        "email_address"         => "required_if:user_type,individual|email",
        "id_documents.*"        => "file|mimes:jpg,jpeg,png",
        // Corporate fields
        "legal_entity_name"     => "required_if:user_type,corporate",
        "registered_address"    => "required_if:user_type,corporate",
        "date_of_incorporation" => "required_if:user_type,corporate|date",
        "entity_type"           => "required_if:user_type,corporate",
        "business_documents.*"  => "file|mimes:jpg,jpeg,png,pdf",
        // Listing fields
      
        // Vehicle
        "vehicle_make_model"    => "required_if:listing_type,vehicle",
        "year_of_manufacture"   => "required_if:listing_type,vehicle|integer",
        "chassis_vin"           => "required_if:listing_type,vehicle",
        "vehicle_documents.*"   => "file|mimes:jpg,jpeg,png,pdf",
        // Property
        "property_type"         => "required_if:listing_type,property",
        "property_address"      => "required_if:listing_type,property",
        "title_deed_number"     => "required_if:listing_type,property",
        "property_documents.*"  => "file|mimes:jpg,jpeg,png,pdf",
        // Location
        "country"               => "required",
    ];

    // 2) Custom user-friendly messages
    $messages = [
        'user_type.required'             => 'Please select whether you’re registering as an individual or a company.',
        'user_type.in'                   => 'User type must be either “individual” or “corporate”.',

        // Individual
        'full_legal_name.required_if'    => 'Please enter your full legal name.',
        'dob.required_if'                => 'Please enter your date of birth.',
        'dob.date'                       => 'Date of birth must be a valid date.',
        'nationality.required_if'        => 'Please select your nationality.',
        'residential_address.required_if'=> 'Please enter your residential address.',
        'contact_number.required_if'     => 'Please enter your contact number.',
        'email_address.required_if'      => 'Please enter your email address.',
        'email_address.email'            => 'Please enter a valid email address.',
        'id_documents.*.file'            => 'Each ID document must be a file.',
        'id_documents.*.mimes'           => 'ID documents must be a jpg, jpeg, or png image.',

        // Corporate
        'legal_entity_name.required_if'      => 'Please enter your company’s legal name.',
        'registered_address.required_if'     => 'Please enter your company’s registered address.',
        'date_of_incorporation.required_if'  => 'Please enter the date your company was incorporated.',
        'date_of_incorporation.date'         => 'Date of incorporation must be a valid date.',
        'entity_type.required_if'            => 'Please select your business entity type.',
        'business_documents.*.file'          => 'Each business document must be a file.',
        'business_documents.*.mimes'         => 'Business documents must be jpg, jpeg, png, or pdf.',


        // Vehicle
        'vehicle_make_model.required_if'     => 'Please enter your vehicles make and model.',
        'year_of_manufacture.required_if'    => 'Please enter the year of manufacture.',
        'year_of_manufacture.integer'        => 'Year of manufacture must be a number.',
        'chassis_vin.required_if'            => 'Please enter your chassis/VIN number.',
        'vehicle_documents.*.file'           => 'Each vehicle document must be a file.',
        'vehicle_documents.*.mimes'          => 'Vehicle documents must be jpg, jpeg, png, or pdf.',

        // Property
        'property_type.required_if'          => 'Please select the property type.',
        'property_address.required_if'       => 'Please enter the property address.',
        'title_deed_number.required_if'      => 'Please enter the title deed number.',
        'property_documents.*.file'          => 'Each property document must be a file.',
        'property_documents.*.mimes'         => 'Property documents must be jpg, jpeg, png, or pdf.',

        // Location
        'country.required'                   => 'Please select your country.',
    ];

    // 3) Run validation
    $validator = Validator::make($request->all(), $rules, $messages);
    if ($validator->fails()) {
        return response()->json([
            "errors" => $validator->errors()
        ], 422);
    }

        // 2) Collect validated scalar fields
        $data = $request->only([
            "user_type", "full_legal_name", "dob", "nationality",
            "residential_address", "contact_number", "email_address",
            "legal_entity_name", "registered_address", "date_of_incorporation",
            "entity_type",  "vehicle_make_model",
            "year_of_manufacture", "chassis_vin", "property_type",
            "property_address", "title_deed_number", "country",
        ]);

        // 3) Move **all** file‐arrays into the same folder
        $uploadDir = public_path('assets/images/identity_verifications');
        // ensure directory exists
        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        foreach ([
            'id_documents',
            'business_documents',
            'vehicle_documents',
            'property_documents',
        ] as $field) {
            if ($request->hasFile($field)) {
                $paths = [];
                foreach ($request->file($field) as $file) {
                    $filename = time()
                              . "_{$field}_"
                              . Str::random(8)
                              . '.' . $file->getClientOriginalExtension();
                    $file->move($uploadDir, $filename);
                    // store **public**‑relative path
                    $paths[] = "assets/images/identity_verifications/{$filename}";
                }
                $data[$field] = $paths;
            }
        }

        // 4) Persist
        $data['user_id'] = Auth::id();
        $data['status']  = 'not_verified';

        $identity = Identity::create($data);
		try {
        $recipient = $identity->email_address ?: optional($identity->user)->email;
        if ($recipient) {
            // From: not_verified → submitted/not_verified (same template still works)
            Mail::to($recipient)
                ->bcc(env('ADMIN_EMAIL'))
                ->send(new IdentityStatusUpdated($identity, '—', $identity->status));
            // ->queue(...)
        }
    } catch (\Throwable $e) {
        // swallow
    }
        return response()->json([
            "message"  => "Identity details saved successfully",
            "identity" => $identity,
        ], 200);
    }
  
public function update(Request $request, $id)
{
    $identity = Identity::findOrFail($id);

    // Capture old status for email diffing
    $oldStatus = (string) ($identity->status ?? '');
    $action    = $request->input('action');
    $emailed   = false;
    $mailError = null;

    if ($action === 'accept') {
        // Admin clicked Approve
        $identity->status         = 'verified';
        $identity->decline_reason = null;
        $identity->save();

        // Email only if status changed
        if ($oldStatus !== $identity->status) {
            try {
                $recipient = $identity->email_address ?: optional($identity->user)->email;
                if ($recipient) {
                    Mail::to($recipient)
                        ->bcc(config('app.admin_email'))
                        ->send(new IdentityStatusUpdated($identity, $oldStatus, $identity->status));
                        // ->queue(new IdentityStatusUpdated(...)); // use queue if desired
                    $emailed = true;
                }
            } catch (\Throwable $e) {
                $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
            }
        }

        return redirect()
            ->route('identities.index')
            ->with('success', 'Identity approved successfully.');

    } elseif ($action === 'decline') {
        $request->validate([
            'decline_reason' => 'required|string',
        ]);

        $identity->status         = 'not_verified';
        $identity->decline_reason = $request->input('decline_reason');
        $identity->save();

        // Decline email (with admin BCC) — safe fail
        try {
            $recipient = $identity->email_address ?: optional($identity->user)->email;
            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(env('ADMIN_EMAIL'))
                    ->send(new IdentityDeclineNotification($identity));
                    // ->queue(new IdentityDeclineNotification($identity));
                $emailed = true;
            }
        } catch (\Throwable $e) {
            $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
        }

        return redirect()
            ->route('identities.edit', $identity->id)
            ->with('success', 'Decline reason sent and status updated.');

    } else {
        // Fallback: original single-status workflow
        $request->validate([
            'status' => 'required|in:verified,not_verified',
        ]);
        $identity->status = $request->input('status');
        $identity->save();

        // Email only if status changed
        if ($oldStatus !== $identity->status) {
            try {
                $recipient = $identity->email_address ?: optional($identity->user)->email;
                if ($recipient) {
                    Mail::to($recipient)
                        ->bcc(env('ADMIN_EMAIL'))
                        ->send(new IdentityStatusUpdated($identity, $oldStatus, $identity->status));
                    $emailed = true;
                }
            } catch (\Throwable $e) {
                $mailError = config('app.debug') ? $e->getMessage() : 'mail_failed';
            }
        }

        return redirect()
            ->route('identities.index')
            ->with('success', 'Identity updated successfully.');
    }
}



}
