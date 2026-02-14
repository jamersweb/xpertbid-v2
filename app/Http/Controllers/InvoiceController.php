<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the user's invoices via Inertia.
     */
    public function index()
    {
        $invoices = Invoice::with('booking')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    /**
     * API endpoint for fetching invoices (legacy compatibility).
     */
    public function apiIndex()
    {
        $invoices = Invoice::with('booking')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'amount' => $invoice->final_cost,
                    'name' => $invoice->booking ? $invoice->booking->cargo_type : 'N/A',
                    'date' => $invoice->created_at->format('M d, Y'),
                    'status' => $invoice->status,
                ];
            });

        return response()->json([
            'invoices' => $invoices
        ]);
    }
}
