<?php

namespace App\Http\Controllers;

use App\Models\BuyNowInquiry;
use Illuminate\Http\Request;

class BuyNowInquiryController extends Controller
{
    public function index()
    {
        $inquiries = BuyNowInquiry::with(['auction.user', 'auction.user.referrer'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return view('buy_now_inquiries.index', compact('inquiries'));
    }

    public function show($id)
    {
        $inquiry = BuyNowInquiry::with(['auction.user', 'auction.user.referrer'])
            ->findOrFail($id);
        
        return view('buy_now_inquiries.show', compact('inquiry'));
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,completed'
        ]);

        $inquiry = BuyNowInquiry::findOrFail($id);
        $inquiry->update(['status' => $request->status]);

        return redirect()->route('buy-now-inquiries.index')
            ->with('success', 'Status updated successfully.');
    }

    public function destroy($id)
    {
        $inquiry = BuyNowInquiry::findOrFail($id);
        $inquiry->delete();

        return redirect()->route('buy-now-inquiries.index')
            ->with('success', 'Inquiry deleted successfully.');
    }
}

