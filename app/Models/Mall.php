<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'status',
    ];

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function corporateVerifications()
    {
        return $this->hasMany(CorporateVerification::class);
    }
}
