<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): \Inertia\Response
    {
        return \Inertia\Inertia::render('Auth/Login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
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

        // Define permission-to-route mapping in order of priority
        $permissionRoutes = [
            'dashboard-list' => 'dashboard',
            'user-list' => 'users.index',
            'role-list' => 'roles.index',
            'auction-list' => 'auctions.index',
            'category-list' => 'auction_categories.index',
            'blog-list' => 'blogs.index',
            'seo-list' => 'seo.index',
            'scraper-list' => 'scraper.index',
            'olx-scraper-list' => 'olx-scraper.index',
            'slider-list' => 'sliders.index',
            'order-list' => 'orders.index',
            'wallet-list' => 'wallets.index',
            'transaction-list' => 'transactions.index',
        ];

        // Find the first route the user has permission to access
        foreach ($permissionRoutes as $permission => $route) {
            if ($user->can($permission)) {
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
