<?php

namespace App\Support;

use App\Models\Language;
use App\Models\LanguageTranslation;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class TranslationManager
{
    protected const TRANSLATION_FILE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'php', 'blade.php'];

    public static function getSupportedLanguages(): array
    {
        return Cache::remember('translations.supported_languages', now()->addMinutes(30), function () {
            if (! Schema::hasTable('languages')) {
                return config('locales.supported', []);
            }

            $languages = Language::query()
                ->where('is_active', true)
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get();

            if ($languages->isEmpty()) {
                return config('locales.supported', []);
            }

            return $languages->mapWithKeys(function (Language $language) {
                return [
                    $language->code => [
                        'name' => $language->name,
                        'native' => $language->native_name,
                        'direction' => $language->direction,
                    ],
                ];
            })->all();
        });
    }

    public static function getTranslations(string $locale): array
    {
        return Cache::remember("translations.map.{$locale}", now()->addMinutes(30), function () use ($locale) {
            $fileTranslations = self::loadJsonFile($locale);

            if (! Schema::hasTable('languages') || ! Schema::hasTable('language_translations')) {
                return $fileTranslations;
            }

            $dbTranslations = LanguageTranslation::query()
                ->whereHas('language', fn ($query) => $query->where('code', $locale))
                ->pluck('translation_value', 'translation_key')
                ->filter(fn ($value) => $value !== null && $value !== '')
                ->all();

            return array_merge($fileTranslations, $dbTranslations);
        });
    }

    public static function getEditorRows(Language $language): array
    {
        $fallbackLocale = config('app.fallback_locale', 'en');
        $fallbackTranslations = self::loadJsonFile($fallbackLocale);
        $languageFileTranslations = self::loadJsonFile($language->code);
        $dbTranslations = $language->translations()
            ->pluck('translation_value', 'translation_key')
            ->all();
        $discoveredKeys = self::discoverCodeTranslationKeys();

        $keys = collect(array_keys($fallbackTranslations))
            ->merge(array_keys($languageFileTranslations))
            ->merge(array_keys($dbTranslations))
            ->merge($discoveredKeys)
            ->unique()
            ->sort()
            ->values();

        return $keys->map(function ($key) use ($fallbackTranslations, $languageFileTranslations, $dbTranslations) {
            return [
                'key' => $key,
                'fallback' => $fallbackTranslations[$key] ?? $key,
                'value' => $dbTranslations[$key] ?? $languageFileTranslations[$key] ?? '',
            ];
        })->all();
    }

    public static function loadJsonFile(string $locale): array
    {
        $path = lang_path($locale . '.json');

        if (! File::exists($path)) {
            return [];
        }

        return json_decode(File::get($path), true) ?? [];
    }

    public static function flushCache(?string $locale = null): void
    {
        Cache::forget('translations.supported_languages');
        Cache::forget('translations.discovered_keys');

        if ($locale) {
            Cache::forget("translations.map.{$locale}");
            return;
        }

        Language::query()->pluck('code')->each(function ($code) {
            Cache::forget("translations.map.{$code}");
        });
    }

    protected static function discoverCodeTranslationKeys(): array
    {
        return Cache::remember('translations.discovered_keys', now()->addMinutes(30), function () {
            $paths = [
                resource_path('js'),
                resource_path('views'),
                app_path(),
            ];

            $keys = collect();

            foreach ($paths as $path) {
                if (! File::isDirectory($path)) {
                    continue;
                }

                foreach (File::allFiles($path) as $file) {
                    if (! self::shouldScanFile($file->getFilename())) {
                        continue;
                    }

                    $contents = File::get($file->getPathname());

                    preg_match_all('/\bt\(\s*[\'"]([^\'"]+)[\'"]\s*[\),]/', $contents, $matches);

                    if (! empty($matches[1])) {
                        $keys = $keys->merge($matches[1]);
                    }
                }
            }

            return $keys
                ->filter(fn ($key) => is_string($key) && trim($key) !== '')
                ->map(fn ($key) => trim($key))
                ->unique()
                ->sort()
                ->values()
                ->all();
        });
    }

    protected static function shouldScanFile(string $filename): bool
    {
        return collect(self::TRANSLATION_FILE_EXTENSIONS)->contains(function ($extension) use ($filename) {
            return str_ends_with($filename, '.' . $extension) || $filename === $extension;
        });
    }
}
