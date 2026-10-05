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
        'decline_reason',
        'document_type',
    ];

    /**
     * Never expose storage keys in JSON / Inertia payloads.
     * Serve files only via authenticated KYC download routes.
     */
    protected $hidden = [
        'id_front_path',
        'id_back_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
