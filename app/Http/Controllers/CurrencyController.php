<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Currency;

class CurrencyController extends Controller
{
    public function index()
    {
        $currencies = Currency::where('enabled', true)->get();
        
        // Prepare rates map
        $rates = [];
        foreach ($currencies as $currency) {
            $rates[$currency->code] = $currency->manual_rate_to_aed;
        }

        return response()->json([
            'currencies' => $currencies,
            'rates' => $rates,
        ]);
    }
}
