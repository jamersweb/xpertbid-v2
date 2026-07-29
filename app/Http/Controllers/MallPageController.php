<?php

namespace App\Http\Controllers;

use App\Models\CorporateVerification;
use App\Models\Listing;
use App\Models\Mall;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MallPageController extends Controller
{
    protected function browseStatuses(): array
    {
        return ['active', 'sold_out'];
    }

    /**
     * Alphabetical list of active malls only.
     */
    public function index()
    {
        $malls = Mall::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Malls/Index', [
            'malls' => $malls,
        ]);
    }

    /**
     * Alphabetical verified sellers for a selected mall.
     */
    public function show(Mall $mall)
    {
        if ($mall->status !== 'active') {
            abort(404);
        }

        $sellerIds = CorporateVerification::query()
            ->where('mall_id', $mall->id)
            ->where('status', 'verified')
            ->pluck('user_id')
            ->unique()
            ->values();

        $sellers = User::query()
            ->whereIn('id', $sellerIds)
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'profile_pic', 'company_name'])
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'company_name' => $user->company_name,
                    'profile_pic' => $user->profile_pic,
                    'label' => $user->company_name ?: $user->name,
                ];
            })
            ->sortBy('label', SORT_NATURAL | SORT_FLAG_CASE)
            ->values();

        return Inertia::render('Malls/Show', [
            'mall' => $mall->only(['id', 'name', 'slug']),
            'sellers' => $sellers,
        ]);
    }

    /**
     * Listings for one verified seller inside a mall.
     */
    public function seller(Request $request, Mall $mall, User $user)
    {
        if ($mall->status !== 'active') {
            abort(404);
        }

        $isVerifiedForMall = CorporateVerification::query()
            ->where('mall_id', $mall->id)
            ->where('user_id', $user->id)
            ->where('status', 'verified')
            ->exists();

        if (!$isVerifiedForMall) {
            abort(404);
        }

        $listings = Listing::query()
            ->where('user_id', $user->id)
            ->whereIn('status', $this->browseStatuses())
            ->where('listing_type', '!=', 'live_auction')
            ->with([
                'user.individualVerification',
                'user.corporateVerification',
                'category',
            ])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Malls/Seller', [
            'mall' => $mall->only(['id', 'name', 'slug']),
            'seller' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'company_name' => $user->company_name,
                'profile_pic' => $user->profile_pic,
                'label' => $user->company_name ?: $user->name,
            ],
            'listings' => $listings,
        ]);
    }
}
