<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AdminNewUserRegistration;
use App\Mail\UserSignupConfirmation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Support\AuthBridge;
use App\Support\LoggedMail as Mail;
use App\Support\SignupWelcomeMessageSender;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    protected function ensureEmailVerified(User $user): void
    {
        if (!$user->hasVerifiedEmail()) {
            $user->forceFill([
                'email_verified_at' => now(),
            ])->save();
        }
    }

    protected function resolveSignupSource($request, string $default = 'web'): string
    {
        return $request->input('signup_source')
            ?? $request->query('signup_source')
            ?? $request->header('X-Client-Source')
            ?? session('signup_source')
            ?? $default;
    }

    protected function adminEmail(): ?string
    {
        return env('ADMIN_EMAIL') ?: config('mail.from.address');
    }

    public function redirectToGoogle()
    {
        $request = request();
        session([
            'signup_source' => $this->resolveSignupSource($request),
            'oauth_return_to' => $this->resolveReturnTo($request),
        ]);

        return Socialite::driver('google')
            ->redirectUrl($this->googleRedirectUri())
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl($this->googleRedirectUri())
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
                    'signup_source' => $this->resolveSignupSource(request()),
                    'email_verified_at' => now(), // Auto-verify email
                ]);

                SignupWelcomeMessageSender::send($user);

                try {
                    Mail::to($user->email)->send(new UserSignupConfirmation($user));
                } catch (\Throwable $e) {
                    Log::warning('Google signup user email failed', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                }

                $adminEmail = $this->adminEmail();
                if (!empty($adminEmail)) {
                    try {
                        Mail::to($adminEmail)->send(new AdminNewUserRegistration($user));
                    } catch (\Throwable $e) {
                        Log::warning('Google signup admin email failed', [
                            'user_id' => $user->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            } else {
                // Update existing user
                $user->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'profile_pic' => $user->profile_pic ?? $googleUser->getAvatar(),
                ]);
            }

            $this->ensureEmailVerified($user);
            Auth::login($user);

            $returnTo = session('oauth_return_to');
            session()->forget(['signup_source', 'oauth_return_to']);

            if ($returnTo) {
                $plain = $user->createToken('property_web')->plainTextToken;
                $separator = str_contains($returnTo, '?') ? '&' : '?';

                return redirect()->away($returnTo.$separator.'auth_token='.urlencode($plain));
            }

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }

    // Apple Login Logic (Placeholder - requires specific Apple setup)
    public function redirectToApple()
    {
        session(['signup_source' => $this->resolveSignupSource(request())]);
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
                    'signup_source' => $this->resolveSignupSource(request()),
                    'email_verified_at' => now(),
                ]);

                SignupWelcomeMessageSender::send($user);

                if (!empty($user->email)) {
                    try {
                        Mail::to($user->email)->send(new UserSignupConfirmation($user));
                    } catch (\Throwable $e) {
                        Log::warning('Apple signup user email failed', [
                            'user_id' => $user->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                $adminEmail = $this->adminEmail();
                if (!empty($adminEmail)) {
                    try {
                        Mail::to($adminEmail)->send(new AdminNewUserRegistration($user));
                    } catch (\Throwable $e) {
                        Log::warning('Apple signup admin email failed', [
                            'user_id' => $user->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            }

            $this->ensureEmailVerified($user);
            Auth::login($user);
            session()->forget('signup_source');

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Apple login failed.');
        }
    }

    protected function googleRedirectUri(): string
    {
        return (string) (config('services.google.redirect') ?: route('auth.google.callback'));
    }

    protected function resolveReturnTo($request): ?string
    {
        $returnTo = $request->input('return_to')
            ?? $request->query('return_to')
            ?? null;

        if (! is_string($returnTo) || $returnTo === '') {
            return null;
        }

        $parts = parse_url($returnTo);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        $origin = strtolower($parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : ''));

        if (! in_array($origin, AuthBridge::allowedOrigins(), true)) {
            return null;
        }

        return $returnTo;
    }
}
