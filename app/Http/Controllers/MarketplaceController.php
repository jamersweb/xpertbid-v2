<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index(Request $request, $slug = null)
    {
        $query = Auction::where('status', 'active')->with(['user', 'category', 'bids']);

        // Handle category filter from slug or query param
        $activeSlug = $slug ?? $request->input('category');
        $currentCategory = null;

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

        // Status filtering
        $status = $request->input('status', []);
        if (!empty($status)) {
            // Note: status 'active' is already enforced, but client might send 'ending_soon' etc.
            // Original code has mapping or logic for these.
        }

        // Brands filtering
        $brands = $request->input('brands');
        if (!empty($brands)) {
            $brandArray = is_array($brands) ? $brands : explode(',', $brands);
            $query->whereIn('brand', $brandArray); // Assuming 'brand' column exists
        }

        // Price filtering
        $minPrice = $request->input('priceMin', 0);
        $maxPrice = $request->input('priceMax', 10000000);
        $query->where('reserve_price', '>=', $minPrice)
              ->where('reserve_price', '<=', $maxPrice);

        // Search filtering
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Type filtering (Marketplace Tabs: Auction vs Normal)
        $type = $request->input('type', 'auction'); // Default to auction view
        if ($type === 'auction') {
            $query->where('list_type', 'auction');
        } elseif ($type === 'normal_list' || $type === 'normal') {
            $query->where('list_type', 'normal_list');
        }

        $products = $query->paginate(12)->withQueryString();

        // Fetch only categories that have active auctions (directly or via sub/child categories)
        $categories = AuctionCategory::with(['subCategories' => function ($q) {
            $q->whereHas('auctions', function ($q2) {
                $q2->where('status', 'active');
            })->orWhereHas('childCategories.auctions', function ($q2) {
                $q2->where('status', 'active');
            })->with(['childCategories' => function ($q3) {
                $q3->whereHas('auctions', function ($q4) {
                    $q4->where('status', 'active');
                });
            }]);
        }])
        ->where(function ($query) {
            $query->whereHas('auctions', function ($q) {
                $q->where('status', 'active');
            })
            ->orWhereHas('subCategories.auctions', function ($q) {
                $q->where('status', 'active');
            })
            ->orWhereHas('subCategories.childCategories.auctions', function ($q) {
                $q->where('status', 'active');
            });
        })
        ->where('parent_id', null)
        ->get();

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $currentCategory,
            'filters' => $request->all(),
        ]);
    }
}
