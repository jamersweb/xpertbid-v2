<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailLogController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailLog::with('user')->orderBy('sent_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('recipient_email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $emailLogs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/EmailLogs/Index', [
            'emailLogs' => $emailLogs,
            'filters' => $request->only(['search'])
        ]);
    }
}
