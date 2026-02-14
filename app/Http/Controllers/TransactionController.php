<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // public function index()
    // {
    //     $transactions = Transaction::all(); // Fetch the data
    //     return view('transactions.index', ['transactions' => $transactions]);

    // }


    public function index()
    {
        $transactions = Transactions::with('user')
                       ->orderBy('created_at','desc')
                       ->paginate(15);
        return view('transactions.index', compact('transactions'));
    }

    public function create()
    {
        return view('transactions.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'transaction_id' => 'required',
            'paid_amount' => 'required',
            'payment_for' => 'required',
            'pay_through' => 'required',
            'payment_status' => 'required',
            'datetime' => 'required|date',
        ]);

        Transaction::create($request->all());
        return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
    }

    public function edit(Transaction $transaction)
    {
        return view('transactions.index', compact('transaction'));
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'username' => 'required',
            'transaction_id' => 'required',
            'paid_amount' => 'required',
            'payment_for' => 'required',
            'pay_through' => 'required',
            'payment_status' => 'required',
            'datetime' => 'required|date',
        ]);

        $transaction->update($request->all());
        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
    }

    public function show(Transaction $transaction)
    {
        return view('transactions.show', compact('transaction'));
    }
}
