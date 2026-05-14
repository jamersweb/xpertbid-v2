import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Head, router } from '@inertiajs/react';

const money = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;

export default function Index({ rewards, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'pending');

    const handleFilter = (event) => {
        event?.preventDefault();
        router.get(route('admin.referral-rewards.index'), { search, status }, { preserveState: true });
    };

    const act = (reward, action) => {
        const note = window.prompt(action === 'approve' ? 'Approval note (optional)' : 'Rejection reason (optional)', '');
        if (note === null) return;

        router.post(route(`admin.referral-rewards.${action}`, reward.id), { admin_note: note }, { preserveScroll: true });
    };

    const statusColors = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-rose-100 text-rose-700',
        paid: 'bg-blue-100 text-blue-700',
    };

    return (
        <AdminLayout title="Referral Rewards">
            <Head title="Referral Rewards" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Referral Reward Review</h2>
                        <p className="text-xs text-gray-500">Approve 1% referral rewards after validating completed sales or purchases.</p>
                    </div>
                    <form onSubmit={handleFilter} className="flex flex-1 gap-3 max-w-2xl">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                            placeholder="Search users, order, listing..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <select
                            className="bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="paid">Paid</option>
                        </select>
                        <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Search</button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Referrer</th>
                                <th className="px-6 py-4">Referred User</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Reward</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rewards.data.map((reward) => (
                                <tr key={reward.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{reward.referrer?.name}</p>
                                        <p className="text-[11px] text-gray-500">{reward.referrer?.email || reward.referrer?.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{reward.referred_user?.name}</p>
                                        <p className="text-[11px] text-gray-500">{reward.referred_user?.email || reward.referred_user?.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-gray-800">{reward.listing?.title || reward.order?.order_number || reward.source_type}</p>
                                        <p className="text-[10px] text-gray-500 capitalize">{reward.trigger_type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{money(reward.reward_amount)}</p>
                                        <p className="text-[10px] text-gray-500">1% of {money(reward.amount_base)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[reward.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {reward.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {reward.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => act(reward, 'approve')} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Approve</button>
                                                <button onClick={() => act(reward, 'reject')} className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Reviewed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {rewards.data.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fa-solid fa-share-nodes text-4xl mb-4 text-gray-100"></i>
                        <p>No referral rewards found</p>
                    </div>
                )}

                <div className="p-6 border-top border-gray-100">
                    <Pagination links={rewards.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
