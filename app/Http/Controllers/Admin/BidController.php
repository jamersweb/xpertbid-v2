<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use App\Models\Bid;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BidController extends Controller
{
    use StreamsCsvExports;

    public function index(Request $request)
    {
        $query = Bid::with(['user', 'listing']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%$search%")
                    ->orWhere('bid_amount', 'LIKE', "%$search%")
                    ->orWhereHas('listing', function ($aq) use ($search) {
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
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest':
                $query->orderBy('bid_amount', 'desc');
                break;
            case 'lowest':
                $query->orderBy('bid_amount', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $bids = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Bids/Index', [
            'bids' => $bids,
            'filters' => $request->only(['search', 'sort'])
        ]);
    }

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);
        $query = Bid::with(['user', 'listing'])
            ->whereDate('created_at', '>=', $validated['from'])
            ->whereDate('created_at', '<=', $validated['to']);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%{$search}%")
                    ->orWhere('bid_amount', 'LIKE', "%{$search}%")
                    ->orWhereHas('listing', fn ($aq) => $aq->where('title', 'LIKE', "%{$search}%"))
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        match ($validated['sort'] ?? 'newest') {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'highest' => $query->orderBy('bid_amount', 'desc'),
            'lowest' => $query->orderBy('bid_amount', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $bids = $query->get();
        $filename = 'admin_bids_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Listing ID',
            'Listing',
            'Bidder',
            'Bidder Email',
            'Bid Amount',
            'Placed At',
        ], $bids->map(fn ($bid) => [
            $bid->id,
            $bid->listing_id,
            $bid->listing?->title,
            $bid->user?->name,
            $bid->user?->email,
            $bid->bid_amount,
            optional($bid->created_at)->format('Y-m-d H:i:s'),
        ]));
    }

    public function show($id)
    {
        $bid = Bid::with(['user', 'listing.user'])->findOrFail($id);

        $auctionBids = Bid::with('user')
            ->where('listing_id', $bid->listing_id)
            ->latest()
            ->get();

        return Inertia::render('Admin/Bids/Show', [
            'bid' => $bid,
            'auctionBids' => $auctionBids
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'bid_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $bid = Bid::findOrFail($id);
        $bid->update([
            'bid_amount' => $validated['bid_amount'],
        ]);

        return redirect()->back()->with('success', 'Bid amount updated successfully.');
    }

    public function destroy($id)
    {
        $bid = Bid::findOrFail($id);
        $bid->delete();

        return redirect()->back()->with('success', 'Bid deleted successfully.');
    }
}
