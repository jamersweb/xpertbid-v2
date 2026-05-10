<?php

namespace Tests\Unit;

use App\Models\Listing;
use App\Models\ListingDraft;
use App\Support\ListingMedia;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ListingMediaTest extends TestCase
{
    public function test_listing_accessors_skip_broken_image_paths_and_fall_back_to_valid_album_images(): void
    {
        $listing = new Listing([
            'image' => '/assets/images/auction/1774881788_69ca8bfc71bca.',
            'album' => [
                '/assets/images/auction/1774881788_69ca8bfc71bca.',
                '/assets/images/auction/valid-photo.jpg',
                '/assets/images/auction/demo-video.mp4',
            ],
            'listing_data' => [],
        ]);

        $this->assertSame('/assets/images/auction/valid-photo.jpg', $listing->image);
        $this->assertSame(
            [asset('assets/images/auction/valid-photo.jpg')],
            $listing->album_urls
        );
        $this->assertStringEndsWith('/assets/images/auction/valid-photo.jpg', (string) $listing->image_url);
    }

    public function test_listing_draft_urls_only_include_displayable_images(): void
    {
        $draft = new ListingDraft([
            'album' => [
                '/assets/images/listing_images/valid-photo.png',
                '/assets/images/listing_images/demo-video.mp4',
                '/assets/images/listing_images/broken.',
            ],
            'listing_data' => [],
        ]);

        $this->assertSame(
            [asset('assets/images/listing_images/valid-photo.png')],
            $draft->album_urls
        );
        $this->assertStringEndsWith('/assets/images/listing_images/valid-photo.png', (string) $draft->image_url);
    }

    public function test_repair_image_path_recovers_a_real_file_from_a_broken_stem(): void
    {
        $directory = public_path('assets/images/auction');
        File::ensureDirectoryExists($directory);

        $stem = 'repair-media-fixture-' . uniqid();
        $fixturePath = $directory . DIRECTORY_SEPARATOR . $stem . '.jpg';
        File::put($fixturePath, 'fixture');

        try {
            $this->assertSame(
                '/assets/images/auction/' . $stem . '.jpg',
                ListingMedia::repairImagePath(
                    '/assets/images/auction/' . $stem . '.',
                    ['assets/images/auction']
                )
            );
        } finally {
            File::delete($fixturePath);
        }
    }
}
