import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ orders, filters }) {
       const [search, setSearch] = useState(filters.search || '');
       const [status, setStatus] = useState(filters.status || 'all');

       const handleFilter = (e) => {
              e?.preventDefault();
              router.get(route('admin.orders.index'), { search, status }, { preserveState: true });
       };

       const statusColors = {
              pending: 'bg-amber-100 text-amber-700',
              processing: 'bg-blue-100 text-blue-700',
              completed: 'bg-emerald-100 text-emerald-700',
              cancelled: 'bg-rose-100 text-rose-700',
       };

       return (
              <AdminLayout title="Order Management">
                     <Head title="Order Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleFilter} className="flex flex-1 gap-4 max-w-2xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                        placeholder="Search by number, name, email..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <select
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 value={status}
                                                 onChange={(e) => { setStatus(e.target.value); handleFilter(); }}
                                          >
                                                 <option value="all">All Status</option>
                                                 <option value="pending">Pending</option>
                                                 <option value="processing">Processing</option>
                                                 <option value="completed">Completed</option>
                                                 <option value="cancelled">Cancelled</option>
                                          </select>
                                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Search</button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Order Info</th>
                                                        <th className="px-6 py-4">Customer</th>
                                                        <th className="px-6 py-4">Total</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4">Date</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {orders.data.map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800">{order.order_number}</p>
                                                                      <p className="text-[10px] text-gray-400">{order.items?.length || 0} Items</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-medium text-gray-800">{order.billing_name}</p>
                                                                      <p className="text-[10px] text-gray-500">{order.billing_email}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold">AED {order.total}</p>
                                                                      <p className="text-[10px] text-gray-400 capitalize">{order.payment_method?.replace('_', ' ')}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                                             {order.status}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4 text-xs text-gray-500">
                                                                      {new Date(order.created_at).toLocaleDateString()}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <button onClick={() => router.get(route('admin.orders.show', order.id))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                             <i className="fa-solid fa-eye"></i>
                                                                      </button>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            {orders.data.length === 0 && (
                                   <div className="p-12 text-center text-gray-400">
                                          <i className="fa-solid fa-box-open text-4xl mb-4 text-gray-100"></i>
                                          <p>No orders found</p>
                                   </div>
                            )}

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={orders.links} />
                            </div>
                     </div>
              </AdminLayout>
       );
}
