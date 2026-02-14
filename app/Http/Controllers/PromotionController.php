<?php

namespace App\Http\Controllers;

use App\Models\Transactions as Transaction;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
public function index()
{
    $transactions = Transaction::with([
            'auction:id,title,album'  // eager‑load only these fields
        ])
        ->where('type', 'deduction')
        ->whereHas('auction')            // ← only where auction exists
        ->select('id','type','amount','status','created_at','product_id')
        ->get();

    return view('promotion.index', compact('transactions'));
}
}
