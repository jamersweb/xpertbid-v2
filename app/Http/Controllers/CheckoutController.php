<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Listing;
use App\Models\NewNotification;
use App\Mail\OrderPlacedMail;
use App\Mail\AdminOrderNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Country;
use App\Models\State;
use App\Models\City;

class CheckoutController extends Controller
{
    /**
     * Display Checkout Page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Handle direct promotion checkout
        if ($request->query('direct') === 'featured') {
            $listingId = $request->query('listing_id') ?? $request->query('auction_id');
            $duration = $request->query('duration', 7);
            
            $listing = Listing::findOrFail($listingId);
            
            // Hardcoded promotion prices (matching reference or as per requirements)
            // If they are "FREE" as per the frontend UI, price is 0.
            $price = 0; 
            
            $promotionItem = (object)[
                'id' => 'promo-' . $listingId,
                'listing_id' => $listingId,
                'listing' => $listing,
                'title' => "Featured Promotion - {$duration} Days",
                'price' => $price,
                'quantity' => 1,
                'type' => 'promotion',
                'duration' => $duration,
                'image' => $listing->image_url
            ];
            
            return Inertia::render('Checkout/Index', [
                'cartItems' => [$promotionItem],
                'user' => $user ? $user->load('shippingAddress') : null,
                'stripeKey' => env('STRIPE_KEY'),
            ]);
        }

        if (!$user) {
            return Inertia::render('Checkout/Index', [
                'cartItems' => [],
                'user' => null,
                'stripeKey' => env('STRIPE_KEY'),
            ]);
        }

        // Fetch cart items similarly to CartController to display summary
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
                    'title' => $cartItem->listing->title ?? 'Unknown Product',
                    'slug' => $cartItem->listing->slug ?? null,
                    'image' => $cartItem->listing->image_url ?? null,
                    'description' => $cartItem->listing->description ?? null,
                    'list_type' => $cartItem->listing->list_type ?? 'auction',
                    'variation_name' => $cartItem->variation->name ?? null,
                ];
            });
            
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Calculate totals logic here or let frontend do it from props
        // For security, backend calculation is better, but this is display only.
        
        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'user' => $user ? $user->load('shippingAddress') : null, // Pre-fill address if available
            'stripeKey' => env('STRIPE_KEY'), // Publishable key for frontend
        ]);
    }

    /**
     * Process checkout
     */
    public function processCheckout(Request $request)
    {
        // Handle both standard POST and JSON-in-FormData (from original frontend)
        $data = $request->all();
        if ($request->has('order_data')) {
            $data = array_merge($data, json_decode($request->input('order_data'), true));
        }

        // Validation
        $validator = Validator::make($data, [
            'items' => 'required|array|min:1',
            'payment_method' => 'required|in:stripe,cod,bank_transfer',
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|email',
            'billing_phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:7',
            'billing_address_line1' => 'required|string',
            'billing_city' => 'required|string',
            'billing_state' => 'required|string',
            'billing_country' => 'required|string',
            'total' => 'required|numeric|min:0',
            'receipt_image' => 'nullable|image|max:5120', // 5MB
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = $request->user();

        DB::beginTransaction();
        try {
            // 1. Handle Receipt Upload
            $receiptPath = null;
            if ($request->hasFile('receipt_image')) {
                $receiptPath = $request->file('receipt_image')->store('receipts', 'public');
            }

            // 2. Create Order
            $order = Order::create([
                'user_id' => $user ? $user->id : null, // Support guest checkout if needed
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'status' => ($data['payment_method'] === 'stripe') ? 'paid' : 'pending',
                'payment_method' => $data['payment_method'],
                'subtotal' => $data['subtotal'] ?? $data['total'],
                'tax' => $data['tax'] ?? 0,
                'shipping_cost' => $data['shipping_cost'] ?? 0,
                'total' => $data['total'],
                'receipt_image' => $receiptPath,
                
                // Billing Info
                'billing_name' => $data['billing_name'],
                'billing_email' => $data['billing_email'],
                'billing_phone' => $data['billing_phone'],
                'billing_address_line1' => $data['billing_address_line1'],
                'billing_address_line2' => $data['billing_address_line2'] ?? null,
                'billing_city' => is_numeric($data['billing_city']) ? (City::find($data['billing_city'])->name ?? $data['billing_city']) : $data['billing_city'],
                'billing_state' => is_numeric($data['billing_state']) ? (State::find($data['billing_state'])->name ?? $data['billing_state']) : $data['billing_state'],
                'billing_postal_code' => $data['billing_postal_code'] ?? null,
                'billing_country' => is_numeric($data['billing_country']) ? (Country::find($data['billing_country'])->name ?? $data['billing_country']) : $data['billing_country'],

                // Shipping Info
                'shipping_name' => $data['shipping_name'] ?? $data['billing_name'],
                'shipping_email' => $data['shipping_email'] ?? $data['billing_email'],
                'shipping_phone' => $data['shipping_phone'] ?? $data['billing_phone'],
                'shipping_address_line1' => $data['shipping_address_line1'] ?? $data['billing_address_line1'],
                'shipping_address_line2' => $data['shipping_address_line2'] ?? null,
                'shipping_city' => is_numeric($data['shipping_city'] ?? null) ? (City::find($data['shipping_city'])->name ?? $data['shipping_city']) : ($data['shipping_city'] ?? $data['billing_city']),
                'shipping_state' => is_numeric($data['shipping_state'] ?? null) ? (State::find($data['shipping_state'])->name ?? $data['shipping_state']) : ($data['shipping_state'] ?? $data['billing_state']),
                'shipping_postal_code' => $data['shipping_postal_code'] ?? $data['billing_postal_code'] ?? null,
                'shipping_country' => is_numeric($data['shipping_country'] ?? null) ? (Country::find($data['shipping_country'])->name ?? $data['shipping_country']) : ($data['shipping_country'] ?? $data['billing_country']),
            ]);

            // 3. Create Items
            foreach ($data['items'] as $item) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'listing_id' => $item['listing_id'] ?? $item['auction_id'],
                    'variation_id' => $item['variation_id'] ?? null,
                    'quantity' => $item['quantity'] ?? 1,
                    'price' => $item['price'],
                    'subtotal' => ($item['price'] * ($item['quantity'] ?? 1)),
                    'type' => $item['type'] ?? 'product',
                ]);

                // 3b. Fulfill Promotion (Mark Listing as Featured)
                if (isset($item['type']) && $item['type'] === 'promotion') {
                    $listing = Listing::find($item['listing_id'] ?? $item['auction_id']);
                    if ($listing) {
                        $listing->update([
                            'featured_name' => 'home_featured'
                        ]);
                        
                        // Send Notification (Optional but recommended)
                        try {
                            Mail::to($order->billing_email)->send(new \App\Mail\FeaturedListingNotification($user, $listing));
                        } catch (\Exception $e) {
                            Log::error('Featured Notification Failed: ' . $e->getMessage());
                        }
                    }
                }
            }

            // 4. Clear Cart if auth
            if ($user) {
                Cart::where('user_id', $user->id)->delete();
            }

            DB::commit();

            // 5. Notifications & Mails (Placeholder for actual implementation)
            // Mail::to($order->billing_email)->send(new OrderPlacedMail($order));

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'order_number' => $order->order_number,
                    'message' => 'Order placed successfully'
                ]);
            }

            return redirect()->route('orders.show', $order->order_number)->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout Failed: ' . $e->getMessage());
            
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Checkout failed: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Checkout failed. Please try again.')->withInput();
        }
    }

    /**
     * Display User Orders
     */
    public function myOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.listing'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show Order Details
     */
    public function show(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $request->user()->id)
            ->with(['items.listing'])
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }
}
