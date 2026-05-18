<?php
namespace App\Http\Controllers;

use App\Models\VerificationCode;
use Illuminate\Http\Request;
use App\Support\LoggedMail as Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\VerificationCodeMail;
use App\Mail\UserSignupConfirmation; 
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;


class VerificationCodeController extends Controller
{
public function sendVerificationCode(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    // Generate a random 6-digit code
    $code = mt_rand(100000, 999999);

    // Store the code in the database
    $verification = VerificationCode::updateOrCreate(
        ['email' => $request->email],
        [
            'code' => $code,
            'expires_at' => now()->addMinutes(1),
        ]
    );

    // Check if save failed
    if (!$verification) {
        return response()->json(['message' => 'Failed to save verification code.'], 422);
    }

    // Send the code via email & check if mail send succeeded
    try {
        Mail::to($request->email)->send(new VerificationCodeMail($code));
    } catch (\Exception $e) {
        // Rollback/delete the code if you want
        $verification->delete();
        return response()->json(['message' => 'Failed to send verification email.'], 422);
    }

    return response()->json([
        'message' => 'Verification code sent successfully.',
        'success' => true
    ], 200);
}

    public function verifyCode(Request $request)
    {
        $email = Auth::check() ? Auth::user()->email : $request->email;

        $rules = [
            'code' => 'required|string',
        ];

        if (!Auth::check()) {
            $rules['email'] = 'required|email|exists:users,email';
        }

        $request->validate($rules);

        // Find the verification code
        $verificationCode = VerificationCode::where('email', $email)
            ->where('code', $request->code)
            ->first();

        if (!$verificationCode) {
            if (!$request->expectsJson()) {
                return back()->withErrors(['code' => 'Invalid verification code.']);
            }

            return response()->json(['message' => 'Invalid verification code.' , 'success' => false ], 200 );
        }

        // Check if the code is expired
        if ($verificationCode->isExpired()) {
            if (!$request->expectsJson()) {
                return back()->withErrors(['code' => 'Verification code has expired.']);
            }

            return response()->json(['message' => 'Verification code has expired.', 'success' => false ], 200 );
        }
        
        $user = User::where('email', $email)->first();

        if (!$user) {
            if (!$request->expectsJson()) {
                return back()->withErrors(['code' => 'User account was not found.']);
            }

            return response()->json(['message' => 'User account was not found.', 'success' => false], 200);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

		// Send the confirmation email
        try {
            Mail::to($email)->send(new UserSignupConfirmation($user));
        } catch (\Throwable $e) {
            Log::warning('User signup confirmation email failed after verification', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Code is valid, delete the code record
        $verificationCode->delete();

        if (!$request->expectsJson()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        return response()->json(['message' => 'Verification successful.' , 'success' => true], 200);
    }
}
