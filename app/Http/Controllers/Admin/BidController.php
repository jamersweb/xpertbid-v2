<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BidController extends Controller
{
    public function index(Request $request)
    {
        $query = Bid::with(['user', 'auction']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%$search%")
                    ->orWhere('bid_amount', 'LIKE', "%$search%")
                    ->orWhereHas('auction', function ($aq) use ($search) {
                        $aq->where('title', 'LIKE', "%$search%");
                    })
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'LIKE', "%$search%")
                            ->orWhere('email', 'LIKE', "%$search%");
                    });
            });
        }

        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            case 'highest': $query->orderBy('bid_amount', 'desc'); break;
            case 'lowest': $query->orderBy('bid_amount', 'asc'); break;
            case 'newest':
            default: $query->orderBy('created_at', 'desc'); break;
        }

        $bids = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Bids/Index', [
            'bids' => $bids,
            'filters' => $request->only(['search', 'sort'])
        ]);
    }

    public function show($id)
    {
        $bid = Bid::with(['user', 'auction.user'])->findOrFail($id);
        
        $auctionBids = Bid::with('user')
            ->where('auction_id', $bid->auction_id)
            ->latest()
            ->get();

        return Inertia::render('Admin/Bids/Show', [
            'bid' => $bid,
            'auctionBids' => auctionBids
        ]);
    }
}
