<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FavoritesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $favorites = Favorite::where('user_id', $user->id)
            ->with(['auction' => function ($query) {
                // Eager load necessary fields + relationships
                $query->with(['bids']); 
            }])
            ->get()
            ->map(function ($favorite) {
                $auction = $favorite->auction;
                if (!$auction) return null;
                
                return [
                    'id' => $auction->id,
                    'title' => $auction->title,
                    'image' => $auction->image, // Accessor or column
                    'current_bid' => $auction->bids->max('bid_amount') ?? 0,
                    'minimum_bid' => $auction->minimum_bid,
                    'start_date' => $auction->start_date,
                    'end_date' => $auction->end_date,
                    'slug' => $auction->slug ?? $auction->id,
                ];
            })
            ->filter(); // Remove nulls

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites->values()
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'auction_id' => 'required|integer|exists:auctions,id'
        ]);

        $user = $request->user();
        $auctionId = $request->auction_id;

        $favorite = Favorite::where('user_id', $user->id)
            ->where('auctions_id', $auctionId) // Note: column name from original code is 'auctions_id'
            ->first();

        if ($favorite) {
            $favorite->delete();
            return redirect()->back()->with('success', 'Removed from favorites.');
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'auctions_id' => $auctionId
            ]);
            return redirect()->back()->with('success', 'Added to favorites.');
        }
    }
}
