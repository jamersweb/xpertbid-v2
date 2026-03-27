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
        'listing_id',
        'auction_title',
        'user_id',
        'status',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}