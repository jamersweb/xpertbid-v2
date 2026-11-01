<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\BuyerRequestOfferResource;
use App\Http\Resources\Api\V1\BuyerRequestResource;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestOffer;
use App\Models\SellerBuyerRequestPreference;
use App\Services\BuyerRequestService;
use App\Support\BuyerRequestSiteScope;
use Illuminate\Http\Request;

class BuyerRequestController extends Controller
{
    public function __construct(protected BuyerRequestService $service)
    {
    }

    public function index(Request $request)
    {
        $site = BuyerRequestSiteScope::resolve($request);

        $query = BuyerRequest::query()
            ->with(['category', 'images'])
            ->withCount('offers')
            ->where('user_id', $request->user()->id);

        BuyerRequestSiteScope::applyToQuery($query, $site);

        $requests = $query->orderByDesc('created_at')->get();

        return BuyerRequestResource::collection($requests);
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

        BuyerRequestSiteScope::assertCategoryAllowed(
            BuyerRequestSiteScope::resolve($request),
            (int) $validated['category_id'],
            isset($validated['sub_category_id']) ? (int) $validated['sub_category_id'] : null,
            isset($validated['child_category_id']) ? (int) $validated['child_category_id'] : null
        );

        $buyerRequest = $this->service->createRequest(
            $request->user(),
            $validated,
            $request->file('images', []) ?: []
        );

        return (new BuyerRequestResource($buyerRequest))->response()->setStatusCode(201);
    }

    public function show(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('view', $buyerRequest);

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

        $buyerRequest->load([
            'category:id,name',
            'subCategory:id,name',
            'childCategory:id,name',
            'images:id,buyer_request_id,path,sort_order',
            'user:id,name,profile_pic',
            'offers.seller:id,name,profile_pic',
        ]);

        $authId = (int) $request->user()->id;
        $myOffer = $buyerRequest->offers->first(
            fn ($offer) => (int) $offer->seller_id === $authId
        );
        $buyerRequest->setAttribute('my_offer', $myOffer);

        return new BuyerRequestResource($buyerRequest);
    }

    public function update(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('update', $buyerRequest);

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

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

        BuyerRequestSiteScope::assertCategoryAllowed(
            $site,
            (int) $validated['category_id'],
            isset($validated['sub_category_id']) ? (int) $validated['sub_category_id'] : null,
            isset($validated['child_category_id']) ? (int) $validated['child_category_id'] : null
        );

        $updated = $this->service->updateRequest(
            $request->user(),
            $buyerRequest,
            $validated,
            $request->file('images', []) ?: [],
            $validated['remove_image_ids'] ?? []
        );

        return new BuyerRequestResource($updated);
    }

    public function close(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('close', $buyerRequest);

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

        $updated = $this->service->closeRequest($buyerRequest);

        return new BuyerRequestResource($updated->load([
            'category:id,name',
            'images:id,buyer_request_id,path,sort_order',
            'offers.seller:id,name,profile_pic',
        ]));
    }

    public function storeOffer(Request $request, BuyerRequest $buyerRequest)
    {
        $this->authorize('create', BuyerRequestOffer::class);

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

        $validated = $request->validate([
            'price' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:2000',
        ]);

        $offer = $this->service->submitOffer($request->user(), $buyerRequest, $validated);

        return (new BuyerRequestOfferResource($offer))->response()->setStatusCode(201);
    }

    public function updateOffer(Request $request, BuyerRequestOffer $offer)
    {
        $this->authorize('update', $offer);

        $validated = $request->validate([
            'price' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:2000',
        ]);

        $updated = $this->service->updateOffer($request->user(), $offer, $validated);

        return new BuyerRequestOfferResource($updated);
    }

    public function destroyOffer(Request $request, BuyerRequestOffer $offer)
    {
        $this->authorize('delete', $offer);
        $this->service->withdrawOffer($request->user(), $offer);

        return response()->json(['success' => true]);
    }

    public function acceptOffer(Request $request, BuyerRequest $buyerRequest, BuyerRequestOffer $offer)
    {
        $this->authorize('acceptOffer', $buyerRequest);

        if ((int) $offer->buyer_request_id !== (int) $buyerRequest->id) {
            abort(404);
        }

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

        $updated = $this->service->acceptOffer($request->user(), $offer);

        return new BuyerRequestOfferResource($updated);
    }

    public function rejectOffer(Request $request, BuyerRequest $buyerRequest, BuyerRequestOffer $offer)
    {
        $this->authorize('rejectOffer', $buyerRequest);

        if ((int) $offer->buyer_request_id !== (int) $buyerRequest->id) {
            abort(404);
        }

        $site = BuyerRequestSiteScope::resolve($request);
        if (! BuyerRequestSiteScope::requestBelongsToSite($buyerRequest, $site)) {
            abort(404);
        }

        $updated = $this->service->rejectOffer($request->user(), $offer);

        return new BuyerRequestOfferResource($updated);
    }

    public function matched(Request $request)
    {
        $user = $request->user();
        $user->loadMissing('corporateVerification');
        $site = BuyerRequestSiteScope::resolve($request);

        if (! $user->isCorporateVerified()) {
            return response()->json([
                'data' => [],
                'meta' => [
                    'is_corporate_verified' => false,
                    'has_preferences' => false,
                    'site' => $site,
                ],
            ]);
        }

        $preference = SellerBuyerRequestPreference::with(['categories', 'locations'])
            ->where('user_id', $user->id)
            ->first();

        $hasPreferences = $preference
            && ($preference->categories->isNotEmpty() || $preference->locations->isNotEmpty());

        $requests = $this->service->matchedOpenRequestsForSeller($user, $site);

        $myOffers = $user->buyerRequestOffers()
            ->whereIn('buyer_request_id', $requests->pluck('id'))
            ->whereNull('deleted_at')
            ->get()
            ->keyBy('buyer_request_id');

        $payload = $requests->map(function (BuyerRequest $item) use ($myOffers) {
            $item->setAttribute('my_offer', $myOffers->get($item->id));

            return $item;
        });

        return BuyerRequestResource::collection($payload)->additional([
            'meta' => [
                'is_corporate_verified' => true,
                'has_preferences' => $hasPreferences,
                'site' => $site,
            ],
        ]);
    }

    public function preferences(Request $request)
    {
        $user = $request->user();
        $user->loadMissing('corporateVerification');
        $preference = $user->sellerBuyerRequestPreference()
            ->with(['categories:id,name', 'locations'])
            ->first();

        return response()->json([
            'data' => $preference,
            'meta' => [
                'is_corporate_verified' => $user->isCorporateVerified(),
                'site' => BuyerRequestSiteScope::resolve($request),
            ],
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

        $site = BuyerRequestSiteScope::resolve($request);
        $categoryIds = BuyerRequestSiteScope::filterCategoryIds(
            $site,
            $validated['category_ids'] ?? []
        );

        $preference = $this->service->saveSellerPreferences(
            $request->user(),
            $categoryIds,
            $validated['locations'] ?? []
        );

        return response()->json([
            'success' => true,
            'data' => $preference,
        ]);
    }
}
