<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PhoneAuthController;
use App\Models\NewNotification;
use App\Models\User;
use App\Support\AuthBridge;
use App\Support\EmailLogRecorder;
use App\Support\EmailVerificationCodeSender;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
            'return_to' => ['nullable', 'string', 'max:2048'],
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->string('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        $input = $request->input('email');
        $field = filter_var($input, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        if (! Auth::validate([$field => $input, 'password' => $request->input('password')])) {
            RateLimiter::hit($throttleKey);
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($throttleKey);

        /** @var User $user */
        $user = User::query()->where($field, $input)->firstOrFail();

        return response()->json($this->authPayload($user, $request->input('return_to')));
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:25'],
            'password' => ['required', Rules\Password::defaults()],
            'return_to' => ['nullable', 'string', 'max:2048'],
            'signup_source' => ['nullable', 'string', 'max:50'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->filled('phone') ? preg_replace('/\s+/', '', (string) $request->phone) : null,
            'password' => Hash::make($request->password),
            'role' => 'User',
            'signup_source' => $request->input('signup_source', 'property_web'),
        ]);

        try {
            EmailVerificationCodeSender::send($user);
        } catch (\Throwable $e) {
            EmailLogRecorder::failed(
                $user->email,
                'Your Verification Code',
                'VerificationCodeMail',
                $e
            );
        }

        return response()->json($this->authPayload($user, $request->input('return_to')), 201);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $this->userPayload($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()?->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out.']);
    }

    public function sessionLink(Request $request): JsonResponse
    {
        $request->validate([
            'to' => ['required', 'string', 'max:2048'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $to = AuthBridge::sanitizeReturnTo($request->input('to'));

        // Prefer exact target URL; do not fall back to property home for main-site paths.
        $parts = parse_url((string) $request->input('to'));
        if (is_array($parts) && ! empty($parts['scheme']) && ! empty($parts['host'])) {
            $origin = strtolower($parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : ''));
            if (in_array($origin, AuthBridge::allowedOrigins(), true)) {
                $to = (string) $request->input('to');
            }
        }

        return response()->json([
            'url' => AuthBridge::issue($user, $to),
        ]);
    }

    public function sendOtp(Request $request)
    {
        return app(PhoneAuthController::class)->sendOtp($request);
    }

    public function verifyOtp(Request $request)
    {
        $response = app(PhoneAuthController::class)->verifyOtp($request);
        $payload = $response->getData(true);

        if ($response->getStatusCode() >= 400) {
            return $response;
        }

        $user = isset($payload['user']['id'])
            ? User::query()->find($payload['user']['id'])
            : null;

        if (! $user) {
            return response()->json(['message' => 'Unable to complete login.'], 500);
        }

        $auth = $this->authPayload($user, $request->input('return_to'));

        return response()->json([
            'message' => $payload['message'] ?? 'OTP verified successfully.',
            ...$auth,
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $notifications = NewNotification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(40)
            ->get();

        return response()->json(['data' => $notifications]);
    }

    public function markNotificationRead(Request $request, int $id): JsonResponse
    {
        $notification = NewNotification::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->read_at = now();
        $notification->save();

        return response()->json([
            'message' => 'Notification marked as read',
            'data' => $notification,
        ]);
    }

    public function markAllNotificationsRead(Request $request): JsonResponse
    {
        NewNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function deleteNotification(Request $request, int $id): JsonResponse
    {
        $notification = NewNotification::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * @return array{message: string, token: string, user: array<string, mixed>, redirect_url: string}
     */
    protected function authPayload(User $user, ?string $returnTo = null): array
    {
        $token = $user->createToken('property_web')->plainTextToken;

        return [
            'message' => 'Authenticated.',
            'token' => $token,
            'user' => $this->userPayload($user),
            'redirect_url' => AuthBridge::issue($user, $returnTo),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'profile_pic' => $user->profile_pic,
            'role' => $user->role,
        ];
    }
}
