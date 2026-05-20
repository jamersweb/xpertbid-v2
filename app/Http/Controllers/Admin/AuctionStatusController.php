<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use App\Mail\AuctionStatusUpdated;
use Illuminate\Http\Request;
use App\Support\LoggedMail as Mail;
use App\Support\VerificationStatusMessageSender;
use Inertia\Inertia;

class AuctionStatusController extends Controller
{
    public function index()
    {
        $listings = Listing::with(['user', 'category'])
            ->with('pendingEdit')
            ->where(function ($query) {
                $query->whereIn('status', ['inactive', 'declined', 'resubmit'])
                    ->orWhereHas('pendingEdit');
            })
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Verifications/Auctions', [
            'auctions' => $listings
        ]);
    }

    public function accept($id)
    {
        $auction = Listing::with(['pendingEdit', 'user'])->findOrFail($id);

        if ($auction->pendingEdit) {
            $payload = $auction->pendingEdit->data ?? [];

            $auction->update([
                'category_id' => $payload['category_id'] ?? $auction->category_id,
                'sub_category_id' => $payload['sub_category_id'] ?? $auction->sub_category_id,
                'child_category_id' => $payload['child_category_id'] ?? $auction->child_category_id,
                'listing_type' => $payload['listing_type'] ?? $auction->listing_type,
                'title' => $payload['title'] ?? $auction->title,
                'description' => $payload['description'] ?? $auction->description,
                'image' => $payload['image'] ?? $auction->getRawOriginal('image'),
                'album' => $payload['album'] ?? $auction->getRawOriginal('album'),
                'listing_data' => $payload['listing_data'] ?? $auction->listing_data,
                'category_features' => $payload['category_features'] ?? $auction->category_features,
                'status' => 'active',
            ]);

            $auction->pendingEdit->delete();

            if ($auction->user) {
                VerificationStatusMessageSender::sendListingApproved($auction->user, (string) $auction->title);
            }

            return redirect()->back()->with('success', 'Pending edits approved and merged into the live listing.');
        }

        $auction->status = 'active';
        $auction->save();

        if ($auction->user) {
            VerificationStatusMessageSender::sendListingApproved($auction->user, (string) $auction->title);
        }

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'accepted'));

        return redirect()->back()->with('success', 'Listing approved and published!');
    }

    public function decline(Request $request, $id)
    {
        $auction = Listing::with(['pendingEdit', 'user'])->findOrFail($id);

        if ($auction->pendingEdit && $auction->status === 'active') {
            $auction->pendingEdit->delete();

            return redirect()->back()->with('success', 'Pending edits declined and the live listing was kept unchanged.');
        }

        $auction->status = 'declined';
        $auction->decline_reason = $request->reason;
        $auction->save();

        if ($auction->user) {
            VerificationStatusMessageSender::sendListingDeclined(
                $auction->user,
                (string) $auction->title,
                (string) $request->reason
            );
        }

        // Optionally send email
        // Mail::to($auction->user->email)->send(new AuctionStatusUpdated($auction, 'declined', $request->reason));

        return redirect()->back()->with('success', 'Listing declined!');
    }
}
