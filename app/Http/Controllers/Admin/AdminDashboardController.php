<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Bid;
use App\Models\Listing;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $months = collect(range(11, 0))->map(fn ($offset) => Carbon::now()->subMonths($offset)->format('Y-m'))
            ->values();
        $verifiedStatuses = ['verified', 'approved'];
        $pendingStatuses = ['pending', 'not_verified', 'submitted'];

        $monthlyCounts = function ($query, $dateColumn = 'created_at') use ($months) {
            $rows = $query
                ->selectRaw("DATE_FORMAT({$dateColumn}, '%Y-%m') as month_key, COUNT(*) as aggregate")
                ->groupBy('month_key')
                ->pluck('aggregate', 'month_key');

            return $months->map(fn ($month) => (int) ($rows[$month] ?? 0))->values();
        };

        $verifiedUsersQuery = User::query()->where(function ($query) use ($verifiedStatuses) {
            $query->whereHas('individualVerification', function ($verificationQuery) use ($verifiedStatuses) {
                $verificationQuery->whereIn('status', $verifiedStatuses);
            })->orWhereHas('corporateVerification', function ($verificationQuery) use ($verifiedStatuses) {
                $verificationQuery->whereIn('status', $verifiedStatuses);
            });
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'total_products' => Listing::count(),
                'auction_listings' => Listing::where('listing_type', 'auction')->count(),
                'normal_listings' => Listing::whereIn('listing_type', ['normal', 'business'])->count(),
                'verified_users' => (clone $verifiedUsersQuery)->count(),
                'total_bids' => Bid::count(),
                'pending_verifications' => DB::table('individual_verifications')->whereIn('status', $pendingStatuses)->count()
                    + DB::table('corporate_verifications')->whereIn('status', $pendingStatuses)->count(),
                'currency_last_synced_at' => Cache::get('currency_rates_last_synced_at'),
                'auction_status_last_checked_at' => Cache::get('auction_status_last_checked_at'),
                'series' => [
                    'total_users' => $monthlyCounts(User::query()),
                    'total_products' => $monthlyCounts(Listing::query()),
                    'auction_listings' => $monthlyCounts(Listing::query()->where('listing_type', 'auction')),
                    'normal_listings' => $monthlyCounts(Listing::query()->whereIn('listing_type', ['normal', 'business'])),
                    'verified_users' => $monthlyCounts(clone $verifiedUsersQuery),
                    'total_bids' => $monthlyCounts(Bid::query()),
                ],
            ]
        ]);
    }
}
