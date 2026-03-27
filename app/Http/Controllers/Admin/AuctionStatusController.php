<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use App\Mail\AuctionStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AuctionStatusController extends Controller
{
    public function index()
    {
        $listings = Listing::with(['user', 'category'])
            ->whereIn('status', ['inactive', 'declined', 'resubmit'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Verifications/Auctions', [
            'auctions' => $listings
        ]);
    }

    public function accept($id)
    {
        $auction = Listing::findOrFail($id);
        $auction->status = 'active';
        $auction->save();

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'accepted'));

        return redirect()->back()->with('success', 'Listing approved and published!');
    }

    public function decline(Request $request, $id)
    {
        $auction = Listing::findOrFail($id);
        $auction->status = 'declined';
        $auction->decline_reason = $request->reason;
        $auction->save();

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'declined', $request->reason));

        return redirect()->back()->with('success', 'Listing declined!');
    }
}
