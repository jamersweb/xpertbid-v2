<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Order;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReferralService
{
    public const REWARD_PERCENT = 1.0;

    public function ensureReferralCode(User $user): string
    {
        if (!empty($user->referral_code)) {
            return $user->referral_code;
        }

        $code = $this->generateUniqueCode($user->name);
        $user->forceFill(['referral_code' => $code])->save();

        return $code;
    }

    public function generateUniqueCode(?string $name = null): string
    {
        $base = Str::upper(Str::slug($name ?: 'USER', ''));
        $base = Str::limit($base !== '' ? $base : 'USER', 8, '');

        do {
            $code = $base . random_int(1000, 9999);
        } while (User::query()->where('referral_code', $code)->exists());

        return $code;
    }

    public function applyReferralCode(User $user, string $code): User
    {
        $normalized = Str::upper(trim($code));

        if ($normalized === '') {
            throw ValidationException::withMessages([
                'referral_code' => 'Referral code is required.',
            ]);
        }

        if ($user->referred_by) {
            throw ValidationException::withMessages([
                'referral_code' => 'A referral code is already linked to this account.',
            ]);
        }

        $referrer = User::query()
            ->whereRaw('UPPER(referral_code) = ?', [$normalized])
            ->first();

        if (!$referrer) {
            throw ValidationException::withMessages([
                'referral_code' => 'Referral code was not found.',
            ]);
        }

        if ((int) $referrer->id === (int) $user->id) {
            throw ValidationException::withMessages([
                'referral_code' => 'You cannot use your own referral code.',
            ]);
        }

        $user->forceFill(['referred_by' => $referrer->id])->save();
        $user->load('referrer');

        return $user;
    }

    public function createPendingReward(User $referredUser, string $triggerType, float $amountBase, ?Model $source = null): ?ReferralReward
    {
        if (!$referredUser->referred_by || $amountBase <= 0) {
            return null;
        }

        $sourceType = $source ? "{$triggerType}:" . class_basename($source) : $triggerType;
        $sourceId = $source?->getKey();

        return ReferralReward::query()->firstOrCreate(
            [
                'referred_user_id' => $referredUser->id,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ],
            [
                'referrer_id' => $referredUser->referred_by,
                'order_id' => $source instanceof Order ? $source->id : null,
                'listing_id' => $source instanceof Listing ? $source->id : null,
                'trigger_type' => $triggerType,
                'amount_base' => $amountBase,
                'reward_percent' => self::REWARD_PERCENT,
                'reward_amount' => round($amountBase * (self::REWARD_PERCENT / 100), 2),
                'status' => ReferralReward::STATUS_PENDING,
            ]
        );
    }

    public function approve(ReferralReward $reward, User $admin, ?string $note = null): ReferralReward
    {
        if ($reward->status !== ReferralReward::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'reward' => 'Only pending rewards can be approved.',
            ]);
        }

        return DB::transaction(function () use ($reward, $admin, $note) {
            $reward->update([
                'status' => ReferralReward::STATUS_APPROVED,
                'approved_by' => $admin->id,
                'approved_at' => now(),
                'admin_note' => $note,
            ]);

            $wallet = $reward->referrer->wallet()->firstOrCreate(['user_id' => $reward->referrer_id]);
            $wallet->increment('balance', $reward->reward_amount);

            return $reward->fresh(['referrer', 'referredUser', 'approver']);
        });
    }

    public function reject(ReferralReward $reward, User $admin, ?string $note = null): ReferralReward
    {
        if ($reward->status !== ReferralReward::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'reward' => 'Only pending rewards can be rejected.',
            ]);
        }

        $reward->update([
            'status' => ReferralReward::STATUS_REJECTED,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'admin_note' => $note,
        ]);

        return $reward->fresh(['referrer', 'referredUser', 'approver']);
    }
}
