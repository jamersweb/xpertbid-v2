<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $countries = Country::with(['states.cities'])->get();
        return Inertia::render('Admin/Locations/Index', [
            'countries' => $countries
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:country,state,city',
            'parent_id' => 'nullable|integer',
        ]);

        if ($request->type == 'country') {
            Country::create(['name' => $request->name]);
        } elseif ($request->type == 'state') {
            State::create([
                'name' => $request->name,
                'country_id' => $request->parent_id,
            ]);
        } elseif ($request->type == 'city') {
            City::create([
                'name' => $request->name,
                'state_id' => $request->parent_id,
            ]);
        }

        return redirect()->back()->with('success', ucfirst($request->type) . ' created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:country,state,city',
        ]);

        if ($request->type == 'country') {
            Country::findOrFail($id)->update(['name' => $request->name]);
        } elseif ($request->type == 'state') {
            State::findOrFail($id)->update(['name' => $request->name]);
        } elseif ($request->type == 'city') {
            City::findOrFail($id)->update(['name' => $request->name]);
        }

        return redirect()->back()->with('success', ucfirst($request->type) . ' updated successfully.');
    }

    public function destroy($id, Request $request)
    {
        $type = $request->query('type');
        
        if ($type == 'country') {
            Country::findOrFail($id)->delete();
        } elseif ($type == 'state') {
            State::findOrFail($id)->delete();
        } elseif ($type == 'city') {
            City::findOrFail($id)->delete();
        }

        return redirect()->back()->with('success', ucfirst($type) . ' deleted successfully.');
    }
}
