<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // make sure to import the User model

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'transaction_id',
        'amount',
        'payment_method',
        'type',
        'status',
        'datetime',
        'product_id',
        'title',
        'category_id',
        'album',
    ];
    
    public function auction()
{
    return $this->belongsTo(\App\Models\Auction::class, 'product_id');
}
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
