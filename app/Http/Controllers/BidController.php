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
use App\Services\MsgpkService;
use App\Mail\BidOutbidNotification;
use App\Support\LoggedMail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class BidController extends Controller
{
    protected function resolveSource(Request $request, string $fieldName): ?string
    {
        return $request->input($fieldName)
            ?? $request->input('source_platform')
            ?? $request->header('X-Client-Source')
            ?? null;
    }

    protected function sendOutbidAlerts(Listing $listing, float $newBidAmount, int $currentUserId): void
    {
        $listingUrl = route('product.show', $listing->slug);

        $previousBids = Bid::query()
            ->where('listing_id', $listing->id)
            ->where('user_id', '!=', $currentUserId)
            ->with('user')
            ->orderByDesc('bid_amount')
            ->orderByDesc('id')
            ->get()
            ->unique('user_id')
            ->values();

        foreach ($previousBids as $previousBid) {
            $recipient = $previousBid->user;
            if (!$recipient) {
                continue;
            }

            $recipientName = trim((string) ($recipient->name ?? 'there')) ?: 'there';
            $yourBidAmount = (float) $previousBid->bid_amount;

            $hasValidEmail = filter_var((string) ($recipient->email ?? ''), FILTER_VALIDATE_EMAIL);
            $phone = trim((string) ($recipient->phone ?? ''));

            if ($hasValidEmail) {
                try {
                    LoggedMail::to($recipient->email)->send(new BidOutbidNotification(
                        $listing,
                        $recipientName,
                        $newBidAmount,
                        $yourBidAmount,
                        $listingUrl
                    ));
                    continue;
                } catch (\Throwable $e) {
                    Log::warning('Outbid email failed, trying WhatsApp fallback: ' . $e->getMessage(), [
                        'listing_id' => $listing->id,
                        'user_id' => $recipient->id,
                    ]);
                }
            }

            if ($phone !== '') {
                $message = sprintf(
                    'Hi %s, you have been outbid on "%s". Your bid was %s PKR and the new highest bid is %s PKR. View listing: %s',
                    $recipientName,
                    $listing->title ?? 'your listing',
                    number_format($yourBidAmount),
                    number_format($newBidAmount),
                    $listingUrl
                );

                app(MsgpkService::class)->sendWhatsApp($phone, $message);
                continue;
            }

            Log::info('No valid email or phone found for outbid notification.', [
                'listing_id' => $listing->id,
                'user_id' => $recipient->id,
            ]);
        }
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

        // Validation
        $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'bid_amount' => 'required|numeric|min:1',
        ]);

        $listing = Listing::findOrFail($request->listing_id);
        $isLiveAuction = $listing->listing_type === 'live_auction';

        // ------------------------------------------------------------
        // Verification Gates. Live auctions can be bid on without verification.
        // ------------------------------------------------------------
        if (!$isLiveAuction) {
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
                if ($request->wantsJson() || $request->expectsJson()) {
                    return response()->json(['message' => $msg], 403);
                }
                // For Inertia, we might redirect to verification page with authorized error
                return redirect()->route('verification.identity')->with('error', $msg);
            }
        }

        if ($listing->status !== 'active' || (!$isLiveAuction && now()->greaterThan($listing->end_date))) {
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'message' => 'Auction has ended or is inactive.',
                ], 422);
            }
            return redirect()->back()->with('error', 'Auction has ended or is inactive.');
        }

        // Min Bid Check
        $minBid = (float) $listing->minimum_bid;
        $newAmount = (float) $request->bid_amount;
        
        if ($newAmount < $minBid) {
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'message' => "Bid must be at least {$minBid}.",
                ], 422);
            }
             return redirect()->back()->with('error', "Bid must be at least {$minBid}.");
        }

        // Highest Bid Check
        $currentHighest = Bid::where('listing_id', $listing->id)->max('bid_amount');
        if ($currentHighest && $newAmount <= $currentHighest) {
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'message' => "Bid must be higher than {$currentHighest}.",
                ], 422);
            }
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

            if ($currentHighest) {
                try {
                    $this->sendOutbidAlerts($listing, $newAmount, $userId);
                } catch (\Throwable $notificationError) {
                    Log::warning('Failed to send outbid notifications: ' . $notificationError->getMessage(), [
                        'listing_id' => $listing->id,
                        'new_bid_amount' => $newAmount,
                    ]);
                }
            }

            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Bid placed successfully!',
                    'bid' => $bid,
                ]);
            }

            return redirect()->back()->with('success', 'Bid placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->wantsJson() || $request->expectsJson()) {
                return response()->json([
                    'message' => 'Bid failed: ' . $e->getMessage(),
                ], 500);
            }
            return redirect()->back()->with('error', 'Bid failed: ' . $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        $userId = auth()->id();
        $activeTab = $request->query('status', 'active');

        $query = Listing::whereHas('bids', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->with([
            'bids' => function ($q) {
                $q->orderBy('bid_amount', 'desc');
            },
            'category',
            'user.individualVerification',
            'user.corporateVerification',
        ]);

        if ($activeTab === 'active') {
            $query->where('status', 'active');
        } elseif ($activeTab === 'won') {
            $query->where('status', 'awarded')
                ->whereRaw(
                    "CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.winner_id')) AS UNSIGNED) = ?",
                    [$userId]
                );
        } elseif ($activeTab === 'lost') {
            $query->whereIn('status', ['closed', 'awarded'])
                ->where(function ($q) use ($userId) {
                    $q->whereRaw("JSON_EXTRACT(listing_data, '$.winner_id') IS NULL")
                        ->orWhereRaw(
                            "CAST(JSON_UNQUOTE(JSON_EXTRACT(listing_data, '$.winner_id')) AS UNSIGNED) != ?",
                            [$userId]
                        );
                });
        }

        $auctions = $query->latest()->paginate(12);

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'auctions' => $auctions,
                'data' => $auctions,
                'activeTab' => $activeTab,
            ]);
        }

        return Inertia::render('Bids/Index', [
            'auctions' => $auctions,
            'activeTab' => $activeTab
        ]);
    }
}
