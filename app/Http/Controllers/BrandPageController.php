<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Listing;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandPageController extends Controller
{
    public function brands()
    {
        $brands = Brand::query()
            ->select(['id', 'name', 'slug', 'image'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function propertiesBrand(Brand $brand)
    {
        $listings = Listing::query()
            ->with(['user', 'category', 'subCategory', 'childCategory', 'bids'])
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

    public function asset(string $path)
    {
        $path = ltrim($path, '/');

        if (Storage::disk('public')->exists($path)) {
            return response()->file(Storage::disk('public')->path($path));
        }

        $publicPath = public_path($path);
        if (file_exists($publicPath)) {
            return response()->file($publicPath);
        }

        abort(404, 'Asset not found.');
    }
}
