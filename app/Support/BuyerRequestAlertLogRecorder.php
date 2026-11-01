<?php

namespace App\Support;

use App\Models\BuyerRequest;
use App\Models\BuyerRequestAlertLog;
use App\Models\User;

class BuyerRequestAlertLogRecorder
{
    public static function record(
        User $user,
        ?BuyerRequest $request,
        string $channel,
        string $alertKey,
        ?string $destination,
        ?string $subject,
        ?string $body,
        string $status,
        ?string $failureReason = null,
        ?string $providerResponse = null,
    ): BuyerRequestAlertLog {
        return BuyerRequestAlertLog::create([
            'buyer_request_id' => $request?->id,
            'user_id' => $user->id,
            'channel' => $channel,
            'alert_key' => $alertKey,
            'destination' => $destination !== null ? mb_substr($destination, 0, 255) : null,
            'subject' => $subject !== null ? mb_substr($subject, 0, 255) : null,
            'body' => $body,
            'status' => $status,
            'failure_reason' => $failureReason ? mb_substr($failureReason, 0, 5000) : null,
            'provider_response' => $providerResponse ? mb_substr($providerResponse, 0, 500) : null,
            'sent_at' => now(),
        ]);
    }
}
