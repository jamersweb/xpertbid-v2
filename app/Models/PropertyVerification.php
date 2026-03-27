<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyVerification extends Model
{
    protected $fillable = [
        'user_id',
        'property_type',
        'property_address',
        'title_deed_number',
        'property_documents',
        'status',
        'listing_id',
        'decline_reason'
    ];


    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
    protected $casts = [
        'property_documents' => 'array',
    ];

      public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
