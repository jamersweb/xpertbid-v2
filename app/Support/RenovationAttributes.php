<?php

namespace App\Support;

use App\Models\Listing;
use App\Models\User;

class RenovationAttributes
{
    /**
     * Curated public attributes from listing_data + category_features.
     *
     * @return array<string, mixed>
     */
    public static function extract(Listing $listing, bool $detailed = false): array
    {
        $keys = config('renovation.attribute_keys', []);
        $merged = array_merge(
            is_array($listing->listing_data) ? $listing->listing_data : [],
            is_array($listing->category_features) ? $listing->category_features : []
        );

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
        foreach (['price', 'start_price', 'buy_now_price', 'minimum_bid', 'estimated_cost', 'rate_per_sqft'] as $key) {
            if (!isset($data[$key]) || $data[$key] === '' || $data[$key] === null) {
                continue;
            }
            if (is_numeric($data[$key])) {
                return (float) $data[$key];
            }
        }

        return null;
    }

    public static function sellerAvatarUrl(?User $user): ?string
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
