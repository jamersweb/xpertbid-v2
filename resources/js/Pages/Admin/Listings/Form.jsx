import React, { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black';
const fileInputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold';

function Field({ label, error, children }) {
       return (
              <div className="space-y-2">
                     <label className="block text-sm font-semibold text-gray-700">{label}</label>
                     {children}
                     {error && <p className="text-xs text-rose-600">{error}</p>}
              </div>
       );
}

export default function Form({
       listing = null,
       users = [],
       categories = [],
       statuses = [],
       defaultListingType = 'normal',
       backRouteName = 'admin.listings.index',
       returnTo = '',
}) {
       const isEditing = Boolean(listing?.id);
       const initialAlbum = useMemo(() => listing?.album_urls || [], [listing]);
       const rootCategories = categories.filter((item) => !item.parent_id && !item.sub_category_id);
       const subCategories = categories.filter((item) => item.parent_id && !item.sub_category_id);
       const childCategories = categories.filter((item) => item.sub_category_id);

       const { data, setData, processing, errors } = useForm({
              user_id: listing?.user_id || '',
              title: listing?.title || '',
              description: listing?.description || '',
              listing_type: listing?.listing_type || defaultListingType,
              status: listing?.status || 'inactive',
              category_id: listing?.category_id || '',
              sub_category_id: listing?.sub_category_id || '',
              child_category_id: listing?.child_category_id || '',
              price: listing?.listing_data?.price ?? listing?.listing_data?.start_price ?? '',
              reserve_price: listing?.listing_data?.reserve_price ?? '',
              start_date: listing?.listing_data?.start_date ?? '',
              end_date: listing?.listing_data?.end_date ?? '',
              stock: listing?.listing_data?.stock ?? '',
              image: null,
              album: [],
              existing_album: initialAlbum,
              return_to: returnTo,
       });

       const [imagePreview, setImagePreview] = useState(listing?.image_url || '');
       const isLiveAuction = data.listing_type === 'live_auction';
       const availableSubCategories = subCategories.filter((item) => String(item.parent_id) === String(data.category_id));
       const availableChildCategories = childCategories.filter((item) => String(item.sub_category_id) === String(data.sub_category_id));
       const handleListingTypeChange = (value) => {
              setData({
                     ...data,
                     listing_type: value,
                     return_to: value === 'live_auction' ? 'live_auctions' : '',
                     ...(value === 'live_auction'
                            ? {
                                   user_id: '',
                                   start_date: '',
                                   end_date: '',
                                   stock: '',
                            }
                            : {}),
              });
       };

       const submit = (e) => {
              e.preventDefault();

              const payload = { ...data, album: Array.from(data.album || []) };

              if (isEditing) {
                     router.post(route('admin.listings.update', listing.id), { ...payload, _method: 'put' }, { forceFormData: true });
                     return;
              }

              router.post(route('admin.listings.store'), payload, { forceFormData: true });
       };

       return (
              <AdminLayout title={isEditing ? 'Edit Listing' : 'Create Listing'}>
                     <Head title={isEditing ? 'Edit Listing' : 'Create Listing'} />

                     <form onSubmit={submit} className="space-y-6">
                            <div className="flex items-center justify-between">
                                   <div>
                                          <h1 className="text-2xl font-black text-gray-900">{isEditing ? 'Edit Listing' : 'Create Listing'}</h1>
                                          <p className="text-sm text-gray-500 mt-1">Admin can create or update any seller listing from here.</p>
                                   </div>
                                   <button
                                          type="button"
                                          onClick={() => router.get(route(backRouteName))}
                                          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                   >
                                          {backRouteName === 'admin.live-auctions.index' ? 'Back to Live Auctions' : 'Back to Listings'}
                                   </button>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                   <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                          <div className={`grid grid-cols-1 ${isLiveAuction ? '' : 'md:grid-cols-2'} gap-4`}>
                                                 {!isLiveAuction && (
                                                        <Field label="Seller" error={errors.user_id}>
                                                               <select className={inputClass} value={data.user_id} onChange={(e) => setData('user_id', e.target.value)}>
                                                                      <option value="">Select seller</option>
                                                                      {users.map((user) => (
                                                                             <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                                                      ))}
                                                               </select>
                                                        </Field>
                                                 )}
                                                 <Field label="Listing Type" error={errors.listing_type}>
                                                        <select className={inputClass} value={data.listing_type} onChange={(e) => handleListingTypeChange(e.target.value)}>
                                                               <option value="normal">Normal</option>
                                                               <option value="auction">Auction</option>
                                                               <option value="business">Business</option>
                                                               <option value="live_auction">Live Auction</option>
                                                        </select>
                                                 </Field>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <Field label="Status" error={errors.status}>
                                                        <select className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                                               {statuses.map((status) => (
                                                                      <option key={status} value={status}>{status}</option>
                                                               ))}
                                                        </select>
                                                 </Field>
                                                 <Field label="Category" error={errors.category_id}>
                                                        <select
                                                               className={inputClass}
                                                               value={data.category_id}
                                                               onChange={(e) => {
                                                                      setData('category_id', e.target.value);
                                                                      setData('sub_category_id', '');
                                                                      setData('child_category_id', '');
                                                               }}
                                                        >
                                                               <option value="">Select category</option>
                                                               {rootCategories.map((category) => (
                                                                      <option key={category.id} value={category.id}>{category.name}</option>
                                                               ))}
                                                        </select>
                                                 </Field>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 <Field label="Sub Category" error={errors.sub_category_id}>
                                                        <select
                                                               className={inputClass}
                                                               value={data.sub_category_id}
                                                               onChange={(e) => {
                                                                      setData('sub_category_id', e.target.value);
                                                                      setData('child_category_id', '');
                                                               }}
                                                        >
                                                               <option value="">Select sub category</option>
                                                               {availableSubCategories.map((category) => (
                                                                      <option key={category.id} value={category.id}>{category.name}</option>
                                                               ))}
                                                        </select>
                                                 </Field>
                                                 <Field label="Child Category" error={errors.child_category_id}>
                                                        <select className={inputClass} value={data.child_category_id} onChange={(e) => setData('child_category_id', e.target.value)}>
                                                               <option value="">Select child category</option>
                                                               {availableChildCategories.map((category) => (
                                                                      <option key={category.id} value={category.id}>{category.name}</option>
                                                               ))}
                                                        </select>
                                                 </Field>
                                          </div>

                                          <Field label="Title" error={errors.title}>
                                                 <input className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                          </Field>

                                          <Field label="Description" error={errors.description}>
                                                 <div className="admin-listing-quill">
                                                        <ReactQuill
                                                               theme="snow"
                                                               value={data.description}
                                                               onChange={(value) => setData('description', value)}
                                                               placeholder="Provide a detailed description of the listing..."
                                                        />
                                                 </div>
                                          </Field>

                                          {(data.listing_type === 'auction' || isLiveAuction) ? (
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Field label="Start Price" error={errors.price}>
                                                               <input type="number" className={inputClass} value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                                        </Field>
                                                        <Field label="Reserve Price" error={errors.reserve_price}>
                                                               <input type="number" className={inputClass} value={data.reserve_price} onChange={(e) => setData('reserve_price', e.target.value)} />
                                                        </Field>
                                                 </div>
                                          ) : (
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Field label="Price" error={errors.price}>
                                                               <input type="number" className={inputClass} value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                                        </Field>
                                                        {data.listing_type === 'business' && (
                                                               <Field label="Stock" error={errors.stock}>
                                                                      <input type="number" className={inputClass} value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                                                               </Field>
                                                        )}
                                                 </div>
                                          )}

                                          {data.listing_type === 'auction' && (
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Field label="Start Date" error={errors.start_date}>
                                                               <input type="datetime-local" className={inputClass} value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                                        </Field>
                                                        <Field label="End Date" error={errors.end_date}>
                                                               <input type="datetime-local" className={inputClass} value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                                        </Field>
                                                 </div>
                                          )}
                                   </div>

                                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                                          <h2 className="text-lg font-bold text-gray-900">Media</h2>

                                          <Field label={isLiveAuction ? 'Primary Image (optional)' : 'Primary Image'} error={errors.image}>
                                                 <input
                                                        type="file"
                                                        accept="image/*"
                                                        className={fileInputClass}
                                                        onChange={(e) => {
                                                               const file = e.target.files?.[0] || null;
                                                               setData('image', file);
                                                               setImagePreview(file ? URL.createObjectURL(file) : (listing?.image_url || ''));
                                                        }}
                                                 />
                                          </Field>

                                          {imagePreview ? (
                                                 <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-100" />
                                          ) : (
                                                 <div className="w-full h-48 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
                                                        No image selected
                                                 </div>
                                          )}

                                          <Field label={isLiveAuction ? 'Images (optional)' : 'Album Images'} error={errors.album}>
                                                 <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className={fileInputClass}
                                                        onChange={(e) => setData('album', e.target.files)}
                                                 />
                                          </Field>

                                          {data.existing_album?.length > 0 && (
                                                 <div className="space-y-3">
                                                        <p className="text-sm font-semibold text-gray-700">Existing Album</p>
                                                        <div className="grid grid-cols-3 gap-3">
                                                               {data.existing_album.map((url) => (
                                                                      <div key={url} className="relative">
                                                                             <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-100" />
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={() => setData('existing_album', data.existing_album.filter((item) => item !== url))}
                                                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-rose-600 text-xs shadow"
                                                                             >
                                                                                    <i className="fa-solid fa-xmark"></i>
                                                                             </button>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                          )}

                                          <button
                                                 type="submit"
                                                 disabled={processing}
                                                 className="w-full px-4 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-60"
                                          >
                                                 {processing ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
                                          </button>
                                   </div>
                            </div>
                     </form>

                     <style>{`
                            .admin-listing-quill .ql-toolbar.ql-snow {
                                   border: 1px solid rgb(229 231 235);
                                   border-radius: 0.75rem 0.75rem 0 0;
                                   background: white;
                            }

                            .admin-listing-quill .ql-container.ql-snow {
                                   border: 1px solid rgb(229 231 235);
                                   border-top: 0;
                                   border-radius: 0 0 0.75rem 0.75rem;
                                   min-height: 180px;
                                   color: rgb(17 24 39);
                                   background: white;
                            }

                            .admin-listing-quill .ql-editor {
                                   min-height: 180px;
                                   color: rgb(17 24 39);
                            }

                            .admin-listing-quill .ql-editor.ql-blank::before {
                                   color: rgb(156 163 175);
                                   font-style: normal;
                            }
                     `}</style>
              </AdminLayout>
       );
}
