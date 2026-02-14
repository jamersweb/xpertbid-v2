<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Address;
use App\Models\Country;
use App\Models\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $user->address, // Eager load in model or here
            'identity' => $user->identity_verification,
            'notificationSettings' => Notification::where("user_id", $user->id)->first(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's detailed profile (Avatar, VAT, etc.)
     * Replaces old 'updateProfile' API method
     */
    public function updateProfile(Request $request) 
    {
         $user = Auth::user();

        // Input fields validate karain
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'vat_number' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
        ]);

        if ($request->filled('country_id') && $request->country_id !== "null" && $request->country_id !== null) {
            $country = Country::find($request->country_id);
        } elseif ($request->filled('country_code') && $request->country_code !== "null" && $request->country_code !== null) {
            $country = Country::where('sortname', $request->country_code)->first();
        } else {
            $country = null;
        }

        // 2) Build the data array with always-updated fields
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            // 'usertype' => $request->usertype, // Be careful updating user type freely
            'username' => $request->username,
            'vat_number' => $request->vat_number,
            'company_name' => $request->company_name,
        ];

        // Add country_id if country exists
        if ($country) {
            $data['country_id'] = $country->id;
        }
        
        // Profile picture update handling
        if ($request->hasFile('profile_pic')) {
            $image = $request->file('profile_pic');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('/assets/images/profile/'), $imageName);
            $data['profile_pic'] = '/assets/images/profile/' . $imageName;
        }

        $user->update($data);

        // Account Change Notification email logic 
        try {
            \Mail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Profile Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        return Redirect::route('profile.edit')->with('success', 'Profile details updated.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    // Update user address
    public function updateAddress(Request $request)
    {
        $request->validate([
            'addressLine1' => 'required',
            'city' => 'required',
            'state' => 'required',
        ], [
            'addressLine1.required' => 'Please enter your street address.',
            'city.required' => 'Please enter your city.',
            'state.required' => 'Please enter your state or province.',
        ]);

        $user = Auth::user();

        $data = [
            'user_id' => $user->id, 
            'addressLine1' => $request->addressLine1,
            'addressLine2' => $request->addressLine2 ?? null,
            'city' => $request->city,
            'state' => $request->state,
            'postalCode' => $request->postalCode,
            'country' => $request->country ?? null,
            'contactNumber' => $request->contactNumber ?? null,
            'otherNumber' => $request->otherNumber ?? null,
        ];

        Address::updateOrCreate(['user_id' => $user->id], $data);

        return Redirect::route('profile.edit')->with('success', 'Address updated successfully.');
    }

    // Update password (Custom implementation or use Breeze's PasswordController)
    public function updatePassword(Request $request)
    {
        $request->validate([
            'oldPassword' => 'required',
            'newPassword' => 'required|min:8|confirmed', 
        ]);

        $user = Auth::user();
        
        if (!Hash::check($request->oldPassword, $user->password)) {
            return back()->withErrors(['oldPassword' => 'Old password is incorrect.']);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Password updated successfully.');
    }

    public function saveIdentityVerification(Request $request)
    {
        $user = Auth::user();
        $idDocs = [];

        if ($request->hasFile('id_documents')) {
            foreach ($request->file('id_documents') as $file) {
                $filename = time() . '_id_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/images/identity_verifications'), $filename);
                $idDocs[] = "assets/images/identity_verifications/{$filename}";
            }
        }

        $user->identity_verification()->updateOrCreate(
            ['user_id' => $user->id],
            array_merge(
                $request->only(['user_type', 'full_legal_name', 'dob', 'nationality', 'residential_address', 'contact_number', 'email_address']),
                [
                    'id_documents' => $idDocs,
                    'status' => $request->get('status', 'not_verified'),
                ]
            )
        );

        return Redirect::route('profile.edit')->with('success', 'Identity verification submitted.');
    }

    public function getIdentityVerification()
    {
        // Ideally pass this as a prop in edit(), but if verified via AJAX/Separate Page:
        return response()->json(Auth::user()->identity_verification ?? []);
    }
}
