<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthBridge
{
    public static function issue(User $user, ?string $returnTo = null): string
    {
        $token = Str::random(64);

        Cache::put(
            self::cacheKey($token),
            [
                'user_id' => $user->id,
                'return_to' => self::sanitizeReturnTo($returnTo),
            ],
            now()->addMinutes(2)
        );

        return url('/auth/bridge/'.$token);
    }

    public static function consume(string $token): ?array
    {
        $payload = Cache::pull(self::cacheKey($token));

        return is_array($payload) ? $payload : null;
    }

    public static function sanitizeReturnTo(?string $returnTo): string
    {
        // Prefer the caller-supplied return_to. Only fall back when missing/invalid.
        // Do not force property.xpertbid.com when the request came from home/renovation.
        $fallback = rtrim((string) config('property.frontend_url'), '/') ?: url('/');

        if (! $returnTo) {
            return $fallback;
        }

        $parts = parse_url($returnTo);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return $fallback;
        }

        $origin = strtolower($parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : ''));
        $allowed = self::allowedOrigins();

        if (! in_array($origin, $allowed, true)) {
            return $fallback;
        }

        return $returnTo;
    }

    /**
     * @return list<string>
     */
    public static function allowedOrigins(): array
    {
        $appUrl = rtrim((string) config('app.url'), '/');
        $propertyUrl = rtrim((string) config('property.frontend_url'), '/');
        $renovationUrl = rtrim((string) config('renovation.frontend_url'), '/');

        return array_values(array_filter(array_unique([
            $appUrl,
            $propertyUrl,
            $renovationUrl,
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'http://localhost:8000',
            'http://127.0.0.1:8000',
            'https://xpertbid.com',
            'https://www.xpertbid.com',
            'http://xpertbid.com',
            'http://www.xpertbid.com',
            'https://property.xpertbid.com',
            'http://property.xpertbid.com',
            'https://www.property.xpertbid.com',
            'http://www.property.xpertbid.com',
            // Live home-renovation frontend
            'https://home.xpertbid.com',
            'http://home.xpertbid.com',
            'https://www.home.xpertbid.com',
            'http://www.home.xpertbid.com',
            // Legacy hostname (keep until DNS fully cut over)
            'https://renovation.xpertbid.com',
            'http://renovation.xpertbid.com',
            'https://www.renovation.xpertbid.com',
            'http://www.renovation.xpertbid.com',
        ])));
    }

    protected static function cacheKey(string $token): string
    {
        return 'auth_bridge:'.$token;
    }
}
