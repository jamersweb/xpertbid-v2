<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\NewNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\PaymentApprovedMail;
use App\Mail\PaymentDeclinedMail;

class PaymentVerificationController extends Controller
{
    /**
     * Display a listing of pending payment verification orders
     */
    public function index(Request $request)
    {
        $query = Order::where('payment_method', 'bank_transfer')
            ->with(['user', 'items.auction']);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'LIKE', "%$search%")
                  ->orWhere('billing_name', 'LIKE', "%$search%")
                  ->orWhere('billing_email', 'LIKE', "%$search%")
                  ->orWhere('total', 'LIKE', "%$search%");
            });
        }

        // Date Range filtering
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                      ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Status filtering (default to pending if no search/filter active)
        if ($request->has('status') && !empty($request->status)) {
            $query->where('payment_status', $request->status);
        } else {
            if (!$request->has('search') && !$request->has('date_range')) {
                $query->where('payment_status', 'pending');
            }
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'total_high_to_low':
                $query->orderBy('total', 'desc');
                break;
            case 'total_low_to_high':
                $query->orderBy('total', 'asc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $orders = $query->paginate(15)->withQueryString();

        if ($request->ajax()) {
            return view('payment-verifications.table_partial', compact('orders'))->render();
        }

        return view('payment-verifications.index', compact('orders'));
    }

    /**
     * Approve payment and update order status
     */
    public function approve(Request $request, $id)
    {
        $order = Order::with(['user', 'items'])->findOrFail($id);

        if ($order->payment_status !== 'pending') {
            return redirect()->route('payment-verifications.index')
                ->with('error', 'This order payment is not pending.');
        }

        if ($order->payment_method !== 'bank_transfer') {
            return redirect()->route('payment-verifications.index')
                ->with('error', 'This order is not a bank transfer payment.');
        }

        // Update order status
        $order->payment_status = 'approved';
        $order->status = 'processing';
        $order->save();

        // Send approval email to user
        try {
            Mail::to($order->billing_email)->send(new PaymentApprovedMail($order));
        } catch (\Exception $e) {
            \Log::error('Failed to send payment approved email: ' . $e->getMessage());
        }

        // Create notification for user
        try {
            NewNotification::create([
                'user_id' => $order->user_id,
                'title' => 'Payment Approved',
                'message' => 'Your payment for order #' . $order->order_number . ' has been approved and your order is now processing.',
                'type' => 'order',
                'image_url' => NewNotification::getImageForType('order') ?? null,
                'read_at' => null,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create payment approved notification: ' . $e->getMessage());
        }

        return redirect()->route('payment-verifications.index')
            ->with('success', 'Payment approved successfully. User has been notified via email and notification.');
    }

    /**
     * Decline payment and update order status
     */
    public function decline(Request $request, $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $order = Order::with(['user', 'items'])->findOrFail($id);

        if ($order->payment_status !== 'pending') {
            return redirect()->route('payment-verifications.index')
                ->with('error', 'This order payment is not pending.');
        }

        if ($order->payment_method !== 'bank_transfer') {
            return redirect()->route('payment-verifications.index')
                ->with('error', 'This order is not a bank transfer payment.');
        }

        // Update order status
        $order->payment_status = 'declined';
        $order->status = 'cancelled';
        $order->save();

        // Send decline email to user
        try {
            Mail::to($order->billing_email)->send(new PaymentDeclinedMail($order, $request->reason));
        } catch (\Exception $e) {
            \Log::error('Failed to send payment declined email: ' . $e->getMessage());
        }

        // Create notification for user
        try {
            $declineMessage = 'Your order #' . $order->order_number . ' and payment have been rejected.';
            if ($request->reason) {
                $declineMessage .= ' Reason: ' . $request->reason;
            }
            $declineMessage .= ' Please contact XpertBid for more information.';

            NewNotification::create([
                'user_id' => $order->user_id,
                'title' => 'Payment Declined',
                'message' => $declineMessage,
                'type' => 'order',
                'image_url' => NewNotification::getImageForType('order') ?? null,
                'read_at' => null,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create payment declined notification: ' . $e->getMessage());
        }

        return redirect()->route('payment-verifications.index')
            ->with('success', 'Payment declined. User has been notified via email and notification.');
    }

    /**
     * Show order details
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.auction'])->findOrFail($id);
        return view('payment-verifications.show', compact('order'));
    }

    /**
     * Serve receipt image
     */
    public function receipt($filename)
    {
        // Try public/assets/images/recipt first (new location)
        $newPath = public_path('assets/images/recipt/' . $filename);
        if (file_exists($newPath)) {
            return response()->file($newPath);
        }
        
        // Try storage/app/public (old location)
        $filePath = 'receipts/' . $filename;
        if (Storage::disk('public')->exists($filePath)) {
            return response()->file(Storage::disk('public')->path($filePath));
        }
        
        // Try public/receipts as fallback (old location)
        $publicPath = public_path('receipts/' . $filename);
        if (file_exists($publicPath)) {
            return response()->file($publicPath);
        }
        
        abort(404, 'Receipt image not found');
    }
}
