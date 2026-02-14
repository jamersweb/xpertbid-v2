<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayFastTestController extends Controller
{
    /**
     * Show the PayFast test form.
     */
    public function form()
    {
        // Guard: Check if PayFast testing is enabled
        if (env('PAYFAST_TEST_ENABLED') !== true) {
            abort(403, 'PayFast testing is disabled.');
        }

        $basketId = 'LIVE-' . time();
        return view('payfast.test', compact('basketId'));
    }

    /**
     * Start the PayFast checkout process.
     */
    public function start(Request $request)
    {
        // Guard: Check if PayFast testing is enabled
        if (env('PAYFAST_TEST_ENABLED') !== true) {
            abort(403, 'PayFast testing is disabled.');
        }

        $request->validate([
            'basket_id' => 'required',
            'txnamt' => 'required',
            'currency_code' => 'required',
        ]);

        $merchantId = env('PAYFAST_MERCHANT_ID');
        $securedKey = env('PAYFAST_SECURED_KEY');
        $merchantName = env('PAYFAST_MERCHANT_NAME', 'Xpertbid');
        $tokenUrl = env('PAYFAST_TOKEN_URL');
        $postUrl = env('PAYFAST_POST_URL');
        $successUrl = env('PAYFAST_SUCCESS_URL');
        $failureUrl = env('PAYFAST_FAILURE_URL');
        $checkoutUrl = env('PAYFAST_CHECKOUT_URL');

        $txnAmt = $request->input('txnamt'); // Keep as string "100.00"
        $basketId = $request->input('basket_id');
        $currencyCode = $request->input('currency_code');

        // 1. Get Access Token
        // Payload for token request
        $tokenPayload = [
            'MERCHANT_ID' => $merchantId,
            'SECURED_KEY' => $securedKey,
            'TXNAMT' => $txnAmt,
            'BASKET_ID' => $basketId,
            'CURRENCY_CODE' => $currencyCode,
        ];

        try {
            // Using cURL manually or Http client. Laravel Http client is cleaner.
            // However, some old PayFast docs suggest form-data or json. 
            // The prompt says "call tokenUrl via cURL POST with form fields".
            // We'll use Laravel's Http client as form parameters.
            
            $response = Http::asForm()->post($tokenUrl, $tokenPayload);
            
            if ($response->failed()) {
                Log::error('PayFast Token Error: ' . $response->body());
                abort(500, 'Failed to get PayFast token. Check logs.');
            }

            $data = $response->json();
            $accessToken = $data['ACCESS_TOKEN'] ?? null;

            if (!$accessToken) {
                Log::error('PayFast Token Missing in Response: ' . $response->body());
                abort(500, 'PayFast did not return an access token.');
            }

        } catch (\Exception $e) {
            Log::error('PayFast Token Exception: ' . $e->getMessage());
            abort(500, 'Exception contacting PayFast.');
        }

        // 2. Prepare Data for PostTransaction
        // SIGNATURE and VERSION are random strings (do NOT hash with sha256) per instructions.
        $signature = 'SIG-' . strtoupper(bin2hex(random_bytes(8)));
        $version = 'XPERTBID-1.0';
        
        $fields = [
            'CURRENCY_CODE' => $currencyCode,
            'MERCHANT_ID' => $merchantId,
            'MERCHANT_NAME' => $merchantName,
            'TOKEN' => $accessToken,
            'BASKET_ID' => $basketId,
            'TXNAMT' => $txnAmt,
            'ORDER_DATE' => date('Y-m-d H:i:s'),
            'SUCCESS_URL' => $successUrl,
            'FAILURE_URL' => $failureUrl,
            'CHECKOUT_URL' => $checkoutUrl, // This is the server-to-server notify URL
            'CUSTOMER_EMAIL_ADDRESS' => $request->input('customer_email_address', 'test@example.com'),
            'CUSTOMER_MOBILE_NO' => $request->input('customer_mobile_no', '03001234567'),
            'SIGNATURE' => $signature,
            'VERSION' => $version,
            'TXNDESC' => 'Live Test Order ' . $basketId,
            'PROCCODE' => '00',
            'TRAN_TYPE' => 'ECOMM_PURCHASE',
        ];

        Log::info('PayFast Starting Checkout', [
            'basket_id' => $basketId,
            'amount' => $txnAmt,
            'currency' => $currencyCode
        ]);

        return view('payfast.redirect', compact('postUrl', 'fields'));
    }

    /**
     * Handle PayFast server-to-server notification (Callback).
     */
    public function notify(Request $request)
    {
        Log::info('PayFast Notify Callback', [
            'method' => $request->method(),
            'ip' => $request->ip(),
            'payload' => $request->all(),
            'headers' => $request->header(),
        ]);

        return response('OK', 200);
    }

    /**
     * Handle successful payment redirect.
     */
    public function success(Request $request)
    {
        Log::info('PayFast Success Redirect', $request->all());

        return "<h1>Payment Successful</h1><p>Timestamp: " . now() . "</p><p>Check logs for details.</p>";
    }

    /**
     * Handle failed payment redirect.
     */
    public function failure(Request $request)
    {
        Log::info('PayFast Failure Redirect', $request->all());

        return "<h1>Payment Failed</h1><p>Timestamp: " . now() . "</p><p>Check logs for details.</p>";
    }
}
