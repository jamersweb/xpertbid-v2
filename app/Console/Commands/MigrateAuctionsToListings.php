<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\Listing;
use App\Models\Bid;
use App\Models\User;
use App\Models\AuctionCategory;
use Illuminate\Support\Facades\DB;
use App\Support\ListingMedia;

class MigrateAuctionsToListings extends Command
{
    protected $signature = 'auctions:migrate-to-listings';
    protected $description = 'Migrate data from auctions table to listings table';

    public function handle()
    {
        $auctions = Auction::all();
        $this->info("Found " . $auctions->count() . " auctions to migrate.");

        $migratedCount = 0;
        $skippedCount = 0;

        foreach ($auctions as $auction) {
            // Check for valid user
            if (!User::find($auction->user_id)) {
                $this->warn("Skipping auction '{$auction->title}' (ID: {$auction->id}) due to invalid UserID: {$auction->user_id}");
                $skippedCount++;
                continue;
            }

            // Check for valid category (optional but recommended)
            if (!AuctionCategory::find($auction->category_id)) {
                 $this->warn("Skipping auction '{$auction->title}' (ID: {$auction->id}) due to invalid CategoryID: {$auction->category_id}");
                 $skippedCount++;
                 continue;
            }

            $this->info("Migrating: {$auction->title} (ID: {$auction->id})");

            $searchDirectories = ListingMedia::defaultSearchDirectories($auction->image);
            $album = ListingMedia::repairMediaList($auction->album, $searchDirectories);
            $image = ListingMedia::repairImagePath($auction->image, $searchDirectories)
                ?? ListingMedia::firstDisplayableImage($album);

            // Prepare listing data
            $listingData = [
                'current_highest_bid' => $auction->current_highest_bid,
                'start_date' => $auction->start_date,
                'end_date' => $auction->end_date,
                'live_auction_date' => $auction->live_auction_date,
                'live_auction_start_time' => $auction->live_auction_start_time,
                'live_auction_end_time' => $auction->live_auction_end_time,
                'reserve_price' => $auction->reserve_price,
                'minimum_bid' => $auction->minimum_bid,
                'is_bid_increment' => $auction->is_bid_increment,
                'bid_increment' => $auction->bid_increment,
                'is_buynow' => $auction->is_buynow,
                'buy_now_price' => $auction->buy_now_price,
                'international_shipping' => $auction->international_shipping,
                'shipping_conditions' => $auction->shipping_conditions,
                'shipping_terms' => $auction->shipping_terms,
                'is_autobidder_on' => $auction->is_autobidder_on,
                'winner_id' => $auction->winner_id,
                'decline_reason' => $auction->decline_reason,
                'discount_type' => $auction->discount_type,
                'discount_value' => $auction->discount_value,
                // Real estate / vehicle specific fields
                'location_url' => $auction->location_url,
                'delivery_date' => $auction->delivery_date,
                'sale_starts' => $auction->sale_starts,
                'payment_plan' => $auction->payment_plan,
                'number_of_buildings' => $auction->number_of_buildings,
                'government_fee' => $auction->government_fee,
                'nearby_location' => $auction->nearby_location,
            ];

            // Prepare category features
            $categoryFeatures = [
                'product_condition' => $auction->product_condition,
                'product_year' => $auction->product_year,
                'product_location' => $auction->product_location,
                'amenities' => $auction->amenities,
                'facilities' => $auction->facilities,
            ];

            // Create or update listing
            $listing = Listing::updateOrCreate(
                ['slug' => $auction->slug],
                [
                    'user_id' => $auction->user_id,
                    'category_id' => $auction->category_id,
                    'sub_category_id' => $auction->sub_category_id,
                    'child_category_id' => $auction->child_category_id,
                    'listing_type' => $auction->list_type ?: 'auction',
                    'title' => $auction->title,
                    'image' => $image,
                    'album' => $album,
                    'description' => $auction->description,
                    'status' => $auction->status ?: 'active',
                    'featured_name' => $auction->featured_name,
                    'is_1_rupee' => $auction->is_1_rupee,
                    'views' => $auction->views ?: 0,
                    'listing_data' => $listingData,
                    'winner_id' => $auction->winner_id,
                    'category_features' => $categoryFeatures,
                    'created_at' => $auction->created_at,
                    'updated_at' => $auction->updated_at,
                ]
            );

            // Update bids
            Bid::where('auction_id', $auction->id)->update(['listing_id' => $listing->id]);
            $migratedCount++;
        }

        $this->info("\nMigration results:");
        $this->info("Migrated: $migratedCount");
        $this->info("Skipped: $skippedCount");
        $this->info("Total Processed: " . ($migratedCount + $skippedCount));
    }
}
