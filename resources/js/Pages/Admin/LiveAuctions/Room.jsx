import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Price from '@/Components/Price';
import ListingLiveChat from '@/Components/ProductDetails/ListingLiveChat';
import Swal from 'sweetalert2';

const statusClasses = {
       active: 'bg-emerald-100 text-emerald-700',
       inactive: 'bg-gray-100 text-gray-700',
       ended: 'bg-orange-100 text-orange-700',
       closed: 'bg-slate-100 text-slate-700',
       awarded: 'bg-violet-100 text-violet-700',
       pending: 'bg-amber-100 text-amber-700',
};

function YoutubePlayer({ videoId, title }) {
       if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
              return (
                     <div className="flex-1 min-h-0 bg-black rounded-2xl flex items-center justify-center text-white">
                            <div className="text-center">
                                   <i className="fa-brands fa-youtube text-4xl mb-3"></i>
                                   <p className="text-sm mb-0">No YouTube video selected</p>
                            </div>
                     </div>
              );
       }

       return (
              <div className="flex-1 min-h-0 bg-black rounded-2xl overflow-hidden shadow-sm">
                     <iframe
                            title={title || 'Live auction stream'}
                            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full border-0"
                     />
              </div>
       );
}

export default function Room({ liveAuctions = [], selectedIds = [], liveUrl = '', globalVideoId = null }) {
       const [activeId, setActiveId] = useState(liveAuctions[0]?.id || null);
       const activeAuction = useMemo(
              () => liveAuctions.find((auction) => auction.id === activeId) || liveAuctions[0],
              [liveAuctions, activeId]
       );
       const activeVideoId = globalVideoId || activeAuction?.youtube_video_id;
       const startPrice = activeAuction?.listing_data?.start_price;
       const reservePrice = activeAuction?.listing_data?.reserve_price;

       const confirmPatch = async ({ title, text, routeName, confirmButtonText, confirmButtonColor = '#111827' }) => {
              const result = await Swal.fire({
                     title,
                     text,
                     icon: 'question',
                     showCancelButton: true,
                     confirmButtonColor,
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText,
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.patch(route(routeName, activeAuction.id), {}, {
                            preserveScroll: true,
                            preserveState: false,
                     });
              }
       };

       if (!activeAuction) {
              return (
                     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                            <Head title="Live Room" />
                            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                                   <p className="text-gray-500 mb-4">No live auctions selected.</p>
                                   <button onClick={() => router.get(route('admin.live-auctions.setup'))} className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold">
                                          Setup Live
                                   </button>
                            </div>
                     </div>
              );
       }

       return (
              <div className="h-screen w-screen overflow-hidden bg-gray-100 text-gray-900">
                     <Head title="Live Auction Room" />

                     <div className="h-full w-full p-3 lg:p-4 flex flex-col gap-3 min-w-0">
                            <div
                                   className="live-room-main-grid min-h-0 flex-1 overflow-hidden"
                                   style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.75rem' }}
                            >
                                   <div
                                          className="live-room-left-column min-w-0 min-h-0 overflow-hidden"
                                          style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', gap: '0.75rem' }}
                                   >
                                          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 min-w-0 overflow-hidden">
                                                 <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                               <h1 className="text-lg lg:text-xl font-black text-gray-900 leading-tight mb-0">Live Auction Room</h1>
                                                               <p className="text-xs text-gray-500 mt-0 mb-0 truncate">Control selected live products, stream, status and website chats.</p>
                                                        </div>
                                                        <div className="flex shrink-0 gap-2">
                                                               <button
                                                                      type="button"
                                                                      onClick={() => router.get(route('admin.live-auctions.setup'))}
                                                                      className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                                                               >
                                                                      Setup Again
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      onClick={() => router.get(route('admin.live-auctions.index'))}
                                                                      className="px-3 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800"
                                                               >
                                                                      Live Auctions
                                                               </button>
                                                        </div>
                                                 </div>

                                                 <div className="live-room-tabs mt-3 flex gap-2 overflow-x-auto overflow-y-hidden pb-1">
                                                        {liveAuctions.map((auction) => (
                                                               <button
                                                                      key={auction.id}
                                                                      type="button"
                                                                      onClick={() => setActiveId(auction.id)}
                                                                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors max-w-[180px] truncate ${auction.id === activeAuction.id ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                                               >
                                                                      #{auction.id} {auction.title}
                                                               </button>
                                                        ))}
                                                 </div>
                                          </div>

                                          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 min-h-0 overflow-hidden flex flex-col">
                                                 <div className="flex items-start justify-between gap-3 mb-3 shrink-0">
                                                        <div className="min-w-0">
                                                               <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClasses[activeAuction.status] || 'bg-gray-100 text-gray-700'}`}>
                                                                             {activeAuction.status}
                                                                      </span>
                                                                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase">Live Control</span>
                                                               </div>
                                                               <h2 className="text-lg font-black text-gray-900 mb-0 truncate">{activeAuction.title}</h2>
                                                               <p className="text-xs text-gray-500 mb-0 truncate">
                                                                      {activeAuction.category?.name || 'No Category'} | Seller: {activeAuction.user?.name || 'N/A'}
                                                               </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                               <div className="text-xs text-gray-500">Highest Bid</div>
                                                               <div className="text-base font-black text-gray-900">
                                                                      <Price amountAED={activeAuction.bids_max_bid_amount || 0} />
                                                               </div>
                                                               <div className="text-xs text-gray-500">{activeAuction.bids_count || 0} bids</div>
                                                        </div>
                                                 </div>

                                                 <YoutubePlayer videoId={activeVideoId} title={activeAuction.title} />
                                                 {liveUrl ? <p className="text-[11px] text-gray-500 mt-2 mb-0 truncate shrink-0">Live URL: {liveUrl}</p> : null}
                                          </div>
                                   </div>

                                   <div
                                          className="live-room-right-column min-w-0 min-h-0 overflow-hidden"
                                          style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', gap: '0.75rem' }}
                                   >
                                          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 min-w-0">
                                                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-3">Product Controls</h3>
                                                 <div className="grid grid-cols-3 gap-2 mb-3">
                                                        <div className="rounded-xl bg-gray-50 p-3">
                                                               <div className="text-xs text-gray-500 mb-1">Start Price</div>
                                                               <div className="text-sm font-black text-gray-900 truncate">{startPrice ? <Price amountPKR={startPrice} /> : 'N/A'}</div>
                                                        </div>
                                                        <div className="rounded-xl bg-gray-50 p-3">
                                                               <div className="text-xs text-gray-500 mb-1">Reserve Price</div>
                                                               <div className="text-sm font-black text-gray-900 truncate">{reservePrice ? <Price amountPKR={reservePrice} /> : 'N/A'}</div>
                                                        </div>
                                                        <div className="rounded-xl bg-gray-50 p-3">
                                                               <div className="text-xs text-gray-500 mb-1">Status</div>
                                                               <div className="text-sm font-black text-gray-900 capitalize truncate">{activeAuction.status}</div>
                                                        </div>
                                                 </div>

                                                 <div className="flex flex-wrap gap-2">
                                                        {activeAuction.status !== 'active' && !['awarded', 'closed'].includes(activeAuction.status) && (
                                                               <button
                                                                      onClick={() => confirmPatch({
                                                                             title: 'Start live auction?',
                                                                             text: `${activeAuction.title} will become active.`,
                                                                             routeName: 'admin.live-auctions.start',
                                                                             confirmButtonText: 'Start',
                                                                             confirmButtonColor: '#059669',
                                                                      })}
                                                                      className="px-3 py-2 rounded-xl text-xs font-black"
                                                                      style={{ backgroundColor: '#059669', color: '#ffffff', minWidth: '120px', flex: '1 1 120px' }}
                                                               >
                                                                      Start
                                                               </button>
                                                        )}
                                                        {activeAuction.status === 'active' && (
                                                               <button
                                                                      onClick={() => confirmPatch({
                                                                             title: 'End live auction?',
                                                                             text: 'If bids exist, this will award to highest bidder. Otherwise status will become ended.',
                                                                             routeName: 'admin.live-auctions.end',
                                                                             confirmButtonText: 'End',
                                                                             confirmButtonColor: '#ea580c',
                                                                      })}
                                                                      className="px-3 py-2 rounded-xl text-xs font-black"
                                                                      style={{ backgroundColor: '#ea580c', color: '#ffffff', minWidth: '120px', flex: '1 1 120px' }}
                                                               >
                                                                      End
                                                               </button>
                                                        )}
                                                        <button
                                                               type="button"
                                                               onClick={() => confirmPatch({
                                                                      title: 'Close live auction?',
                                                                      text: 'This will close the auction without awarding it.',
                                                                      routeName: 'admin.live-auctions.close',
                                                                      confirmButtonText: 'Close',
                                                                      confirmButtonColor: '#475569',
                                                               })}
                                                               className="px-3 py-2 rounded-xl text-xs font-black"
                                                               style={{ backgroundColor: '#475569', color: '#ffffff', minWidth: '120px', flex: '1 1 120px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                               Closed
                                                        </button>
                                                        <button
                                                               type="button"
                                                               onClick={() => confirmPatch({
                                                                      title: 'Award highest bidder?',
                                                                      text: 'This will award this auction to the highest bidder.',
                                                                      routeName: 'admin.live-auctions.award',
                                                                      confirmButtonText: 'Award',
                                                                      confirmButtonColor: '#7c3aed',
                                                               })}
                                                               className="px-3 py-2 rounded-xl text-xs font-black"
                                                               style={{ backgroundColor: '#7c3aed', color: '#ffffff', minWidth: '120px', flex: '1 1 120px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                               Awarded
                                                        </button>
                                                        <button
                                                               type="button"
                                                               onClick={() => router.get(route('product.show', activeAuction.slug))}
                                                               className="px-3 py-2 rounded-xl text-xs font-black"
                                                               style={{ backgroundColor: '#f3f4f6', color: '#111827', minWidth: '120px', flex: '1 1 120px' }}
                                                        >
                                                               View Product
                                                        </button>
                                                 </div>
                                          </div>

                                          <div className="live-room-chat bg-white rounded-2xl border border-gray-200 shadow-sm p-3 min-w-0 min-h-0 overflow-hidden flex flex-col">
                                                 <div className="flex items-center justify-between mb-2 shrink-0">
                                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-0">Website Chat</h3>
                                                        <span className="text-xs text-gray-500">#{activeAuction.id}</span>
                                                 </div>
                                                 <ListingLiveChat listingId={activeAuction.id} listingSlug={activeAuction.slug} />
                                          </div>
                                   </div>
                            </div>
                     </div>
                     <style>{`
                            .live-room-chat .xb-listing-live-chat {
                                   height: 100% !important;
                                   min-height: 0 !important;
                            }
                            .live-room-chat .xb-listing-live-chat input,
                            .live-room-chat .xb-listing-live-chat .form-control {
                                   color: #111827 !important;
                                   -webkit-text-fill-color: #111827 !important;
                            }
                            .live-room-chat .xb-listing-live-chat > div:nth-child(2) {
                                   min-height: 0 !important;
                            }
                            .live-room-tabs {
                                   scrollbar-width: thin;
                                   scrollbar-color: #cbd5e1 transparent;
                            }
                            .live-room-tabs::-webkit-scrollbar {
                                   height: 6px;
                            }
                            .live-room-tabs::-webkit-scrollbar-track {
                                   background: transparent;
                            }
                            .live-room-tabs::-webkit-scrollbar-thumb {
                                   background: #cbd5e1;
                                   border-radius: 999px;
                            }
                            @media (max-width: 900px) {
                                   .live-room-main-grid {
                                          grid-template-columns: minmax(0, 1fr) !important;
                                          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) !important;
                                   }
                                   .live-room-left-column {
                                          grid-template-columns: minmax(0, 1fr) !important;
                                   }
                            }
                            @media (max-width: 1023px) {
                                   body:has(.live-room-chat) {
                                          overflow: hidden;
                                   }
                            }
                     `}</style>
              </div>
       );
}
