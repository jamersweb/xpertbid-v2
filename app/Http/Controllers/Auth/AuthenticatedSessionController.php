<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;
use App\Support\EmailVerificationCodeSender;
use App\Support\EmailLogRecorder;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): RedirectResponse
    {
        return redirect()->route('home', ['auth' => 'login']);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::user();

        // If email is not verified, send fresh verification code right after login.
        if (!$user->hasVerifiedEmail()) {
            try {
                EmailVerificationCodeSender::send($user);
            } catch (\Throwable $e) {
                EmailLogRecorder::failed(
                    $user->email,
                    'Your Verification Code',
                    'VerificationCodeMail',
                    $e
                );

                Log::warning('Email verification code failed on login', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return redirect()->route('verification.notice');
        }

        // Check for admin role first
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $matchedRole = Role::query()
            ->whereRaw('LOWER(name) = ?', [strtolower((string) $user->role)])
            ->with('permissions:id,name')
            ->first();

        $rolePermissions = $matchedRole
            ? $matchedRole->permissions->pluck('name')->all()
            : [];

        if (
            strtolower((string) $user->role) === 'seo'
            && Route::has('admin.seo.index')
            && ($user->can('seo-list') || in_array('seo-list', $rolePermissions, true))
        ) {
            return redirect()->route('admin.seo.index');
        }

        // Define permission-to-route mapping in order of priority
        $permissionRoutes = [
            'dashboard-list' => 'admin.dashboard',
            'user-list' => 'admin.users.index',
            'role-list' => 'admin.roles.index',
            'auction-list' => 'admin.listings.index',
            'category-list' => 'admin.categories.index',
            'blog-list' => 'admin.blogs.index',
            'seo-list' => 'admin.seo.index',
            'slider-list' => 'admin.sliders.index',
            'order-list' => 'admin.orders.index',
        ];

        // Find the first route the user has permission to access
        foreach ($permissionRoutes as $permission => $route) {
            if (($user->can($permission) || in_array($permission, $rolePermissions, true)) && Route::has($route)) {
                return redirect()->route($route);
            }
        }

        // Fallback: if no permissions match, redirect to dashboard (will show 403 if no access)
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
