<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    if (in_array(strtolower((string) ($user->role ?? '')), ['admin', 'superadmin'], true)) {
        return true;
    }

    return \App\Models\Conversation::where('id', $conversationId)
        ->where(function($query) use ($user) {
            $query->where('user_one_id', $user->id)
                  ->orWhere('user_two_id', $user->id);
        })->exists();
});

Broadcast::channel('listing-live-chat.{listingId}', function ($user, $listingId) {
    if (! $user) {
        return false;
    }

    return \App\Models\Listing::where('id', (int) $listingId)->exists();
});

Broadcast::channel('buyer-request.{buyerRequestId}', function ($user, $buyerRequestId) {
    if (! $user) {
        return false;
    }

    $request = \App\Models\BuyerRequest::query()->find((int) $buyerRequestId);
    if (! $request) {
        return false;
    }

    if ((int) $request->user_id === (int) $user->id) {
        return true;
    }

    $user->loadMissing('corporateVerification');

    return $user->isCorporateVerified();
});
