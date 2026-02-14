<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use App\Models\Wallet;
use App\Models\Transactions as Transaction; 
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
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

        return redirect()->back()->with('success', 'Payment method saved successfully.');
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
