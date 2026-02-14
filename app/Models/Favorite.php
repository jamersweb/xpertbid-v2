<?php

namespace App\Models;
use App\Models\Auction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{   protected $table = "favorites";
    protected $fillable = ['user_id', 'auctions_id'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class, 'auctions_id');
    }
}
