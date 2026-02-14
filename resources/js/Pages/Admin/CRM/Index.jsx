import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';

export default function Index({ outreaches, filters }) {
       const [editing, setEditing] = useState(null);
       const [editData, setEditData] = useState({});

       const handleEdit = (item) => {
              setEditing(item.id);
              setEditData({
                     call_status: item.call_status,
                     customer_feedback_summary: item.customer_feedback_summary || '',
                     contract_date: item.contract_date || ''
              });
       };

       const submitUpdate = (e) => {
              e.preventDefault();
              router.put(route('admin.crm.update', editing), editData, {
                     onSuccess: () => setEditing(null),
              });
       };

       const handleSearch = (e) => {
              const value = e.target.value;
              router.get(route('admin.crm.index'), { ...filters, search: value }, { preserveState: true, replace: true });
       };

       const handleStatusFilter = (status) => {
              router.get(route('admin.crm.index'), { ...filters, call_status: status }, { preserveState: true });
       };

       return (
              <AdminLayout title="CRM / Customer Outreach">
                     <Head title="CRM" />

                     <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <div className="relative flex-1 max-w-md">
                                          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                          <input
                                                 type="text"
                                                 className="w-full pl-12 pr-4 py-3 bg-white border-none focus:ring-2 focus:ring-black rounded-2xl shadow-sm text-sm"
                                                 placeholder="Search by name, email or phone..."
                                                 defaultValue={filters.search}
                                                 onChange={handleSearch}
                                          />
                                   </div>
                                   <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                          {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                                                 <button
                                                        key={status}
                                                        onClick={() => handleStatusFilter(status === 'All' ? '' : status)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${(filters.call_status || 'All') === status ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                                                               }`}
                                                 >
                                                        {status}
                                                 </button>
                                          ))}
                                   </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                   <div className="overflow-x-auto">
                                          <table className="w-full text-left border-collapse">
                                                 <thead>
                                                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                                               <th className="px-6 py-4">Customer Details</th>
                                                               <th className="px-6 py-4">Verification</th>
                                                               <th className="px-6 py-4">Status</th>
                                                               <th className="px-6 py-4">Next Action</th>
                                                               <th className="px-6 py-4 text-right">Actions</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-gray-100">
                                                        {outreaches.data.map((item) => (
                                                               <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                                                      <td className="px-6 py-4">
                                                                             <div className="flex items-center gap-3">
                                                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                                                                                           {item.name?.charAt(0)}
                                                                                    </div>
                                                                                    <div>
                                                                                           <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                                                           <p className="text-[10px] text-gray-400">{item.email} • {item.phone}</p>
                                                                                    </div>
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.user?.individual_verification?.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                                                    }`}>
                                                                                    {item.user?.individual_verification?.status || 'Not Verified'}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.call_status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                                                                           item.call_status === 'Pending' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-600'
                                                                                    }`}>
                                                                                    {item.call_status}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <p className="text-xs text-gray-600 line-clamp-1">{item.customer_feedback_summary || '-'}</p>
                                                                      </td>
                                                                      <td className="px-6 py-4 text-right">
                                                                             <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors">
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </button>
                                                                      </td>
                                                               </tr>
                                                        ))}
                                                 </tbody>
                                          </table>
                                   </div>
                            </div>
                     </div>

                     {/* Edit Modal */}
                     {editing && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                   <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
                                          <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                                 <h3 className="font-bold text-gray-800">Update Outreach Status</h3>
                                                 <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-black"><i className="fa-solid fa-xmark"></i></button>
                                          </div>
                                          <form onSubmit={submitUpdate} className="p-6 space-y-4">
                                                 <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Call Status</label>
                                                               <select
                                                                      className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm"
                                                                      value={editData.call_status}
                                                                      onChange={e => setEditData({ ...editData, call_status: e.target.value })}
                                                               >
                                                                      <option value="Pending">Pending</option>
                                                                      <option value="In Progress">In Progress</option>
                                                                      <option value="Completed">Completed</option>
                                                                      <option value="Cancelled">Cancelled</option>
                                                               </select>
                                                        </div>
                                                        <div>
                                                               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Next Contact Date</label>
                                                               <input
                                                                      type="date"
                                                                      className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm"
                                                                      value={editData.contract_date}
                                                                      onChange={e => setEditData({ ...editData, contract_date: e.target.value })}
                                                               />
                                                        </div>
                                                 </div>
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Feedback Summary</label>
                                                        <textarea
                                                               className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm min-h-[120px]"
                                                               placeholder="Summarize the customer interaction..."
                                                               value={editData.customer_feedback_summary}
                                                               onChange={e => setEditData({ ...editData, customer_feedback_summary: e.target.value })}
                                                        />
                                                 </div>
                                                 <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
                                                        Update CRM Entry
                                                 </button>
                                          </form>
                                   </div>
                            </div>
                     )}
              </AdminLayout>
       );
}
