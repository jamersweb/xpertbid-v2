<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $role = strtolower((string) ($user?->role ?? ''));
        $isAdmin = in_array($role, ['admin', 'superadmin'], true);
        $routePermissions = [
            'admin.dashboard' => 'dashboard-list',
            'admin.users.*' => 'user-list',
            'admin.roles.*' => 'role-list',
            'admin.listings.*' => 'auction-list',
            'admin.live.*' => 'auction-list',
            'admin.live-auctions.*' => 'auction-list',
            'admin.bids.*' => 'auction-list',
            'admin.orders.*' => 'order-list',
            'admin.verifications.auctions.*' => 'auction-verification-list',
            'admin.verifications.individual.*' => 'individual-verification-list',
            'admin.verifications.corporate.*' => 'corporate-verification-list',
            'admin.categories.*' => 'category-list',
            'admin.dynamic-fields.*' => 'category-list',
            'admin.malls.*' => 'mall-list',
            'admin.blogs.*' => 'blog-list',
            'admin.sliders.*' => 'slider-list',
            'admin.seo.*' => 'seo-list',
        ];

        $hasRoutePermission = false;

        $rolePermissions = [];

        if ($user) {
            $matchedRole = Role::query()
                ->whereRaw('LOWER(name) = ?', [$role])
                ->with('permissions:id,name')
                ->first();

            $rolePermissions = $matchedRole
                ? $matchedRole->permissions->pluck('name')->all()
                : [];

            foreach ($routePermissions as $routePattern => $permission) {
                if ($request->routeIs($routePattern) && ($user->can($permission) || in_array($permission, $rolePermissions, true))) {
                    $hasRoutePermission = true;
                    break;
                }
            }
        }

        if (!$user || (!$isAdmin && !$hasRoutePermission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return redirect()->route('home')->with('error', 'Unauthorized access.');
        }

        return $next($request);
    }
}
