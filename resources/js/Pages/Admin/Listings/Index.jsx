import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Price from '@/Components/Price';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2';

function LiveAuctionPreview({ videoId, title }) {
       if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
              return (
                     <div className="w-24 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                            <i className="fa-brands fa-youtube text-lg"></i>
                     </div>
              );
       }

       return (
              <div className="w-24 h-14 rounded-lg overflow-hidden bg-black border border-gray-200 shadow-sm shrink-0">
                     <iframe
                            title={title || 'Live auction preview'}
                            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&mute=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full border-0"
                     />
              </div>
       );
}

export default function Index({
       listings,
       filters = {},
       pageTitle = 'Listings Management',
       pageDescription = 'Manage listings from here.',
       filterRouteName = 'admin.listings.index',
       createRouteName = 'admin.listings.create',
       createButtonLabel = 'Create Listing',
       isLiveAuctionPage = false,
}) {
       const [search, setSearch] = useState(filters.search || '');
       const [status, setStatus] = useState(filters.status || '');

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route(filterRouteName), { search, status }, { preserveState: true });
       };

       const handleDelete = async (listingId) => {
              const result = await Swal.fire({
                     title: 'Are you sure?',
                     text: 'This listing will be deleted permanently.',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#000000',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'Yes, delete it',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.delete(route('admin.listings.destroy', listingId));
              }
       };

       const handleStartLiveAuction = async (listing) => {
              const result = await Swal.fire({
                     title: 'Start live auction?',
                     text: `"${listing.title}" will become active.`,
                     icon: 'question',
                     showCancelButton: true,
                     confirmButtonColor: '#059669',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'Start',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.patch(route('admin.live-auctions.start', listing.id), {}, { preserveScroll: true });
              }
       };

       const handleEndLiveAuction = async (listing) => {
              const result = await Swal.fire({
                     title: 'End live auction?',
                     text: 'If bids exist, this auction will be awarded to the highest bidder.',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#ea580c',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'End',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.patch(route('admin.live-auctions.end', listing.id), {}, { preserveScroll: true });
              }
       };

       const statusBadges = {
              active: 'bg-emerald-100 text-emerald-700',
              pending: 'bg-amber-100 text-amber-700',
              declined: 'bg-rose-100 text-rose-700',
              inactive: 'bg-gray-100 text-gray-700',
              resubmit: 'bg-sky-100 text-sky-700',
              ended: 'bg-orange-100 text-orange-700',
              closed: 'bg-slate-100 text-slate-700',
              awarded: 'bg-violet-100 text-violet-700',
       };

       const statusOptions = ['', 'pending', 'active', 'declined', 'inactive', 'resubmit', 'ended', 'closed', 'awarded'];
       const formatListingType = (type) => type === 'live_auction' ? 'Live Auction' : String(type || '').replace('_', ' ');

       return (
              <AdminLayout title={pageTitle}>
                     <Head title={pageTitle} />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 space-y-4">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                          <div>
                                                 <h1 className="text-2xl font-black text-gray-900">{pageTitle}</h1>
                                                 <p className="text-sm text-gray-500 mt-1">{pageDescription}</p>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2">
                                                 {isLiveAuctionPage && (
                                                        <button
                                                               type="button"
                                                               onClick={() => router.get(route('admin.live-auctions.setup'))}
                                                               className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                                                        >
                                                               <i className="fa-solid fa-tower-broadcast mr-2"></i>
                                                               Setup Live
                                                        </button>
                                                 )}
                                                 <button
                                                        type="button"
                                                        onClick={() => router.get(route(createRouteName))}
                                                        className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
                                                 >
                                                        {createButtonLabel}
                                                 </button>
                                          </div>
                                   </div>
                                   <form onSubmit={handleSearch} className="flex flex-1 gap-4 max-w-2xl">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all"
                                                        placeholder="Search listings..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <select
                                                 className="bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 px-4 py-2 appearance-none transition-all"
                                                 value={status}
                                                 onChange={(e) => setStatus(e.target.value)}
                                          >
                                                 {statusOptions.map((statusOption) => (
                                                        <option key={statusOption || 'all'} value={statusOption}>
                                                               {statusOption ? statusOption.charAt(0).toUpperCase() + statusOption.slice(1) : 'All Status'}
                                                        </option>
                                                 ))}
                                          </select>
                                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Filter</button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Listing Details</th>
                                                        <th className="px-6 py-4">Seller</th>
                                                        <th className="px-6 py-4">Category</th>
                                                        <th className="px-6 py-4">Price</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {listings.data.map((listing) => (
                                                        <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                       <div className="flex items-center gap-3">
                                                                              {listing.listing_type === 'live_auction' ? (
                                                                                     <LiveAuctionPreview videoId={listing.youtube_video_id} title={listing.title} />
                                                                              ) : (
                                                                                     <img src={listing.image_url || '/assets/images/placeholder.png'} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                                                                              )}
                                                                              <div>
                                                                                     <p className="text-sm font-bold text-gray-800 line-clamp-1">{listing.title}</p>
                                                                                     <p className="text-[10px] text-gray-400 mt-1 mb-0">
                                                                                            ID: {listing.id} | Type: <span className="uppercase">{formatListingType(listing.listing_type)}</span>
                                                                                     </p>
                                                                                     {listing.pending_edit && (
                                                                                            <p className="text-[10px] font-bold text-amber-600 mt-1 mb-0 uppercase tracking-wider">
                                                                                                   Pending Edits Awaiting Approval
                                                                                            </p>
                                                                                     )}
                                                                              </div>
                                                                       </div>
                                                                </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm text-gray-800">{listing.user?.name}</p>
                                                                      <p className="text-[11px] text-gray-500">{listing.user?.email}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{listing.category?.name}</span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                       {listing.listing_type === 'live_auction' ? (
                                                                              listing.listing_data?.start_price ? (
                                                                                     <Price
                                                                                            amountPKR={listing.listing_data.start_price}
                                                                                            className="text-sm font-bold text-black"
                                                                                     />
                                                                              ) : (
                                                                                     <span className="text-sm font-bold text-gray-500">N/A</span>
                                                                              )
                                                                       ) : (
                                                                              <Price
                                                                                     amountPKR={listing.listing_type === 'auction' ? listing.minimum_bid : (listing.buy_now_price || listing.minimum_bid)}
                                                                                     className="text-sm font-bold text-black"
                                                                              />
                                                                       )}
                                                                </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[listing.status] || 'bg-gray-100 text-gray-700'}`}>
                                                                             {listing.status}
                                                                      </span>
                                                               </td>
                                                                       <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             {listing.pending_edit && (
                                                                                    <button
                                                                                           onClick={() => router.post(route('admin.listings.approve-edit', listing.id))}
                                                                                           className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                                                                                           title="Approve Pending Edits"
                                                                                    >
                                                                                           Approve Edits
                                                                                    </button>
                                                                             )}
                                                                             {isLiveAuctionPage && listing.status !== 'active' && !['awarded', 'closed'].includes(listing.status) && (
                                                                                    <button
                                                                                           onClick={() => handleStartLiveAuction(listing)}
                                                                                           className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                                                                                           title="Start Live Auction"
                                                                                    >
                                                                                           Start
                                                                                    </button>
                                                                             )}
                                                                             {isLiveAuctionPage && listing.status === 'active' && (
                                                                                    <button
                                                                                           onClick={() => handleEndLiveAuction(listing)}
                                                                                           className="px-3 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors"
                                                                                           title="End Live Auction"
                                                                                    >
                                                                                           End
                                                                                    </button>
                                                                             )}
                                                                             <button onClick={() => router.get(route('admin.listings.edit', listing.id))} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                                                             <button onClick={() => router.get(route('admin.listings.show', listing.id))} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="View Details"><i className="fa-solid fa-eye"></i></button>
                                                                             <button onClick={() => handleDelete(listing.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                             </div>

                             <div className="p-6 border-top border-gray-100">
                                   {listings.data.length ? (
                                          <Pagination links={listings.links} />
                                   ) : (
                                          <div className="text-center py-8 text-sm text-gray-500">
                                                 {isLiveAuctionPage ? 'No live auctions found yet.' : 'No listings found.'}
                                          </div>
                                   )}
                             </div>
                      </div>
              </AdminLayout>
       );
}
