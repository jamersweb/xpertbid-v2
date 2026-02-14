<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\User;
use App\Models\Auction;
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
    // protected $msgpkService;

    // public function __construct(MsgpkService $msgpkService)
    // {
    //     $this->msgpkService = $msgpkService;
    // }

    public function getHighestBid($auctionId)
    {
        $highestBid = Bid::where('auction_id', $auctionId)
            ->orderBy('bid_amount', 'desc')
            ->first();
        
        $auction = Auction::find($auctionId);

        return response()->json([
            'success' => true,
            'highest_bid' => $highestBid ? $highestBid->bid_amount : 0,
            'user' => $highestBid ? ($highestBid->user->name ?? 'Anonymous') : null,
            'end_date' => $auction ? $auction->end_date : null,
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
            'auction_id' => 'required|exists:auctions,id',
            'bid_amount' => 'required|numeric|min:1',
        ]);

        $auction = Auction::findOrFail($request->auction_id);

        if ($auction->status !== 'active' || now()->greaterThan($auction->end_date)) {
            return redirect()->back()->with('error', 'Auction has ended or is inactive.');
        }

        // Min Bid Check
        $minBid = (float) $auction->minimum_bid;
        $newAmount = (float) $request->bid_amount;
        
        if ($newAmount < $minBid) {
             return redirect()->back()->with('error', "Bid must be at least {$minBid}.");
        }

        // Highest Bid Check
        $currentHighest = Bid::where('auction_id', $auction->id)->max('bid_amount');
        if ($currentHighest && $newAmount <= $currentHighest) {
            return redirect()->back()->with('error', "Bid must be higher than {$currentHighest}.");
        }

        // Create Bid
        DB::beginTransaction();
        try {
            $bid = Bid::create([
                'user_id' => $userId,
                'auction_id' => $auction->id,
                'bid_amount' => $newAmount,
            ]);

            // Auto-extend auction logic (simplified)
            $endDate = \Carbon\Carbon::parse($auction->end_date); // Assuming UTC in new app or handling consistently
            if (now()->addMinutes(5)->greaterThanOrEqualTo($endDate)) {
                 $auction->end_date = $endDate->addMinutes(15);
                 $auction->save();
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

        $query = Auction::whereHas('bids', function ($q) use ($userId) {
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
