import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

const statusClasses = {
       active: 'bg-emerald-100 text-emerald-700',
       soon: 'bg-sky-100 text-sky-700',
       closed: 'bg-slate-100 text-slate-700',
       inactive: 'bg-gray-100 text-gray-700',
};

const statusLabel = (status) => {
       if (status === 'active') return 'Live';
       return status || 'N/A';
};

const thumbnailFor = (session) => {
       if (session?.youtube_video_id) {
              return `https://img.youtube.com/vi/${session.youtube_video_id}/hqdefault.jpg`;
       }

       const first = session?.selected_listings?.[0];
       if (first?.youtube_video_id) {
              return `https://img.youtube.com/vi/${first.youtube_video_id}/hqdefault.jpg`;
       }

       return null;
};

export default function Sessions({ sessions, filters = {} }) {
       const [search, setSearch] = useState(filters.search || '');
       const [status, setStatus] = useState(filters.status || '');

       const submit = (e) => {
              e.preventDefault();
              router.get(route('admin.live.index'), { search, status }, { preserveState: true, replace: true });
       };

       return (
              <AdminLayout title="Live">
                     <Head title="Live" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 space-y-4">
                                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                          <div>
                                                 <h1 className="text-2xl font-black text-gray-900">Live</h1>
                                                 <p className="text-sm text-gray-500 mt-1">All live streams, scheduled lives, and closed live auction sessions.</p>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2">
                                                 <button
                                                        type="button"
                                                        onClick={() => router.get(route('admin.live-auctions.setup'))}
                                                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                                                 >
                                                        <i className="fa-solid fa-tower-broadcast mr-2"></i>
                                                        Setup Live
                                                 </button>
                                                 <button
                                                        type="button"
                                                        onClick={() => router.get(route('admin.live-auctions.index'))}
                                                        className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
                                                 >
                                                        Live Auctions
                                                 </button>
                                          </div>
                                   </div>

                                   <form onSubmit={submit} className="flex flex-col md:flex-row gap-3 max-w-3xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        placeholder="Search live URL, video ID, status..."
                                                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400"
                                                 />
                                          </div>
                                          <select
                                                 value={status}
                                                 onChange={(e) => setStatus(e.target.value)}
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 px-4 py-2.5"
                                          >
                                                 <option value="">All Status</option>
                                                 <option value="active">Live</option>
                                                 <option value="soon">Soon</option>
                                                 <option value="closed">Closed</option>
                                                 <option value="inactive">Inactive</option>
                                          </select>
                                          <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800">
                                                 Filter
                                          </button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-4 py-4">Stream</th>
                                                        <th className="px-4 py-4">Selected Auctions</th>
                                                        <th className="px-4 py-4">Schedule</th>
                                                        <th className="px-4 py-4">Status</th>
                                                        <th className="px-4 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {sessions.data.map((session) => {
                                                        const thumb = thumbnailFor(session);
                                                        return (
                                                               <tr key={session.id} className="hover:bg-gray-50/60 transition-colors">
                                                                      <td className="px-4 py-4">
                                                                             <div className="flex items-center gap-3">
                                                                                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-black border border-gray-200 shrink-0">
                                                                                           {thumb ? (
                                                                                                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                                                                                           ) : (
                                                                                                  <div className="w-full h-full flex items-center justify-center text-white">
                                                                                                         <i className="fa-brands fa-youtube"></i>
                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                           <p className="text-sm font-black text-gray-900 mb-1 whitespace-nowrap">Live Session #{session.id}</p>
                                                                                           <p className="text-xs text-gray-500 mb-0 truncate max-w-[200px]">{session.live_url}</p>
                                                                                           <p className="text-[10px] text-gray-400 mt-1 mb-0 whitespace-nowrap">Video ID: {session.youtube_video_id || 'N/A'}</p>
                                                                                    </div>
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-4 py-4">
                                                                             <p className="text-sm font-black text-gray-900 mb-1 whitespace-nowrap">{session.selected_count || 0} auctions</p>
                                                                             <div className="flex flex-wrap gap-1 max-w-[240px]">
                                                                                    {(session.selected_listings || []).slice(0, 3).map((listing) => (
                                                                                           <span key={listing.id} className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 max-w-[100px] truncate">
                                                                                                  #{listing.id} {listing.title}
                                                                                           </span>
                                                                                    ))}
                                                                                    {(session.selected_count || 0) > 3 ? (
                                                                                           <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 whitespace-nowrap">
                                                                                                  +{session.selected_count - 3} more
                                                                                           </span>
                                                                                    ) : null}
                                                                             </div>
                                                                      </td>
                                                                      <td className="px-4 py-4 whitespace-nowrap">
                                                                             <p className="text-sm font-bold text-gray-900 mb-0">
                                                                                    {session.scheduled_at ? new Date(session.scheduled_at).toLocaleString() : 'N/A'}
                                                                             </p>
                                                                             <p className="text-[11px] text-gray-500 mb-0">Created: {new Date(session.created_at).toLocaleString()}</p>
                                                                      </td>
                                                                      <td className="px-4 py-4 whitespace-nowrap">
                                                                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses[session.status] || 'bg-gray-100 text-gray-700'}`}>
                                                                                    {statusLabel(session.status)}
                                                                             </span>
                                                                      </td>
                                                                      <td className="px-4 py-4 text-right">
                                                                             <div className="flex items-center justify-end gap-2">
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => router.get(route('admin.live-auctions.room'), { session: session.id })}
                                                                                           className="px-3 py-2 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 whitespace-nowrap"
                                                                                    >
                                                                                           Open Room
                                                                                    </button>
                                                                             </div>
                                                                      </td>
                                                               </tr>
                                                        );
                                                 })}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   {sessions.data.length ? (
                                          <Pagination links={sessions.links} />
                                   ) : (
                                          <div className="text-center py-8 text-sm text-gray-500">
                                                 No live sessions found.
                                          </div>
                                   )}
                            </div>
                     </div>
              </AdminLayout>
       );
}
