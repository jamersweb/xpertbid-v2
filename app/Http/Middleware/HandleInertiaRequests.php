<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser,
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
                        'variation_name' => $cartItem->variation->name ?? null,
                    ];
                }) : [],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
