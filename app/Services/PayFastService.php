<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class PayFastService
{
    public function isConfigured(): bool
    {
        return filled(config('services.payfast.merchant_id'))
            && filled(config('services.payfast.secured_key'))
            && filled(config('services.payfast.token_url'))
            && filled(config('services.payfast.post_url'));
    }

    public function postUrl(): string
    {
        return (string) config('services.payfast.post_url');
    }

    public function accessToken(Order $order): string
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('PayFast is not configured.');
        }

        $payload = [
            'MERCHANT_ID' => (string) config('services.payfast.merchant_id'),
            'SECURED_KEY' => (string) config('services.payfast.secured_key'),
            'BASKET_ID' => $order->order_number,
            'TXNAMT' => $this->formatAmount($order->total),
            'CURRENCY_CODE' => $this->currency(),
        ];

        $response = Http::asForm()
            ->timeout(20)
            ->post((string) config('services.payfast.token_url'), $payload);

        if ($response->failed()) {
            Log::error('PayFast token request failed', [
                'order_number' => $order->order_number,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('Unable to start PayFast payment.');
        }

        $token = Arr::get($response->json() ?: [], 'ACCESS_TOKEN');

        if (! filled($token)) {
            Log::error('PayFast token response did not include ACCESS_TOKEN', [
                'order_number' => $order->order_number,
                'body' => $response->body(),
            ]);

            throw new RuntimeException('PayFast did not return an access token.');
        }

        return (string) $token;
    }

    public function checkoutFields(Order $order): array
    {
        $token = $this->accessToken($order);

        return [
            'CURRENCY_CODE' => $this->currency(),
            'MERCHANT_ID' => (string) config('services.payfast.merchant_id'),
            'MERCHANT_NAME' => (string) config('services.payfast.merchant_name'),
            'TOKEN' => $token,
            'BASKET_ID' => $order->order_number,
            'TXNAMT' => $this->formatAmount($order->total),
            'ORDER_DATE' => now()->format('Y-m-d H:i:s'),
            'SUCCESS_URL' => route('payfast.success', $order->order_number),
            'FAILURE_URL' => route('payfast.failure', $order->order_number),
            'CHECKOUT_URL' => route('payfast.notify'),
            'CUSTOMER_EMAIL_ADDRESS' => $order->billing_email,
            'CUSTOMER_MOBILE_NO' => $order->billing_phone,
            'SIGNATURE' => $this->orderSignature($order),
            'VERSION' => 'XPERTBID-1.0',
            'TXNDESC' => 'XpertBid order ' . $order->order_number,
            'PROCCODE' => '00',
            'TRAN_TYPE' => 'ECOMM_PURCHASE',
        ];
    }

    public function orderSignature(Order $order): string
    {
        return hash_hmac(
            'sha256',
            implode('|', [$order->order_number, $this->formatAmount($order->total), $this->currency()]),
            (string) config('services.payfast.secured_key')
        );
    }

    public function orderReference(array $payload): ?string
    {
        foreach (['BASKET_ID', 'basket_id', 'm_payment_id', 'M_PAYMENT_ID', 'order_number', 'ORDER_NUMBER'] as $key) {
            if (filled($payload[$key] ?? null)) {
                return (string) $payload[$key];
            }
        }

        return null;
    }

    public function transactionId(array $payload): ?string
    {
        foreach (['TXN_ID', 'transaction_id', 'TRANSACTION_ID', 'pf_payment_id', 'PF_PAYMENT_ID'] as $key) {
            if (filled($payload[$key] ?? null)) {
                return (string) $payload[$key];
            }
        }

        return null;
    }

    public function isSuccessful(array $payload): bool
    {
        $status = strtolower((string) ($payload['transaction_status']
            ?? $payload['TRANSACTION_STATUS']
            ?? $payload['payment_status']
            ?? $payload['PAYMENT_STATUS']
            ?? $payload['status']
            ?? $payload['STATUS']
            ?? ''));

        return in_array($status, ['paid', 'success', 'successful', 'approved', 'completed'], true);
    }

    public function amountMatches(Order $order, array $payload): bool
    {
        $amount = $payload['TXNAMT']
            ?? $payload['txnamt']
            ?? $payload['amount_gross']
            ?? $payload['AMOUNT_GROSS']
            ?? $payload['amount']
            ?? null;

        if ($amount === null || $amount === '') {
            return true;
        }

        return abs((float) $amount - (float) $order->total) < 0.01;
    }

    public function callbackSignatureMatches(Order $order, array $payload): bool
    {
        $signature = $payload['SIGNATURE'] ?? $payload['signature'] ?? null;

        if (! filled($signature)) {
            return true;
        }

        return hash_equals($this->orderSignature($order), (string) $signature);
    }

    public function formatAmount(mixed $amount): string
    {
        return number_format((float) $amount, 2, '.', '');
    }

    private function currency(): string
    {
        return (string) config('services.payfast.currency', 'PKR');
    }
}
