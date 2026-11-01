<?php

namespace Tests\Feature;

use App\Models\AuctionCategory;
use App\Models\BuyerRequestAlertLog;
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

class BuyerRequestAlertLogTest extends TestCase
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
            'email' => 'seller-log@example.com',
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

    public function test_matched_alert_creates_email_and_whatsapp_log_rows(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $msgpk->shouldReceive('sendWhatsApp')->once()->andReturn(true);
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
            'title' => 'Need tracked laptops',
            'category_id' => $category->id,
            'country' => 'Pakistan',
            'state' => 'Sindh',
            'city' => 'Karachi',
        ]);

        $logs = BuyerRequestAlertLog::query()
            ->where('buyer_request_id', $request->id)
            ->where('user_id', $seller->id)
            ->where('alert_key', BuyerRequestAlertSender::KEY_MATCHED_REQUEST)
            ->get();

        $this->assertCount(2, $logs);
        $this->assertTrue($logs->contains(fn ($l) => $l->channel === 'email' && $l->status === 'sent'));
        $this->assertTrue($logs->contains(fn ($l) => $l->channel === 'whatsapp' && $l->status === 'sent'));

        $wa = $logs->firstWhere('channel', 'whatsapp');
        $this->assertStringContainsString(BuyerRequestAlertSender::requestUrl($request), (string) $wa->body);
    }

    public function test_failed_whatsapp_is_logged_and_can_be_resent(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $msgpk->shouldReceive('sendWhatsApp')->once()->andReturn(false);
        $msgpk->shouldReceive('sendWhatsApp')->once()->andReturn(true);
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create([
            'email_verified_at' => now(),
            'role' => 'Admin',
        ]);
        $seller = $this->createCorporateSeller([
            'email' => 'fail-seller@example.com',
            'phone' => '923009999999',
        ]);
        $category = $this->createCategory();

        $preference = SellerBuyerRequestPreference::create(['user_id' => $seller->id]);
        $preference->categories()->sync([$category->id]);
        $preference->locations()->create([
            'country' => 'Pakistan',
            'city' => 'Karachi',
        ]);

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need desks for tracking',
            'category_id' => $category->id,
            'country' => 'Pakistan',
            'city' => 'Karachi',
        ]);

        $failed = BuyerRequestAlertLog::query()
            ->where('buyer_request_id', $request->id)
            ->where('channel', 'whatsapp')
            ->where('status', 'failed')
            ->first();

        $this->assertNotNull($failed);

        $admin = User::factory()->create([
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        $emailCountBefore = BuyerRequestAlertLog::query()
            ->where('buyer_request_id', $request->id)
            ->where('channel', 'email')
            ->count();

        $this->actingAs($admin)
            ->post(route('admin.buyer-request-alerts.resend', $failed))
            ->assertRedirect();

        $this->assertGreaterThanOrEqual(
            2,
            BuyerRequestAlertLog::query()
                ->where('buyer_request_id', $request->id)
                ->where('channel', 'whatsapp')
                ->count()
        );

        $this->assertTrue(
            BuyerRequestAlertLog::query()
                ->where('buyer_request_id', $request->id)
                ->where('channel', 'whatsapp')
                ->where('status', 'sent')
                ->exists()
        );

        // WhatsApp resend must not trigger a new email attempt
        $this->assertSame(
            $emailCountBefore,
            BuyerRequestAlertLog::query()
                ->where('buyer_request_id', $request->id)
                ->where('channel', 'email')
                ->count()
        );
    }

    public function test_log_mailer_is_recorded_as_failed_not_sent(): void
    {
        config(['mail.default' => 'log']);

        $msgpk = Mockery::mock(MsgpkService::class);
        $msgpk->shouldReceive('sendWhatsApp')->once()->andReturn(true);
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create([
            'email_verified_at' => now(),
            'email' => 'buyer-log-mailer@example.com',
            'phone' => '923007777777',
        ]);
        $seller = $this->createCorporateSeller([
            'email' => 'seller-log-mailer@example.com',
            'phone' => '923008888888',
        ]);
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need log mailer check',
            'category_id' => $category->id,
            'city' => 'Karachi',
        ]);

        $service->submitOffer($seller, $request, ['price' => 900]);

        $emailLog = BuyerRequestAlertLog::query()
            ->where('buyer_request_id', $request->id)
            ->where('user_id', $buyer->id)
            ->where('channel', 'email')
            ->latest('id')
            ->first();

        $this->assertNotNull($emailLog);
        $this->assertSame('failed', $emailLog->status);
        $this->assertStringContainsString('MAIL_MAILER=log', (string) $emailLog->failure_reason);
    }

    public function test_skipped_when_no_phone(): void
    {
        Mail::fake();

        $msgpk = Mockery::mock(MsgpkService::class);
        $msgpk->shouldNotReceive('sendWhatsApp');
        $this->app->instance(MsgpkService::class, $msgpk);

        $buyer = User::factory()->create([
            'email_verified_at' => now(),
            'email' => 'buyer-skip@example.com',
            'phone' => null,
        ]);
        $seller = $this->createCorporateSeller([
            'email' => 'offer-skip-seller@example.com',
            'phone' => '923001010101',
        ]);
        $category = $this->createCategory();

        $service = app(BuyerRequestService::class);
        $request = $service->createRequest($buyer, [
            'title' => 'Need chairs skip phone',
            'category_id' => $category->id,
            'city' => 'Karachi',
        ]);

        $service->submitOffer($seller, $request, ['price' => 1200]);

        $skipped = BuyerRequestAlertLog::query()
            ->where('buyer_request_id', $request->id)
            ->where('user_id', $buyer->id)
            ->where('channel', 'whatsapp')
            ->where('status', 'skipped')
            ->first();

        $this->assertNotNull($skipped);
        $this->assertSame('no_phone', $skipped->failure_reason);
    }
}
