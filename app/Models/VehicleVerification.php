<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class VehicleVerification extends Model
{
    protected $casts = [
        'vehicle_documents' => 'array',
    ];
    protected $fillable = [
        'user_id','vehicle_make_model','year_of_manufacture',
        'chassis_vin','vehicle_documents','status','auction_id', 'decline_reason'
    ];
    // Relation to User
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function auction()
{
    return $this->belongsTo(\App\Models\Auction::class);
}
}
