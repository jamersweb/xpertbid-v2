<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerOutreach extends Model
{
    protected $fillable = [
        'user_id',
        'contact_date',
        'name',
        'email',
        'phone',
        'verification_status',
        'call_status',
        'customer_feedback_summary',
        'contract_date',
        'whatsapp_outreach',
        'additional_comments',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
