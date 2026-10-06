<?php

namespace App\Support;

class SchemaMarkup
{
    public static function blocksFromInertiaPage(array $page): array
    {
        $props = $page['props'] ?? [];

        $markup = self::firstNonEmpty([
            data_get($props, 'currentCategory.schema_markup'),
            data_get($props, 'currentTopCategory.schema_markup'),
            data_get($props, 'pageSeo.schema_markup'),
            data_get($props, 'blog.schema_markup'),
            data_get($props, 'auction.category.schema_markup'),
        ]);

        return self::extractBlocks(is_string($markup) ? $markup : null);
    }

    /**
     * @return list<string>
     */
    public static function extractBlocks(?string $schemaMarkup): array
    {
        if (!is_string($schemaMarkup)) {
            return [];
        }

        $rawMarkup = trim($schemaMarkup);
        if ($rawMarkup === '') {
            return [];
        }

        $searchable = self::normalizeJsonText($rawMarkup);
        if ($searchable === '') {
            return [];
        }

        $blocks = [];
        $cursor = 0;
        $length = strlen($searchable);

        while ($cursor < $length) {
            $objectStart = strpos($searchable, '{', $cursor);
            $arrayStart = strpos($searchable, '[', $cursor);
            $starts = array_values(array_filter(
                [$objectStart, $arrayStart],
                static fn ($value) => $value !== false
            ));

            if ($starts === []) {
                break;
            }

            $start = min($starts);
            $parsed = self::readJsonValue($searchable, $start);
            if ($parsed === null) {
                $cursor = $start + 1;
                continue;
            }

            $encoded = json_encode(
                $parsed['value'],
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG
            );

            if (is_string($encoded) && $encoded !== '') {
                $blocks[] = $encoded;
            }

            $cursor = $parsed['end'];
        }

        return $blocks;
    }

    private static function firstNonEmpty(array $values): ?string
    {
        foreach ($values as $value) {
            if (is_string($value) && trim($value) !== '') {
                return $value;
            }
        }

        return null;
    }

    private static function normalizeJsonText(string $value): string
    {
        $value = preg_replace('/^\x{FEFF}/u', '', $value) ?? $value;
        $value = preg_replace('/<!--.*?-->/s', ' ', $value) ?? $value;
        $value = preg_replace('/<script\b[^>]*>/i', ' ', $value) ?? $value;
        $value = preg_replace('/<\/script>/i', ' ', $value) ?? $value;
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim($value);
    }

    /**
     * @return array{value: mixed, end: int}|null
     */
    private static function readJsonValue(string $text, int $start): ?array
    {
        $opener = $text[$start] ?? '';
        if ($opener !== '{' && $opener !== '[') {
            return null;
        }

        $pair = ['{' => '}', '[' => ']'];
        $stack = [$opener];
        $inString = false;
        $escaped = false;
        $length = strlen($text);

        for ($index = $start + 1; $index < $length; $index++) {
            $char = $text[$index];

            if ($inString) {
                if ($escaped) {
                    $escaped = false;
                    continue;
                }
                if ($char === '\\') {
                    $escaped = true;
                    continue;
                }
                if ($char === '"') {
                    $inString = false;
                }
                continue;
            }

            if ($char === '"') {
                $inString = true;
                continue;
            }

            if ($char === '{' || $char === '[') {
                $stack[] = $char;
                continue;
            }

            if ($char === '}' || $char === ']') {
                $last = $stack[array_key_last($stack)] ?? null;
                if ($last === null || $pair[$last] !== $char) {
                    return null;
                }
                array_pop($stack);
                if ($stack === []) {
                    $slice = substr($text, $start, ($index + 1) - $start);
                    $decoded = json_decode($slice, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        return null;
                    }

                    return [
                        'value' => $decoded,
                        'end' => $index + 1,
                    ];
                }
            }
        }

        return null;
    }
}
