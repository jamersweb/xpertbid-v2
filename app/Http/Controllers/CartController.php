<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Listing;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CartController extends Controller
{
    protected function wantsMobileJson(Request $request): bool
    {
        return $request->wantsJson() || $request->expectsJson();
    }

    /**
     * Get user's cart items and render View
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            if ($this->wantsMobileJson($request)) {
                return response()->json(['cart' => [], 'items' => []]);
            }

            return Inertia::render('Cart/Index', [
                'cart' => []
            ]);
        }

        $cartItems = Cart::where('user_id', $user->id)
            ->with([
                'listing' => function ($query) {
                    $query->select('id', 'title', 'slug', 'image', 'status', 'description', 'user_id', 'listing_type', 'listing_data');
                },
                'variation'
            ])
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->id,
                    'listing_id' => $cartItem->listing_id,
                    'variation_id' => $cartItem->variation_id,
                    'type' => $cartItem->type,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    // Flatten structure for easier frontend consumption
                    'title' => $cartItem->listing->title ?? 'Unknown Product',
                    'slug' => $cartItem->listing->slug ?? null,
                    'image' => $cartItem->listing->image_url ?? null,
                    'description' => $cartItem->listing->description ?? null,
                    'list_type' => $cartItem->listing->list_type ?? 'auction',
                    'variation_name' => $cartItem->variation->name ?? $cartItem->variation_name,
                ];
            });

        if ($this->wantsMobileJson($request)) {
            return response()->json([
                'cart' => $cartItems,
                'items' => $cartItems,
                'count' => $cartItems->count(),
            ]);
        }

        return Inertia::render('Cart/Index', [
            'cart' => $cartItems
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'listing_id' => 'required|integer|exists:listings,id',
            'type' => 'nullable|string|in:product,featured',
            'variation_id' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            if ($this->wantsMobileJson($request)) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return redirect()->back()->withErrors($validator);
        }

        $user = $request->user();
        $listing = Listing::findOrFail($request->listing_id ?? $request->auction_id);
        $listingVariations = $listing->variations;
        $requestedVariationId = $request->variation_id;
        $listingVariation = $requestedVariationId !== null ? $listing->variationByIndex($requestedVariationId) : null;
        $productVariation = null;
        $variationName = null;

        if ($requestedVariationId !== null && !$listingVariation) {
            $productVariation = ProductVariation::find($requestedVariationId);
            if ($productVariation) {
                $variationName = $productVariation->name;
            }
        } elseif ($listingVariation) {
            $variationName = $listingVariation['name'] ?? null;
        }

        if ($listingVariations !== [] && $listingVariation === null && $productVariation === null) {
            $message = 'Please select a product variation';
            if ($this->wantsMobileJson($request)) {
                return response()->json([
                    'success' => false,
                    'message' => $message,
                ], 422);
            }

            return redirect()->back()->with('error', $message);
        }

        // Check if product is already in cart
        $existingCartItem = Cart::where('user_id', $user->id)
            ->where('listing_id', $listing->id)
            ->where('type', $request->type ?? 'product')
            ->when(
                $variationName,
                fn ($query) => $query->where('variation_name', $variationName),
                fn ($query) => $query->where(function ($inner) {
                    $inner->whereNull('variation_name')->orWhere('variation_name', '');
                })
            )
            ->first();

        if ($existingCartItem) {
            if ($this->wantsMobileJson($request)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product already in cart',
                    'cart_item' => $existingCartItem,
                ]);
            }

            return redirect()->back()->with('error', 'Product already in cart');
        }

        // Determine price
        if ($request->type === 'featured') {
            $price = 15000;
        } else {
            if ($listingVariation) {
                $price = $listing->variationSalePrice($listingVariation);
            } elseif ($productVariation) {
                $originalPrice = $productVariation->price;
                $discountType = $productVariation->discount_type;
                $discountValue = $productVariation->discount_value;
                $price = $originalPrice;
                if ($discountType && $discountValue > 0) {
                    if ($discountType === 'percent') {
                        $price = $originalPrice - ($originalPrice * ($discountValue / 100));
                    } elseif ($discountType === 'flat') {
                        $price = $originalPrice - $discountValue;
                    }
                }
                if ($price < 0) {
                    $price = 0;
                }
            } else {
                $originalPrice = $listing->buy_now_price ?? $listing->minimum_bid ?? 0;
                $discountType = $listing->discount_type;
                $discountValue = $listing->discount_value;
                $price = $originalPrice;
                if ($discountType && $discountValue > 0) {
                    if ($discountType === 'percent') {
                        $price = $originalPrice - ($originalPrice * ($discountValue / 100));
                    } elseif ($discountType === 'flat') {
                        $price = $originalPrice - $discountValue;
                    }
                }
                if ($price < 0) {
                    $price = 0;
                }
            }
        }

        $cartItem = Cart::create([
            'user_id' => $user->id,
            'listing_id' => $listing->id,
            'variation_id' => $productVariation?->id,
            'variation_name' => $variationName,
            'type' => $request->type ?? 'product',
            'quantity' => 1,
            'price' => $price,
        ]);

        if ($this->wantsMobileJson($request)) {
            return response()->json([
                'success' => true,
                'message' => 'Product added to cart',
                'cart_item' => $cartItem,
            ], 201);
        }

        return redirect()->route('cart.index')->with('success', 'Product added to cart');
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request, $id)
    {
        $user = $request->user();

        Cart::where('id', $id)->where('user_id', $user->id)->delete();

        if ($this->wantsMobileJson($request)) {
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
            ]);
        }

        return redirect()->back()->with('success', 'Item removed from cart');
    }
}
