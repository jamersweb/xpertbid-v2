<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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
            $request->user()->sendEmailVerificationNotification();
        } catch (\Throwable $e) {
            EmailLogRecorder::failed(
                $request->user()->email,
                'Verify Email Address',
                'VerifyEmailNotification',
                $e
            );

            Log::warning('Email verification notification resend failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('status', 'verification-link-failed');
        }

        return back()->with('status', 'verification-link-sent');
    }
}
