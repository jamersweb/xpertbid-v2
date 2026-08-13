<?php

namespace App\Http\Controllers\Api\V1\Property;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Property\PropertyIndexRequest;
use App\Http\Resources\Api\V1\Property\PropertyCardResource;
use App\Http\Resources\Api\V1\Property\PropertyDetailResource;
use App\Models\AuctionCategory;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PropertyController extends Controller
{
    private const CARD_RELATIONS = [
        'category:id,name,slug',
        'subCategory:id,name,slug',
        'childCategory:id,name,slug',
        'city:id,name',
        'state:id,name',
        'country:id,name',
        'brand:id,name',
        'user:id,name,profile_pic',
    ];

    public function index(PropertyIndexRequest $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->input('per_page', 12);
        $query = Listing::query()->properties()->with(self::CARD_RELATIONS);

        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'latest'));

        $paginator = $query->paginate($perPage)->appends($request->validated());

        return PropertyCardResource::collection($paginator);
    }

    public function featured(Request $request): JsonResponse
    {
        $limit = min(24, max(1, (int) $request->input('limit', 8)));

        $items = Listing::query()
            ->properties()
            ->with(self::CARD_RELATIONS)
            ->where('featured_name', config('property.featured_name'))
            ->latest('id')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => PropertyCardResource::collection($items)->resolve(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $listing = Listing::query()
            ->properties()
            ->with(self::CARD_RELATIONS)
            ->where('slug', $slug)
            ->firstOrFail();

        $listing->increment('views');

        return response()->json([
            'data' => (new PropertyDetailResource($listing))->resolve(),
        ]);
    }

    public function related(string $slug): JsonResponse
    {
        $listing = Listing::query()
            ->properties()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Listing::query()
            ->properties()
            ->with(self::CARD_RELATIONS)
            ->where('id', '!=', $listing->id)
            ->where(function (Builder $q) use ($listing) {
                $matched = false;
                if ($listing->city_id) {
                    $q->orWhere('city_id', $listing->city_id);
                    $matched = true;
                }
                if ($listing->sub_category_id) {
                    $q->orWhere('sub_category_id', $listing->sub_category_id);
                    $matched = true;
                }
                if (!$matched) {
                    $q->whereRaw('1 = 0');
                }
            })
            ->latest('id')
            ->limit(8)
            ->get();

        return response()->json([
            'data' => PropertyCardResource::collection($related)->resolve(),
        ]);
    }

    public function sitemapSlugs(Request $request): JsonResponse
    {
        $perPage = min(500, max(1, (int) $request->input('per_page', 200)));

        $paginator = Listing::query()
            ->properties()
            ->select(['id', 'slug', 'updated_at'])
            ->orderBy('id')
            ->paginate($perPage);

        return response()->json([
            'data' => $paginator->getCollection()->map(fn (Listing $l) => [
                'slug' => $l->slug,
                'updated_at' => optional($l->updated_at)?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    protected function applyFilters(Builder $query, PropertyIndexRequest $request): void
    {
        if ($q = trim((string) $request->input('q', ''))) {
            $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $q) . '%';
            $query->where(function (Builder $inner) use ($like) {
                $inner->where('title', 'like', $like)
                    ->orWhere('description', 'like', $like);
            });
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', (int) $request->input('city_id'));
        } elseif ($city = trim((string) $request->input('city', ''))) {
            $query->whereHas('city', function (Builder $cq) use ($city) {
                $cq->where('name', 'like', $city)
                    ->orWhere('name', 'like', '%' . $city . '%');
            });
        }

        if ($request->filled('state_id')) {
            $query->where('state_id', (int) $request->input('state_id'));
        }

        if ($request->filled('country_id')) {
            $query->where('country_id', (int) $request->input('country_id'));
        }

        if ($type = trim((string) $request->input('type', ''))) {
            $query->where(function (Builder $inner) use ($type) {
                $inner->whereRaw(
                    "JSON_UNQUOTE(JSON_EXTRACT(category_features, '$.property_type')) = ?",
                    [$type]
                )->orWhereRaw(
                    "JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.property_type')) = ?",
                    [$type]
                )->orWhereHas('childCategory', fn (Builder $c) => $c->where('slug', $type)->orWhere('name', $type))
                    ->orWhereHas('subCategory', fn (Builder $c) => $c->where('slug', $type)->orWhere('name', $type));
            });
        }

        if ($purpose = trim((string) $request->input('purpose', ''))) {
            $query->where(function (Builder $inner) use ($purpose) {
                $inner->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(category_features, '$.purpose'))) = ?",
                    [strtolower($purpose)]
                )->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.purpose'))) = ?",
                    [strtolower($purpose)]
                );
            });
        }

        if ($listingType = $request->input('listing_type')) {
            if ($listingType === 'normal') {
                $query->whereIn('listing_type', ['normal', 'normal_list']);
            } elseif ($listingType === 'business') {
                $query->whereIn('listing_type', ['business', 'business_list']);
            } else {
                $query->where('listing_type', $listingType);
            }
        }

        $this->applyCategorySlugFilter($query, 'sub_category', 'sub_category_id', $request->input('sub_category'));
        $this->applyCategorySlugFilter($query, 'child_category', 'child_category_id', $request->input('child_category'));

        $this->applyPriceFilter($query, $request->input('price_min'), $request->input('price_max'));

        if ($request->filled('bedrooms')) {
            $beds = (int) $request->input('bedrooms');
            $query->where(function (Builder $inner) use ($beds) {
                $inner->whereRaw(
                    "CAST(JSON_UNQUOTE(JSON_EXTRACT(category_features, '$.bedrooms')) AS UNSIGNED) = ?",
                    [$beds]
                )->orWhereRaw(
                    "CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.bedrooms')) AS UNSIGNED) = ?",
                    [$beds]
                );
            });
        }

        $featured = $request->input('featured');
        if (in_array($featured, [1, '1', true, 'true'], true)) {
            $query->where('featured_name', config('property.featured_name'));
        }
    }

    protected function applyCategorySlugFilter(Builder $query, string $relationHint, string $column, mixed $value): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (is_numeric($value)) {
            $query->where($column, (int) $value);

            return;
        }

        $slug = (string) $value;
        $id = AuctionCategory::query()
            ->where(function (Builder $q) use ($slug) {
                $q->where('slug', $slug)->orWhere('name', $slug);
            })
            ->value('id');

        if ($id) {
            $query->where($column, $id);
        } else {
            $query->whereRaw('1 = 0');
        }
    }

    protected function applyPriceFilter(Builder $query, mixed $minPriceInput, mixed $maxPriceInput): void
    {
        $hasMin = is_numeric($minPriceInput);
        $hasMax = is_numeric($maxPriceInput);

        if (!$hasMin && !$hasMax) {
            return;
        }

        $minPrice = $hasMin ? (float) $minPriceInput : 0;
        $maxPrice = $hasMax ? (float) $maxPriceInput : 999999999999;

        if ($maxPrice < $minPrice) {
            [$minPrice, $maxPrice] = [$maxPrice, $minPrice];
        }

        $query->whereRaw(
            "CAST(COALESCE(
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.reserve_price')), 'null'),
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.start_price')), 'null'),
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.minimum_bid')), 'null'),
                NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')), 'null'),
                '0'
            ) AS DECIMAL(15,2)) BETWEEN ? AND ?",
            [$minPrice, $maxPrice]
        );
    }

    protected function applySort(Builder $query, ?string $sort): void
    {
        $priceExpr = "CAST(COALESCE(
            NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.reserve_price')), 'null'),
            NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.start_price')), 'null'),
            NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.minimum_bid')), 'null'),
            NULLIF(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')), 'null'),
            '0'
        ) AS DECIMAL(15,2))";

        match ($sort) {
            'price_asc' => $query->orderByRaw("{$priceExpr} ASC")->orderByDesc('id'),
            'price_desc' => $query->orderByRaw("{$priceExpr} DESC")->orderByDesc('id'),
            'featured' => $query
                ->orderByRaw('CASE WHEN featured_name = ? THEN 0 ELSE 1 END', [config('property.featured_name')])
                ->latest('id'),
            default => $query->latest('id'),
        };
    }
}
