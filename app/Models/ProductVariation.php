<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariation extends Model
{
    use HasFactory;

    protected $fillable = [
        'auction_id',
        'name',
        'price',
        'discount_type',
        'discount_value',
    ];

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
