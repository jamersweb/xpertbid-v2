<?php

namespace Tests\Feature;

use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestOffer;
use App\Models\CorporateVerification;
use App\Models\User;
use App\Services\BuyerRequestService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class BuyerRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function createCategory(string $name = 'Electronics'): AuctionCategory
    {
        $id = DB::table('auction_categories')->insertGetId([
            'name' => $name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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

    public function test_buyer_can_create_and_close_request(): void
    {
        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need a laptop',
            'description' => '16GB RAM',
            'category_id' => $category->id,
            'location_label' => 'Karachi, Sindh, Pakistan',
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $this->assertSame(BuyerRequest::STATUS_OPEN, $request->status);

        $closed = $service->closeRequest($request);
        $this->assertSame(BuyerRequest::STATUS_CLOSED, $closed->status);
    }

    public function test_multiple_sellers_can_offer_on_same_open_request(): void
    {
        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $sellerA = $this->createCorporateSeller();
        $sellerB = $this->createCorporateSeller();
        $sellerC = $this->createCorporateSeller();
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need laptops',
            'category_id' => $category->id,
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $offerA = $service->submitOffer($sellerA, $request, ['price' => 1000]);
        $offerB = $service->submitOffer($sellerB, $request, ['price' => 900]);
        $offerC = $service->submitOffer($sellerC, $request, ['price' => 950]);

        $this->assertSame(BuyerRequestOffer::STATUS_PENDING, $offerA->status);
        $this->assertSame(BuyerRequestOffer::STATUS_PENDING, $offerB->status);
        $this->assertSame(BuyerRequestOffer::STATUS_PENDING, $offerC->status);
        $this->assertSame(3, $request->offers()->where('status', BuyerRequestOffer::STATUS_PENDING)->count());
        $this->assertSame(BuyerRequest::STATUS_OPEN, $request->fresh()->status);
    }

    public function test_accept_one_offer_rejects_others(): void
    {
        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $sellerA = $this->createCorporateSeller();
        $sellerB = $this->createCorporateSeller();
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Office chair',
            'category_id' => $category->id,
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $offerA = $service->submitOffer($sellerA, $request, ['price' => 1000]);
        $offerB = $service->submitOffer($sellerB, $request, ['price' => 900]);

        $service->acceptOffer($buyer, $offerA);

        $this->assertSame(BuyerRequestOffer::STATUS_ACCEPTED, $offerA->fresh()->status);
        $this->assertSame(BuyerRequestOffer::STATUS_REJECTED, $offerB->fresh()->status);
        $this->assertSame(BuyerRequest::STATUS_FULFILLED, $request->fresh()->status);
    }

    public function test_non_corporate_seller_cannot_offer(): void
    {
        $this->expectException(ValidationException::class);

        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $seller = User::factory()->create(['email_verified_at' => now()]);
        $category = $this->createCategory('Furniture');

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Desk',
            'category_id' => $category->id,
            'city' => 'Karachi',
        ]);

        $service->submitOffer($seller, $request, ['price' => 500]);
    }
}
