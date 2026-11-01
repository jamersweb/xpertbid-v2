import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import ExportCsvButton from '@/Components/Admin/ExportCsvButton';

const statusColors = {
    sent: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
    skipped: 'bg-slate-100 text-slate-600',
};

const channelColors = {
    email: 'bg-sky-100 text-sky-700',
    whatsapp: 'bg-emerald-100 text-emerald-700',
};

export default function Index({ logs, filters = {}, alertKeys = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [channel, setChannel] = useState(filters.channel || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [alertKey, setAlertKey] = useState(filters.alert_key || 'all');
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('admin.buyer-request-alerts.index'),
            {
                search,
                channel,
                status,
                alert_key: alertKey,
                from,
                to,
                ...overrides,
            },
            { preserveState: true }
        );
    };

    const handleFilter = (e) => {
        e?.preventDefault();
        applyFilters();
    };

    const resend = (id, channel) => {
        if (!window.confirm(`Resend this failed ${channel} alert only?`)) return;
        router.post(route('admin.buyer-request-alerts.resend', id));
    };

    return (
        <AdminLayout title="Request Alerts">
            <Head title="Request Alerts" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-bottom border-gray-100 flex flex-col gap-4">
                    <form onSubmit={handleFilter} className="flex flex-1 flex-col xl:flex-row gap-3">
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                                placeholder="Search recipient, request, subject, body..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900"
                            value={channel}
                            onChange={(e) => {
                                setChannel(e.target.value);
                                applyFilters({ channel: e.target.value });
                            }}
                        >
                            <option value="all">All Channels</option>
                            <option value="email">Email</option>
                            <option value="whatsapp">WhatsApp</option>
                        </select>
                        <select
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                            <option value="skipped">Skipped</option>
                        </select>
                        <select
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900"
                            value={alertKey}
                            onChange={(e) => {
                                setAlertKey(e.target.value);
                                applyFilters({ alert_key: e.target.value });
                            }}
                        >
                            <option value="all">All Alerts</option>
                            {Object.entries(alertKeys).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                        <input
                            type="date"
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                    <div className="flex justify-end">
                        <ExportCsvButton
                            routeName="admin.buyer-request-alerts.export"
                            params={{
                                search,
                                channel: channel !== 'all' ? channel : undefined,
                                status: status !== 'all' ? status : undefined,
                                alert_key: alertKey !== 'all' ? alertKey : undefined,
                            }}
                            title="Export Request Alerts"
                            description="Select a sent date range to download buyer-request alert logs as CSV."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Channel</th>
                                <th className="px-6 py-4">Alert</th>
                                <th className="px-6 py-4">Recipient</th>
                                <th className="px-6 py-4">Request</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Sent</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">#{log.id}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                channelColors[log.channel] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {log.channel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            {alertKeys[log.alert_key] || log.alert_key}
                                        </p>
                                        {log.subject && (
                                            <p className="text-[10px] text-gray-400 line-clamp-1">{log.subject}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800">{log.user?.name || '—'}</p>
                                        <p className="text-[10px] text-gray-500">{log.destination || '—'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                            {log.buyer_request?.title || log.buyerRequest?.title || '—'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                statusColors[log.status] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                        {log.sent_at ? new Date(log.sent_at).toLocaleString() : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.get(route('admin.buyer-request-alerts.show', log.id))
                                                }
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                                title="View"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            {log.status === 'failed' && (
                                                <button
                                                    type="button"
                                                    onClick={() => resend(log.id, log.channel)}
                                                    className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                                                    title={`Resend ${log.channel} only`}
                                                >
                                                    <i className="fa-solid fa-rotate-right"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.data.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fa-solid fa-bell-slash text-4xl mb-4 text-gray-100"></i>
                        <p>No alert logs found</p>
                    </div>
                )}

                <div className="p-6 border-top border-gray-100">
                    <Pagination links={logs.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
