<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Listing;
use App\Models\Wallet;
use App\Models\Transactions as Transaction; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected function normalizeStoredPaymentMethod(PaymentMethod $paymentMethod): string
    {
        return match (strtolower((string) $paymentMethod->paymentMethod)) {
            'paypal' => 'paypal',
            'bank transfer', 'bank_transfer', 'bank account' => 'bank_transfer',
            'stripe', 'card', 'credit card' => 'stripe',
            default => Str::slug((string) $paymentMethod->paymentMethod, '_'),
        };
    }

    protected function serializePaymentMethod(PaymentMethod $paymentMethod): array
    {
        $type = $this->normalizeStoredPaymentMethod($paymentMethod);

        $label = match ($type) {
            'paypal' => $paymentMethod->paypal_id ?: 'PayPal',
            'bank_transfer' => $paymentMethod->bank_name ?: 'Bank Transfer',
            'stripe' => 'Saved Card',
            default => $paymentMethod->paymentMethod ?: 'Payment Method',
        };

        $details = match ($type) {
            'paypal' => $paymentMethod->paypal_id ?: '',
            'bank_transfer' => collect([
                $paymentMethod->account_title,
                $paymentMethod->iban_number,
            ])->filter()->implode(' | '),
            default => '',
        };

        return [
            'id' => $paymentMethod->id,
            'name' => $label,
            'title' => $label,
            'label' => $label,
            'type' => $type,
            'payment_method' => $paymentMethod->paymentMethod,
            'details' => $details,
            'description' => $details,
            'email' => $paymentMethod->paypal_id,
            'paypal_id' => $paymentMethod->paypal_id,
            'bank_name' => $paymentMethod->bank_name,
            'account_title' => $paymentMethod->account_title,
            'iban_number' => $paymentMethod->iban_number,
            'swift_code' => $paymentMethod->swift_code,
            'branch_address' => $paymentMethod->branch_address,
            'is_default' => (bool) $paymentMethod->is_default,
        ];
    }

    protected function promotionAmount(string $package): float
    {
        return match (strtolower(trim($package))) {
            'bronze' => 50.0,
            'silver' => 75.0,
            'gold' => 100.0,
            default => 0.0,
        };
    }

    public function index(Request $request)
    {
        $methods = PaymentMethod::query()
            ->where('user_id', Auth::id())
            ->orderByDesc('is_default')
            ->latest('id')
            ->get()
            ->map(fn (PaymentMethod $paymentMethod) => $this->serializePaymentMethod($paymentMethod))
            ->values();

        return response()->json([
            'methods' => $methods,
        ]);
    }

    /**
     * Save a new payment method
     */
    public function savePaymentMethod(Request $request)
    {
        $rules = [
            'paymentMethod' => 'required'
        ];

        if ($request->paymentMethod === "Paypal") {
            $rules['paypal_id'] = 'required|email';
        } elseif ($request->paymentMethod === "Bank Transfer") {
            $rules['bank_name']    = 'required|string';
            $rules['iban_number']  = 'required|string';
            $rules['swift_code']   = 'required|string';
            $rules['account_title']= 'required|string';
        }

        $request->validate($rules);

        $user = Auth::user();

        PaymentMethod::create([
            'user_id'        => $user->id,
            'paymentMethod'  => $request->paymentMethod,
            'token'          => $request->token,
            'bank_name'      => $request->bank_name,
            'iban_number'    => $request->iban_number,
            'swift_code'     => $request->swift_code,
            'account_title'  => $request->account_title,
            'country_id'     => $request->country_id,
            'paypal_id'      => $request->paypal_id,
            'branch_address' => $request->branch_address,
            'is_default'     => PaymentMethod::where('user_id', $user->id)->count() === 0,
        ]);

        if ($request->expectsJson()) {
            $paymentMethod = PaymentMethod::query()
                ->where('user_id', $user->id)
                ->latest('id')
                ->first();

            return response()->json([
                'success' => true,
                'method' => $paymentMethod ? $this->serializePaymentMethod($paymentMethod) : null,
            ], 201);
        }

        return redirect()->back()->with('success', 'Payment method saved successfully.');
    }

    public function makePayment(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|integer|exists:listings,id',
            'package' => 'required|string|max:50',
            'payment_method' => 'required',
        ]);

        $user = Auth::user();
        $listing = Listing::query()
            ->where('id', $request->integer('listing_id'))
            ->where('user_id', $user->id)
            ->first();

        if (!$listing) {
            return response()->json([
                'success' => false,
                'message' => 'Listing not found for the authenticated user.',
            ], 404);
        }

        $paymentMethod = PaymentMethod::query()
            ->where('id', $request->input('payment_method'))
            ->where('user_id', $user->id)
            ->first();

        if (!$paymentMethod) {
            return response()->json([
                'success' => false,
                'message' => 'Payment method not found.',
            ], 404);
        }

        $address = $user->shippingAddress;
        if (!$address || !$address->addressLine1 || !$address->city || !$address->state || !$address->country) {
            return response()->json([
                'success' => false,
                'message' => 'Please add a shipping address before purchasing a promotion package.',
            ], 422);
        }

        $amount = $this->promotionAmount($request->input('package'));
        $storedType = $this->normalizeStoredPaymentMethod($paymentMethod);
        $orderPaymentMethod = $storedType === 'stripe' ? 'stripe' : 'bank_transfer';
        $primaryPhone = $address->contactNumber ?: $user->phone ?: 'N/A';

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'is_promotion' => true,
                'billing_name' => $user->name ?: 'Customer',
                'billing_email' => $user->email ?: 'noreply@xpertbid.com',
                'billing_phone' => $primaryPhone,
                'billing_address_line1' => $address->addressLine1,
                'billing_address_line2' => $address->addressLine2,
                'billing_city' => (string) $address->city,
                'billing_state' => (string) $address->state,
                'billing_postal_code' => $address->postalCode,
                'billing_country' => (string) $address->country,
                'shipping_name' => $user->name ?: 'Customer',
                'shipping_email' => $user->email ?: 'noreply@xpertbid.com',
                'shipping_phone' => $primaryPhone,
                'shipping_address_line1' => $address->addressLine1,
                'shipping_address_line2' => $address->addressLine2,
                'shipping_city' => (string) $address->city,
                'shipping_state' => (string) $address->state,
                'shipping_postal_code' => $address->postalCode,
                'shipping_country' => (string) $address->country,
                'subtotal' => $amount,
                'tax' => 0,
                'shipping_cost' => 0,
                'total' => $amount,
                'payment_method' => $orderPaymentMethod,
                'payment_status' => 'pending',
                'status' => 'pending',
                'notes' => sprintf(
                    'Mobile promotion package: %s. Saved method: %s.',
                    $request->input('package'),
                    $paymentMethod->paymentMethod
                ),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'listing_id' => $listing->id,
                'quantity' => 1,
                'price' => $amount,
                'subtotal' => $amount,
                'type' => 'promotion',
            ]);

            $listing->update([
                'featured_name' => 'home_featured',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'order_number' => $order->order_number,
                'message' => 'Promotion payment recorded successfully.',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Unable to process the promotion payment right now.',
            ], 500);
        }
    }

    /**
     * Delete a payment method
     */
    public function deletePaymentMethod($id)
    {
        $user = Auth::user();
        $paymentMethod = PaymentMethod::where('id', $id)->where('user_id', $user->id)->first();

        if ($paymentMethod) {
            $paymentMethod->delete();
            return redirect()->back()->with('success', 'Payment method deleted successfully.');
        }

        return redirect()->back()->with('error', 'Payment method not found.');
    }
}
