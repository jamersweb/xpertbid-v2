<?php

namespace App\Http\Controllers\Api\V1\Renovation;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use Illuminate\Http\JsonResponse;

class RenovationCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $renovationRoot = AuctionCategory::query()
            ->where('id', (int) config('renovation.root_category_id', 1163))
            ->orWhere('slug', 'like', '%home-renovation%')
            ->first();

        $builderRoot = AuctionCategory::query()
            ->where('id', 1294)
            ->orWhere('slug', 'like', '%home-builder%')
            ->first();

        $roots = collect([$renovationRoot, $builderRoot])->filter()->unique('id');

        $mainTrees = $roots->map(function (AuctionCategory $root) {
            return $this->buildTreeForRoot($root);
        })->values()->all();

        $primaryTree = $mainTrees[0] ?? [
            'id' => 1163,
            'name' => 'Home Renovation',
            'slug' => 'home-renovation',
            'image_url' => null,
            'children' => [],
        ];

        return response()->json([
            'data' => array_merge($primaryTree, [
                'main_categories' => $mainTrees,
            ]),
        ]);
    }

    protected function buildTreeForRoot(AuctionCategory $root): array
    {
        $subs = AuctionCategory::query()
            ->select(['id', 'name', 'slug', 'parent_id', 'sub_category_id', 'image'])
            ->where('parent_id', $root->id)
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

        return [
            'id' => $root->id,
            'name' => $root->name,
            'slug' => $root->slug,
            'image_url' => $root->image_url,
            'children' => $tree,
        ];
    }
}
