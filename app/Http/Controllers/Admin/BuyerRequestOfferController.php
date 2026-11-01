<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyerRequestOffer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerRequestOfferController extends Controller
{
    public function index(Request $request)
    {
        $query = BuyerRequestOffer::query()
            ->with([
                'buyerRequest:id,title,slug,status,user_id',
                'seller:id,name,email,profile_pic',
            ]);

        if ($search = trim((string) $request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('message', 'LIKE', "%{$search}%")
                    ->orWhereHas('buyerRequest', function ($requestQuery) use ($search) {
                        $requestQuery->where('title', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('seller', function ($sellerQuery) use ($search) {
                        $sellerQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        $status = $request->input('status', 'all');
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $offers = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/BuyerRequestOffers/Index', [
            'offers' => $offers,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $status ?: 'all',
            ],
        ]);
    }
}
