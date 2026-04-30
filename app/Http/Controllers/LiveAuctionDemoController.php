<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Public demo: one listing + YouTube embed + real bidding (no YouTube chat).
 */
class LiveAuctionDemoController extends Controller
{
    public const DEMO_LISTING_SLUG = 'car-showcase-4-vkxgiyxw';

    /** Fallback stream (24/7) when the listing has no youtube_video_id set. */
    public const FALLBACK_YOUTUBE_VIDEO_ID = 'jfKfPfyJRdk';

    protected function listingUserRelations(): array
    {
        return [
            'user',
            'user.individualVerification',
            'user.corporateVerification',
        ];
    }

    public function show()
    {
        $listing = Listing::query()
            ->where('slug', self::DEMO_LISTING_SLUG)
            ->orWhere('id', self::DEMO_LISTING_SLUG)
            ->with(array_merge($this->listingUserRelations(), ['category', 'bids.user']))
            ->firstOrFail();

        $highestBid = $listing->bids()->max('bid_amount') ?? 0;

        $winnerDetails = null;
        if ($listing->status === 'awarded' || $listing->status === 'awarded ') {
            $winningBid = $listing->bids()->orderBy('bid_amount', 'desc')->first();
            if ($winningBid && $winningBid->user) {
                $winnerDetails = [[
                    'name' => $winningBid->user->name,
                    'email' => $winningBid->user->email,
                ]];
            }
        }

        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = Favorite::where('user_id', Auth::id())
                ->where('listing_id', $listing->id)
                ->exists();
        }

        $youtubeVideoId = $listing->youtube_video_id ?: self::FALLBACK_YOUTUBE_VIDEO_ID;

        return Inertia::render('Demo/LiveAuction', [
            'auction' => $listing,
            'bids' => $listing->bids()->with('user')->orderBy('created_at', 'desc')->get(),
            'highestBid' => $highestBid,
            'winnerDetails' => $winnerDetails,
            'isFavorite' => $isFavorite,
            'youtubeVideoId' => $youtubeVideoId,
            'standardProductUrl' => route('product.show', $listing->slug),
        ]);
    }
}
