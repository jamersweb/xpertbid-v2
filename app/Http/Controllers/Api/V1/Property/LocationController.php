<?php

namespace App\Http\Controllers\Api\V1\Property;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\State;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function countries(): JsonResponse
    {
        $countries = Country::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'data' => $countries,
        ]);
    }

    public function states(int $countryId): JsonResponse
    {
        $states = State::query()
            ->where('country_id', $countryId)
            ->orderBy('name')
            ->get(['id', 'name', 'country_id']);

        return response()->json([
            'data' => $states,
        ]);
    }

    public function cities(int $stateId): JsonResponse
    {
        $cities = City::query()
            ->where('state_id', $stateId)
            ->orderBy('name')
            ->get(['id', 'name', 'state_id']);

        return response()->json([
            'data' => $cities,
        ]);
    }
}
