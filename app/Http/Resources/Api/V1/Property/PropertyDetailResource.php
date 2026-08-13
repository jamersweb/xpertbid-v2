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

        return array_merge($card, [
            'description' => $this->sanitizeDescription($this->description),
            'album_urls' => $album,
            'attributes' => $attrs,
            'map_url' => $attrs['map_url'] ?? null,
            'canonical_path' => '/properties/' . $this->slug,
            'views' => (int) ($this->views ?? 0),
        ]);
    }

    protected function sanitizeDescription(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        return strip_tags($html, '<p><br><ul><ol><li><strong><em><b><i><a>');
    }
}
