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
                return $this->silentHtmlResponse(false, 410);
            }

            return redirect()
                ->to(AuthBridge::sanitizeReturnTo(config('property.frontend_url')))
                ->with('error', 'Your login link expired. Please try again.');
        }

        $user = User::query()->find($payload['user_id']);

        if (! $user) {
            if ($request->boolean('silent')) {
                return $this->silentHtmlResponse(false, 404);
            }

            return redirect()
                ->to(AuthBridge::sanitizeReturnTo(config('property.frontend_url')))
                ->with('error', 'Unable to complete login.');
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        if ($request->boolean('silent')) {
            return $this->silentHtmlResponse(true, 200);
        }

        $returnTo = AuthBridge::sanitizeReturnTo($payload['return_to'] ?? null);

        // Keep Laravel's "intended" URL aligned with the requested destination.
        $request->session()->put('url.intended', $returnTo);

        // Append one-time Sanctum token for satellite Next frontends (property + home).
        if ($request->boolean('with_token') || $this->isSatelliteFrontendOrigin($returnTo)) {
            $plain = $user->createToken('property_web')->plainTextToken;
            $separator = str_contains($returnTo, '?') ? '&' : '?';
            $returnTo .= $separator.'auth_token='.urlencode($plain);
        }

        return redirect()->to($returnTo);
    }

    protected function silentHtmlResponse(bool $ok, int $status)
    {
        $flag = $ok ? 'true' : 'false';
        $html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Syncing</title></head><body>'
            .'<script>(function(){var m={type:"xb-auth-sync",ok:'.$flag.'};'
            .'try{if(window.opener)window.opener.postMessage(m,"*");}catch(e){}'
            .'try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,"*");}catch(e){}'
            .'try{window.close();}catch(e){}'
            .'})();</script>ok</body></html>';

        return response($html, $status)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    protected function isSatelliteFrontendOrigin(string $url): bool
    {
        $parts = parse_url($url);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return false;
        }

        $origin = strtolower($parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : ''));
        $property = rtrim((string) config('property.frontend_url'), '/');
        $renovation = rtrim((string) config('renovation.frontend_url'), '/');

        return in_array($origin, array_filter([
            $property,
            $renovation,
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'https://property.xpertbid.com',
            'http://property.xpertbid.com',
            'https://www.property.xpertbid.com',
            'http://www.property.xpertbid.com',
            'https://build.xpertbid.com',
            'http://build.xpertbid.com',
            'https://www.build.xpertbid.com',
            'http://www.build.xpertbid.com',
            'https://home.xpertbid.com',
            'http://home.xpertbid.com',
            'https://www.home.xpertbid.com',
            'http://www.home.xpertbid.com',
            'https://renovation.xpertbid.com',
            'http://renovation.xpertbid.com',
        ]), true);
    }
}
