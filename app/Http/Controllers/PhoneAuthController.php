<?php
namespace App\Http\Controllers;

use App\Mail\AdminNewUserRegistration;
use App\Mail\UserSignupConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\MsgpkService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Support\LoggedMail as Mail;
use Illuminate\Support\Str;
use App\Support\SignupWelcomeMessageSender;

class PhoneAuthController extends Controller
{
    protected $msgpkService;

    protected function resolveSignupSource(Request $request, string $default = 'web'): string
    {
        return $request->input('signup_source')
            ?? $request->header('X-Client-Source')
            ?? $default;
    }

    public function __construct(MsgpkService $msgpkService)
    {
        $this->msgpkService = $msgpkService;
    }

    protected function findUserByPhone(?string $phone): ?User
    {
        if (empty($phone)) {
            return null;
        }

        $digits = preg_replace('/\D/', '', $phone);
        $withPlus = '+' . $digits;

        return User::where('phone', $phone)
            ->orWhere('phone', $digits)
            ->orWhere('phone', $withPlus)
            ->first();
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:7',
            'type' => 'nullable|in:login,register,forgot_password', 
            'otp_type' => 'nullable|in:sms,whatsapp',
        ]);

        $phone = preg_replace('/\s+/', '', (string) $request->phone);
        $digits = preg_replace('/\D/', '', $phone);
        $user = $this->findUserByPhone($phone);

        if ($request->type === 'register') {
            if ($user && $user->is_phone_verified) {
                return response()->json(['message' => 'Account already exists and is verified. Please login with password.'], 422);
            }
        }
        
        if ($request->type === 'login') {
             if (!$user) {
                 return response()->json(['message' => 'Account does not exist. Please register.'], 422);
             }
        }

        if ($request->type === 'forgot_password') {
            if (!$user) {
                return response()->json(['message' => 'No account found with this phone number.'], 404);
            }
        }

        $otp = rand(100000, 999999); // Generate a random 6-digit OTP

        // Cache the OTP with a 5-minute expiry under both representations
        Cache::put('otp_' . $phone, $otp, now()->addMinutes(5));
        if (!empty($digits)) {
            Cache::put('otp_' . $digits, $otp, now()->addMinutes(5));
        }

        // Msgpk type: 0 for SMS, 2 for WhatsApp. Default to WhatsApp for forgot_password if unspecified
        $otpType = $request->otp_type ?? ($request->type === 'forgot_password' ? 'whatsapp' : 'sms');
        $msgType = ($otpType === 'whatsapp') ? 2 : 0;

        // Send the OTP via Msgpk
        if ($this->msgpkService->sendOtp($phone, $otp, $msgType)) {
            return response()->json(['message' => 'OTP sent successfully via ' . ($msgType == 2 ? 'WhatsApp' : 'SMS') . '.']);
        }

        return response()->json(['message' => 'Failed to send OTP.'], 500);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|numeric|min:10',
            'otp' => 'required|numeric|digits:6',
            'password' => 'nullable|string|min:6', // Validation for password
        ]);

        $cachedOtp = Cache::get('otp_' . $request->phone);

        if ($cachedOtp && $cachedOtp == $request->otp) {
            Cache::forget('otp_' . $request->phone); // Clear the OTP after successful verification

            // Find or Create User
            $user = User::where('phone', $request->phone)->first();

            if (!$user) {
                // Create new user if not exists
                $baseName = 'user';
                $randomNum = rand(100, 999);
                $referralCode = $baseName . $randomNum;

                while (User::where('referral_code', $referralCode)->exists()) {
                    $randomNum = rand(100, 999);
                    $referralCode = $baseName . $randomNum;
                }

                try {
                    $user = User::create([
                        'name' => $request->name ?? 'User ' . substr($request->phone, -4),
                        'email' => null, // Email is nullable now
                        'phone' => $request->phone,
                        'password' => Hash::make($request->password ?? Str::random(16)), // Use provided password
                        'role' => 'User',
                        'referral_code' => $referralCode,
                        'provider' => 'phone',
                        'signup_source' => $this->resolveSignupSource($request),
                        'is_phone_verified' => true,
                        'phone_verified_at' => now(),
                    ]);

                    SignupWelcomeMessageSender::send($user);

                    if (!empty($user->email)) {
                        try {
                            Mail::to($user->email)->send(new UserSignupConfirmation($user));
                        } catch (\Throwable $e) {
                            Log::warning('Phone signup user email failed', [
                                'user_id' => $user->id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    }

                    $adminEmail = env('ADMIN_EMAIL');
                    if (!empty($adminEmail)) {
                        try {
                            Mail::to($adminEmail)->send(new AdminNewUserRegistration($user));
                        } catch (\Throwable $e) {
                            Log::warning('Phone signup admin email failed', [
                                'user_id' => $user->id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                     return response()->json(['message' => 'User creation failed: ' . $e->getMessage()], 500);
                }
            } else {
                 // User exists, just ensure phone verified is true if not already
                 if (!$user->is_phone_verified) {
                     $user->update([
                         'is_phone_verified' => true,
                         'phone_verified_at' => now()
                     ]);
                 }
                 // Optional: Update password if provided during verification of existing unverified user?
                 if ($request->password) {
                     $user->update(['password' => Hash::make($request->password)]);
                 }
            }

            // Login User
            Auth::login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'OTP verified successfully.',
                'token' => $token,
                'user' => $user,
            ]);
        }

        return response()->json(['message' => 'Invalid or expired OTP.'], 422);
    }

    public function validateResetOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:7',
            'otp' => 'required|numeric|digits:6',
        ]);

        $phone = preg_replace('/\s+/', '', (string) $request->phone);
        $digits = preg_replace('/\D/', '', $phone);

        $cachedOtp = Cache::get('otp_' . $phone) ?? (!empty($digits) ? Cache::get('otp_' . $digits) : null);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }

        $user = $this->findUserByPhone($phone);

        if (!$user) {
            return response()->json(['message' => 'No account found with this phone number.'], 404);
        }

        return response()->json([
            'message' => 'OTP verified successfully.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:7',
            'otp' => 'required|numeric|digits:6',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $phone = preg_replace('/\s+/', '', (string) $request->phone);
        $digits = preg_replace('/\D/', '', $phone);

        $cachedOtp = Cache::get('otp_' . $phone) ?? (!empty($digits) ? Cache::get('otp_' . $digits) : null);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }

        $user = $this->findUserByPhone($phone);

        if (!$user) {
            return response()->json(['message' => 'No account found with this phone number.'], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'is_phone_verified' => true,
            'phone_verified_at' => $user->phone_verified_at ?? now(),
        ]);

        Cache::forget('otp_' . $phone);
        if (!empty($digits)) {
            Cache::forget('otp_' . $digits);
        }

        return response()->json([
            'message' => 'Password has been reset successfully.',
        ]);
    }
}
