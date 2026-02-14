<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Auction;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get user's cart items and render View
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $cartItems = Cart::where('user_id', $user->id)
            ->with([
                'auction' => function ($query) {
                    $query->select('id', 'title', 'slug', 'image', 'minimum_bid', 'buy_now_price', 'is_buynow', 'list_type', 'status', 'description', 'user_id');
                },
                'variation'
            ])
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->id,
                    'auction_id' => $cartItem->auction_id,
                    'variation_id' => $cartItem->variation_id,
                    'type' => $cartItem->type,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    // Flatten structure for easier frontend consumption
                    'title' => $cartItem->auction->title ?? 'Unknown Product',
                    'slug' => $cartItem->auction->slug ?? null,
                    'image' => $cartItem->auction->image ?? null,
                    'list_type' => $cartItem->auction->list_type ?? 'auction',
                    'variation_name' => $cartItem->variation->name ?? null,
                ];
            });

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
            'auction_id' => 'required|integer|exists:auctions,id',
            'type' => 'nullable|string|in:product,featured',
            'variation_id' => 'nullable|integer|exists:product_variations,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        $user = $request->user();
        $auction = Auction::findOrFail($request->auction_id);

        // Check if product is already in cart
        $existingCartItem = Cart::where('user_id', $user->id)
            ->where('auction_id', $auction->id)
            ->where('type', $request->type ?? 'product')
            ->where('variation_id', $request->variation_id)
            ->first();

        if ($existingCartItem) {
            return redirect()->back()->with('error', 'Product already in cart');
        }

        // Determine price
        if ($request->type === 'featured') {
            $price = 15000;
        } else {
            if ($request->variation_id) {
                $variation = ProductVariation::find($request->variation_id);
                if ($variation && $variation->auction_id == $auction->id) {
                    $originalPrice = $variation->price;
                    $discountType = $variation->discount_type;
                    $discountValue = $variation->discount_value;
                } else {
                    return redirect()->back()->with('error', 'Invalid variation selected');
                }
            } else {
                $originalPrice = $auction->buy_now_price ?? $auction->minimum_bid ?? 0;
                $discountType = $auction->discount_type;
                $discountValue = $auction->discount_value;
            }

            // Calculate Discount
            $price = $originalPrice;
            if ($discountType && $discountValue > 0) {
                if ($discountType === 'percent') {
                     $price = $originalPrice - ($originalPrice * ($discountValue / 100));
                } elseif ($discountType === 'flat') {
                    $price = $originalPrice - $discountValue;
                }
            }
            if ($price < 0) $price = 0;
        }

        Cart::create([
            'user_id' => $user->id,
            'auction_id' => $auction->id,
            'variation_id' => $request->variation_id,
            'type' => $request->type ?? 'product',
            'quantity' => 1,
            'price' => $price,
        ]);

        return redirect()->route('cart.index')->with('success', 'Product added to cart');
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request, $id)
    {
        $user = $request->user();

        Cart::where('id', $id)->where('user_id', $user->id)->delete();

        return redirect()->back()->with('success', 'Item removed from cart');
    }
}
