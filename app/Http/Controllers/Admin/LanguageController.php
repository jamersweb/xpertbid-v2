<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\LanguageTranslation;
use App\Support\TranslationManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LanguageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Languages/Index', [
            'languages' => Language::query()->orderByDesc('is_default')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:10', 'unique:languages,code'],
            'name' => ['required', 'string', 'max:255'],
            'native_name' => ['required', 'string', 'max:255'],
            'direction' => ['required', 'in:ltr,rtl'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        Language::create([
            ...$validated,
            'code' => strtolower($validated['code']),
            'is_active' => $validated['is_active'] ?? true,
            'is_default' => false,
        ]);

        TranslationManager::flushCache();

        return back()->with('success', 'Language created successfully.');
    }

    public function toggleStatus(Language $language)
    {
        if ($language->is_default) {
            return back()->with('error', 'Default language cannot be disabled.');
        }

        $language->update([
            'is_active' => ! $language->is_active,
        ]);

        TranslationManager::flushCache();

        return back()->with('success', 'Language status updated successfully.');
    }

    public function edit(Language $language)
    {
        return Inertia::render('Admin/Languages/Edit', [
            'language' => $language,
            'rows' => TranslationManager::getEditorRows($language),
        ]);
    }

    public function updateTranslations(Request $request, Language $language)
    {
        $translations = $request->input('translations', []);

        foreach ($translations as $key => $value) {
            LanguageTranslation::query()->updateOrCreate(
                [
                    'language_id' => $language->id,
                    'translation_key' => $key,
                ],
                [
                    'translation_value' => is_string($value) ? $value : '',
                ]
            );
        }

        TranslationManager::flushCache($language->code);

        return back()->with('success', 'Translations updated successfully.');
    }
}
