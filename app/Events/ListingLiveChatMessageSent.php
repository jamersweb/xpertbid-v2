<?php

namespace App\Events;

use App\Models\ListingLiveChatMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ListingLiveChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ListingLiveChatMessage $message
    ) {
        $this->message->loadMissing('user:id,name');
    }

    public function broadcastAs(): string
    {
        return 'ListingLiveChatMessageSent';
    }

    /**
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('listing-live-chat.' . $this->message->listing_id),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $user = $this->message->user;

        return [
            'id' => $this->message->id,
            'listing_id' => $this->message->listing_id,
            'body' => $this->message->body,
            'created_at' => $this->message->created_at?->toIso8601String(),
            'user' => [
                'id' => $user?->id,
                'name' => $user?->name ?? 'User',
            ],
        ];
    }
}
