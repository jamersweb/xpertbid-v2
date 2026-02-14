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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart' => $request->user() ? \App\Models\Cart::where('user_id', $request->user()->id)
                ->with(['auction' => function ($query) {
                    $query->select('id', 'title', 'slug', 'image', 'minimum_bid', 'buy_now_price', 'is_buynow', 'list_type', 'status', 'description', 'user_id');
                }, 'variation'])
                ->get()
                ->map(function ($cartItem) {
                    return [
                        'id' => $cartItem->id,
                        'auction_id' => $cartItem->auction_id,
                        'variation_id' => $cartItem->variation_id,
                        'type' => $cartItem->type,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->price,
                        'title' => $cartItem->auction->title ?? 'Unknown Product',
                        'slug' => $cartItem->auction->slug ?? null,
                        'image' => $cartItem->auction->image ?? null,
                        'list_type' => $cartItem->auction->list_type ?? 'auction',
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
