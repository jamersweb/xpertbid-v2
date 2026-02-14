<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'auction_id',
        'variation_id',
        'type',
        'quantity',
        'price',
        'subtotal',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }

    public function variation()
    {
        return $this->belongsTo(ProductVariation::class, 'variation_id');
    }
}
