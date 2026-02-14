<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndividualVerification extends Model
{
    protected $fillable = [
        'user_id',
        'full_legal_name',
        'dob',
        'nationality',
        'residential_address',
        'id_front_path',
        'id_back_path',
        'contact_number',
        'email_address',
        'country',
        'status',
        'document_type',
    ];

    // Optionally, for relationship with user:
    public function user() {
        return $this->belongsTo(User::class);
    }
}

