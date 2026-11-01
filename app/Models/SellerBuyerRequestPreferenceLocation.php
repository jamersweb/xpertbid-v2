<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerBuyerRequestPreferenceLocation extends Model
{
    protected $fillable = [
        'preference_id',
        'location_label',
        'country',
        'state',
        'city',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function preference(): BelongsTo
    {
        return $this->belongsTo(SellerBuyerRequestPreference::class, 'preference_id');
    }
}
