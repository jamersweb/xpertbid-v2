<?php

namespace App\Http\Controllers\Api\V1\Property;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class PropertyCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $rootId = (int) config('property.root_category_id', 222);

        $root = AuctionCategory::query()
            ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
            ->find($rootId);

        $usedIds = $this->propertyCategoryIdsInUse();

        $subs = AuctionCategory::query()
            ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
            ->where('parent_id', $rootId)
            ->whereNull('sub_category_id')
            ->orderBy('name')
            ->get();

        $subIds = $subs->pluck('id')->all();
        $childrenBySub = $subIds === []
            ? collect()
            : AuctionCategory::query()
                ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
                ->whereIn('sub_category_id', $subIds)
                ->orderBy('name')
                ->get()
                ->groupBy('sub_category_id');

        $mapNode = function (AuctionCategory $cat, array $kids = []) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'image_url' => $cat->image_url,
                'children' => $kids,
            ];
        };

        $hasListings = fn (int $id): bool => $usedIds->has($id);

        $tree = $subs
            ->map(function (AuctionCategory $sub) use ($childrenBySub, $mapNode, $hasListings) {
                $kids = ($childrenBySub->get($sub->id) ?? collect())
                    ->filter(fn (AuctionCategory $child) => $hasListings((int) $child->id))
                    ->map(fn (AuctionCategory $child) => $mapNode($child, []))
                    ->values()
                    ->all();

                // Keep sub if it has its own listings or any child with listings (marketplace behavior).
                if (!$hasListings((int) $sub->id) && $kids === []) {
                    return null;
                }

                return $mapNode($sub, $kids);
            })
            ->filter()
            ->values()
            ->all();

        return response()->json([
            'data' => [
                'id' => $root?->id ?? $rootId,
                'name' => $root?->name ?? 'Property',
                'slug' => $root?->slug ?? 'property',
                'image_url' => $root?->image_url,
                'children' => $tree,
            ],
        ]);
    }

    /**
     * Category / sub / child IDs that appear on browsable property listings.
     *
     * @return Collection<int, true>
     */
    protected function propertyCategoryIdsInUse(): Collection
    {
        $base = Listing::query()->properties();

        $ids = collect()
            ->merge((clone $base)->whereNotNull('category_id')->distinct()->pluck('category_id'))
            ->merge((clone $base)->whereNotNull('sub_category_id')->distinct()->pluck('sub_category_id'))
            ->merge((clone $base)->whereNotNull('child_category_id')->distinct()->pluck('child_category_id'))
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        return $ids->mapWithKeys(fn (int $id) => [$id => true]);
    }
}
