<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\Brand;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandPropertyListingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure brand id 1 exists.
        $brand = Brand::find(1);
        if (!$brand) {
            $brand = Brand::forceCreate([
                'id' => 1,
                'name' => 'Demo Property Brand',
                'slug' => 'demo-property-brand',
                'image' => 'https://picsum.photos/id/1011/900/600.jpg',
            ]);
        }

        // Ensure at least one user exists.
        $user = User::query()->orderBy('id')->first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Property Seller',
                'email' => 'property-seller@example.com',
            ]);
        }

        // Ensure one category exists for property listings.
        $category = AuctionCategory::query()
            ->whereNull('parent_id')
            ->orderBy('id')
            ->first();

        if (!$category) {
            $category = AuctionCategory::create([
                'name' => 'Properties',
                'image' => 'https://picsum.photos/id/1025/1200/800.jpg',
            ]);
        }

        $sections = [2, 3, 4, 5]; // 5 means 5+ bedrooms section

        // 16 unique online images (all different)
        $imageIds = [
            1015, 1020, 1024, 1031,
            1035, 1043, 1050, 1067,
            1076, 1084, 1080, 1081,
            1082, 1083, 1085, 1089,
        ];

        $counter = 0;

        foreach ($sections as $bedrooms) {
            for ($i = 1; $i <= 4; $i++) {
                $counter++;
                $title = $brand->name . ' - ' . ($bedrooms === 5 ? '5+ Bedroom' : $bedrooms . ' Bedroom') . ' Property ' . $i;
                $slug = Str::slug($title) . '-' . $counter;

                $coverImage = 'https://picsum.photos/id/' . $imageIds[$counter - 1] . '/1280/820.jpg';
                $album = [
                    $coverImage,
                    'https://picsum.photos/id/' . ($imageIds[$counter - 1] + 30) . '/1280/820.jpg',
                    'https://picsum.photos/id/' . ($imageIds[$counter - 1] + 60) . '/1280/820.jpg',
                ];

                Listing::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'user_id' => $user->id,
                        'category_id' => $category->id,
                        'sub_category_id' => null,
                        'child_category_id' => null,
                        'brand_id' => 1,
                        'listing_type' => 'normal',
                        'title' => $title,
                        'description' => 'Premium property listing for ' . ($bedrooms === 5 ? '5+ bedrooms' : $bedrooms . ' bedrooms') . ' with modern amenities and prime location.',
                        'status' => 'active',
                        'image' => $coverImage,
                        'album' => $album,
                        'listing_data' => [
                            'price' => 100000 + ($counter * 25000),
                            'bedrooms' => $bedrooms,
                            'property_type' => 'Apartment',
                            'city' => 'Dubai',
                            'area_sqft' => 1200 + ($counter * 50),
                        ],
                    ]
                );
            }
        }
    }
}
