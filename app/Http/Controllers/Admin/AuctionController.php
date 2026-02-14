<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AuctionController extends Controller
{
    public function index(Request $request)
    {
        $query = Auction::with(['user', 'category']);

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('id', $request->search);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $auctions = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Auctions/Index', [
            'auctions' => $auctions,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function edit($id)
    {
        $auction = Auction::with(['user', 'category', 'status_logs'])->findOrFail($id);
        $categories = AuctionCategory::whereNull('parent_id')->get();
        
        return Inertia::render('Admin/Auctions/Edit', [
            'auction' => $auction,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, $id)
    {
        $auction = Auction::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:pending,active,declined,completed,cancelled',
            // Add other fields as necessary from the original AuctionController
        ]);

        $auction->update($request->all());

        return redirect()->back()->with('success', 'Auction updated successfully!');
    }

    public function destroy($id)
    {
        $auction = Auction::findOrFail($id);
        $auction->delete();

        return redirect()->route('admin.auctions.index')->with('success', 'Auction deleted successfully!');
    }
}
