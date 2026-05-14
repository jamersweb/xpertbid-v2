<?php

namespace App\Http\Controllers;

use App\Models\ReferralReward;
use App\Services\ReferralService;
use Illuminate\Http\Request;

class ReferralProgramController extends Controller
{
    public function show(Request $request, ReferralService $referrals)
    {
        $user = $request->user()->load('referrer');
        $referrals->ensureReferralCode($user);

        $rewards = ReferralReward::query()
            ->where('referrer_id', $user->id)
            ->with(['referredUser:id,name,email,phone', 'order:id,order_number,total,status', 'listing:id,title,slug'])
            ->latest()
            ->get();

        return response()->json([
            'referral_code' => $user->referral_code,
            'referred_by' => $user->referrer ? [
                'id' => $user->referrer->id,
                'name' => $user->referrer->name,
                'email' => $user->referrer->email,
            ] : null,
            'summary' => [
                'pending' => (float) $rewards->where('status', ReferralReward::STATUS_PENDING)->sum('reward_amount'),
                'approved' => (float) $rewards->where('status', ReferralReward::STATUS_APPROVED)->sum('reward_amount'),
                'paid' => (float) $rewards->where('status', ReferralReward::STATUS_PAID)->sum('reward_amount'),
                'total_referrals' => $user->referrals()->count(),
            ],
            'rewards' => $rewards->map(fn (ReferralReward $reward) => [
                'id' => $reward->id,
                'trigger_type' => $reward->trigger_type,
                'status' => $reward->status,
                'amount_base' => (float) $reward->amount_base,
                'reward_percent' => (float) $reward->reward_percent,
                'reward_amount' => (float) $reward->reward_amount,
                'created_at' => $reward->created_at?->toISOString(),
                'approved_at' => $reward->approved_at?->toISOString(),
                'referred_user' => $reward->referredUser,
                'order' => $reward->order,
                'listing' => $reward->listing,
            ])->values(),
        ]);
    }

    public function apply(Request $request, ReferralService $referrals)
    {
        $validated = $request->validate([
            'referral_code' => ['required', 'string', 'max:50'],
        ]);

        $user = $referrals->applyReferralCode($request->user(), $validated['referral_code']);

        return response()->json([
            'message' => 'Referral code linked successfully.',
            'referred_by' => [
                'id' => $user->referrer->id,
                'name' => $user->referrer->name,
                'email' => $user->referrer->email,
            ],
        ]);
    }
}
