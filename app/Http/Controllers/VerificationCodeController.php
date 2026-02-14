<?php
namespace App\Http\Controllers;

use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\VerificationCodeMail;
use App\Mail\UserSignupConfirmation; 
use App\Models\User;


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
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required',
        ]);

        // Find the verification code
        $verificationCode = VerificationCode::where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$verificationCode) {
            return response()->json(['message' => 'Invalid verification code.' , 'success' => false ], 200 );
        }

        // Check if the code is expired
        if ($verificationCode->isExpired()) {
            return response()->json(['message' => 'Verification code has expired.', 'success' => false ], 200 );
        }
        
        $user = User::where('email', $request->email)->first();
        $user->email_verified_at = now();
        $user->save();
		// Send the confirmation email
        Mail::to($request->email)->send(new UserSignupConfirmation());

        // Code is valid, delete the code record
        $verificationCode->delete();

        return response()->json(['message' => 'Verification successful.' , 'success' => true], 200);
    }
}
