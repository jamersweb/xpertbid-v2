<?php

namespace App\Console\Commands;

use App\Models\Bid;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoBidCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auto:bid';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically place bids on active auto-bid enabled auction listings';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting listing auto-bid process...');

        $dummyUsers = User::query()
            ->whereBetween('id', [328, 347])
            ->where('status', 'active')
            ->get();

        if ($dummyUsers->isEmpty()) {
            $this->error('No active dummy users found in ID range 328-347.');
            return self::FAILURE;
        }

        $activeListings = Listing::query()
            ->where('listing_type', 'auction')
            ->where('status', 'active')
            ->where('is_autobidder_on', true)
            ->with('user:id')
            ->orderBy('id')
            ->get()
            ->filter(function (Listing $listing) {
                $endDate = data_get($listing->listing_data, 'end_date');
                if (!$endDate) {
                    return true;
                }

                try {
                    return Carbon::parse($endDate)->isFuture();
                } catch (\Throwable $e) {
                    return true;
                }
            })
            ->values();

        if ($activeListings->isEmpty()) {
            $this->warn('No active auto-bid enabled auction listings found.');
            return self::SUCCESS;
        }

        $bidsPlaced = 0;
        $errors = 0;

        foreach ($activeListings as $index => $listing) {
            try {
                $biddedUserIds = Bid::query()
                    ->where('listing_id', $listing->id)
                    ->whereIn('user_id', $dummyUsers->pluck('id')->all())
                    ->pluck('user_id')
                    ->all();

                $availableUsers = $dummyUsers->filter(fn ($user) => !in_array($user->id, $biddedUserIds, true));
                $orderedDummyUsers = $dummyUsers->values();

                if ($availableUsers->isEmpty()) {
                    $this->warn("Listing #{$listing->id}: all dummy users already bid, rotating to next user...");

                    $lastDummyBidUserId = (int) (Bid::query()
                        ->where('listing_id', $listing->id)
                        ->whereIn('user_id', $orderedDummyUsers->pluck('id')->all())
                        ->latest('id')
                        ->value('user_id') ?? 0);

                    $lastIndex = $orderedDummyUsers->search(fn ($u) => (int) $u->id === $lastDummyBidUserId);
                    $nextIndex = $lastIndex === false
                        ? 0
                        : (($lastIndex + 1) % max($orderedDummyUsers->count(), 1));

                    $selectedUser = $orderedDummyUsers[$nextIndex];
                } else {
                    $selectedUser = $availableUsers->values()[$index % max($availableUsers->count(), 1)];
                }

                if ((int) $listing->user_id === (int) $selectedUser->id) {
                    $fallbackPool = $availableUsers->isEmpty() ? $orderedDummyUsers : $availableUsers;
                    $selectedUser = $fallbackPool->first(fn ($u) => (int) $u->id !== (int) $listing->user_id) ?? $selectedUser;
                }

                $currentHighestBid = (float) (Bid::query()
                    ->where('listing_id', $listing->id)
                    ->max('bid_amount') ?? 0);

                $minimumBid = (float) ($listing->minimum_bid ?? 0);
                $bidIncrement = (float) (data_get($listing->listing_data, 'bid_increment') ?? 10);
                if ($bidIncrement <= 0) {
                    $bidIncrement = 10;
                }

                $newBidAmount = max($currentHighestBid + $bidIncrement, $minimumBid + $bidIncrement);

                DB::beginTransaction();

                $latestListing = Listing::query()->lockForUpdate()->find($listing->id);
                if (!$latestListing || $latestListing->status !== 'active' || !$latestListing->is_autobidder_on) {
                    DB::rollBack();
                    $this->warn("Listing #{$listing->id} is no longer eligible for auto-bid.");
                    continue;
                }

                $latestHighestBid = (float) (Bid::query()
                    ->where('listing_id', $listing->id)
                    ->lockForUpdate()
                    ->max('bid_amount') ?? 0);

                if ($newBidAmount <= $latestHighestBid) {
                    $newBidAmount = $latestHighestBid + $bidIncrement;
                }

                Bid::query()->create([
                    'user_id' => $selectedUser->id,
                    'auction_id' => null,
                    'listing_id' => $listing->id,
                    'bid_amount' => $newBidAmount,
                    'bid_source' => 'auto_bid',
                ]);

                DB::commit();

                $bidsPlaced++;
                $this->info("Bid placed: listing #{$listing->id}, user #{$selectedUser->id}, amount {$newBidAmount}");
            } catch (\Throwable $e) {
                DB::rollBack();
                $errors++;
                $this->error("Error on listing #{$listing->id}: {$e->getMessage()}");
                Log::error('Listing auto-bid failed', [
                    'listing_id' => $listing->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Auto-bid complete. Bids placed: {$bidsPlaced}, errors: {$errors}, listings processed: {$activeListings->count()}");

        Log::info('Listing auto-bid completed', [
            'bids_placed' => $bidsPlaced,
            'errors' => $errors,
            'listings_processed' => $activeListings->count(),
        ]);

        return self::SUCCESS;
    }
}
