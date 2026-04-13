<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingEdit extends Model
{
    use HasFactory;

    protected $table = 'listings_edit';

    protected $fillable = [
        'listing_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
