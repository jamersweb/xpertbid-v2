<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Listing;
use Inertia\Inertia;

class BrandPageController extends Controller
{
    public function propertiesBrand(Brand $brand)
    {
        $listings = Listing::query()
            ->with(['user', 'category', 'bids'])
            ->where('status', 'active')
            ->where('listing_type', '!=', 'live_auction')
            ->where('brand_id', $brand->id)
            ->latest()
            ->get();

        return Inertia::render('Brands/PropertiesBrand', [
            'brand' => $brand,
            'listings' => $listings,
        ]);
    }
}
