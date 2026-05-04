<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveAuctionSession extends Model
{
    protected $fillable = [
        'live_url',
        'youtube_video_id',
        'selected_listing_ids',
        'status',
        'scheduled_at',
        'closed_at',
    ];

    protected $casts = [
        'selected_listing_ids' => 'array',
        'scheduled_at' => 'datetime',
        'closed_at' => 'datetime',
    ];
}
