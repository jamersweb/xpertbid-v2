<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Listing;
use Illuminate\Support\Str;

$items = [
    [
        'group' => 'Laptop',
        'category_id' => 165,
        'sub_category_id' => 168,
        'child_category_id' => null,
        'condition' => 'Like New',
        'location' => 'Karachi',
        'year' => 2024,
        'images' => [
            ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80'],
        ],
    ],
    [
        'group' => 'Mobile',
        'category_id' => 154,
        'sub_category_id' => 297,
        'child_category_id' => 298,
        'condition' => 'New',
        'location' => 'Lahore',
        'year' => 2025,
        'images' => [
            ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1603898037225-1f7a0fd6d0a2?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1200&q=80'],
        ],
    ],
    [
        'group' => 'Property',
        'category_id' => 222,
        'sub_category_id' => 229,
        'child_category_id' => 1158,
        'condition' => 'Excellent',
        'location' => 'Islamabad',
        'year' => 2026,
        'images' => [
            ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'],
        ],
    ],
    [
        'group' => 'Car',
        'category_id' => 311,
        'sub_category_id' => 312,
        'child_category_id' => 324,
        'condition' => 'Like New',
        'location' => 'Dubai',
        'year' => 2023,
        'images' => [
            ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?auto=format&fit=crop&w=1200&q=80'],
            ['https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'],
        ],
    ],
];

$created = [];
$featuredLimit = 10;
$counter = 0;

foreach ($items as $item) {
    foreach ($item['images'] as $index => $images) {
        $counter++;
        $isAuction = (bool) random_int(0, 1);
        $type = $isAuction ? 'auction' : 'normal';
        $title = $item['group'] . ' Showcase ' . ($index + 1);

        $priceBase = match ($item['group']) {
            'Laptop' => random_int(2800, 7200),
            'Mobile' => random_int(1400, 5200),
            'Property' => random_int(280000, 950000),
            'Car' => random_int(18000, 120000),
            default => random_int(100, 1000),
        };

        if ($isAuction) {
            $listingData = [
                'minimum_bid' => (string) max(1, (int) round($priceBase * 0.7)),
                'start_price' => (string) max(1, (int) round($priceBase * 0.7)),
                'reserve_price' => (string) $priceBase,
                'start_date' => now()->subDays(random_int(0, 2))->toDateTimeString(),
                'end_date' => now()->addDays(random_int(4, 12))->toDateTimeString(),
                'product_condition' => $item['condition'],
                'product_year' => (string) ($item['year'] - random_int(0, 3)),
                'product_location' => $item['location'],
                'album' => $images,
                'image' => $images[0],
                'variations' => [],
            ];
        } else {
            $listingData = [
                'price' => (string) $priceBase,
                'buy_now_price' => (string) $priceBase,
                'product_condition' => $item['condition'],
                'product_year' => (string) ($item['year'] - random_int(0, 2)),
                'product_location' => $item['location'],
                'discount_type' => random_int(0, 1) ? 'percent' : 'flat',
                'discount_value' => random_int(5, 18),
                'album' => $images,
                'image' => $images[0],
                'variations' => [],
            ];
        }

        $categoryFeatures = match ($item['group']) {
            'Laptop' => ['brand' => ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'][$index], 'ram' => [8, 16, 16, 32, 8][$index] . 'GB'],
            'Mobile' => ['brand' => ['Apple', 'Samsung', 'Xiaomi', 'Google', 'OnePlus'][$index], 'storage' => [128, 256, 128, 256, 512][$index] . 'GB'],
            'Property' => ['bedrooms' => (string) random_int(2, 5), 'bathrooms' => (string) random_int(2, 4), 'size_sqft' => (string) random_int(950, 4200)],
            'Car' => ['brand' => ['Honda', 'Toyota', 'BMW', 'Audi', 'Kia'][$index], 'mileage' => (string) random_int(12000, 68000)],
            default => [],
        };

        $listing = Listing::create([
            'user_id' => 1,
            'category_id' => $item['category_id'],
            'sub_category_id' => $item['sub_category_id'],
            'child_category_id' => $item['child_category_id'],
            'listing_type' => $type,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . strtolower(Str::random(8)),
            'image' => $images[0],
            'album' => $images,
            'description' => '<p>' . $title . ' demo listing for marketplace, home sections, and product page testing.</p>',
            'status' => 'active',
            'featured_name' => $counter <= $featuredLimit ? 'home_featured' : null,
            'is_1_rupee' => false,
            'views' => random_int(5, 250),
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ]);

        $created[] = [
            'id' => $listing->id,
            'title' => $listing->title,
            'type' => $listing->listing_type,
            'featured' => $listing->featured_name,
        ];
    }
}

header('Content-Type: application/json');
echo json_encode([
    'created_count' => count($created),
    'featured_count' => count(array_filter($created, fn ($row) => $row['featured'] === 'home_featured')),
    'by_type' => collect($created)->groupBy('type')->map->count(),
    'sample' => array_slice($created, 0, 6),
], JSON_PRETTY_PRINT);
