<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = [
        'code','symbol','name','decimals','position','enabled','manual_rate_to_aed'
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'manual_rate_to_aed' => 'decimal:8',
    ];
}
