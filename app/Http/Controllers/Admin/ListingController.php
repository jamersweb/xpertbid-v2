<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionCategory;
use App\Models\City;
use App\Models\Listing;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class ListingController extends Controller
{
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

    protected function buildListingData(Request $request, ?Listing $listing, array $albumPaths, ?string $imagePath): array
    {
        $existingData = $listing?->listing_data ?? [];

        $typeSpecificData = [
            'price' => in_array($request->listing_type, ['normal', 'business'], true) ? $request->price : null,
            'start_price' => $request->listing_type === 'auction' ? $request->price : null,
            'reserve_price' => $request->listing_type === 'auction' ? $request->reserve_price : null,
            'start_date' => $request->listing_type === 'auction' ? $request->start_date : null,
            'end_date' => $request->listing_type === 'auction' ? $request->end_date : null,
            'stock' => $request->listing_type === 'business' ? $request->stock : null,
            'image' => $imagePath,
            'album' => $albumPaths,
        ];

        $listingData = array_merge($existingData, $typeSpecificData);

        // Remove stale keys when listing type changes.
        if ($request->listing_type !== 'auction') {
            unset($listingData['start_price'], $listingData['reserve_price'], $listingData['start_date'], $listingData['end_date']);
        }

        if ($request->listing_type !== 'business') {
            unset($listingData['stock']);
        }

        if ($request->listing_type === 'auction') {
            unset($listingData['price']);
        }

        return array_filter($listingData, fn ($value) => !($value === null || $value === '' || $value === []));
    }

    protected function getFormPayload(?Listing $listing = null): array
    {
        return [
            'listing' => $listing,
            'users' => User::query()->select('id', 'name', 'email')->orderBy('name')->get(),
            'categories' => AuctionCategory::query()
                ->select('id', 'name', 'parent_id', 'sub_category_id')
                ->orderBy('name')
                ->get(),
            'statuses' => ['inactive', 'active', 'pending', 'declined', 'resubmit', 'closed', 'ended', 'awarded'],
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $listings = Listing::with(['user', 'category'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('title', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->status))
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Listings/Index', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Listings/Form', $this->getFormPayload());
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $listing = Listing::with([
            'category',
            'subCategory',
            'childCategory',
            'bids',
            'user.country',
            'user.shippingAddress',
            'user.individualVerification',
            'user.corporateVerification',
        ])->findOrFail($id);

        if ($listing->user) {
            $cityValue = $listing->user->city;
            $stateValue = $listing->user->state;

            $listing->user->city_name = is_numeric($cityValue)
                ? (City::find($cityValue)->name ?? $cityValue)
                : $cityValue;

            $listing->user->state_name = is_numeric($stateValue)
                ? (State::find($stateValue)->name ?? $stateValue)
                : $stateValue;
        }

        return Inertia::render('Admin/Listings/Show', [
            'listing' => $listing
        ]);
    }

    public function edit($id)
    {
        $listing = Listing::findOrFail($id);

        return Inertia::render('Admin/Listings/Form', $this->getFormPayload($listing));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'listing_type' => 'required|in:normal,auction,business',
            'status' => 'required|string',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'price' => 'nullable|numeric|min:0',
            'reserve_price' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'album' => 'nullable|array',
            'album.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $albumPaths = [];
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumPaths[] = $this->storeOptimizedListingImage($file);
            }
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->storeOptimizedListingImage($request->file('image'));
        } elseif (!empty($albumPaths)) {
            $imagePath = $albumPaths[0];
        }

        $listingData = $this->buildListingData($request, null, $albumPaths, $imagePath);

        Listing::create([
            'user_id' => $request->user_id,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'listing_type' => $request->listing_type,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'image' => $imagePath,
            'album' => $albumPaths,
            'listing_data' => $listingData,
        ]);

        return redirect()->route('admin.listings.index')->with('success', 'Listing created successfully');
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'listing_type' => 'required|in:normal,auction,business',
            'status' => 'required|string',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'price' => 'nullable|numeric|min:0',
            'reserve_price' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'album' => 'nullable|array',
            'album.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'existing_album' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $requestHost = $request->getHost();

        $existingAlbum = collect($request->input('existing_album', []))
            ->map(function ($path) use ($requestHost) {
                if (!$path) {
                    return null;
                }

                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                    $host = parse_url($path, PHP_URL_HOST) ?: '';
                    $appHost = parse_url(config('app.url'), PHP_URL_HOST) ?: '';

                    if ($host && !in_array($host, array_filter([$appHost, $requestHost]), true)) {
                        return $path;
                    }

                    $parsedPath = parse_url($path, PHP_URL_PATH) ?: '';
                    $path = ltrim($parsedPath, '/');
                }

                return str_replace('\\', '/', $path);
            })
            ->filter()
            ->values()
            ->all();

        $albumPaths = $existingAlbum;
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumPaths[] = $this->storeOptimizedListingImage($file);
            }
        }

        $imagePath = $listing->getRawOriginal('image') ?: ($listing->listing_data['image'] ?? null);
        if ($request->hasFile('image')) {
            $imagePath = $this->storeOptimizedListingImage($request->file('image'));
        } elseif (!$imagePath && !empty($albumPaths)) {
            $imagePath = $albumPaths[0];
        }

        if (!$imagePath && !empty($albumPaths)) {
            $imagePath = $albumPaths[0];
        }

        $listingData = $this->buildListingData($request, $listing, $albumPaths, $imagePath);

        $listing->update([
            'user_id' => $request->user_id,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'listing_type' => $request->listing_type,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'image' => $imagePath,
            'album' => $albumPaths,
            'listing_data' => $listingData,
        ]);

        return redirect()->route('admin.listings.index')->with('success', 'Listing updated successfully');
    }

    /**
     * Update the status of the listing.
     */
    public function updateStatus(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);
        $request->validate([
            'status' => 'required|string|in:active,inactive,pending,declined'
        ]);

        $listing->update(['status' => $request->status]);

        return back()->with('success', 'Listing status updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $listing = Listing::findOrFail($id);
        $listing->delete();

        return back()->with('success', 'Listing deleted successfully');
    }
}
