<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of all orders
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.auction']);

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

        // Status filtering
        if ($request->has('status') && !empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
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

        $orders = $query->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('orders.table_partial', compact('orders'))->render();
        }

        return view('orders.index', compact('orders'));
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return redirect()->route('orders.index')
            ->with('success', 'Order status updated successfully.');
    }

    /**
     * Show order details
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.auction'])->findOrFail($id);
        return view('orders.show', compact('order'));
    }

    /**
     * Send email to sellers manually
     */
    public function sendSellerEmail($id)
    {
        $order = Order::with(['items.auction.user'])->findOrFail($id);

        try {
            // Group items by Seller (Auction Owner)
            $sellerItems = [];

            foreach ($order->items as $item) {
                if ($item->auction && $item->auction->user) {
                    $sellerId = $item->auction->user->id;
                    $sellerEmail = $item->auction->user->email;

                    if (!isset($sellerItems[$sellerId])) {
                        $sellerItems[$sellerId] = [
                            'email' => $sellerEmail,
                            'items' => []
                        ];
                    }
                    $sellerItems[$sellerId]['items'][] = $item;
                }
            }

            // Send email to each seller
            $sentCount = 0;
            foreach ($sellerItems as $sellerId => $data) {
                if (!empty($data['email'])) {
                    \Illuminate\Support\Facades\Mail::to($data['email'])->send(new \App\Mail\SellerOrderNotification($order, $data['items']));
                    $sentCount++;
                }
            }
            
            if ($sentCount == 0) {
                 return redirect()->back()->with('warning', 'No sellers found for this order to email.');
            }

            return redirect()->back()->with('success', 'Email sent to ' . $sentCount . ' sellers successfully.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
}
