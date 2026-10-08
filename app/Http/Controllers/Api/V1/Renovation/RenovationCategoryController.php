<?php

namespace App\Http\Controllers\Api\V1\Renovation;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use Illuminate\Http\JsonResponse;

class RenovationCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $renovationRoot = $this->resolveRootCategory(
            (int) config('renovation.root_category_id'),
            '%home-renovation%'
        );

        $builderRoot = $this->resolveRootCategory(
            (int) config('renovation.builder_root_category_id'),
            '%home-builder%'
        );

        $roots = collect([$renovationRoot, $builderRoot])->filter()->unique('id');

        $mainTrees = $roots->map(function (AuctionCategory $root) {
            return $this->buildTreeForRoot($root);
        })->values()->all();

        $primaryTree = $mainTrees[0] ?? [
            'id' => (int) config('renovation.root_category_id'),
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

    protected function resolveRootCategory(int $id, string $slugPattern): ?AuctionCategory
    {
        $needle = strtolower(trim($slugPattern, '%'));
        $nameNeedle = str_replace('-', ' ', $needle);

        // Prefer real root categories by slug/name so wrong env IDs
        // (common across local vs live DBs) cannot break the header nav.
        $bySlugOrName = AuctionCategory::query()
            ->whereNull('parent_id')
            ->where(function ($q) use ($slugPattern, $nameNeedle) {
                $q->where('slug', 'like', $slugPattern)
                    ->orWhere('name', 'like', '%'.$nameNeedle.'%');
            })
            ->orderBy('id')
            ->first();

        if ($bySlugOrName) {
            return $bySlugOrName;
        }

        if ($id > 0) {
            $byId = AuctionCategory::query()->find($id);
            if (
                $byId
                && $byId->parent_id === null
                && (
                    str_contains(strtolower((string) $byId->slug), $needle)
                    || str_contains(strtolower((string) $byId->name), $nameNeedle)
                )
            ) {
                return $byId;
            }
        }

        return null;
    }

    protected function buildTreeForRoot(AuctionCategory $root): array
    {
        $subs = AuctionCategory::query()
            ->select([
                'id',
                'name',
                'slug',
                'parent_id',
                'sub_category_id',
                'image',
                'meta_title',
                'meta_description',
                'schema_markup',
            ])
            ->where('parent_id', $root->id)
            ->whereNull('sub_category_id')
            ->orderBy('id')
            ->get();

        $subIds = $subs->pluck('id')->all();
        $childrenBySub = $subIds === []
            ? collect()
            : AuctionCategory::query()
                ->select([
                'id',
                'name',
                'slug',
                'parent_id',
                'sub_category_id',
                'image',
                'meta_title',
                'meta_description',
                'schema_markup',
            ])
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
                'meta_title' => $cat->meta_title,
                'meta_description' => $cat->meta_description,
                'schema_markup' => $cat->schema_markup,
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
            'meta_title' => $root->meta_title,
            'meta_description' => $root->meta_description,
            'schema_markup' => $root->schema_markup,
            'children' => $tree,
        ];
    }
}
