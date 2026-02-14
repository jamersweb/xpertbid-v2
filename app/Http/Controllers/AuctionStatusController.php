<?php
namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AuctionDeclinedMail;
use App\Mail\AuctionAcceptedMail;

class AuctionStatusController extends Controller
{
   // INDEX: List all auctions with status
    public function index(Request $request)
    {
        $allowedStatuses = ['inactive', 'decline', 'resubmit'];
        $query = Auction::with(['user', 'category'])
            ->whereIn('status', $allowedStatuses);

        // Search functionality
        if ($request->has('q') && !empty($request->q)) {
            $search = $request->q;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%$search%")
                  ->orWhere('id', 'LIKE', "%$search%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'LIKE', "%$search%");
                  })
                  ->orWhereHas('category', function($catQuery) use ($search) {
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

        if ($request->ajax()) {
            return view('auctionstatus.table_partial', compact('auctions'))->render();
        }

        $categories = \App\Models\AuctionCategory::whereHas('auctions', function($q) use ($allowedStatuses) {
            $q->whereIn('status', $allowedStatuses);
        })->get();

        return view('auctionstatus.index', compact('auctions', 'allowedStatuses', 'categories'));
    }
    public function edit($id)
{
    // Auction + related user, category, property & vehicle details la lo
    $auction = \App\Models\Auction::with([
        'user.IndividualVerification', // User relation with verification context
        'category', // Auction category
          'subCategory',
    'childCategory',
        'property_verification', // use snake_case
    'vehicle_verification',  // use snake_case
    ])->findOrFail($id);

    return view('auctionstatus.edit', compact('auction'));
}

    public function update(Request $request, $id)
    {
        $auction = Auction::findOrFail($id);
        $action  = $request->input('action');

        if ($action === 'accept') {
            $auction->status = 'active';
        } elseif ($action === 'decline') {
            $auction->status = 'inactive';
        }
        $auction->decline_reason = null;
        $auction->save();

        return redirect()
            ->route('auctionstatus.index', $auction->id)
            ->with('success', "Auction {$action}d.");
    }

    
  public function decline(Request $request, $id)
{
    $request->validate([
        'decline_reason' => 'required|string|max:1000',
    ]);

    $auction = Auction::findOrFail($id);

    $auction->status = 'decline';
    $auction->decline_reason = $request->decline_reason;
    $auction->save();

    // In-app notification
    \App\Models\NewNotification::create([
        'user_id'   => $auction->user_id,
        'title'     => 'Auction Declined',
        'message'   => "Your auction \"{$auction->title}\" was declined: {$request->decline_reason}",
        'type'      => 'auction',
        'image_url' => \App\Models\NewNotification::getImageForType('auction'),
        'read_at'   => null,
    ]);

    // User ko mail send karo
    $user = $auction->user;
    if ($user && $user->email) {
        $editUrl = "http://xpertbid.com/sell/edit/" . $auction->id;
        Mail::to($user->email)->send(new AuctionDeclinedMail($auction, $editUrl));
    }

    return redirect()->route('auctionstatus.index')->with('success', 'Auction declined and user notified!');
}

public function accept($id)
{
    $auction = \App\Models\Auction::findOrFail($id);
    $auction->status = 'active';
    $auction->decline_reason = null;
    $auction->save();

    // In-app notification
    \App\Models\NewNotification::create([
        'user_id'   => $auction->user_id,
        'title'     => 'Auction Accepted',
        'message'   => "Your auction \"{$auction->title}\" has been approved and is now live.",
        'type'      => 'auction',
        'image_url' => \App\Models\NewNotification::getImageForType('auction'),
        'read_at'   => null,
    ]);

    // Mail user
    $user = $auction->user;
    if ($user && $user->email) {
        Mail::to($user->email)->send(new AuctionAcceptedMail($auction));
    }

    return redirect()->route('auctionstatus.index')->with('success', 'Auction accepted and user notified.');
}

}
