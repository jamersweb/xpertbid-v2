<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Models\NewNotification;
use Illuminate\Support\Facades\DB;
use App\Models\IndividualVerification;
use App\Models\CorporateVerification;
use Illuminate\Support\Facades\Mail;
use App\Services\MsgpkService;
use Inertia\Inertia;

class BidController extends Controller
{
    protected function resolveSource(Request $request, string $fieldName): ?string
    {
        return $request->input($fieldName)
            ?? $request->input('source_platform')
            ?? $request->header('X-Client-Source')
            ?? null;
    }

    // protected $msgpkService;

    // public function __construct(MsgpkService $msgpkService)
    // {
    //     $this->msgpkService = $msgpkService;
    // }

    public function getHighestBid($listingId)
    {
        $highestBid = Bid::where('listing_id', $listingId)
            ->orderBy('bid_amount', 'desc')
            ->first();
        
        $listing = Listing::find($listingId);

        return response()->json([
            'success' => true,
            'highest_bid' => $highestBid ? $highestBid->bid_amount : 0,
            'user' => $highestBid ? ($highestBid->user->name ?? 'Anonymous') : null,
            'end_date' => $listing ? $listing->end_date : null,
        ]);
    }

    public function placeBid(Request $request)
    {
        $userId = auth()->id();
        $user = auth()->user();

        // ------------------------------------------------------------
        // Verification Gates
        // ------------------------------------------------------------
        $individual = IndividualVerification::where('user_id', $userId)->first();
        $corporate = CorporateVerification::where('user_id', $userId)->first();

        // Helper to check status
        $isApproved = fn($rec) => $rec && in_array(strtolower($rec->status), ['approved', 'verified'], true);
        $isPending = fn($rec) => $rec && in_array(strtolower($rec->status), ['pending', 'not_verified', 'submitted'], true);
        $isRejected = fn($rec) => $rec && in_array(strtolower($rec->status), ['rejected', 'declined'], true);

        if (!$isApproved($individual) && !$isApproved($corporate)) {
            $msg = 'You need to complete verification before placing a bid.';
            if ($isPending($individual) || $isPending($corporate)) {
                $msg = 'Your verification is pending review.';
            } elseif ($isRejected($individual) || $isRejected($corporate)) {
                $msg = 'Your verification was rejected.';
            }
            // For Inertia, we might redirect to verification page with authorized error
             return redirect()->route('verification.identity')->with('error', $msg);
        }

        // Validation
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'bid_amount' => 'required|numeric|min:1',
        ]);

        $listing = Listing::findOrFail($request->listing_id);
        $isLiveAuction = $listing->listing_type === 'live_auction';

        if ($listing->status !== 'active' || (!$isLiveAuction && now()->greaterThan($listing->end_date))) {
            return redirect()->back()->with('error', 'Auction has ended or is inactive.');
        }

        // Min Bid Check
        $minBid = (float) $listing->minimum_bid;
        $newAmount = (float) $request->bid_amount;
        
        if ($newAmount < $minBid) {
             return redirect()->back()->with('error', "Bid must be at least {$minBid}.");
        }

        // Highest Bid Check
        $currentHighest = Bid::where('listing_id', $listing->id)->max('bid_amount');
        if ($currentHighest && $newAmount <= $currentHighest) {
            return redirect()->back()->with('error', "Bid must be higher than {$currentHighest}.");
        }

        // Create Bid
        DB::beginTransaction();
        try {
            $bid = Bid::create([
                'user_id' => $userId,
                'auction_id' => null,
                'listing_id' => $listing->id,
                'bid_amount' => $newAmount,
                'bid_source' => $this->resolveSource($request, 'bid_source'),
            ]);

            // Auto-extend timed auctions only.
            if (!$isLiveAuction && $listing->end_date) {
                $endDate = \Carbon\Carbon::parse($listing->end_date);
                if (now()->addMinutes(5)->greaterThanOrEqualTo($endDate)) {
                    $listing->end_date = $endDate->addMinutes(15);
                    $listing->save();
                }
            }

            // Notifications logic (simplified calls)
            // Not implemented in migration step strictly, but placeholders:
            // $this->notifyPreviousBidders(...)

            DB::commit();

            return redirect()->back()->with('success', 'Bid placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Bid failed: ' . $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        $userId = auth()->id();
        $activeTab = $request->query('status', 'active');

        $query = Listing::whereHas('bids', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->with(['bids' => function ($q) {
            $q->orderBy('bid_amount', 'desc');
        }, 'category']);

        if ($activeTab === 'active') {
            $query->where('status', 'active')
                  ->where('end_date', '>', now());
        } elseif ($activeTab === 'won') {
            $query->where('winner_id', $userId);
        } elseif ($activeTab === 'lost') {
            $query->where('end_date', '<', now())
                  ->where(function ($q) use ($userId) {
                      $q->whereNull('winner_id')
                        ->orWhere('winner_id', '!=', $userId);
                  });
        }

        $auctions = $query->latest()->paginate(12);

        return Inertia::render('Bids/Index', [
            'auctions' => $auctions,
            'activeTab' => $activeTab
        ]);
    }
}
