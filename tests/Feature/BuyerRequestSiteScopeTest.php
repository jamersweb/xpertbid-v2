<?php

namespace Tests\Feature;

use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\CorporateVerification;
use App\Models\User;
use App\Services\BuyerRequestService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BuyerRequestSiteScopeTest extends TestCase
{
    use RefreshDatabase;

    protected function createRootCategory(string $name, string $slug): AuctionCategory
    {
        $payload = [
            'name' => $name,
            'parent_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (Schema::hasColumn('auction_categories', 'slug')) {
            $payload['slug'] = $slug;
        }

        $id = DB::table('auction_categories')->insertGetId($payload);

        return AuctionCategory::query()->findOrFail($id);
    }

    protected function createCorporateSeller(): User
    {
        $seller = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        CorporateVerification::create([
            'user_id' => $seller->id,
            'legal_entity_name' => 'Test Corp',
            'registered_address' => 'Karachi',
            'date_of_incorporation' => now()->subYears(2)->toDateString(),
            'entity_type' => 'llc',
            'business_documents' => ['doc.pdf'],
            'country' => 'Pakistan',
            'status' => 'verified',
        ]);

        return $seller->fresh(['corporateVerification']);
    }

    public function test_matched_with_renovation_site_excludes_property_requests(): void
    {
        $reno = $this->createRootCategory('Home Renovation', 'home-renovation');
        $property = $this->createRootCategory('Property', 'property');
        config([
            'renovation.root_category_id' => $reno->id,
            'renovation.builder_root_category_id' => $reno->id,
            'property.root_category_id' => $property->id,
        ]);

        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $seller = $this->createCorporateSeller();
        $service = app(BuyerRequestService::class);

        $renoRequest = $service->createRequest($buyer, [
            'title' => 'Need kitchen remodel',
            'category_id' => $reno->id,
            'city' => 'Karachi',
        ]);

        $service->createRequest($buyer, [
            'title' => 'Need apartment',
            'category_id' => $property->id,
            'city' => 'Karachi',
        ]);

        Sanctum::actingAs($seller);

        $response = $this->getJson('/api/v1/buyer-requests/matched?site=renovation');
        $response->assertOk();

        $ids = collect($response->json('data'))->pluck('id')->all();
        $this->assertContains($renoRequest->id, $ids);
        $this->assertCount(1, $ids);
    }

    public function test_store_rejects_category_outside_site(): void
    {
        $reno = $this->createRootCategory('Home Renovation', 'home-renovation');
        $property = $this->createRootCategory('Property', 'property');
        config([
            'renovation.root_category_id' => $reno->id,
            'renovation.builder_root_category_id' => $reno->id,
            'property.root_category_id' => $property->id,
        ]);

        $buyer = User::factory()->create(['email_verified_at' => now()]);
        Sanctum::actingAs($buyer);

        $this->postJson('/api/v1/buyer-requests?site=renovation', [
            'title' => 'Wrong tree',
            'category_id' => $property->id,
            'city' => 'Karachi',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    public function test_show_returns_404_for_cross_site_request(): void
    {
        $reno = $this->createRootCategory('Home Renovation', 'home-renovation');
        $property = $this->createRootCategory('Property', 'property');
        config([
            'renovation.root_category_id' => $reno->id,
            'renovation.builder_root_category_id' => $reno->id,
            'property.root_category_id' => $property->id,
        ]);

        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $seller = $this->createCorporateSeller();
        $service = app(BuyerRequestService::class);

        $propertyRequest = $service->createRequest($buyer, [
            'title' => 'Need plot',
            'category_id' => $property->id,
            'city' => 'Lahore',
        ]);

        Sanctum::actingAs($seller);

        $this->getJson('/api/v1/buyer-requests/'.$propertyRequest->slug.'?site=renovation')
            ->assertNotFound();
    }
}
