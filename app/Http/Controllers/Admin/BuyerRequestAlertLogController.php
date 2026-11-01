<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\StreamsCsvExports;
use App\Http\Controllers\Controller;
use App\Models\BuyerRequest;
use App\Models\BuyerRequestAlertLog;
use App\Models\BuyerRequestOffer;
use App\Support\BuyerRequestAlertSender;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuyerRequestAlertLogController extends Controller
{
    use StreamsCsvExports;

    public function index(Request $request)
    {
        $query = BuyerRequestAlertLog::query()
            ->with([
                'user:id,name,email,phone',
                'buyerRequest:id,title,slug,status',
            ])
            ->latest('sent_at');

        $this->applyFilters($query, $request);

        $logs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/BuyerRequestAlerts/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $request->input('search', ''),
                'channel' => $request->input('channel', 'all'),
                'status' => $request->input('status', 'all'),
                'alert_key' => $request->input('alert_key', 'all'),
                'from' => $request->input('from', ''),
                'to' => $request->input('to', ''),
            ],
            'alertKeys' => $this->alertKeyOptions(),
        ]);
    }

    public function show(BuyerRequestAlertLog $log)
    {
        $log->load([
            'user:id,name,email,phone',
            'buyerRequest:id,title,slug,status',
        ]);

        return Inertia::render('Admin/BuyerRequestAlerts/Show', [
            'log' => $log,
        ]);
    }

    public function export(Request $request)
    {
        $validated = $this->validateExportDateRange($request);

        $query = BuyerRequestAlertLog::query()
            ->with([
                'user:id,name,email',
                'buyerRequest:id,title',
            ])
            ->whereDate('sent_at', '>=', $validated['from'])
            ->whereDate('sent_at', '<=', $validated['to'])
            ->latest('sent_at');

        $filterRequest = new Request(array_merge($request->all(), [
            'from' => null,
            'to' => null,
        ]));
        $this->applyFilters($query, $filterRequest);

        $logs = $query->get();
        $filename = 'buyer_request_alert_logs_'.$validated['from'].'_to_'.$validated['to'].'.csv';

        return $this->streamCsv($filename, [
            'ID',
            'Channel',
            'Alert',
            'Status',
            'Destination',
            'Recipient',
            'Request ID',
            'Request Title',
            'Subject',
            'Failure Reason',
            'Sent At',
        ], $logs->map(fn (BuyerRequestAlertLog $log) => [
            $log->id,
            $log->channel,
            $log->alert_key,
            $log->status,
            $log->destination,
            $log->user?->name ?? '—',
            $log->buyer_request_id,
            $log->buyerRequest?->title ?? '—',
            $log->subject,
            $log->failure_reason,
            optional($log->sent_at)->format('Y-m-d H:i:s'),
        ]));
    }

    public function resend(BuyerRequestAlertLog $log)
    {
        if (! $log->isFailed()) {
            return back()->with('error', 'Only failed alerts can be resent.');
        }

        $user = $log->user;
        $request = $log->buyerRequest;

        if (! $user || ! $request) {
            return back()->with('error', 'Cannot resend: recipient or buyer request is missing.');
        }

        $context = $this->resendContext($log->alert_key, $request, $user);

        BuyerRequestAlertSender::sendChannel(
            $user,
            $log->alert_key,
            $request,
            $log->channel,
            $context
        );

        return back()->with(
            'success',
            sprintf('Resent %s alert only. Check the latest log rows for status.', $log->channel)
        );
    }

    protected function applyFilters($query, Request $request): void
    {
        if ($search = trim((string) $request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('destination', 'LIKE', "%{$search}%")
                    ->orWhere('subject', 'LIKE', "%{$search}%")
                    ->orWhere('alert_key', 'LIKE', "%{$search}%")
                    ->orWhere('body', 'LIKE', "%{$search}%")
                    ->orWhere('failure_reason', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%")
                            ->orWhere('phone', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('buyerRequest', function ($requestQuery) use ($search) {
                        $requestQuery->where('title', 'LIKE', "%{$search}%");
                    });
            });
        }

        $channel = $request->input('channel', 'all');
        if ($channel && $channel !== 'all') {
            $query->where('channel', $channel);
        }

        $status = $request->input('status', 'all');
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $alertKey = $request->input('alert_key', 'all');
        if ($alertKey && $alertKey !== 'all') {
            $query->where('alert_key', $alertKey);
        }

        if ($request->filled('from')) {
            $query->whereDate('sent_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('sent_at', '<=', $request->input('to'));
        }
    }

    protected function resendContext(string $alertKey, BuyerRequest $request, $user): array
    {
        $priceKeys = [
            BuyerRequestAlertSender::KEY_OFFER_RECEIVED,
            BuyerRequestAlertSender::KEY_OFFER_UPDATED,
            BuyerRequestAlertSender::KEY_OFFER_ACCEPTED,
        ];

        if (! in_array($alertKey, $priceKeys, true)) {
            return [];
        }

        $offerQuery = BuyerRequestOffer::query()
            ->where('buyer_request_id', $request->id);

        if ($alertKey === BuyerRequestAlertSender::KEY_OFFER_ACCEPTED) {
            $offer = $offerQuery
                ->where('seller_id', $user->id)
                ->where('status', BuyerRequestOffer::STATUS_ACCEPTED)
                ->latest('id')
                ->first();
        } else {
            // Buyer-facing offer alerts: use latest offer on the request
            $offer = $offerQuery->latest('id')->first();
        }

        return $offer ? ['price' => $offer->price] : [];
    }

    protected function alertKeyOptions(): array
    {
        return [
            BuyerRequestAlertSender::KEY_MATCHED_REQUEST => 'Matched request',
            BuyerRequestAlertSender::KEY_OFFER_RECEIVED => 'Offer received',
            BuyerRequestAlertSender::KEY_OFFER_UPDATED => 'Offer updated',
            BuyerRequestAlertSender::KEY_OFFER_WITHDRAWN => 'Offer withdrawn',
            BuyerRequestAlertSender::KEY_OFFER_ACCEPTED => 'Offer accepted',
            BuyerRequestAlertSender::KEY_OFFER_REJECTED => 'Offer rejected',
            BuyerRequestAlertSender::KEY_REQUEST_CLOSED => 'Request closed',
        ];
    }
}
