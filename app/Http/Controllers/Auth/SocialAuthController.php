<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->redirectUrl(route('auth.google.callback')) // Explicitly set redirect URI
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl(route('auth.google.callback')) // Must match the redirect URI
                ->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Generate referral code
                $baseName = $googleUser->getName() ?? 'Google User';
                $referralCode = strtolower(str_replace(' ', '', $baseName)) . rand(100, 999);

                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'profile_pic' => $googleUser->getAvatar(),
                    'password' => Hash::make(Str::random(16)),
                    'role' => 'User',
                    'referral_code' => $referralCode,
                    'email_verified_at' => now(), // Auto-verify email
                ]);
            } else {
                // Update existing user
                $user->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'profile_pic' => $user->profile_pic ?? $googleUser->getAvatar(),
                ]);
            }

            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }

    // Apple Login Logic (Placeholder - requires specific Apple setup)
    public function redirectToApple()
    {
        return Socialite::driver('apple')->redirect();
    }

    public function handleAppleCallback()
    {
         try {
            $appleUser = Socialite::driver('apple')->user();
            
            $user = User::where('email', $appleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name' => $appleUser->getName() ?? 'Apple User',
                    'email' => $appleUser->getEmail(),
                    'provider' => 'apple',
                    'provider_id' => $appleUser->getId(),
                    'password' => Hash::make(Str::random(16)),
                    'role' => 'User',
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Apple login failed.');
        }
    }
}
