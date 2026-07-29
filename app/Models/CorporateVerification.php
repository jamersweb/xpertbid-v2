<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorporateVerification extends Model
{
    protected $fillable = [
        'user_id',
        'legal_entity_name',
        'registered_address',
        'date_of_incorporation',
        'entity_type',
        'business_documents',
        'country',
        'mall_id',
        'status',
        'decline_reason',
    ];

    protected $casts = [
        'business_documents' => 'array',
        'date_of_incorporation' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mall()
    {
        return $this->belongsTo(Mall::class);
    }
}
