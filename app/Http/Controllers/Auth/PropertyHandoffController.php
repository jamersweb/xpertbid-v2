<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\AuthBridge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Main site → property frontend SSO.
 * Property visits this while holding a first-party Laravel session cookie,
 * then gets redirected back with a Sanctum auth_token for localStorage.
 */
class PropertyHandoffController extends Controller
{
    public function __invoke(Request $request)
    {
        $returnTo = $this->resolveReturnTo($request->query('return_to'));

        if (! Auth::check()) {
            return redirect()->away($this->appendQuery($returnTo, 'auth_checked', '1'));
        }

        $user = Auth::user();

        // Keep a single property web token per user.
        $user->tokens()->where('name', 'property_web')->delete();
        $plain = $user->createToken('property_web')->plainTextToken;

        return redirect()->away($this->appendQuery($returnTo, 'auth_token', $plain));
    }

    protected function resolveReturnTo(mixed $returnTo): string
    {
        $candidate = AuthBridge::sanitizeReturnTo(is_string($returnTo) ? $returnTo : null);
        $parts = parse_url($candidate);

        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return rtrim((string) config('property.frontend_url'), '/') ?: 'https://property.xpertbid.com';
        }

        $origin = strtolower(
            $parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : '')
        );

        $allowed = array_values(array_filter([
            rtrim((string) config('property.frontend_url'), '/'),
            'https://property.xpertbid.com',
            'http://property.xpertbid.com',
            'https://www.property.xpertbid.com',
            'http://www.property.xpertbid.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ]));

        if (! in_array($origin, $allowed, true)) {
            return rtrim((string) config('property.frontend_url'), '/') ?: 'https://property.xpertbid.com';
        }

        return $candidate;
    }

    protected function appendQuery(string $url, string $key, string $value): string
    {
        $parts = parse_url($url);
        if (! is_array($parts)) {
            return $url;
        }

        $query = [];
        if (! empty($parts['query'])) {
            parse_str($parts['query'], $query);
        }
        $query[$key] = $value;

        $rebuilt = ($parts['scheme'] ?? 'https').'://'.($parts['host'] ?? '');
        if (! empty($parts['port'])) {
            $rebuilt .= ':'.$parts['port'];
        }
        $rebuilt .= $parts['path'] ?? '/';
        $qs = http_build_query($query);
        if ($qs !== '') {
            $rebuilt .= '?'.$qs;
        }
        if (! empty($parts['fragment'])) {
            $rebuilt .= '#'.$parts['fragment'];
        }

        return $rebuilt;
    }
}
