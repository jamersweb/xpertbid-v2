<?php

namespace App\Console\Commands;

use App\Models\Bid;
use App\Models\Listing;
use App\Models\NewNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class CheckListingAuctionStatus extends Command
{
    protected $signature = 'auction:check-status';

    protected $description = 'Check expired listing auctions and update them to awarded or closed';

    public function handle(): int
    {
        $now = Carbon::now();

        $expiredListings = Listing::query()
            ->where('listing_type', 'auction')
            ->where('status', 'active')
            ->whereNotNull('listing_data->end_date')
            ->where('listing_data->end_date', '<', $now->format('Y-m-d H:i:s'))
            ->with(['user'])
            ->get();

        if ($expiredListings->isEmpty()) {
            Cache::forever('auction_status_last_checked_at', $now->toDateTimeString());
            $this->info('No expired active auction listings found.');
            return self::SUCCESS;
        }

        $awardedCount = 0;
        $closedCount = 0;

        foreach ($expiredListings as $listing) {
            $highestBid = Bid::query()
                ->where('listing_id', $listing->id)
                ->orderByDesc('bid_amount')
                ->first();

            $listingData = is_array($listing->listing_data) ? $listing->listing_data : [];

            if ($highestBid) {
                $listingData['winner_id'] = $highestBid->user_id;
                $listingData['winning_bid_amount'] = $highestBid->bid_amount;

                $listing->update([
                    'status' => 'awarded',
                    'listing_data' => $listingData,
                ]);

                NewNotification::create([
                    'user_id' => $highestBid->user_id,
                    'title' => 'Congratulations! You won the auction',
                    'message' => 'You won "' . $listing->title . '" with your highest bid.',
                    'type' => 'auction',
                    'image_url' => NewNotification::getImageForType('auction'),
                ]);

                if ($listing->user_id) {
                    NewNotification::create([
                        'user_id' => $listing->user_id,
                        'title' => 'Your auction has a winner',
                        'message' => 'Your auction "' . $listing->title . '" has been awarded to the highest bidder.',
                        'type' => 'auction',
                        'image_url' => NewNotification::getImageForType('auction'),
                    ]);
                }

                $awardedCount++;
                continue;
            }

            $listing->update([
                'status' => 'closed',
                'listing_data' => $listingData,
            ]);

            if ($listing->user_id) {
                NewNotification::create([
                    'user_id' => $listing->user_id,
                    'title' => 'Your auction has closed',
                    'message' => 'Your auction "' . $listing->title . '" ended without any valid bids.',
                    'type' => 'auction',
                    'image_url' => NewNotification::getImageForType('auction'),
                ]);
            }

            $closedCount++;
        }

        $this->info("Awarded: {$awardedCount}");
        $this->info("Closed: {$closedCount}");
        Cache::forever('auction_status_last_checked_at', $now->toDateTimeString());

        return self::SUCCESS;
    }
}
