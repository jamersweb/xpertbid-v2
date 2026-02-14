<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewNotification extends Model
{
    use HasFactory;
    
    protected $table = "newnotifications";

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'read_at',
        'type',
        'image_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public static function getImageForType($type) {
        $images = [
            'wallet' => '/assets/images/message-text.svg',
            'bid' => '/assets/images/message-text.svg',
            'auction' => '/assets/images/message-text.svg',
            'order' => '/assets/images/message-text.svg',
        ];

        return $images[$type] ?? '/assets/images/message-text.svg';
    }
}
