<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'auction_id',
        'variation_id',
        'type',
        'quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }

    public function variation()
    {
        return $this->belongsTo(ProductVariation::class);
    }
}
