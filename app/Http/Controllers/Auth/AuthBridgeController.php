<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuthBridge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthBridgeController extends Controller
{
    public function __invoke(Request $request, string $token)
    {
        $payload = AuthBridge::consume($token);

        if (! $payload || empty($payload['user_id'])) {
            if ($request->boolean('silent')) {
                return response('expired', 410);
            }

            return redirect()
                ->to(AuthBridge::sanitizeReturnTo(config('property.frontend_url')))
                ->with('error', 'Your login link expired. Please try again.');
        }

        $user = User::query()->find($payload['user_id']);

        if (! $user) {
            if ($request->boolean('silent')) {
                return response('missing', 404);
            }

            return redirect()
                ->to(AuthBridge::sanitizeReturnTo(config('property.frontend_url')))
                ->with('error', 'Unable to complete login.');
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        if ($request->boolean('silent')) {
            return response('ok', 200)->header('Content-Type', 'text/plain');
        }

        $returnTo = AuthBridge::sanitizeReturnTo($payload['return_to'] ?? null);

        // Keep Laravel's "intended" URL aligned with the requested destination.
        $request->session()->put('url.intended', $returnTo);

        // Append one-time token for property frontend (Google OAuth path).
        if ($request->boolean('with_token') || $this->isPropertyOrigin($returnTo)) {
            $plain = $user->createToken('property_web')->plainTextToken;
            $separator = str_contains($returnTo, '?') ? '&' : '?';
            $returnTo .= $separator.'auth_token='.urlencode($plain);
        }

        return redirect()->to($returnTo);
    }

    protected function isPropertyOrigin(string $url): bool
    {
        $parts = parse_url($url);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return false;
        }

        $origin = strtolower($parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : ''));
        $property = rtrim((string) config('property.frontend_url'), '/');

        return in_array($origin, array_filter([
            $property,
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://property.xpertbid.com',
            'http://property.xpertbid.com',
            'https://www.property.xpertbid.com',
            'http://www.property.xpertbid.com',
        ]), true);
    }
}
