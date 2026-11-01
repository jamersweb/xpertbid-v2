import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Price from '@/Components/Price';
import Pagination from '@/Components/Pagination';

const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    withdrawn: 'bg-slate-100 text-slate-600',
};

export default function Index({ offers, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(route('admin.buyer-request-offers.index'), { search, status }, { preserveState: true });
    };

    return (
        <AdminLayout title="Request Offers">
            <Head title="Request Offers" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <form onSubmit={handleFilter} className="flex flex-1 flex-col sm:flex-row gap-3 max-w-3xl">
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                                placeholder="Search request, seller, message..."
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
                                    route('admin.buyer-request-offers.index'),
                                    { search, status: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="withdrawn">Withdrawn</option>
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
                                <th className="px-6 py-4">Offer</th>
                                <th className="px-6 py-4">Request</th>
                                <th className="px-6 py-4">Seller</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.data.map((offer) => {
                                const request = offer.buyer_request || offer.buyerRequest;
                                const requestId = offer.buyer_request_id || request?.id;
                                return (
                                <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">#{offer.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                            {request?.title || '—'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 capitalize">
                                            Request: {request?.status || '—'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800">{offer.seller?.name || '—'}</p>
                                        <p className="text-[10px] text-gray-500">{offer.seller?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Price amountPKR={offer.price} className="text-sm font-bold text-gray-800" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                statusColors[offer.status] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {offer.created_at ? new Date(offer.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {requestId ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.get(route('admin.buyer-requests.show', requestId))
                                                }
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                                title="View request"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-300">—</span>
                                        )}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {offers.data.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fa-solid fa-hand-holding-hand text-4xl mb-4 text-gray-100"></i>
                        <p>No offers found</p>
                    </div>
                )}

                <div className="p-6 border-top border-gray-100">
                    <Pagination links={offers.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
