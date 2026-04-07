<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Auction;
use App\Models\User;

class Bid extends Model
{
    //
    protected $fillable = ['user_id', 'auction_id', 'listing_id', 'bid_amount', 'bid_source'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class, 'auction_id');
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
