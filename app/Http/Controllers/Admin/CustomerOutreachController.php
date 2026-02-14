<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerOutreach;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerOutreachController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerOutreach::with(['user.individualVerification']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('call_status')) {
            $query->where('call_status', $request->call_status);
        }

        $outreaches = $query->orderBy('created_at', 'desc')
                            ->paginate(15)
                            ->withQueryString();

        return Inertia::render('Admin/CRM/Index', [
            'outreaches' => $outreaches,
            'filters' => $request->only(['search', 'call_status'])
        ]);
    }

    public function update(Request $request, $id)
    {
        $outreach = CustomerOutreach::findOrFail($id);
        
        $request->validate([
            'call_status' => 'required|string',
            'customer_feedback_summary' => 'nullable|string',
            'contract_date' => 'nullable|date',
        ]);

        $outreach->update($request->only([
            'call_status', 
            'customer_feedback_summary', 
            'contract_date'
        ]));

        return redirect()->back()->with('success', 'CRM status updated successfully.');
    }
}
