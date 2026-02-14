<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AuctionCategory;
use App\Models\Subcategory;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Bid;
use App\Models\Favorite;


class Auction extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'user_id',
        'category_id',
        'sub_category_id',
        'child_category_id',
        'start_date',
        'end_date',
        'image',
        'current_highest_bid',
        'album',
        'product_condition',
        'product_year',
        'product_location',
        'live_auction_date',
        'live_auction_start_time',
        'live_auction_end_time',
        'reserve_price',
        'minimum_bid',
        'is_bid_increment',
        'bid_increment',
        'is_buynow',
        'buy_now_price',
        'description',
        'international_shipping',
        'shipping_conditions',
        'shipping_terms',
        'views',
        'status',
        'is_autobidder_on',
        'featured_name',
        'winner_id',
        'list_type',
        'create_category',
        'decline_reason',
        'developer',
        'location_url',
        'delivery_date',
        'sale_starts',
        'payment_plan',
        'number_of_buildings',
        'government_fee',
        'nearby_location',
        'amenities',
        'facilities',
        'discount_type',
        'discount_value',
        'is_1_rupee',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'auctions_id');
    }

    public function category()
    {
        return $this->belongsTo(AuctionCategory::class);
    }

    protected static function booted()
    {
        static::deleting(function ($auction) {
            // jab auction soft-delete ho, uski bids bhi soft-delete ho jayein
            $auction->bids()->delete();
        });

        static::saving(function ($auction) {
            if (empty($auction->slug)) {
                $slug = Str::slug($auction->title, '-');
                // Truncate slug to 255 chars (DB limit)
                $auction->slug = Str::limit($slug, 255, '');
            }
        });


    }
    // public function subCategory()
    // {
    //     return $this->belongsTo(SubCategory::class);
    // }
    public function subCategory()
    {
        return $this->belongsTo(AuctionCategory::class, 'sub_category_id');
    }
    // public function bids()
    // {
    //     return $this->hasMany(Bid::class, 'auction_id');
    // }

    // Relationship with bids:
    public function bids()
    {
        return $this->hasMany(Bid::class, 'auction_id');
    }

    // If you store winner_id:
    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
    // app/Models/Auction.php

    // Auction.php

    public function property_verification()
    {
        return $this->hasOne(\App\Models\PropertyVerification::class, 'auction_id', 'id');
    }

    public function vehicle_verification()
    {
        return $this->hasOne(\App\Models\VehicleVerification::class, 'auction_id', 'id');
    }



    public function childCategory()
    {
        return $this->belongsTo(AuctionCategory::class, 'child_category_id');
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

}

