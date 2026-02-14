<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cargo_type',
        'glass_option',
        'glass_size',
        'thickness',
        'glassquantity',
        'glass_type',
        'container_size',
        'quantity',
        'goods_description',
        'weight',
        'origin_country',
        'origin_city',
        'destination_country',
        'destination_city',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
