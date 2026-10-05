<?php

namespace App\Support;

use App\Models\Bid;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Support\Collection;

class ProductPagePresenter
{
    /** @var list<string> */
    private const LISTING_DATA_BLOCKLIST = [
        'vehicle_documents',
        'property_documents',
        'documents',
        'id_documents',
        'business_documents',
        'id_front',
        'id_back',
        'id_front_path',
        'id_back_path',
        'password',
        'api_token',
        'remember_token',
    ];

    /** @var list<string> */
    private const PUBLIC_LISTING_DATA_KEYS = [
        'start_price',
        'minimum_bid',
        'reserve_price',
        'price',
        'buy_now_price',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'stock',
        'variations',
        'list_type',
        'product_condition',
        'condition',
        'product_year',
        'year',
        'developer',
        'delivery_date',
        'sale_starts',
        'payment_plan',
        'number_of_buildings',
        'government_fee',
        'amenities',
        'facilities',
        'nearby_location',
        'location_url',
        'product_location',
        'video',
        'youtube_video_id',
    ];

    public static function listing(Listing $listing): array
    {
        $listingData = self::sanitizeListingData($listing->listing_data ?? []);
        $publicUser = self::publicUser($listing->user);

        $payload = [
            'id' => $listing->id,
            'user_id' => $listing->user_id,
            'category_id' => $listing->category_id,
            'sub_category_id' => $listing->sub_category_id,
            'child_category_id' => $listing->child_category_id,
            'brand_id' => $listing->brand_id,
            'title' => $listing->title,
            'slug' => $listing->slug,
            'description' => $listing->description,
            'status' => $listing->status,
            'listing_type' => $listing->listing_type,
            'list_type' => $listing->list_type,
            'featured_name' => $listing->featured_name,
            'youtube_video_id' => $listing->youtube_video_id,
            'views' => $listing->views,
            'image_url' => $listing->image_url,
            'album_urls' => $listing->album_urls,
            'video' => $listingData['video'] ?? null,
            'price' => $listing->price,
            'stock' => $listing->stock,
            'minimum_bid' => $listing->minimum_bid,
            'buy_now_price' => $listing->buy_now_price,
            'reserve_price' => $listing->reserve_price,
            'discount_type' => $listing->discount_type,
            'discount_value' => $listing->discount_value,
            'start_date' => $listing->start_date,
            'end_date' => $listing->end_date,
            'product_condition' => $listing->product_condition,
            'product_year' => $listing->product_year,
            'variations' => $listing->variations,
            'vehicle_verification' => (bool) $listing->vehicle_verification,
            'property_verification' => (bool) $listing->property_verification,
            'is_property' => (bool) $listing->is_property,
            'property_url' => $listing->property_url,
            'category_features' => is_array($listing->category_features) ? $listing->category_features : [],
            'listing_data' => $listingData,
            'user' => $publicUser,
            'seller' => $publicUser,
            'category' => $listing->relationLoaded('category') && $listing->category
                ? [
                    'id' => $listing->category->id,
                    'name' => $listing->category->name,
                    'slug' => $listing->category->slug,
                    'schema_markup' => $listing->category->schema_markup ?? null,
                ]
                : null,
        ];

        // Flatten a few listing_data display fields the Show page reads at the top level.
        foreach ([
            'developer',
            'delivery_date',
            'sale_starts',
            'payment_plan',
            'number_of_buildings',
            'government_fee',
            'amenities',
            'facilities',
            'nearby_location',
            'location_url',
            'product_location',
        ] as $key) {
            $payload[$key] = $listingData[$key] ?? null;
        }

        return $payload;
    }

    public static function related(Listing $listing): array
    {
        $publicUser = self::publicUser($listing->user);

        return [
            'id' => $listing->id,
            'title' => $listing->title,
            'slug' => $listing->slug,
            'status' => $listing->status,
            'listing_type' => $listing->listing_type,
            'list_type' => $listing->list_type,
            'featured_name' => $listing->featured_name,
            'image_url' => $listing->image_url,
            'price' => $listing->price,
            'minimum_bid' => $listing->minimum_bid,
            'buy_now_price' => $listing->buy_now_price,
            'reserve_price' => $listing->reserve_price,
            'start_date' => $listing->start_date,
            'end_date' => $listing->end_date,
            'bids_max_bid_amount' => $listing->bids_max_bid_amount ?? null,
            'user' => $publicUser,
            'owner' => [
                'name' => $publicUser['name'] ?? '',
                'profile' => $publicUser['profile_pic'] ?? '',
            ],
            'category' => $listing->relationLoaded('category') && $listing->category
                ? [
                    'id' => $listing->category->id,
                    'name' => $listing->category->name,
                    'slug' => $listing->category->slug,
                ]
                : null,
        ];
    }

    /**
     * @param  Collection<int, Bid>|iterable<int, Bid>  $bids
     * @return list<array<string, mixed>>
     */
    public static function bids(iterable $bids): array
    {
        $out = [];

        foreach ($bids as $bid) {
            $out[] = [
                'id' => $bid->id,
                'bid_amount' => $bid->bid_amount,
                'created_at' => optional($bid->created_at)?->toIso8601String(),
                'user' => self::publicUser($bid->user),
            ];
        }

        return $out;
    }

    public static function publicUser(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        // Expect callers to eager-load verification status relations when badge is needed.
        $individual = $user->relationLoaded('individualVerification')
            ? strtolower((string) ($user->individualVerification?->status ?? ''))
            : '';
        $corporate = $user->relationLoaded('corporateVerification')
            ? strtolower((string) ($user->corporateVerification?->status ?? ''))
            : '';

        $isVerified = in_array($individual, ['verified', 'approved'], true)
            || in_array($corporate, ['verified', 'approved'], true);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'profile_pic' => $user->profile_pic,
            'is_verified' => $isVerified,
            // Compat for OwnerInfoRow without exposing full verification records
            'individual_verification' => $isVerified && in_array($individual, ['verified', 'approved'], true)
                ? ['status' => 'verified']
                : null,
            'corporate_verification' => $isVerified && in_array($corporate, ['verified', 'approved'], true)
                ? ['status' => 'verified']
                : null,
        ];
    }

    public static function winnerDetails(?User $winner): ?array
    {
        if (! $winner) {
            return null;
        }

        return [[
            'name' => $winner->name,
        ]];
    }

    /**
     * @param  mixed  $listingData
     * @return array<string, mixed>
     */
    private static function sanitizeListingData(mixed $listingData): array
    {
        if (! is_array($listingData)) {
            return [];
        }

        $clean = [];

        foreach (self::PUBLIC_LISTING_DATA_KEYS as $key) {
            if (! array_key_exists($key, $listingData)) {
                continue;
            }
            $clean[$key] = $listingData[$key];
        }

        // Keep unknown non-document scalar/array feature-like keys that are clearly not file paths.
        foreach ($listingData as $key => $value) {
            $keyStr = (string) $key;
            if (isset($clean[$keyStr])) {
                continue;
            }
            if (in_array($keyStr, self::LISTING_DATA_BLOCKLIST, true)) {
                continue;
            }
            if (str_contains(strtolower($keyStr), 'document')) {
                continue;
            }
            if (str_starts_with($keyStr, 'field_') || str_contains($keyStr, '__')) {
                // Dynamic field values sometimes live in listing_data; prefer category_features.
                continue;
            }
        }

        return $clean;
    }
}
