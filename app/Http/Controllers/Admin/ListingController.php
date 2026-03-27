<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Listing;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listings = Listing::with(['user', 'category'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Listings/Index', [
            'listings' => $listings
        ]);
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
