import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';

export default function Corporate({ verifications, filters }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [selectedVerification, setSelectedVerification] = useState(null);
       const [declineReason, setDeclineReason] = useState('');
       const [search, setSearch] = useState(filters.search || '');

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.verifications.corporate.index'), { search }, { preserveState: true });
       };

       const openDeclineModal = (verification) => {
              setSelectedVerification(verification);
              setIsModalOpen(true);
       };

       const confirmDecline = () => {
              if (!declineReason) return alert('Please provide a reason.');
              router.post(route('admin.verifications.corporate.decline', selectedVerification.id), {
                     decline_reason: declineReason
              }, {
                     onSuccess: () => {
                            setIsModalOpen(false);
                            setDeclineReason('');
                     }
              });
       };

       const acceptVerification = (id) => {
              if (confirm('Are you sure you want to accept this verification?')) {
                     router.post(route('admin.verifications.corporate.accept', id));
              }
       };

       const statusBadges = {
              verified: 'bg-emerald-100 text-emerald-700',
              declined: 'bg-rose-100 text-rose-700',
              pending: 'bg-amber-100 text-amber-700',
              not_verified: 'bg-gray-100 text-gray-700',
              resubmit: 'bg-blue-100 text-blue-700',
       };

       return (
              <AdminLayout title="Corporate Verifications">
                     <Head title="Corporate Verifications" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                                          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                          <input
                                                 type="text"
                                                 className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 placeholder="Search by entity name..."
                                                 value={search}
                                                 onChange={(e) => setSearch(e.target.value)}
                                          />
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Entity Details</th>
                                                        <th className="px-6 py-4">Applicant</th>
                                                        <th className="px-6 py-4">Documents</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {verifications.data.map((verification) => (
                                                        <tr key={verification.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800">{verification.legal_entity_name}</p>
                                                                      <p className="text-[11px] text-gray-500">{verification.entity_type} ({verification.country})</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm text-gray-800">{verification.user?.name}</p>
                                                                      <p className="text-[11px] text-gray-500">{verification.user?.email}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                                                                             {(verification.business_documents || []).map((doc, idx) => (
                                                                                    <a key={idx} href={'/' + doc} target="_blank" className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Doc {idx + 1}</a>
                                                                             ))}
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[verification.status] || 'bg-gray-100'}`}>
                                                                             {verification.status.replace('_', ' ')}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      {verification.status !== 'verified' && (
                                                                             <div className="flex items-center justify-end gap-2">
                                                                                    <button onClick={() => acceptVerification(verification.id)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors" title="Accept"><i className="fa-solid fa-circle-check"></i></button>
                                                                                    <button onClick={() => openDeclineModal(verification)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Decline"><i className="fa-solid fa-circle-xmark"></i></button>
                                                                             </div>
                                                                      )}
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={verifications.links} />
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                            <div className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-4">Decline Corporate Verification</h2>
                                   <div className="mb-6">
                                          <InputLabel value="Reason for Decline" />
                                          <textarea className="mt-1 block w-full border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-md shadow-sm" rows="4" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}></textarea>
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
