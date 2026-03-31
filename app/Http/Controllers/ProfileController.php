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
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;

class ProfileController extends Controller
{
    protected function storeOptimizedProfileImage($file): string
    {
        $directory = public_path('assets/images/profile');
        File::ensureDirectoryExists($directory);

        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($file->getRealPath());
        $image->scaleDown(width: 800, height: 800);

        $filename = time() . '_' . Str::random(12) . '.webp';
        $encoded = $image->encode(new WebpEncoder(82));
        $encoded->save($directory . DIRECTORY_SEPARATOR . $filename);

        return '/assets/images/profile/' . $filename;
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $user->shippingAddress,
            'identity' => $user->identity_verification,
            'individualVerification' => $user->individualVerification,
            'corporateVerification' => $user->corporateVerification,
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
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

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

        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'username' => $request->username,
            'vat_number' => $request->vat_number,
            'company_name' => $request->company_name,
        ];

        if ($country) {
            $data['country_id'] = $country->id;
        }

        if ($request->hasFile('profile_pic')) {
            $data['profile_pic'] = $this->storeOptimizedProfileImage($request->file('profile_pic'));
        }

        $user->update($data);

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

    /**
     * Update user address
     */
    public function updateAddress(Request $request)
    {
        $request->validate([
            'addressLine1' => 'required',
            'city' => 'required',
            'state' => 'required',
            'country' => 'required',
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

        try {
            \Mail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Address Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        return Redirect::route('profile.edit')->with('success', 'Address updated successfully.');
    }

    /**
     * Update password
     */
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

        try {
            \Mail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Password Changed', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

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
        return redirect()->route('profile.edit', ['tab' => 'identity_verification']);
    }

    public function updateNotifications(Request $request)
    {
        $user = Auth::user();
        Notification::updateOrCreate(
            ['user_id' => $user->id],
            $request->only([
                'inspiration',
                'newsletter',
                'outbid',
                'republished',
                'oneDayReminder',
                'oneHourReminder',
                'fifteenMinutesReminder'
            ])
        );

        try {
            \Mail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Notification Settings Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        return Redirect::route('profile.edit')->with('success', 'Notification preferences updated.');
    }
}
