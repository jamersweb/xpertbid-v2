<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'addressLine1',
        'addressLine2',
        'country',
        'city',
        'state',
        'postalCode',
        'contactNumber',
        'otherNumber',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
