<?php

namespace App\Http\Middleware;

use App\Models\Favorite;
use App\Support\TranslationManager;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Role;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $authUser = $request->user()?->loadMissing(['individualVerification', 'corporateVerification']);
        $authPermissions = [];

        if ($authUser && method_exists($authUser, 'getAllPermissions')) {
            $authPermissions = $authUser->getAllPermissions()->pluck('name')->values()->all();

            $matchedRole = Role::query()
                ->whereRaw('LOWER(name) = ?', [strtolower((string) $authUser->role)])
                ->with('permissions:id,name')
                ->first();

            $rolePermissions = $matchedRole
                ? $matchedRole->permissions->pluck('name')->all()
                : [];

            $authPermissions = array_values(array_unique([...$authPermissions, ...$rolePermissions]));
        }
        $currentLocale = app()->getLocale();
        $supportedLocales = TranslationManager::getSupportedLanguages();
        $translations = TranslationManager::getTranslations($currentLocale);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser,
                'permissions' => $authPermissions,
            ],
            'cart' => $request->user() ? \App\Models\Cart::where('user_id', $request->user()->id)
                ->with(['listing' => function ($query) {
                    $query->select('id', 'title', 'slug', 'image', 'status', 'description', 'user_id', 'listing_type', 'listing_data');
                }, 'variation'])
                ->get()
                ->map(function ($cartItem) {
                    return [
                        'id' => $cartItem->id,
                        'listing_id' => $cartItem->listing_id,
                        'variation_id' => $cartItem->variation_id,
                        'type' => $cartItem->type,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->price,
                        'title' => $cartItem->listing->title ?? 'Unknown Product',
                        'slug' => $cartItem->listing->slug ?? null,
                        'image' => $cartItem->listing->image_url ?? null,
                        'description' => $cartItem->listing->description ?? null,
                        'list_type' => $cartItem->listing->list_type ?? 'auction',
                        'variation_name' => $cartItem->variation->name ?? $cartItem->variation_name,
                    ];
                }) : [],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'info' => $request->session()->get('info'),
            ],
            'propertyFrontendUrl' => rtrim((string) config('property.frontend_url'), '/') ?: 'https://property.xpertbid.com',
            'propertyRootCategoryId' => (int) config('property.root_category_id', 222),
            'locale' => [
                'current' => $currentLocale,
                'fallback' => config('app.fallback_locale', 'en'),
                'supported' => $supportedLocales,
            ],
            'translations' => $translations,
            'favoriteListingIds' => $request->user()
                ? Favorite::where('user_id', $request->user()->id)->pluck('listing_id')->all()
                : [],
        ];
    }
}
