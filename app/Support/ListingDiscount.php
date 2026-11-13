<?php

namespace App\Support;

use App\Models\Listing;

class ListingDiscount
{
    /**
     * Compute standardized discount metadata for direct-buy listing cards.
     *
     * @return array<string, mixed>
     */
    public static function forListing(Listing $listing, ?float $basePrice): array
    {
        $price = $basePrice !== null ? (float) $basePrice : 0.0;
        $listingType = strtolower(trim((string) ($listing->list_type ?: $listing->listing_type)));
        $isDirectBuy = in_array(
            $listingType,
            ['normal', 'normal_list', 'business', 'business_list', 'bussiness', 'bussiness_list'],
            true
        );

        $discountType = strtolower(trim((string) ($listing->discount_type ?? '')));
        $discountValue = is_numeric($listing->discount_value) ? (float) $listing->discount_value : 0.0;

        $hasDiscount = $isDirectBuy
            && $price > 0
            && $discountValue > 0
            && in_array($discountType, ['percent', 'flat'], true);

        if (!$hasDiscount) {
            return [
                'has_discount' => false,
                'discount_type' => '',
                'discount_value' => 0,
                'original_price' => $price,
                'final_price' => $price,
                'badge_text' => '',
            ];
        }

        $finalPrice = $discountType === 'percent'
            ? $price - ($price * ($discountValue / 100))
            : $price - $discountValue;

        $finalPrice = max(0.0, round($finalPrice, 2));

        return [
            'has_discount' => true,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'original_price' => $price,
            'final_price' => $finalPrice,
            'badge_text' => $discountType === 'percent' ? ((int) round($discountValue)).'% OFF' : 'SALE',
        ];
    }
}

