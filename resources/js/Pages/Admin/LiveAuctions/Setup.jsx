import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Price from '@/Components/Price';

export default function Setup({ liveAuctions = [] }) {
       const [search, setSearch] = useState('');
       const { data, setData, post, processing, errors } = useForm({
              live_url: '',
              auction_ids: [],
       });

       const filteredAuctions = useMemo(() => {
              const term = search.trim().toLowerCase();
              if (!term) return liveAuctions;
              return liveAuctions.filter((auction) => {
                     return String(auction.title || '').toLowerCase().includes(term)
                            || String(auction.id || '').includes(term)
                            || String(auction.category?.name || '').toLowerCase().includes(term);
              });
       }, [liveAuctions, search]);

       const toggleAuction = (id) => {
              const normalizedId = Number(id);
              const next = data.auction_ids.includes(normalizedId)
                     ? data.auction_ids.filter((item) => item !== normalizedId)
                     : [...data.auction_ids, normalizedId];
              setData('auction_ids', next);
       };

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.live-auctions.launch'));
       };

       return (
              <AdminLayout title="Setup Live Auction">
                     <Head title="Setup Live Auction" />

                     <form onSubmit={submit} className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                          <div>
                                                 <h1 className="text-2xl font-black text-gray-900">Setup Live Auction</h1>
                                                 <p className="text-sm text-gray-500 mt-1">Add YouTube live URL and select the products for the live control room.</p>
                                          </div>
                                          <button
                                                 type="button"
                                                 onClick={() => router.get(route('admin.live-auctions.index'))}
                                                 className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200"
                                          >
                                                 Back
                                          </button>
                                   </div>

                                   <div className="mt-6">
                                          <label className="block text-sm font-bold text-gray-800 mb-2">YouTube Live URL</label>
                                          <input
                                                 type="url"
                                                 value={data.live_url}
                                                 onChange={(e) => setData('live_url', e.target.value)}
                                                 placeholder="https://www.youtube.com/live/..."
                                                 className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-950 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black"
                                                 style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                                          />
                                          {errors.live_url && <p className="text-xs text-red-600 mt-2">{errors.live_url}</p>}
                                   </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                   <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                          <div>
                                                 <h2 className="text-lg font-black text-gray-900">Select Auctions</h2>
                                                 <p className="text-sm text-gray-500 mt-1">{data.auction_ids.length} selected</p>
                                          </div>
                                          <div className="relative w-full md:w-80">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        placeholder="Search live auctions..."
                                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-black"
                                                 />
                                          </div>
                                   </div>

                                   {errors.auction_ids && <p className="text-xs text-red-600 px-6 pt-4 mb-0">{errors.auction_ids}</p>}

                                   <div className="divide-y divide-gray-100 max-h-[520px] overflow-auto">
                                          {filteredAuctions.length ? filteredAuctions.map((auction) => {
                                                 const checked = data.auction_ids.includes(Number(auction.id));
                                                 const startPrice = auction.listing_data?.start_price;

                                                 return (
                                                        <label key={auction.id} className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 ${checked ? 'bg-sky-50' : ''}`}>
                                                               <input
                                                                      type="checkbox"
                                                                      checked={checked}
                                                                      onChange={() => toggleAuction(auction.id)}
                                                                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                                                               />
                                                               <div className="w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                                                                      {auction.youtube_video_id ? (
                                                                             <img
                                                                                    src={`https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg`}
                                                                                    alt=""
                                                                                    className="w-full h-full object-cover"
                                                                             />
                                                                      ) : (
                                                                             <div className="w-full h-full flex items-center justify-center text-white">
                                                                                    <i className="fa-brands fa-youtube"></i>
                                                                             </div>
                                                                      )}
                                                               </div>
                                                               <div className="min-w-0 flex-1">
                                                                      <p className="text-sm font-black text-gray-900 mb-1 truncate">{auction.title}</p>
                                                                      <p className="text-xs text-gray-500 mb-0">ID: {auction.id} | {auction.category?.name || 'No Category'}</p>
                                                               </div>
                                                               <div className="hidden md:block text-right">
                                                                      <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">{auction.status}</span>
                                                                      <div className="text-sm font-bold text-gray-900 mt-1">
                                                                             {startPrice ? <Price amountPKR={startPrice} /> : 'N/A'}
                                                                      </div>
                                                               </div>
                                                        </label>
                                                 );
                                          }) : (
                                                 <div className="px-6 py-10 text-center text-sm text-gray-500">No live auctions found.</div>
                                          )}
                                   </div>

                                   <div className="p-6 border-t border-gray-100 flex justify-end">
                                          <button
                                                 type="submit"
                                                 disabled={processing}
                                                 className="px-7 py-3 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 disabled:opacity-60"
                                          >
                                                 <i className="fa-solid fa-circle-play mr-2"></i>
                                                 {processing ? 'Opening...' : 'Live Now'}
                                          </button>
                                   </div>
                            </div>
                     </form>
              </AdminLayout>
       );
}
