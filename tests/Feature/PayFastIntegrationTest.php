<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Services\PayFastService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class PayFastIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.payfast.merchant_id' => '250919',
            'services.payfast.secured_key' => 'test-secured-key',
            'services.payfast.merchant_name' => 'XpertBid',
            'services.payfast.currency' => 'PKR',
            'services.payfast.token_url' => 'https://payfast.test/token',
            'services.payfast.post_url' => 'https://payfast.test/post',
        ]);
    }

    public function test_payfast_token_failure_is_reported(): void
    {
        Http::fake([
            'https://payfast.test/token' => Http::response(['error' => 'invalid'], 500),
        ]);

        $this->expectException(RuntimeException::class);

        app(PayFastService::class)->accessToken($this->payfastOrder());
    }

    public function test_payfast_redirect_builds_auto_submit_form(): void
    {
        Http::fake([
            'https://payfast.test/token' => Http::response(['ACCESS_TOKEN' => 'token-123'], 200),
        ]);

        $user = User::factory()->create();
        $order = $this->payfastOrder(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('payfast.redirect', $order->order_number));

        $response->assertOk();
        $response->assertSee('https://payfast.test/post', false);
        $response->assertSee('name="BASKET_ID" value="' . $order->order_number . '"', false);
        $response->assertSee('name="TOKEN" value="token-123"', false);
    }

    public function test_valid_payfast_notify_marks_order_paid(): void
    {
        $order = $this->payfastOrder();
        $signature = app(PayFastService::class)->orderSignature($order);

        $response = $this->post(route('payfast.notify'), [
            'BASKET_ID' => $order->order_number,
            'TXNAMT' => '1200.00',
            'TRANSACTION_STATUS' => 'SUCCESS',
            'TXN_ID' => 'PF-123',
            'SIGNATURE' => $signature,
        ]);

        $response->assertOk();

        $order->refresh();

        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('processing', $order->status);
        $this->assertSame('PF-123', $order->transaction_id);
    }

    public function test_payfast_notify_rejects_amount_mismatch(): void
    {
        $order = $this->payfastOrder();

        $response = $this->post(route('payfast.notify'), [
            'BASKET_ID' => $order->order_number,
            'TXNAMT' => '1.00',
            'TRANSACTION_STATUS' => 'SUCCESS',
            'SIGNATURE' => app(PayFastService::class)->orderSignature($order),
        ]);

        $response->assertStatus(400);

        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_duplicate_payfast_notify_is_idempotent(): void
    {
        $order = $this->payfastOrder([
            'payment_status' => 'paid',
            'status' => 'processing',
            'transaction_id' => 'PF-original',
        ]);

        $response = $this->post(route('payfast.notify'), [
            'BASKET_ID' => $order->order_number,
            'TXNAMT' => '1200.00',
            'TRANSACTION_STATUS' => 'SUCCESS',
            'TXN_ID' => 'PF-new',
            'SIGNATURE' => app(PayFastService::class)->orderSignature($order),
        ]);

        $response->assertOk();

        $this->assertSame('PF-original', $order->fresh()->transaction_id);
    }

    private function payfastOrder(array $overrides = []): Order
    {
        return Order::create(array_merge([
            'user_id' => null,
            'order_number' => 'ORD-PF-' . uniqid(),
            'billing_name' => 'Test User',
            'billing_email' => 'buyer@example.com',
            'billing_phone' => '03001234567',
            'billing_address_line1' => 'Street 1',
            'billing_city' => 'Karachi',
            'billing_state' => 'Sindh',
            'billing_country' => 'Pakistan',
            'shipping_name' => 'Test User',
            'shipping_email' => 'buyer@example.com',
            'shipping_phone' => '03001234567',
            'shipping_address_line1' => 'Street 1',
            'shipping_city' => 'Karachi',
            'shipping_state' => 'Sindh',
            'shipping_country' => 'Pakistan',
            'subtotal' => 1200,
            'tax' => 0,
            'shipping_cost' => 0,
            'total' => 1200,
            'payment_method' => 'payfast',
            'payment_status' => 'pending',
            'status' => 'pending',
        ], $overrides));
    }
}
