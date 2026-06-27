<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\State;
use Illuminate\Database\Seeder;

class UnitedArabEmiratesCitySeeder extends Seeder
{
    /**
     * Seed UAE cities against the existing UAE state/emirate rows.
     */
    public function run(): void
    {
        $states = [
            3796 => [
                'name' => 'Abu Zabi',
                'cities' => [
                    'Abu Dhabi',
                    'Al Ain',
                    'Madinat Zayed',
                    'Ruwais',
                    'Ghayathi',
                    'Liwa Oasis',
                    'Al Dhafra',
                    'Al Shahama',
                    'Bani Yas',
                ],
            ],
            3797 => [
                'name' => 'Ajman',
                'cities' => [
                    'Ajman',
                    'Masfout',
                    'Manama',
                    'Al Jurf',
                    'Al Rashidiya',
                ],
            ],
            3798 => [
                'name' => 'Dubai',
                'cities' => [
                    'Dubai',
                    'Jebel Ali',
                    'Hatta',
                    'Al Awir',
                    'Al Khawaneej',
                    'Margham',
                ],
            ],
            3799 => [
                'name' => 'Ras al-Khaymah',
                'cities' => [
                    'Ras Al Khaimah',
                    'Al Jazirah Al Hamra',
                    'Khatt',
                    'Masafi',
                    'Digdaga',
                    'Al Rams',
                    'Shaam',
                ],
            ],
            3800 => [
                'name' => 'Sharjah',
                'cities' => [
                    'Sharjah',
                    'Khor Fakkan',
                    'Kalba',
                    'Dibba Al-Hisn',
                    'Al Dhaid',
                    'Mleiha',
                    'Madam',
                    'Al Hamriyah',
                ],
            ],
            3801 => [
                'name' => 'Sharjha',
                'cities' => [
                    'Sharjah',
                    'Khor Fakkan',
                    'Kalba',
                    'Dibba Al-Hisn',
                    'Al Dhaid',
                    'Mleiha',
                    'Madam',
                    'Al Hamriyah',
                ],
            ],
            3802 => [
                'name' => 'Umm al Qaywayn',
                'cities' => [
                    'Umm Al Quwain',
                    'Falaj Al Mualla',
                    'Al Salamah',
                    'Al Raas',
                ],
            ],
            3803 => [
                'name' => 'al-Fujayrah',
                'cities' => [
                    'Fujairah',
                    'Dibba Al-Fujairah',
                    'Masafi',
                    'Al Bithnah',
                    'Qidfa',
                    'Mirbah',
                    'Al Hayl',
                ],
            ],
            3804 => [
                'name' => 'ash-Shariqah',
                'cities' => [
                    'Sharjah',
                    'Khor Fakkan',
                    'Kalba',
                    'Dibba Al-Hisn',
                    'Al Dhaid',
                    'Mleiha',
                    'Madam',
                    'Al Hamriyah',
                ],
            ],
        ];

        foreach ($states as $stateId => $stateData) {
            $state = State::query()->find($stateId)
                ?? State::query()->where('name', $stateData['name'])->first();

            if (! $state) {
                $this->command?->warn("State not found: {$stateData['name']} ({$stateId})");
                continue;
            }

            foreach ($stateData['cities'] as $cityName) {
                City::query()->firstOrCreate([
                    'state_id' => $state->id,
                    'name' => $cityName,
                ]);
            }
        }
    }
}
