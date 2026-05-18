<?php

namespace App\Support;

use App\Mail\VerificationCodeMail;
use App\Models\VerificationCode;
use App\Models\User;

class EmailVerificationCodeSender
{
    public static function send(User $user): void
    {
        $code = (string) random_int(100000, 999999);

        $verification = VerificationCode::updateOrCreate(
            ['email' => $user->email],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        try {
            LoggedMail::to($user->email)->send(new VerificationCodeMail($code));
        } catch (\Throwable $e) {
            $verification->delete();
            throw $e;
        }
    }
}
