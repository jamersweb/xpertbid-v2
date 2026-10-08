<?php

namespace App\Http\Controllers\Api\V1\Renovation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Renovation\RenovationIndexRequest;
use App\Http\Resources\Api\V1\Renovation\RenovationCardResource;
use App\Http\Resources\Api\V1\Renovation\RenovationDetailResource;
use App\Models\AuctionCategory;
use App\Models\Listing;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RenovationController extends Controller
{
    private const CARD_RELATIONS = [
        'category:id,name,slug',
        'subCategory:id,name,slug',
        'childCategory:id,name,slug',
        'city:id,name',
        'state:id,name',
        'country:id,name',
        'user:id,name,profile_pic',
    ];

    public function index(RenovationIndexRequest $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->input('per_page', 12);
        $query = Listing::query()->renovations()->with(self::CARD_RELATIONS);

        $this->applyFilters($query, $request);
        $this->applySort($query, $request->input('sort', 'latest'));

        $paginator = $query->paginate($perPage)->appends($request->validated());

        return RenovationCardResource::collection($paginator);
    }

    public function featured(Request $request): JsonResponse
    {
        $limit = min(24, max(1, (int) $request->input('limit', 8)));

        $items = Listing::query()
            ->renovations()
            ->with(self::CARD_RELATIONS)
            ->where('featured_name', config('renovation.featured_name'))
            ->latest('id')
            ->limit($limit)
            ->get();

        // Fallback to latest if no featured items marked
        if ($items->isEmpty()) {
            $items = Listing::query()
                ->renovations()
                ->with(self::CARD_RELATIONS)
                ->latest('id')
                ->limit($limit)
                ->get();
        }

        return response()->json([
            'data' => RenovationCardResource::collection($items)->resolve(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $listing = Listing::query()
            ->renovations()
            ->with(self::CARD_RELATIONS)
            ->where('slug', $slug)
            ->firstOrFail();

        $listing->increment('views');

        return response()->json([
            'data' => (new RenovationDetailResource($listing))->resolve(),
        ]);
    }

    public function related(string $slug): JsonResponse
    {
        $listing = Listing::query()
            ->renovations()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Listing::query()
            ->renovations()
            ->with(self::CARD_RELATIONS)
            ->where('id', '!=', $listing->id)
            ->where(function (Builder $q) use ($listing) {
                $matched = false;
                if ($listing->sub_category_id) {
                    $q->orWhere('sub_category_id', $listing->sub_category_id);
                    $matched = true;
                }
                if ($listing->child_category_id) {
                    $q->orWhere('child_category_id', $listing->child_category_id);
                    $matched = true;
                }
                if ($listing->city_id) {
                    $q->orWhere('city_id', $listing->city_id);
                    $matched = true;
                }
                if (!$matched) {
                    $q->whereRaw('1 = 1');
                }
            })
            ->latest('id')
            ->limit(8)
            ->get();

        return response()->json([
            'data' => RenovationCardResource::collection($related)->resolve(),
        ]);
    }

    public function sitemapSlugs(Request $request): JsonResponse
    {
        $perPage = min(500, max(1, (int) $request->input('per_page', 200)));

        $paginator = Listing::query()
            ->renovations()
            ->select(['id', 'slug', 'updated_at'])
            ->orderBy('id')
            ->paginate($perPage);

        $items = collect($paginator->items())->map(fn (Listing $l) => [
            'slug' => $l->slug,
            'updated_at' => optional($l->updated_at)?->toIso8601String(),
        ]);

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    protected function applyFilters(Builder $query, RenovationIndexRequest $request): void
    {
        if ($q = $request->input('q')) {
            $query->where(function (Builder $sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($cityId = $request->input('city_id')) {
            $query->where('city_id', (int) $cityId);
        } elseif ($city = $request->input('city')) {
            $query->whereHas('city', fn (Builder $c) => $c->where('name', 'like', "%{$city}%"));
        }

        if ($stateId = $request->input('state_id')) {
            $query->where('state_id', (int) $stateId);
        }

        if ($countryId = $request->input('country_id')) {
            $query->where('country_id', (int) $countryId);
        }

        if ($listingType = $request->input('listing_type')) {
            if ($listingType === 'normal') {
                $query->whereIn('listing_type', ['normal', 'normal_list']);
            } elseif ($listingType === 'auction') {
                $query->whereIn('listing_type', ['auction', 'live_auction']);
            } else {
                $query->where('listing_type', $listingType);
            }
        }

        // Most-specific category filter wins. Do NOT AND root `type` with
        // sub/child filters — that hides correctly tagged listings.
        if ($request->filled('child_category')) {
            $this->applyCategoryTreeFilter($query, $request->input('child_category'), 'child');
        } elseif ($request->filled('sub_category')) {
            $this->applyCategoryTreeFilter($query, $request->input('sub_category'), 'sub');
        } elseif ($request->filled('category_id')) {
            $this->applyCategoryTreeFilter($query, (int) $request->input('category_id'), 'root');
        } elseif ($request->filled('category')) {
            $this->applyCategoryTreeFilter($query, $request->input('category'), 'root');
        } elseif ($request->filled('type')) {
            $this->applyCategoryTreeFilter($query, $request->input('type'), 'root');
        }

        if ($request->filled('price_min')) {
            $min = (float) $request->input('price_min');
            $query->where(function (Builder $b) use ($min) {
                $b->whereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')) AS DECIMAL(15,2)) >= ?", [$min])
                    ->orWhereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.buy_now_price')) AS DECIMAL(15,2)) >= ?", [$min])
                    ->orWhereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.start_price')) AS DECIMAL(15,2)) >= ?", [$min]);
            });
        }

        if ($request->filled('price_max')) {
            $max = (float) $request->input('price_max');
            $query->where(function (Builder $b) use ($max) {
                $b->whereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')) AS DECIMAL(15,2)) <= ?", [$max])
                    ->orWhereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.buy_now_price')) AS DECIMAL(15,2)) <= ?", [$max])
                    ->orWhereRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.start_price')) AS DECIMAL(15,2)) <= ?", [$max]);
            });
        }

        if ($request->filled('service_type')) {
            $type = $request->input('service_type');
            $query->where(function (Builder $b) use ($type) {
                $b->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.service_type')) = ?", [$type])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(category_features, '$.service_type')) = ?", [$type]);
            });
        }

        if ($request->filled('featured')) {
            $featured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
            if ($featured) {
                $query->where('featured_name', config('renovation.featured_name'));
            }
        }
    }

    /**
     * Filter listings by a category node and its descendants.
     *
     * @param  'root'|'sub'|'child'  $level
     */
    protected function applyCategoryTreeFilter(Builder $query, mixed $value, string $level): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $category = $this->resolveCategory($value);
        if (! $category) {
            $query->whereRaw('1 = 0');

            return;
        }

        $ids = $this->categoryTreeIds($category, $level);
        if ($ids === []) {
            $query->whereRaw('1 = 0');

            return;
        }

        $query->where(function (Builder $q) use ($ids) {
            $q->whereIn('category_id', $ids)
                ->orWhereIn('sub_category_id', $ids)
                ->orWhereIn('child_category_id', $ids);
        });
    }

    protected function resolveCategory(mixed $value): ?AuctionCategory
    {
        if (is_numeric($value)) {
            return AuctionCategory::query()->find((int) $value);
        }

        $slug = trim((string) $value);
        if ($slug === '') {
            return null;
        }

        return AuctionCategory::query()
            ->where(function (Builder $q) use ($slug) {
                $q->where('slug', $slug)
                    ->orWhere('slug', 'like', $slug.'-p%')
                    ->orWhere('slug', 'like', $slug.'-s%')
                    ->orWhere('name', $slug)
                    ->orWhere('name', 'like', '%'.str_replace('-', ' ', $slug).'%');
            })
            ->orderByRaw('CASE WHEN slug = ? THEN 0 WHEN slug LIKE ? THEN 1 ELSE 2 END', [$slug, $slug.'-%'])
            ->first();
    }

    /**
     * @param  'root'|'sub'|'child'  $level
     * @return list<int>
     */
    protected function categoryTreeIds(AuctionCategory $category, string $level): array
    {
        $ids = [(int) $category->id];

        if ($level === 'child') {
            return $ids;
        }

        if ($level === 'sub') {
            $childIds = AuctionCategory::query()
                ->where('sub_category_id', $category->id)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();

            return array_values(array_unique(array_merge($ids, $childIds)));
        }

        // Root vertical (Home Renovation / Home Builder): include all subs + children.
        $subIds = AuctionCategory::query()
            ->where('parent_id', $category->id)
            ->whereNull('sub_category_id')
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

    protected function applySort(Builder $query, string $sort): void
    {
        switch ($sort) {
            case 'price_asc':
                $query->orderByRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')) AS DECIMAL(15,2)) ASC");
                break;
            case 'price_desc':
                $query->orderByRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.price')) AS DECIMAL(15,2)) DESC");
                break;
            case 'views':
                $query->orderByDesc('views');
                break;
            case 'featured':
                $query->orderByRaw("CASE WHEN featured_name = ? THEN 1 ELSE 0 END DESC", [config('renovation.featured_name')])
                    ->latest('id');
                break;
            case 'latest':
            default:
                $query->latest('id');
                break;
        }
    }
}
