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
    protected function send($mobile, $message, int $type)
    {
        $mobile = str_replace('+', '', $mobile);

        try {
            $response = Http::asForm()->post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'mobile' => $mobile,
                'message' => $message,
                'priority' => 0,
                'type' => $type,
            ]);

            if ($response->successful()) {
                Log::info("Msgpk: Message sent successfully to {$mobile}. Response: " . $response->body());
                return true;
            }

            Log::error("Msgpk: Failed to send Message to {$mobile}. Status: {$response->status()}. Response: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Msgpk: Exception sending Message to {$mobile}: " . $e->getMessage());
            return false;
        }
    }

    public function sendOtp($mobile, $otp, $type = 0)
    {
        return $this->send($mobile, "Your verification code is: {$otp}", (int) $type);
    }

    public function sendMessage($mobile, $message)
    {
        return $this->send($mobile, $message, 0);
    }

    public function sendWhatsApp($mobile, $message)
    {
        return $this->send($mobile, $message, 2);
    }
}
