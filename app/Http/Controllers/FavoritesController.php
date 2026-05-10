<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FavoritesController extends Controller
{
    protected function wantsMobileJson(Request $request): bool
    {
        return $request->wantsJson() || $request->expectsJson();
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $favorites = Favorite::where('user_id', $user->id)
            ->with(['listing'])
            ->get()
            ->map(function ($favorite) {
                $item = $favorite->listing;
                
                if (!$item)
                    return null;

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->image_url, 
                    'current_bid' => $item->bids->max('bid_amount') ?? 0,
                    'minimum_bid' => $item->minimum_bid,
                    'start_date' => $item->start_date,
                    'end_date' => $item->end_date,
                    'slug' => $item->slug ?? $item->id,
                    'list_type' => $item->list_type,
                    'is_listing' => true,
                ];
            })
            ->filter();

        $items = $favorites->values();

        if ($this->wantsMobileJson($request)) {
            return response()->json([
                'favorites' => $items,
                'data' => $items,
            ]);
        }

        return Inertia::render('Favorites/Index', [
            'favorites' => $items
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'listing_id' => 'required|integer|exists:listings,id',
        ]);

        $user = $request->user();
        $listingId = $request->listing_id;

        $favorite = Favorite::where('user_id', $user->id)
            ->where('listing_id', $listingId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            if ($this->wantsMobileJson($request)) {
                return response()->json([
                    'success' => true,
                    'favorited' => false,
                    'message' => 'Removed from favorites.',
                ]);
            }
            return redirect()->back(303)->with('success', 'Removed from favorites.');
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'listing_id' => $listingId,
            ]);
            if ($this->wantsMobileJson($request)) {
                return response()->json([
                    'success' => true,
                    'favorited' => true,
                    'message' => 'Added to favorites.',
                ]);
            }
            return redirect()->back(303)->with('success', 'Added to favorites.');
        }
    }
}
