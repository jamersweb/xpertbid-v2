<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use App\Models\BuyerRequest;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;

class BuyerRequestSiteDemoSeeder extends Seeder
{
    public function run(): void
    {
        $userId = 332;
        $user = User::query()->find($userId);

        if (! $user) {
            $user = User::query()->orderByDesc('id')->first();
            $userId = (int) ($user?->id ?? 0);
        }

        if (! $user || $userId <= 0) {
            $this->command?->error('No user found. Seeder aborted.');

            return;
        }

        $propRoot = AuctionCategory::query()
            ->whereNull('parent_id')
            ->where(function ($q) {
                $q->where('slug', 'like', '%property%')
                    ->orWhere('slug', 'like', '%real-estate%')
                    ->orWhere('name', 'like', '%property%');
            })
            ->orderBy('id')
            ->first();

        $renoRoot = AuctionCategory::query()
            ->whereNull('parent_id')
            ->where(function ($q) {
                $q->where('slug', 'like', '%home-renovation%')
                    ->orWhere('name', 'like', '%Home Renovation%');
            })
            ->orderBy('id')
            ->first();

        $builderRoot = AuctionCategory::query()
            ->whereNull('parent_id')
            ->where(function ($q) {
                $q->where('slug', 'like', '%home-builder%')
                    ->orWhere('name', 'like', '%Home Builder%');
            })
            ->orderBy('id')
            ->first();

        if (! $propRoot || ! $renoRoot) {
            $this->command?->error('Property / Home Renovation roots missing. Aborted.');

            return;
        }

        $propSubs = AuctionCategory::query()
            ->where('parent_id', $propRoot->id)
            ->orderBy('id')
            ->get(['id', 'name']);

        $renoSubs = AuctionCategory::query()
            ->where('parent_id', $renoRoot->id)
            ->orderBy('id')
            ->get(['id', 'name']);

        $builderSubs = $builderRoot
            ? AuctionCategory::query()->where('parent_id', $builderRoot->id)->orderBy('id')->get(['id', 'name'])
            : collect();

        $propertySamples = [
            [
                'title' => '2-bed apartment for rent in DHA Phase 6',
                'description' => '<p>Looking for a clean 2-bedroom apartment in DHA Phase 6 or nearby. Prefer ground/first floor, parking for 1 car.</p>',
                'budget' => 95000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'DHA Phase 6, Karachi',
                'sub_hint' => 'rent',
            ],
            [
                'title' => '3 Marla residential plot — Bahria Town',
                'description' => '<p>Cash buyer for a residential plot in Bahria Town (Rawalpindi/Islamabad). Clear title required.</p>',
                'budget' => 4500000,
                'city' => 'Rawalpindi',
                'state' => 'Punjab',
                'location_label' => 'Bahria Town, Rawalpindi',
                'sub_hint' => 'land',
            ],
            [
                'title' => 'Studio apartment near university',
                'description' => '<p>Furnished or semi-furnished studio for a student. Monthly rent, preferably near university road.</p>',
                'budget' => 45000,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'University Road, Lahore',
                'sub_hint' => 'studio',
            ],
            [
                'title' => 'Commercial shop for sale — main boulevard',
                'description' => '<p>Need a ground-floor shop on a busy boulevard for retail. 10–20 marla equivalent preferred.</p>',
                'budget' => 25000000,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'Main Boulevard, Lahore',
                'sub_hint' => 'commercial',
            ],
            [
                'title' => 'Family villa with garden — Islamabad',
                'description' => '<p>Looking to buy a 5–10 marla villa with parking and small garden. Prefer sectors F/G or Bahria Enclave.</p>',
                'budget' => 35000000,
                'city' => 'Islamabad',
                'state' => 'Islamabad Capital Territory',
                'location_label' => 'Islamabad',
                'sub_hint' => 'villa',
            ],
            [
                'title' => 'Office space for rent — 800 to 1200 sq ft',
                'description' => '<p>Need a ready office for a 6-person team. Elevator + parking preferred. 1-year lease OK.</p>',
                'budget' => 180000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'Clifton / PECHS, Karachi',
                'sub_hint' => 'commercial',
            ],
            [
                'title' => '1-bed apartment for short-term stay',
                'description' => '<p>Monthly short-term furnished flat for 2–3 months. WiFi and utilities included preferred.</p>',
                'budget' => 70000,
                'city' => 'Islamabad',
                'state' => 'Islamabad Capital Territory',
                'location_label' => 'F-10 / F-11, Islamabad',
                'sub_hint' => 'short',
            ],
            [
                'title' => 'Residential house for sale — Gulshan',
                'description' => '<p>Looking for a 120–200 sq yd house in Gulshan-e-Iqbal. Renovation OK if structure is sound.</p>',
                'budget' => 28000000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'Gulshan-e-Iqbal, Karachi',
                'sub_hint' => 'sale',
            ],
            [
                'title' => 'Apartment in new project — booking transfer',
                'description' => '<p>Interested in booking transfer or early possession apartment in a reputable new project.</p>',
                'budget' => 12000000,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'Lahore',
                'sub_hint' => 'project',
            ],
            [
                'title' => 'Room for rent — working professional',
                'description' => '<p>Single room with attached bath for a working professional. Prefer girls/boys hostel or shared flat.</p>',
                'budget' => 25000,
                'city' => 'Faisalabad',
                'state' => 'Punjab',
                'location_label' => 'Faisalabad',
                'sub_hint' => 'room',
            ],
        ];

        $renoSamples = [
            [
                'title' => 'Full kitchen renovation — modular cabinets',
                'description' => '<p>Need modular kitchen with soft-close cabinets, quartz countertop, and LED under-cabinet lighting for a 10x12 kitchen.</p>',
                'budget' => 650000,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'DHA Phase 5, Lahore',
                'tree' => 'reno',
                'sub_hint' => 'kitchen',
            ],
            [
                'title' => 'Bathroom remodel — tiles, vanity & shower',
                'description' => '<p>Master bathroom remodel: waterproofing, tiles, rain shower, vanity, and fixtures. Prefer turnkey quote.</p>',
                'budget' => 420000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'DHA Phase 8, Karachi',
                'tree' => 'reno',
                'sub_hint' => 'bathroom',
            ],
            [
                'title' => 'Living room false ceiling + TV wall',
                'description' => '<p>Want a modern false ceiling with cove lights and a feature TV wall with wooden panels.</p>',
                'budget' => 275000,
                'city' => 'Islamabad',
                'state' => 'Islamabad Capital Territory',
                'location_label' => 'Bahria Enclave, Islamabad',
                'tree' => 'reno',
                'sub_hint' => 'living',
            ],
            [
                'title' => 'Bedroom wardrobes + flooring upgrade',
                'description' => '<p>Two bedrooms need sliding wardrobes and laminate/SPC flooring replacement.</p>',
                'budget' => 380000,
                'city' => 'Rawalpindi',
                'state' => 'Punjab',
                'location_label' => 'Bahria Town, Rawalpindi',
                'tree' => 'reno',
                'sub_hint' => 'bedroom',
            ],
            [
                'title' => 'Kitchen countertops + backsplash only',
                'description' => '<p>Existing cabinets stay. Need granite/quartz tops and a ceramic backsplash install.</p>',
                'budget' => 185000,
                'city' => 'Multan',
                'state' => 'Punjab',
                'location_label' => 'Multan',
                'tree' => 'reno',
                'sub_hint' => 'counter',
            ],
            [
                'title' => 'Grey structure house — 5 marla',
                'description' => '<p>Looking for a reliable home builder for grey structure of a 5 marla house. Map approved. Need timeline + BOQ.</p>',
                'budget' => 4500000,
                'city' => 'Lahore',
                'state' => 'Punjab',
                'location_label' => 'Johar Town, Lahore',
                'tree' => 'builder',
                'sub_hint' => 'grey',
            ],
            [
                'title' => 'Complete house construction — 10 marla',
                'description' => '<p>Turnkey construction of 10 marla double-storey house. Foundation to finishing. Need experienced contractor.</p>',
                'budget' => 18000000,
                'city' => 'Islamabad',
                'state' => 'Islamabad Capital Territory',
                'location_label' => 'G-13, Islamabad',
                'tree' => 'builder',
                'sub_hint' => 'complete',
            ],
            [
                'title' => 'Boundary wall + gate construction',
                'description' => '<p>Plot boundary wall (7 ft) with main gate and pedestrian door. Material + labour quote.</p>',
                'budget' => 650000,
                'city' => 'Faisalabad',
                'state' => 'Punjab',
                'location_label' => 'Faisalabad',
                'tree' => 'builder',
                'sub_hint' => 'wall',
            ],
            [
                'title' => 'Roof waterproofing and tile work',
                'description' => '<p>Leakage on terrace. Need waterproofing membrane + protective tiles. Urgent.</p>',
                'budget' => 220000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'North Nazimabad, Karachi',
                'tree' => 'reno',
                'sub_hint' => 'floor',
            ],
            [
                'title' => 'New villa finishing package',
                'description' => '<p>Grey structure ready. Need finishing: paint, floors, doors, electrical fixtures, and bathrooms.</p>',
                'budget' => 5500000,
                'city' => 'Karachi',
                'state' => 'Sindh',
                'location_label' => 'Scheme 33, Karachi',
                'tree' => 'builder',
                'sub_hint' => 'finish',
            ],
        ];

        $pickSub = static function ($subs, string $hint) {
            if ($subs->isEmpty()) {
                return null;
            }
            $hint = strtolower($hint);
            $match = $subs->first(function ($c) use ($hint) {
                return str_contains(strtolower($c->name), $hint);
            });

            return $match ?? $subs[$subs->count() > 1 ? random_int(0, $subs->count() - 1) : 0];
        };

        $createdProp = 0;
        $createdReno = 0;

        foreach ($propertySamples as $sample) {
            $sub = $pickSub($propSubs, $sample['sub_hint']);
            BuyerRequest::query()->create([
                'user_id' => $userId,
                'title' => $sample['title'],
                'slug' => BuyerRequest::uniqueSlugFromTitle($sample['title']),
                'description' => $sample['description'],
                'category_id' => $propRoot->id,
                'sub_category_id' => $sub?->id,
                'child_category_id' => null,
                'location_label' => $sample['location_label'],
                'country' => 'Pakistan',
                'state' => $sample['state'],
                'city' => $sample['city'],
                'budget' => $sample['budget'],
                'status' => BuyerRequest::STATUS_OPEN,
                'closed_at' => null,
            ]);
            $createdProp++;
        }

        foreach ($renoSamples as $sample) {
            $useBuilder = ($sample['tree'] ?? 'reno') === 'builder' && $builderRoot;
            $root = $useBuilder ? $builderRoot : $renoRoot;
            $subs = $useBuilder ? $builderSubs : $renoSubs;
            $sub = $pickSub($subs, $sample['sub_hint']);

            BuyerRequest::query()->create([
                'user_id' => $userId,
                'title' => $sample['title'],
                'slug' => BuyerRequest::uniqueSlugFromTitle($sample['title']),
                'description' => $sample['description'],
                'category_id' => $root->id,
                'sub_category_id' => $sub?->id,
                'child_category_id' => null,
                'location_label' => $sample['location_label'],
                'country' => 'Pakistan',
                'state' => $sample['state'],
                'city' => $sample['city'],
                'budget' => $sample['budget'],
                'status' => BuyerRequest::STATUS_OPEN,
                'closed_at' => null,
            ]);
            $createdReno++;
        }

        // Sanity: counts that fall in site trees
        $propScoped = BuyerRequest::query()
            ->where('status', BuyerRequest::STATUS_OPEN)
            ->where(function ($q) {
                $ids = Listing::propertyCategoryIds();
                $q->whereIn('category_id', $ids)
                    ->orWhereIn('sub_category_id', $ids)
                    ->orWhereIn('child_category_id', $ids);
            })
            ->count();

        $renoScoped = BuyerRequest::query()
            ->where('status', BuyerRequest::STATUS_OPEN)
            ->where(function ($q) {
                $ids = Listing::renovationCategoryIds();
                $q->whereIn('category_id', $ids)
                    ->orWhereIn('sub_category_id', $ids)
                    ->orWhereIn('child_category_id', $ids);
            })
            ->count();

        $this->command?->info("Created {$createdProp} property + {$createdReno} renovation/builder requests for user #{$userId} ({$user->name}).");
        $this->command?->info("Open scoped totals now — property: {$propScoped}, renovation/builder: {$renoScoped}.");
    }
}
