<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Auction;
use App\Models\Wallet;
use App\Models\Bid;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'total_auctions' => Auction::count(),
                'total_bids' => Bid::count(),
                'wallet_balance' => Wallet::sum('balance'),
                'active_auctions' => Auction::where('status', 'active')->count(),
                'pending_verifications' => DB::table('individual_verifications')->where('status', 'pending')->count() 
                    + DB::table('corporate_verifications')->where('status', 'pending')->count()
            ]
        ]);
    }
}
