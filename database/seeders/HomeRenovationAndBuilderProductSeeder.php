<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\City;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HomeRenovationAndBuilderProductSeeder extends Seeder
{
    /**
     * Curated high-resolution image sets mapped by topic/keywords.
     */
    private const IMAGE_SETS = [
        'kitchen' => [
            'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
        ],
        'bathroom' => [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80',
        ],
        'flooring' => [
            'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
        ],
        'living_room' => [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=80',
        ],
        'bedroom' => [
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
        ],
        'paint' => [
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1000&q=80',
        ],
        'ceiling' => [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
        ],
        'doors_windows' => [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        ],
        'electrical' => [
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80',
        ],
        'plumbing' => [
            'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
        ],
        'roofing' => [
            'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        ],
        'cement_bricks' => [
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1000&q=80',
        ],
        'steel' => [
            'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        ],
        'machinery' => [
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        ],
        'contractor' => [
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        ],
        'generic_building' => [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
        ],
    ];

    public function run(): void
    {
        $userId = User::query()->value('id') ?? 1;
        $cities = City::query()->limit(10)->get();
        if ($cities->isEmpty()) {
            $cityIds = [1];
        } else {
            $cityIds = $cities->pluck('id')->all();
        }

        $renovationParent = AuctionCategory::where('name', 'Home Renovation')->whereNull('parent_id')->first();
        $builderParent = AuctionCategory::where('name', 'Home Builder')->whereNull('parent_id')->first();

        if (!$renovationParent && !$builderParent) {
            $this->command?->error("Neither Home Renovation nor Home Builder parent category exists. Please run category seeders first.");
            return;
        }

        $targets = [];
        if ($renovationParent) {
            $targets[] = [
                'parent' => $renovationParent,
                'tag' => 'Renovation',
            ];
        }
        if ($builderParent) {
            $targets[] = [
                'parent' => $builderParent,
                'tag' => 'Builder',
            ];
        }

        $totalSeeded = 0;

        DB::transaction(function () use ($targets, $userId, $cityIds, &$totalSeeded) {
            foreach ($targets as $targetInfo) {
                $parent = $targetInfo['parent'];
                $tag = $targetInfo['tag'];

                $this->command?->info("Fetching child categories under {$parent->name} (ID: {$parent->id})...");

                // Get all subcategories
                $subCategories = AuctionCategory::where('parent_id', $parent->id)
                    ->whereNull('sub_category_id')
                    ->get();

                $this->command?->info("Found {$subCategories->count()} subcategories under {$parent->name}.");

                foreach ($subCategories as $sub) {
                    $childCategories = AuctionCategory::where('parent_id', $parent->id)
                        ->where('sub_category_id', $sub->id)
                        ->get();

                    foreach ($childCategories as $child) {
                        for ($i = 1; $i <= 3; $i++) {
                            $productData = $this->generateProductData($parent, $sub, $child, $i, $userId, $cityIds);

                            Listing::create($productData);
                            $totalSeeded++;
                        }
                    }
                }
            }
        });

        $this->command?->info(" Successfully seeded {$totalSeeded} products across all Home Renovation & Home Builder child categories!");
    }

    private function generateProductData(
        AuctionCategory $parent,
        AuctionCategory $sub,
        AuctionCategory $child,
        int $index,
        int $userId,
        array $cityIds
    ): array {
        $cityId = $cityIds[array_rand($cityIds)];
        $images = $this->selectImagesForCategory($sub->name, $child->name);
        $coverImage = $images[0];

        $pricing = $this->determinePricing($sub->name, $child->name, $index);
        $title = $this->generateTitle($sub->name, $child->name, $index);
        $slug = Str::slug($title) . '-' . uniqid();
        $description = $this->generateDescription($title, $sub->name, $child->name, $pricing);

        $hasDiscount = ($index <= 2);
        $discountType = $hasDiscount ? 'percent' : null;
        $discountValue = $hasDiscount ? ($index === 1 ? 15 : 10) : null;
        $originalPrice = $pricing['price'];
        $buyNowPrice = $hasDiscount
            ? round($originalPrice - ($originalPrice * ($discountValue / 100)))
            : $originalPrice;

        return [
            'user_id' => $userId,
            'category_id' => $parent->id,
            'sub_category_id' => $sub->id,
            'child_category_id' => $child->id,
            'title' => $title,
            'slug' => $slug,
            'description' => $description,
            'image' => $coverImage,
            'album' => $images,
            'listing_type' => 'normal',
            'status' => 'active',
            'city_id' => $cityId,
            'listing_data' => [
                'price' => $originalPrice,
                'buy_now_price' => $buyNowPrice,
                'discount_type' => $discountType,
                'discount_value' => $discountValue,
                'stock' => rand(20, 500),
                'unit' => $pricing['unit'],
                'product_condition' => 'new',
                'brand' => $pricing['brand'],
                'warranty' => $pricing['warranty'],
                'delivery' => 'Available across major cities in Pakistan',
            ],
            'category_features' => [
                'sub_category' => $sub->name,
                'child_category' => $child->name,
                'material_grade' => $pricing['grade'] ?? 'Premium Standard',
            ],
        ];
    }

    private function selectImagesForCategory(string $subName, string $childName): array
    {
        $haystack = strtolower($subName . ' ' . $childName);

        if (str_contains($haystack, 'kitchen') || str_contains($haystack, 'cabinet') || str_contains($haystack, 'countertop')) {
            $pool = self::IMAGE_SETS['kitchen'];
        } elseif (str_contains($haystack, 'bath') || str_contains($haystack, 'vanit') || str_contains($haystack, 'shower') || str_contains($haystack, 'toilet')) {
            $pool = self::IMAGE_SETS['bathroom'];
        } elseif (str_contains($haystack, 'floor') || str_contains($haystack, 'tile') || str_contains($haystack, 'marble') || str_contains($haystack, 'granite')) {
            $pool = self::IMAGE_SETS['flooring'];
        } elseif (str_contains($haystack, 'living') || str_contains($haystack, 'wall design') || str_contains($haystack, 'tv wall')) {
            $pool = self::IMAGE_SETS['living_room'];
        } elseif (str_contains($haystack, 'bedroom') || str_contains($haystack, 'wardrobe')) {
            $pool = self::IMAGE_SETS['bedroom'];
        } elseif (str_contains($haystack, 'paint') || str_contains($haystack, 'polish') || str_contains($haystack, 'wallpaper')) {
            $pool = self::IMAGE_SETS['paint'];
        } elseif (str_contains($haystack, 'ceiling') || str_contains($haystack, 'gypsum') || str_contains($haystack, 'pvc')) {
            $pool = self::IMAGE_SETS['ceiling'];
        } elseif (str_contains($haystack, 'door') || str_contains($haystack, 'window') || str_contains($haystack, 'gate') || str_contains($haystack, 'grill')) {
            $pool = self::IMAGE_SETS['doors_windows'];
        } elseif (str_contains($haystack, 'electric') || str_contains($haystack, 'wire') || str_contains($haystack, 'cable') || str_contains($haystack, 'switch') || str_contains($haystack, 'db')) {
            $pool = self::IMAGE_SETS['electrical'];
        } elseif (str_contains($haystack, 'pipe') || str_contains($haystack, 'plumb') || str_contains($haystack, 'drain') || str_contains($haystack, 'pump') || str_contains($haystack, 'tank')) {
            $pool = self::IMAGE_SETS['plumbing'];
        } elseif (str_contains($haystack, 'roof') || str_contains($haystack, 'khaprail') || str_contains($haystack, 'sheet')) {
            $pool = self::IMAGE_SETS['roofing'];
        } elseif (str_contains($haystack, 'cement') || str_contains($haystack, 'brick') || str_contains($haystack, 'block') || str_contains($haystack, 'sand') || str_contains($haystack, 'gravel') || str_contains($haystack, 'soil')) {
            $pool = self::IMAGE_SETS['cement_bricks'];
        } elseif (str_contains($haystack, 'steel') || str_contains($haystack, 'rebar') || str_contains($haystack, 'saria') || str_contains($haystack, 'girder')) {
            $pool = self::IMAGE_SETS['steel'];
        } elseif (str_contains($haystack, 'machine') || str_contains($haystack, 'mixer') || str_contains($haystack, 'scaffold') || str_contains($haystack, 'excavat') || str_contains($haystack, 'shuttering')) {
            $pool = self::IMAGE_SETS['machinery'];
        } elseif (str_contains($haystack, 'contractor') || str_contains($haystack, 'builder') || str_contains($haystack, 'architect') || str_contains($haystack, 'plan')) {
            $pool = self::IMAGE_SETS['contractor'];
        } else {
            $pool = self::IMAGE_SETS['generic_building'];
        }

        shuffle($pool);
        return array_slice($pool, 0, 3);
    }

    private function determinePricing(string $subName, string $childName, int $index): array
    {
        $haystack = strtolower($subName . ' ' . $childName);

        if (str_contains($haystack, 'cement')) {
            $brands = ['Lucky Cement (OPC 53 Grade)', 'Bestway Cement (All Weather)', 'Maple Leaf White Cement'];
            return [
                'price' => 1420 + ($index * 30),
                'unit' => 'Bag (50kg)',
                'brand' => $brands[$index - 1] ?? 'Lucky Cement',
                'warranty' => 'Manufacturer Batch Tested',
                'grade' => 'OPC Grade 53',
            ];
        }

        if (str_contains($haystack, 'steel') || str_contains($haystack, 'saria') || str_contains($haystack, 'rebar')) {
            $brands = ['Amreli Steels (Grade 60)', 'Mughal Steel (Deformed Bars)', 'Ittehad Steel (Prime Quality)'];
            return [
                'price' => 265000 + ($index * 5000),
                'unit' => 'Ton (Metric)',
                'brand' => $brands[$index - 1] ?? 'Amreli Steels',
                'warranty' => 'ASTM A615 Certified',
                'grade' => 'Grade 60 Deformed',
            ];
        }

        if (str_contains($haystack, 'brick') || str_contains($haystack, 'block')) {
            $brands = ['Awwal Class Red Clay Bricks', 'Solid Concrete High-Strength Blocks', 'AAC Lightweight Thermal Blocks'];
            return [
                'price' => 14500 + ($index * 2000),
                'unit' => 'Per 1,000 Pcs',
                'brand' => $brands[$index - 1] ?? 'Standard Kiln Bricks',
                'warranty' => 'Standard Sound / Crush Tested',
                'grade' => 'Awwal Class',
            ];
        }

        if (str_contains($haystack, 'sand') || str_contains($haystack, 'gravel') || str_contains($haystack, 'soil')) {
            $brands = ['Chenab River Washed Sand', 'Margalla Crush (Fine 1/2 Inch)', 'Lawrancepur Fine Coarse Sand'];
            return [
                'price' => 18000 + ($index * 4000),
                'unit' => 'Dumper (800 Cu.Ft)',
                'brand' => $brands[$index - 1] ?? 'Direct Quarry Source',
                'warranty' => 'Silt Free Certified',
                'grade' => 'Screened / Washed',
            ];
        }

        if (str_contains($haystack, 'pipe') || str_contains($haystack, 'plumb') || str_contains($haystack, 'tank')) {
            $brands = ['Master PPRC Premium Pipes', 'Popular UPVC Sewerage System', 'Dura Overhead Triple Layer Tank'];
            return [
                'price' => 3800 + ($index * 1500),
                'unit' => 'Bundle / Piece',
                'brand' => $brands[$index - 1] ?? 'Master Pipes',
                'warranty' => '25 Years Leakproof Guarantee',
                'grade' => 'PN 20 Heavy Duty',
            ];
        }

        if (str_contains($haystack, 'electric') || str_contains($haystack, 'wire') || str_contains($haystack, 'cable') || str_contains($haystack, 'breaker')) {
            $brands = ['Pakistan Cables 99.9% Copper 7/0.029', 'Fast Cables Single Core 3/0.029', 'Schneider Electric MCB DB Set'];
            return [
                'price' => 11500 + ($index * 3200),
                'unit' => 'Coil (90 Meters) / Set',
                'brand' => $brands[$index - 1] ?? 'Pakistan Cables',
                'warranty' => 'Pure Oxygen Free Copper Guaranteed',
                'grade' => 'BSS 6004 Certified',
            ];
        }

        if (str_contains($haystack, 'kitchen')) {
            $brands = ['Italian Acrylic Gloss Kitchen Cabinets', 'UV Matte Finish Modular Kitchen', 'Granite Top Solid Wood Kitchen'];
            return [
                'price' => 185000 + ($index * 45000),
                'unit' => 'Complete Set / Per Rft',
                'brand' => $brands[$index - 1] ?? 'Modern Woodcraft',
                'warranty' => '10 Years Termite & Water Warranty',
                'grade' => 'Imported HDF / Acrylic',
            ];
        }

        if (str_contains($haystack, 'bath') || str_contains($haystack, 'vanit') || str_contains($haystack, 'shower')) {
            $brands = ['Porta Sanitary Luxury Vanity Set', 'Master Imported Rain Shower Unit', 'Grohe Style Concealed Flush Set'];
            return [
                'price' => 28000 + ($index * 9500),
                'unit' => 'Set',
                'brand' => $brands[$index - 1] ?? 'Porta Sanitary',
                'warranty' => '5 Years Mechanism Warranty',
                'grade' => 'Brass Body / Vitreous China',
            ];
        }

        if (str_contains($haystack, 'tile') || str_contains($haystack, 'marble') || str_contains($haystack, 'floor')) {
            $brands = ['Master Full Body Porcelain Tiles 60x120cm', 'Ziarat White Prime Marble Slabs', 'Spanish Matte Finish Floor Tiles 60x60'];
            return [
                'price' => 2450 + ($index * 850),
                'unit' => 'Per Meter / Sq.Ft',
                'brand' => $brands[$index - 1] ?? 'Master Tiles',
                'warranty' => 'Grade A Anti-Scratch Finish',
                'grade' => 'Porcelain Nano Polished',
            ];
        }

        if (str_contains($haystack, 'paint')) {
            $brands = ['Berger Weathercoat Exterior 16L Bucket', 'Nippon EasyWash Interior Emulsion 16L', 'Dulux Velvet Touch Luxury Silk 16L'];
            return [
                'price' => 16500 + ($index * 2500),
                'unit' => '16 Litre Drum',
                'brand' => $brands[$index - 1] ?? 'Berger Paints',
                'warranty' => '7 Years Anti-Fungal Weather Shield',
                'grade' => 'Premium Silk Emulsion',
            ];
        }

        if (str_contains($haystack, 'contractor') || str_contains($haystack, 'builder') || str_contains($haystack, 'architect')) {
            $brands = ['A-Plus Grey Structure Turnkey Package', 'Modern 3D Elevation & Structural Drawing Set', 'Complete Luxury House Construction Service'];
            return [
                'price' => 2400 + ($index * 600),
                'unit' => 'Per Sq.Ft Covered Area',
                'brand' => $brands[$index - 1] ?? 'Xpert Prime Builders',
                'warranty' => 'PEC Registered Engineers & 5 Years Structural Warranty',
                'grade' => 'Turnkey Executive',
            ];
        }

        // Generic fallback
        return [
            'price' => 8500 + ($index * 3500),
            'unit' => 'Unit / Piece',
            'brand' => 'Verified Premium Supplier',
            'warranty' => '1 Year Official Warranty',
            'grade' => 'Industrial Premium',
        ];
    }

    private function generateTitle(string $subName, string $childName, int $index): string
    {
        $variants = [
            1 => "Premium {$childName} (High Durability & Top Grade)",
            2 => "Heavy-Duty {$childName} - Verified Supplier Batch",
            3 => "Custom {$childName} with Installation & Warranty",
        ];

        return $variants[$index] ?? "{$childName} - Model {$index}";
    }

    private function generateDescription(string $title, string $subName, string $childName, array $pricing): string
    {
        return "<p><strong>{$title}</strong> is designed to meet top residential and commercial building specifications in Pakistan.</p>" .
            "<p><strong>Specifications & Highlights:</strong></p>" .
            "<ul>" .
            "<li><strong>Category:</strong> {$subName} &rarr; {$childName}</li>" .
            "<li><strong>Brand / Standard:</strong> {$pricing['brand']}</li>" .
            "<li><strong>Grade:</strong> {$pricing['grade']}</li>" .
            "<li><strong>Unit:</strong> {$pricing['unit']}</li>" .
            "<li><strong>Warranty:</strong> {$pricing['warranty']}</li>" .
            "<li><strong>Condition:</strong> 100% Brand New & Factory Quality Tested</li>" .
            "</ul>" .
            "<p>Fast on-site delivery available in Lahore, Karachi, Islamabad, Rawalpindi, and surrounding cities. Bulk orders qualify for wholesale freight rates.</p>";
    }
}
