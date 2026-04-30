<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Country;
use App\Models\State;
use App\Models\City;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'sub_category_id',
        'child_category_id',
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
        'featured_name',
        'is_1_rupee',
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
        'is_1_rupee' => 'boolean'
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
        'property_verification'
    ];

    /**
     * User who created the listing.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function getImageAttribute($value)
    {
        if ($value) return $value;
        
        $fromData = $this->listing_data['image'] ?? null;
        if ($fromData) return $fromData;

        // Fallback to first image in album
        $album = $this->album; // Uses the album accessor
        return (is_array($album) && count($album) > 0) ? $album[0] : null;
    }

    public function getAlbumAttribute($value)
    {
        if ($value) return is_string($value) ? json_decode($value, true) : $value;
        return $this->listing_data['album'] ?? [];
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
        $image = $this->image;
        
        // If direct image column is empty, check listing_data
        if (!$image && isset($this->listing_data['image'])) {
            $image = $this->listing_data['image'];
        }
        
        // If still empty, check album (direct column or listing_data)
        if (!$image) {
            $album = $this->album ?: ($this->listing_data['album'] ?? null);
            if (!empty($album) && is_array($album)) {
                $image = $album[0];
            } elseif (!empty($album) && is_string($album)) {
                // Handle JSON string if not cast
                $decoded = json_decode($album, true);
                if (is_array($decoded) && !empty($decoded)) {
                    $image = $decoded[0];
                } else {
                    $image = $album;
                }
            }
        }

        if (!$image) return null;

        if (str_starts_with($image, 'http')) {
            return $image;
        }

        $image = str_replace('\\', '/', $image);
        return asset($image);
    }

    public function getAlbumUrlsAttribute()
    {
        $album = $this->album;
        if (empty($album) || !is_array($album)) {
            return [];
        }

        return array_map(function ($path) {
            if (str_starts_with($path, 'http')) {
                return $path;
            }
            $path = str_replace('\\', '/', $path);
            return asset($path);
        }, $album);
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

    protected static function booted()
    {
        static::creating(function ($listing) {
            if (!$listing->slug) {
                $listing->slug = \Illuminate\Support\Str::slug($listing->title) . '-' . uniqid();
            }
        });
    }
}
