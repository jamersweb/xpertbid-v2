<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentRequest::with(['user', 'paymentMethod']);

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Finance/PaymentRequests', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
        ]);

        $paymentRequest = PaymentRequest::findOrFail($id);

        if ($paymentRequest->status !== 'pending' && $request->status !== $paymentRequest->status) {
            // Optional: prevent changing status after approved/rejected
        }

        DB::beginTransaction();
        try {
            $paymentRequest->status = $request->status;
            $paymentRequest->save();

            if ($request->status === 'approved') {
                // If it's a deposit request, update user wallet
                // Assuming PaymentRequest is used for deposits here
                $wallet = Wallet::firstOrCreate(['user_id' => $paymentRequest->user_id]);
                $wallet->balance += $paymentRequest->amount;
                $wallet->save();
            }

            DB::commit();
            return redirect()->back()->with('success', 'Payment request ' . $request->status . ' successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }
}
