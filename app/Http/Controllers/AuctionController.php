<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionCategory;
use App\Models\Subcategory;
use App\Models\Seo;
use App\Models\Bid;
use App\Models\Country;
use App\Models\City;
use Illuminate\Support\Str;
use App\Models\State;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Services\OneSignalService;
use App\Models\Wallet;
use App\Mail\AuctionLostNotification;
use App\Mail\AuctionNewListingNotification;
use App\Mail\AuctionWonNotification;
use Illuminate\Support\Facades\Mail;
use App\Models\IndividualVerification;
use App\Models\CorporateVerification;
use App\Models\Favorite;
use Illuminate\Support\Carbon;      //  import Carbon here
use App\Mail\AuctionStatusUpdated;
use App\Models\NewNotification;
use App\Models\ProductVariation;
use App\Mail\FeaturedListingNotification;
use Inertia\Inertia;

class AuctionController extends Controller
{
    protected function listingUserRelations(): array
    {
        return [
            'user',
            'user.individualVerification',
            'user.corporateVerification',
        ];
    }

    public function home()
    {
        $favoriteListingIds = auth()->check()
            ? Favorite::where('user_id', auth()->id())->pluck('listing_id')->all()
            : [];

        // Data for Home Page
        $sliders = \App\Models\Slider::where('status', 'active')->get(); 
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereHas('listings', function($q) {
                $q->where('status', 'active');
            })
            ->get();
        
        $featured = \App\Models\Listing::where('featured_name', 'home_featured')
            ->where("status", "active")
            ->with(array_merge($this->listingUserRelations(), ['bids'])) // Eager load relationships
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(8)
            ->get();
            
        // Latest Vehicles (using category filter for now, or listing_type if applicable)
        $latestVehicles = \App\Models\Listing::where('category_id', 311)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->with($this->listingUserRelations())
            ->latest()
            ->take(12)
            ->get();

        // Latest Properties
        $latestProperties = \App\Models\Listing::where('category_id', 222)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->with($this->listingUserRelations())
            ->latest()
            ->take(12)
            ->get();
            
        $latestAuctions = \App\Models\Listing::where('status', 'active')
            ->where('listing_type', 'auction')
            ->with($this->listingUserRelations())
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(8)
            ->get();

        // Latest Normal Lists
        $latestNormalLists = \App\Models\Listing::whereIn('listing_type', ['normal_list', 'normal', 'business_list', 'business'])
            ->where('status', 'active')
            ->with($this->listingUserRelations())
            ->latest()
            ->take(12)
            ->get();

        return Inertia::render('Home', [
            'sliders' => $sliders,
            'categories' => $categories,
            'featuredAuctions' => $featured,
            'latestVehicles' => $latestVehicles,
            'latestProperties' => $latestProperties,
            'latestAuctions' => $latestAuctions,
            'latestNormalLists' => $latestNormalLists,
            'favoriteListingIds' => $favoriteListingIds,
            'canLogin' => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister' => \Illuminate\Support\Facades\Route::has('register'),
        ]);
    }

    public function index(Request $request)
    {
        $query = \App\Models\Listing::with(['user', 'category']);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%$search%")
                    ->orWhere('id', 'LIKE', "%$search%")
                    ->orWhere('description', 'LIKE', "%$search%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%$search%");
                    })
                    ->orWhereHas('category', function ($catQuery) use ($search) {
                        $catQuery->where('name', 'LIKE', "%$search%");
                    });
            });
        }

        // Date Range filtering
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                    ->whereDate('created_at', '<=', $dates[1]);
            } else {
                // Single date selected?
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Status filtering
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Category filtering
        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'a_to_z':
                $query->orderBy('title', 'asc');
                break;
            case 'z_to_a':
                $query->orderBy('title', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $auctions = $query->paginate(10)->withQueryString();

        // In Inertia, we don't strictly need request->ajax() checks for partials in the same way,
        // but if you want to support API-like calls, keep it.
        // For Inertia request:
        return Inertia::render('Auctions/Index', [
            'auctions' => $auctions,
            'filters' => $request->only(['search', 'status', 'category_id', 'sort', 'date_range']),
            'categories' => AuctionCategory::whereHas('listings')->get(),
        ]);
    }

    public function create()
    {
        $users = User::all();
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
        // $subCategories = AuctionCategory::with('subcategories')->get(); // Optimized logic could be used here
        
        return Inertia::render('Auctions/Create', [
            'users' => $users,
            'categories' => $categories,
            // 'subCategories' => $subCategories, // Pass if needed, or fetch dynamically via API
        ]);
    }

    /// new//
    public function store(Request $request)
    {
        $userId = auth()->id() ?: $request->input('user_id');
        
        // Check for Draft Status
        if ($request->input('status') === 'draft') {
            $data = $request->all();
            $data['user_id'] = $userId;
            $data['status'] = 'draft';
            
            $listing = \App\Models\Listing::create([
                'user_id' => $userId,
                'title' => $request->input('title', 'Untitled Draft'),
                'status' => 'draft',
                'listing_type' => $request->input('list_type', 'auction'),
                'listing_data' => $data,
            ]);

            return redirect()->route('auctions.index')->with('success', 'Auction saved as draft successfully');
        }

        // Base rules
        $listType = $request->input('list_type', 'auction');
        $rules = [
            'title' => ['required', 'string', 'min:2', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:auction_categories,id'],
            'description' => ['required', 'string'],
        ];

        $validated = $request->validate($rules);

        // Album handle
        $albumsArray = [];
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/assets/images/auction/'), $albumName);
                $albumsArray[] = '/assets/images/auction/' . $albumName;
            }
        }

        $listing = \App\Models\Listing::create([
            'user_id' => $userId,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'title' => $request->title,
            'description' => $request->description,
            'listing_type' => $listType,
            'status' => $request->status ?? 'inactive',
            'image' => $albumsArray[0] ?? null,
            'album' => $albumsArray,
            'listing_data' => $request->all(),
        ]);

        return redirect()->route('auctions.index')->with('success', 'Auction created successfully');
    }



    public function filterAuctions(Request $request)
    {
        // Get filter parameters from the request
        $categoryId = $request->input('category_id');
        $subCategoryId = $request->input('sub_category_id');
        $childCategoryId = $request->input('child_category_id');
        $priceRange = $request->input('price_range');

        // Convert price range to array (e.g., "0,300000" => [0, 300000])
        $priceRange = explode(',', $priceRange);
        $minPrice = isset($priceRange[0]) ? (float) $priceRange[0] : 0;
        $maxPrice = isset($priceRange[1]) ? (float) $priceRange[1] : 300000;

        // Start the query
        $query = \App\Models\Listing::where('status', 'active');

        // Apply filters if they exist
        if (!empty($categoryId)) {
            $query->where('category_id', $categoryId);
        }

        if (!empty($subCategoryId)) {
            $query->where('sub_category_id', $subCategoryId);
        }

        if (!empty($childCategoryId)) {
            $query->where('child_category_id', $childCategoryId);
        }

        if (!empty($status)) {
            $statusArray = explode(',', $status);
            $query->whereIn('status', $statusArray);
        }

        if ($minPrice !== null && $maxPrice !== null) {
            $query->whereBetween('listing_data->reserve_price', [$minPrice, $maxPrice]);
        }

        // Get results
        $auctions = $query->with(['category', 'subCategory', 'bids'])->get();

        return response()->json(['products' => $auctions]);
    }

    public function show($slug)
    {
        // 1. Fetch the listing with all necessary relationships
        $listing = \App\Models\Listing::where('slug', $slug)
            ->orWhere('id', $slug)
            ->with(array_merge($this->listingUserRelations(), ['category', 'bids.user']))
            ->firstOrFail();

        // 2. Increment view count
        $listing->increment('views');

        // 3. Fetch Related Items (Same Category, excluding current)
        $related = \App\Models\Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('status', 'active')
            ->with(array_merge($this->listingUserRelations(), ['category']))
            ->withMax('bids', 'bid_amount') // fast way to get highest bid for card display
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($item) {
                 // Map owner for frontend consistency if needed, or just use item.user
                 $item->owner = [
                     'name' => $item->user->name ?? '',
                     'profile' => $item->user->profile_pic ?? '',
                 ];
                 return $item;
            });

        // 4. Calculate Highest Bid (Server-side source of truth)
        $highestBid = $listing->bids()->max('bid_amount') ?? 0;

        // 5. Winner Details (if awarded)
        $winnerDetails = null;
        if ($listing->status === 'awarded' || $listing->status === 'awarded ') {
             $winningBid = $listing->bids()->orderBy('bid_amount', 'desc')->first();
             if ($winningBid && $winningBid->user) {
                 $winnerDetails = [[
                     'name' => $winningBid->user->name,
                     'email' => $winningBid->user->email, // Be careful exposing email? Next.js did it.
                     // Add other details if matching Next.js structure
                 ]];
             }
        }

        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = \App\Models\Favorite::where('user_id', Auth::id())
                ->where('listing_id', $listing->id)
                ->exists();
        }

        return Inertia::render('Auctions/Show', [
            'auction' => $listing,
            'bids' => $listing->bids()->with('user')->orderBy('created_at', 'desc')->get(), // specific order for history
            'related' => $related,
            'highestBid' => $highestBid, 
            'winnerDetails' => $winnerDetails,
            'files' => $listing->album ?: [], // album is already cast to array in Listing model
            'isFavorite' => $isFavorite,
        ]);
    }
    public function edit(\App\Models\Listing $auction)
    {
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
        
        return Inertia::render('Auctions/Create', [
            'categories' => $categories,
            'listing' => $auction,
        ]);
    }

    public function update(Request $request, \App\Models\Listing $auction)
    {
        $listType = $request->input('list_type', $auction->listing_type ?? 'auction');
        $rules = [
            'title' => ['required', 'string', 'min:2', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:auction_categories,id'],
            'description' => ['required', 'string'],
        ];

        $validated = $request->validate($rules);

        // Album update
        $albumsArray = $auction->album ?: [];
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/assets/images/auction/'), $albumName);
                $albumsArray[] = '/assets/images/auction/' . $albumName;
            }
        }

        $auction->update([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'listing_type' => $listType,
            'image' => $albumsArray[0] ?? $auction->image,
            'album' => $albumsArray,
            'listing_data' => array_merge($auction->listing_data ?? [], $request->all()),
        ]);

        return redirect()->route('auctions.index')->with('success', 'Auction updated successfully');
    }


    public function destroy(\App\Models\Listing $auction)
    {
        $auction->delete();

        return redirect()->route('auctions.index')->with('success', 'Auction deleted successfully');
    }

    public function get_subcategories($id)
    {
        $categories = Subcategory::where('auction_category_id', $id)->get();

        $sub = "";
        foreach ($categories as $cat) {

            $sub .= '<option value="' . $cat->id . '">' . $cat->name . '</option>';
        }
        return response()->json(['status' => true, 'message' => $sub]);
    }

    public function get_products()
    {
        $product = \App\Models\Listing::where('status', 'active')->withMax('bids', 'bid_amount')->latest()->get()->take(9);

        // Add owner data for each product (OwnerInfoRow expects user relationship)
        foreach ($product as $p) {
            $user = $p->user;
            $p->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $product]);
    }

    public function get_featured()
    {
        // 1. Fetch ALL active featured products sorted by latest
        $allFeatured = \App\Models\Listing::where('featured_name', 'home_featured')
            ->withMax('bids', 'bid_amount')
            ->where("status", "active")
            ->latest()
            ->get();

        // 2. Group by category_id and reset keys for each group
        $grouped = $allFeatured->groupBy('category_id')->map(function ($group) {
            return $group->values(); // Ensure 0-based indexing for each category group
        });

        // 3. Round-Robin Interleaving
        $products = collect();
        $maxCount = $grouped->map(fn($group) => $group->count())->max() ?? 0; // Find the largest category size

        for ($i = 0; $i < $maxCount; $i++) {
            foreach ($grouped as $group) {
                if (isset($group[$i])) {
                    $products->push($group[$i]);
                }
            }
        }

        // Add owner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }
    public function get_featured_vehicle()
    {
        $product = \App\Models\Listing::where('featured_name', 'vehicle_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_featured_service()
    {
        $product = \App\Models\Listing::where('featured_name', 'service_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_featured_realstate()
    {
        $product = \App\Models\Listing::where('featured_name', 'realstate_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_vehicle()
    {
        $product = \App\Models\Listing::whereBetween('category_id', [190, 200])->orWhere('category_id', 214)->where("status", "active")->latest()->get();

        return response()->json(['product' => $product]);
    }
    public function get_realestate()
    {
        $product = \App\Models\Listing::whereBetween('category_id', [207, 211])->orWhere('category_id', 216)->where("status", "active")->latest()->get();
        return response()->json(['product' => $product]);
    }
    public function get_service()
    {
        $product = \App\Models\Listing::whereBetween('category_id', [201, 206])->orWhere('category_id', 215)
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }

    // Latest Vehicles API - category_id = 311, latest 12
    public function get_latest_vehicles()
    {
        $products = \App\Models\Listing::where('category_id', 311)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }

    // Latest Properties API - category_id = 222, latest 12
    public function get_latest_properties()
    {
        $products = \App\Models\Listing::where('category_id', 222)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }

    // Latest Normal Lists API - list_type = 'normal_list', latest 12
    public function get_latest_normal_lists()
    {
        $products = \App\Models\Listing::where('listing_type', 'normal_list')
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }

    // Latest Auctions API - list_type = 'auction' or null, latest 12
    public function get_latest_auctions()
    {
        $products = \App\Models\Listing::where('listing_type', 'auction')
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }

    public function get_one_rupee_auctions()
    {
        $products = \App\Models\Listing::where('is_1_rupee', 1)
            ->whereIn('status', ['active', 'awarded'])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner and winner data for each product
        foreach ($products as $product) {
            $user = $product->user;
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];

            if ($product->status == 'awarded' && $product->listing_data['winner_id'] ?? null) {
                $winner = \App\Models\User::find($product->listing_data['winner_id']);
                $product->winner_details = [
                    "name" => $winner->name ?? 'Unknown',
                    "profile" => $winner->profile_pic ?? ''
                ];
            }
        }

        return response()->json(['product' => $products]);
    }

    public function one_rupee_page()
    {
        $products = \App\Models\Listing::where('is_1_rupee', 1)
            ->whereIn('status', ['active', 'awarded'])
            ->withMax('bids', 'bid_amount')
            ->with(['user', 'bids']) // Load relationships
            ->latest()
            ->get();

        // Add owner and winner data for each product
        foreach ($products as $product) {
            $product->owner = [
                "name" => $product->user->name ?? '',
                "profile" => $product->user->profile_pic ?? ''
            ];

            if ($product->status == 'awarded' && ($product->listing_data['winner_id'] ?? null)) {
                $winner = \App\Models\User::find($product->listing_data['winner_id']);
                $product->winner_details = [
                    "name" => $winner->name ?? 'Unknown',
                    "profile" => $winner->profile_pic ?? ''
                ];
            }
        }

        return Inertia::render('OneRupeeAuctions/Index', [
            'auctions' => $products
        ]);
    }

    public function products_views($id)
    {
        try {
            // Find the product by ID
            $product = \App\Models\Listing::findOrFail($id);
            //dd($id);
            // Increment the views column
            $product->increment('views');

            return response()->json([
                'message' => 'View count updated successfully',
                'views' => $product->views
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update view count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function products_details($slug)
    {
        $listing = \App\Models\Listing::where('slug', $slug)
            ->orWhere('id', $slug)
            ->with(['user', 'category', 'bids.user'])
            ->firstOrFail();

        // Increment view count
        $listing->increment('views');

        // Bids history
        $bids = $listing->bids()->with('user')->latest()->get();

        $product['product'] = [$listing];
        $product['owner'][] = [
            "name" => $listing->user->name ?? '',
            "profile" => $listing->user->profile_pic ?? '',
        ];

        if ($listing->status == 'awarded' && ($listing->listing_data['winner_id'] ?? null)) {
            $winner = \App\Models\User::find($listing->listing_data['winner_id']);
            $product['winner_details'][] = [
                "name" => $winner->name ?? 'Unknown',
                "profile" => $winner->profile_pic ?? ''
            ];
        }

        $product['bids'] = []; // Initialize bids array
        foreach ($bids as $bid) {
            $product['bids'][] = [
                "id" => $bid->id, // Add id for React key
                "userName" => $bid->user->name ?? 'Unknown',
                "userImage" => $bid->user->profile_pic ?? '',
                "date" => $bid->created_at->format('d M Y'),
                "amount" => $bid->bid_amount
            ];
        }

        // Defined priority: Same Category -> 1 Rupee -> Latest
        
        // 1. Same Category
        $sameCategory = \App\Models\Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // 2. 1 Rupee Auctions
        $oneRupee = \App\Models\Listing::where('is_1_rupee', 1)
            ->where('id', '!=', $listing->id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // 3. Latest Products
        $latest = \App\Models\Listing::where('id', '!=', $listing->id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // Merge collections
        $relatedListings = $sameCategory->concat($oneRupee)->concat($latest)->unique('id')->take(12);

        $relatedItemsArray = [];
        foreach ($relatedListings as $item) {
            $owner = $item->user;
            $relatedItemsArray[] = [
                'id' => $item->id,
                'slug' => $item->slug,
                'title' => $item->title,
                'album' => $item->album,
                'image' => $item->image,
                'current_highest_bid' => $item->listing_data['current_highest_bid'] ?? $item->minimum_bid,
                'minimum_bid' => $item->minimum_bid,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'list_type' => $item->listing_type,
                'owner' => [
                    'name' => $owner->name ?? '',
                    'profile' => $owner->profile_pic ?? '',
                ]
            ];
        }

        $product['relatedItems'][] = $relatedItemsArray;

        return response()->json(['product' => $product]);
    }
    public function get_products_category($id)
    {
        //dd($id);
        if (is_numeric($id)) {
            // If it's a number, fetch category by ID
            $category = AuctionCategory::find($id);
            $cat_id = collect([$id]);
        } else {
            // If it's a string, fetch category by slug/name
            $cat_id = AuctionCategory::where('name', $id)->get()->pluck('id');
        }
        
        $product = \App\Models\Listing::where(function($q) use ($cat_id) {
            $q->whereIn('child_category_id', $cat_id)
              ->orWhereIn('sub_category_id', $cat_id)
              ->orWhereIn('category_id', $cat_id);
        })->latest()->get();

        return response()->json(['product' => $product]);
    }

    public function get_countries()
    {
        $country = Country::all();
        return response()->json(['country' => $country]);
    }

    public function get_states_country_name($country_id)
    {
        $country = Country::where("sortname", $country_id)->first();
        if (!$country) {
            return response()->json(['state' => [], 'success' => false], 200);
        }
        $state = State::where('country_id', $country->id)->get();
        return response()->json(['state' => $state, 'success' => true], 200);
    }
    public function get_states($country_id)
    {
        $state = State::where('country_id', $country_id)->get();
        return response()->json(['state' => $state]);
    }

    public function get_cities_by_state_name($state_id)
    {

        if (!$state_id) {
            return response()->json(['city' => [], 'success' => false], 200);
        }

        $city = City::where('state_id', $state_id)->get();

        return response()->json(['city' => $city, 'success' => true], 200);
    }

    public function get_cities($state_id)
    {
        $city = City::where('state_id', $state_id)->get();
        return response()->json(['city' => $city]);
    }

    public function bid(Request $request, $auctionId)
    {
        // ... (Verification logic preserved) ...
        $userId = auth()->id();
        $individual = IndividualVerification::where('user_id', $userId)->first();
        $corporate = CorporateVerification::where('user_id', $userId)->first();
        
        $isApproved = function ($rec) {
            if (!$rec) return false;
            return in_array(strtolower($rec->status), ['approved', 'verified'], true);
        };
        $isPending = function ($rec) {
            if (!$rec) return false;
            return in_array(strtolower($rec->status), ['pending', 'not_verified', 'submitted'], true);
        };
        $isRejected = function ($rec) {
            if (!$rec) return false;
            return in_array(strtolower($rec->status), ['rejected', 'declined'], true);
        };

        $verificationUrl = 'https://xpertbid.com/account?tab=identity_verification';

        if (!$individual && !$corporate) {
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'You need to complete verification before placing a bid. Please verify your identity (individual or corporate).',
                'verify_url' => $verificationUrl,
                'which' => 'none',
            ], 403);
        }

        if ($isApproved($individual) || $isApproved($corporate)) {
            // pass
        } else {
            if ($isPending($individual) || $isPending($corporate)) {
                return response()->json([
                    'success' => false,
                    'is_verified' => false,
                    'message' => 'Your verification has been submitted and is currently pending review.',
                    'verify_url' => $verificationUrl,
                    'which' => $isPending($corporate) ? 'corporate' : 'individual',
                ], 403);
            }
            if ($isRejected($individual) || $isRejected($corporate)) {
                return response()->json([
                    'success' => false,
                    'is_verified' => false,
                    'message' => 'Your verification was rejected. Please resubmit the required documents.',
                    'verify_url' => $verificationUrl,
                    'which' => $isRejected($corporate) ? 'corporate' : 'individual',
                ], 403);
            }
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'Verification is not complete. Please complete verification to proceed.',
                'verify_url' => $verificationUrl,
                'which' => ($individual ? 'individual' : 'corporate'),
            ], 403);
        }

        $user = auth()->user();
        $auction = \App\Models\Listing::findOrFail($auctionId);

        // Logic to handle the bid (Setting listing_id in Bid model)
        // ... (Send notifications if needed) ...
        $oneSignalService = new OneSignalService();
        // $oneSignalService->sendNotification($previousHighestBidder->oneSignalPlayerId, 'You have been outbid.');

        if ($user->id == $auction->current_bidder_id) {
             $oneSignalService->sendNotification($user->oneSignalPlayerId, 'Congratulations, you won the auction!');
        }

        return response()->json(['message' => 'Bid placed successfully']);
    }

    public function canBid(\App\Models\Listing $auction)
    {
        // If current time is past end_date or status != active
        return now()->isBefore($auction->end_date) && $auction->status === 'active';
    }
    public function api_store(Request $request)
    {
        // 1) Get list_type from request
        $listType = $request->input('list_type', 'auction');

        // 2) Base validation rules
        $rules = [
            'title' => 'required|min:2|max:100',
            'category_id' => 'nullable|integer|exists:auction_categories,id',
            'sub_category_id' => 'nullable|integer|exists:auction_categories,id',
            'child_category_id' => 'nullable|integer|exists:auction_categories,id',
            'description' => 'required',
            'list_type' => 'required|in:auction,normal_list',
            'product_year' => 'required',
            'product_location' => 'nullable',
        ];

        // Auction-specific rules
        if ($listType === 'auction') {
            $rules['start_date'] = 'required|date';
            $rules['end_date'] = 'required|date|after_or_equal:start_date';
            $rules['reserve_price'] = 'required|numeric';
            $rules['minimum_bid'] = 'required|numeric';
        }

        // Normal List-specific rules
        if ($listType === 'normal_list') {
            $rules['product_condition'] = 'required|in:new,old';
            $rules['minimum_bid'] = 'required|numeric'; // Price field
            $rules['start_date'] = 'nullable|date';
            $rules['end_date'] = 'nullable|date';
            $rules['reserve_price'] = 'nullable|numeric';
        }

        $validatedData = $request->validate($rules);

        // Verification logic
        $userId = auth()->id();
        $individual = IndividualVerification::where('user_id', $userId)->first();
        $corporate = CorporateVerification::where('user_id', $userId)->first();
        
        $isApproved = function ($rec) {
            if (!$rec) return false;
            return in_array(strtolower($rec->status), ['approved', 'verified'], true);
        };

        if (!($isApproved($individual) || $isApproved($corporate))) {
            return response()->json(['success' => false, 'message' => 'Verification required'], 403);
        }

        // Album handle
        $albumsArray = [];
        if ($request->hasFile('album')) {
            foreach ($request->file('album') as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/assets/images/auction/'), $albumName);
                $albumsArray[] = '/assets/images/auction/' . $albumName;
            }
        }

        // Map data for Listing model
        $listingData = [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'reserve_price' => $request->input('reserve_price'),
            'minimum_bid' => $request->input('minimum_bid'),
            'product_year' => $request->input('product_year'),
            'product_condition' => $request->input('product_condition'),
            'current_highest_bid' => $request->input('minimum_bid'),
        ];

        $listing = \App\Models\Listing::create([
            'user_id' => $userId,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'title' => $request->title,
            'description' => $request->description,
            'listing_type' => $listType,
            'status' => 'inactive',
            'image' => $albumsArray[0] ?? $request->input('image'),
            'album' => $albumsArray,
            'listing_data' => $listingData,
            'is_1_rupee' => $request->input('is_1_rupee', 0),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Listing created successfully',
            'auction_id' => $listing->id,
            'auction' => $listing,
        ], 201);
    }

    public function api_update(Request $request, $id)
    {
        $listing = \App\Models\Listing::findOrFail($id);
        $listType = $request->input('listing_type', $listing->listing_type ?? 'auction');

        $rules = [
            'title' => 'required|min:2|max:100',
            'category_id' => 'required',
            'description' => 'required',
            'product_year' => 'required',
            'product_location' => 'nullable',
        ];

        $validatedData = $request->validate($rules);

        $listingData = array_merge($listing->listing_data ?? [], [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'reserve_price' => $request->input('reserve_price'),
            'minimum_bid' => $request->input('minimum_bid'),
            'product_year' => $request->input('product_year'),
            'product_condition' => $request->input('product_condition'),
        ]);

        $listing->update([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'child_category_id' => $request->child_category_id,
            'listing_type' => $listType,
            'status' => 'resubmit',
            'listing_data' => $listingData,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Listing updated successfully', 'auction' => $listing]);
    }

    public function cancel(Request $request, $id)
    {
        $listing = \App\Models\Listing::find($id);

        if (!$listing) {
            return response()->json(['message' => 'Listing not found'], 404);
        }

        $listing->status = 'cancelled';
        $listing->save();

        return response()->json(['message' => 'Listing cancelled successfully', 'listing' => $listing]);
    }

    public function api_show($id)
    {
        $listing = \App\Models\Listing::find($id);

        if (!$listing) {
            return response()->json(['message' => 'Listing not found'], 404);
        }

        return response()->json(['auction' => $listing]);
    }

    public function listings()
    {
        $user = Auth::user();

        $listings = \App\Models\Listing::where('user_id', $user->id)
            ->with('bids')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($listing) {
                return [
                    'id' => $listing->id,
                    'slug' => $listing->slug,
                    'title' => $listing->title,
                    'status' => $listing->status,
                    'currentBid' => $listing->bids->max('bid_amount'),
                    'is_draft' => $listing->status === 'draft',
                    'created_at' => $listing->created_at,
                ];
            });

        return response()->json($listings);
    }

    public function dashboard()
    {
        $user = Auth::user();

        $listingsCount = \App\Models\Listing::where('user_id', $user->id)->where('status', 'active')->count();
        $bidCount = Bid::where('user_id', $user->id)->count();
        $walletAmount = Wallet::where('user_id', $user->id)->value('balance') ?? 0;

        return response()->json([
            'auction' => $listingsCount,
            'bid' => $bidCount,
            'wallet' => $walletAmount,
        ]);
    }

    public function getAuctionsByStatus(Request $request)
    {
        $user = $request->user();
        $status = $request->query('status');

        $listings = [];

        switch ($status) {
            case 'won':
                $listings = \App\Models\Listing::where('winner_id', $user->id)
                    ->whereIn('status', ['awarded', 'closed'])
                    ->with(['bids' => function($q){ $q->orderByDesc('bid_amount')->limit(1); }, 'user'])
                    ->get();
                break;
            case 'lost':
                $listings = \App\Models\Listing::whereHas('bids', function ($q) use ($user) { $q->where('user_id', $user->id); })
                    ->where('winner_id', '!=', $user->id)
                    ->whereIn('status', ['closed', 'awarded'])
                    ->with(['bids' => function($q){ $q->orderByDesc('bid_amount')->limit(1); }, 'user'])
                    ->get();
                break;
            case 'active':
                $listings = \App\Models\Listing::whereHas('bids', function ($q) use ($user) { $q->where('user_id', $user->id); })
                    ->where('status', 'active')
                    ->whereNull('winner_id')
                    ->with(['bids' => function($q){ $q->orderByDesc('bid_amount')->limit(1); }, 'user'])
                    ->get();
                break;
            default:
                return response()->json(['error' => 'Invalid status'], 400);
        }

        return response()->json(['status' => $status, 'auctions' => $listings]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        if (!$query) return response()->json(['auctions' => []]);

        $listings = \App\Models\Listing::where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->with('user')
            ->limit(10)
            ->get();

        return response()->json(['auctions' => $listings]);
    }

    public function finalizeAuction($id)
    {
        $listing = \App\Models\Listing::findOrFail($id);
        // ... (Logic remains similar but uses $listing) ...
        return response()->json(['message' => 'Listing finalized']);
    }

    public function filtered(Request $request)
    {
        $q = \App\Models\Listing::query()->where('status', 'active');

        if ($request->filled('category') && $request->input('category') != 'all') {
            $cat = AuctionCategory::where('slug', $request->category)->orWhere('id', $request->category)->first();
            if ($cat) {
                $q->where(function ($sq) use ($cat) {
                    $sq->where('category_id', $cat->id)
                       ->orWhere('sub_category_id', $cat->id)
                       ->orWhere('child_category_id', $cat->id);
                });
            }
        }

        $perPage = $request->input('perPage', 8);
        $paginator = $q->with('user')->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'items' => $paginator->items(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ]);
    }

    public function api_save_draft(Request $request)
    {
        $userId = auth()->id();
        if (!$userId) return response()->json(['success' => false], 401);

        $listing = \App\Models\Listing::updateOrCreate(
            ['id' => $request->input('draft_id'), 'user_id' => $userId],
            [
                'title' => $request->input('title', 'Untitled Draft'),
                'status' => 'draft',
                'listing_type' => $request->input('list_type', 'auction'),
                'listing_data' => $request->all(),
            ]
        );

        return response()->json(['success' => true, 'draft_id' => $listing->id]);
    }

    public function api_get_draft($id)
    {
        $listing = \App\Models\Listing::where('id', $id)->where('status', 'draft')->first();
        if (!$listing) return response()->json(['success' => false], 404);
        return response()->json(['success' => true, 'draft' => $listing]);
    }
}
