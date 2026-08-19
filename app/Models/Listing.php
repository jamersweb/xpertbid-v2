<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Support\ListingMedia;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'sub_category_id',
        'child_category_id',
        'brand_id',
        'country_id',
        'state_id',
        'city_id',
        'listing_type', // This field already exists
        'title',
        'slug',
        'image',
        'album',
        'description',
        'status',
        'winner_id',
        'featured_name',
        'is_1_rupee',
        'is_autobidder_on',
        'listing_source',
        'youtube_video_id',
        'views',
        'listing_data',
        'category_features',
        'is_draft', // Added based on the provided snippet
    ];

    protected $casts = [
        'listing_data' => 'array',
        'category_features' => 'array',
        'album' => 'array',
        'listing_type' => 'string',
        'is_1_rupee' => 'boolean',
        'is_autobidder_on' => 'boolean',
    ];

    protected $appends = [
        'price',
        'stock',
        'minimum_bid',
        'start_date',
        'end_date',
        'discount_type',
        'discount_value',
        'image_url',
        'image',
        'album',
        'buy_now_price',
        'product_condition',
        'product_year',
        'list_type',
        'reserve_price',
        'album_urls',
        'vehicle_verification',
        'property_verification',
        'variations',
    ];

    /**
     * User who created the listing.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    /**
     * Category the listing belongs to.
     */
    public function category()
    {
        return $this->belongsTo(AuctionCategory::class, 'category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(AuctionCategory::class, 'sub_category_id');
    }

    public function childCategory()
    {
        return $this->belongsTo(AuctionCategory::class, 'child_category_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function pendingEdit()
    {
        return $this->hasOne(ListingEdit::class);
    }

    public function liveChatMessages()
    {
        return $this->hasMany(ListingLiveChatMessage::class, 'listing_id');
    }

    // Helper methods to access listing-type specific data
    public function getPriceAttribute()
    {
        return $this->listing_data['price'] ?? $this->listing_data['start_price'] ?? $this->listing_data['minimum_bid'] ?? null;
    }

    public function getStockAttribute()
    {
        return $this->listing_data['stock'] ?? null;
    }

    public function getMinimumBidAttribute()
    {
        return $this->listing_data['minimum_bid'] ?? $this->listing_data['start_price'] ?? $this->listing_data['price'] ?? null;
    }

    public function getStartDateAttribute()
    {
        return $this->listing_data['start_date'] ?? null;
    }

    public function getEndDateAttribute()
    {
        return $this->listing_data['end_date'] ?? null;
    }

    public function getDiscountTypeAttribute()
    {
        return $this->listing_data['discount_type'] ?? null;
    }

    public function getDiscountValueAttribute()
    {
        return $this->listing_data['discount_value'] ?? null;
    }

    public function getVariationsAttribute(): array
    {
        $raw = $this->listing_data['variations'] ?? [];
        if (!is_array($raw)) {
            return [];
        }

        $variations = [];
        foreach (array_values($raw) as $index => $variation) {
            if (!is_array($variation)) {
                continue;
            }

            $name = trim((string) ($variation['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $variations[] = [
                'id' => $index,
                'name' => $name,
                'price' => $variation['price'] ?? null,
                'discount_type' => $variation['discount_type'] ?? null,
                'discount_value' => $variation['discount_value'] ?? null,
            ];
        }

        return $variations;
    }

    public function variationByIndex(mixed $index): ?array
    {
        if ($index === null || $index === '') {
            return null;
        }

        foreach ($this->variations as $variation) {
            if ((string) $variation['id'] === (string) $index) {
                return $variation;
            }
        }

        return null;
    }

    public function variationSalePrice(?array $variation): float
    {
        $original = (float) ($variation['price'] ?? $this->buy_now_price ?? $this->minimum_bid ?? 0);
        $discountType = $variation['discount_type'] ?? $this->discount_type;
        $discountValue = (float) ($variation['discount_value'] ?? $this->discount_value ?? 0);
        $price = $original;

        if ($discountType && $discountValue > 0) {
            if ($discountType === 'percent') {
                $price = $original - ($original * ($discountValue / 100));
            } elseif ($discountType === 'flat') {
                $price = $original - $discountValue;
            }
        }

        return max(0, $price);
    }

    public function getImageAttribute($value)
    {
        return ListingMedia::firstDisplayableImage([
            $value,
            $this->listing_data['image'] ?? null,
            ...$this->album,
        ]);
    }

    public function getAlbumAttribute($value)
    {
        if ($value) {
            return ListingMedia::decodeList($value);
        }

        return ListingMedia::decodeList($this->listing_data['album'] ?? []);
    }

    public function getListTypeAttribute()
    {
        return $this->listing_type ?: ($this->listing_data['list_type'] ?? 'normal_list');
    }

    public function getBuyNowPriceAttribute()
    {
        return $this->listing_data['price'] ?? $this->listing_data['buy_now_price'] ?? null;
    }

    public function getReservePriceAttribute()
    {
        return $this->listing_data['reserve_price'] ?? null;
    }

    public function getProductConditionAttribute()
    {
        return $this->listing_data['product_condition'] ?? $this->listing_data['condition'] ?? null;
    }

    public function getProductYearAttribute()
    {
        return $this->listing_data['product_year'] ?? $this->listing_data['year'] ?? null;
    }

    public function getImageUrlAttribute()
    {
        return ListingMedia::buildAssetUrl($this->image);
    }

    public function getAlbumUrlsAttribute()
    {
        return ListingMedia::buildAssetUrls($this->album);
    }

    public function getVehicleVerificationAttribute()
    {
        $docs = $this->listing_data['vehicle_documents'] ?? [];
        return !empty($docs);
    }

    public function getPropertyVerificationAttribute()
    {
        $docs = $this->listing_data['property_documents'] ?? [];
        return !empty($docs);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Category IDs in the property tree (root + sub + child).
     *
     * @return list<int>
     */
    public static function propertyCategoryIds(?int $rootId = null): array
    {
        $rootId = $rootId ?? (int) config('property.root_category_id', 222);
        $ids = [$rootId];

        $subIds = AuctionCategory::query()
            ->where('parent_id', $rootId)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $ids = array_merge($ids, $subIds);

        if ($subIds !== []) {
            $childIds = AuctionCategory::query()
                ->whereIn('sub_category_id', $subIds)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $ids = array_merge($ids, $childIds);
        }

        return array_values(array_unique($ids));
    }

    public function scopeBrowseable($query)
    {
        return $query->whereIn('status', ['active', 'sold_out']);
    }

    /**
     * Public property listings under the configured root category tree.
     */
    public function scopeProperties($query)
    {
        $ids = static::propertyCategoryIds();

        return $query
            ->browseable()
            ->where(function ($q) {
                $q->whereNull('listing_type')
                    ->orWhere('listing_type', '!=', 'live_auction');
            })
            ->where(function ($q) use ($ids) {
                $q->whereIn('category_id', $ids)
                    ->orWhereIn('sub_category_id', $ids)
                    ->orWhereIn('child_category_id', $ids);
            });
    }

    protected static function booted()
    {
        static::creating(function ($listing) {
            if (!$listing->slug) {
                $listing->slug = \Illuminate\Support\Str::slug($listing->title) . '-' . uniqid();
            }
        });
    }
}
