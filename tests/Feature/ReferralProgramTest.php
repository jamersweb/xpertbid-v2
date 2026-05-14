<?php

namespace Tests\Feature;

use App\Models\ReferralReward;
use App\Models\User;
use App\Services\ReferralService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReferralProgramTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_referral_details(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson(route('referrals.me'))
            ->assertOk()
            ->assertJsonStructure([
                'referral_code',
                'referred_by',
                'summary',
                'rewards',
            ]);

        $this->assertNotEmpty($user->refresh()->referral_code);
    }

    public function test_user_can_apply_valid_referral_code_once(): void
    {
        $referrer = User::factory()->create(['referral_code' => 'XPB1234']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('referrals.apply'), ['referral_code' => 'xpb1234'])
            ->assertOk()
            ->assertJsonPath('referred_by.id', $referrer->id);

        $this->assertSame($referrer->id, $user->refresh()->referred_by);

        $this->actingAs($user)
            ->postJson(route('referrals.apply'), ['referral_code' => 'XPB1234'])
            ->assertUnprocessable();
    }

    public function test_user_cannot_apply_own_referral_code(): void
    {
        $user = User::factory()->create(['referral_code' => 'SELF1234']);

        $this->actingAs($user)
            ->postJson(route('referrals.apply'), ['referral_code' => 'SELF1234'])
            ->assertUnprocessable();
    }

    public function test_referral_reward_can_be_created_and_approved_to_wallet(): void
    {
        $referrer = User::factory()->create();
        $referred = User::factory()->create(['referred_by' => $referrer->id]);
        $admin = User::factory()->create(['role' => 'Admin']);

        $service = app(ReferralService::class);
        $reward = $service->createPendingReward($referred, 'purchase', 10000);

        $this->assertInstanceOf(ReferralReward::class, $reward);
        $this->assertSame('100.00', $reward->reward_amount);
        $this->assertSame(ReferralReward::STATUS_PENDING, $reward->status);

        $service->approve($reward, $admin);

        $this->assertSame(100.0, (float) $referrer->wallet()->first()->balance);
        $this->assertSame(ReferralReward::STATUS_APPROVED, $reward->refresh()->status);
    }
}
