<?php

namespace App\Events;

use App\Models\BuyerRequest;
use App\Models\BuyerRequestOffer;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BuyerRequestChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public BuyerRequest $buyerRequest,
        public string $action,
        public ?BuyerRequestOffer $offer = null,
    ) {
    }

    public function broadcastAs(): string
    {
        return 'BuyerRequestChanged';
    }

    /**
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('buyer-request.'.$this->buyerRequest->id),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'buyer_request_id' => $this->buyerRequest->id,
            'slug' => $this->buyerRequest->slug,
            'action' => $this->action,
            'request_status' => $this->buyerRequest->status,
            'offer_id' => $this->offer?->id,
            'offer_status' => $this->offer?->status,
            'seller_id' => $this->offer?->seller_id,
        ];
    }
}
