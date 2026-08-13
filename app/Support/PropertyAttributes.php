<?php

namespace App\Support;

use App\Models\Listing;

class PropertyAttributes
{
    /**
     * Curated public attributes from listing_data + category_features.
     *
     * @return array<string, mixed>
     */
    public static function extract(Listing $listing, bool $detailed = false): array
    {
        $keys = config('property.attribute_keys', []);
        $merged = array_merge(
            is_array($listing->listing_data) ? $listing->listing_data : [],
            is_array($listing->category_features) ? $listing->category_features : []
        );

        // Map legacy dynamic field keys used by marketplace property cards.
        if (!isset($merged['bedrooms']) && isset($merged['field_1'])) {
            $merged['bedrooms'] = $merged['field_1'];
        }
        if (!isset($merged['bathrooms']) && isset($merged['field_2'])) {
            $merged['bathrooms'] = $merged['field_2'];
        }
        if (!isset($merged['area_unit']) && isset($merged['field_5'])) {
            $merged['area_unit'] = $merged['field_5'];
        }
        if (!isset($merged['area']) && isset($merged['field_6'])) {
            $merged['area'] = $merged['field_6'];
        }
        if (!isset($merged['size_sqft']) && isset($merged['area']) && is_numeric($merged['area'])) {
            $merged['size_sqft'] = $merged['area'];
        }

        $out = [];
        foreach ($keys as $key) {
            if (!array_key_exists($key, $merged)) {
                continue;
            }
            $value = $merged[$key];
            if ($value === null || $value === '') {
                continue;
            }
            if (!$detailed && in_array($key, ['map_url', 'latitude', 'longitude', 'address'], true)) {
                continue;
            }
            $out[$key] = is_scalar($value) ? $value : (is_array($value) ? $value : null);
            if ($out[$key] === null) {
                unset($out[$key]);
            }
        }

        return $out;
    }

    public static function numericPrice(Listing $listing): ?float
    {
        $data = is_array($listing->listing_data) ? $listing->listing_data : [];
        foreach (['price', 'reserve_price', 'start_price', 'minimum_bid', 'buy_now_price'] as $key) {
            if (!isset($data[$key]) || $data[$key] === '' || $data[$key] === null) {
                continue;
            }
            if (is_numeric($data[$key])) {
                return (float) $data[$key];
            }
        }

        return null;
    }

    public static function sellerAvatarUrl(?\App\Models\User $user): ?string
    {
        if (!$user || !$user->profile_pic) {
            return null;
        }

        $pic = $user->profile_pic;
        if (preg_match('#^https?://#i', $pic)) {
            return $pic;
        }

        return asset(ltrim($pic, '/'));
    }
}
