<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ReferralController extends Controller
{
    // Show all users with referral info
    public function index(Request $request)
    {
        $query = User::with(['referrer'])->withCount('referrals');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%")
                  ->orWhere('referral_code', 'LIKE', "%$search%")
                  ->orWhere('id', 'LIKE', "%$search%");
            });
        }

        // Date Range (Join Date)
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereDate('created_at', '>=', $dates[0])
                      ->whereDate('created_at', '<=', $dates[1]);
            } else {
                $query->whereDate('created_at', $dates[0]);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'newest_to_oldest');
        switch ($sort) {
            case 'oldest_to_newest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'referrals_high_to_low':
                $query->orderBy('referrals_count', 'desc');
                break;
            case 'newest_to_oldest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $users = $query->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('referral.table_partial', compact('users'))->render();
        }

        return view('referral.index', compact('users'));
    }
    // Show specific user + who referred him + whom he referred
    public function show($id)
{
    $user = User::with(['referrer','referrals'])->findOrFail($id);

    return view('referral.show', [
        'user' => $user,
        'referrer' => $user->referrer,
        'referrals' => $user->referrals,
    ]);
}

}
