import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';

export default function Show({ listing }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [declineReason, setDeclineReason] = useState('');

       const isEmptyValue = (value) => {
              if (value === null || value === undefined) return true;
              if (typeof value === 'string') {
                     const normalized = value.trim().toLowerCase();
                     return normalized === '' || normalized === 'n/a' || normalized === 'null';
              }
              if (Array.isArray(value)) return value.length === 0;
              if (typeof value === 'object') return Object.keys(value).length === 0;
              return false;
       };

       const formatLabel = (value) =>
              String(value)
                     .replace(/_/g, ' ')
                     .replace(/([a-z])([A-Z])/g, '$1 $2')
                     .replace(/\b\w/g, (char) => char.toUpperCase());

       const formatValue = (value) => {
              if (Array.isArray(value)) {
                     return value.join(', ');
              }

              if (typeof value === 'boolean') {
                     return value ? 'Yes' : 'No';
              }

              return String(value);
       };

       const seller = listing.user;
       const verificationStatus =
              seller?.individual_verification?.status ||
              seller?.individualVerification?.status ||
              seller?.corporate_verification?.status ||
              seller?.corporateVerification?.status ||
              'unverified';

       const infoItems = [
              { label: 'Listing ID', value: listing.id },
              { label: 'Title', value: listing.title || 'N/A' },
              { label: 'Status', value: listing.status || 'N/A' },
              { label: 'Listing Type', value: listing.listing_type || 'N/A' },
              { label: 'Category', value: listing.category?.name || 'N/A' },
              { label: 'Sub Category', value: listing.sub_category?.name || listing.subCategory?.name || 'N/A' },
              { label: 'Child Category', value: listing.child_category?.name || listing.childCategory?.name || 'N/A' },
              { label: 'Price', value: listing.price || 'N/A' },
              { label: 'Minimum Bid', value: listing.minimum_bid || 'N/A' },
              { label: 'Reserve Price', value: listing.reserve_price || 'N/A' },
              { label: 'Buy Now Price', value: listing.buy_now_price || 'N/A' },
              { label: 'Stock', value: listing.stock || 'N/A' },
              { label: 'Condition', value: listing.product_condition || 'N/A' },
              { label: 'Year', value: listing.product_year || 'N/A' },
              { label: 'Start Date', value: listing.start_date || 'N/A' },
              { label: 'End Date', value: listing.end_date || 'N/A' },
              { label: 'Views', value: listing.views ?? 0 },
       ].filter((item) => !isEmptyValue(item.value));

       const sellerItems = [
              { label: 'Seller Name', value: seller?.name || 'N/A' },
              { label: 'Username', value: seller?.username || 'N/A' },
              { label: 'Email', value: seller?.email || 'N/A' },
              { label: 'Phone', value: seller?.phone || 'N/A' },
              { label: 'Company', value: seller?.company_name || 'N/A' },
              { label: 'Role', value: seller?.role || 'N/A' },
              { label: 'Account Status', value: seller?.status || 'N/A' },
              { label: 'Verification', value: verificationStatus },
              { label: 'Country', value: seller?.country?.name || seller?.country || 'N/A' },
              { label: 'City', value: seller?.city_name || seller?.city || 'N/A' },
              { label: 'State', value: seller?.state_name || seller?.state || 'N/A' },
              { label: 'Address Line 1', value: seller?.address_line1 || 'N/A' },
              { label: 'Address Line 2', value: seller?.address_line2 || 'N/A' },
              { label: 'Postal Code', value: seller?.postal_code || 'N/A' },
       ].filter((item) => !isEmptyValue(item.value));

       const galleryImages = listing.album_urls?.length
              ? listing.album_urls
              : listing.image_url
              ? [listing.image_url]
              : [];

       const canApproveListing = ['inactive', 'declined', 'resubmit'].includes(listing.status);
       const canDeclineListing = ['inactive', 'resubmit'].includes(listing.status);

       const acceptListing = () => {
              if (confirm('Are you sure you want to approve and publish this listing?')) {
                     router.post(route('admin.verifications.auctions.accept', listing.id));
              }
       };

       const declineListing = () => {
              if (!declineReason.trim()) {
                     alert('Please provide a reason.');
                     return;
              }

              router.post(
                     route('admin.verifications.auctions.decline', listing.id),
                     { reason: declineReason },
                     {
                            onSuccess: () => {
                                   setIsModalOpen(false);
                                   setDeclineReason('');
                            },
                     }
              );
       };

       const renderStructuredData = (data) => {
              if (!data) {
                     return <p className="text-sm text-gray-600 mt-2">N/A</p>;
              }

              const entries = Object.entries(data).filter(([, value]) => !isEmptyValue(value));

              if (!entries.length) {
                     return <p className="text-sm text-gray-600 mt-2">N/A</p>;
              }

              return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {entries.map(([key, value]) => {
                                   const isComplex = Array.isArray(value) || (typeof value === 'object' && value !== null);

                                   return (
                                          <div key={key} className={isComplex ? 'md:col-span-2' : ''}>
                                                 <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                        <p className="text-xs text-gray-400 uppercase font-bold">{formatLabel(key)}</p>
                                                        {isComplex ? (
                                                               <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-gray-800">
                                                                      {JSON.stringify(value, null, 2)}
                                                               </pre>
                                                        ) : (
                                                               <p className="mt-1 text-sm text-gray-800 break-words">{formatValue(value)}</p>
                                                        )}
                                                 </div>
                                          </div>
                                   );
                            })}
                     </div>
              );
       };

       return (
              <AdminLayout title={`Listing Details: ${listing.title}`}>
                     <Head title={`Listing # ${listing.id}`} />

                     <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                   <div>
                                          <h1 className="text-2xl font-bold text-gray-900">Listing Details</h1>
                                          <p className="text-sm text-gray-500">Review listing data and seller profile from one place.</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                          {canApproveListing && (
                                                 <>
                                                        <button
                                                               onClick={acceptListing}
                                                               className="px-4 py-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                                                        >
                                                               Approve
                                                        </button>
                                                 </>
                                          )}
                                          {canDeclineListing && (
                                                 <>
                                                        <button
                                                               onClick={() => setIsModalOpen(true)}
                                                               className="px-4 py-2 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700"
                                                        >
                                                               Decline
                                                        </button>
                                                 </>
                                          )}
                                          <Link
                                                 href={route('admin.verifications.auctions.index')}
                                                 className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                          >
                                                 Back to Approval List
                                          </Link>
                                   </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                   <div className="lg:col-span-2 space-y-6">
                                          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100">
                                                 <div className="flex items-start gap-4">
                                                        <img
                                                               src={listing.image_url || '/images/placeholder.png'}
                                                               className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                                                               alt={listing.title}
                                                        />
                                                        <div className="flex-1">
                                                               <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
                                                               <div className="mt-2 flex flex-wrap gap-2">
                                                                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold uppercase">
                                                                             {listing.status || 'N/A'}
                                                                      </span>
                                                                      <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase">
                                                                             {listing.listing_type || 'N/A'}
                                                                      </span>
                                                                      {listing.category?.name && (
                                                                             <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[11px] font-bold">
                                                                                    {listing.category.name}
                                                                             </span>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                        {infoItems.map((item) => (
                                                               <div key={item.label}>
                                                                      <p className="text-xs text-gray-400 uppercase font-bold">{item.label}</p>
                                                                      <p className="text-sm text-gray-800 break-words">{formatValue(item.value)}</p>
                                                               </div>
                                                        ))}
                                                        {!isEmptyValue(listing.description) && (
                                                               <div className="md:col-span-2">
                                                               <p className="text-xs text-gray-400 uppercase font-bold">Description</p>
                                                               <div
                                                                      className="text-sm text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none"
                                                                      dangerouslySetInnerHTML={{ __html: listing.description }}
                                                               />
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>

                                          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100">
                                                 <h2 className="text-lg font-bold text-gray-900 mb-4">Dynamic Data (JSON)</h2>
                                                 <div className="space-y-4">
                                                        <div>
                                                               <p className="text-sm font-bold text-gray-700">Listing specific data (listing_data):</p>
                                                               {renderStructuredData(listing.listing_data)}
                                                        </div>
                                                        <div>
                                                               <p className="text-sm font-bold text-gray-700">Category features (category_features):</p>
                                                               {renderStructuredData(listing.category_features)}
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="space-y-6">
                                          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100">
                                                 <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
                                                 <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                               <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden">
                                                                      {seller?.profile_pic ? (
                                                                             <img src={seller.profile_pic} alt={seller?.name} className="w-full h-full object-cover" />
                                                                      ) : (
                                                                             (seller?.name || 'U').charAt(0).toUpperCase()
                                                                      )}
                                                               </div>
                                                               <div>
                                                                      <p className="text-sm font-bold text-gray-900">{seller?.name || 'Unknown Seller'}</p>
                                                                      <p className="text-xs text-gray-500">{seller?.email || 'No email available'}</p>
                                                               </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3">
                                                               {sellerItems.map((item) => (
                                                                      <div key={item.label}>
                                                                             <p className="text-xs text-gray-400 uppercase font-bold">{item.label}</p>
                                                                             <p className="text-sm text-gray-800 break-words">{formatValue(item.value)}</p>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                          </div>

                                          <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100">
                                                 <h2 className="text-sm font-bold text-gray-900 mb-3">Images</h2>
                                                 <div className="grid grid-cols-2 gap-2">
                                                        {galleryImages.map((img, i) => (
                                                               <img key={i} src={img} className="w-full h-24 object-cover rounded-lg" alt={`Listing image ${i + 1}`} />
                                                        ))}
                                                        {!galleryImages.length && (
                                                               <p className="text-xs text-gray-400 italic col-span-2">No images uploaded</p>
                                                        )}
                                                 </div>
                                          </div>

                                          <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100">
                                                 <h2 className="text-sm font-bold text-gray-900 mb-3">Approval Notes</h2>
                                                 {!isEmptyValue(listing.decline_reason) ? (
                                                        <p className="text-sm text-gray-700">{listing.decline_reason}</p>
                                                 ) : (
                                                        <p className="text-sm text-gray-500">No decline reason recorded for this listing.</p>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                            <div className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-4">Decline Listing</h2>
                                   <div className="mb-6">
                                          <InputLabel value="Reason for Decline" />
                                          <textarea
                                                 className="mt-1 block w-full rounded-xl border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-rose-500 shadow-sm"
                                                 rows="4"
                                                 value={declineReason}
                                                 onChange={(e) => setDeclineReason(e.target.value)}
                                          />
                                   </div>
                                   <div className="flex justify-end gap-3">
                                          <SecondaryButton onClick={() => setIsModalOpen(false)}>Cancel</SecondaryButton>
                                          <button
                                                 onClick={declineListing}
                                                 className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors"
                                          >
                                                 Confirm Decline
                                          </button>
                                   </div>
                            </div>
                     </Modal>
              </AdminLayout>
       );
}
