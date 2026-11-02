<?php

namespace Tests\Feature;

use App\Mail\BuyerRequestAlertMail;
use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\CorporateVerification;
use App\Models\SellerBuyerRequestPreference;
use App\Models\User;
use App\Services\BuyerRequestService;
use App\Services\MsgpkService;
use App\Support\BuyerRequestAlertSender;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Mockery;
use Tests\TestCase;

class BuyerRequestAlertTest extends TestCase
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

    protected function createCorporateSeller(array $attrs = []): User
    {
        $seller = User::factory()->create(array_merge([
            'email_verified_at' => now(),
            'email' => 'seller-alert@example.com',
            'phone' => '923001234567',
        ], $attrs));

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

    public function test_matched_seller_gets_email_and_whatsapp_with_request_url(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $whatsAppBodies = [];
        $msgpk->shouldReceive('sendWhatsApp')
            ->once()
            ->andReturnUsing(function ($phone, $message) use (&$whatsAppBodies) {
                $whatsAppBodies[] = $message;

                return true;
            });
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create(['email_verified_at' => now()]);
        $seller = $this->createCorporateSeller();
        $category = $this->createCategory();

        $preference = SellerBuyerRequestPreference::create(['user_id' => $seller->id]);
        $preference->categories()->sync([$category->id]);
        $preference->locations()->create([
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need office laptops',
            'category_id' => $category->id,
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $requestUrl = BuyerRequestAlertSender::requestUrl($request);

        Mail::assertSent(BuyerRequestAlertMail::class, function (BuyerRequestAlertMail $mail) use ($requestUrl) {
            return $mail->ctaUrl === $requestUrl
                && str_contains($mail->subjectLine, 'matches your preferences');
        });

        $this->assertNotEmpty($whatsAppBodies);
        $this->assertStringContainsString($requestUrl, $whatsAppBodies[0]);
        $this->assertStringContainsString('Need office laptops', $whatsAppBodies[0]);
    }

    public function test_new_offer_alerts_buyer_on_email_and_whatsapp(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $whatsAppBodies = [];
        $msgpk->shouldReceive('sendWhatsApp')
            ->once()
            ->andReturnUsing(function ($phone, $message) use (&$whatsAppBodies) {
                $whatsAppBodies[] = $message;

                return true;
            });
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create([
            'email_verified_at' => now(),
            'email' => 'buyer-alert@example.com',
            'phone' => '923009876543',
        ]);
        $seller = $this->createCorporateSeller([
            'email' => 'offer-seller@example.com',
            'phone' => '923001111111',
        ]);
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need chairs',
            'category_id' => $category->id,
            'city' => 'Karachi',
        ]);

        $service->submitOffer($seller, $request, ['price' => 1500]);

        $requestUrl = BuyerRequestAlertSender::requestUrl($request);

        Mail::assertSent(BuyerRequestAlertMail::class, function (BuyerRequestAlertMail $mail) use ($requestUrl) {
            return $mail->ctaUrl === $requestUrl
                && str_contains($mail->subjectLine, 'New offer');
        });

        $this->assertNotEmpty($whatsAppBodies);
        $this->assertStringContainsString($requestUrl, $whatsAppBodies[0]);
        $this->assertStringContainsString('1,500 PKR', $whatsAppBodies[0]);
    }

    public function test_accept_offer_alerts_winner_and_rejected_sellers(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $msgpk->shouldReceive('sendWhatsApp')->andReturn(true);
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create([
            'email_verified_at' => now(),
            'email' => 'buyer2@example.com',
            'phone' => '923002222222',
        ]);
        $sellerA = $this->createCorporateSeller([
            'email' => 'winner@example.com',
            'phone' => '923003333333',
        ]);
        $sellerB = $this->createCorporateSeller([
            'email' => 'loser@example.com',
            'phone' => '923004444444',
        ]);
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need desks',
            'category_id' => $category->id,
            'city' => 'Karachi',
        ]);

        $offerA = $service->submitOffer($sellerA, $request, ['price' => 2000]);
        $service->submitOffer($sellerB, $request, ['price' => 1800]);

        Mail::fake();
        $service->acceptOffer($buyer, $offerA);

        $requestUrl = BuyerRequestAlertSender::requestUrl($request);
        $browseUrl = BuyerRequestAlertSender::browseUrl($request);

        Mail::assertSent(BuyerRequestAlertMail::class, function (BuyerRequestAlertMail $mail) use ($requestUrl) {
            return $mail->subjectLine === 'Your offer was accepted'
                && $mail->ctaUrl === $requestUrl;
        });

        Mail::assertSent(BuyerRequestAlertMail::class, function (BuyerRequestAlertMail $mail) use ($requestUrl, $browseUrl) {
            return $mail->subjectLine === 'Update on your buyer-request offer'
                && $mail->ctaUrl === $browseUrl
                && $mail->secondaryUrl === $requestUrl;
        });
    }

    public function test_alert_urls_use_property_and_renovation_frontends(): void
    {
        config([
            'property.frontend_url' => 'https://property.test',
            'renovation.frontend_url' => 'https://build.test',
        ]);

        $propertyCategory = $this->createCategory('Properties');
        config(['property.root_category_id' => $propertyCategory->id]);

        $renovationCategory = $this->createCategory('Home Renovation');
        $builderCategory = $this->createCategory('Home Builder');
        config([
            'renovation.root_category_id' => $renovationCategory->id,
            'renovation.builder_root_category_id' => $builderCategory->id,
        ]);

        $generalCategory = $this->createCategory('Electronics');

        $propertyRequest = BuyerRequest::create([
            'user_id' => User::factory()->create()->id,
            'title' => 'Need a flat',
            'slug' => 'need-a-flat',
            'category_id' => $propertyCategory->id,
            'status' => BuyerRequest::STATUS_OPEN,
        ]);

        $renoRequest = BuyerRequest::create([
            'user_id' => User::factory()->create()->id,
            'title' => 'Need kitchen reno',
            'slug' => 'need-kitchen-reno',
            'category_id' => $renovationCategory->id,
            'status' => BuyerRequest::STATUS_OPEN,
        ]);

        $builderRequest = BuyerRequest::create([
            'user_id' => User::factory()->create()->id,
            'title' => 'Need home build',
            'slug' => 'need-home-build',
            'category_id' => $builderCategory->id,
            'status' => BuyerRequest::STATUS_OPEN,
        ]);

        $generalRequest = BuyerRequest::create([
            'user_id' => User::factory()->create()->id,
            'title' => 'Need laptops',
            'slug' => 'need-laptops',
            'category_id' => $generalCategory->id,
            'status' => BuyerRequest::STATUS_OPEN,
        ]);

        $this->assertSame(
            'https://property.test/buyer-requests/need-a-flat',
            BuyerRequestAlertSender::requestUrl($propertyRequest)
        );
        $this->assertSame(
            'https://property.test/seller/buyer-requests',
            BuyerRequestAlertSender::browseUrl($propertyRequest)
        );

        $this->assertSame(
            'https://build.test/buyer-requests/need-kitchen-reno',
            BuyerRequestAlertSender::requestUrl($renoRequest)
        );
        $this->assertSame(
            'https://build.test/buyer-requests/need-home-build',
            BuyerRequestAlertSender::requestUrl($builderRequest)
        );
        $this->assertSame(
            'https://build.test/seller/buyer-requests',
            BuyerRequestAlertSender::browseUrl($builderRequest)
        );

        $this->assertSame(
            route('buyer-requests.show', $generalRequest, absolute: true),
            BuyerRequestAlertSender::requestUrl($generalRequest)
        );
        $this->assertSame(
            route('seller.buyer-requests.browse', absolute: true),
            BuyerRequestAlertSender::browseUrl($generalRequest)
        );
    }
}
