<?php

namespace App\Http\Resources\Api\V1\Renovation;

use App\Support\RenovationAttributes;
use Illuminate\Http\Request;

class RenovationDetailResource extends RenovationCardResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $card = parent::toArray($request);
        $album = is_array($this->album_urls) ? array_values($this->album_urls) : [];
        $attrs = RenovationAttributes::extract($this->resource, true);
        $data = is_array($this->listing_data) ? $this->listing_data : [];
        $features = is_array($this->category_features) ? $this->category_features : [];

        $html = static fn ($value) => is_string($value) ? $value : '';

        $lat = $attrs['latitude'] ?? $features['latitude'] ?? $data['latitude'] ?? null;
        $lng = $attrs['longitude'] ?? $features['longitude'] ?? $data['longitude'] ?? null;
        $mapUrl = $attrs['map_url'] ?? $features['map_url'] ?? $data['map_url'] ?? null;

        if (!$mapUrl && $lat && $lng) {
            $mapUrl = "https://maps.google.com/maps?q={$lat},{$lng}";
        }

        return array_merge($card, [
            'description' => $this->sanitizeDescription($this->description),
            'album_urls' => $album,
            'attributes' => $attrs,
            'map_url' => $mapUrl,
            'latitude' => $lat,
            'longitude' => $lng,
            'canonical_path' => '/services/' . $this->slug,
            'views' => (int) ($this->views ?? 0),
            'youtube_video_id' => $this->youtube_video_id,
            'featured_name' => $this->featured_name,
            'scope_of_work' => $html($data['scope_of_work'] ?? $features['scope_of_work'] ?? ''),
            'materials_spec' => $html($data['materials_spec'] ?? $features['materials_spec'] ?? ''),
            'warranty_details' => $html($data['warranty_details'] ?? $features['warranty_details'] ?? ''),
            'terms_conditions' => $html($data['terms_conditions'] ?? $features['terms_conditions'] ?? ''),
            'packages' => $data['packages'] ?? [],
        ]);
    }

    protected function sanitizeDescription(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        return strip_tags($html, '<p><br><ul><ol><li><strong><em><b><i><a><div><span><img><table><thead><tbody><tfoot><tr><td><th><caption>');
    }
}
