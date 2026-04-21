<?php

namespace App\Http\Controllers;

use App\Support\TranslationManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $supportedLocales = array_keys(TranslationManager::getSupportedLanguages());

        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:' . implode(',', $supportedLocales)],
        ]);

        $request->session()->put('locale', $validated['locale']);

        return back()->with('success', __('Language updated successfully.'));
    }
}
