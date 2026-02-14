import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function PaymentRequests({ requests, filters }) {
       const [search, setSearch] = useState(filters.search || '');
       const [status, setStatus] = useState(filters.status || '');

       const handleFilter = (e) => {
              e?.preventDefault();
              router.get(route('admin.payment-requests.index'), { search, status }, { preserveState: true });
       };

       const updateStatus = (id, newStatus) => {
              if (confirm(`Are you sure you want to mark this request as ${newStatus}?`)) {
                     router.patch(route('admin.payment-requests.update-status', id), {
                            status: newStatus
                     });
              }
       };

       return (
              <AdminLayout title="Payment Requests">
                     <Head title="Payment Requests" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleFilter} className="flex flex-1 gap-4 max-w-2xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                        placeholder="Search by user name or email..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <select
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 value={status}
                                                 onChange={(e) => { setStatus(e.target.value); handleFilter(); }}
                                          >
                                                 <option value="">All Status</option>
                                                 <option value="pending">Pending</option>
                                                 <option value="approved">Approved</option>
                                                 <option value="rejected">Rejected</option>
                                          </select>
                                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Search</button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">User</th>
                                                        <th className="px-6 py-4">Method</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Date</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {requests.data.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <div className="flex flex-col">
                                                                             <span className="text-sm font-bold text-gray-800">{item.user?.name}</span>
                                                                             <span className="text-[10px] text-gray-400">{item.user?.email}</span>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded capitalize">{item.payment_method || 'N/A'}</span>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-sm font-bold text-black">AED {item.amount}</span>
                                                               </td>
                                                               <td className="px-6 py-4 text-xs text-gray-500">
                                                                      {new Date(item.created_at).toLocaleDateString()}
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : (item.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')}`}>
                                                                             {item.status}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      {item.status === 'pending' && (
                                                                             <div className="flex items-center justify-end gap-2">
                                                                                    <button onClick={() => updateStatus(item.id, 'approved')} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Approve"><i className="fa-solid fa-check"></i></button>
                                                                                    <button onClick={() => updateStatus(item.id, 'rejected')} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Reject"><i className="fa-solid fa-xmark"></i></button>
                                                                             </div>
                                                                      )}
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={requests.links} />
                            </div>
                     </div>
              </AdminLayout>
       );
}
