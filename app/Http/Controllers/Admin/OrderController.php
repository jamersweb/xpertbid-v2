<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.auction']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'LIKE', "%$search%")
                  ->orWhere('billing_name', 'LIKE', "%$search%")
                  ->orWhere('billing_email', 'LIKE', "%$search%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.auction'])->findOrFail($id);
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}
