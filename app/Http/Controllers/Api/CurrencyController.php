<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;

class CurrencyController extends Controller
{
    public function index()
    {
        $currencies = Currency::query()
            ->where('enabled', true)
            ->orderBy('code')
            ->get(['code','symbol','name','decimals','position','manual_rate_to_aed']);

        return response()->json([
            'base' => config('currency.base', 'AED'),
            'currencies' => $currencies,
        ]);
    }
}
