import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Price from '@/Components/Price';
import Pagination from '@/Components/Pagination';

const statusColors = {
    open: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
    fulfilled: 'bg-sky-100 text-sky-700',
};

export default function Index({ requests, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(route('admin.buyer-requests.index'), { search, status }, { preserveState: true });
    };

    const closeRequest = (id) => {
        if (!window.confirm('Close this buyer request? Sellers will no longer be able to offer.')) return;
        router.post(route('admin.buyer-requests.close', id));
    };

    return (
        <AdminLayout title="Buyer Requests">
            <Head title="Buyer Requests" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <form onSubmit={handleFilter} className="flex flex-1 flex-col sm:flex-row gap-3 max-w-3xl">
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                                placeholder="Search title, buyer, location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                router.get(
                                    route('admin.buyer-requests.index'),
                                    { search, status: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="fulfilled">Fulfilled</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Request</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Budget</th>
                                <th className="px-6 py-4">Offers</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">#{item.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 line-clamp-1">
                                            {item.location_label || [item.city, item.country].filter(Boolean).join(', ') || '—'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800">{item.user?.name || '—'}</p>
                                        <p className="text-[10px] text-gray-500">{item.user?.email}</p>
                                        {(item.user?.phone || item.user?.individual_verification?.contact_number || item.user?.individualVerification?.contact_number) && (
                                            <p className="text-[10px] text-gray-700 flex items-center gap-1 mt-0.5">
                                                <i className="fa-solid fa-phone text-[8px] text-emerald-600"></i>
                                                <span>{item.user?.phone || item.user?.individual_verification?.contact_number || item.user?.individualVerification?.contact_number}</span>
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.category?.name || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.budget != null && Number(item.budget) > 0 ? (
                                            <Price amountPKR={item.budget} className="text-sm font-bold text-gray-800" />
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{item.offers_count || 0}</p>
                                        {Number(item.pending_offers_count || 0) > 0 && (
                                            <p className="text-[10px] text-amber-600 font-semibold">
                                                {item.pending_offers_count} pending
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                statusColors[item.status] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => router.get(route('admin.buyer-requests.show', item.id))}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                                title="View"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            {item.status === 'open' && (
                                                <button
                                                    type="button"
                                                    onClick={() => closeRequest(item.id)}
                                                    className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                                                    title="Close"
                                                >
                                                    <i className="fa-solid fa-lock"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {requests.data.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fa-solid fa-clipboard-list text-4xl mb-4 text-gray-100"></i>
                        <p>No buyer requests found</p>
                    </div>
                )}

                <div className="p-6 border-top border-gray-100">
                    <Pagination links={requests.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
