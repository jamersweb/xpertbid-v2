<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\AuctionCategory;
use App\Models\Favorite;
use App\Models\DynamicField;
use App\Models\Country;
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

        // Fetch root categories and keep only those branches that actually have listings.
        // This is hierarchy-aware (category_id / sub_category_id / child_category_id).
        $categories = AuctionCategory::with([
            'subCategories' => function ($q) {
                $q->orderBy('name')->with(['childCategories' => function ($q2) {
                    $q2->orderBy('name');
                }]);
            },
        ])
        ->whereNull('parent_id')
        ->whereNull('sub_category_id')
        ->orderBy('name')
        ->get()
        ->map(function ($root) use ($categoryHasListings) {
            $filteredSubs = $root->subCategories
                ->map(function ($sub) use ($categoryHasListings) {
                    $filteredChildren = $sub->childCategories
                        ->filter(fn ($child) => $categoryHasListings($child->id))
                        ->values();

                    $sub->setRelation('childCategories', $filteredChildren);
                    return $sub;
                })
                ->filter(function ($sub) use ($categoryHasListings) {
                    return $categoryHasListings($sub->id) || $sub->childCategories->isNotEmpty();
                })
                ->values();

            $root->setRelation('subCategories', $filteredSubs);
            return $root;
        })
        ->filter(function ($root) use ($categoryHasListings) {
            return $categoryHasListings($root->id) || $root->subCategories->isNotEmpty();
        })
        ->values();

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
                $categoryIds = collect([$currentCategory->id]);
                $subCategoryIds = collect([$currentCategory->id]);
                $childCategoryIds = collect([$currentCategory->id]);

                // Expand selected category into its hierarchy so listings saved with
                // only main+sub (without child) are still matched correctly.
                if (is_null($currentCategory->parent_id) && is_null($currentCategory->sub_category_id)) {
                    $subIds = AuctionCategory::where('parent_id', $currentCategory->id)
                        ->whereNull('sub_category_id')
                        ->pluck('id');

                    $childIds = AuctionCategory::where('parent_id', $currentCategory->id)
                        ->whereNotNull('sub_category_id')
                        ->pluck('id');

                    $subCategoryIds = $subCategoryIds->merge($subIds);
                    $childCategoryIds = $childCategoryIds->merge($childIds);
                } elseif (!is_null($currentCategory->parent_id) && is_null($currentCategory->sub_category_id)) {
                    $childIds = AuctionCategory::where('sub_category_id', $currentCategory->id)
                        ->pluck('id');

                    $childCategoryIds = $childCategoryIds->merge($childIds);
                }

                $categoryIds = $categoryIds->unique()->values();
                $subCategoryIds = $subCategoryIds->unique()->values();
                $childCategoryIds = $childCategoryIds->unique()->values();

                $query->where(function($q) use ($categoryIds, $subCategoryIds, $childCategoryIds) {
                    $q->whereIn('category_id', $categoryIds)
                      ->orWhereIn('sub_category_id', $subCategoryIds)
                      ->orWhereIn('child_category_id', $childCategoryIds);
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
        $minPriceInput = $request->input('priceMin');
        $maxPriceInput = $request->input('priceMax');
        $hasMinPrice = is_numeric($minPriceInput);
        $hasMaxPrice = is_numeric($maxPriceInput);

        if ($hasMinPrice || $hasMaxPrice) {
            $minPrice = $hasMinPrice ? (float) $minPriceInput : 0;
            $maxPrice = $hasMaxPrice ? (float) $maxPriceInput : 999999999999;

            if ($maxPrice < $minPrice) {
                [$minPrice, $maxPrice] = [$maxPrice, $minPrice];
            }

            $query->whereRaw(
                "CAST(COALESCE(
                    NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.reserve_price')), 'null'),
                    NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.minimum_bid')), 'null'),
                    NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')), 'null'),
                    '0'
                ) AS DECIMAL(15,2)) BETWEEN ? AND ?",
                [$minPrice, $maxPrice]
            );
        }

        // Search filtering
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Location filtering
        if ($request->filled('country_id')) {
            $query->where('country_id', $request->input('country_id'));
        }
        if ($request->filled('state_id')) {
            $query->where('state_id', $request->input('state_id'));
        }
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->input('city_id'));
        }

        // Dynamic field filtering (df_<id>=value)
        $dynamicFilterInputs = collect($request->query())
            ->filter(function ($value, $key) {
                return str_starts_with((string) $key, 'df_')
                    && $value !== null
                    && $value !== '';
            });

        if ($dynamicFilterInputs->isNotEmpty()) {
            $fieldIds = $dynamicFilterInputs
                ->keys()
                ->map(fn ($key) => (int) str_replace('df_', '', (string) $key))
                ->filter()
                ->values();

            $dynamicFieldMap = DynamicField::whereIn('id', $fieldIds)->get()->keyBy('id');

            $dynamicFilterInputs->each(function ($value, $key) use ($query, $dynamicFieldMap) {
                $fieldId = (int) str_replace('df_', '', (string) $key);
                if (!$fieldId) {
                    return;
                }

                $field = $dynamicFieldMap->get($fieldId);
                $fieldName = $field?->field_name ? trim((string) $field->field_name) : '';
                $fieldNameWithId = $fieldName !== '' ? "{$fieldName}__{$fieldId}" : '';
                $fieldIdKey = "field_{$fieldId}";
                $values = collect(explode(',', (string) $value))
                    ->map(fn ($item) => trim((string) $item))
                    ->filter(fn ($item) => $item !== '')
                    ->values();

                if ($values->isEmpty()) {
                    return;
                }

                $query->where(function ($fieldQuery) use ($values, $fieldIdKey, $fieldName, $fieldNameWithId) {
                    foreach ($values as $singleValue) {
                        $fieldQuery->orWhere("category_features->{$fieldIdKey}", $singleValue);

                        if ($fieldName !== '') {
                            $fieldQuery->orWhere("category_features->{$fieldName}", $singleValue);
                        }

                        if ($fieldNameWithId !== '') {
                            $fieldQuery->orWhere("category_features->{$fieldNameWithId}", $singleValue);
                        }
                    }
                });
            });
        }

        // Type filtering (Marketplace Tabs)
        $applyTypeFilter($query);

        $listingTypeForFields = $type;
        if (in_array($listingTypeForFields, ['normal', 'normal_list'], true)) {
            $listingTypeForFields = 'normal';
        } elseif (in_array($listingTypeForFields, ['business', 'business_list'], true)) {
            $listingTypeForFields = 'business';
        }

        $dynamicFields = collect();
        if ($currentCategory) {
            $dynamicCategoryIds = collect([$currentCategory->id]);
            if (!is_null($currentCategory->parent_id)) {
                $dynamicCategoryIds->push($currentCategory->parent_id);
            }
            if (!is_null($currentCategory->sub_category_id)) {
                $dynamicCategoryIds->push($currentCategory->sub_category_id);
            }

            $dynamicFields = DynamicField::query()
                ->where(function ($q) use ($dynamicCategoryIds) {
                    $q->whereIn('category_id', $dynamicCategoryIds->unique()->values())
                        ->orWhereNull('category_id');
                })
                ->where(function ($q) use ($listingTypeForFields) {
                    $q->where('listing_type', $listingTypeForFields)
                        ->orWhere('listing_type', 'all');
                })
                ->orderBy('id')
                ->get(['id', 'field_name', 'label', 'input_type', 'options']);
        }

        $countries = Country::query()->select('id', 'name')->orderBy('name')->get();

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
            'countries' => $countries,
            'dynamicFields' => $dynamicFields,
            'filters' => $request->all(),
        ]);
    }
}
