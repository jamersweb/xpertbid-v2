<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuyerRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isMatchedLead = $request->routeIs('api.v1.buyer-requests.matched')
            || str_contains((string) $request->path(), 'buyer-requests/matched');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'location_label' => $this->location_label,
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'budget' => $this->budget !== null ? (float) $this->budget : null,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ]),
            'sub_category' => $this->whenLoaded('subCategory', fn () => [
                'id' => $this->subCategory?->id,
                'name' => $this->subCategory?->name,
            ]),
            'child_category' => $this->whenLoaded('childCategory', fn () => [
                'id' => $this->childCategory?->id,
                'name' => $this->childCategory?->name,
            ]),
            'category_id' => $this->category_id,
            'sub_category_id' => $this->sub_category_id,
            'child_category_id' => $this->child_category_id,
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'sort_order' => $img->sort_order,
            ])->values()),
            'offers_count' => $this->when(isset($this->offers_count), $this->offers_count),
            'offers' => $this->when(
                $this->relationLoaded('offers') && ! $isMatchedLead,
                fn () => BuyerRequestOfferResource::collection($this->offers)
            ),
            'accepted_offer_id' => $this->when(! $isMatchedLead, $this->accepted_offer_id),
            // Leads list: only public buyer identity (no email / phone)
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'profile_pic' => $this->user?->profile_pic,
            ]),
            'my_offer' => $this->when(isset($this->my_offer), function () {
                if (! $this->my_offer) {
                    return null;
                }

                return [
                    'id' => $this->my_offer->id,
                    'price' => (float) $this->my_offer->price,
                    'currency' => 'PKR',
                    'message' => $this->my_offer->message,
                    'status' => $this->my_offer->status,
                ];
            }),
            'closed_at' => optional($this->closed_at)?->toIso8601String(),
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'updated_at' => optional($this->updated_at)?->toIso8601String(),
        ];
    }
}
