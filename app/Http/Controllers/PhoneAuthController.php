<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\MsgpkService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PhoneAuthController extends Controller
{
    protected $msgpkService;

    public function __construct(MsgpkService $msgpkService)
    {
        $this->msgpkService = $msgpkService;
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|numeric|min:10',
            'type' => 'nullable|in:login,register', 
            'otp_type' => 'nullable|in:sms,whatsapp',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if ($request->type === 'register') {
            if ($user && $user->is_phone_verified) {
                return response()->json(['message' => 'Account already exists and is verified. Please login with password.'], 422);
            }
        }
        
        // For login, usually we don't send OTP anymore with password flow, 
        // but if user wants to login via OTP strictly (or forgot password flow?), 
        // we can keep it open or restrict. 
        // User asked: "otp tab send ho aghar is phone verified 0 hai to" - this applies to verified check.
        // Assuming for login type we allow OTP if they forgot password? 
        // Or if they are NOT verified, we send OTP to verify.
        if ($request->type === 'login') {
             if (!$user) {
                 return response()->json(['message' => 'Account does not exist. Please register.'], 422);
             }
             // Optional: If user is active/verified, maybe we shouldn't send OTP for simple login?
             // But existing flow was OTP login. 
             // If pivot to Password login, this endpoint might not be used for Login step anymore.
        }

        $otp = rand(100000, 999999); // Generate a random 6-digit OTP

        // Cache the OTP with a 5-minute expiry
        Cache::put('otp_' . $request->phone, $otp, now()->addMinutes(5));

        // Msgpk type: 0 for SMS, 2 for WhatsApp
        $msgType = ($request->otp_type === 'whatsapp') ? 2 : 0;

        // Send the OTP via Msgpk
        if ($this->msgpkService->sendOtp($request->phone, $otp, $msgType)) {
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
                        'is_phone_verified' => true,
                        'phone_verified_at' => now(),
                    ]);
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
}
