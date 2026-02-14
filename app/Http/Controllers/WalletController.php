<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wallet;
use App\Models\Transactions as Transaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        
        // Fetch transactions
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Wallet/Index', [
            'balance' => $wallet->balance,
            'transactions' => $transactions
        ]);
    }

    public function addMoney(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:stripe,paypal,bank_transfer',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        $user = $request->user();
        $amount = $request->amount;
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);

        // Integrate Stripe/PayPal logic here or assume success for MVP migration
        // For real implementation, verify payment before incrementing
        
        // Mock success for now as per original code structure
        $wallet->increment('balance', $amount);

        Transaction::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'type' => 'add',
            'description' => 'Added money via ' . ucfirst($request->payment_method),
            'status' => 'completed',
        ]);

        return redirect()->back()->with('success', 'Money added successfully.');
    }
}
