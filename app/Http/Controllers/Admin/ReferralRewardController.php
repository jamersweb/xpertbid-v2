<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReferralReward;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReferralRewardController extends Controller
{
    public function index(Request $request)
    {
        $query = ReferralReward::query()
            ->with([
                'referrer:id,name,email,phone',
                'referredUser:id,name,email,phone',
                'order:id,order_number,total,status',
                'listing:id,title,slug',
                'approver:id,name,email',
            ]);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('referrer', fn ($user) => $user
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%"))
                    ->orWhereHas('referredUser', fn ($user) => $user
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%"))
                    ->orWhereHas('order', fn ($order) => $order->where('order_number', 'like', "%{$search}%"))
                    ->orWhereHas('listing', fn ($listing) => $listing->where('title', 'like', "%{$search}%"));
            });
        }

        return Inertia::render('Admin/ReferralRewards/Index', [
            'rewards' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function approve(Request $request, ReferralReward $reward, ReferralService $referrals)
    {
        $validated = $request->validate([
            'admin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $referrals->approve($reward, $request->user(), $validated['admin_note'] ?? null);

        return redirect()->back()->with('success', 'Referral reward approved and added to wallet.');
    }

    public function reject(Request $request, ReferralReward $reward, ReferralService $referrals)
    {
        $validated = $request->validate([
            'admin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $referrals->reject($reward, $request->user(), $validated['admin_note'] ?? null);

        return redirect()->back()->with('success', 'Referral reward rejected.');
    }
}
