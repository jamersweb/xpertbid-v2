<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\Auction1;
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
use Illuminate\Support\Carbon;      //  import Carbon here
use App\Mail\AuctionStatusUpdated;
use App\Models\NewNotification;
use App\Models\ProductVariation;
use App\Mail\FeaturedListingNotification;
use Inertia\Inertia;

class AuctionController extends Controller
{
    public function home()
    {
        // Data for Home Page
        $sliders = \App\Models\Slider::where('status', 'active')->get(); 
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereHas('auctions', function($q) {
                $q->where('status', 'active');
            })
            ->get();
        
        $featured = Auction::where('featured_name', 'home_featured')
            ->where("status", "active")
            ->with(['user', 'bids']) // Eager load relationships
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(8)
            ->get();
            
        // Latest Vehicles
        $latestVehicles = Auction::where('category_id', 311)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->with(['user'])
            ->latest()
            ->take(12)
            ->get();

        // Latest Properties
        $latestProperties = Auction::where('category_id', 222)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->with(['user'])
            ->latest()
            ->take(12)
            ->get();
            
        $latestAuctions = Auction::where('status', 'active')
            ->where(function ($query) {
                $query->where('list_type', 'auction')
                      ->orWhereNull('list_type');
            })
            ->with(['user'])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(8)
            ->get();

        // Latest Normal Lists
        $latestNormalLists = Auction::where('list_type', 'normal_list')
            ->where('status', 'active')
            ->with(['user'])
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
            'canLogin' => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister' => \Illuminate\Support\Facades\Route::has('register'),
        ]);
    }

    public function index(Request $request)
    {
        $query = Auction::with(['user', 'category']);

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
            'categories' => AuctionCategory::whereHas('auctions')->get(),
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
        // Check for Draft Status
        if ($request->input('status') === 'draft') {
            // minimal validation for draft
            $request->validate([
                'user_id' => ['required', 'integer', 'exists:users,id'],
                // title is optional in DB but usually good to have something. DB allows null though.
            ]);
            
            // Prepare data for Auction1
            $data = $request->except(['album', 'image', 'variations']); // Exclude files/relations for manual handling

            // Album upload for Draft via Auction1 logic (same path)
            $albumsArray = [];
            if ($request->hasFile('album')) {
                $albumFiles = $request->file('album');
                if (!is_array($albumFiles))
                    $albumFiles = [$albumFiles];
                foreach ($albumFiles as $file) {
                    $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('/assets/images/auction/'), $albumName);
                    $albumsArray[] = '/assets/images/auction/' . $albumName;
                }
            }
            // If image is not set but album has files, use first as main image
            if (!empty($albumsArray)) {
                $data['image'] = $albumsArray[0];
                $data['album'] = json_encode($albumsArray);
            }

            // Handle Dates
             if (!empty($data['end_date'])) {
                try {
                    $data['end_date'] = \Carbon\Carbon::parse($data['end_date'])->setTime(0, 0, 0)->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    $data['end_date'] = null;
                }
            } else {
                 $data['end_date'] = null;
            }
             if (empty($data['start_date'])) $data['start_date'] = null;

            // Sanitize category IDs for draft (handle strings like 'other_subcategory')
            if (isset($data['sub_category_id']) && !is_numeric($data['sub_category_id'])) {
                $data['sub_category_id'] = null;
            }
            if (isset($data['child_category_id']) && !is_numeric($data['child_category_id'])) {
                $data['child_category_id'] = null;
            }

            // Create Draft in auctions_1
            $auction = Auction1::create($data);

             // Handle Variations for draft if needed (Auction1 likely doesn't have variations relation set up yet or uses same table? 
             // The user said "draft product to hogi bhe different table me". 
             // If variations are needed for draft, we need a variations table linked to auctions_1 or just save as JSON in a column if supported.
             // Looking at Auction1 model, it doesn't have `variations` relationship defined. 
             // For now, I will skip saving variations relation for drafts to avoid errors, or logic needs to be added to ProductVariation to support auction1_id.
             // Given the instructions, I'll focus on saving the main draft record first.
             
            return redirect()->route('auctions.index')->with('success', 'Auction saved as draft successfully');
        }

        // Base rules
        $listType = $request->input('list_type', 'auction');
        $rules = [
            'title' => ['required', 'string', 'min:2', 'max:100'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'category_id' => ['required', 'integer', 'exists:auction_categories,id'],
            'sub_category_id' => ['nullable', 'integer', 'exists:auction_categories,id'],
            'child_category_id' => ['nullable', 'integer', 'exists:auction_categories,id'],
            'description' => ['required', 'string'],
            'list_type' => ['required', 'in:auction,normal_list'],
        ];

        // Auction-specific rules
        if ($listType === 'auction') {
            $rules['product_condition'] = ['required', 'string'];
            $rules['start_date'] = ['required', 'date'];
            $rules['end_date'] = ['required', 'date', 'after_or_equal:start_date'];
            $rules['reserve_price'] = ['required', 'numeric'];
            $rules['minimum_bid'] = ['required', 'numeric'];
            $rules['product_year'] = ['required'];
            $rules['status'] = ['required'];
        }

        // Normal List-specific rules
        if ($listType === 'normal_list') {
            $rules['product_condition'] = ['required', 'in:new,old'];
            $rules['product_year'] = ['required'];
            $rules['minimum_bid'] = ['required', 'numeric']; // Price field
        }

        // New fields (optional by default)
        $rules += [
            'developer' => ['nullable', 'string', 'max:255'],
            'location_url' => ['nullable', 'max:1024'],
            'delivery_date' => ['nullable', 'date'],
            'sale_starts' => ['nullable', 'date'],
            'payment_plan' => ['nullable', 'string'],
            'number_of_buildings' => ['nullable', 'integer', 'min:0'],
            'government_fee' => ['nullable', 'string'],
            'nearby_location' => ['nullable', 'string'],
            'amenities' => ['nullable', 'string'],
            'amenities' => ['nullable', 'string'],
            'facilities' => ['nullable', 'string'],
            // Discount fields
            'discount_type' => ['nullable', 'string', 'in:percent,flat'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'is_1_rupee' => ['nullable', 'boolean'],
        ];

        $validated = $request->validate($rules);

        // Album upload (same as your logic)
        $albumsArray = [];
        if ($request->hasFile('album')) {
            $albumFiles = $request->file('album');
            if (!is_array($albumFiles))
                $albumFiles = [$albumFiles];
            foreach ($albumFiles as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/assets/images/auction/'), $albumName);
                $albumsArray[] = '/assets/images/auction/' . $albumName;
            }
        }

        // Persistable fields (old + new)
        $data = $request->only([
            'title',
            'user_id',
            'category_id',
            'sub_category_id',
            'child_category_id',
            'start_date',
            'end_date',
            'reserve_price',
            'minimum_bid',
            'description',
            'product_year',
            'status',
            'featured_name',
            'create_category',
            'list_type',
            'product_condition',
            // NEW:
            'developer',
            'location_url',
            'delivery_date',
            'sale_starts',
            'payment_plan',
            'number_of_buildings',
            'government_fee',
            'nearby_location',
            'amenities',
            'amenities',
            'facilities',
            'discount_type',
            'discount_value',
            'is_1_rupee',
        ]);

        // For normal_list, set default values
        if ($listType === 'normal_list') {
            if (empty($data['status'])) {
                $data['status'] = 'active';
            }
            // Set reserve_price to minimum_bid value or 0 if not provided
            if (empty($data['reserve_price']) || $data['reserve_price'] === null) {
                $data['reserve_price'] = !empty($data['minimum_bid']) ? $data['minimum_bid'] : 0;
            }
            // Set start_date and end_date to null or default values
            if (empty($data['start_date']) || $data['start_date'] === null) {
                $data['start_date'] = null;
            }
            if (empty($data['end_date']) || $data['end_date'] === null) {
                $data['end_date'] = null;
            }
        } else {
            // For Auction type, ensure product_condition is set
            if (empty($data['product_condition'])) {
                $data['product_condition'] = 'Used'; 
            }
        }

        if (!empty($data['end_date'])) {
            $data['end_date'] = \Carbon\Carbon::parse($data['end_date'])->setTime(0, 0, 0)->format('Y-m-d H:i:s'); // 12 AM (Midnight)
        }

        $data['image'] = $albumsArray[0] ?? null;
        $data['album'] = json_encode($albumsArray);

        $auction = Auction::create($data);

        // Handle Variations
        if ($listType === 'normal_list' && $request->has('variations')) {
            $variations = $request->input('variations');
            if (is_string($variations)) {
                $variations = json_decode($variations, true);
            }
            if (is_array($variations)) {
                foreach ($variations as $variation) {
                    if (!empty($variation['name']) && !empty($variation['price'])) {
                        ProductVariation::create([
                            'auction_id' => $auction->id,
                            'name' => $variation['name'],
                            'price' => $variation['price'],
                            'discount_type' => $variation['discount_type'] ?? null,
                            'discount_value' => $variation['discount_value'] ?? null,
                        ]);
                    }
                }
            }
        }

        // Send Featured Email Logic
        if ($request->has('send_featured_email') && $request->input('featured_name') == 'home_featured') {
            $user = User::find($auction->user_id);
            if ($user) {
                try {
                    Mail::to($user->email)->send(new FeaturedListingNotification($user, $auction));
                } catch (\Exception $e) {
                    \Log::error("Failed to send Featured Notification email: " . $e->getMessage());
                }
            }
        }

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
        $query = Auction::where('status', 'active');

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
            $query->whereBetween('reserve_price', [$minPrice, $maxPrice]);
        }

        // Get results
        $auctions = $query->with(['category', 'subcategory', 'bids'])->get();

        return response()->json(['products' => $auctions]);
    }

    public function show($slug)
    {
        // 1. Fetch the auction with all necessary relationships
        $auction = Auction::where('slug', $slug)
            ->orWhere('id', $slug)
            ->with(['user', 'variations', 'category', 'bids.user'])
            ->firstOrFail();

        // 2. Increment view count (optional, but good for parity with Next.js)
        $auction->increment('views');

        // 3. Fetch Related Items (Same Category, excluding current)
        $related = Auction::where('category_id', $auction->category_id)
            ->where('id', '!=', $auction->id)
            ->where('status', 'active')
            ->with(['user', 'category'])
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
        $highestBid = $auction->bids()->max('bid_amount') ?? 0;

        // 5. Winner Details (if awarded)
        $winnerDetails = null;
        if ($auction->status === 'awarded' || $auction->status === 'awarded ') {
             // Assuming winner logic or relation exists. 
             // If not explicit, we might assume the highest bidder is the winner 
             // OR there's a specific 'winner_id' column. 
             // For now, let's grab the highest bid's user if status is awarded.
             $winningBid = $auction->bids()->orderBy('bid_amount', 'desc')->first();
             if ($winningBid && $winningBid->user) {
                 $winnerDetails = [[
                     'name' => $winningBid->user->name,
                     'email' => $winningBid->user->email, // Be careful exposing email? Next.js did it.
                     // Add other details if matching Next.js structure
                 ]];
             }
        }

        return Inertia::render('Auctions/Show', [
            'auction' => $auction,
            'bids' => $auction->bids()->with('user')->orderBy('created_at', 'desc')->get(), // specific order for history
            'related' => $related,
            'highestBid' => $highestBid, 
            'winnerDetails' => $winnerDetails,
            'files' => $auction->album ? json_decode($auction->album) : [], // pre-decode album if needed or do it in frontend
        ]);
    }
    public function edit(Auction $auction)
    {
        $auction->load('variations'); // Load variations relationship
        $users = User::all();
        $categories = AuctionCategory::whereNull('parent_id')
            ->whereNull('sub_category_id')
            ->get();
        $subCategories = AuctionCategory::with('subcategories')->get();

        return Inertia::render('Auctions/Create', [
            'categories' => $categories,
            'listing' => $auction,
            // 'subCategories' => $subCategories // if needed by frontend, but Create.jsx primarily uses categories and async fetches
        ]);
    }

    public function update(Request $request, Auction $auction)
    {
        $listType = $request->input('list_type', $auction->list_type ?? 'auction');
        $rules = [
            'title' => ['required', 'string', 'min:2', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:auction_categories,id'],
            'sub_category_id' => ['nullable', 'integer', 'exists:auction_categories,id'],
            'child_category_id' => ['nullable', 'integer', 'exists:auction_categories,id'],
            'description' => ['required', 'string'],
            'list_type' => ['required', 'in:auction,normal_list'],
        ];

        // Auction-specific rules
        if ($listType === 'auction') {
            $rules['start_date'] = ['nullable', 'date']; // Changed to nullable for edit page - no current date validation
            $rules['end_date'] = ['required', 'date', 'after_or_equal:start_date'];
            $rules['reserve_price'] = ['required', 'numeric'];
            $rules['minimum_bid'] = ['required', 'numeric'];
            $rules['product_year'] = ['required'];
            $rules['status'] = ['required'];
        }

        // Normal List-specific rules
        if ($listType === 'normal_list') {
            $rules['product_condition'] = ['required', 'in:new,old'];
            $rules['product_year'] = ['required'];
            $rules['minimum_bid'] = ['required', 'numeric']; // Price field
        }

        // New fields (optional by default)
        $rules += [
            'developer' => ['nullable', 'string', 'max:255'],
            'location_url' => ['nullable', 'max:1024'],
            'delivery_date' => ['nullable', 'date'],
            'sale_starts' => ['nullable', 'date'],
            'payment_plan' => ['nullable', 'string'],
            'number_of_buildings' => ['nullable', 'integer', 'min:0'],
            'government_fee' => ['nullable', 'string'],
            'nearby_location' => ['nullable', 'string'],
            'amenities' => ['nullable', 'string'],
            'amenities' => ['nullable', 'string'],
            'facilities' => ['nullable', 'string'],
            // Discount fields
            'discount_type' => ['nullable', 'string', 'in:percent,flat'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
        ];

        $validated = $request->validate($rules);

        // Album update (optional)
        // Album update
        $existingAlbum = $request->input('existing_album', []);
        if (is_string($existingAlbum)) {
             $existingAlbum = json_decode($existingAlbum, true) ?? [];
        }
        $albumsArray = is_array($existingAlbum) ? $existingAlbum : [];

        if ($request->hasFile('album')) {
            $albumFiles = $request->file('album');
            if (!is_array($albumFiles))
                $albumFiles = [$albumFiles];
            
            foreach ($albumFiles as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/assets/images/auction/'), $albumName);
                $albumsArray[] = '/assets/images/auction/' . $albumName;
            }
        }

        // Only update if we have changes (existing_album sent or new files)
        if ($request->has('existing_album') || $request->hasFile('album')) {
             $validated['album'] = json_encode(array_values($albumsArray));
             if (!empty($albumsArray)) {
                 $validated['image'] = $albumsArray[0];
             } else {
                 // If album became empty, clear image too
                 $validated['image'] = null; 
             }
        }

        // Extra fields you set without validation earlier:
        $validated['featured_name'] = $request->input('featured_name');
        $validated['create_category'] = $request->input('create_category');
        $validated['list_type'] = $listType;
        $validated['product_condition'] = $request->input('product_condition');
        $validated['discount_type'] = $request->input('discount_type');
        $validated['discount_value'] = $request->input('discount_value');
        $validated['is_1_rupee'] = $request->has('is_1_rupee') ? 1 : 0;

        // For normal_list, set default values
        if ($listType === 'normal_list') {
            if (empty($validated['status'])) {
                $validated['status'] = 'active';
            }
            // Set reserve_price to minimum_bid value or keep existing if not provided
            if (empty($validated['reserve_price'])) {
                $validated['reserve_price'] = $validated['minimum_bid'] ?? $auction->reserve_price ?? 0;
            }
            // Set start_date and end_date to null if not provided
            if (empty($validated['start_date'])) {
                $validated['start_date'] = null;
            }
            if (empty($validated['end_date'])) {
                $validated['end_date'] = null;
            }
        } else {
            // For Auction list type, ensure product_condition is set (default to 'old' if missing)
            if (empty($validated['product_condition'])) {
                $validated['product_condition'] = 'old';
            }
        }

        // Set Time to 12 AM (00:00:00)
        if (!empty($validated['end_date'])) {
            $validated['end_date'] = \Carbon\Carbon::parse($validated['end_date'])->setTime(0, 0, 0)->format('Y-m-d H:i:s');
        }

        // NEW fields are already in $validated — just update:
        $auction->update($validated);

        // Handle Variations Update
        if ($listType === 'normal_list' && $request->has('variations')) {
            $variations = $request->input('variations');
            if (is_string($variations)) {
                $variations = json_decode($variations, true);
            }

            // For simplicity, delete old and create new
            $auction->variations()->delete();

            if (is_array($variations)) {
                foreach ($variations as $variation) {
                    if (!empty($variation['name']) && !empty($variation['price'])) {
                        ProductVariation::create([
                            'auction_id' => $auction->id,
                            'name' => $variation['name'],
                            'price' => $variation['price'],
                            'discount_type' => $variation['discount_type'] ?? null,
                            'discount_value' => $variation['discount_value'] ?? null,
                        ]);
                    }
                }
            }
        }



        // Send Featured Email Logic
        if ($request->has('send_featured_email') && $request->input('featured_name') == 'home_featured') {
            $user = User::find($auction->user_id);
            if ($user) {
                try {
                    Mail::to($user->email)->send(new FeaturedListingNotification($user, $auction));
                } catch (\Exception $e) {
                    \Log::error("Failed to send Featured Notification email: " . $e->getMessage());
                }
            }
        }

        return redirect()->route('auctions.index')->with('success', 'Auction updated successfully');
    }


    public function destroy(Auction $auction)
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
        $product = Auction::where('status', 'active')->withMax('bids', 'bid_amount')->latest()->get()->take(9);

        // Add owner data for each product
        foreach ($product as $products) {
            $user = User::find($products->user_id);
            $products->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $product]);
    }

    public function get_featured()
    {
        // 1. Fetch ALL active featured products sorted by latest
        $allFeatured = Auction::where('featured_name', 'home_featured')
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
        $maxCount = $grouped->map->count()->max(); // Find the largest category size

        for ($i = 0; $i < $maxCount; $i++) {
            foreach ($grouped as $group) {
                if (isset($group[$i])) {
                    $products->push($group[$i]);
                }
            }
        }

        // Add owner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }
    public function get_featured_vehicle()
    {
        $product = Auction::where('featured_name', 'vehicle_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_featured_service()
    {
        $product = Auction::where('featured_name', 'service_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_featured_realstate()
    {
        $product = Auction::where('featured_name', 'realstate_featured')
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }
    public function get_vehicle()
    {
        $product = Auction::whereBetween('category_id', [190, 200])->orWhere('category_id', 214)->where("status", "active")->latest()->get();

        return response()->json(['product' => $product]);
    }
    public function get_realestate()
    {
        $product = Auction::whereBetween('category_id', [207, 211])->orWhere('category_id', 216)->where("status", "active")->latest()->get();
        return response()->json(['product' => $product]);
    }
    public function get_service()
    {
        $product = Auction::whereBetween('category_id', [201, 206])->orWhere('category_id', 215)
            ->where("status", "active")
            ->latest()
            ->get();
        return response()->json(['product' => $product]);
    }

    // Latest Vehicles API - category_id = 311, latest 12
    public function get_latest_vehicles()
    {
        $products = Auction::where('category_id', 311)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
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
        $products = Auction::where('category_id', 222)
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
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
        $products = Auction::where('list_type', 'normal_list')
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
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
        $products = Auction::where(function ($query) {
            $query->where('list_type', 'auction')
                ->orWhereNull('list_type');
        })
            ->where('status', 'active')
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json(['product' => $products]);
    }

    public function get_one_rupee_auctions()
    {
        $products = Auction::where('is_1_rupee', 1)
            ->whereIn('status', ['active', 'awarded'])
            ->withMax('bids', 'bid_amount')
            ->latest()
            ->take(12)
            ->get();

        // Add owner and winner data for each product
        foreach ($products as $product) {
            $user = User::find($product->user_id);
            $product->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];

            if ($product->status == 'awarded' && $product->winner_id) {
                $winner = User::find($product->winner_id);
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
        $products = Auction::where('is_1_rupee', 1)
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

            if ($product->status == 'awarded' && $product->winner_id) {
                $winner = User::find($product->winner_id);
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
            $product = Auction::findOrFail($id);
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
        $id = Auction::where('slug', $slug)->value('id');

        $pro = Auction::with('variations')->find($id);
        // Eager load user relationship to get profile_pic
        $bids = Bid::where('auction_id', $id)->with('user')->latest()->get();
        $user = User::find(optional($pro)->user_id);

        $product['product'] = [$pro];
        $product['owner'][] = [
            "name" => $user->name ?? '',
            "profile" => $user->profile_pic ?? '',
        ];

        if ($pro->status == 'awarded' && $pro->winner_id) {
            $winner = User::find($pro->winner_id);
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
        $sameCategory = Auction::where('category_id', $pro->category_id)
            ->where('id', '!=', $id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // 2. 1 Rupee Auctions
        $oneRupee = Auction::where('is_1_rupee', 1)
            ->where('id', '!=', $id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // 3. Latest Products
        $latest = Auction::where('id', '!=', $id)
            ->where('status', 'active')
            ->latest()
            ->take(12)
            ->get();

        // Merge collections: Same Category first, then 1 Rupee, then Latest.
        // unique('id') removes duplicates (keeping the first occurrence, which respects our priority).
        // take(12) limits the final result.
        $relatedAuctions = $sameCategory->concat($oneRupee)->concat($latest)->unique('id')->take(12);

        $relatedItemsArray = [];
        foreach ($relatedAuctions as $auction) {
            $owner = User::find($auction->user_id);
            $relatedItemsArray[] = [
                'id' => $auction->id,
                'slug' => $auction->slug,
                'title' => $auction->title,
                'album' => $auction->album,
                'image' => $auction->image,
                'current_highest_bid' => $auction->current_highest_bid ?? $auction->minimum_bid,
                'minimum_bid' => $auction->minimum_bid,
                'start_date' => $auction->start_date,
                'end_date' => $auction->end_date,
                'list_type' => $auction->list_type,
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
        } else {
            // If it's a string, fetch category by slug
            $cat_id = AuctionCategory::where('name', $id)->get()->pluck('id');
        }
        $cat_id = AuctionCategory::where('name', $id)->get()->pluck('id');
        $product = Auction::where('child_category_id', $cat_id)->latest()->get();
        //dd($product);

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
        // ------------------------------------------------------------
        // Verification gate: allow if EITHER Individual OR Corporate is approved
        // ------------------------------------------------------------
        $userId = auth()->id();

        $individual = IndividualVerification::where('user_id', $userId)->first();
        $corporate = CorporateVerification::where('user_id', $userId)->first();

        // helper closures
        $isApproved = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['approved', 'verified'], true);
        };
        $isPending = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['pending', 'not_verified', 'submitted'], true);
        };
        $isRejected = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['rejected', 'declined'], true);
        };

        $verificationUrl = 'https://xpertbid.com/account?tab=identity_verification';

        // Case A: neither record exists
        if (!$individual && !$corporate) {

            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'You need to complete verification before placing a bid. Please verify your identity (individual or corporate).',
                'verify_url' => $verificationUrl,
                'which' => 'none',
            ], 403);
        }

        // Case B: approved if either side approved
        if ($isApproved($individual) || $isApproved($corporate)) {
            // pass
        } else {
            // Not approved anywhere — tell most relevant state
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

            // Fallback: some unknown status
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'Verification is not complete. Please complete verification to proceed.',
                'verify_url' => $verificationUrl,
                'which' => ($individual ? 'individual' : 'corporate'),
                'debug_status' => [
                    'individual' => $individual->status ?? null,
                    'corporate' => $corporate->status ?? null,
                ],
            ], 403);
        }

        $user = auth()->user();
        $auction = Auction::findOrFail($auctionId);

        // Logic to handle the bid

        // Send notification to the previous highest bidder
        $oneSignalService = new OneSignalService();
        $oneSignalService->sendNotification($previousHighestBidder->oneSignalPlayerId, 'You have been outbid.');

        // Send notification to the current highest bidder (you, the user who just won)
        if ($user->id == $auction->current_bidder_id) {
            $oneSignalService->sendNotification($user->oneSignalPlayerId, 'Congratulations, you won the auction!');
        }

        return response()->json(['message' => 'Bid placed successfully']);
    }

    public function canBid(Auction $auction)
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
            // Add new property fields
            'developer' => 'nullable|string|max:255',
            'location_url' => 'nullable|max:1024',
            'delivery_date' => 'nullable|date',
            'sale_starts' => 'nullable|date',
            'payment_plan' => 'nullable|string',
            'number_of_buildings' => 'nullable|integer|min:0',
            'government_fee' => 'nullable|string',
            'nearby_location' => 'nullable|string',
            'amenities' => 'nullable|string',
            'facilities' => 'nullable|string',
            'discount_type' => 'nullable|in:percent,flat',
            'discount_value' => 'nullable|numeric',
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

        // Custom error messages
        $messages = [
            'title.required' => 'Please enter a title for your listing.',
            'title.min' => 'Title must be at least :min characters.',
            'title.max' => 'Title may not exceed :max characters.',
            'category_id.required' => 'Please select a category.',
            'category_id.integer' => 'Category must be a valid selection.',
            'category_id.exists' => 'Selected category does not exist.',
            'start_date.required' => 'Please select a start date.',
            'start_date.date' => 'Start date must be a valid date.',
            'end_date.required' => 'Please select an end date.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be on or after the start date.',
            'reserve_price.required' => 'Please set a reserve price.',
            'reserve_price.numeric' => 'Reserve price must be a number.',
            'minimum_bid.required' => 'Please enter the minimum bid amount.',
            'minimum_bid.numeric' => 'Minimum bid must be a number.',
            'description.required' => 'Please provide a description of your product.',
            'product_year.required' => 'Please specify the products year.',
            'product_condition.required' => 'Please select product condition (new or old).',
            'product_condition.in' => 'Product condition must be either new or old.',
            'list_type.required' => 'Please select a list type.',
            'list_type.in' => 'List type must be either auction or normal_list.',
            // Add custom error messages for new fields
            'location_url.url' => 'Please enter a valid URL.',
            'number_of_buildings.integer' => 'Number of buildings must be a whole number.',
            'number_of_buildings.min' => 'Number of buildings cannot be negative.',
        ];

        $validatedData = $request->validate($rules, $messages);

        // ------------------------------------------------------------
        // 2) Verification gate: allow if EITHER Individual OR Corporate is approved
        // ------------------------------------------------------------
        $userId = auth()->id();

        $individual = IndividualVerification::where('user_id', $userId)->first();
        $corporate = CorporateVerification::where('user_id', $userId)->first();

        // helper closures
        $isApproved = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['approved', 'verified'], true);
        };
        $isPending = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['pending', 'not_verified', 'submitted'], true);
        };
        $isRejected = function ($rec) {
            if (!$rec)
                return false;
            return in_array(strtolower($rec->status), ['rejected', 'declined'], true);
        };

        $verificationUrl = 'https://xpertbid.com/account?tab=identity_verification';

        // Case A: neither record exists
        if (!$individual && !$corporate) {

            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'You need to complete verification before creating a listing. Please verify your identity (individual or corporate).',
                'verify_url' => $verificationUrl,
                'which' => 'none',
            ], 403);
        }

        // Case B: approved if either side approved
        if ($isApproved($individual) || $isApproved($corporate)) {
            // pass
        } else {
            // Not approved anywhere — tell most relevant state
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

            // Fallback: some unknown status
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'Verification is not complete. Please complete verification to proceed.',
                'verify_url' => $verificationUrl,
                'which' => ($individual ? 'individual' : 'corporate'),
                'debug_status' => [
                    'individual' => $individual->status ?? null,
                    'corporate' => $corporate->status ?? null,
                ],
            ], 403);
        }

        // ------------------------------------------------------------
        // 3) Handle album images and videos (updated for video support)
        // ------------------------------------------------------------
        $albumsArray = [];
        if ($request->hasFile('album')) {
            $albumFiles = $request->file('album');
            if (!is_array($albumFiles)) {
                $albumFiles = [$albumFiles];
            }
            foreach ($albumFiles as $file) {
                $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                // Determine if it's a video or image
                if ($file->getMimeType() === 'video/mp4') {
                    $file->move(public_path('/assets/videos/auction/'), $albumName);
                    $albumsArray[] = '/assets/videos/auction/' . $albumName;
                } else {
                    $file->move(public_path('/assets/images/auction/'), $albumName);
                    $albumsArray[] = '/assets/images/auction/' . $albumName;
                }
            }
        }

        // ------------------------------------------------------------
        // 4) Create auction with all fields including new property fields
        // ------------------------------------------------------------
        // Determine image path: either from new upload or existing string
        $imagePath = null;
        if (count($albumsArray) > 0) {
            $imagePath = $albumsArray[0];
        } elseif ($request->filled('image')) {
            $imagePath = $request->input('image');
        }

        // Determine final album array (files + existing paths)
        // 1. Get existing paths from request
        $existingPaths = [];
        if ($request->filled('album')) {
            $inputAlbum = $request->input('album');
            // If it's a JSON string, decode it. If array, use as is.
            if (is_string($inputAlbum)) {
                $decoded = json_decode($inputAlbum, true);
                if (is_array($decoded)) {
                    $existingPaths = $decoded;
                }
            } elseif (is_array($inputAlbum)) {
                $existingPaths = $inputAlbum;
            }
        }

        // 2. Merge existing paths with new uploads
        // Appending new uploads to the end of existing ones
        $finalAlbumArray = array_merge($existingPaths, $albumsArray);

        // ------------------------------------------------------------
        // 4) Create auction with all fields including new property fields
        // ------------------------------------------------------------
        
        // Set Time to 12 AM (00:00:00)
        if (!empty($validatedData['end_date'])) {
            $validatedData['end_date'] = \Carbon\Carbon::parse($validatedData['end_date'])->setTime(0, 0, 0)->format('Y-m-d H:i:s');
        }

        $auctionData = array_merge($validatedData, [
            'image' => $imagePath,  // cover image
            'album' => json_encode($finalAlbumArray),
            'user_id' => auth()->user()->id,
            'status' => 'inactive', // default status
            'create_category' => $request->input('create_category'),
            'list_type' => $listType,
            // The new property fields and category_id are already included in $validatedData
            // They will be automatically added to the auction record
        ]);

        // For normal_list, set default values
        if ($listType === 'normal_list') {
            // Status remains 'inactive' for normal_list (as set above)
            // Set reserve_price to minimum_bid value or 0 if not provided
            if (empty($auctionData['reserve_price']) || $auctionData['reserve_price'] === null) {
                $auctionData['reserve_price'] = !empty($auctionData['minimum_bid']) ? $auctionData['minimum_bid'] : 0;
            }
            // Set start_date and end_date to null
            $auctionData['start_date'] = null;
            $auctionData['end_date'] = null;
        }

        $auction = Auction::create($auctionData);

        // Handle Variations
        if ($listType === 'normal_list' && $request->has('variations')) {
            $variations = $request->input('variations');
            if (is_string($variations)) {
                $variations = json_decode($variations, true);
            }
            if (is_array($variations)) {
                foreach ($variations as $variation) {
                    if (!empty($variation['name']) && !empty($variation['price'])) {
                        ProductVariation::create([
                            'auction_id' => $auction->id,
                            'name' => $variation['name'],
                            'price' => $variation['price'],
                            'discount_type' => $variation['discount_type'] ?? null,
                            'discount_value' => $variation['discount_value'] ?? null,
                        ]);
                    }
                }
            }
        }

        // ------------------------------------------------------------
        // 5) Send email to user (try/catch)
        // ------------------------------------------------------------
        $user = auth()->user();
        $firstName = $user->name;
        $listingTitle = $auction->title;
        // Only parse end_date if it exists (for normal_list it might be null)
        $auctionEnds = $auction->end_date ? \Carbon\Carbon::parse($auction->end_date)->toDayDateTimeString() : 'N/A';

        try {
            Mail::to($user->email)->send(
                new \App\Mail\NewListingNotification($firstName, $listingTitle, $auctionEnds)
            );
            Mail::to(env('ADMIN_EMAIL'))->send(
                new \App\Mail\NewListingNotification($firstName, $listingTitle, $auctionEnds)
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send NewListingNotification: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Auction created successfully',
            'auction_id' => $auction->id,
            'auction' => $auction,
        ], 201);
    }

    public function api_update(Request $request, $id)
    {
        // 2) Load auction first to get existing start_date
        $auction = Auction::findOrFail($id);

        // Determine list type (allow changing checks from request, fallback to existing)
        $listType = $request->input('list_type', $auction->list_type ?? 'auction');

        // Base Rules
        $rules = [
            'title' => 'required|min:2|max:100',
            'category_id' => 'required',
            'description' => 'required',
            'product_year' => 'required',
            'product_location' => 'nullable',
            'sub_category_id' => 'nullable',
            'child_category_id' => 'nullable',
            // New property fields
            'developer' => 'nullable|string|max:255',
            'location_url' => 'nullable|max:1024',
            'delivery_date' => 'nullable|date',
            'sale_starts' => 'nullable|date',
            'payment_plan' => 'nullable|string',
            'number_of_buildings' => 'nullable|integer|min:0',
            'government_fee' => 'nullable|string',
            'nearby_location' => 'nullable|string',
            'amenities' => 'nullable|string',
            'facilities' => 'nullable|string',
            'discount_type' => 'nullable|in:percent,flat',
            'discount_value' => 'nullable|numeric',
        ];

        // Conditional Rules
        if ($listType === 'normal_list') {
            $rules['product_condition'] = 'required|in:new,old';
            $rules['minimum_bid'] = 'required|numeric'; // Price
            $rules['start_date'] = 'nullable|date';
            $rules['end_date'] = 'nullable|date';
            $rules['reserve_price'] = 'nullable|numeric';
        } else {
            // Auction default
            $rules['start_date'] = 'nullable|date'; // Use existing if not provided
            $rules['end_date'] = 'required|date';
            $rules['reserve_price'] = 'required|numeric';
            $rules['minimum_bid'] = 'required|numeric';
        }

        // 1) Validate
        $validatedData = $request->validate($rules);

        // Use existing start_date if not provided in request
        if (empty($validatedData['start_date']) || $validatedData['start_date'] === null || $validatedData['start_date'] === '') {
            $validatedData['start_date'] = $auction->start_date;
        }

        // Validate end_date is after or equal to start_date (after we've set start_date)
        if (!empty($validatedData['end_date']) && !empty($validatedData['start_date'])) {
            if (strtotime($validatedData['end_date']) < strtotime($validatedData['start_date'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'End date must be on or after the start date.',
                    'errors' => ['end_date' => ['End date must be on or after the start date.']]
                ], 422);
            }
        }

        $oldStatus = (string) ($auction->status ?? ''); // capture old status early

        // 3) Unified verification gate (Individual OR Corporate)
        $userIdForUpdate = auth()->id();
        $individualUpdate = IndividualVerification::where('user_id', $userIdForUpdate)->first();
        $corporateUpdate = CorporateVerification::where('user_id', $userIdForUpdate)->first();

        $normUpdate = function ($rec) {
            return strtolower($rec->status ?? '');
        };
        $isApprovedUpdate = function ($rec) use ($normUpdate) {
            if (!$rec)
                return false;
            return in_array($normUpdate($rec), ['approved', 'verified'], true);
        };
        $isPendingUpdate = function ($rec) use ($normUpdate) {
            if (!$rec)
                return false;
            return in_array($normUpdate($rec), ['pending', 'not_verified', 'submitted'], true);
        };
        $isRejectedUpdate = function ($rec) use ($normUpdate) {
            if (!$rec)
                return false;
            return in_array($normUpdate($rec), ['rejected', 'declined'], true);
        };

        $verificationUrlUpdate = 'https://xpertbid.com/account?tab=identity_verification';

        if (!$individualUpdate && !$corporateUpdate) {
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'You need to complete verification before updating a listing. Please verify your identity (individual or corporate).',
                'verify_url' => $verificationUrlUpdate,
                'which' => 'none',
            ], 403);
        }

        if (!($isApprovedUpdate($individualUpdate) || $isApprovedUpdate($corporateUpdate))) {
            if ($isPendingUpdate($individualUpdate) || $isPendingUpdate($corporateUpdate)) {
                return response()->json([
                    'success' => false,
                    'is_verified' => false,
                    'message' => 'Your verification has been submitted and is currently pending review.',
                    'verify_url' => $verificationUrlUpdate,
                    'which' => $isPendingUpdate($corporateUpdate) ? 'corporate' : 'individual',
                ], 403);
            }
            if ($isRejectedUpdate($individualUpdate) || $isRejectedUpdate($corporateUpdate)) {
                return response()->json([
                    'success' => false,
                    'is_verified' => false,
                    'message' => 'Your verification was rejected. Please resubmit the required documents.',
                    'verify_url' => $verificationUrlUpdate,
                    'which' => $isRejectedUpdate($corporateUpdate) ? 'corporate' : 'individual',
                ], 403);
            }
            return response()->json([
                'success' => false,
                'is_verified' => false,
                'message' => 'Verification is not complete. Please complete verification to proceed.',
                'verify_url' => $verificationUrlUpdate,
                'which' => ($individualUpdate ? 'individual' : 'corporate'),
                'debug_status' => [
                    'individual' => $individualUpdate->status ?? null,
                    'corporate' => $corporateUpdate->status ?? null,
                ],
            ], 403);
        }

        // 4) Album handling
        $newAlbum = [];
        $dest = public_path('/assets/images/auction/');
        if (!is_dir($dest))
            @mkdir($dest, 0755, true);

        if ($request->hasFile('album')) {
            $albumFiles = $request->file('album');
            if (!is_array($albumFiles))
                $albumFiles = [$albumFiles];

            foreach ($albumFiles as $file) {
                if (!$file->isValid())
                    continue;
                $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($dest, $name);
                $newAlbum[] = '/assets/images/auction/' . $name;
            }
        }

        // Current album from DB → array
        $currentAlbumRaw = $auction->album;
        $currentAlbumArr = [];
        if (is_array($currentAlbumRaw)) {
            $currentAlbumArr = $currentAlbumRaw;
        } elseif (is_string($currentAlbumRaw)) {
            $decoded = json_decode($currentAlbumRaw, true);
            $currentAlbumArr = is_array($decoded) ? $decoded : [];
        }

        // Decide album & image values
        if (count($newAlbum) > 0) {
            // New uploads replace album completely
            $albumValue = json_encode($newAlbum);
            $imageValue = $newAlbum[0];
        } else {
            // Keep old album as-is
            $albumValue = json_encode($currentAlbumArr ?: ($auction->image ? [$auction->image] : []));
            $imageValue = $auction->image;
        }

        // ✅ Respect cover_from_old when NO new upload is provided
        if (!$request->hasFile('album') && $request->filled('cover_from_old')) {
            $cover = $request->input('cover_from_old');

            // normalize if full http(s) URL given
            if (strpos($cover, 'http://') === 0 || strpos($cover, 'https://') === 0) {
                $cover = parse_url($cover, PHP_URL_PATH) ?: $cover;
            }

            // If cover is present in old album, or you trust frontend, set it
            $albumDecoded = json_decode($albumValue, true) ?: [];
            if (in_array($cover, $albumDecoded, true)) {
                $imageValue = $cover;
            } else {
                $imageValue = $cover;
            }
        }

        // 5) Vehicle Verification Update (conditional)
        if ($request->filled('vehicle_make_model') && $request->filled('year_of_manufacture') && $request->filled('chassis_vin')) {
            $vehicle = \App\Models\VehicleVerification::where('auction_id', $auction->id)->first();

            $vehicleData = [
                'user_id' => auth()->id(),
                'auction_id' => $auction->id,
                'vehicle_make_model' => $request->input('vehicle_make_model'),
                'year_of_manufacture' => $request->input('year_of_manufacture'),
                'chassis_vin' => $request->input('chassis_vin'),
                'status' => 'not_verified',
            ];

            $publicPaths = [];
            $vDest = public_path('assets/images/vehicle_verifications');
            if (!is_dir($vDest))
                @mkdir($vDest, 0755, true);

            if ($request->hasFile('vehicle_documents')) {
                foreach ($request->file('vehicle_documents') as $file) {
                    if (!$file->isValid())
                        continue;
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move($vDest, $filename);
                    $publicPaths[] = "assets/images/vehicle_verifications/{$filename}";
                }
                $vehicleData['vehicle_documents'] = $publicPaths;
            }

            if ($vehicle && !$request->hasFile('vehicle_documents')) {
                $vehicleData['vehicle_documents'] = $vehicle->vehicle_documents;
            }

            if ($vehicle)
                $vehicle->update($vehicleData);
            else {
                $vehicleData['vehicle_documents'] = $publicPaths;
                \App\Models\VehicleVerification::create($vehicleData);
            }
        }

        // 6) Property Verification Update (conditional)
        if ($request->filled('property_type') && $request->filled('property_address') && $request->filled('title_deed_number')) {
            $property = \App\Models\PropertyVerification::where('auction_id', $auction->id)->first();

            $propertyData = [
                'user_id' => auth()->id(),
                'auction_id' => $auction->id,
                'property_type' => $request->input('property_type'),
                'property_address' => $request->input('property_address'),
                'title_deed_number' => $request->input('title_deed_number'),
                'status' => 'not_verified',
            ];

            $paths = [];
            $pDest = public_path('assets/images/property_verifications');
            if (!is_dir($pDest))
                @mkdir($pDest, 0755, true);

            if ($request->hasFile('property_documents')) {
                foreach ($request->file('property_documents') as $file) {
                    if (!$file->isValid())
                        continue;
                    $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $file->move($pDest, $filename);
                    $paths[] = 'assets/images/property_verifications/' . $filename;
                }
                $propertyData['property_documents'] = $paths;
            }

            if ($property && !$request->hasFile('property_documents')) {
                $propertyData['property_documents'] = $property->property_documents;
            }

            if ($property)
                $property->update($propertyData);
            else {
                $propertyData['property_documents'] = $paths;
                \App\Models\PropertyVerification::create($propertyData);
            }
        }

        // 7) Update auction (mark as resubmit)
        $auctionData = array_merge($validatedData, [
            'image' => $imageValue,
            'album' => $albumValue,
            'create_category' => $request->input('create_category'),
            'status' => 'resubmit', // business rule
            'list_type' => $listType,
        ]);

        // Set Time to 12 AM (00:00:00)
        if (!empty($auctionData['end_date'])) {
            $auctionData['end_date'] = \Carbon\Carbon::parse($auctionData['end_date'])->setTime(0, 0, 0)->format('Y-m-d H:i:s');
        }

        // For normal_list, cleanup fields
        if ($listType === 'normal_list') {
            $auctionData['start_date'] = null;
            $auctionData['end_date'] = null;
            if (empty($auctionData['reserve_price'])) {
                $auctionData['reserve_price'] = $auctionData['minimum_bid'] ?? 0;
            }
        }

        $auction->update($auctionData);

        // Handle Variations
        if ($listType === 'normal_list' && $request->has('variations')) {
            $variations = $request->input('variations');
            if (is_string($variations)) {
                $variations = json_decode($variations, true);
            }

            // For simplicity, delete old and create new
            $auction->variations()->delete();

            if (is_array($variations)) {
                foreach ($variations as $variation) {
                    if (!empty($variation['name']) && !empty($variation['price'])) {
                        ProductVariation::create([
                            'auction_id' => $auction->id,
                            'name' => $variation['name'],
                            'price' => $variation['price'],
                            'discount_type' => $variation['discount_type'] ?? null,
                            'discount_value' => $variation['discount_value'] ?? null,
                        ]);
                    }
                }
            }
        }

        // 8) Email: send only if the status changed (e.g., to 'resubmit')
        $newStatus = (string) ($auction->status ?? '');
        $emailed = false;
        $mailError = null;

        if ($oldStatus !== $newStatus) {
            try {
                // Figure out the best recipient email
                $recipient = optional($auction->user)->email
                    ?? optional(auth()->user())->email
                    ?? null;

                if ($recipient) {
                    Mail::to($recipient)
                        ->bcc(env('ADMIN_EMAIL')) // optional admin copy
                        ->send(new AuctionStatusUpdated($auction, $oldStatus, $newStatus));
                    $emailed = true;
                }
            } catch (\Throwable $e) {
                // Don't break the API if mail fails; include a flag for client logs
                $mailError = app()->hasDebugModeEnabled() ? $e->getMessage() : 'mail_failed';
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Auction updated successfully',
            'auction' => $auction,
            'email' => [
                'attempted' => ($oldStatus !== $newStatus),
                'sent' => $emailed,
                'error' => $mailError,
            ],
        ]);
    }




    public function cancel(Request $request, $id)
    {
        // 1. If explicit "is_draft" flag is set, force delete from Auction1
        if ($request->has('is_draft') && filter_var($request->input('is_draft'), FILTER_VALIDATE_BOOLEAN)) {
            $draft = Auction1::find($id);
            if ($draft) {
                $draft->forceDelete();
                return response()->json([
                    'message' => 'Draft deleted successfully from auction_1 (explicit)',
                    'listing' => $draft,
                ]);
            }
            return response()->json(['message' => 'Draft not found in auction_1'], 404);
        }

        // 2. Default: Check Active first
        $listing = Auction::find($id);

        if (!$listing) {
            // Check in drafts (Auction1)
            $draft = Auction1::find($id);
            if ($draft) {
                $draft->forceDelete();
                return response()->json([
                    'message' => 'Draft deleted successfully from auction_1',
                    'listing' => $draft,
                ]);
            }
            return response()->json(['message' => 'Listing not found'], 404);
        }

        // (Optional) authorization — uncomment if you have policies
        // $this->authorize('update', $listing);

        $oldStatus = (string) ($listing->status ?? '');
        $newStatus = 'cancelled';

        // No-op if already cancelled
        if ($oldStatus === $newStatus) {
            return response()->json([
                'message' => 'Listing is already cancelled.',
                'listing' => $listing,
                'email' => ['attempted' => false, 'sent' => false, 'error' => null],
            ]);
        }

        // Update status
        $listing->status = $newStatus;
        $listing->save();

        // Email notify owner + admin (safe fail)
        $emailed = false;
        $mailError = null;

        try {
            $recipient = optional($listing->user)->email
                ?? optional(auth()->user())->email
                ?? null;

            if ($recipient) {
                Mail::to($recipient)
                    ->bcc(env('ADMIN_EMAIL')) // optional admin copy
                    ->send(new AuctionStatusUpdated($listing, $oldStatus, $newStatus));
                // ->queue(new AuctionStatusUpdated($listing, $oldStatus, $newStatus)); // use queue if desired
                $emailed = true;
            }
        } catch (\Throwable $e) {
            $mailError = app()->hasDebugModeEnabled() ? $e->getMessage() : 'mail_failed';
        }

        return response()->json([
            'message' => 'Listing cancelled successfully',
            'listing' => $listing,
            'email' => [
                'attempted' => true,
                'sent' => $emailed,
                'error' => $mailError,
            ],
        ]);
    }

    public function api_show($id)
    {
        // First try to find in auctions table
        $auction = Auction::with([
            'property_verification',
            'vehicle_verification',
            'variations'
        ])->find($id);

        // If not found, try to find in auctions_1 (drafts) table
        if (!$auction) {
            $draft = Auction1::find($id);
            if ($draft) {
                // Convert draft to auction-like format
                $auction = (object) [
                    'id' => $draft->id,
                    'title' => $draft->title,
                    'user_id' => $draft->user_id,
                    'category_id' => $draft->category_id,
                    'sub_category_id' => $draft->sub_category_id,
                    'child_category_id' => $draft->child_category_id,
                    'description' => $draft->description,
                    'minimum_bid' => $draft->minimum_bid,
                    'reserve_price' => $draft->reserve_price,
                    'start_date' => $draft->start_date,
                    'end_date' => $draft->end_date,
                    'product_year' => $draft->product_year,
                    'product_location' => $draft->product_location,
                    'state_id' => $draft->state_id,
                    'city_id' => $draft->city_id,
                    'image' => $draft->image,
                    'album' => $draft->album,
                    'list_type' => $draft->list_type,
                    'product_condition' => $draft->product_condition,
                    'create_category' => $draft->create_category,
                    'developer' => $draft->developer,
                    'location_url' => $draft->location_url,
                    'delivery_date' => $draft->delivery_date,
                    'sale_starts' => $draft->sale_starts,
                    'payment_plan' => $draft->payment_plan,
                    'number_of_buildings' => $draft->number_of_buildings,
                    'government_fee' => $draft->government_fee,
                    'nearby_location' => $draft->nearby_location,
                    'amenities' => $draft->amenities,
                    'facilities' => $draft->facilities,
                    'status' => $draft->status,
                    'is_draft' => true,
                    'property_verification' => null,
                    'vehicle_verification' => null,
                ];
            }
        }

        if (!$auction) {
            return response()->json(['message' => 'Auction not found'], 404);
        }

        return response()->json(['auction' => $auction]);
    }

    public function listings()
    {
        $user = Auth::user();

        // Get published auctions
        $auctions = Auction::where('user_id', $user->id)
            ->with('bids') // Make sure to eager load bids
            ->get()
            ->map(function ($auction) {
                $highestBid = $auction->bids->max('bid_amount'); // Highest bid from related bids
                return [
                    'id' => $auction->id,
                    'slug' => $auction->slug,
                    'title' => $auction->title,
                    'album' => $auction->album,
                    'start_date' => $auction->start_date,
                    'end_date' => $auction->end_date,
                    'featured_name' => $auction->featured_name,
                    'status' => $auction->status,
                    'currentBid' => $highestBid,
                    'is_draft' => false, // Published listing
                    'created_at' => $auction->created_at,
                    'list_type' => $auction->list_type,
                    'minimum_bid' => $auction->minimum_bid,
                    'reserve_price' => $auction->reserve_price,
                ];
            });

        // Get saved drafts from auctions_1 table - get ALL drafts including soft-deleted ones
        // Use withTrashed() to include soft-deleted records (deleted_at is not null)
        $drafts = Auction1::where('user_id', $user->id)
            ->withTrashed() // Include soft-deleted records
            ->get() // Get all records for this user, regardless of status or deleted_at
            ->filter(function ($draft) {
                // Filter to only include drafts (status is 'draft' or null/empty)
                $status = strtolower(trim($draft->status ?? ''));
                return empty($status) || $status === 'draft';
            })
            ->map(function ($draft) {
                return [
                    'id' => $draft->id,
                    'slug' => $draft->slug ?? null,
                    'title' => $draft->title ?? 'Untitled Draft',
                    'album' => $draft->album,
                    'image' => $draft->image,
                    'start_date' => $draft->start_date,
                    'end_date' => $draft->end_date,
                    'featured_name' => null,
                    'status' => 'Draft',
                    'currentBid' => 0,
                    'is_draft' => true, // This is a draft
                    'created_at' => $draft->created_at,
                    'deleted_at' => $draft->deleted_at, // Include deleted_at to show if it's soft-deleted
                    'list_type' => $draft->list_type,
                    'minimum_bid' => $draft->minimum_bid,
                    'reserve_price' => $draft->reserve_price,
                ];
            })
            ->values(); // Re-index the collection

        // Debug: Log counts
        \Log::info('Listings API - User ID: ' . $user->id);
        \Log::info('Published auctions count: ' . $auctions->count());
        \Log::info('Drafts count: ' . $drafts->count());

        // Merge auctions and drafts, sort by created_at (newest first)
        $allListings = $auctions->concat($drafts)->sortByDesc(function ($item) {
            return $item['created_at'] ?? now();
        })->values();

        \Log::info('Total listings count: ' . $allListings->count());

        return Inertia::render('Auctions/MyListings', [
            'auctions' => $allListings
        ]);
    }


    public function dashboard()
    {
        $user = Auth::user();

        // Auctions for the user
        $auctions = Auction::where('user_id', $user->id)->where('status', 'active')->get();

        // Bid count for the user
        $bidCount = Bid::where('user_id', $user->id)->count();

        // Wallet balance for the user
        // Yahan assume kar rahe hain ke aapke paas Wallet model aur users table mein wallet data hai.
        // Agar wallet ka table ya model nahin hai, to uske hisaab se code adjust karein.
        $walletAmount = Wallet::where('user_id', $user->id)->value('balance') ?? 0;

        return response()->json([
            'auction' => $auctions,
            'bid' => $bidCount,
            'wallet' => $walletAmount,
        ]);
    }

    public function getAuctionsByStatus(Request $request)
    {
        $user = $request->user(); // Authenticated user
        $status = $request->query('status');

        $auctions = [];

        switch ($status) {
            case 'won':
                $auctions = Auction::where('winner_id', $user->id)
                    ->where(function ($query) {
                        $query->where('status', 'awarded')
                            ->orWhere('status', 'closed');
                    })
                    ->with([
                        'bids' => function ($query) {
                            $query->orderBy('bid_amount', 'desc')->limit(1);
                        },
                        'user:id,name,profile_pic'
                    ])
                    ->get()
                    ->map(function ($auction) {
                        $highestBid = $auction->bids->first();
                        $auction->current_highest_bid = $highestBid ? $highestBid->bid_amount : ($auction->reserve_price ?? $auction->minimum_bid ?? 0);
                        // Map user to owner format for frontend
                        if ($auction->user) {
                            $auction->owner = [
                                'name' => $auction->user->name,
                                'profile' => $auction->user->profile_pic
                            ];
                            $auction->user_name = $auction->user->name;
                            $auction->profile_pic = $auction->user->profile_pic;
                        }
                        return $auction;
                    });
                break;

            case 'lost':
                $auctions = Auction::whereHas('bids', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                    ->where(function ($query) use ($user) {
                        $query->where('winner_id', '!=', $user->id)
                            ->where(function ($q) {
                                $q->where('status', 'closed')
                                    ->orWhere('status', 'awarded');
                            });
                    })
                    ->with([
                        'bids' => function ($query) {
                            $query->orderBy('bid_amount', 'desc')->limit(1);
                        },
                        'user:id,name,profile_pic'
                    ])
                    ->get()
                    ->map(function ($auction) {
                        // Get highest bid
                        $highestBid = $auction->bids->first();
                        $auction->current_highest_bid = $highestBid ? $highestBid->bid_amount : ($auction->reserve_price ?? $auction->minimum_bid ?? 0);

                        // Map user to owner format for frontend
                        if ($auction->user) {
                            $auction->owner = [
                                'name' => $auction->user->name,
                                'profile' => $auction->user->profile_pic
                            ];
                            $auction->user_name = $auction->user->name;
                            $auction->profile_pic = $auction->user->profile_pic;
                        }
                        return $auction;
                    });
                break;

            case 'active':
                $auctions = Auction::whereHas('bids', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                    ->where('status', 'active')
                    ->whereNull('winner_id')
                    ->whereDoesntHave('bids', function ($query) {
                        $query->whereRaw('bids.bid_amount > (SELECT MAX(bids.bid_amount) FROM bids WHERE bids.auction_id = auctions.id)');
                    })
                    ->with([
                        'bids' => function ($query) {
                            $query->orderBy('bid_amount', 'desc')->limit(1);
                        },
                        'user:id,name,profile_pic'
                    ])
                    ->get()
                    ->map(function ($auction) {
                        // Get highest bid
                        $highestBid = $auction->bids->first();
                        $auction->current_highest_bid = $highestBid ? $highestBid->bid_amount : ($auction->reserve_price ?? $auction->minimum_bid ?? 0);

                        // Map user to owner format for frontend
                        if ($auction->user) {
                            $auction->owner = [
                                'name' => $auction->user->name,
                                'profile' => $auction->user->profile_pic
                            ];
                            $auction->user_name = $auction->user->name;
                            $auction->profile_pic = $auction->user->profile_pic;
                        }
                        return $auction;
                    });
                break;

            default:
                return response()->json(['error' => 'Invalid status'], 400);
        }

        return response()->json([
            'status' => $status,
            'auctions' => $auctions,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['auctions' => []]);
        }

        $auctions = Auction::with('user')
            ->where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json(['auctions' => $auctions]);
    }
    //new
    public function finalizeAuction($auctionId)
    {
        $auction = Auction::findOrFail($auctionId);

        // Ensure the auction has ended before finalizing
        if ($auction->end_date < now()) {
            // Get the highest bid (winner)
            $highestBid = $auction->bids()->orderByDesc('bid_amount')->first();
            if (!$highestBid) {
                return response()->json(['error' => 'No bids found for this auction.'], 400);
            }
            $winner = $highestBid->user;

            // Update the auction status and record the winner
            $auction->update([
                'status' => 'completed',
                'winner_id' => $winner->id,
            ]);

            // Send Auction Won Notification to the winner
            $firstName = $winner->name; // Winner's first name
            $listingTitle = $auction->title; // Adjust if your Auction model uses a different field for the title
            $winningBidAmount = $highestBid->bid_amount;
            // Format the auction end date as desired, e.g., using Carbon formatting
            $auctionEnded = \Carbon\Carbon::parse($auction->end_date)->toDayDateTimeString();
            // Create a payment link to route where winner can complete their payment; adjust route as needed
            $completePaymentLink = route('complete.payment', ['auction' => $auction->id, 'user' => $winner->id]);

            Mail::to($winner->email)
                ->send(new AuctionWonNotification($firstName, $listingTitle, $winningBidAmount, $auctionEnded, $completePaymentLink));

            // In-app notification to winner
            try {
                NewNotification::create([
                    'user_id' => $winner->id,
                    'title' => 'Congratulations! You Won the Auction',
                    'message' => "You have won the auction for \"{$auction->title}\" with a bid of " . number_format($winningBidAmount, 2),
                    'type' => 'auction',
                    'image_url' => NewNotification::getImageForType('auction'),
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to create winner notification', [
                    'auction_id' => $auction->id,
                    'winner_id' => $winner->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Retrieve all bids except the winning bid
            $losingBids = $auction->bids()->where('user_id', '!=', $winner->id)->get();
            // Get unique losing users (in case a user bid multiple times)
            $losingUsers = $losingBids->pluck('user')->unique('id');
            // Define your dashboard link (update with your route or URL)
            $dashboardLink = route('myDashboard');

            // Send Auction Lost Notification email to each losing bidder
            foreach ($losingUsers as $loser) {
                // Retrieve the highest bid amount the user placed for this auction
                $userBidAmount = $losingBids->where('user_id', $loser->id)->max('bid_amount');

                Mail::to($loser->email)
                    ->send(new \App\Mail\AuctionLostNotification($loser->name, $auction->title, $userBidAmount, $dashboardLink));
            }

            return response()->json(['message' => 'Auction completed and notifications sent.']);
        }

        return response()->json(['error' => 'Auction has not ended yet.'], 400);
    }
    public function filtered(Request $request)
    {
        $q = Auction::query()->where('status', 'active');
        ;

        // category filters
        if ($request->filled('category') && $request->input('category') != 'all') {
            $input = $request->input('category');
            \Log::info("AuctionFilter: Input category: " . $input);

            // 1. Try finding by slug
            $category = AuctionCategory::where('slug', $input)->first();

            // 2. If not found and input is numeric, try finding by ID
            if (!$category && is_numeric($input)) {
                $category = AuctionCategory::find($input);
            }

            if ($category) {
                // Category found - filter by it
                $catId = $category->id;
                \Log::info("AuctionFilter: Category Found: " . $category->name . " (ID: $catId)");

                $q->where(function ($subQuery) use ($catId) {
                    $subQuery->where('category_id', $catId)
                        ->orWhere('sub_category_id', $catId)
                        ->orWhere('child_category_id', $catId);
                });
            } else {
                \Log::info("AuctionFilter: Category NOT Found for input: " . $input);
                // Category not found - return empty result
                $q->where('id', 0);
            }
        }

        \Log::info("AuctionFilter: Query SQL: " . $q->toSql());
        \Log::info("AuctionFilter: Bindings: ", $q->getBindings());

        try {
            $count = $q->clone()->count();
            \Log::info("AuctionFilter: Matching Record Count: " . $count);
            if ($count > 0) {
                \Log::info("AuctionFilter: First Record ID: " . $q->clone()->first()->id);
            }
        } catch (\Exception $e) {
            \Log::error("AuctionFilter: Error counting: " . $e->getMessage());
        }

        // NEW: brands filter (matches first word - partial match)
        if ($request->filled('brands')) {
            $brandsString = $request->input('brands');
            $brands = explode(',', $brandsString);
            if (!empty($brands)) {
                $q->where(function ($query) use ($brands) {
                    foreach ($brands as $brand) {
                        $query->orWhere('developer', 'LIKE', trim($brand) . '%');
                    }
                });
            }
        }

        // status[] filter (array or comma-separated)
        $statuses = $request->input('status', []);
        $now = Carbon::now();

        if (!in_array('Live Auctions', $statuses)) {
            $q->where('status', 'active');
        }

        if (in_array('Ending Soon', $statuses)) {
            $q->whereBetween('end_date', [$now, $now->copy()->addDay()]);
        }

        if (in_array('Recent Listings', $statuses)) {
            $q->whereBetween('start_date', [$now->copy()->subDay(), $now]);
        }

        // price range
        if ($request->filled('priceMin')) {
            $q->where('reserve_price', '>=', $request->priceMin);
        }
        if ($request->filled('priceMax')) {
            $q->where('reserve_price', '<=', $request->priceMax);
        }

        // pagination
        $perPage = $request->input('perPage', 8);
        $page = $request->input('page', 1);

        $paginator = $q->withMax('bids', 'bid_amount')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        // ✅ Add owner data to each item
        $items = $paginator->items();
        foreach ($items as $item) {
            $user = User::find($item->user_id);
            $item->owner = [
                "name" => $user->name ?? '',
                "profile" => $user->profile_pic ?? ''
            ];
        }

        return response()->json([
            'items' => $items,
            'currentPage' => $paginator->currentPage(),
            'perPage' => $paginator->perPage(),
            'totalItems' => $paginator->total(),
            'totalPages' => $paginator->lastPage(),
        ]);
    }

    //new

    /**
     * Save partial auction data to auctions_1 table (draft save)
     * No validation required - saves whatever data is provided
     * For sell page: always creates new draft (deletes old one if exists)
     * For edit page: updates existing draft if draft_id is provided
     */
    public function api_save_draft(Request $request)
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $draftId = $request->input('draft_id'); // For edit page
            $isEditPageInput = $request->input('is_edit_page', 'false'); // Flag to identify edit page (comes as string from FormData)

            // Only treat as edit page if explicitly "true"
            // Sell page sends "false", so this will be false and will create new draft
            $isEditPage = ($isEditPageInput === 'true' || $isEditPageInput === true);

            // Prepare data - accept all fields without validation
            $data = [
                'user_id' => $userId,
                'status' => 'draft',
            ];

            // Add all provided fields
            $fields = [
                'title',
                'category_id',
                'sub_category_id',
                'child_category_id',
                'start_date',
                'end_date',
                'reserve_price',
                'minimum_bid',
                'description',
                'product_year',
                'product_location',
                'state_id',
                'city_id',
                'list_type',
                'product_condition',
                'create_category',
                'developer',
                'location_url',
                'delivery_date',
                'sale_starts',
                'payment_plan',
                'number_of_buildings',
                'government_fee',
                'nearby_location',
                'amenities',
                'facilities',
            ];

            foreach ($fields as $field) {
                if ($request->has($field) && $request->input($field) !== null && $request->input($field) !== '') {
                    $data[$field] = $request->input($field);
                }
            }

            // Handle album uploads if provided
            $albumsArray = [];
            if ($request->hasFile('album')) {
                $albumFiles = $request->file('album');
                if (!is_array($albumFiles)) {
                    $albumFiles = [$albumFiles];
                }
                foreach ($albumFiles as $file) {
                    if ($file->isValid()) {
                        $albumName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                        // Determine if it's a video or image
                        if ($file->getMimeType() === 'video/mp4') {
                            $file->move(public_path('/assets/videos/auction/'), $albumName);
                            $albumsArray[] = '/assets/videos/auction/' . $albumName;
                        } else {
                            $file->move(public_path('/assets/images/auction/'), $albumName);
                            $albumsArray[] = '/assets/images/auction/' . $albumName;
                        }
                    }
                }
            }

            // If new album files uploaded, use them
            if (!empty($albumsArray)) {
                $data['album'] = json_encode($albumsArray);
                $data['image'] = $albumsArray[0] ?? null;
            }

            // Logic: 
            // - If draft_id provided (edit page), update that specific draft
            // - If is_edit_page = "true" (explicitly), find and update existing draft
            // - Otherwise (sell page - is_edit_page = "false" or not set), ALWAYS delete old drafts and create new

            if ($draftId) {
                // Edit page: Update specific draft by ID
                $draft = Auction1::where('id', $draftId)
                    ->where('user_id', $userId)
                    ->where('status', 'draft')
                    ->first();

                if ($draft) {
                    // Keep existing album if no new uploads
                    if (empty($albumsArray) && $draft->album) {
                        $data['album'] = $draft->album;
                        $data['image'] = $draft->image;
                    }
                    $draft->update($data);
                    $savedDraft = $draft;
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Draft not found',
                    ], 404);
                }
            } elseif ($isEditPageInput === 'true' || $isEditPageInput === true) {
                // Edit page without draft_id: Find and update latest draft
                $draft = Auction1::where('user_id', $userId)
                    ->where('status', 'draft')
                    ->latest()
                    ->first();

                if ($draft) {
                    // Keep existing album if no new uploads
                    if (empty($albumsArray) && $draft->album) {
                        $data['album'] = $draft->album;
                        $data['image'] = $draft->image;
                    }
                    $draft->update($data);
                    $savedDraft = $draft;
                } else {
                    // No draft found, create new
                    $savedDraft = Auction1::create($data);
                }
            } else {
                // Sell page: Create new draft WITHOUT deleting existing ones
                // This allows users to have multiple drafts
                $savedDraft = Auction1::create($data);
            }

            return response()->json([
                'success' => true,
                'message' => 'Draft saved successfully',
                'draft_id' => $savedDraft->id,
                'draft' => $savedDraft,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save draft: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get saved draft for current user
     */
    public function api_get_draft()
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            $draft = Auction1::where('user_id', $userId)
                ->where('status', 'draft')
                ->latest()
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => false,
                    'message' => 'No draft found',
                    'draft' => null,
                ], 200);
            }

            return response()->json([
                'success' => true,
                'draft' => $draft,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get draft: ' . $e->getMessage(),
            ], 500);
        }
    }
}
