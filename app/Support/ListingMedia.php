<?php

namespace App\Support;

class ListingMedia
{
    public const IMAGE_EXTENSIONS = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'bmp',
        'svg',
        'avif',
        'heic',
        'heif',
    ];

    public const VIDEO_EXTENSIONS = [
        'mp4',
        'mov',
        'avi',
        'mkv',
        'webm',
        'm4v',
    ];

    public const MEDIA_EXTENSIONS = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'bmp',
        'svg',
        'avif',
        'heic',
        'heif',
        'mp4',
        'mov',
        'avi',
        'mkv',
        'webm',
        'm4v',
    ];

    public const DEFAULT_DIRECTORIES = [
        'assets/images/auction',
        'assets/images/listing_images',
    ];

    public static function decodeList(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map(
                fn ($item) => is_scalar($item) ? trim((string) $item) : null,
                $value
            )));
        }

        if (!is_string($value)) {
            return [];
        }

        $trimmed = trim($value);
        if ($trimmed === '') {
            return [];
        }

        $decoded = json_decode($trimmed, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return self::decodeList($decoded);
        }

        return [$trimmed];
    }

    public static function normalizePath(mixed $path): ?string
    {
        if (!is_scalar($path)) {
            return null;
        }

        $normalized = trim((string) $path);
        if ($normalized === '') {
            return null;
        }

        if (in_array(strtolower($normalized), ['null', 'undefined', '[]', '[ ]', 'false'], true)) {
            return null;
        }

        $normalized = str_replace('\\', '/', $normalized);

        if (str_starts_with($normalized, 'http://') || str_starts_with($normalized, 'https://')) {
            return $normalized;
        }

        return '/' . ltrim(preg_replace('#/+#', '/', $normalized) ?? $normalized, '/');
    }

    public static function isDisplayableImage(mixed $path): bool
    {
        return self::hasAllowedExtension($path, self::IMAGE_EXTENSIONS);
    }

    public static function isStorableMedia(mixed $path): bool
    {
        return self::hasAllowedExtension($path, self::MEDIA_EXTENSIONS);
    }

    public static function firstDisplayableImage(iterable $paths): ?string
    {
        foreach ($paths as $path) {
            $normalized = self::normalizePath($path);

            if ($normalized !== null && self::isDisplayableImage($normalized)) {
                return $normalized;
            }
        }

        return null;
    }

    public static function buildAssetUrl(mixed $path): ?string
    {
        $normalized = self::normalizePath($path);

        if ($normalized === null || !self::isDisplayableImage($normalized)) {
            return null;
        }

        if (str_starts_with($normalized, 'http://') || str_starts_with($normalized, 'https://')) {
            return $normalized;
        }

        return asset(ltrim($normalized, '/'));
    }

    public static function buildAssetUrls(iterable $paths): array
    {
        $urls = [];

        foreach ($paths as $path) {
            $url = self::buildAssetUrl($path);

            if ($url !== null && !in_array($url, $urls, true)) {
                $urls[] = $url;
            }
        }

        return $urls;
    }

    public static function defaultSearchDirectories(mixed $path = null): array
    {
        $directories = [];
        $normalized = self::normalizePath($path);

        if ($normalized !== null) {
            $component = strtolower(self::pathComponent($normalized));

            if (str_contains($component, '/assets/images/auction/')) {
                $directories[] = 'assets/images/auction';
            }

            if (str_contains($component, '/assets/images/listing_images/')) {
                $directories[] = 'assets/images/listing_images';
            }
        }

        return array_values(array_unique(array_merge($directories, self::DEFAULT_DIRECTORIES)));
    }

    public static function repairImagePath(mixed $path, ?array $searchDirectories = null): ?string
    {
        return self::repairPath($path, $searchDirectories, self::IMAGE_EXTENSIONS);
    }

    public static function repairMediaPath(mixed $path, ?array $searchDirectories = null): ?string
    {
        return self::repairPath($path, $searchDirectories, self::MEDIA_EXTENSIONS);
    }

    public static function repairMediaList(mixed $paths, ?array $searchDirectories = null): array
    {
        $repaired = [];

        foreach (self::decodeList($paths) as $path) {
            $fixed = self::repairMediaPath($path, $searchDirectories ?? self::defaultSearchDirectories($path));

            if ($fixed !== null && !in_array($fixed, $repaired, true)) {
                $repaired[] = $fixed;
            }
        }

        return $repaired;
    }

    protected static function repairPath(mixed $path, ?array $searchDirectories, array $allowedExtensions): ?string
    {
        $normalized = self::normalizePath($path);

        if ($normalized === null) {
            return null;
        }

        if (self::hasAllowedExtension($normalized, $allowedExtensions)) {
            return $normalized;
        }

        $component = self::pathComponent($normalized);
        $stem = pathinfo(rtrim($component, '.'), PATHINFO_FILENAME);

        if ($stem === '') {
            return null;
        }

        $matches = self::findMatchingPaths(
            $stem,
            $searchDirectories ?? self::defaultSearchDirectories($normalized),
            $allowedExtensions,
        );

        return count($matches) === 1 ? $matches[0] : null;
    }

    protected static function hasAllowedExtension(mixed $path, array $allowedExtensions): bool
    {
        $normalized = self::normalizePath($path);

        if ($normalized === null) {
            return false;
        }

        $component = self::pathComponent($normalized);

        if (str_ends_with($component, '.')) {
            return false;
        }

        $extension = strtolower(pathinfo($component, PATHINFO_EXTENSION));

        return $extension !== '' && in_array($extension, $allowedExtensions, true);
    }

    protected static function findMatchingPaths(string $stem, array $searchDirectories, array $allowedExtensions): array
    {
        $publicRoot = str_replace('\\', '/', public_path());
        $matches = [];

        foreach ($searchDirectories as $directory) {
            $relativeDirectory = trim(str_replace('\\', '/', (string) $directory), '/');
            if ($relativeDirectory === '') {
                continue;
            }

            $absoluteDirectory = public_path($relativeDirectory);
            if (!is_dir($absoluteDirectory)) {
                continue;
            }

            $candidates = glob($absoluteDirectory . DIRECTORY_SEPARATOR . $stem . '.*') ?: [];

            foreach ($candidates as $candidate) {
                $candidatePath = str_replace('\\', '/', $candidate);
                $extension = strtolower(pathinfo($candidatePath, PATHINFO_EXTENSION));

                if ($extension === '' || !in_array($extension, $allowedExtensions, true)) {
                    continue;
                }

                if (!str_starts_with($candidatePath, $publicRoot)) {
                    continue;
                }

                $relativePath = '/' . ltrim(substr($candidatePath, strlen($publicRoot)), '/');

                if (!in_array($relativePath, $matches, true)) {
                    $matches[] = $relativePath;
                }
            }
        }

        return $matches;
    }

    protected static function pathComponent(string $path): string
    {
        return parse_url($path, PHP_URL_PATH) ?: $path;
    }
}
