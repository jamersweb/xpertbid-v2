<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuyNowInquiry extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'message',
        'auction_id',
        'auction_title',
        'user_id',
        'status',
    ];

    public function auction()
    {
        return $this->belongsTo(Auction::class, 'auction_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}