<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\CorporateVerification;
use App\Models\Listing;
use App\Models\Mall;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MallDemoSeeder extends Seeder
{
    /**
     * Seed 20 demo malls, 50 verified corporate sellers, and sample listings.
     */
    public function run(): void
    {
        $mallNames = [
            'City Center Mall',
            'Marina Walk Plaza',
            'Horizon Trade Hub',
            'Pearl Avenue Mall',
            'Skyline Galleria',
            'Oasis Grand Mall',
            'Liberty Square Mall',
            'Metro Central Mall',
            'Emerald Market Mall',
            'Royal Crescent Mall',
            'Summit Retail Park',
            'Harbor View Mall',
            'Palm Grove Plaza',
            'Capital Gate Mall',
            'Unity Shopping Hub',
            'Nova Lifestyle Mall',
            'Golden Arc Mall',
            'Frontier Trade Mall',
            'Crystal Bay Mall',
            'Atlas Prestige Mall',
        ];

        $malls = collect();

        foreach ($mallNames as $index => $name) {
            $slug = Str::slug($name);
            $mall = Mall::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'logo' => null,
                    'status' => 'active',
                ]
            );
            $malls->push($mall);
            $this->command?->info(sprintf('Mall %d/20: %s', $index + 1, $name));
        }

        $category = AuctionCategory::query()
            ->whereNull('parent_id')
            ->orderBy('id')
            ->first();

        if (!$category) {
            $category = AuctionCategory::create([
                'name' => 'General',
                'image' => 'https://picsum.photos/id/1015/1200/800.jpg',
            ]);
        }

        $entityTypes = ['Private Limited', 'LLC', 'Partnership', 'Sole Proprietor'];
        $listingTypes = ['normal', 'auction', 'business'];

        // Varied A–Z company names so the alphabet "All" view shows multiple letter groups.
        $companyNames = [
            'Apex Trading Co',
            'Blue Harbor Ltd',
            'Crystal Goods Inc',
            'Delta Retail Group',
            'Evergreen Supplies',
            'Frontier Merchants',
            'Golden Leaf Co',
            'Horizon Traders',
            'Ivory Market Ltd',
            'Jade Commerce Hub',
            'Keen Value Stores',
            'Lumina Wholesale',
            'Maple Ridge Co',
            'Nova Prime Retail',
            'Orion Sales Group',
            'Pearl Anchor Ltd',
            'Quantum Dealers',
            'Royal Path Trading',
            'Summit Bazaar Co',
            'True North Goods',
            'Unity Vendors Ltd',
            'Vertex Market Co',
            'Willow Trade House',
            'Xenon Retailers',
            'Yellow Gate Co',
            'Zenith Sellers Ltd',
            'Amber Grove Inc',
            'Bright Axis Ltd',
            'Cedar Point Co',
            'Driftwood Mart',
            'Echo Valley Traders',
            'Falcon Peak Co',
            'Grove Street Goods',
            'Harbor Light Ltd',
            'Ironclad Retail',
            'Juniper Sales Co',
            'Keystone Vendors',
            'Larkspur Trading',
            'Moonlight Merchants',
            'Northwind Stores',
            'Oak & Pine Co',
            'Pioneer Bazaar',
            'Quill & Coin Ltd',
            'Riverstone Retail',
            'Silverline Traders',
            'Timberland Goods',
            'Urban Nest Co',
            'Vivid Cart Ltd',
            'Westbridge Market',
            'Yarrow Trading Co',
        ];

        for ($i = 1; $i <= 50; $i++) {
            $mall = $malls[($i - 1) % $malls->count()];
            $email = "mall-demo-user-{$i}@example.com";
            $companyName = $companyNames[$i - 1];
            $personName = preg_replace('/\s+(Co|Ltd|Inc|Group|Hub|House|Mart|Stores|Retailers|Vendors|Dealers|Merchants|Goods|Supplies|Sales|Retail|Trading|Wholesale|Bazaar|Market).*$/i', '', $companyName);
            $personName = trim($personName) ?: "Seller {$i}";

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $personName,
                    'username' => "mall_seller_{$i}",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => 'user',
                    'status' => 'enable',
                    'company_name' => $companyName,
                    'profile_pic' => '/assets/images/user.jpg',
                    'phone' => '0300' . str_pad((string) $i, 7, '0', STR_PAD_LEFT),
                ]
            );

            CorporateVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'legal_entity_name' => $companyName,
                    'registered_address' => "Office {$i}, {$mall->name}, Demo City",
                    'date_of_incorporation' => now()->subYears(rand(2, 12))->toDateString(),
                    'entity_type' => $entityTypes[($i - 1) % count($entityTypes)],
                    'business_documents' => ['assets/images/corporate_verifications/demo-placeholder.pdf'],
                    'country' => 'Pakistan',
                    'mall_id' => $mall->id,
                    'status' => 'verified',
                    'decline_reason' => null,
                ]
            );

            // 1–3 active listings per seller so AuctionCards appear on the mall page.
            $listingCount = ($i % 3) + 1;
            $localBanners = [
                '/assets/images/WebsiteBanner1.png',
                '/assets/images/WebsiteBanner2.png',
                '/assets/images/WebsiteBanner3.png',
                '/assets/images/Final_Banner.png',
                '/assets/images/WEBSITE-BANNER_V3.jpg',
            ];
            for ($l = 1; $l <= $listingCount; $l++) {
                $title = "{$companyName} Product {$l}";
                $slug = Str::slug($title) . '-' . $user->id . '-' . $l;
                $cover = $localBanners[($i + $l) % count($localBanners)];
                $listingType = $listingTypes[($i + $l) % count($listingTypes)];

                Listing::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'user_id' => $user->id,
                        'category_id' => $category->id,
                        'listing_type' => $listingType,
                        'title' => $title,
                        'description' => "Demo listing for {$companyName} at {$mall->name}. Safe to delete later.",
                        'status' => 'active',
                        'image' => $cover,
                        'album' => [$cover],
                        'listing_data' => [
                            'price' => 5000 + ($i * 250) + ($l * 100),
                            'minimum_bid' => 1000 + ($i * 50),
                            'buy_now_price' => 5000 + ($i * 250) + ($l * 100),
                            'start_price' => 1000 + ($i * 50),
                            'stock' => rand(1, 20),
                            'product_condition' => 'New',
                            'city' => 'Demo City',
                            'image' => $cover,
                            'album' => [$cover],
                        ],
                    ]
                );
            }

            if ($i % 10 === 0) {
                $this->command?->info("Seeded {$i}/50 mall demo sellers...");
            }
        }

        $this->command?->info('Mall demo seed complete: 20 malls, 50 verified sellers, sample listings.');
        $this->command?->info('Open /malls to preview. Demo login emails: mall-demo-user-1@example.com / password');
    }
}
