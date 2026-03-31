<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;

class ListingController extends Controller
{
    protected function normalizeAmountToPkr($amount, ?string $currencyCode): ?float
    {
        if ($amount === null || $amount === '') {
            return null;
        }

        $numericAmount = (float) $amount;
        $code = strtoupper((string) ($currencyCode ?: 'PKR'));

        if ($code === 'PKR') {
            return $numericAmount;
        }

        $currency = Currency::query()
            ->where('enabled', true)
            ->where('code', $code)
            ->first();

        $rateToPkr = (float) ($currency?->manual_rate_to_aed ?: 0);

        if ($rateToPkr <= 0) {
            return $numericAmount;
        }

        return round($numericAmount * $rateToPkr, 2);
    }

    protected function normalizeListingDataToPkr(array $listingData, ?string $currencyCode): array
    {
        foreach (['price', 'reserve_price', 'start_price'] as $priceField) {
            if (array_key_exists($priceField, $listingData)) {
                $listingData[$priceField] = $this->normalizeAmountToPkr($listingData[$priceField], $currencyCode);
            }
        }

        if (
            isset($listingData['discount_type']) &&
            $listingData['discount_type'] === 'flat' &&
            array_key_exists('discount_value', $listingData)
        ) {
            $listingData['discount_value'] = $this->normalizeAmountToPkr($listingData['discount_value'], $currencyCode);
        }

        return $listingData;
    }

    protected function storeOptimizedListingImage($file): string
    {
        $directory = public_path('assets/images/listing_images');
        File::ensureDirectoryExists($directory);

        $manager = new ImageManager(new GdDriver());
        $image = $manager->read($file->getRealPath());
        $image->scaleDown(width: 1800, height: 1800);

        $filename = time() . '_' . Str::random(12) . '.webp';
        $encoded = $image->encode(new WebpEncoder(82));
        $encoded->save($directory . DIRECTORY_SEPARATOR . $filename);

        return 'assets/images/listing_images/' . $filename;
    }

    /**
     * Display a listing of the user's listings.
     */
    public function index()
    {
        $listings = Listing::where('user_id', auth()->id())
            ->with(['user', 'category'])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->get()
            ->map(function ($l) {
                $l->currentBid = $l->bids_max_bid_amount;
                return $l;
            });

        return \Inertia\Inertia::render('Auctions/MyListings', [
            'auctions' => $listings
        ]);
    }

    /**
     * Show the form for creating a new listing.
     */
    public function create()
    {
        $categories = \App\Models\AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
 
        return \Inertia\Inertia::render('Auctions/Create', [
            'categories' => $categories
        ]);
    }
 
    /**
     * Store a new listing.
     */
    public function store(Request $request)
    {
        // 0. Decode JSON strings if coming from FormData before validation
        if (is_string($request->listing_data)) {
            $data = json_decode($request->listing_data, true);
            // Convert empty strings to null for better validation
            array_walk_recursive($data, function (&$item) {
                if ($item === '') $item = null;
            });
 
            // PROACTIVE: Map 'price' to 'start_price' for auctions BEFORE validation
            if (($request->listing_type === 'auction' || $request->input('listing_type') === 'auction') && !isset($data['start_price']) && isset($data['price'])) {
                $data['start_price'] = $data['price'];
            }
 
            $request->merge(['listing_data' => $data]);
        }
        if (is_string($request->category_features)) {
            $features = json_decode($request->category_features, true);
            array_walk_recursive($features, function (&$item) {
                if ($item === '') $item = null;
            });
            $request->merge(['category_features' => $features]);
        }
 
        // 1. Base Validation
        $validator = Validator::make($request->all(), [
            'category_id' => 'required',
            'sub_category_id' => 'nullable',
            'child_category_id' => 'nullable',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'listing_type' => 'required|in:normal,auction,business',
            
            // Validation for listing_data (Type-specific)
            'listing_data' => 'nullable|array',
            'listing_data.price' => 'required_without:listing_data.start_price|numeric|nullable',
            
            // Auction specific listing_data
            'listing_data.start_price' => 'required_if:listing_type,auction|numeric|nullable',
            'listing_data.reserve_price' => 'nullable|numeric',
            'listing_data.start_date' => 'required_if:listing_type,auction|date|nullable',
            'listing_data.end_date' => 'required_if:listing_type,auction|date|after:listing_data.start_date|nullable',
            
            // Business specific listing_data
            'listing_data.stock' => 'required_if:listing_type,business|integer|min:0|nullable',
            'listing_data.quantity' => 'required_if:listing_type,business|integer|min:1|nullable',
            'listing_data.discount' => 'nullable|numeric|min:0|max:100',
            'listing_data.shop_details' => 'required_if:listing_type,business|array',
            
            // Category features (Category-specific dynamic data)
            'category_features' => 'nullable|array',
            'album' => 'nullable|array',
            'album.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
 
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
 
        // Data is already merged and validated as array
        $listingData = $request->listing_data ?? [];
        $listingData = $this->normalizeListingDataToPkr($listingData, $request->input('selected_currency'));
        $categoryFeatures = $request->category_features ?? [];
 
        // Handle Image Uploads (Album)
        $albumPaths = [];
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumPaths[] = $this->storeOptimizedListingImage($file);
            }
        }
 
        $listingData['album'] = $albumPaths;
 
        // Handle 'other_category' lookup or creation for AuctionCategory
        $categoryId = $request->category_id;
        if ($categoryId === 'other_category') {
            $otherCat = \App\Models\AuctionCategory::firstOrCreate(
                ['slug' => 'other'],
                ['name' => 'Other', 'parent_id' => null]
            );
            $categoryId = $otherCat->id;
        }
 
        // 3. Create Listing
        $listing = Listing::create([
            'user_id' => auth()->id() ?? 1,
            'category_id' => $categoryId,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'listing_type' => $request->listing_type,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'inactive', // Requires admin approval before going live
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ]);
 
        return redirect()->route('auctions.mylistings')->with('success', 'Listing created successfully');
    }
 
    /**
     * Show the form for editing.
     */
    public function edit(Listing $listing)
    {
        $categories = \App\Models\AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
 
        return \Inertia\Inertia::render('Auctions/Create', [
            'listing' => $listing,
            'categories' => $categories
        ]);
    }
 
    public function update(Request $request, Listing $listing)
    {
        if (is_string($request->listing_data)) {
            $data = json_decode($request->listing_data, true) ?? [];
            array_walk_recursive($data, function (&$item) {
                if ($item === '') $item = null;
            });

            if (($request->listing_type === 'auction' || $request->input('listing_type') === 'auction') && !isset($data['start_price']) && isset($data['price'])) {
                $data['start_price'] = $data['price'];
            }

            $request->merge(['listing_data' => $data]);
        }

        if (is_string($request->category_features)) {
            $features = json_decode($request->category_features, true) ?? [];
            array_walk_recursive($features, function (&$item) {
                if ($item === '') $item = null;
            });

            $request->merge(['category_features' => $features]);
        }

        $listingData = is_array($request->listing_data) ? $request->listing_data : ($listing->listing_data ?? []);
        $listingData = $this->normalizeListingDataToPkr($listingData, $request->input('selected_currency'));
        $categoryFeatures = is_array($request->category_features) ? $request->category_features : ($listing->category_features ?? []);
        $nextStatus = $request->status === 'draft' ? 'draft' : 'resubmit';

        $existingAlbum = collect($request->input('existing_album', []))
            ->map(function ($path) {
                if (!$path) {
                    return null;
                }

                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                    $parsedPath = parse_url($path, PHP_URL_PATH) ?: '';
                    $path = ltrim($parsedPath, '/');
                }

                return str_replace('\\', '/', $path);
            })
            ->filter()
            ->values()
            ->all();

        $listingData['album'] = $existingAlbum;
        
        if ($request->hasFile('album')) {
            $albumPaths = [];
            foreach ($request->file('album') as $file) {
                $albumPaths[] = $this->storeOptimizedListingImage($file);
            }
            $listingData['album'] = array_merge($listingData['album'] ?? [], $albumPaths);
        }
 
        $listing->update([
            'category_id' => $request->category_id ?? $listing->category_id,
            'sub_category_id' => $request->sub_category_id ?? $listing->sub_category_id,
            'child_category_id' => $request->child_category_id ?? $listing->child_category_id,
            'listing_type' => $request->listing_type ?? $listing->listing_type,
            'title' => $request->title ?? $listing->title,
            'description' => $request->description ?? $listing->description,
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
            'status' => $nextStatus,
        ]);
 
        return redirect()->route('auctions.mylistings')->with('success', 'Listing updated successfully');
    }

    public function cancel(Listing $listing)
    {
        abort_unless($listing->user_id === auth()->id(), 403);

        $listing->update([
            'status' => 'cancelled',
        ]);

        $listing->delete();

        return response()->json([
            'message' => 'Listing cancelled successfully',
        ]);
    }
 
    public function getDynamicFields($categoryId, $listingType)
    {
        $categoryIds = [$categoryId];
        
        $category = \App\Models\AuctionCategory::find($categoryId);
        if ($category) {
            if ($category->sub_category_id) {
                $categoryIds[] = $category->sub_category_id;
            }
            if ($category->parent_id) {
                $categoryIds[] = $category->parent_id;
            }
        }

        $fields = \App\Models\DynamicField::where(function ($query) use ($categoryIds) {
                $query->whereIn('category_id', $categoryIds)
                      ->orWhereNull('category_id');
            })
            ->where(function ($query) use ($listingType) {
                $query->where('listing_type', $listingType)
                      ->orWhere('listing_type', 'all');
            })
            ->get();
 
        return response()->json([
            'status' => 'success',
            'data' => $fields
        ]);
    }
}
