<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class BuyerRequestDemoSeeder extends Seeder
{
    public function run(): void
    {
        $userId = 332;
        $user = User::query()->find($userId);

        if (! $user) {
            $this->command?->error("User #{$userId} not found. Seeder aborted.");

            return;
        }

        $categories = AuctionCategory::query()
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->orderBy('id')
            ->limit(10)
            ->get(['id', 'name']);

        $samples = [
            [
                'title' => 'Looking for iPhone 15 Pro Max 256GB',
                'description' => '<p>Need a new or lightly used iPhone 15 Pro Max (Natural Titanium). Box + charger preferred. Karachi delivery only.</p>',
                'budget' => 285000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'Karachi, Sindh, Pakistan',
            ],
            [
                'title' => 'Office chairs needed — 12 units',
                'description' => '<p>Ergonomic mesh office chairs for a small team. Budget-friendly bulk quote welcome. Must deliver within 7 days.</p>',
                'budget' => 180000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'Lahore, Punjab, Pakistan',
            ],
            [
                'title' => 'Used Toyota Corolla 2018–2021',
                'description' => '<p>Looking for a well-maintained Corolla (1.6 or 1.8). Full service history preferred. Cash buyer.</p>',
                'budget' => 4200000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Islamabad',
                'state' => 'Islamabad Capital Territory',
                'location_label' => 'Islamabad, Pakistan',
            ],
            [
                'title' => 'Gaming PC build parts',
                'description' => '<p>Need RTX 4060 / Ryzen 5 level build or equivalent used parts. Willing to buy complete PC as well.</p>',
                'budget' => 220000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'DHA Phase 6, Karachi',
            ],
            [
                'title' => 'Home renovation — tiles & fittings',
                'description' => '<p>Bathroom + kitchen tiles and basic sanitary fittings for a 2-bed flat. Looking for contractor quotes.</p>',
                'budget' => 350000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Rawalpindi',
                'state' => 'Punjab',
                'location_label' => 'Bahria Town, Rawalpindi',
            ],
            [
                'title' => 'MacBook Air M2 13"',
                'description' => '<p>Prefer official warranty remaining. Silver or Starlight. Pickup in Lahore possible.</p>',
                'budget' => 245000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'Gulberg, Lahore',
            ],
            [
                'title' => 'Warehouse packing materials (bulk)',
                'description' => '<p>Carton boxes, bubble wrap, and packing tape for e-commerce fulfillment. Monthly supply preferred.</p>',
                'budget' => 95000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Faisalabad',
                'state' => 'Punjab',
                'location_label' => 'Faisalabad, Punjab, Pakistan',
            ],
            [
                'title' => 'LED TV 55" 4K Smart',
                'description' => '<p>Samsung / LG / TCL 55 inch 4K. New sealed only. Installation in Karachi.</p>',
                'budget' => 160000,
                'status' => BuyerRequest::STATUS_CLOSED,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'North Nazimabad, Karachi',
            ],
            [
                'title' => 'Canon EOS R50 or similar mirrorless',
                'description' => '<p>Entry mirrorless for content creation. Kit lens OK. Must be original with invoice.</p>',
                'budget' => 195000,
                'status' => BuyerRequest::STATUS_OPEN,
                'city' => 'Multan',
                'state' => 'Punjab',
                'location_label' => 'Multan, Punjab, Pakistan',
            ],
            [
                'title' => 'Sofa set 7-seater (fabric)',
                'description' => '<p>Modern L-shape or 7-seater fabric sofa for living room. Grey or beige tones. Delivery + assembly required.</p>',
                'budget' => 275000,
                'status' => BuyerRequest::STATUS_FULFILLED,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'Clifton Block 5, Karachi',
            ],
        ];

        $created = 0;

        foreach ($samples as $index => $sample) {
            $category = $categories[$index % max(1, $categories->count())] ?? null;

            BuyerRequest::query()->create([
                'user_id' => $userId,
                'title' => $sample['title'],
                'slug' => BuyerRequest::uniqueSlugFromTitle($sample['title']),
                'description' => $sample['description'],
                'category_id' => $category?->id,
                'sub_category_id' => null,
                'child_category_id' => null,
                'location_label' => $sample['location_label'],
                'country' => 'Pakistan',
                'state' => $sample['state'],
                'city' => $sample['city'],
                'budget' => $sample['budget'],
                'latitude' => null,
                'longitude' => null,
                'status' => $sample['status'],
                'closed_at' => in_array($sample['status'], [
                    BuyerRequest::STATUS_CLOSED,
                    BuyerRequest::STATUS_FULFILLED,
                ], true) ? now() : null,
            ]);

            $created++;
        }

        $this->command?->info("Created {$created} buyer requests for user #{$userId} ({$user->name}).");
    }
}
