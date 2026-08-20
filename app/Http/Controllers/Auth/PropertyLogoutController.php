<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\AuthBridge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * End the main-site web session, then send the browser back to property.
 */
class PropertyLogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $returnTo = $this->resolveReturnTo($request->query('return_to'));

        return redirect()->away($this->appendQuery($returnTo, 'logged_out', '1'));
    }

    protected function resolveReturnTo(mixed $returnTo): string
    {
        $fallback = rtrim((string) config('property.frontend_url'), '/') ?: 'https://property.xpertbid.com';
        $candidate = AuthBridge::sanitizeReturnTo(is_string($returnTo) ? $returnTo : null);
        $parts = parse_url($candidate);

        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return $fallback;
        }

        $origin = strtolower(
            $parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : '')
        );

        $allowed = array_values(array_filter([
            $fallback,
            'https://property.xpertbid.com',
            'http://property.xpertbid.com',
            'https://www.property.xpertbid.com',
            'http://www.property.xpertbid.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ]));

        if (! in_array($origin, $allowed, true)) {
            return $fallback;
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
