<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Address;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;

class ProfileController extends Controller
{
    protected function booleanValue(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
    }

    protected function resolveLocationDisplayName(mixed $value, string $modelClass): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return $modelClass::query()->whereKey((int) $value)->value('name');
        }

        return (string) $value;
    }

    protected function serializeAddress(?Address $address): ?array
    {
        if (!$address) {
            return null;
        }

        $data = $address->toArray();
        $countryValue = $data['country'] ?? null;
        $stateValue = $data['state'] ?? null;
        $cityValue = $data['city'] ?? null;

        $data['country_id'] = is_numeric($countryValue) ? (int) $countryValue : null;
        $data['state_id'] = is_numeric($stateValue) ? (int) $stateValue : null;
        $data['city_id'] = is_numeric($cityValue) ? (int) $cityValue : null;
        $data['country_name'] = $this->resolveLocationDisplayName($countryValue, Country::class);
        $data['state_name'] = $this->resolveLocationDisplayName($stateValue, State::class);
        $data['city_name'] = $this->resolveLocationDisplayName($cityValue, City::class);

        return $data;
    }

    protected function serializeNotificationSettings(?Notification $notification): array
    {
        $settings = $notification?->toArray() ?? [];

        $outbid = $this->booleanValue($settings['outbid'] ?? false);
        $republished = $this->booleanValue($settings['republished'] ?? false);
        $oneDayReminder = $this->booleanValue($settings['oneDayReminder'] ?? false);
        $oneHourReminder = $this->booleanValue($settings['oneHourReminder'] ?? false);
        $fifteenMinutesReminder = $this->booleanValue($settings['fifteenMinutesReminder'] ?? false);
        $inspiration = $this->booleanValue($settings['inspiration'] ?? false);
        $newsletter = $this->booleanValue($settings['newsletter'] ?? false);

        return [
            'id' => $settings['id'] ?? null,
            'user_id' => $settings['user_id'] ?? null,
            'inspiration' => $inspiration,
            'newsletter' => $newsletter,
            'other_newsletters' => $newsletter,
            'outbid' => $outbid,
            'republished' => $republished,
            'oneDayReminder' => $oneDayReminder,
            'oneHourReminder' => $oneHourReminder,
            'fifteenMinutesReminder' => $fifteenMinutesReminder,
            'remind_1_day' => $oneDayReminder,
            'remind_1_hour' => $oneHourReminder,
            'remind_15_min' => $fifteenMinutesReminder,
            'biddingConditions' => [
                'outbid' => $outbid,
                'republished' => $republished,
                'oneDayReminder' => $oneDayReminder,
                'oneHourReminder' => $oneHourReminder,
                'fifteenMinutesReminder' => $fifteenMinutesReminder,
            ],
        ];
    }

    protected function extractNotificationPayload(Request $request): array
    {
        $biddingConditions = $request->input('biddingConditions', []);

        return [
            'inspiration' => $this->booleanValue($request->input('inspiration', false)),
            'newsletter' => $this->booleanValue($request->input('newsletter', $request->input('other_newsletters', false))),
            'outbid' => $this->booleanValue($request->input('outbid', data_get($biddingConditions, 'outbid', false))),
            'republished' => $this->booleanValue($request->input('republished', data_get($biddingConditions, 'republished', false))),
            'oneDayReminder' => $this->booleanValue($request->input('oneDayReminder', data_get($biddingConditions, 'oneDayReminder', $request->input('remind_1_day', false)))),
            'oneHourReminder' => $this->booleanValue($request->input('oneHourReminder', data_get($biddingConditions, 'oneHourReminder', $request->input('remind_1_hour', false)))),
            'fifteenMinutesReminder' => $this->booleanValue($request->input('fifteenMinutesReminder', data_get($biddingConditions, 'fifteenMinutesReminder', $request->input('remind_15_min', false)))),
        ];
    }

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
    public function edit(Request $request)
    {
        $user = $request->user();
        $address = $user->shippingAddress;
        $identity = $user->identity_verification;
        $individualVerification = $user->individualVerification;
        $corporateVerification = $user->corporateVerification;
        $notificationSettings = Notification::where("user_id", $user->id)->first();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'user' => $user,
                'profile' => $user,
                'address' => $this->serializeAddress($address),
                'identity' => $identity,
                'individualVerification' => $individualVerification,
                'corporateVerification' => $corporateVerification,
                'notificationSettings' => $this->serializeNotificationSettings($notificationSettings),
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => session('status'),
            ]);
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $address,
            'identity' => $identity,
            'individualVerification' => $individualVerification,
            'corporateVerification' => $corporateVerification,
            'notificationSettings' => $notificationSettings,
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
        ];

        foreach (['username', 'vat_number', 'company_name'] as $optionalField) {
            if ($request->has($optionalField) && Schema::hasColumn('users', $optionalField)) {
                $data[$optionalField] = $request->input($optionalField);
            }
        }

        if ($country) {
            $data['country_id'] = $country->id;
        }

        if ($request->hasFile('profile_pic')) {
            $data['profile_pic'] = $this->storeOptimizedProfileImage($request->file('profile_pic'));
        }

        $user->update($data);

        try {
            \App\Support\LoggedMail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Profile Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Profile details updated.',
                'user' => $user->fresh(),
            ]);
        }

        return Redirect::route('profile.edit')->with('success', 'Profile details updated.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Account closed successfully.',
            ]);
        }

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

        $address = Address::updateOrCreate(['user_id' => $user->id], $data);

        try {
            \App\Support\LoggedMail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Address Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'address' => $this->serializeAddress($address),
            ]);
        }

        return Redirect::route('profile.edit')->with('success', 'Address updated successfully.');
    }

    public function showAddress(Request $request)
    {
        return response()->json([
            'address' => $this->serializeAddress($request->user()?->shippingAddress),
        ]);
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
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Old password is incorrect.',
                ], 422);
            }
            return back()->withErrors(['oldPassword' => 'Old password is incorrect.']);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        try {
            \App\Support\LoggedMail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Password Changed', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully.',
            ]);
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
        $notification = Notification::updateOrCreate(
            ['user_id' => $user->id],
            $this->extractNotificationPayload($request)
        );

        try {
            \App\Support\LoggedMail::to($user->email)->send(new \App\Mail\AccountChangeNotification($user->name, 'Notification Settings Updated', now()->toDayDateTimeString()));
        } catch (\Exception $e) {
            \Log::error('Account change notification email failed: ' . $e->getMessage());
        }

        if ($request->expectsJson()) {
            return response()->json($this->serializeNotificationSettings($notification));
        }

        return Redirect::route('profile.edit')->with('success', 'Notification preferences updated.');
    }

    public function showNotifications(Request $request)
    {
        return response()->json(
            $this->serializeNotificationSettings(
                Notification::where('user_id', $request->user()->id)->first()
            )
        );
    }
}
