<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MsgpkService
{
    protected ?string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.msgpk.api_key', env('MSG_PK_API_KEY'));
        $this->baseUrl = config('services.msgpk.base_url', 'https://msgpk.com/api/send.php');
    }

    /**
     * Check if Msgpk API key is configured.
     */
    public function isConfigured(): bool
    {
        return ! empty($this->apiKey);
    }

    /**
     * Normalize Pakistani and international mobile numbers into standard format (e.g. 923001234567).
     */
    public function normalizeMobile(string $mobile): string
    {
        $clean = preg_replace('/[^0-9]/', '', $mobile);

        if (empty($clean)) {
            return '';
        }

        // If it starts with 00 (e.g. 0092300...), strip 00
        if (str_starts_with($clean, '00')) {
            $clean = substr($clean, 2);
        }

        // If it starts with 0 (e.g. 03001234567), replace leading 0 with 92
        if (str_starts_with($clean, '0') && strlen($clean) === 11) {
            $clean = '92' . substr($clean, 1);
        } elseif (strlen($clean) === 10 && str_starts_with($clean, '3')) {
            // If user entered 3001234567 (10 digits starting with 3), prepend 92
            $clean = '92' . $clean;
        }

        return $clean;
    }

    /**
     * Send message and return detailed result array.
     *
     * @param string $mobile
     * @param string $message
     * @param int $type 0 = SMS, 1 = Unicode SMS, 2 = WhatsApp
     * @return array{success: bool, error: ?string, response: ?string, mobile: string}
     */
    public function sendDetailed(string $mobile, string $message, int $type = 0): array
    {
        $cleanMobile = $this->normalizeMobile($mobile);

        if (! $this->isConfigured()) {
            $error = 'WhatsApp/SMS gateway API key is not configured (MSG_PK_API_KEY missing in .env)';
            Log::warning("Msgpk: {$error}", ['mobile' => $mobile]);

            return [
                'success' => false,
                'error' => $error,
                'response' => null,
                'mobile' => $cleanMobile ?: $mobile,
            ];
        }

        if (empty($cleanMobile) || strlen($cleanMobile) < 10) {
            $error = "Invalid recipient phone number format: '{$mobile}'";
            Log::warning("Msgpk: {$error}");

            return [
                'success' => false,
                'error' => $error,
                'response' => null,
                'mobile' => $cleanMobile ?: $mobile,
            ];
        }

        try {
            $http = Http::asForm()->timeout(15);

            // Bypass SSL certificate check in local / Windows development to prevent cURL error 60
            if (app()->environment('local') || env('APP_ENV') === 'local') {
                $http = $http->withoutVerifying();
            }

            $response = $http->post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'mobile' => $cleanMobile,
                'message' => $message,
                'priority' => 0,
                'type' => $type,
            ]);

            $body = trim((string) $response->body());

            if (! $response->successful()) {
                $error = "HTTP error {$response->status()}: " . Str::limit($body, 255);
                Log::error("Msgpk: HTTP error to {$cleanMobile}. Status: {$response->status()}. Response: {$body}");

                return [
                    'success' => false,
                    'error' => $error,
                    'response' => $body,
                    'mobile' => $cleanMobile,
                ];
            }

            // Msgpk returns JSON:
            // Success: {"success":"true", ...}
            // Failure: {"success":"false", "results":[{"error":"Invalid API KEY!"}]}
            $json = $response->json();

            if (is_array($json)) {
                $isSuccess = isset($json['success'])
                    && in_array($json['success'], ['true', true, 1, '1'], true);

                if (! $isSuccess) {
                    $errorDetail = $json['results'][0]['error']
                        ?? ($json['message']
                        ?? ($json['error'] ?? 'Gateway returned failure'));

                    $error = "Msgpk error: {$errorDetail}";
                    Log::warning("Msgpk: Gateway error to {$cleanMobile}: {$errorDetail}. Full: {$body}");

                    return [
                        'success' => false,
                        'error' => $error,
                        'response' => $body,
                        'mobile' => $cleanMobile,
                    ];
                }

                Log::info("Msgpk: Message sent successfully to {$cleanMobile}. Response: {$body}");

                return [
                    'success' => true,
                    'error' => null,
                    'response' => $body,
                    'mobile' => $cleanMobile,
                ];
            }

            // If non-JSON response, inspect text for error keywords
            $lower = strtolower($body);
            if (
                str_contains($lower, 'error') ||
                str_contains($lower, 'invalid') ||
                str_contains($lower, 'fail') ||
                $body === '0' ||
                $body === ''
            ) {
                $error = 'Msgpk error: ' . ($body !== '' ? Str::limit($body, 255) : 'Empty response from gateway');
                Log::warning("Msgpk: Non-JSON error response for {$cleanMobile}: {$body}");

                return [
                    'success' => false,
                    'error' => $error,
                    'response' => $body,
                    'mobile' => $cleanMobile,
                ];
            }

            Log::info("Msgpk: Response received for {$cleanMobile}: {$body}");

            return [
                'success' => true,
                'error' => null,
                'response' => $body,
                'mobile' => $cleanMobile,
            ];
        } catch (\Throwable $e) {
            $error = 'Exception calling Msgpk gateway: ' . $e->getMessage();
            Log::error("Msgpk: Exception sending to {$cleanMobile}: " . $e->getMessage());

            return [
                'success' => false,
                'error' => $error,
                'response' => null,
                'mobile' => $cleanMobile,
            ];
        }
    }

    /**
     * Send OTP via WhatsApp/SMS using Msgpk
     */
    public function sendOtp($mobile, $otp, $type = 0): bool
    {
        return $this->send($mobile, "Your verification code is: {$otp}", (int) $type);
    }

    /**
     * Send standard SMS
     */
    public function sendMessage($mobile, $message): bool
    {
        return $this->send($mobile, $message, 0);
    }

    /**
     * Send WhatsApp message
     */
    public function sendWhatsApp($mobile, $message): bool
    {
        return $this->send($mobile, $message, 2);
    }

    /**
     * Send WhatsApp message with detailed status and error response
     */
    public function sendWhatsAppDetailed($mobile, $message): array
    {
        return $this->sendDetailed($mobile, $message, 2);
    }

    /**
     * Backwards-compatible send method returning bool
     */
    protected function send($mobile, $message, int $type): bool
    {
        return $this->sendDetailed((string) $mobile, (string) $message, $type)['success'];
    }
}
