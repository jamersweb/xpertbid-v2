<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuyerRequestOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'buyer_request_id' => $this->buyer_request_id,
            'seller_id' => $this->seller_id,
            'price' => (float) $this->price,
            'currency' => 'PKR',
            'message' => $this->message,
            'status' => $this->status,
            // Public seller card only — never expose email / phone
            'seller' => $this->whenLoaded('seller', function () {
                if (! $this->seller) {
                    return null;
                }

                return $this->seller->toPublicIdentityCard();
            }),
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'updated_at' => optional($this->updated_at)?->toIso8601String(),
        ];
    }
}
