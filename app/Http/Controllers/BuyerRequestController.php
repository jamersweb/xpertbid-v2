<?php

namespace App\Http\Controllers;

use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestOffer;
use App\Services\BuyerRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BuyerRequestController extends Controller
{
    public function __construct(protected BuyerRequestService $service)
    {
    }

    public function index()
    {
        $requests = BuyerRequest::query()
            ->with([
                'category:id,name',
                'subCategory:id,name',
                'childCategory:id,name',
                'images:id,buyer_request_id,path,sort_order',
            ])
            ->withCount([
                'offers',
                'offers as pending_offers_count' => fn ($q) => $q->where('status', 'pending'),
            ])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get([
                'id',
                'title',
                'slug',
                'description',
                'category_id',
                'sub_category_id',
                'child_category_id',
                'location_label',
                'budget',
                'status',
                'created_at',
                'updated_at',
            ]);

        return Inertia::render('BuyerRequests/Index', [
            'requests' => $requests,
        ]);
    }

    public function create()
    {
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('BuyerRequests/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:10000',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'location_label' => 'nullable|string|max:500',
            'country' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'city' => 'nullable|string|max:120',
            'budget' => 'nullable|numeric|min:0',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images' => 'nullable|array|max:8',
            'images.*' => 'image|mimes:jpeg,jpg,png,webp,gif|max:10240',
        ]);

        $buyerRequest = $this->service->createRequest(
            Auth::user(),
            $validated,
            $request->file('images', []) ?: []
        );

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'request' => $buyerRequest,
            ], 201);
        }

        return redirect()
            ->route('buyer-requests.show', $buyerRequest)
            ->with('success', 'Buyer request posted successfully.');
    }

    public function show(BuyerRequest $buyerRequest)
    {
        $this->authorize('view', $buyerRequest);

        $buyerRequest->load([
            'category:id,name',
            'subCategory:id,name',
            'childCategory:id,name',
            'images:id,buyer_request_id,path,sort_order',
            'user:id,name,profile_pic',
            'user.corporateVerification:id,user_id,status',
            'user.individualVerification:id,user_id,status',
            'offers' => function ($q) {
                $q->with([
                    'seller:id,name,profile_pic',
                    'seller.corporateVerification:id,user_id,status',
                    'seller.individualVerification:id,user_id,status',
                ])
                    ->orderByRaw("CASE status WHEN 'accepted' THEN 0 WHEN 'pending' THEN 1 WHEN 'rejected' THEN 2 ELSE 3 END")
                    ->orderBy('price');
            },
            'acceptedOffer.seller:id,name,profile_pic',
            'acceptedOffer.seller.corporateVerification:id,user_id,status',
            'acceptedOffer.seller.individualVerification:id,user_id,status',
        ])->loadCount('offers');

        $isOwner = (int) $buyerRequest->user_id === (int) Auth::id();
        $authId = (int) Auth::id();

        // Prefer this seller's pending/accepted offer when resolving "my offer".
        // All offers stay visible so buyers and competing sellers can compare bids.
        $myOffer = null;
        if (! $isOwner) {
            $myOffer = $buyerRequest->offers
                ->filter(fn ($offer) => (int) $offer->seller_id === $authId)
                ->sortBy(function ($offer) {
                    return match ($offer->status) {
                        BuyerRequestOffer::STATUS_PENDING => 0,
                        BuyerRequestOffer::STATUS_ACCEPTED => 1,
                        BuyerRequestOffer::STATUS_REJECTED => 2,
                        default => 3,
                    };
                })
                ->first();
        }

        $user = Auth::user();
        $user->loadMissing('corporateVerification');

        return Inertia::render('BuyerRequests/Show', [
            'buyerRequest' => $buyerRequest,
            'isOwner' => $isOwner,
            'canOffer' => ! $isOwner && $user->isCorporateVerified() && $buyerRequest->isOpen(),
            'myOffer' => $myOffer,
            'offersCount' => (int) ($buyerRequest->offers_count ?? 0),
        ]);
    }

    public function edit(BuyerRequest $buyerRequest)
    {
        $this->authorize('update', $buyerRequest);

        $buyerRequest->load([
            'category:id,name',
            'subCategory:id,name',
            'childCategory:id,name',
            'images:id,buyer_request_id,path,sort_order',
        ])->loadCount('offers');

        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('BuyerRequests/Edit', [
            'buyerRequest' => $buyerRequest,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('update', $buyerRequest);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:10000',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'location_label' => 'nullable|string|max:500',
            'country' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:120',
            'city' => 'nullable|string|max:120',
            'budget' => 'nullable|numeric|min:0',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images' => 'nullable|array|max:8',
            'images.*' => 'image|mimes:jpeg,jpg,png,webp,gif|max:10240',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'integer',
        ]);

        $updated = $this->service->updateRequest(
            Auth::user(),
            $buyerRequest,
            $validated,
            $request->file('images', []) ?: [],
            $validated['remove_image_ids'] ?? []
        );

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'request' => $updated,
            ]);
        }

        return redirect()
            ->route('buyer-requests.show', $updated)
            ->with('success', 'Buyer request updated successfully.');
    }

    public function close(BuyerRequest $buyerRequest)
    {
        $this->authorize('close', $buyerRequest);

        $this->service->closeRequest($buyerRequest);

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', 'Request closed.');
    }

    public function acceptOffer(BuyerRequest $buyerRequest, BuyerRequestOffer $offer)
    {
        $this->authorize('acceptOffer', $buyerRequest);

        if ((int) $offer->buyer_request_id !== (int) $buyerRequest->id) {
            abort(404);
        }

        $this->service->acceptOffer(Auth::user(), $offer);

        return back()->with('success', 'Offer accepted. Contact XpertBid support to complete the purchase.');
    }

    public function rejectOffer(BuyerRequest $buyerRequest, BuyerRequestOffer $offer)
    {
        $this->authorize('rejectOffer', $buyerRequest);

        if ((int) $offer->buyer_request_id !== (int) $buyerRequest->id) {
            abort(404);
        }

        $this->service->rejectOffer(Auth::user(), $offer);

        return back()->with('success', 'Offer rejected.');
    }

    public function storeOffer(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('create', BuyerRequestOffer::class);

        $validated = $request->validate([
            'price' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:2000',
        ]);

        $this->service->submitOffer(Auth::user(), $buyerRequest, $validated);

        return back()->with('success', 'Offer submitted.');
    }

    public function updateOffer(Request $request, BuyerRequestOffer $offer)
    {
        $this->authorize('update', $offer);

        $validated = $request->validate([
            'price' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:2000',
        ]);

        $this->service->updateOffer(Auth::user(), $offer, $validated);

        return back()->with('success', 'Offer updated.');
    }

    public function destroyOffer(BuyerRequestOffer $offer)
    {
        $this->authorize('delete', $offer);

        $this->service->withdrawOffer(Auth::user(), $offer);

        return back()->with('success', 'Offer withdrawn.');
    }
}
