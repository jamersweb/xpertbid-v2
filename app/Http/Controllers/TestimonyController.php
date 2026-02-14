<?php

namespace App\Http\Controllers;

use App\Models\Testimony;
use App\Models\User;
use Illuminate\Http\Request;

class TestimonyController extends Controller
{
    /**
     * Display a listing of testimonies.
     */
    public function index()
    {
        // Fetch testimonies with user relationship, paginated
        $testimonies = Testimony::with('user')->paginate(10);
        return view('testimonies.index', compact('testimonies'));
    }

    /**
     * Show the form for creating a new testimony.
     */
    public function create()
    {
        // Fetch all users for the dropdown
        $users = User::all();
        return view('testimonies.create', compact('users'));
    }

    /**
     * Store a newly created testimony in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'testimony' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        // Create new testimony
        Testimony::create([
            'user_id' => $request->user_id,
            'testimony' => $request->testimony,
            'status' => $request->status,
        ]);

        // Redirect with success message
        return redirect()->route('testimonies.index')->with('success', 'Testimony created successfully.');
    }

    /**
     * Show the form for editing the specified testimony.
     */
    public function edit(Testimony $testimony)
    {
        // Fetch all users for the dropdown
        $users = User::all();
        return view('testimonies.create', compact('testimony', 'users'));
    }

    /**
     * Update the specified testimony in storage.
     */
    public function update(Request $request, Testimony $testimony)
    {
        // Validate incoming request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'testimony' => 'required|string',
            'status' => 'required|in:Active,Inactive',
        ]);

        // Update testimony
        $testimony->update([
            'user_id' => $request->user_id,
            'testimony' => $request->testimony,
            'status' => $request->status,
        ]);

        // Redirect with success message
        return redirect()->route('testimonies.index')->with('success', 'Testimony updated successfully.');
    }

    /**
     * Remove the specified testimony from storage.
     */
    public function destroy(Testimony $testimony)
    {
        // Delete testimony
        $testimony->delete();
        return redirect()->route('testimonies.index')->with('success', 'Testimony deleted successfully.');


    }

  
}
