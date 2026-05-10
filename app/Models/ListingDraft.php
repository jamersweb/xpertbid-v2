<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Support\ListingMedia;

class ListingDraft extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'source_listing_id',
        'category_id',
        'sub_category_id',
        'child_category_id',
        'listing_type',
        'title',
        'description',
        'image',
        'album',
        'listing_source',
        'listing_data',
        'category_features',
    ];

    protected $casts = [
        'album' => 'array',
        'listing_data' => 'array',
        'category_features' => 'array',
    ];

    protected $appends = [
        'image_url',
        'album_urls',
        'price',
        'stock',
        'minimum_bid',
        'start_date',
        'end_date',
        'discount_type',
        'discount_value',
        'buy_now_price',
        'product_condition',
        'product_year',
        'list_type',
        'reserve_price',
        'vehicle_verification',
        'property_verification',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(AuctionCategory::class, 'category_id');
    }

    public function sourceListing()
    {
        return $this->belongsTo(Listing::class, 'source_listing_id');
    }

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
        return ListingMedia::buildAssetUrl(
            ListingMedia::firstDisplayableImage([
                $this->image,
                $this->listing_data['image'] ?? null,
                ...ListingMedia::decodeList($this->album ?: ($this->listing_data['album'] ?? [])),
            ])
        );
    }

    public function getAlbumUrlsAttribute()
    {
        return ListingMedia::buildAssetUrls(
            ListingMedia::decodeList($this->album ?: ($this->listing_data['album'] ?? []))
        );
    }

    public function getVehicleVerificationAttribute()
    {
        return !empty($this->listing_data['vehicle_documents'] ?? []);
    }

    public function getPropertyVerificationAttribute()
    {
        return !empty($this->listing_data['property_documents'] ?? []);
    }
}
