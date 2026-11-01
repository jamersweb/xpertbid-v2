<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerRequest;
use App\Models\Conversation;
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
                'user:id,name,email,profile_pic',
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
                'user:id,name,email,profile_pic,phone',
                'category:id,name',
                'subCategory:id,name',
                'childCategory:id,name',
                'images:id,buyer_request_id,path,sort_order',
                'offers' => function ($q) {
                    $q->with([
                        'seller:id,name,email,profile_pic',
                        'seller.corporateVerification:id,user_id,status',
                    ])
                        ->orderByRaw("CASE status WHEN 'accepted' THEN 0 WHEN 'pending' THEN 1 WHEN 'rejected' THEN 2 ELSE 3 END")
                        ->orderBy('price');
                },
                'acceptedOffer.seller:id,name,email,profile_pic',
            ])
            ->withCount('offers')
            ->findOrFail($id);

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

                return $offer;
            })
        );

        return Inertia::render('Admin/BuyerRequests/Show', [
            'buyerRequest' => $buyerRequest,
        ]);
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
