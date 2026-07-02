<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use App\Models\Order;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    use StreamsCsvExports;

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

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);
        $query = Order::with(['user', 'items'])
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to']);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                    ->orWhere('billing_name', 'LIKE', "%{$search}%")
                    ->orWhere('billing_email', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($validated['status']) && $validated['status'] !== 'all') {
            $query->where('status', $validated['status']);
        }

        $orders = $query->latest()->get();
        $filename = 'admin_orders_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Order Number',
            'Customer',
            'Customer Email',
            'User',
            'Items',
            'Total',
            'Payment Method',
            'Payment Status',
            'Status',
            'Created At',
        ], $orders->map(fn ($order) => [
            $order->id,
            $order->order_number,
            $order->billing_name,
            $order->billing_email,
            $order->user?->name,
            $order->items?->count() ?? 0,
            $order->total,
            $order->payment_method,
            $order->payment_status,
            $order->status,
            optional($order->created_at)->format('Y-m-d H:i:s'),
        ]));
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.auction'])->findOrFail($id);
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, $id, ReferralService $referrals)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order = Order::with(['user', 'items.listing.user'])->findOrFail($id);
        $order->status = $request->status;
        $order->save();

        if ($order->status === 'completed' && $order->user) {
            $referrals->createPendingReward($order->user, 'purchase', (float) $order->total, $order);

            $order->items
                ->filter(fn ($item) => $item->listing?->user)
                ->groupBy(fn ($item) => $item->listing->user_id)
                ->each(function ($items) use ($referrals, $order) {
                    $seller = $items->first()->listing->user;
                    $sellerTotal = $items->sum(fn ($item) => (float) $item->subtotal);
                    $referrals->createPendingReward($seller, 'sale', $sellerTotal, $order);
                });
        }

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}
