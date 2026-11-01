import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusColors = {
    sent: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
    skipped: 'bg-slate-100 text-slate-600',
};

const channelColors = {
    email: 'bg-sky-100 text-sky-700',
    whatsapp: 'bg-emerald-100 text-emerald-700',
};

const alertLabels = {
    matched_request: 'Matched request',
    offer_received: 'Offer received',
    offer_updated: 'Offer updated',
    offer_withdrawn: 'Offer withdrawn',
    offer_accepted: 'Offer accepted',
    offer_rejected: 'Offer rejected',
    request_closed: 'Request closed',
};

export default function Show({ log }) {
    const request = log.buyer_request || log.buyerRequest;
    const user = log.user;

    const resend = () => {
        if (!window.confirm(`Resend this failed ${log.channel} alert only?`)) return;
        router.post(route('admin.buyer-request-alerts.resend', log.id));
    };

    return (
        <AdminLayout title={`Alert #${log.id}`}>
            <Head title={`Alert #${log.id}`} />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={route('admin.buyer-request-alerts.index')}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                    <i className="fa-solid fa-arrow-left mr-2"></i> Back to Request Alerts
                </Link>
                <div className="flex flex-wrap gap-2">
                    <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            channelColors[log.channel] || 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {log.channel}
                    </span>
                    <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            statusColors[log.status] || 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {log.status}
                    </span>
                    {log.status === 'failed' && (
                        <button
                            type="button"
                            onClick={resend}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                        >
                            <i className="fa-solid fa-rotate-right"></i> Resend
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                            {alertLabels[log.alert_key] || log.alert_key}
                        </h2>
                        {log.subject && (
                            <p className="text-sm text-gray-500 mb-4">{log.subject}</p>
                        )}
                        <pre className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-800 font-sans">
                            {log.body || '—'}
                        </pre>
                    </div>

                    {log.failure_reason && (
                        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                            <h3 className="text-sm font-bold text-rose-800 mb-2 uppercase tracking-wider">
                                Failure reason
                            </h3>
                            <p className="text-sm text-rose-700 whitespace-pre-wrap">{log.failure_reason}</p>
                            {log.provider_response && (
                                <p className="mt-3 text-xs text-gray-500">
                                    Provider: {log.provider_response}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Recipient</h3>
                        <p className="text-sm font-bold text-gray-900">{user?.name || '—'}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.destination || '—'}</p>
                        {user?.id && (
                            <Link
                                href={route('admin.users.show', user.id)}
                                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                            >
                                View user profile
                            </Link>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Request</h3>
                        <p className="text-sm font-bold text-gray-900 line-clamp-2">
                            {request?.title || '—'}
                        </p>
                        {request?.status && (
                            <p className="text-[10px] text-gray-400 uppercase mt-1">{request.status}</p>
                        )}
                        {log.buyer_request_id && (
                            <Link
                                href={route('admin.buyer-requests.show', log.buyer_request_id)}
                                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                            >
                                View buyer request
                            </Link>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Meta</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Alert key</span>
                                <span className="font-mono text-xs text-gray-800">{log.alert_key}</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Sent at</span>
                                <span className="text-gray-800">
                                    {log.sent_at ? new Date(log.sent_at).toLocaleString() : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
