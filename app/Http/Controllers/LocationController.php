<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class LocationController extends Controller
{
    public function index()
    {
        $countries = Country::with('states.cities')->get();
        return view('locations.index', compact('countries'));
    }

    public function create()
    {
        $countries = Country::with('states.cities')->get();
        return view('locations.create', compact('countries'));
    }

    public function store(Request $request)
    {   //dd($request);
        $request->validate([
            'name' => 'required',
            'type' => 'required', // 'country', 'state', or 'city'
            'parent_id' => 'nullable|exists:countries,id|exists:states,id',
        ]);

        if ($request->type == 'country') {
            Country::create(['name' => $request->name]);
        }  elseif ($request->type == 'state') {
            
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

        return redirect()->route('locations.index');
    }

    public function edit($id, $type)
    {
        if ($type == 'country') {
            $record = Country::findOrFail($id);
            //$countries = Country::all();
        } elseif ($type == 'state') {
            $record = State::findOrFail($id);
            //$countries = State::all();
        } else {
            $record = City::findOrFail($id);
            //$countries = City::all();
        }
        $countries = Country::all();
        return view('locations.create', compact('record', 'type','countries'));
    }

    public function update(Request $request, $id, $type)
    {
        $request->validate(['name' => 'required']);

        if ($type == 'country') {
            $record = Country::findOrFail($id);
        } elseif ($type == 'state') {
            $record = State::findOrFail($id);
        } else {
            $record = City::findOrFail($id);
        }

        $record->update(['name' => $request->name]);

        return redirect()->route('locations.index');
    }

    public function destroy($id, $type)
    {  // dd($id .' '.$type);
        if ($type == 'country') {
            $record = Country::findOrFail($id);
        } elseif ($type == 'state') {
            $record = State::findOrFail($id);
        } else {
            $record = City::findOrFail($id);
        }

        $record->delete();

        return redirect()->route('locations.index');
    }
}