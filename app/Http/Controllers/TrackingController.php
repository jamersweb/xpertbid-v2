<?php

namespace App\Http\Controllers;

use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class TrackingController extends Controller
{
    public function index()
    {
        $trackings = Tracking::all();
        return view('tracking.index', compact('trackings'));
    }

    public function create()
    {
        return view('tracking.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'current_location' => 'required|string',
            'status' => 'required|string|in:in_transit,at_warehouse,out_for_delivery,delivered',
            'estimated_delivery_date' => 'nullable|date',
        ]);

        Tracking::create($request->all());
        return redirect()->route('tracking.index')->with('success', 'Tracking record created successfully.');
    }

    public function show(Tracking $tracking)
    {
        return view('tracking.show', compact('tracking'));
    }

    public function edit(Tracking $tracking)
    {
        return view('tracking.edit', compact('tracking'));
    }

    public function update(Request $request, Tracking $tracking)
    {
        $request->validate([
            'current_location' => 'required|string',
            'status' => 'required|string|in:in_transit,at_warehouse,out_for_delivery,delivered',
            'estimated_delivery_date' => 'nullable|date',
        ]);

        $tracking->update($request->all());
        return redirect()->route('tracking.index')->with('success', 'Tracking record updated successfully.');
    }

    public function destroy(Tracking $tracking)
    {
        $tracking->delete();
        return redirect()->route('tracking.index')->with('success', 'Tracking record deleted successfully.');
    }
}
