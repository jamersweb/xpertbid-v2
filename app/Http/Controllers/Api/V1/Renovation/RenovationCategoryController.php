<?php

namespace App\Http\Controllers\Api\V1\Renovation;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use Illuminate\Http\JsonResponse;

class RenovationCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $rootId = (int) config('renovation.root_category_id', 1163);

        $root = AuctionCategory::query()
            ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
            ->where('id', $rootId)
            ->orWhere('slug', 'like', '%home-renovation%')
            ->first();

        $activeRootId = $root?->id ?? $rootId;

        $subs = AuctionCategory::query()
            ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
            ->where('parent_id', $activeRootId)
            ->whereNull('sub_category_id')
            ->orderBy('id')
            ->get();

        $subIds = $subs->pluck('id')->all();
        $childrenBySub = $subIds === []
            ? collect()
            : AuctionCategory::query()
                ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
                ->whereIn('sub_category_id', $subIds)
                ->orderBy('id')
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

        $tree = $subs
            ->map(function (AuctionCategory $sub) use ($childrenBySub, $mapNode) {
                $kids = ($childrenBySub->get($sub->id) ?? collect())
                    ->map(fn (AuctionCategory $child) => $mapNode($child, []))
                    ->values()
                    ->all();

                return $mapNode($sub, $kids);
            })
            ->values()
            ->all();

        return response()->json([
            'data' => [
                'id' => $root?->id ?? $activeRootId,
                'name' => $root?->name ?? 'Home Renovation',
                'slug' => $root?->slug ?? 'home-renovation',
                'image_url' => $root?->image_url,
                'children' => $tree,
            ],
        ]);
    }
}
