<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Support\AuthBridge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Credentialed JSON SSO for satellite Next apps (property + renovation).
 * Works zero-bounce on live when SESSION_DOMAIN=.xpertbid.com (same-site cookies).
 * Localhost ports are cross-site under SameSite=Lax — FE stays guest until local login.
 */
class SatelliteTokenController extends Controller
{
    public function token(Request $request): JsonResponse|Response
    {
        if ($cors = $this->preflightOrReject($request)) {
            return $cors;
        }

        if (! Auth::check()) {
            return $this->json($request, ['authenticated' => false]);
        }

        $user = Auth::user();
        $origin = (string) $request->header('Origin');
        $tokenName = str_contains($origin, 'build') || str_contains($origin, ':3000')
            ? 'renovation_web'
            : 'property_web';

        // Prune old tokens over 30 days without deleting active tokens of other satellites / tabs
        $user->tokens()->where('created_at', '<', now()->subDays(30))->delete();

        $plain = $user->createToken($tokenName)->plainTextToken;

        return $this->json($request, [
            'authenticated' => true,
            'token' => $plain,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_pic' => $user->profile_pic,
                'role' => $user->role,
                'is_corporate_verified' => $user->isCorporateVerified(),
                'is_verified' => $user->isCorporateVerified() || $user->isIndividualVerified(),
                'verification_type' => $user->publicVerificationType(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse|Response
    {
        if ($cors = $this->preflightOrReject($request)) {
            return $cors;
        }

        if (Auth::check()) {
            $user = Auth::user();
            if ($user) {
                $user->tokens()->whereIn('name', ['property_web', 'renovation_web'])->delete();
            }
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return $this->json($request, ['ok' => true]);
    }

    public function options(Request $request): Response
    {
        $origin = $this->requestOrigin($request);
        if (! $origin || ! $this->originAllowed($origin)) {
            return response('', 403);
        }

        return response('', 204)->withHeaders($this->corsHeaders($origin));
    }

    protected function preflightOrReject(Request $request): ?Response
    {
        $origin = $this->requestOrigin($request);
        if (! $origin || ! $this->originAllowed($origin)) {
            return response('Origin not allowed', 403);
        }

        return null;
    }

    protected function json(Request $request, array $payload): JsonResponse
    {
        $origin = $this->requestOrigin($request) ?: '';

        return response()
            ->json($payload)
            ->withHeaders($this->corsHeaders($origin));
    }

    /**
     * @return array<string, string>
     */
    protected function corsHeaders(string $origin): array
    {
        return [
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Accept, Content-Type, X-Requested-With',
            'Access-Control-Max-Age' => '3600',
            'Vary' => 'Origin',
        ];
    }

    protected function requestOrigin(Request $request): ?string
    {
        $origin = $request->headers->get('Origin');
        if (! is_string($origin) || $origin === '') {
            return null;
        }

        return rtrim($origin, '/');
    }

    protected function originAllowed(string $origin): bool
    {
        return in_array(strtolower($origin), array_map('strtolower', AuthBridge::allowedOrigins()), true);
    }
}
