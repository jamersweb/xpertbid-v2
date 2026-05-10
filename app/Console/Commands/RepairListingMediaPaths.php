<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Models\Listing;
use App\Models\ListingDraft;
use App\Support\ListingMedia;
use Illuminate\Console\Command;

class RepairListingMediaPaths extends Command
{
    protected $signature = 'listing:repair-media
                            {--apply : Persist repaired paths instead of printing a dry run}
                            {--include-drafts : Scan listing drafts in addition to listings}';

    protected $description = 'Repair malformed listing and source auction media paths and remove unrecoverable broken entries';

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');
        $includeDrafts = (bool) $this->option('include-drafts');

        $stats = [
            'scanned' => 0,
            'changed' => 0,
            'images_fixed' => 0,
            'images_cleared' => 0,
            'albums_fixed' => 0,
            'listing_data_fixed' => 0,
        ];

        $this->processAuctions($apply, $stats);
        $this->processListings($apply, $stats);

        if ($includeDrafts) {
            $this->processDrafts($apply, $stats);
        }

        $mode = $apply ? 'Applied' : 'Dry run';
        $this->newLine();
        $this->info("{$mode} summary:");
        $this->line("Scanned: {$stats['scanned']}");
        $this->line("Changed: {$stats['changed']}");
        $this->line("Images repaired: {$stats['images_fixed']}");
        $this->line("Images cleared: {$stats['images_cleared']}");
        $this->line("Album entries repaired/pruned: {$stats['albums_fixed']}");
        $this->line("listing_data synced: {$stats['listing_data_fixed']}");

        return self::SUCCESS;
    }

    protected function processListings(bool $apply, array &$stats): void
    {
        Listing::withTrashed()
            ->orderBy('id')
            ->chunkById(100, function ($listings) use ($apply, &$stats) {
                foreach ($listings as $listing) {
                    $this->processRecord($listing, 'listing', $apply, $stats);
                }
            });
    }

    protected function processAuctions(bool $apply, array &$stats): void
    {
        Auction::query()
            ->orderBy('id')
            ->chunkById(100, function ($auctions) use ($apply, &$stats) {
                foreach ($auctions as $auction) {
                    $this->processRecord($auction, 'auction', $apply, $stats);
                }
            });
    }

    protected function processDrafts(bool $apply, array &$stats): void
    {
        ListingDraft::query()
            ->orderBy('id')
            ->chunkById(100, function ($drafts) use ($apply, &$stats) {
                foreach ($drafts as $draft) {
                    $this->processRecord($draft, 'draft', $apply, $stats);
                }
            });
    }

    protected function processRecord(object $record, string $label, bool $apply, array &$stats): void
    {
        $stats['scanned']++;

        $result = $this->prepareChanges($record);
        if ($result['changes'] === []) {
            return;
        }

        $stats['changed']++;
        $stats['images_fixed'] += $result['image_changed'] && !$result['image_cleared'] ? 1 : 0;
        $stats['images_cleared'] += $result['image_cleared'] ? 1 : 0;
        $stats['albums_fixed'] += $result['album_changed'] ? 1 : 0;
        $stats['listing_data_fixed'] += $result['listing_data_changed'] ? 1 : 0;

        if ($apply) {
            $record->forceFill($result['changes'])->saveQuietly();
            return;
        }

        $parts = [];

        if ($result['image_changed']) {
            $parts[] = sprintf(
                'image: %s -> %s',
                $result['before_image'] ?? 'null',
                $result['after_image'] ?? 'null'
            );
        }

        if ($result['album_changed']) {
            $parts[] = sprintf(
                'album: %d -> %d entries',
                count($result['before_album']),
                count($result['after_album'])
            );
        }

        if ($result['listing_data_changed']) {
            $parts[] = 'listing_data synced';
        }

        $this->line(sprintf('[dry-run] %s #%d %s', $label, $record->id, implode(' | ', $parts)));
    }

    protected function prepareChanges(object $record): array
    {
        $listingData = is_array($record->listing_data) ? $record->listing_data : [];
        $rawImage = $record->getRawOriginal('image');
        $rawAlbum = ListingMedia::decodeList($record->getRawOriginal('album'));
        $dataImage = $listingData['image'] ?? null;
        $dataAlbum = ListingMedia::decodeList($listingData['album'] ?? []);

        $searchHint = $rawImage
            ?? $dataImage
            ?? ($rawAlbum[0] ?? null)
            ?? ($dataAlbum[0] ?? null);

        $searchDirectories = ListingMedia::defaultSearchDirectories($searchHint);
        $repairedAlbum = ListingMedia::repairMediaList(
            !empty($rawAlbum) ? $rawAlbum : $dataAlbum,
            $searchDirectories
        );
        $repairedImage = ListingMedia::repairImagePath($rawImage, $searchDirectories)
            ?? ListingMedia::repairImagePath($dataImage, $searchDirectories)
            ?? ListingMedia::firstDisplayableImage($repairedAlbum);

        $changes = [];
        $rawImageNormalized = ListingMedia::normalizePath($rawImage);
        $imageChanged = $rawImageNormalized !== $repairedImage;

        if ($imageChanged) {
            $changes['image'] = $repairedImage;
        }

        $albumChanged = $rawAlbum !== $repairedAlbum;
        if ($albumChanged) {
            $changes['album'] = $record instanceof Auction
                ? json_encode($repairedAlbum)
                : $repairedAlbum;
        }

        $updatedListingData = $listingData;
        $listingDataChanged = false;

        if (array_key_exists('image', $updatedListingData)) {
            $currentDataImage = ListingMedia::normalizePath($updatedListingData['image']);

            if ($currentDataImage !== $repairedImage) {
                $updatedListingData['image'] = $repairedImage;
                $listingDataChanged = true;
            }
        }

        if (array_key_exists('album', $updatedListingData)) {
            if (ListingMedia::decodeList($updatedListingData['album']) !== $repairedAlbum) {
                $updatedListingData['album'] = $repairedAlbum;
                $listingDataChanged = true;
            }
        }

        if ($listingDataChanged) {
            $changes['listing_data'] = $updatedListingData;
        }

        return [
            'changes' => $changes,
            'image_changed' => $imageChanged,
            'image_cleared' => $imageChanged && $repairedImage === null,
            'album_changed' => $albumChanged,
            'listing_data_changed' => $listingDataChanged,
            'before_image' => $rawImageNormalized,
            'after_image' => $repairedImage,
            'before_album' => $rawAlbum,
            'after_album' => $repairedAlbum,
        ];
    }
}
