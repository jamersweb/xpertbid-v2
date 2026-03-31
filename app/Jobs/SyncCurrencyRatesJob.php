<?php

namespace App\Jobs;

use App\Models\Currency;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncCurrencyRatesJob
{
    public function handle(): array
    {
        $endpoint = config('services.exchange_rate_api.url', 'https://open.er-api.com/v6/latest/USD');

        $response = Http::timeout(15)->acceptJson()->get($endpoint);

        if (!$response->successful()) {
            throw new \RuntimeException('Currency API request failed with status ' . $response->status());
        }

        $payload = $response->json();

        if (($payload['result'] ?? null) !== 'success' || !isset($payload['rates']['PKR'])) {
            throw new \RuntimeException('Currency API returned an invalid payload.');
        }

        $rates = $payload['rates'];
        $usdToPkr = (float) $rates['PKR'];

        if ($usdToPkr <= 0) {
            throw new \RuntimeException('PKR rate is invalid.');
        }

        $updated = 0;
        $skipped = [];

        Currency::query()
            ->where('enabled', true)
            ->get()
            ->each(function (Currency $currency) use ($rates, $usdToPkr, &$updated, &$skipped) {
                $code = strtoupper($currency->code);

                $rateToPkr = match ($code) {
                    'PKR' => 1.0,
                    'USD' => $usdToPkr,
                    default => isset($rates[$code]) && (float) $rates[$code] > 0
                        ? $usdToPkr / (float) $rates[$code]
                        : null,
                };

                if (!$rateToPkr || $rateToPkr <= 0) {
                    $skipped[] = $code;
                    return;
                }

                $currency->update([
                    'manual_rate_to_aed' => round($rateToPkr, 8),
                ]);

                $updated++;
            });

        Cache::forever('currency_rates_last_synced_at', now()->toDateTimeString());

        Log::info('Currency rates synced successfully.', [
            'endpoint' => $endpoint,
            'updated' => $updated,
            'skipped' => $skipped,
        ]);

        return [
            'updated' => $updated,
            'skipped' => $skipped,
            'base' => $payload['base_code'] ?? 'USD',
            'provider' => $payload['provider'] ?? null,
            'next_update' => $payload['time_next_update_utc'] ?? null,
        ];
    }
}
