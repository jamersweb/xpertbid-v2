<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HomeBuilderCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hierarchy = [
            'Raw Construction Materials' => [
                'Cement & Binding Agents',
                'Bricks & Solid/Hollow Blocks',
                'Steel & Rebar (Saria)',
                'Sand, Gravel & Aggregates',
                'Soil & Landfill Earth',
            ],
            'Roofing & Structural Framing' => [
                'Roofing Sheets',
                'Roof Tiles & Khaprail',
                'Precast Slabs & Girders',
                'Structural Steel & Channels',
                'Waterproofing Membranes',
            ],
            'Pipes, Plumbing & Drainage' => [
                'PPRC Hot & Cold Pipes',
                'PVC & UPVC Sewerage Pipes',
                'Water Storage Tanks',
                'Water Pumps & Motors',
                'Septic Tanks & Drainage Fittings',
            ],
            'Electrical Rough-in & Wiring' => [
                'Electrical Cables & Wires',
                'PVC Conduits & Junction Boxes',
                'Main DBs & Circuit Breakers',
                'Earthing & Grounding Accessories',
                'Switch Back Boxes & Fan Hooks',
            ],
            'Doors, Windows & Fabrication' => [
                'Steel & GI Door Frames (Chokhats)',
                'Aluminium & UPVC Windows',
                'Main Gates & Security Grills',
                'Shuttering Wood & Plywood Boards',
                'Boundary Wall Railings & Mesh',
            ],
            'Construction Machinery & Tools' => [
                'Concrete Mixers & Vibrators',
                'Scaffolding & Steel Shuttering',
                'Excavators & Earth Moving Equipment',
                'Lifting Hoists & Wheelbarrows',
                'Demolition Hammers & Concrete Cutters',
            ],
            'Construction Chemicals & Adhesives' => [
                'Waterproofing Compounds & Slurry',
                'Concrete Admixtures & Plasticizers',
                'Termite Control Chemicals',
                'High-Bond Tile Adhesive & Grouts',
                'Wall Putty & Plaster Bonding Agents',
            ],
            'Contractors & Building Services' => [
                'Grey Structure Contractors',
                'Complete Turnkey House Builders',
                'Architects & 3D Floor Plan Designers',
                'Excavation & Demolition Contractors',
                'Soil Testing & Survey Services',
            ],
        ];

        DB::transaction(function () use ($hierarchy) {
            $this->command?->info('Seeding Home Builder category hierarchy into AuctionCategory and Category tables...');

            // -------------------------------------------------------------
            // 1. Seed into AuctionCategory (used by Marketplace, Sell form, Navbar)
            // -------------------------------------------------------------
            $parentAuctionCategory = AuctionCategory::withTrashed()
                ->where('name', 'Home Builder')
                ->whereNull('parent_id')
                ->first();

            if ($parentAuctionCategory) {
                if ($parentAuctionCategory->trashed()) {
                    $parentAuctionCategory->restore();
                }
            } else {
                $parentAuctionCategory = AuctionCategory::create([
                    'name' => 'Home Builder',
                    'slug' => 'home-builder',
                    'parent_id' => null,
                    'sub_category_id' => null,
                ]);
            }

            $this->command?->info(" [AuctionCategory - Level 1] Parent Category: {$parentAuctionCategory->name} (ID: {$parentAuctionCategory->id})");

            foreach ($hierarchy as $subName => $children) {
                $subSlug = Str::slug($subName) . '-p' . $parentAuctionCategory->id;

                $subAuctionCategory = AuctionCategory::withTrashed()
                    ->where('name', $subName)
                    ->where('parent_id', $parentAuctionCategory->id)
                    ->whereNull('sub_category_id')
                    ->first();

                if ($subAuctionCategory) {
                    if ($subAuctionCategory->trashed()) {
                        $subAuctionCategory->restore();
                    }
                } else {
                    $subAuctionCategory = AuctionCategory::create([
                        'name' => $subName,
                        'slug' => $subSlug,
                        'parent_id' => $parentAuctionCategory->id,
                        'sub_category_id' => null,
                    ]);
                }

                foreach ($children as $childName) {
                    $childSlug = Str::slug($childName) . '-s' . $subAuctionCategory->id;

                    $childAuctionCategory = AuctionCategory::withTrashed()
                        ->where('name', $childName)
                        ->where('parent_id', $parentAuctionCategory->id)
                        ->where('sub_category_id', $subAuctionCategory->id)
                        ->first();

                    if ($childAuctionCategory) {
                        if ($childAuctionCategory->trashed()) {
                            $childAuctionCategory->restore();
                        }
                    } else {
                        AuctionCategory::create([
                            'name' => $childName,
                            'slug' => $childSlug,
                            'parent_id' => $parentAuctionCategory->id,
                            'sub_category_id' => $subAuctionCategory->id,
                        ]);
                    }
                }
            }

            // -------------------------------------------------------------
            // 2. Seed into Category table (new categories model)
            // -------------------------------------------------------------
            $parentCategory = $this->findOrCreateCategory('Home Builder', null);
            $this->command?->info(" [Category - Level 1] Parent Category: {$parentCategory->name} (ID: {$parentCategory->id})");

            $subCount = 0;
            $childCount = 0;

            foreach ($hierarchy as $subCategoryName => $children) {
                $subCategory = $this->findOrCreateCategory($subCategoryName, $parentCategory);
                $subCount++;

                foreach ($children as $childCategoryName) {
                    $this->findOrCreateCategory($childCategoryName, $subCategory);
                    $childCount++;
                }
            }

            $this->command?->info(" Successfully seeded Home Builder into both AuctionCategory and Category tables!");
            $this->command?->info(" - 1 Parent Category");
            $this->command?->info(" - {$subCount} Subcategories");
            $this->command?->info(" - {$childCount} Child Categories");
        });
    }

    /**
     * Find or create category idempotently with unique slug resolution for Category model.
     */
    protected function findOrCreateCategory(string $name, ?Category $parent = null): Category
    {
        $parentId = $parent?->id;

        $category = Category::withTrashed()
            ->where('name', $name)
            ->where(function ($query) use ($parentId) {
                if ($parentId === null) {
                    $query->whereNull('parent_id');
                } else {
                    $query->where('parent_id', $parentId);
                }
            })
            ->first();

        if ($category) {
            if ($category->trashed()) {
                $category->restore();
            }
            if (!$category->status) {
                $category->status = true;
                $category->save();
            }
            return $category;
        }

        $slug = $this->generateUniqueSlug($name, $parent);

        return Category::create([
            'name' => $name,
            'slug' => $slug,
            'parent_id' => $parentId,
            'status' => true,
        ]);
    }

    /**
     * Generate unique slug for Category model.
     */
    protected function generateUniqueSlug(string $name, ?Category $parent = null): string
    {
        $baseSlug = Str::slug($name);

        if (!Category::withTrashed()->where('slug', $baseSlug)->exists()) {
            return $baseSlug;
        }

        if ($parent) {
            $parentScopedSlug = Str::slug($parent->name . '-' . $name);
            if (!Category::withTrashed()->where('slug', $parentScopedSlug)->exists()) {
                return $parentScopedSlug;
            }
        }

        $counter = 2;
        while (true) {
            $candidate = "{$baseSlug}-{$counter}";
            if (!Category::withTrashed()->where('slug', $candidate)->exists()) {
                return $candidate;
            }
            $counter++;
        }
    }
}
