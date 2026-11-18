<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
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
        $authUser = $request->user();
        $authPermissions = [];
        $verificationSummary = [
            'individual_status' => null,
            'corporate_status' => null,
            'is_verified' => false,
        ];

        if ($authUser) {
            // Status-only queries — never attach full KYC records (PII/docs) to shared auth.user
            $individualStatus = $authUser->individualVerification()->value('status');
            $corporateStatus = $authUser->corporateVerification()->value('status');
            $approved = ['verified', 'approved'];
            $verificationSummary = [
                'individual_status' => $individualStatus,
                'corporate_status' => $corporateStatus,
                'is_verified' => in_array(strtolower((string) $individualStatus), $approved, true)
                    || in_array(strtolower((string) $corporateStatus), $approved, true),
            ];

            // Ensure relation attributes are not leaked if previously eager-loaded elsewhere
            $authUser->unsetRelation('individualVerification');
            $authUser->unsetRelation('corporateVerification');
            $authUser->unsetRelation('identity_verification');
        }

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
        $translations = $this->scopeTranslations(
            TranslationManager::getTranslations($currentLocale),
            $request,
            $currentLocale,
            $authUser
        );

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser,
                'permissions' => $authPermissions,
                'verification' => $verificationSummary,
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
            'ziggy' => function () use ($request, $authUser) {
                $ziggy = new Ziggy;

                $excluded = [
                    'debugbar.*',
                    'horizon.*',
                    'telescope.*',
                    'sanctum.*',
                    'ignition.*',
                ];

                $role = strtolower((string) ($authUser?->role ?? ''));
                $isAdmin = in_array($role, ['admin', 'superadmin'], true);

                // Don't leak the admin route map to public/non-admin users.
                if (! $isAdmin) {
                    $excluded[] = 'admin.*';
                }

                // KYC document routes only for signed-in users.
                if (! $authUser) {
                    $excluded[] = 'kyc.*';
                    $excluded[] = 'individual-verifications.*';
                    $excluded[] = 'corporate-verifications.*';
                    $excluded[] = 'verification.identity.store';
                }

                $ziggy->filter($excluded, false);

                return [
                    ...$ziggy->toArray(),
                    'location' => $request->url(),
                ];
            },
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'info' => $request->session()->get('info'),
            ],
            'propertyFrontendUrl' => rtrim((string) config('property.frontend_url'), '/') ?: 'https://property.xpertbid.com',
            'propertyRootCategoryId' => (int) config('property.root_category_id', 222),
            'renovationFrontendUrl' => rtrim((string) config('renovation.frontend_url'), '/') ?: 'https://build.xpertbid.com',
            'renovationRootCategoryId' => (int) config('renovation.root_category_id'),
            'builderRootCategoryId' => (int) config('renovation.builder_root_category_id'),
            'brandLogos' => [
                'property' => asset('assets/images/xp-prop-logo-clean.png'),
                'vehicle' => asset('assets/images/xp-vehicle-logo-clean.png'),
                'home' => asset('assets/images/xp-build-logo-clean.png'),
            ],
            'locale' => [
                'current' => $currentLocale,
                'fallback' => config('app.fallback_locale', 'en'),
                'supported' => $supportedLocales,
            ],
            'translations' => $translations,
            'favoriteListingIds' => $request->user()
                ? Favorite::where('user_id', $request->user()->id)->pluck('listing_id')->all()
                : [],
            'chatUnreadPeople' => $authUser
                ? (int) Conversation::query()
                    ->where(function ($query) use ($authUser) {
                        $query->where(function ($q) use ($authUser) {
                            $q->where('user_one_id', $authUser->id)->where('user_one_deleted', false);
                        })->orWhere(function ($q) use ($authUser) {
                            $q->where('user_two_id', $authUser->id)->where('user_two_deleted', false);
                        });
                    })
                    ->whereHas('messages', function ($query) use ($authUser) {
                        $query->where('sender_id', '!=', $authUser->id)
                            ->where(function ($q) {
                                $q->whereNull('is_read')->orWhere('is_read', 0);
                            });
                    })
                    ->count()
                : 0,
        ];
    }

    /**
     * Scope shared translations to the active route and strip identity entries
     * (where value === key, since useTranslate() falls back to the key itself).
     *
     * @param  array<string, mixed>  $translations
     * @return array<string, mixed>
     */
    protected function scopeTranslations(
        array $translations,
        Request $request,
        string $locale,
        $authUser = null
    ): array {
        $isHome = $request->routeIs('home') || $request->is('/');
        $isFaq = $request->routeIs('faq') || $request->is('faq');
        $isAbout = $request->routeIs('about', 'about.partners') || $request->is('about', 'about-us', 'about-our-partner');
        $isContact = $request->routeIs('contact') || $request->is('contact', 'contact-us');
        $isAdmin = $request->is('admin', 'admin/*');
        $isAuthPage = $request->routeIs('login', 'register', 'password.*') || $request->is('login', 'register', 'forgot-password', 'reset-password*');

        $excludedPrefixes = [];

        if (! $isFaq) {
            $excludedPrefixes[] = 'faq.';
        }
        if (! $isAbout) {
            $excludedPrefixes[] = 'about_page.';
        }
        if (! $isContact) {
            $excludedPrefixes[] = 'contact.';
        }
        if (! $isHome) {
            $excludedPrefixes[] = 'seo.';
        }
        if (! $isAdmin) {
            $excludedPrefixes[] = 'admin.';
        }
        // Authenticated users never open Login/Register modals on storefront pages
        if ($authUser && ! $isAuthPage) {
            $excludedPrefixes[] = 'auth.';
        }

        $scoped = [];
        foreach ($translations as $key => $value) {
            $skip = false;
            foreach ($excludedPrefixes as $prefix) {
                if (str_starts_with((string) $key, $prefix)) {
                    $skip = true;
                    break;
                }
            }
            if ($skip) {
                continue;
            }

            // useTranslate() falls back to `translations[key] ?? key`, so skip identical pairs
            if (is_string($value) && $value === (string) $key) {
                continue;
            }

            $scoped[$key] = $value;
        }

        return $scoped;
    }
}
