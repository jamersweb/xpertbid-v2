<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BuyerRequest extends Model
{
    use SoftDeletes;

    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_FULFILLED = 'fulfilled';

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'category_id',
        'sub_category_id',
        'child_category_id',
        'location_label',
        'country',
        'state',
        'city',
        'budget',
        'latitude',
        'longitude',
        'status',
        'accepted_offer_id',
        'closed_at',
    ];

    protected $casts = [
        'budget' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'closed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AuctionCategory::class, 'category_id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(AuctionCategory::class, 'sub_category_id');
    }

    public function childCategory(): BelongsTo
    {
        return $this->belongsTo(AuctionCategory::class, 'child_category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(BuyerRequestImage::class)->orderBy('sort_order');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(BuyerRequestOffer::class);
    }

    public function acceptedOffer(): BelongsTo
    {
        return $this->belongsTo(BuyerRequestOffer::class, 'accepted_offer_id');
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function acceptsNewOffers(): bool
    {
        return $this->isOpen();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public static function uniqueSlugFromTitle(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'request';
        $slug = $base;
        $i = 1;

        while (
            static::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    protected static function booted(): void
    {
        static::creating(function (BuyerRequest $request) {
            if (empty($request->slug) && ! empty($request->title)) {
                $request->slug = static::uniqueSlugFromTitle($request->title);
            }
        });
    }
}
