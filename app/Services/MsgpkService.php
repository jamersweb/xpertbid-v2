<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MsgpkService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('MSG_PK_API_KEY');
        $this->baseUrl = 'https://msgpk.com/api/send.php';
    }

    /**
     * Send OTP via WhatsApp/SMS using Msgpk
     *
     * @param string $mobile
     * @param string $otp
     * @return bool
     */
    public function sendOtp($mobile, $otp, $type = 0)
    {
        // Remove '+' from phone number if present
        $mobile = str_replace('+', '', $mobile);

        try {
            $response = Http::asForm()->post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'mobile' => $mobile,
                'message' => "Your verification code is: {$otp}",
                'priority' => 0,
                'type' => $type, // 0 for SMS, 2 for WhatsApp (standard for many PK providers)
            ]);

            if ($response->successful()) {
                Log::info("Msgpk: OTP sent successfully to {$mobile}. Response: " . $response->body());
                return true;
            } else {
                Log::error("Msgpk: Failed to send OTP to {$mobile}. Status: {$response->status()}. Response: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Msgpk: Exception sending OTP to {$mobile}: " . $e->getMessage());
            return false;
        }
    }
    /**
     * Send a generic message via WhatsApp/SMS using Msgpk
     *
     * @param string $mobile
     * @param string $message
     * @return bool
     */
    public function sendMessage($mobile, $message)
    {
        // Remove '+' from phone number if present
        $mobile = str_replace('+', '', $mobile);

        try {
            $response = Http::asForm()->post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'mobile' => $mobile,
                'message' => $message,
                'priority' => 0,
                'type' => 0,
            ]);

            if ($response->successful()) {
                Log::info("Msgpk: Message sent successfully to {$mobile}. Response: " . $response->body());
                return true;
            } else {
                Log::error("Msgpk: Failed to send Message to {$mobile}. Status: {$response->status()}. Response: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Msgpk: Exception sending Message to {$mobile}: " . $e->getMessage());
            return false;
        }
    }
}
