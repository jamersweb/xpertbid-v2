<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\YoutubeVideoId;
use App\Models\AuctionCategory;
use App\Models\Bid;
use App\Models\Brand;
use App\Models\City;
use App\Models\Listing;
use App\Models\LiveAuctionSession;
use App\Models\ListingEdit;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
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
            'start_price' => in_array($request->listing_type, ['auction', 'live_auction'], true) ? $request->price : null,
            'reserve_price' => in_array($request->listing_type, ['auction', 'live_auction'], true) ? $request->reserve_price : null,
            'start_date' => $request->listing_type === 'auction' ? $request->start_date : null,
            'end_date' => $request->listing_type === 'auction' ? $request->end_date : null,
            'stock' => $request->listing_type === 'business' ? $request->stock : null,
            'image' => $imagePath,
            'album' => $albumPaths,
        ];

        $listingData = array_merge($existingData, $typeSpecificData);

        // Remove stale keys when listing type changes.
        if (!in_array($request->listing_type, ['auction', 'live_auction'], true)) {
            unset($listingData['start_price'], $listingData['reserve_price'], $listingData['start_date'], $listingData['end_date']);
        }

        if ($request->listing_type !== 'auction') {
            unset($listingData['start_date'], $listingData['end_date']);
        }

        if ($request->listing_type !== 'business') {
            unset($listingData['stock']);
        }

        if ($request->listing_type === 'auction') {
            unset($listingData['price']);
        }

        if ($request->listing_type === 'live_auction') {
            unset($listingData['price'], $listingData['start_date'], $listingData['end_date'], $listingData['stock']);
        }

        return array_filter($listingData, fn ($value) => !($value === null || $value === '' || $value === []));
    }

    protected function fallbackAdminListingUserId(): ?int
    {
        return auth()->id() ?: User::query()->orderBy('id')->value('id');
    }

    protected function fallbackListingCategoryId(): ?int
    {
        return AuctionCategory::query()
            ->whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->orderBy('name')
            ->value('id') ?: AuctionCategory::query()->orderBy('id')->value('id');
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
            'brands' => Brand::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'statuses' => ['inactive', 'active', 'pending', 'declined', 'resubmit', 'closed', 'ended', 'awarded'],
        ];
    }
    /**
     * Display a listing of the resource.
     */
    protected function renderListingIndex(Request $request, ?string $listingType = null, array $pageProps = [])
    {
        $listings = Listing::with(['user', 'category', 'pendingEdit'])
            ->when($listingType, fn ($query) => $query->where('listing_type', $listingType))
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

        return Inertia::render('Admin/Listings/Index', array_merge([
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
        ], $pageProps));
    }

    public function index(Request $request)
    {
        return $this->renderListingIndex($request, null, [
            'pageTitle' => 'Listings Management',
            'pageDescription' => 'Manage all normal, auction, business, and live auction listings.',
            'filterRouteName' => 'admin.listings.index',
            'createRouteName' => 'admin.listings.create',
            'createButtonLabel' => 'Create Listing',
        ]);
    }

    public function liveAuctions(Request $request)
    {
        return $this->renderListingIndex($request, 'live_auction', [
            'pageTitle' => 'Live Auctions',
            'pageDescription' => 'Manage live auction streams and their listing details.',
            'filterRouteName' => 'admin.live-auctions.index',
            'createRouteName' => 'admin.live-auctions.create',
            'createButtonLabel' => 'Create Live Auction',
            'isLiveAuctionPage' => true,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Listings/Form', $this->getFormPayload());
    }

    public function createLiveAuction()
    {
        return Inertia::render('Admin/Listings/Form', array_merge($this->getFormPayload(), [
            'defaultListingType' => 'live_auction',
            'backRouteName' => 'admin.live-auctions.index',
            'returnTo' => 'live_auctions',
        ]));
    }

    public function setupLiveAuction()
    {
        $liveAuctions = Listing::query()
            ->where('listing_type', 'live_auction')
            ->select('id', 'title', 'slug', 'status', 'youtube_video_id', 'listing_data', 'category_id')
            ->with('category:id,name')
            ->latest()
            ->get();

        return Inertia::render('Admin/LiveAuctions/Setup', [
            'liveAuctions' => $liveAuctions,
        ]);
    }

    public function editLiveAuctionSession(LiveAuctionSession $session)
    {
        $liveAuctions = Listing::query()
            ->where('listing_type', 'live_auction')
            ->select('id', 'title', 'slug', 'status', 'youtube_video_id', 'listing_data', 'category_id')
            ->with('category:id,name')
            ->latest()
            ->get();

        return Inertia::render('Admin/LiveAuctions/Setup', [
            'liveAuctions' => $liveAuctions,
            'session' => $session,
            'isEditing' => true,
        ]);
    }

    public function liveSessions(Request $request)
    {
        $query = LiveAuctionSession::query()
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('live_url', 'like', "%{$search}%")
                    ->orWhere('youtube_video_id', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        $sessions = $query->paginate(12)->withQueryString();

        $listingIds = collect($sessions->items())
            ->flatMap(fn (LiveAuctionSession $session) => $session->selected_listing_ids ?: [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();

        $listings = Listing::query()
            ->whereIn('id', $listingIds)
            ->select('id', 'title', 'slug', 'status', 'youtube_video_id')
            ->get()
            ->keyBy('id');

        $sessions->getCollection()->transform(function (LiveAuctionSession $session) use ($listings) {
            $ids = collect($session->selected_listing_ids ?: [])
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values();

            $session->selected_count = $ids->count();
            $session->selected_listings = $ids
                ->map(fn ($id) => $listings->get($id))
                ->filter()
                ->values()
                ->all();

            return $session;
        });

        return Inertia::render('Admin/LiveAuctions/Sessions', [
            'sessions' => $sessions,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }

    public function updateLiveSessionStatus(Request $request, LiveAuctionSession $session)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,soon,closed,inactive'],
        ]);

        DB::transaction(function () use ($session, $validated) {
            if ($validated['status'] === 'active') {
                LiveAuctionSession::query()
                    ->where('id', '!=', $session->id)
                    ->where('status', 'active')
                    ->update(['status' => 'inactive']);
            }

            $session->update([
                'status' => $validated['status'],
                'closed_at' => $validated['status'] === 'closed' ? now() : null,
            ]);
        });

        return redirect()->back()->with('success', 'Live session status updated successfully.');
    }

    public function updateLiveAuctionSession(Request $request, LiveAuctionSession $session)
    {
        $validated = $request->validate([
            'live_url' => ['required', 'string', 'max:500'],
            'session_status' => ['required', 'in:live,closed,soon,inactive'],
            'scheduled_at' => ['nullable', 'required_if:session_status,soon', 'date'],
            'auction_ids' => ['required', 'array', 'min:1'],
            'auction_ids.*' => ['integer', 'exists:listings,id'],
        ]);

        $ids = Listing::query()
            ->where('listing_type', 'live_auction')
            ->whereIn('id', $validated['auction_ids'])
            ->pluck('id')
            ->all();

        if (empty($ids)) {
            return redirect()->back()->with('error', 'Please select at least one live auction.');
        }

        $status = match ($validated['session_status']) {
            'live' => 'active',
            'soon' => 'soon',
            'inactive' => 'inactive',
            default => 'closed',
        };

        DB::transaction(function () use ($session, $validated, $ids, $status) {
            if ($status === 'active') {
                LiveAuctionSession::query()
                    ->where('id', '!=', $session->id)
                    ->where('status', 'active')
                    ->update(['status' => 'inactive']);
            }

            $session->update([
                'live_url' => $validated['live_url'],
                'youtube_video_id' => YoutubeVideoId::normalize($validated['live_url']),
                'selected_listing_ids' => array_values($ids),
                'status' => $status,
                'scheduled_at' => $status === 'soon' ? $validated['scheduled_at'] : null,
                'closed_at' => $status === 'closed' ? ($session->closed_at ?: now()) : null,
            ]);
        });

        return redirect()
            ->route('admin.live.index')
            ->with('success', 'Live session updated successfully.');
    }

    public function launchLiveAuction(Request $request)
    {
        $validated = $request->validate([
            'live_url' => ['required', 'string', 'max:500'],
            'session_status' => ['required', 'in:live,closed,soon'],
            'scheduled_at' => ['nullable', 'required_if:session_status,soon', 'date'],
            'auction_ids' => ['required', 'array', 'min:1'],
            'auction_ids.*' => ['integer', 'exists:listings,id'],
        ]);

        $ids = Listing::query()
            ->where('listing_type', 'live_auction')
            ->whereIn('id', $validated['auction_ids'])
            ->pluck('id')
            ->all();

        if (empty($ids)) {
            return redirect()->back()->with('error', 'Please select at least one live auction.');
        }

        $status = match ($validated['session_status']) {
            'live' => 'active',
            'soon' => 'soon',
            default => 'closed',
        };

        if ($status === 'active') {
            LiveAuctionSession::query()->where('status', 'active')->update(['status' => 'inactive']);
        }

        $session = LiveAuctionSession::create([
            'live_url' => $validated['live_url'],
            'youtube_video_id' => YoutubeVideoId::normalize($validated['live_url']),
            'selected_listing_ids' => array_values($ids),
            'status' => $status,
            'scheduled_at' => $status === 'soon' ? $validated['scheduled_at'] : null,
        ]);

        return redirect()->route('admin.live-auctions.room', [
            'session' => $session->id,
            'ids' => implode(',', $ids),
            'live_url' => $validated['live_url'],
        ]);
    }

    public function liveAuctionRoom(Request $request)
    {
        $session = $request->query('session')
            ? LiveAuctionSession::query()->find($request->query('session'))
            : null;

        $idsSource = $session?->selected_listing_ids ?: explode(',', (string) $request->query('ids'));
        $ids = collect($idsSource)
            ->map(fn ($id) => (int) trim($id))
            ->filter()
            ->unique()
            ->values()
            ->all();

        if (empty($ids)) {
            return redirect()->route('admin.live-auctions.setup')->with('error', 'Please select live auction products first.');
        }

        $liveUrl = $session?->live_url ?: (string) $request->query('live_url');
        $globalVideoId = $session?->youtube_video_id ?: YoutubeVideoId::normalize($liveUrl);

        $liveAuctions = Listing::query()
            ->where('listing_type', 'live_auction')
            ->whereIn('id', $ids)
            ->with(['user:id,name,email', 'category:id,name'])
            ->withMax('bids', 'bid_amount')
            ->withCount('bids')
            ->orderByRaw('FIELD(id, ' . implode(',', array_map('intval', $ids)) . ')')
            ->get();

        return Inertia::render('Admin/LiveAuctions/Room', [
            'session' => $session,
            'liveAuctions' => $liveAuctions,
            'selectedIds' => $ids,
            'liveUrl' => $liveUrl,
            'globalVideoId' => $globalVideoId,
        ]);
    }

    public function startLiveAuction($id)
    {
        $listing = Listing::query()
            ->where('listing_type', 'live_auction')
            ->findOrFail($id);

        $session = LiveAuctionSession::query()
            ->where('status', 'active')
            ->whereJsonContains('selected_listing_ids', $listing->id)
            ->latest()
            ->first();

        DB::transaction(function () use ($listing, $session) {
            $ids = collect($session?->selected_listing_ids ?: [])
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->unique()
                ->values()
                ->all();

            if (!empty($ids)) {
                Listing::query()
                    ->where('listing_type', 'live_auction')
                    ->whereIn('id', $ids)
                    ->where('id', '!=', $listing->id)
                    ->where('status', 'active')
                    ->update(['status' => 'inactive']);
            }

            $listing->update(['status' => 'active']);
        });

        return redirect()->back()->with('success', 'Live auction started successfully.');
    }

    public function closeLiveAuctionSession(LiveAuctionSession $session)
    {
        $ids = collect($session->selected_listing_ids ?: [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values()
            ->all();

        DB::transaction(function () use ($session, $ids) {
            $session->update([
                'status' => 'closed',
                'closed_at' => now(),
            ]);

            if (!empty($ids)) {
                Listing::query()
                    ->where('listing_type', 'live_auction')
                    ->whereIn('id', $ids)
                    ->update(['status' => 'closed']);
            }
        });

        return redirect()
            ->route('admin.live-auctions.index')
            ->with('success', 'Live auction session closed successfully.');
    }

    public function endLiveAuction($id)
    {
        $listing = Listing::query()
            ->where('listing_type', 'live_auction')
            ->findOrFail($id);

        $highestBid = Bid::query()
            ->where('listing_id', $listing->id)
            ->orderByDesc('bid_amount')
            ->first();

        $listingData = is_array($listing->listing_data) ? $listing->listing_data : [];

        if ($highestBid) {
            $listingData['winner_id'] = $highestBid->user_id;
            $listingData['winning_bid_amount'] = $highestBid->bid_amount;

            $listing->update([
                'status' => 'awarded',
                'listing_data' => $listingData,
            ]);

            return redirect()->back()->with('success', 'Live auction ended and awarded to the highest bidder.');
        }

        unset($listingData['winner_id'], $listingData['winning_bid_amount']);

        $listing->update([
            'status' => 'ended',
            'listing_data' => $listingData,
        ]);

        return redirect()->back()->with('success', 'Live auction ended without any bids.');
    }

    public function closeLiveAuction($id)
    {
        $listing = Listing::query()
            ->where('listing_type', 'live_auction')
            ->findOrFail($id);

        $listingData = is_array($listing->listing_data) ? $listing->listing_data : [];
        unset($listingData['winner_id'], $listingData['winning_bid_amount']);

        $listing->update([
            'status' => 'closed',
            'listing_data' => $listingData,
        ]);

        return redirect()->back()->with('success', 'Live auction closed successfully.');
    }

    public function awardLiveAuction($id)
    {
        $listing = Listing::query()
            ->where('listing_type', 'live_auction')
            ->findOrFail($id);

        $highestBid = Bid::query()
            ->where('listing_id', $listing->id)
            ->orderByDesc('bid_amount')
            ->first();

        if (!$highestBid) {
            return redirect()->back()->with('error', 'This live auction has no bids to award.');
        }

        $listingData = is_array($listing->listing_data) ? $listing->listing_data : [];
        $listingData['winner_id'] = $highestBid->user_id;
        $listingData['winning_bid_amount'] = $highestBid->bid_amount;

        $listing->update([
            'status' => 'awarded',
            'listing_data' => $listingData,
        ]);

        return redirect()->back()->with('success', 'Live auction awarded to the highest bidder.');
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
            'pendingEdit',
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
        $extraPayload = $listing->listing_type === 'live_auction'
            ? [
                'backRouteName' => 'admin.live-auctions.index',
                'returnTo' => 'live_auctions',
            ]
            : [];

        return Inertia::render('Admin/Listings/Form', array_merge($this->getFormPayload($listing), $extraPayload));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required_unless:listing_type,live_auction|nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'listing_type' => 'required|in:normal,auction,business,live_auction',
            'status' => 'required|string',
            'is_1_rupee' => 'nullable|boolean',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
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

        $userId = $request->listing_type === 'live_auction'
            ? ($request->user_id ?: $this->fallbackAdminListingUserId())
            : $request->user_id;
        $categoryId = $request->category_id;

        if (!$userId) {
            return back()->withErrors([
                'listing_type' => 'A seller must exist before creating a live auction.',
            ])->withInput();
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
            'user_id' => $userId,
            'category_id' => $categoryId,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'brand_id' => $request->brand_id,
            'listing_type' => $request->listing_type,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'is_1_rupee' => $request->boolean('is_1_rupee'),
            'image' => $imagePath,
            'album' => $albumPaths,
            'listing_data' => $listingData,
        ]);

        $redirectRoute = $request->input('return_to') === 'live_auctions' || $request->listing_type === 'live_auction'
            ? 'admin.live-auctions.index'
            : 'admin.listings.index';

        return redirect()->route($redirectRoute)->with('success', 'Listing created successfully');
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required_unless:listing_type,live_auction|nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'listing_type' => 'required|in:normal,auction,business,live_auction',
            'status' => 'required|string',
            'is_1_rupee' => 'nullable|boolean',
            'category_id' => 'required|exists:auction_categories,id',
            'sub_category_id' => 'nullable|exists:auction_categories,id',
            'child_category_id' => 'nullable|exists:auction_categories,id',
            'brand_id' => 'nullable|exists:brands,id',
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

        $userId = $request->listing_type === 'live_auction'
            ? ($request->user_id ?: $listing->user_id ?: $this->fallbackAdminListingUserId())
            : $request->user_id;
        $categoryId = $request->category_id;

        if (!$userId) {
            return back()->withErrors([
                'listing_type' => 'A seller must exist before updating a live auction.',
            ])->withInput();
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
            'user_id' => $userId,
            'category_id' => $categoryId,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'brand_id' => $request->brand_id,
            'listing_type' => $request->listing_type,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'is_1_rupee' => $request->boolean('is_1_rupee'),
            'image' => $imagePath,
            'album' => $albumPaths,
            'listing_data' => $listingData,
        ]);

        $listing->pendingEdit()?->delete();

        $redirectRoute = $request->input('return_to') === 'live_auctions' || $request->listing_type === 'live_auction'
            ? 'admin.live-auctions.index'
            : 'admin.listings.index';

        return redirect()->route($redirectRoute)->with('success', 'Listing updated successfully');
    }

    public function approveEdit($id)
    {
        $listing = Listing::with('pendingEdit')->findOrFail($id);
        $pendingEdit = $listing->pendingEdit;

        if (!$pendingEdit) {
            return redirect()->back()->with('error', 'No pending edits found for this listing.');
        }

        $payload = $pendingEdit->data ?? [];

        DB::transaction(function () use ($listing, $pendingEdit, $payload) {
            $listing->update([
                'category_id' => $payload['category_id'] ?? $listing->category_id,
                'sub_category_id' => $payload['sub_category_id'] ?? $listing->sub_category_id,
                'child_category_id' => $payload['child_category_id'] ?? $listing->child_category_id,
                'brand_id' => $payload['brand_id'] ?? $listing->brand_id,
                'country_id' => $payload['country_id'] ?? $listing->country_id,
                'state_id' => $payload['state_id'] ?? $listing->state_id,
                'city_id' => $payload['city_id'] ?? $listing->city_id,
                'listing_type' => $payload['listing_type'] ?? $listing->listing_type,
                'title' => $payload['title'] ?? $listing->title,
                'description' => $payload['description'] ?? $listing->description,
                'image' => $payload['image'] ?? $listing->getRawOriginal('image'),
                'album' => $payload['album'] ?? $listing->getRawOriginal('album'),
                'listing_data' => $payload['listing_data'] ?? $listing->listing_data,
                'category_features' => $payload['category_features'] ?? $listing->category_features,
                'status' => 'active',
            ]);

            $pendingEdit->delete();
        });

        return redirect()->back()->with('success', 'Pending edits approved and merged into the live listing.');
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
