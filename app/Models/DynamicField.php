<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicField extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_type',
        'category_id',
        'field_name',
        'label',
        'input_type',
        'options',
        'is_required'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean'
    ];

    /**
     * Category this dynamic field belongs to.
     */
    public function category()
    {
        return $this->belongsTo(AuctionCategory::class);
    }
}
