<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingDraft;
use App\Models\ListingEdit;
use App\Models\Currency;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;

class ListingController extends Controller
{
    protected function normalizeLocationName(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return strtolower(preg_replace('/[^a-z0-9]/i', '', trim($value)));
    }

    protected function resolveProfileLocation(): array
    {
        $user = auth()->user();
        if (!$user) {
            return ['country_id' => null, 'state_id' => null, 'city_id' => null];
        }

        $countryId = $user->country_id ?: null;
        $stateId = null;
        $cityId = $user->city_id ?: null;

        if ($cityId) {
            $city = City::find($cityId);
            if ($city) {
                $stateId = $city->state_id;
                if (!$countryId) {
                    $countryId = State::where('id', $stateId)->value('country_id');
                }
            }
        }

        $shipping = $user->shippingAddress;
        $countryName = $this->normalizeLocationName($shipping?->country);
        $stateName = $this->normalizeLocationName($shipping?->state);
        $cityName = $this->normalizeLocationName($shipping?->city);

        if (!$countryId && $countryName) {
            $country = Country::all(['id', 'name'])->first(function ($country) use ($countryName) {
                return $this->normalizeLocationName($country->name) === $countryName;
            });
            $countryId = $country?->id;
        }

        if (!$stateId && $stateName && $countryId) {
            $state = State::where('country_id', $countryId)->get(['id', 'name'])->first(function ($state) use ($stateName) {
                return $this->normalizeLocationName($state->name) === $stateName;
            });
            $stateId = $state?->id;
        }

        if (!$cityId && $cityName && $stateId) {
            $city = City::where('state_id', $stateId)->get(['id', 'name'])->first(function ($city) use ($cityName) {
                return $this->normalizeLocationName($city->name) === $cityName;
            });
            $cityId = $city?->id;
        }

        return [
            'country_id' => $countryId,
            'state_id' => $stateId,
            'city_id' => $cityId,
        ];
    }

    protected function sellerCanPublish(): bool
    {
        $user = auth()->user()?->loadMissing(['individualVerification', 'corporateVerification']);

        if (!$user) {
            return false;
        }

        $statuses = [
            strtolower((string) ($user->individualVerification?->status ?? '')),
            strtolower((string) ($user->corporateVerification?->status ?? '')),
        ];

        return collect($statuses)->contains(fn ($status) => in_array($status, ['verified', 'approved'], true));
    }

    protected function publishVerificationErrorResponse(Request $request)
    {
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete individual or corporate verification before publishing a listing. You can still save it as a draft.',
                'errors' => [
                    'verification' => ['Please complete individual or corporate verification before publishing a listing. You can still save it as a draft.'],
                ],
            ], 403);
        }

        return back()
            ->withErrors([
                'verification' => 'Please complete individual or corporate verification before publishing a listing. You can still save it as a draft.',
            ])
            ->withInput();
    }

    protected function resolveSource(Request $request, string $fieldName): ?string
    {
        return $request->input($fieldName)
            ?? $request->input('source_platform')
            ?? $request->header('X-Client-Source')
            ?? null;
    }

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

    protected function storeListingVideo($file): string
    {
        $directory = public_path('assets/videos/listing_videos');
        File::ensureDirectoryExists($directory);

        $filename = time() . '_' . Str::random(12) . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/videos/listing_videos/' . $filename;
    }

    protected function storeListingMedia($file): string
    {
        return $file->getMimeType() === 'video/mp4'
            ? $this->storeListingVideo($file)
            : $this->storeOptimizedListingImage($file);
    }

    protected function listingMediaRules(): array
    {
        return [
            'file',
            function (string $attribute, $value, \Closure $fail): void {
                $mimeType = $value?->getMimeType();
                $sizeInKilobytes = (int) ceil(($value?->getSize() ?? 0) / 1024);

                $allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

                if (in_array($mimeType, $allowedImages, true)) {
                    if ($sizeInKilobytes > 10240) {
                        $fail('Image file size must be less than 10MB.');
                    }

                    return;
                }

                if ($mimeType === 'video/mp4') {
                    if ($sizeInKilobytes > 15360) {
                        $fail('Video file size must be less than 15MB.');
                    }

                    return;
                }

                $fail('Only PNG, JPG, WEBP, GIF, and MP4 files are allowed.');
            },
        ];
    }

    protected function listingMediaValidationRules(): array
    {
        return [
            'album' => 'nullable|array',
            'album.*' => $this->listingMediaRules(),
        ];
    }

    protected function normalizeExistingAlbum(array $paths): array
    {
        return collect($paths)
            ->map(function ($path) {
                if (!$path) {
                    return null;
                }

                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                    $host = parse_url($path, PHP_URL_HOST) ?: '';
                    $appHost = parse_url(config('app.url'), PHP_URL_HOST) ?: '';
                    $requestHost = request()->getHost();

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
    }

    protected function buildPendingEditPayload(Listing $listing, Request $request, array $listingData, array $categoryFeatures, ?string $imagePath): array
    {
        return [
            'category_id' => $request->category_id ?? $listing->category_id,
            'sub_category_id' => $request->sub_category_id ?? $listing->sub_category_id,
            'child_category_id' => $request->child_category_id ?? $listing->child_category_id,
            'country_id' => $request->country_id ?? $listing->country_id,
            'state_id' => $request->state_id ?? $listing->state_id,
            'city_id' => $request->city_id ?? $listing->city_id,
            'listing_type' => $request->listing_type ?? $listing->listing_type,
            'title' => $request->title ?? $listing->title,
            'description' => $request->description ?? $listing->description,
            'image' => $imagePath,
            'album' => $listingData['album'] ?? [],
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ];
    }

    protected function parseIncomingPayload(Request $request): void
    {
        if (is_string($request->listing_data)) {
            $data = json_decode($request->listing_data, true) ?? [];
            array_walk_recursive($data, function (&$item) {
                if ($item === '') {
                    $item = null;
                }
            });

            if (($request->listing_type === 'auction' || $request->input('listing_type') === 'auction') && !isset($data['start_price']) && isset($data['price'])) {
                $data['start_price'] = $data['price'];
            }

            $request->merge(['listing_data' => $data]);
        }

        if (is_string($request->category_features)) {
            $features = json_decode($request->category_features, true) ?? [];
            array_walk_recursive($features, function (&$item) {
                if ($item === '') {
                    $item = null;
                }
            });

            $request->merge(['category_features' => $features]);
        }
    }

    protected function buildDraftPayload(Request $request, ?ListingDraft $draft = null): array
    {
        $listingData = is_array($request->listing_data) ? $request->listing_data : ($draft?->listing_data ?? []);
        $listingData = $this->normalizeListingDataToPkr($listingData, $request->input('selected_currency'));
        $listingData['country_id'] = $request->country_id ?? ($draft?->listing_data['country_id'] ?? null);
        $listingData['state_id'] = $request->state_id ?? ($draft?->listing_data['state_id'] ?? null);
        $listingData['city_id'] = $request->city_id ?? ($draft?->listing_data['city_id'] ?? null);
        $categoryFeatures = is_array($request->category_features) ? $request->category_features : ($draft?->category_features ?? []);
        $existingAlbum = $this->normalizeExistingAlbum($request->input('existing_album', $draft?->album ?? []));

        $album = $existingAlbum;

        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $album[] = $this->storeListingMedia($file);
            }
        }

        $imagePath = $draft?->image ?: ($listingData['image'] ?? null) ?: ($album[0] ?? null);
        if (!$imagePath && !empty($album)) {
            $imagePath = $album[0];
        }

        $listingData['album'] = $album;
        $listingData['image'] = $imagePath;

        return [
            'category_id' => $request->category_id ?: $draft?->category_id,
            'sub_category_id' => $request->sub_category_id ?: $draft?->sub_category_id,
            'child_category_id' => $request->child_category_id ?: $draft?->child_category_id,
            'listing_type' => $request->listing_type ?: $draft?->listing_type ?: 'auction',
            'listing_source' => $draft?->listing_source ?: $this->resolveSource($request, 'listing_source'),
            'title' => $request->title ?: $draft?->title ?: 'Untitled Draft',
            'description' => $request->description ?: $draft?->description,
            'image' => $imagePath,
            'album' => $album,
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ];
    }

    protected function saveDraft(Request $request, ?ListingDraft $draft = null, ?int $sourceListingId = null): ListingDraft
    {
        $payload = $this->buildDraftPayload($request, $draft);
        $payload['user_id'] = auth()->id() ?? 1;
        $payload['source_listing_id'] = $sourceListingId ?? $draft?->source_listing_id;

        if ($draft) {
            $draft->update($payload);
            return $draft->fresh(['user', 'category']);
        }

        return ListingDraft::create($payload);
    }

    protected function publishDraft(ListingDraft $draft): Listing
    {
        $listingData = $draft->listing_data ?? [];
        $categoryFeatures = $draft->category_features ?? [];

        $listing = Listing::create([
            'user_id' => $draft->user_id,
            'category_id' => $draft->category_id,
            'sub_category_id' => $draft->sub_category_id,
            'child_category_id' => $draft->child_category_id,
            'country_id' => $listingData['country_id'] ?? null,
            'state_id' => $listingData['state_id'] ?? null,
            'city_id' => $listingData['city_id'] ?? null,
            'listing_type' => $draft->listing_type ?: 'auction',
            'listing_source' => $draft->listing_source,
            'title' => $draft->title ?: 'Untitled Listing',
            'description' => $draft->description,
            'status' => 'inactive',
            'image' => $draft->image,
            'album' => $draft->album ?? [],
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ]);

        $draft->delete();

        return $listing;
    }

    protected function transformSellerDraft(ListingDraft $draft): ListingDraft
    {
        $draft->setAttribute('status', 'draft');
        $draft->setAttribute('is_draft', true);
        $draft->setAttribute('currentBid', null);
        $draft->setAttribute('edit_url', route('auctions.drafts.edit', $draft->id));
        $draft->setAttribute('cancel_url', route('auctions.drafts.cancel', $draft->id));

        return $draft;
    }

    /**
     * Display a listing of the user's listings.
     */
    public function index(Request $request)
    {
        $listings = Listing::where('user_id', auth()->id())
            ->with(['user', 'category'])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->get()
            ->map(function ($l) {
                $l->currentBid = $l->bids_max_bid_amount;
                $l->is_draft = false;
                $l->edit_url = route('auctions.edit', $l->slug ?: $l->id);
                $l->cancel_url = route('auctions.cancel', $l->slug ?: $l->id);
                return $l;
            });

        $drafts = ListingDraft::where('user_id', auth()->id())
            ->with(['user', 'category'])
            ->latest()
            ->get()
            ->map(fn ($draft) => $this->transformSellerDraft($draft));

        $auctions = $listings->concat($drafts)->sortByDesc('created_at')->values();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'auctions' => $auctions,
                'data' => $auctions,
            ]);
        }

        return \Inertia\Inertia::render('Auctions/MyListings', [
            'auctions' => $auctions
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
        $countries = Country::query()->select('id', 'name')->orderBy('name')->get();
        $profileLocation = $this->resolveProfileLocation();
 
        return \Inertia\Inertia::render('Auctions/Create', [
            'categories' => $categories,
            'countries' => $countries,
            'profileLocation' => $profileLocation,
        ]);
    }
 
    /**
     * Store a new listing.
     */
    public function store(Request $request)
    {
        $this->parseIncomingPayload($request);

        if ($request->input('status') === 'draft') {
            $draft = $this->saveDraft($request);

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Listing saved as draft successfully.',
                    'draft' => $this->transformSellerDraft($draft),
                    'listing' => $this->transformSellerDraft($draft),
                ], 201);
            }

            return redirect()
                ->route('auctions.mylistings')
                ->with('success', "Listing saved as draft successfully (Draft #{$draft->id}).");
        }

        if (!$this->sellerCanPublish()) {
            return $this->publishVerificationErrorResponse($request);
        }
 
        // 1. Base Validation
        $validator = Validator::make($request->all(), [
            'category_id' => 'required',
            'sub_category_id' => 'nullable',
            'child_category_id' => 'nullable',
            'country_id' => 'nullable|exists:countries,id',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
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
            ...$this->listingMediaValidationRules(),
        ]);
 
        if ($validator->fails()) {
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

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
                $albumPaths[] = $this->storeListingMedia($file);
            }
        }
 
        $imagePath = $albumPaths[0] ?? null;
        $listingData['album'] = $albumPaths;
        $listingData['image'] = $imagePath;
 
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
            'country_id' => $request->country_id,
            'state_id' => $request->state_id,
            'city_id' => $request->city_id,
            'listing_type' => $request->listing_type,
            'listing_source' => $this->resolveSource($request, 'listing_source'),
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'inactive', // Requires admin approval before going live
            'image' => $imagePath,
            'album' => $albumPaths,
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
        ]);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Listing created successfully.',
                'listing' => $listing->fresh(['user', 'category']),
            ], 201);
        }
 
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
        $countries = Country::query()->select('id', 'name')->orderBy('name')->get();
        $profileLocation = $this->resolveProfileLocation();

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json([
                'listing' => $listing->loadMissing(['user', 'category']),
                'categories' => $categories,
                'countries' => $countries,
                'profileLocation' => $profileLocation,
            ]);
        }
 
        return \Inertia\Inertia::render('Auctions/Create', [
            'listing' => $listing,
            'categories' => $categories,
            'countries' => $countries,
            'profileLocation' => $profileLocation,
        ]);
    }

    public function editDraft(ListingDraft $draft)
    {
        abort_unless($draft->user_id === auth()->id(), 403);

        $categories = \App\Models\AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
        $countries = Country::query()->select('id', 'name')->orderBy('name')->get();
        $profileLocation = $this->resolveProfileLocation();

        $draft->setAttribute('status', 'draft');
        $draft->setAttribute('is_draft', true);

        if (request()->wantsJson() || request()->expectsJson()) {
            return response()->json([
                'listing' => $this->transformSellerDraft($draft),
                'draft' => $this->transformSellerDraft($draft),
                'categories' => $categories,
                'countries' => $countries,
                'profileLocation' => $profileLocation,
            ]);
        }

        return \Inertia\Inertia::render('Auctions/Create', [
            'listing' => $draft,
            'categories' => $categories,
            'countries' => $countries,
            'profileLocation' => $profileLocation,
        ]);
    }
 
    public function update(Request $request, Listing $listing)
    {
        $this->parseIncomingPayload($request);
        $request->validate([
            'country_id' => 'nullable|exists:countries,id',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
            ...$this->listingMediaValidationRules(),
        ]);

        if ($request->input('status') === 'draft') {
            $draft = $this->saveDraft($request, null, $listing->id);

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Listing saved as draft successfully.',
                    'draft' => $this->transformSellerDraft($draft),
                    'listing' => $this->transformSellerDraft($draft),
                ], 201);
            }

            return redirect()
                ->route('auctions.mylistings')
                ->with('success', "Listing saved as draft successfully (Draft #{$draft->id}).");
        }

        if (!$this->sellerCanPublish()) {
            return $this->publishVerificationErrorResponse($request);
        }

        $listingData = is_array($request->listing_data) ? $request->listing_data : ($listing->listing_data ?? []);
        $listingData = $this->normalizeListingDataToPkr($listingData, $request->input('selected_currency'));
        $categoryFeatures = is_array($request->category_features) ? $request->category_features : ($listing->category_features ?? []);
        $existingAlbum = $this->normalizeExistingAlbum($request->input('existing_album', []));

        $listingData['album'] = $existingAlbum;
        
        if ($request->hasFile('album')) {
            $albumPaths = [];
            foreach ($request->file('album') as $file) {
                $albumPaths[] = $this->storeListingMedia($file);
            }
            $listingData['album'] = array_merge($listingData['album'] ?? [], $albumPaths);
        }

        $imagePath = $listing->getRawOriginal('image')
            ?: ($listing->listing_data['image'] ?? null)
            ?: (($listingData['album'][0] ?? null));

        if (!$imagePath && !empty($listingData['album'])) {
            $imagePath = $listingData['album'][0];
        }

        $listingData['image'] = $imagePath;

        if ($listing->status === 'active' && $request->status !== 'draft') {
            ListingEdit::updateOrCreate(
                ['listing_id' => $listing->id],
                [
                    'data' => $this->buildPendingEditPayload(
                        $listing,
                        $request,
                        $listingData,
                        $categoryFeatures,
                        $imagePath
                    ),
                ]
            );

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Your changes have been submitted for admin approval. The current live listing will remain visible until approved.',
                    'listing' => $listing->fresh(['user', 'category']),
                ]);
            }

            return redirect()
                ->route('auctions.mylistings')
                ->with('success', 'Your changes have been submitted for admin approval. The current live listing will remain visible until approved.');
        }
 
        $listing->update([
            'category_id' => $request->category_id ?? $listing->category_id,
            'sub_category_id' => $request->sub_category_id ?? $listing->sub_category_id,
            'child_category_id' => $request->child_category_id ?? $listing->child_category_id,
            'country_id' => $request->country_id ?? $listing->country_id,
            'state_id' => $request->state_id ?? $listing->state_id,
            'city_id' => $request->city_id ?? $listing->city_id,
            'listing_type' => $request->listing_type ?? $listing->listing_type,
            'listing_source' => $listing->listing_source ?: $this->resolveSource($request, 'listing_source'),
            'title' => $request->title ?? $listing->title,
            'description' => $request->description ?? $listing->description,
            'image' => $imagePath,
            'album' => $listingData['album'] ?? [],
            'listing_data' => $listingData,
            'category_features' => $categoryFeatures,
            'status' => $listing->status,
        ]);

        $listing->pendingEdit()?->delete();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Listing updated successfully.',
                'listing' => $listing->fresh(['user', 'category']),
            ]);
        }
 
        return redirect()->route('auctions.mylistings')->with('success', 'Listing updated successfully');
    }

    public function updateDraft(Request $request, ListingDraft $draft)
    {
        abort_unless($draft->user_id === auth()->id(), 403);

        $this->parseIncomingPayload($request);
        $request->validate($this->listingMediaValidationRules());

        if ($request->input('status') === 'draft') {
            $draft = $this->saveDraft($request, $draft);

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Draft updated successfully.',
                    'draft' => $this->transformSellerDraft($draft),
                    'listing' => $this->transformSellerDraft($draft),
                ]);
            }

            return redirect()->route('auctions.mylistings')->with('success', 'Draft updated successfully');
        }

        if (!$this->sellerCanPublish()) {
            return $this->publishVerificationErrorResponse($request);
        }

        $listing = $this->publishDraft($this->saveDraft($request, $draft));

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Draft published successfully and moved to listings.',
                'listing' => $listing->fresh(['user', 'category']),
            ], 201);
        }

        return redirect()->route('auctions.mylistings')->with('success', 'Draft published successfully and moved to listings');
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

    public function cancelDraft(ListingDraft $draft)
    {
        abort_unless($draft->user_id === auth()->id(), 403);

        $draft->delete();

        return response()->json([
            'message' => 'Draft deleted successfully',
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
