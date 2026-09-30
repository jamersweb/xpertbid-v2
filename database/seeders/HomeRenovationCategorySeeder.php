<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HomeRenovationCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hierarchy = [
            'Kitchen Renovation' => [
                'Kitchen Cabinets',
                'Countertops',
                'Backsplash',
                'Kitchen Flooring',
                'Sinks & Faucets',
                'Kitchen Lighting',
            ],
            'Bathroom Renovation' => [
                'Bathroom Tiles',
                'Bathtubs',
                'Showers',
                'Vanities',
                'Toilets',
                'Bathroom Fixtures',
                'Bathroom Lighting',
            ],
            'Living Room' => [
                'Flooring',
                'Wall Design',
                'False Ceiling',
                'TV Wall',
                'Lighting',
                'Built-in Cabinets',
            ],
            'Bedroom Renovation' => [
                'Flooring',
                'Wardrobes',
                'Ceiling',
                'Wall Design',
                'Lighting',
                'Doors',
            ],
            'Flooring' => [
                'Tiles',
                'Marble',
                'Granite',
                'Vinyl',
                'Laminate',
                'Wooden Flooring',
                'Carpet',
            ],
            'Painting & Wall Finishes' => [
                'Interior Painting',
                'Exterior Painting',
                'Wallpaper',
                'Texture Paint',
                'Decorative Walls',
            ],
            'Ceiling' => [
                'False Ceiling',
                'Gypsum Ceiling',
                'PVC Ceiling',
                'Ceiling Panels',
                'Ceiling Lighting',
            ],
            'Doors & Windows' => [
                'Main Doors',
                'Interior Doors',
                'Sliding Doors',
                'Windows',
                'Glass Doors',
                'Door Hardware',
            ],
            'Electrical & Lighting' => [
                'Wiring',
                'Switches & Sockets',
                'LED Lighting',
                'Chandeliers',
                'Smart Lighting',
                'Electrical Panels',
            ],
            'Plumbing' => [
                'Water Supply',
                'Drainage',
                'Pipe Installation',
                'Water Heaters',
                'Plumbing Fixtures',
            ],
            'Roofing' => [
                'Roof Repair',
                'Roof Replacement',
                'Waterproofing',
                'Roof Insulation',
                'Roof Tiles',
            ],
            'Outdoor & Exterior' => [
                'Facade Renovation',
                'Landscaping',
                'Garden',
                'Driveway',
                'Patio',
                'Outdoor Lighting',
            ],
            'Stairs & Railings' => [
                'Staircase Renovation',
                'Wooden Stairs',
                'Marble Stairs',
                'Glass Railings',
                'Metal Railings',
            ],
            'Carpentry & Woodwork' => [
                'Custom Furniture',
                'Cabinets',
                'Wardrobes',
                'Shelving',
                'Wooden Panels',
                'Built-ins',
            ],
            'HVAC & Climate' => [
                'AC Installation',
                'AC Replacement',
                'Ductwork',
                'Ventilation',
                'Heating Systems',
            ],
            'Smart Home' => [
                'Smart Lighting',
                'Smart Locks',
                'Security Cameras',
                'Smart Thermostats',
                'Home Automation',
            ],
            'Insulation & Waterproofing' => [
                'Wall Insulation',
                'Roof Insulation',
                'Soundproofing',
                'Bathroom Waterproofing',
                'Basement Waterproofing',
            ],
            'Structural Renovation' => [
                'Wall Removal',
                'Room Extensions',
                'Structural Repairs',
                'Foundation Repairs',
                'Floor Plan Changes',
            ],
            'Basement & Garage' => [
                'Basement Finishing',
                'Basement Flooring',
                'Garage Flooring',
                'Garage Doors',
                'Storage Solutions',
            ],
            'Cleaning & Finishing' => [
                'Post-Renovation Cleaning',
                'Deep Cleaning',
                'Window Cleaning',
                'Final Finishing',
            ],
        ];

        DB::transaction(function () use ($hierarchy) {
            $this->command?->info('Seeding Home Renovation category hierarchy into AuctionCategory and Category tables...');

            // -------------------------------------------------------------
            // 1. Seed into AuctionCategory (used by Marketplace, Sell form, Navbar)
            // -------------------------------------------------------------
            $parentAuctionCategory = AuctionCategory::withTrashed()
                ->where('name', 'Home Renovation')
                ->whereNull('parent_id')
                ->first();

            if ($parentAuctionCategory) {
                if ($parentAuctionCategory->trashed()) {
                    $parentAuctionCategory->restore();
                }
            } else {
                $parentAuctionCategory = AuctionCategory::create([
                    'name' => 'Home Renovation',
                    'slug' => 'home-renovation',
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
            $parentCategory = $this->findOrCreateCategory('Home Renovation', null);
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

            $this->command?->info(" Successfully seeded Home Renovation into both AuctionCategory and Category tables!");
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
