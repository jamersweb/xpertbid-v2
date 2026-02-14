import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ bids, filters }) {
       const [search, setSearch] = useState(filters.search || '');
       const [sort, setSort] = useState(filters.sort || 'newest');

       const handleFilter = (e) => {
              e?.preventDefault();
              router.get(route('admin.bids.index'), { search, sort }, { preserveState: true });
       };

       return (
              <AdminLayout title="Bids History">
                     <Head title="Bids History" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleFilter} className="flex flex-1 gap-4 max-w-2xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                        placeholder="Search by auction, user, or amount..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <select
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 value={sort}
                                                 onChange={(e) => { setSort(e.target.value); handleFilter(); }}
                                          >
                                                 <option value="newest">Newest First</option>
                                                 <option value="oldest">Oldest First</option>
                                                 <option value="highest">Highest Amount</option>
                                                 <option value="lowest">Lowest Amount</option>
                                          </select>
                                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Filter</button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Bid ID</th>
                                                        <th className="px-6 py-4">Auction</th>
                                                        <th className="px-6 py-4">Bidder</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Placed At</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {bids.data.map((bid) => (
                                                        <tr key={bid.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <span className="text-xs font-mono text-gray-400">#{bid.id}</span>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <div className="flex flex-col">
                                                                             <span className="text-sm font-bold text-gray-800 line-clamp-1">{bid.auction?.title}</span>
                                                                             <span className="text-[10px] text-gray-400">ID: {bid.auction_id}</span>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <div className="flex flex-col">
                                                                             <span className="text-sm text-gray-800 font-medium">{bid.user?.name}</span>
                                                                             <span className="text-[10px] text-gray-500">{bid.user?.email}</span>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-sm font-bold text-emerald-600">{bid.auction?.currency} {bid.bid_amount}</span>
                                                               </td>
                                                               <td className="px-6 py-4 text-xs text-gray-500">
                                                                      {new Date(bid.created_at).toLocaleString()}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <button onClick={() => router.get(route('admin.bids.show', bid.id))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                             <i className="fa-solid fa-eye"></i>
                                                                      </button>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={bids.links} />
                            </div>
                     </div>
              </AdminLayout>
       );
}
