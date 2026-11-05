<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerRequest;
use App\Models\Conversation;
use App\Models\User;
use App\Services\BuyerRequestService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerRequestController extends Controller
{
    public function __construct(protected BuyerRequestService $service)
    {
    }

    public function index(Request $request)
    {
        $query = BuyerRequest::query()
            ->with([
                'user:id,name,email,profile_pic,phone',
                'user.individualVerification:id,user_id,contact_number',
                'category:id,name',
            ])
            ->withCount([
                'offers',
                'offers as pending_offers_count' => fn ($q) => $q->where('status', 'pending'),
            ]);

        if ($search = trim((string) $request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('location_label', 'LIKE', "%{$search}%")
                    ->orWhere('city', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        $status = $request->input('status', 'all');
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $requests = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/BuyerRequests/Index', [
            'requests' => $requests,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $status ?: 'all',
            ],
        ]);
    }

    public function show(int $id)
    {
        $buyerRequest = BuyerRequest::query()
            ->with([
                'user' => function ($q) {
                    $q->select('id', 'name', 'email', 'profile_pic', 'phone', 'address', 'country_id', 'city_id')
                        ->with([
                            'individualVerification:id,user_id,contact_number,residential_address,country,status',
                            'corporateVerification:id,user_id,legal_entity_name,registered_address,country,status',
                            'country:id,name',
                            'shippingAddress',
                        ]);
                },
                'category:id,name',
                'subCategory:id,name',
                'childCategory:id,name',
                'images:id,buyer_request_id,path,sort_order',
                'offers' => function ($q) {
                    $q->with([
                        'seller' => function ($sq) {
                            $sq->select('id', 'name', 'email', 'profile_pic', 'phone', 'address', 'country_id', 'city_id')
                                ->with([
                                    'individualVerification:id,user_id,contact_number,residential_address,country,status',
                                    'corporateVerification:id,user_id,legal_entity_name,registered_address,country,status',
                                    'country:id,name',
                                    'shippingAddress',
                                ]);
                        },
                    ])
                        ->orderByRaw("CASE status WHEN 'accepted' THEN 0 WHEN 'pending' THEN 1 WHEN 'rejected' THEN 2 ELSE 3 END")
                        ->orderBy('price');
                },
                'acceptedOffer.seller' => function ($sq) {
                    $sq->select('id', 'name', 'email', 'profile_pic', 'phone', 'address', 'country_id', 'city_id')
                        ->with([
                            'individualVerification:id,user_id,contact_number,residential_address,country,status',
                            'corporateVerification:id,user_id,legal_entity_name,registered_address,country,status',
                            'country:id,name',
                            'shippingAddress',
                        ]);
                },
            ])
            ->withCount('offers')
            ->findOrFail($id);

        $acceptedOffer = $buyerRequest->acceptedOffer ?: $buyerRequest->offers->firstWhere('status', 'accepted');
        if ($acceptedOffer && ! $buyerRequest->acceptedOffer) {
            $buyerRequest->setRelation('acceptedOffer', $acceptedOffer);
        }

        $this->enrichUserData($buyerRequest->user);

        $offerIds = $buyerRequest->offers->pluck('id');
        $conversationsByOffer = Conversation::query()
            ->whereIn('buyer_request_offer_id', $offerIds)
            ->get(['id', 'buyer_request_offer_id'])
            ->keyBy('buyer_request_offer_id');

        $buyerRequest->setRelation(
            'offers',
            $buyerRequest->offers->map(function ($offer) use ($conversationsByOffer) {
                $offer->setAttribute(
                    'conversation_id',
                    $conversationsByOffer->get($offer->id)?->id
                );
                $this->enrichUserData($offer->seller);

                return $offer;
            })
        );

        if ($buyerRequest->acceptedOffer) {
            $buyerRequest->acceptedOffer->setAttribute(
                'conversation_id',
                $conversationsByOffer->get($buyerRequest->acceptedOffer->id)?->id
            );
            $this->enrichUserData($buyerRequest->acceptedOffer->seller);
        }

        return Inertia::render('Admin/BuyerRequests/Show', [
            'buyerRequest' => $buyerRequest,
        ]);
    }

    private function enrichUserData(?User $user): void
    {
        if (! $user) {
            return;
        }

        $rawPhone = trim((string) ($user->phone ?? ''));
        $indPhone = trim((string) ($user->individualVerification?->contact_number ?? ''));

        $phone = !empty($rawPhone) ? $rawPhone : (!empty($indPhone) ? $indPhone : null);
        $phoneSource = !empty($rawPhone) ? 'user' : (!empty($indPhone) ? 'individual_verification' : null);

        $corpAddress = trim((string) ($user->corporateVerification?->registered_address ?? ''));
        $corpCountry = trim((string) ($user->corporateVerification?->country ?? ''));
        if (!empty($corpAddress) && !empty($corpCountry) && stripos($corpAddress, $corpCountry) === false) {
            $corpAddress .= ', ' . $corpCountry;
        }

        $indAddress = trim((string) ($user->individualVerification?->residential_address ?? ''));
        $indCountry = trim((string) ($user->individualVerification?->country ?? ''));
        if (!empty($indAddress) && !empty($indCountry) && stripos($indAddress, $indCountry) === false) {
            $indAddress .= ', ' . $indCountry;
        }

        $userAddress = trim((string) ($user->address ?? ''));

        $shippingAddress = null;
        if ($user->shippingAddress) {
            $parts = array_filter([
                $user->shippingAddress->addressLine1,
                $user->shippingAddress->city,
                $user->shippingAddress->state,
                $user->shippingAddress->country,
            ]);
            if (!empty($parts)) {
                $shippingAddress = implode(', ', $parts);
            }
        }

        $cityCountry = implode(', ', array_filter([
            $user->city,
            $user->state,
            $user->country?->name ?? (is_string($user->country) ? $user->country : null),
        ]));

        $resolvedLocation = $corpAddress
            ?: ($indAddress
            ?: ($userAddress
            ?: ($shippingAddress
            ?: ($cityCountry ?: null))));

        $user->setAttribute('resolved_phone', $phone);
        $user->setAttribute('phone_source', $phoneSource);
        $user->setAttribute('resolved_location', $resolvedLocation);
    }

    public function close(int $id)
    {
        $buyerRequest = BuyerRequest::findOrFail($id);
        $this->service->closeRequest($buyerRequest);

        return back()->with('success', 'Buyer request closed.');
    }

    public function destroy(int $id)
    {
        $buyerRequest = BuyerRequest::findOrFail($id);
        $buyerRequest->delete();

        return redirect()
            ->route('admin.buyer-requests.index')
            ->with('success', 'Buyer request deleted.');
    }
}
