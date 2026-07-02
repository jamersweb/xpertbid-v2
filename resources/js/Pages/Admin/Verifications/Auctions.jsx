import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import ExportCsvButton from '@/Components/Admin/ExportCsvButton';

export default function Auctions({ auctions }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
       const [selectedAuction, setSelectedAuction] = useState(null);
       const [declineReason, setDeclineReason] = useState('');

       const hasPendingEdit = (auction) => Boolean(auction.pending_edit);
       const canApprove = (auction) => ['inactive', 'declined', 'resubmit'].includes(auction.status) || hasPendingEdit(auction);
       const canDecline = (auction) => ['inactive', 'resubmit'].includes(auction.status) || hasPendingEdit(auction);
       const listingTypeMeta = (type) => {
              if (type === 'auction') return { label: 'Auction', className: 'bg-violet-100 text-violet-700' };
              if (type === 'business') return { label: 'Business', className: 'bg-blue-100 text-blue-700' };
              if (type === 'live_auction') return { label: 'Live Auction', className: 'bg-red-100 text-red-700' };
              return { label: 'Normal', className: 'bg-amber-100 text-amber-700' };
       };

       const openDeclineModal = (auction) => {
              setSelectedAuction(auction);
              setIsModalOpen(true);
       };

       const confirmDecline = () => {
              if (!declineReason) return alert('Please provide a reason.');
              router.post(route('admin.verifications.auctions.decline', selectedAuction.id), {
                     reason: declineReason
              }, {
                     onSuccess: () => {
                            setIsModalOpen(false);
                            setDeclineReason('');
                     }
              });
       };

       const openApproveModal = (auction) => {
              setSelectedAuction(auction);
              setIsApproveModalOpen(true);
       };

       const confirmApprove = () => {
              router.post(route('admin.verifications.auctions.accept', selectedAuction.id), {}, {
                     onSuccess: () => setIsApproveModalOpen(false)
              });
       };

       const acceptAuction = (id) => {
              if (confirm('Are you sure you want to approve and publish this listing?')) {
                     router.post(route('admin.verifications.auctions.accept', id));
              }
       };

       const statusBadges = {
              inactive: 'bg-gray-100 text-gray-700',
              declined: 'bg-rose-100 text-rose-700',
              resubmit: 'bg-amber-100 text-amber-700',
       };

       return (
              <AdminLayout title="Listing Approval">
                     <Head title="Listing Approval" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <div>
                                          <h2 className="text-lg font-bold text-gray-800">Listing Review Queue</h2>
                                          <p className="text-xs text-gray-500">Showing inactive, declined, resubmit, and active listings with pending edits</p>
                                   </div>
                                   <ExportCsvButton
                                          routeName="admin.verifications.auctions.export"
                                          title="Export Listing Approvals"
                                          description="Select a submission date range to download listing approvals as a CSV file."
                                   />
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Listing Details</th>
                                                        <th className="px-6 py-4">Seller</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {auctions.data.map((auction) => (
                                                        <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <div className="flex items-center gap-3">
                                                                             <img src={auction.image_url || '/images/placeholder.png'} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                                             <div>
                                                                                    <p className="text-sm font-bold text-gray-800">{auction.title}</p>
                                                                                    <p className="text-[10px] text-gray-400">{auction.category?.name}</p>
                                                                                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 mr-1 inline-block ${statusBadges[auction.status] || 'bg-gray-100 text-gray-700'}`}>
                                                                                            {auction.status}
                                                                                     </span>
                                                                                    {hasPendingEdit(auction) && (
                                                                                           <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 mr-1 inline-block bg-blue-100 text-blue-700">
                                                                                                  pending edit
                                                                                           </span>
                                                                                    )}
                                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block ${listingTypeMeta(auction.listing_type).className}`}>
                                                                                            {listingTypeMeta(auction.listing_type).label}
                                                                                     </span>
                                                                              </div>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800">{auction.user?.name}</p>
                                                                      <p className="text-[11px] text-gray-500 mt-0.5">{auction.user?.email || auction.user?.phone}</p>
                                                                      {(auction.user?.individual_verification?.status === 'verified' || auction.user?.corporate_verification?.status === 'verified') && (
                                                                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1 inline-block">
                                                                                    verified Seller
                                                                             </span>
                                                                      )}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <Link
                                                                                    href={route('admin.listings.show', auction.id)}
                                                                                    className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                                                                                    title="View"
                                                                             >
                                                                                    <i className="fa-solid fa-eye text-sm"></i>
                                                                             </Link>
                                                                             {canApprove(auction) && (
                                                                                    <button 
                                                                                           onClick={() => openApproveModal(auction)} 
                                                                                           className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                                                                                           title="Approve"
                                                                                    >
                                                                                           <i className="fa-solid fa-check text-sm"></i>
                                                                                    </button>
                                                                             )}
                                                                             {canDecline(auction) && (
                                                                                    <button 
                                                                                           onClick={() => openDeclineModal(auction)} 
                                                                                           className="w-8 h-8 flex items-center justify-center bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
                                                                                           title="Decline"
                                                                                    >
                                                                                           <i className="fa-solid fa-xmark text-sm"></i>
                                                                                    </button>
                                                                             )}
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            {auctions.data.length === 0 && (
                                   <div className="p-12 text-center text-gray-400">
                                          <i className="fa-solid fa-check-circle text-4xl mb-4 text-emerald-100"></i>
                                          <p>No listing approvals or pending edits found</p>
                                   </div>
                            )}
                     </div>

                     <Modal show={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} maxWidth="md">
                            <div className="p-6">
                                   <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                          <i className="fa-solid fa-check text-xl"></i>
                                   </div>
                                   <h2 className="text-lg font-bold text-gray-800 mb-2">Approve Listing</h2>
                                   <p className="text-sm text-gray-600 mb-6">
                                          {selectedAuction?.pending_edit
                                                 ? `Are you sure you want to approve the pending edits for "${selectedAuction?.title}"? The live listing will be updated immediately.`
                                                 : `Are you sure you want to approve "${selectedAuction?.title}"? Once approved, it will be published and visible to all users.`}
                                   </p>
                                   <div className="flex justify-end gap-3">
                                          <SecondaryButton onClick={() => setIsApproveModalOpen(false)}>Cancel</SecondaryButton>
                                          <button 
                                                 onClick={confirmApprove} 
                                                 className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                                          >
                                                 {selectedAuction?.pending_edit ? 'Approve Edits' : 'Approve & Publish'}
                                          </button>
                                   </div>
                            </div>
                     </Modal>

                     <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                            <div className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-4">Decline Listing</h2>
                                   <div className="mb-6">
                                          <InputLabel value="Reason for Decline" />
                                          <textarea className="mt-1 block w-full rounded-xl border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-rose-500 shadow-sm" rows="4" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}></textarea>
                                   </div>
                                   <div className="flex justify-end gap-3">
                                          <SecondaryButton onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                                          <button onClick={confirmDecline} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors">Confirm Decline</button>
                                   </div>
                            </div>
                     </Modal>
              </AdminLayout>
       );
}
