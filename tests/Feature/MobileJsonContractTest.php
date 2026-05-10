<?php

namespace Tests\Feature;

use App\Models\AuctionCategory;
use App\Models\Listing;
use App\Models\ListingDraft;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MobileJsonContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_mobile_read_routes_return_json(): void
    {
        $user = User::factory()->create();

        $routes = [
            '/dashboard',
            '/account-settings',
            '/my-listings',
            '/my-bids',
            '/favorites',
            '/cart',
            '/my-orders',
            '/payment-methods',
            '/user/address',
            '/user/notifications',
            '/api/notifications',
            '/api/notifications/count',
        ];

        foreach ($routes as $route) {
            $response = $this->actingAs($user)
                ->getJson($route)
                ->assertOk();

            $contentType = (string) $response->headers->get('content-type');
            $this->assertTrue(
                str_contains($contentType, 'application/json'),
                "Route {$route} should return JSON, got {$contentType}."
            );
        }
    }

    public function test_guest_mobile_read_routes_do_not_return_inertia_conflict(): void
    {
        auth()->logout();

        foreach (['/my-listings', '/my-bids', '/my-orders'] as $route) {
            $response = $this->getJson($route);

            $this->assertSame(
                401,
                $response->getStatusCode(),
                "Route {$route} should require auth for mobile JSON requests."
            );

            $this->assertStringContainsString(
                'application/json',
                (string) $response->headers->get('content-type')
            );
        }

        $cartResponse = $this->getJson('/cart')->assertOk();
        $this->assertStringContainsString(
            'application/json',
            (string) $cartResponse->headers->get('content-type')
        );
    }

    public function test_one_rupee_feed_handles_awarded_listing_without_winner_id(): void
    {
        $user = User::factory()->create();
        $category = AuctionCategory::withoutEvents(
            fn () => AuctionCategory::create(['name' => 'Test Category'])
        );

        Listing::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'listing_type' => 'auction',
            'title' => 'One Rupee Auction',
            'status' => 'awarded',
            'is_1_rupee' => true,
            'listing_data' => [
                'minimum_bid' => 1,
            ],
        ]);

        $response = $this->getJson('/get-one-rupee-auctions')->assertOk();

        $response->assertJsonPath('product.0.title', 'One Rupee Auction');
    }

    public function test_authenticated_mobile_write_routes_return_json(): void
    {
        $user = User::factory()->create(['phone' => '03000000000']);
        $seller = User::factory()->create();
        $category = AuctionCategory::withoutEvents(
            fn () => AuctionCategory::create(['name' => 'Mobile Contract Category'])
        );
        $listing = Listing::create([
            'user_id' => $seller->id,
            'category_id' => $category->id,
            'listing_type' => 'live_auction',
            'title' => 'Mobile Contract Listing',
            'status' => 'active',
            'listing_data' => [
                'minimum_bid' => 1,
                'start_price' => 1,
            ],
        ]);

        // The legacy cart migration renamed auction_id to listing_id but SQLite
        // keeps the old foreign key target during tests.
        DB::table('auctions')->insert([
            'id' => $listing->id,
            'title' => 'Legacy FK Mirror',
            'user_id' => $seller->id,
            'category_id' => $category->id,
            'reserve_price' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->actingAs($user)
            ->postJson('/user/update', [
                'name' => 'Mobile Contract User',
                'phone' => '03111111111',
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->actingAs($user)
            ->postJson('/user/address', [
                'addressLine1' => 'Street 1',
                'city' => '31594',
                'state' => '2729',
                'country' => '166',
                'postalCode' => '54000',
                'contactNumber' => '03111111111',
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->actingAs($user)
            ->postJson('/user/notifications', [
                'inspiration' => true,
                'newsletter' => false,
                'biddingConditions' => [
                    'outbid' => true,
                ],
            ])
            ->assertOk()
            ->assertJsonPath('outbid', true);

        $this->actingAs($user)
            ->postJson('/payment-methods', [
                'paymentMethod' => 'Paypal',
                'paypal_id' => 'mobile-contract@example.com',
            ])
            ->assertCreated()
            ->assertJsonPath('success', true);

        $favoriteResponse = $this->actingAs($user)
            ->postJson('/favorites/toggle', [
                'listing_id' => $listing->id,
            ])
            ->assertOk()
            ->assertJsonPath('favorited', true);

        $this->actingAs($user)
            ->postJson('/cart/add', [
                'listing_id' => $listing->id,
                'type' => 'product',
            ])
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->actingAs($user)
            ->postJson('/bids', [
                'listing_id' => $listing->id,
                'bid_amount' => 5,
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertTrue((bool) $favoriteResponse->json('success'));
    }

    public function test_mobile_listing_draft_push_and_pull_routes_return_json(): void
    {
        $user = User::factory()->create();
        $category = AuctionCategory::withoutEvents(
            fn () => AuctionCategory::create(['name' => 'Mobile Draft Category'])
        );

        $draftResponse = $this->actingAs($user)
            ->postJson('/auctions', [
                'status' => 'draft',
                'category_id' => $category->id,
                'listing_type' => 'auction',
                'title' => 'Mobile Draft Listing',
                'description' => 'Created from mobile contract test.',
                'listing_data' => [
                    'start_price' => 100,
                    'reserve_price' => 200,
                    'start_date' => now()->addDay()->toDateTimeString(),
                    'end_date' => now()->addDays(2)->toDateTimeString(),
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('success', true);

        $draftId = $draftResponse->json('draft.id');
        $this->assertNotEmpty($draftId);

        $this->actingAs($user)
            ->getJson("/auction-drafts/{$draftId}/edit")
            ->assertOk()
            ->assertJsonPath('draft.id', $draftId);

        $this->actingAs($user)
            ->putJson("/auction-drafts/{$draftId}", [
                'status' => 'draft',
                'category_id' => $category->id,
                'listing_type' => 'auction',
                'title' => 'Updated Mobile Draft Listing',
                'listing_data' => [
                    'start_price' => 150,
                ],
            ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->actingAs($user)
            ->getJson('/my-listings')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Updated Mobile Draft Listing']);
    }

    public function test_mobile_publish_without_verification_returns_json_error_not_redirect(): void
    {
        $user = User::factory()->create();
        $category = AuctionCategory::withoutEvents(
            fn () => AuctionCategory::create(['name' => 'Mobile Publish Category'])
        );

        $this->actingAs($user)
            ->postJson('/auctions', [
                'category_id' => $category->id,
                'listing_type' => 'auction',
                'title' => 'Blocked Publish Listing',
                'listing_data' => [
                    'start_price' => 100,
                    'start_date' => now()->addDay()->toDateTimeString(),
                    'end_date' => now()->addDays(2)->toDateTimeString(),
                ],
            ])
            ->assertForbidden()
            ->assertJsonPath('success', false);

        $this->assertSame(0, ListingDraft::where('user_id', $user->id)->count());
    }
}
