<?php

namespace App\Policies;

use App\Models\BuyerRequest;
use App\Models\User;

class BuyerRequestPolicy
{
    public function view(?User $user, BuyerRequest $buyerRequest): bool
    {
        // Open buyer requests can be viewed by anyone (guests, unverified, and corporate)
        if ($buyerRequest->isOpen()) {
            return true;
        }

        if (! $user) {
            return false;
        }

        if ((int) $buyerRequest->user_id === (int) $user->id) {
            return true;
        }

        return $user->isCorporateVerified();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, BuyerRequest $buyerRequest): bool
    {
        return (int) $buyerRequest->user_id === (int) $user->id
            && $buyerRequest->status !== BuyerRequest::STATUS_FULFILLED;
    }

    public function close(User $user, BuyerRequest $buyerRequest): bool
    {
        return (int) $buyerRequest->user_id === (int) $user->id;
    }

    public function acceptOffer(User $user, BuyerRequest $buyerRequest): bool
    {
        return (int) $buyerRequest->user_id === (int) $user->id;
    }

    public function rejectOffer(User $user, BuyerRequest $buyerRequest): bool
    {
        return (int) $buyerRequest->user_id === (int) $user->id;
    }
}
