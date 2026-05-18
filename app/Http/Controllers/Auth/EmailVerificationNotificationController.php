<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\EmailVerificationCodeSender;
use App\Support\EmailLogRecorder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        try {
            EmailVerificationCodeSender::send($request->user());
        } catch (\Throwable $e) {
            EmailLogRecorder::failed(
                $request->user()->email,
                'Your Verification Code',
                'VerificationCodeMail',
                $e
            );

            Log::warning('Email verification code resend failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('status', 'verification-code-failed');
        }

        return back()->with('status', 'verification-code-sent');
    }
}
