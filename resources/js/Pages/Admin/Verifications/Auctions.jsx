import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';

export default function Auctions({ auctions }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [selectedAuction, setSelectedAuction] = useState(null);
       const [declineReason, setDeclineReason] = useState('');

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

       const acceptAuction = (id) => {
              if (confirm('Are you sure you want to approve and publish this auction?')) {
                     router.post(route('admin.verifications.auctions.accept', id));
              }
       };

       return (
              <AdminLayout title="Auction Approval">
                     <Head title="Auction Approval" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100">
                                   <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
                                   <p className="text-xs text-gray-500">Auctions waiting to be published</p>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Auction Details</th>
                                                        <th className="px-6 py-4">Seller</th>
                                                        <th className="px-6 py-4">Verification Check</th>
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
                                                                                    <p className="text-[10px] text-gray-400">{auction.category?.name} | {auction.list_type}</p>
                                                                             </div>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm text-gray-800">{auction.user?.name}</p>
                                                                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${auction.user?.individual_verification?.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                             {auction.user?.individual_verification?.status || 'unverified'} Seller
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <div className="flex flex-col gap-1">
                                                                             {auction.vehicle_verification && <span className="text-[10px] text-blue-600 font-bold"><i className="fa-solid fa-car mr-1"></i> Vehicle Docs Provided</span>}
                                                                             {auction.property_verification && <span className="text-[10px] text-purple-600 font-bold"><i className="fa-solid fa-house mr-1"></i> Property Docs Provided</span>}
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <button onClick={() => acceptAuction(auction.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">Approve</button>
                                                                             <button onClick={() => openDeclineModal(auction)} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">Decline</button>
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
                                          <p>No pending auctions for approval</p>
                                   </div>
                            )}
                     </div>

                     <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                            <div className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-4">Decline Auction</h2>
                                   <div className="mb-6">
                                          <InputLabel value="Reason for Decline" />
                                          <textarea className="mt-1 block w-full border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-xl shadow-sm" rows="4" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}></textarea>
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
