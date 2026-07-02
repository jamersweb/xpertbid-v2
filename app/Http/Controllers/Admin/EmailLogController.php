<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use App\Models\EmailLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailLogController extends Controller
{
    use StreamsCsvExports;

    public function index(Request $request)
    {
        $query = EmailLog::with('user')->orderBy('sent_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('recipient_email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhere('failure_reason', 'like', "%{$search}%")
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

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);
        $query = EmailLog::with('user')
            ->whereDate('sent_at', '>=', $validated['from'])
            ->whereDate('sent_at', '<=', $validated['to'])
            ->orderBy('sent_at', 'desc');

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('recipient_email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('failure_reason', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $logs = $query->get();
        $filename = 'email_logs_' . $validated['from'] . '_to_' . $validated['to'] . '.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Recipient',
            'User',
            'Subject',
            'Type',
            'Status',
            'Failure Reason',
            'Sent At',
        ], $logs->map(fn ($log) => [
            $log->id,
            $log->recipient_email,
            $log->user?->name ?? 'Guest',
            $log->subject,
            $log->type,
            $log->status,
            $log->failure_reason,
            optional($log->sent_at)->format('Y-m-d H:i:s'),
        ]));
    }
}
