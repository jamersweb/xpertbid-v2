<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
