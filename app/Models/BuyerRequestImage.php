<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuyerRequestImage extends Model
{
    protected $fillable = [
        'buyer_request_id',
        'path',
        'sort_order',
    ];

    protected $appends = ['url'];

    public function buyerRequest(): BelongsTo
    {
        return $this->belongsTo(BuyerRequest::class);
    }

    public function getUrlAttribute(): string
    {
        $path = ltrim((string) $this->path, '/');

        return asset($path);
    }
}
