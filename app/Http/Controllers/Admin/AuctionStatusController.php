<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Mail\AuctionStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AuctionStatusController extends Controller
{
    public function index()
    {
        // This is for Auction Verification list
        $auctions = Auction::with(['user', 'category'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Verifications/Auctions', [
            'auctions' => $auctions
        ]);
    }

    public function accept($id)
    {
        $auction = Auction::findOrFail($id);
        $auction->status = 'active';
        $auction->save();

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'accepted'));

        return redirect()->back()->with('success', 'Auction accepted and published!');
    }

    public function decline(Request $request, $id)
    {
        $auction = Auction::findOrFail($id);
        $auction->status = 'declined';
        $auction->decline_reason = $request->reason;
        $auction->save();

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'declined', $request->reason));

        return redirect()->back()->with('success', 'Auction declined!');
    }
}
