<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerBuyerRequestPreference extends Model
{
    protected $fillable = [
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            AuctionCategory::class,
            'seller_buyer_request_preference_categories',
            'preference_id',
            'category_id'
        );
    }

    public function locations(): HasMany
    {
        return $this->hasMany(SellerBuyerRequestPreferenceLocation::class, 'preference_id');
    }
}
