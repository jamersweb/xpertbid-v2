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
    private const AUTO_BID_CYCLE_MINUTES = 180;
    private const FIRST_BID_DELAY_RANGE = [5, 15];
    private const FOLLOW_UP_DELAY_RANGE = [50, 65];
    private const BID_BOOST_RANGE = [50, 700];

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
            ->where('email', 'like', 'dummy_user_%@xpertbid.com')
            ->where('status', 'active')
            ->get();

        if ($dummyUsers->isEmpty()) {
            $this->error('No active dummy users found (email like dummy_user_%@xpertbid.com).');
            return self::FAILURE;
        }

        $this->info("Loaded {$dummyUsers->count()} dummy users for auto-bid.");

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
                DB::beginTransaction();

                $latestListing = Listing::query()->lockForUpdate()->find($listing->id);
                if (!$latestListing || $latestListing->status !== 'active' || !$latestListing->is_autobidder_on) {
                    DB::rollBack();
                    $this->warn("Listing #{$listing->id} is no longer eligible for auto-bid.");
                    continue;
                }

                $listingData = is_array($latestListing->listing_data) ? $latestListing->listing_data : [];
                $now = Carbon::now();

                if ($this->isCycleCoolingDown($listingData, $now)) {
                    DB::rollBack();
                    $this->info("Listing #{$listing->id}: auto-bid cycle cooling down.");
                    continue;
                }

                $startedNewCycle = false;
                if ($this->shouldStartNewCycle($listingData, $now)) {
                    $listingData = $this->startNewCycle($listingData, $now);
                    $startedNewCycle = true;
                }

                $nextDueAt = $this->parseDateTime(data_get($listingData, 'auto_bid_next_due_at'));
                if (!$nextDueAt || $now->lt($nextDueAt)) {
                    if ($startedNewCycle) {
                        $latestListing->update([
                            'listing_data' => $listingData,
                        ]);
                        DB::commit();
                    } else {
                        DB::rollBack();
                    }
                    continue;
                }

                $bidsPlacedInCycle = (int) data_get($listingData, 'auto_bid_bids_placed', 0);
                $usedUserIds = collect(data_get($listingData, 'auto_bid_used_user_ids', []))
                    ->map(fn ($userId) => (int) $userId)
                    ->filter()
                    ->values()
                    ->all();

                $selectedUser = $this->selectDummyUser(
                    $dummyUsers,
                    $usedUserIds,
                    (int) ($latestListing->user_id ?? 0)
                );

                if (!$selectedUser) {
                    DB::rollBack();
                    $this->warn("Listing #{$listing->id}: no dummy user available for auto-bid.");
                    continue;
                }

                $bidBoost = $this->randomBidBoost();

                $currentHighestBid = (float) (Bid::query()
                    ->where('listing_id', $listing->id)
                    ->max('bid_amount') ?? 0);

                $minimumBid = (float) ($latestListing->minimum_bid ?? 0);
                $bidIncrement = (float) (data_get($listingData, 'bid_increment') ?? 10);
                if ($bidIncrement <= 0) {
                    $bidIncrement = 10;
                }

                $newBidAmount = max($currentHighestBid + $bidBoost, $minimumBid + $bidBoost);

                $latestHighestBid = (float) (Bid::query()
                    ->where('listing_id', $listing->id)
                    ->lockForUpdate()
                    ->max('bid_amount') ?? 0);

                if ($newBidAmount <= $latestHighestBid) {
                    $newBidAmount = $latestHighestBid + $bidBoost;
                }

                $listingData['auto_bid_cycle_started_at'] = $listingData['auto_bid_cycle_started_at'] ?? $now->toDateTimeString();
                $listingData['auto_bid_bids_placed'] = $bidsPlacedInCycle + 1;
                $listingData['auto_bid_used_user_ids'] = array_values(array_unique(array_merge($usedUserIds, [$selectedUser->id])));

                Bid::query()->create([
                    'user_id' => $selectedUser->id,
                    'auction_id' => null,
                    'listing_id' => $listing->id,
                    'bid_amount' => $newBidAmount,
                    'bid_source' => 'auto_bid',
                ]);

                if ((int) $listingData['auto_bid_bids_placed'] >= 3) {
                    $cycleStartedAt = $this->parseDateTime(data_get($listingData, 'auto_bid_cycle_started_at')) ?? $now;
                    $listingData['auto_bid_cycle_cooldown_until'] = $cycleStartedAt->copy()->addMinutes(self::AUTO_BID_CYCLE_MINUTES)->toDateTimeString();
                    $listingData['auto_bid_next_due_at'] = null;
                } else {
                    $listingData['auto_bid_next_due_at'] = $now->copy()->addMinutes($this->nextDelayMinutes($bidsPlacedInCycle + 1))->toDateTimeString();
                }

                $latestListing->update([
                    'listing_data' => $listingData,
                ]);

                DB::commit();

                $bidsPlaced++;
                $this->info("Bid placed: listing #{$listing->id}, user #{$selectedUser->id}, boost {$bidBoost}, amount {$newBidAmount}, cycle bid #" . ($bidsPlacedInCycle + 1));
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

    private function shouldStartNewCycle(array $listingData, Carbon $now): bool
    {
        $cycleStartedAt = $this->parseDateTime(data_get($listingData, 'auto_bid_cycle_started_at'));
        $cycleCooldownUntil = $this->parseDateTime(data_get($listingData, 'auto_bid_cycle_cooldown_until'));
        $bidsPlaced = (int) data_get($listingData, 'auto_bid_bids_placed', 0);
        $nextDueAt = $this->parseDateTime(data_get($listingData, 'auto_bid_next_due_at'));

        if (!$cycleStartedAt) {
            return true;
        }

        if ($bidsPlaced >= 3) {
            return !$cycleCooldownUntil || $now->greaterThanOrEqualTo($cycleCooldownUntil);
        }

        if (!$nextDueAt) {
            return true;
        }

        return false;
    }

    private function isCycleCoolingDown(array $listingData, Carbon $now): bool
    {
        $cycleCooldownUntil = $this->parseDateTime(data_get($listingData, 'auto_bid_cycle_cooldown_until'));
        $bidsPlaced = (int) data_get($listingData, 'auto_bid_bids_placed', 0);

        return $bidsPlaced >= 3 && $cycleCooldownUntil && $now->lt($cycleCooldownUntil);
    }

    private function startNewCycle(array $listingData, Carbon $now): array
    {
        return array_merge($listingData, [
            'auto_bid_cycle_started_at' => $now->toDateTimeString(),
            'auto_bid_bids_placed' => 0,
            'auto_bid_used_user_ids' => [],
            'auto_bid_next_due_at' => $now->copy()->addMinutes($this->nextDelayMinutes(0))->toDateTimeString(),
            'auto_bid_cycle_cooldown_until' => null,
        ]);
    }

    private function selectDummyUser($dummyUsers, array $usedUserIds, int $listingOwnerId): ?User
    {
        $availableUsers = $dummyUsers
            ->filter(fn ($user) => !in_array((int) $user->id, $usedUserIds, true))
            ->filter(fn ($user) => (int) $user->id !== $listingOwnerId)
            ->values();

        if ($availableUsers->isEmpty()) {
            $availableUsers = $dummyUsers
                ->filter(fn ($user) => (int) $user->id !== $listingOwnerId)
                ->values();
        }

        return $availableUsers->isNotEmpty()
            ? $availableUsers->random()
            : null;
    }

    private function nextDelayMinutes(int $cycleBidNumber): int
    {
        [$min, $max] = $cycleBidNumber <= 1
            ? self::FIRST_BID_DELAY_RANGE
            : self::FOLLOW_UP_DELAY_RANGE;

        return random_int($min, $max);
    }

    private function randomBidBoost(): int
    {
        return random_int(self::BID_BOOST_RANGE[0], self::BID_BOOST_RANGE[1]);
    }

    private function parseDateTime($value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
