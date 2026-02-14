import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ emailLogs, filters }) {
       const handleSearch = (e) => {
              router.get(route('admin.email-logs.index'), { search: e.target.value }, { preserveState: true, replace: true });
       };

       return (
              <AdminLayout title="System Email Logs">
                     <Head title="Email Logs" />

                     <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                   <div className="relative flex-1 max-w-md">
                                          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                          <input
                                                 type="text"
                                                 className="w-full pl-12 pr-4 py-3 bg-white border-none focus:ring-2 focus:ring-black rounded-2xl shadow-sm text-sm"
                                                 placeholder="Search by email, subject or recipient..."
                                                 defaultValue={filters.search}
                                                 onChange={handleSearch}
                                          />
                                   </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                   <div className="overflow-x-auto">
                                          <table className="w-full text-left border-collapse">
                                                 <thead>
                                                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                                                               <th className="px-6 py-4">Recipient</th>
                                                               <th className="px-6 py-4">Subject</th>
                                                               <th className="px-6 py-4">Type</th>
                                                               <th className="px-6 py-4">Sent At</th>
                                                               <th className="px-6 py-4 text-right">Status</th>
                                                        </tr>
                                                 </thead>
                                                 <tbody className="divide-y divide-gray-100">
                                                        {emailLogs.data.map((log) => (
                                                               <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                                      <td className="px-6 py-4">
                                                                             <div className="flex flex-col">
                                                                                    <span className="text-sm font-bold text-gray-800">{log.recipient_email}</span>
                                                                                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{log.user?.name || 'Guest'}</span>
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="text-xs text-gray-600 line-clamp-1">{log.subject}</span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase">
                                                                                    {log.type}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="text-[11px] text-gray-400 font-medium">
                                                                                    {new Date(log.sent_at).toLocaleString()}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-6 py-4 text-right">
                                                                             <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                                                    Sent
                                                                             </span>
                                                                      </td>
                                                               </tr>
                                                        ))}
                                                        {emailLogs.data.length === 0 && (
                                                               <tr>
                                                                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic text-sm">
                                                                             No email logs found.
                                                                      </td>
                                                               </tr>
                                                        )}
                                                 </tbody>
                                          </table>
                                   </div>
                            </div>
                     </div>
              </AdminLayout>
       );
}
