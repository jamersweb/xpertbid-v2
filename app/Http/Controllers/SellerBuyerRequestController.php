<?php

namespace App\Http\Controllers;

use App\Models\AuctionCategory;
use App\Models\SellerBuyerRequestPreference;
use App\Services\BuyerRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerBuyerRequestController extends Controller
{
    public function __construct(protected BuyerRequestService $service)
    {
    }

    public function browse()
    {
        $user = Auth::user();
        if ($user) {
            $user->loadMissing('corporateVerification');
        }

        $isCorporateVerified = $user ? $user->isCorporateVerified() : false;
        $hasPreferences = false;
        $myOffers = collect();

        if ($user) {
            $preference = SellerBuyerRequestPreference::with(['categories', 'locations'])
                ->where('user_id', $user->id)
                ->first();

            $hasPreferences = $preference
                && ($preference->categories->isNotEmpty() || $preference->locations->isNotEmpty());
        }

        // Anyone (guest, unverified, corporate) can browse open leads
        $requests = $this->service->matchedOpenRequestsForSeller($user);

        if ($user && $requests->isNotEmpty()) {
            $myOffers = $user->buyerRequestOffers()
                ->whereIn('buyer_request_id', $requests->pluck('id'))
                ->whereNull('deleted_at')
                ->orderByRaw("CASE status WHEN 'pending' THEN 0 WHEN 'accepted' THEN 1 WHEN 'rejected' THEN 2 ELSE 3 END")
                ->orderByDesc('id')
                ->get()
                ->unique('buyer_request_id')
                ->keyBy('buyer_request_id');
        }

        return Inertia::render('BuyerRequests/Seller/Browse', [
            'requests' => $requests->map(function ($request) use ($myOffers) {
                $request->setAttribute('my_offer', $myOffers->get($request->id));

                return $request;
            }),
            'isCorporateVerified' => $isCorporateVerified,
            'isLoggedIn' => (bool) $user,
            'hasPreferences' => $hasPreferences,
        ]);
    }

    public function preferences()
    {
        $user = Auth::user();
        $user->loadMissing('corporateVerification');

        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->orderBy('name')
            ->get(['id', 'name']);

        $preference = SellerBuyerRequestPreference::with(['categories', 'locations'])
            ->where('user_id', $user->id)
            ->first();

        return Inertia::render('BuyerRequests/Seller/Preferences', [
            'categories' => $categories,
            'preference' => $preference,
            'isCorporateVerified' => $user->isCorporateVerified(),
        ]);
    }

    public function savePreferences(Request $request)
    {
        $validated = $request->validate([
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:auction_categories,id',
            'locations' => 'nullable|array',
            'locations.*.location_label' => 'nullable|string|max:500',
            'locations.*.country' => 'nullable|string|max:120',
            'locations.*.state' => 'nullable|string|max:120',
            'locations.*.city' => 'nullable|string|max:120',
            'locations.*.latitude' => 'nullable|numeric',
            'locations.*.longitude' => 'nullable|numeric',
        ]);

        $preference = $this->service->saveSellerPreferences(
            Auth::user(),
            $validated['category_ids'] ?? [],
            $validated['locations'] ?? []
        );

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'preference' => $preference,
            ]);
        }

        return back()->with('success', 'Preferences saved.');
    }
}
