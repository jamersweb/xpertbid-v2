<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Currencies/Index', [
            'currencies' => Currency::query()
                ->orderByDesc('enabled')
                ->orderBy('code')
                ->get(),
            'currencyLastSyncedAt' => Cache::get('currency_rates_last_synced_at'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Currencies/Form', [
            'currency' => null,
        ]);
    }

    public function store(Request $request)
    {
        Currency::create($this->validatedData($request));

        return redirect()->route('admin.currencies.index')->with('success', 'Currency created successfully.');
    }

    public function edit(Currency $currency)
    {
        return Inertia::render('Admin/Currencies/Form', [
            'currency' => $currency,
        ]);
    }

    public function update(Request $request, Currency $currency)
    {
        $currency->update($this->validatedData($request, $currency));

        return redirect()->route('admin.currencies.index')->with('success', 'Currency updated successfully.');
    }

    public function destroy(Currency $currency)
    {
        $currency->delete();

        return redirect()->back()->with('success', 'Currency deleted successfully.');
    }

    protected function validatedData(Request $request, ?Currency $currency = null): array
    {
        $data = $request->validate([
            'code' => [
                'required',
                'string',
                'size:3',
                Rule::unique('currencies', 'code')->ignore($currency?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['required', 'string', 'max:10'],
            'decimals' => ['required', 'integer', 'min:0', 'max:8'],
            'position' => ['required', Rule::in(['left', 'right'])],
            'manual_rate_to_aed' => ['nullable', 'numeric', 'min:0'],
            'enabled' => ['boolean'],
        ]);

        $data['code'] = strtoupper($data['code']);
        $data['enabled'] = (bool) ($data['enabled'] ?? false);

        return $data;
    }
}
