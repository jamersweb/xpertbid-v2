<?php

namespace App\Policies;

use App\Models\BuyerRequestOffer;
use App\Models\User;

class BuyerRequestOfferPolicy
{
    public function update(User $user, BuyerRequestOffer $offer): bool
    {
        return (int) $offer->seller_id === (int) $user->id && $user->isCorporateVerified();
    }

    public function delete(User $user, BuyerRequestOffer $offer): bool
    {
        return (int) $offer->seller_id === (int) $user->id && $user->isCorporateVerified();
    }

    public function create(User $user): bool
    {
        return $user->isCorporateVerified();
    }
}
