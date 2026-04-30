<?php

namespace App\Support;

final class YoutubeVideoId
{
    /**
     * Accepts a bare 11-character ID or common YouTube / YouTube Live URL shapes.
     */
    public static function normalize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $value)) {
            return $value;
        }

        $patterns = [
            '/youtube\.com\/watch\?[^#\s]*v=([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/',
            '/youtu\.be\/([a-zA-Z0-9_-]{11})/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value, $m)) {
                return $m[1];
            }
        }

        return null;
    }
}
