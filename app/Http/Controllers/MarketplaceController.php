<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\AuctionCategory;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index(Request $request, $slug = null)
    {
        $favoriteListingIds = auth()->check()
            ? Favorite::where('user_id', auth()->id())->pluck('listing_id')->all()
            : [];

        $type = $request->input('type', 'auction');
        $featured = $request->input('featured');

        $applyTypeFilter = function ($query) use ($type) {
            if ($type === 'auction') {
                $query->where('listing_type', 'auction');
            } elseif ($type === 'normal_list' || $type === 'normal') {
                $query->whereIn('listing_type', ['normal', 'normal_list']);
            } elseif ($type === 'business_list' || $type === 'business') {
                $query->whereIn('listing_type', ['business', 'business_list']);
            }
        };

        $categoryHasListings = function ($categoryId) use ($applyTypeFilter) {
            $query = Listing::where('status', 'active')->where(function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId)
                    ->orWhere('sub_category_id', $categoryId)
                    ->orWhere('child_category_id', $categoryId);
            });

            $applyTypeFilter($query);

            return $query->exists();
        };

        // Fetch only categories that have active listings
        $categories = AuctionCategory::with(['subCategories' => function ($q) {
            $q->whereHas('listings', function ($q2) {
                $q2->where('status', 'active');
            })->orWhereHas('childCategories.listings', function ($q2) {
                $q2->where('status', 'active');
            })->with(['childCategories' => function ($q3) {
                $q3->whereHas('listings', function ($q4) {
                    $q4->where('status', 'active');
                });
            }]);
        }])
        ->where(function ($query) {
            $query->whereHas('listings', function ($q) {
                $q->where('status', 'active');
            })
            ->orWhereHas('subCategories.listings', function ($q) {
                $q->where('status', 'active');
            })
            ->orWhereHas('subCategories.childCategories.listings', function ($q) {
                $q->where('status', 'active');
            });
        })
        ->where('parent_id', null)
        ->get();

        $activeSlug = $slug ?? $request->input('category');

        if (!$activeSlug && !$featured && $categories->isNotEmpty()) {
            return redirect()->route('marketplace.index', [
                'slug' => $categories->first()->slug,
            ] + $request->except('category'));
        }

        $query = Listing::where('status', 'active')->with([
            'user.individualVerification',
            'user.corporateVerification',
            'category',
            'bids',
        ]);

        $currentCategory = null;
        $currentTopCategory = null;
        $subcategoryTabs = collect();
        $currentSubcategory = null;
        $childCategoryTabs = collect();

        if ($activeSlug && $activeSlug !== 'all') {
            $currentCategory = AuctionCategory::where('slug', $activeSlug)->first();
            if ($currentCategory) {
                $query->where(function($q) use ($currentCategory) {
                    $q->where('category_id', $currentCategory->id)
                      ->orWhere('sub_category_id', $currentCategory->id)
                      ->orWhere('child_category_id', $currentCategory->id);
                });
            }
        }

        if ($currentCategory) {
            if (is_null($currentCategory->parent_id) && is_null($currentCategory->sub_category_id)) {
                $currentTopCategory = $categories->firstWhere('id', $currentCategory->id);
            } elseif (!is_null($currentCategory->parent_id)) {
                $currentTopCategory = $categories->firstWhere('id', $currentCategory->parent_id);
            } elseif (!is_null($currentCategory->sub_category_id)) {
                $subParent = AuctionCategory::find($currentCategory->sub_category_id);
                if ($subParent && !is_null($subParent->parent_id)) {
                    $currentTopCategory = $categories->firstWhere('id', $subParent->parent_id);
                }
            }

            if (!$currentTopCategory && $categories->isNotEmpty()) {
                $currentTopCategory = $categories->firstWhere('slug', $currentCategory->slug);
            }

            if ($currentTopCategory) {
                $subcategoryTabs = AuctionCategory::where('parent_id', $currentTopCategory->id)
                    ->whereNull('sub_category_id')
                    ->orderBy('name')
                    ->get()
                    ->filter(fn ($category) => $categoryHasListings($category->id))
                    ->values();

                if (!is_null($currentCategory->parent_id) && is_null($currentCategory->sub_category_id)) {
                    $currentSubcategory = $currentCategory;
                } elseif (!is_null($currentCategory->sub_category_id)) {
                    $currentSubcategory = AuctionCategory::find($currentCategory->sub_category_id);
                }

                if ($currentSubcategory) {
                    $childCategoryTabs = AuctionCategory::where('parent_id', $currentTopCategory->id)
                        ->where('sub_category_id', $currentSubcategory->id)
                        ->orderBy('name')
                        ->get()
                        ->filter(fn ($category) => $categoryHasListings($category->id))
                        ->values();
                }
            }
        }

        if ($featured) {
            $query->where('featured_name', $featured);
        }

        // Status filtering (e.g., ending_soon if logic existed before)
        // ... (preserving placeholder for status logic)

        // Brands filtering
        $brands = $request->input('brands');
        if (!empty($brands)) {
            $brandArray = is_array($brands) ? $brands : explode(',', $brands);
            $query->where(function($q) use ($brandArray) {
                foreach ($brandArray as $brand) {
                    $q->orWhere('listing_data->brand', 'LIKE', "%{$brand}%");
                }
            });
        }

        // Price filtering
        $minPrice = (float) $request->input('priceMin', 0);
        $maxPrice = (float) $request->input('priceMax', 10000000);
        $query->whereRaw(
            "CAST(COALESCE(
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.reserve_price')), 'null'),
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.minimum_bid')), 'null'),
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')), 'null'),
                '0'
            ) AS DECIMAL(15,2)) BETWEEN ? AND ?",
            [$minPrice, $maxPrice]
        );

        // Search filtering
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Type filtering (Marketplace Tabs)
        $applyTypeFilter($query);

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $currentCategory,
            'currentTopCategory' => $currentTopCategory,
            'subcategoryTabs' => $subcategoryTabs,
            'currentSubcategory' => $currentSubcategory,
            'childCategoryTabs' => $childCategoryTabs,
            'favoriteListingIds' => $favoriteListingIds,
            'filters' => $request->all(),
        ]);
    }
}
