<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralReward extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_PAID = 'paid';

    protected $fillable = [
        'referrer_id',
        'referred_user_id',
        'order_id',
        'listing_id',
        'trigger_type',
        'source_type',
        'source_id',
        'amount_base',
        'reward_percent',
        'reward_amount',
        'status',
        'approved_by',
        'approved_at',
        'admin_note',
    ];

    protected $casts = [
        'amount_base' => 'decimal:2',
        'reward_percent' => 'decimal:2',
        'reward_amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
