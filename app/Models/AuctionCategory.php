<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class AuctionCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = [
        'image_url',
    ];

    protected $fillable = [
        'name',
        'image',
        'parent_id',
        'sub_category_id',
        'meta_title',
        'meta_description',
        'seo_content',
        'seo_short_content',
        'schema_markup',
        'slug'
    ];


    protected static function booted()
    {
        static::saving(function ($cat) {
            if (empty($cat->slug)) {
                $cat->slug = Str::slug($cat->name, '-');
            }
        });
    }

    // Parent category relation
    public function parentCategory()
    {
        return $this->belongsTo(AuctionCategory::class, 'parent_id');
    }

    // Subcategories relation

    // Recursive relationship for multi-level categories
    public function childrenRecursive()
    {
        return $this->subCategories()->with('childrenRecursive');
    }
    public function subCategories()
    {
        return $this->hasMany(self::class, 'parent_id')
            ->whereNull('sub_category_id');
    }

    // 3rd-level: child items (sub → children)
    public function childCategories()
    {
        return $this->hasMany(self::class, 'sub_category_id');
    }
    // Get full image URL
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return asset('assets/default-category.png');
        }

        if (Str::startsWith($this->image, ['http://', 'https://'])) {
            return $this->image;
        }

        $imagePath = ltrim($this->image, '/');

        if (File::exists(public_path($imagePath))) {
            return asset($imagePath);
        }

        if (File::exists(public_path('assets/images/' . $imagePath))) {
            return asset('assets/images/' . $imagePath);
        }

        return asset('storage/' . $imagePath);
    }
    public function auctions()
    {
        return $this->hasMany(\App\Models\Auction::class, 'category_id');
    }

    public function listings()
    {
        return $this->hasMany(\App\Models\Listing::class, 'category_id');
    }

}
