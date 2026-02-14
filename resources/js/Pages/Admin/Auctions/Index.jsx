import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auctions, filters }) {
       const [search, setSearch] = useState(filters.search || '');
       const [status, setStatus] = useState(filters.status || '');

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.auctions.index'), { search, status }, { preserveState: true });
       };

       const statusBadges = {
              active: 'bg-emerald-100 text-emerald-700',
              pending: 'bg-amber-100 text-amber-700',
              declined: 'bg-rose-100 text-rose-700',
              completed: 'bg-blue-100 text-blue-700',
              cancelled: 'bg-gray-100 text-gray-700',
       };

       return (
              <AdminLayout title="Auctions Management">
                     <Head title="Auctions Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleSearch} className="flex flex-1 gap-4 max-w-2xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                        placeholder="Search by title or ID..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <select
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 value={status}
                                                 onChange={(e) => setStatus(e.target.value)}
                                          >
                                                 <option value="">All Status</option>
                                                 <option value="pending">Pending</option>
                                                 <option value="active">Active</option>
                                                 <option value="declined">Declined</option>
                                                 <option value="completed">Completed</option>
                                          </select>
                                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Filter</button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Auction Details</th>
                                                        <th className="px-6 py-4">Seller</th>
                                                        <th className="px-6 py-4">Category</th>
                                                        <th className="px-6 py-4">Pricing</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {auctions.data.map((auction) => (
                                                        <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <div className="flex items-center gap-3">
                                                                             <img src={auction.image_url || '/images/placeholder.png'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                                             <div>
                                                                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{auction.title}</p>
                                                                                    <p className="text-[10px] text-gray-400">ID: {auction.id} | Ends: {new Date(auction.end_date).toLocaleDateString()}</p>
                                                                             </div>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm text-gray-800">{auction.user?.name}</p>
                                                                      <p className="text-[11px] text-gray-500">{auction.user?.email}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{auction.category?.name}</span>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-black">{auction.currency} {auction.min_bid}</p>
                                                                      <p className="text-[10px] text-gray-400 capitalize">{auction.list_type.replace('_', ' ')}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[auction.status] || 'bg-gray-100'}`}>
                                                                             {auction.status}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <button onClick={() => router.get(route('admin.auctions.edit', auction.id))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                                                             <button onClick={() => { if (confirm('Delete this auction?')) router.delete(route('admin.auctions.destroy', auction.id)) }} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={auctions.links} />
                            </div>
                     </div>
              </AdminLayout>
       );
}
