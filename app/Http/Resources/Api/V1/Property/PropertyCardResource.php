<?php

namespace App\Http\Resources\Api\V1\Property;

use App\Support\PropertyAttributes;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $album = is_array($this->album_urls) ? array_values($this->album_urls) : [];
        $albumPreview = array_slice($album, 0, 3);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'status' => $this->status,
            'listing_type' => $this->listing_type,
            'price' => [
                'amount' => PropertyAttributes::numericPrice($this->resource),
                'currency' => 'PKR',
            ],
            'image_url' => $this->image_url,
            'album_urls' => $albumPreview,
            'location' => [
                'city' => $this->city?->name,
                'state' => $this->state?->name,
                'country' => $this->country?->name,
            ],
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
                'sub_category' => $this->subCategory?->name,
                'child_category' => $this->childCategory?->name,
            ],
            'attributes' => PropertyAttributes::extract($this->resource, false),
            'featured' => $this->featured_name === config('property.featured_name'),
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'seller' => $this->whenLoaded('user', fn () => [
                'name' => $this->user?->name,
                'avatar_url' => PropertyAttributes::sellerAvatarUrl($this->user),
            ]),
        ];
    }
}
