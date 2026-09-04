<?php

namespace App\Http\Resources\Api\V1\Property;

use App\Support\PropertyAttributes;
use Illuminate\Http\Request;

class PropertyDetailResource extends PropertyCardResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $card = parent::toArray($request);
        $album = is_array($this->album_urls) ? array_values($this->album_urls) : [];
        $attrs = PropertyAttributes::extract($this->resource, true);
        $data = is_array($this->listing_data) ? $this->listing_data : [];
        $features = is_array($this->category_features) ? $this->category_features : [];

        $html = static fn ($value) => is_string($value) ? $value : '';

        return array_merge($card, [
            'description' => $this->sanitizeDescription($this->description),
            'album_urls' => $album,
            'attributes' => $attrs,
            'map_url' => $attrs['map_url'] ?? $features['map_url'] ?? $data['map_url'] ?? null,
            'latitude' => $attrs['latitude'] ?? $features['latitude'] ?? $data['latitude'] ?? null,
            'longitude' => $attrs['longitude'] ?? $features['longitude'] ?? $data['longitude'] ?? null,
            'canonical_path' => '/properties/' . $this->slug,
            'views' => (int) ($this->views ?? 0),
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'minimum_bid' => PropertyAttributes::numericOrNull($this->minimum_bid),
            'reserve_price' => PropertyAttributes::numericOrNull($this->reserve_price),
            'highest_bid' => (float) ($this->bids()->max('bid_amount') ?? 0),
            'youtube_video_id' => $this->youtube_video_id,
            'featured_name' => $this->featured_name,
            'product_location' => $features['product_location'] ?? $data['product_location'] ?? $features['property_address'] ?? $data['property_address'] ?? null,
            'developer' => $data['developer'] ?? null,
            'delivery_date' => $data['delivery_date'] ?? null,
            'sale_starts' => $data['sale_starts'] ?? null,
            'payment_plan' => $html($data['payment_plan'] ?? ''),
            'number_of_buildings' => $data['number_of_buildings'] ?? null,
            'government_fee' => $html($data['government_fee'] ?? ''),
            'location_url' => $html($data['location_url'] ?? ''),
            'nearby_location' => $html($data['nearby_location'] ?? ''),
            'amenities' => $html($features['amenities'] ?? $data['amenities'] ?? ''),
            'facilities' => $html($features['facilities'] ?? $data['facilities'] ?? ''),
        ]);
    }

    protected function sanitizeDescription(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // Property "description" can contain v2-like payment plans/doc tables.
        // Keep common formatting + table-related tags so the frontend can render them.
        return strip_tags($html, '<p><br><ul><ol><li><strong><em><b><i><a><div><span><img><table><thead><tbody><tfoot><tr><td><th><caption>');
    }
}
