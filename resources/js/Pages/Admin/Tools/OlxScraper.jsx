import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import 'react-quill/dist/quill.snow.css';

function toArray(value) {
       return Array.isArray(value) ? value : [];
}

function categoryChildren(category) {
       return toArray(category?.subCategories || category?.sub_categories);
}

function childChildren(subCategory) {
       return toArray(subCategory?.childCategories || subCategory?.child_categories);
}

function SearchableSelect({ value, options = [], placeholder = 'Search...', onChange, disabled = false }) {
       const wrapperRef = useRef(null);
       const [open, setOpen] = useState(false);
       const [query, setQuery] = useState('');

       const selectedOption = useMemo(
              () => options.find((option) => String(option.value) === String(value)),
              [options, value],
       );

       useEffect(() => {
              setQuery(selectedOption?.label || '');
       }, [selectedOption]);

       useEffect(() => {
              const onClickOutside = (event) => {
                     if (!wrapperRef.current?.contains(event.target)) {
                            setOpen(false);
                            setQuery(selectedOption?.label || '');
                     }
              };

              document.addEventListener('mousedown', onClickOutside);
              return () => document.removeEventListener('mousedown', onClickOutside);
       }, [selectedOption]);

       const filteredOptions = useMemo(() => {
              const keyword = query.trim().toLowerCase();
              if (!keyword) {
                     return options;
              }

              return options.filter((option) => option.label.toLowerCase().includes(keyword));
       }, [options, query]);

       return (
              <div ref={wrapperRef} className="relative">
                     <input
                            type="text"
                            value={query}
                            onChange={(event) => {
                                   setQuery(event.target.value);
                                   setOpen(true);
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 ${disabled ? 'cursor-not-allowed bg-gray-50' : ''}`}
                     />
                     <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => !disabled && setOpen((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                     >
                            <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                     </button>

                     {open && !disabled && (
                            <div className="absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                                   {filteredOptions.length > 0 ? (
                                          filteredOptions.map((option) => (
                                                 <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                               onChange(option.value);
                                                               setQuery(option.label);
                                                               setOpen(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                                                 >
                                                        {option.label}
                                                 </button>
                                          ))
                                   ) : (
                                          <div className="px-4 py-3 text-sm text-gray-400">No results found</div>
                                   )}
                            </div>
                     )}
              </div>
       );
}

export default function OlxScraper({ users = [], categories = [], preview = null, error = null, status = null, url = '' }) {
       const previewSyncRef = useRef('');

       const previewForm = useForm({
              url: url || '',
       });

       const saveForm = useForm({
              url: url || '',
              user_id: '',
              category_id: '',
              sub_category_id: '',
              child_category_id: '',
              listing_type: 'auction',
              title: preview?.title || '',
              description: preview?.description || '',
              price: preview?.price || '',
              minimum_bid: preview?.minimum_bid || preview?.price || '',
              reserve_price: preview?.reserve_price || preview?.price || '',
              stock: '',
              start_date: '',
              end_date: '',
       });

       const { data: saveData, setData: setSaveData } = saveForm;
       const { data: previewData } = previewForm;

       const selectedCategory = useMemo(
              () => categories.find((item) => String(item.id) === String(saveForm.data.category_id)),
              [categories, saveForm.data.category_id],
       );

       const selectedSubCategory = useMemo(
              () => categoryChildren(selectedCategory).find((item) => String(item.id) === String(saveForm.data.sub_category_id)),
              [selectedCategory, saveForm.data.sub_category_id],
       );

       const userOptions = useMemo(
              () => users.map((user) => ({ value: user.id, label: `${user.name} ${user.email ? `(${user.email})` : ''}`.trim() })),
              [users],
       );

       const categoryOptions = useMemo(
              () => categories.map((category) => ({ value: category.id, label: category.name })),
              [categories],
       );

       const isAuctionType = ['auction', 'live_auction'].includes(String(saveForm.data.listing_type || '').toLowerCase());
       const isBusinessType = String(saveForm.data.listing_type || '').toLowerCase() === 'business';
       const isNormalType = String(saveForm.data.listing_type || '').toLowerCase() === 'normal';

       const subCategories = categoryChildren(selectedCategory);
       const childCategories = childChildren(selectedSubCategory);

       useEffect(() => {
              if (!preview?.source_url) {
                     return;
              }

              if (previewSyncRef.current === preview.source_url) {
                     return;
              }

              previewSyncRef.current = preview.source_url;
              setSaveData('url', preview.source_url || saveData.url);
              setSaveData('title', preview.title || '');
              setSaveData('description', preview.description || '');
              setSaveData('minimum_bid', preview.minimum_bid || preview.price || '');
              setSaveData('reserve_price', preview.reserve_price || preview.price || '');
       }, [preview, saveData.url, setSaveData]);

       useEffect(() => {
              if (!preview) {
                     return;
              }

              if (isAuctionType) {
                     if (!saveForm.data.minimum_bid) {
                            saveForm.setData('minimum_bid', preview.minimum_bid || preview.price || '');
                     }

                     if (!saveForm.data.reserve_price) {
                            saveForm.setData('reserve_price', preview.reserve_price || preview.price || '');
                     }
              }

              if (isNormalType || isBusinessType) {
                     if (!saveForm.data.price) {
                            saveForm.setData('price', preview.price || preview.minimum_bid || '');
                     }
              }
       }, [preview, isAuctionType, isNormalType, isBusinessType, saveForm.data.minimum_bid, saveForm.data.reserve_price, saveForm.data.price]);

       const updateUrl = (value) => {
              previewForm.setData('url', value);
              saveForm.setData('url', value);
       };

       const handleListingTypeChange = (value) => {
              saveForm.setData('listing_type', value);

              const normalized = String(value || '').toLowerCase();

              if (normalized === 'auction' || normalized === 'live_auction') {
                     saveForm.setData('minimum_bid', preview?.minimum_bid || preview?.price || saveForm.data.minimum_bid || '');
                     saveForm.setData('reserve_price', preview?.reserve_price || preview?.price || saveForm.data.reserve_price || '');
                     saveForm.setData('price', '');
                     saveForm.setData('stock', '');
                     saveForm.setData('start_date', '');
                     saveForm.setData('end_date', '');
                     return;
              }

              if (normalized === 'business') {
                     saveForm.setData('price', preview?.price || preview?.minimum_bid || saveForm.data.price || '');
                     saveForm.setData('minimum_bid', '');
                     saveForm.setData('reserve_price', '');
                     saveForm.setData('start_date', '');
                     saveForm.setData('end_date', '');
                     return;
              }

              saveForm.setData('price', preview?.price || preview?.minimum_bid || saveForm.data.price || '');
              saveForm.setData('minimum_bid', '');
              saveForm.setData('reserve_price', '');
              saveForm.setData('stock', '');
              saveForm.setData('start_date', '');
              saveForm.setData('end_date', '');
       };

       const submitPreview = (event) => {
              event.preventDefault();
              previewForm.post(route('admin.olx-scraper.preview'), {
                     preserveScroll: true,
              });
       };

       const submitSave = (event) => {
              event.preventDefault();
              saveForm.post(route('admin.olx-scraper.save'), {
                     preserveScroll: true,
              });
       };

       const imageList = toArray(preview?.images);
       const previewImageList = toArray(preview?.preview_images).length > 0
              ? toArray(preview?.preview_images)
              : imageList;

       return (
              <AdminLayout title="OLX Scraper">
                     <Head title="OLX Scraper" />

                     <div className="mx-auto max-w-7xl space-y-6 pb-12">
                            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                   <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                          <div>
                                                 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Admin Tool</p>
                                                 <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">OLX Scraper</h1>
                                                 <p className="mt-2 max-w-3xl text-sm text-gray-500">
                                                        Extract title, description, images and location directly from OLX HTML attributes. Category, seller and publishing details stay manual for the admin.
                                                 </p>
                                          </div>

                                          <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg shadow-black/10">
                                                 <i className="fa-solid fa-bolt text-xs"></i>
                                                 <span className="text-xs font-black uppercase tracking-[0.2em]">HTML Attribute Parser</span>
                                          </div>
                                   </div>

                                          <form onSubmit={submitPreview} className="mt-6 space-y-3">
                                          <InputLabel value="OLX URL" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                          <div className="flex flex-col gap-3 lg:flex-row">
                                                 <TextInput
                                                        type="url"
                                                        value={previewData.url}
                                                        onChange={(event) => updateUrl(event.target.value)}
                                                        placeholder="https://www.olx.com.pk/..."
                                                        className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                        required
                                                 />
                                                 <PrimaryButton
                                                        type="submit"
                                                        disabled={previewForm.processing}
                                                        className="rounded-2xl bg-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800"
                                                 >
                                                        {previewForm.processing ? 'Scraping...' : 'Preview'}
                                                 </PrimaryButton>
                                          </div>
                                          <InputError message={previewForm.errors.url} className="mt-2" />
                                   </form>
                            </div>

                            {(status || error) && (
                                   <div className={`rounded-[1.5rem] border px-5 py-4 shadow-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                          <div className="flex items-start gap-3">
                                                 <i className={`fa-solid ${error ? 'fa-triangle-exclamation' : 'fa-circle-check'} mt-0.5`}></i>
                                                 <div className="min-w-0">
                                                        <p className="font-bold">{error ? 'Scrape Error' : 'Success'}</p>
                                                        <p className="text-sm">{error || status}</p>
                                                 </div>
                                          </div>
                                   </div>
                            )}

                            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                   <div className="space-y-6">
                                          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                 <div className="mb-5 flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                                                               <i className="fa-solid fa-layer-group text-sm"></i>
                                                        </div>
                                                        <div>
                                                               <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Manual Publish</h2>
                                                               <p className="text-[11px] font-medium text-gray-400">Choose admin-only metadata before saving the listing.</p>
                                                        </div>
                                                 </div>

                                                 <form onSubmit={submitSave} className="space-y-5">
                                                        <input type="hidden" value={saveForm.data.url} name="url" />

                                                        <div className="grid gap-5 md:grid-cols-2">
                                                              <div>
                                                                      <InputLabel value="Seller/User" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <SearchableSelect
                                                                             value={saveForm.data.user_id}
                                                                             options={userOptions}
                                                                             placeholder="Search user..."
                                                                             onChange={(selectedValue) => saveForm.setData('user_id', selectedValue)}
                                                                      />
                                                                      <InputError message={saveForm.errors.user_id} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Listing Type" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <select
                                                                             value={saveForm.data.listing_type}
                                                                             onChange={(event) => handleListingTypeChange(event.target.value)}
                                                                             className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                      >
                                                                             <option value="auction">Auction</option>
                                                                             <option value="normal">Normal</option>
                                                                             <option value="business">Business</option>
                                                                             <option value="live_auction">Live Auction</option>
                                                                      </select>
                                                                      <p className="mt-2 text-[11px] text-gray-400">
                                                                             {isAuctionType
                                                                                    ? 'Auction mode shows starting bid and reserve price.'
                                                                                    : isBusinessType
                                                                                           ? 'Business mode shows a price and stock quantity.'
                                                                                           : 'Normal mode shows only a simple price field.'}
                                                                      </p>
                                                              </div>

                                                              <div>
                                                                      <InputLabel value="Category" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <SearchableSelect
                                                                             value={saveForm.data.category_id}
                                                                             options={categoryOptions}
                                                                             placeholder="Search category..."
                                                                             onChange={(selectedValue) => {
                                                                                    saveForm.setData('category_id', selectedValue);
                                                                                    saveForm.setData('sub_category_id', '');
                                                                                    saveForm.setData('child_category_id', '');
                                                                             }}
                                                                      />
                                                                      <InputError message={saveForm.errors.category_id} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Sub Category" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <select
                                                                             value={saveForm.data.sub_category_id}
                                                                             onChange={(event) => {
                                                                                    saveForm.setData('sub_category_id', event.target.value);
                                                                                    saveForm.setData('child_category_id', '');
                                                                             }}
                                                                             className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 disabled:bg-gray-50"
                                                                             disabled={!selectedCategory}
                                                                      >
                                                                             <option value="">Select sub category</option>
                                                                             {subCategories.map((category) => (
                                                                                    <option key={category.id} value={category.id}>
                                                                                           {category.name}
                                                                                    </option>
                                                                             ))}
                                                                      </select>
                                                                      <InputError message={saveForm.errors.sub_category_id} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Child Category" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <select
                                                                             value={saveForm.data.child_category_id}
                                                                             onChange={(event) => saveForm.setData('child_category_id', event.target.value)}
                                                                             className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 disabled:bg-gray-50"
                                                                             disabled={!selectedSubCategory}
                                                                      >
                                                                             <option value="">Select child category</option>
                                                                             {childCategories.map((category) => (
                                                                                    <option key={category.id} value={category.id}>
                                                                                           {category.name}
                                                                                    </option>
                                                                             ))}
                                                                      </select>
                                                                      <InputError message={saveForm.errors.child_category_id} className="mt-2" />
                                                               </div>
                                                        </div>

                                                        <div>
                                                               <InputLabel value="Title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                               <TextInput
                                                                      value={saveForm.data.title}
                                                                      onChange={(event) => saveForm.setData('title', event.target.value)}
                                                                      className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                      placeholder="Listing title"
                                                               />
                                                               <InputError message={saveForm.errors.title} className="mt-2" />
                                                        </div>

                                                        <div>
                                                               <InputLabel value="Description" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                               <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                                                      <ReactQuill
                                                                             theme="snow"
                                                                             value={saveForm.data.description}
                                                                             onChange={(value) => saveForm.setData('description', value)}
                                                                             placeholder="Listing description"
                                                                             className="admin-olx-quill"
                                                                      />
                                                               </div>
                                                               <InputError message={saveForm.errors.description} className="mt-2" />
                                                        </div>

                                                        {isAuctionType ? (
                                                               <div className="grid gap-5 md:grid-cols-2">
                                                                      <div>
                                                                             <InputLabel value="Minimum Bid" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                             <TextInput
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    value={saveForm.data.minimum_bid}
                                                                                    onChange={(event) => saveForm.setData('minimum_bid', event.target.value)}
                                                                                    className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                    placeholder="0"
                                                                             />
                                                                             <InputError message={saveForm.errors.minimum_bid} className="mt-2" />
                                                                      </div>

                                                                      <div>
                                                                             <InputLabel value="Reserve Price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                             <TextInput
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    value={saveForm.data.reserve_price}
                                                                                    onChange={(event) => saveForm.setData('reserve_price', event.target.value)}
                                                                                    className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                    placeholder="0"
                                                                             />
                                                                             <InputError message={saveForm.errors.reserve_price} className="mt-2" />
                                                                      </div>
                                                               </div>
                                                        ) : (
                                                               <div className="grid gap-5 md:grid-cols-2">
                                                                      <div>
                                                                             <InputLabel value="Price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                             <TextInput
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    value={saveForm.data.price || ''}
                                                                                    onChange={(event) => saveForm.setData('price', event.target.value)}
                                                                                    className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                    placeholder="0"
                                                                             />
                                                                             <InputError message={saveForm.errors.price} className="mt-2" />
                                                                      </div>

                                                                      {isBusinessType && (
                                                                             <div>
                                                                                    <InputLabel value="Stock" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                    <TextInput
                                                                                           type="number"
                                                                                           step="1"
                                                                                           min="0"
                                                                                           value={saveForm.data.stock || ''}
                                                                                           onChange={(event) => saveForm.setData('stock', event.target.value)}
                                                                                           className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                           placeholder="0"
                                                                                    />
                                                                                    <InputError message={saveForm.errors.stock} className="mt-2" />
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        )}

                                                        {isAuctionType && (
                                                               <div className="grid gap-5 md:grid-cols-2">
                                                                      <div>
                                                                             <InputLabel value="Start Date" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                             <TextInput
                                                                                    type="datetime-local"
                                                                                    value={saveForm.data.start_date || ''}
                                                                                    onChange={(event) => saveForm.setData('start_date', event.target.value)}
                                                                                    className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                             />
                                                                             <InputError message={saveForm.errors.start_date} className="mt-2" />
                                                                      </div>

                                                                      <div>
                                                                             <InputLabel value="End Date" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                             <TextInput
                                                                                    type="datetime-local"
                                                                                    value={saveForm.data.end_date || ''}
                                                                                    onChange={(event) => saveForm.setData('end_date', event.target.value)}
                                                                                    className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                             />
                                                                             <InputError message={saveForm.errors.end_date} className="mt-2" />
                                                                      </div>
                                                               </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-3 pt-2">
                                                               <PrimaryButton
                                                                      type="submit"
                                                                      disabled={saveForm.processing}
                                                                      className="rounded-2xl bg-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800"
                                                               >
                                                                      {saveForm.processing ? 'Saving...' : 'Save Listing'}
                                                               </PrimaryButton>

                                                               <SecondaryButton
                                                                      type="button"
                                                                      className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50"
                                                                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                               >
                                                                      Back to URL
                                                               </SecondaryButton>
                                                        </div>
                                                 </form>
                                          </section>
                                   </div>

                                   <div className="space-y-6">
                                          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                 <div className="mb-5 flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                                                               <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                                                        </div>
                                                        <div>
                                                               <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Scraped Preview</h2>
                                                               <p className="text-[11px] font-medium text-gray-400">Loaded from OLX HTML attributes and meta tags.</p>
                                                        </div>
                                                 </div>

                                                 {preview ? (
                                                        <div className="space-y-4">
                                                               <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Title</p>
                                                                      <h3 className="mt-2 text-lg font-black text-gray-900">{preview.title || 'No title found'}</h3>
                                                                      {preview.location_text && <p className="mt-2 text-sm text-gray-500">{preview.location_text}</p>}
                                                               </div>

                                                               <div className="grid gap-3 sm:grid-cols-2">
                                                                      <div className="rounded-[1.25rem] border border-gray-100 bg-white p-4">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Price</p>
                                                                             <p className="mt-2 text-lg font-black text-gray-900">{preview.price ? `PKR ${preview.price}` : 'Not found'}</p>
                                                                      </div>
                                                                      <div className="rounded-[1.25rem] border border-gray-100 bg-white p-4">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Source</p>
                                                                             <p className="mt-2 break-all text-sm font-semibold text-gray-700">{preview.source_domain || 'OLX'}</p>
                                                                      </div>
                                                               </div>

                                                               <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Description</p>
                                                                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                                                                             {preview.description || 'No description found'}
                                                                      </p>
                                                               </div>

                                                               <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                                                                      <div className="flex items-center justify-between">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Images</p>
                                                                      <span className="text-xs font-bold text-gray-500">{imageList.length}</span>
                                                              </div>

                                                                      {previewImageList.length > 0 ? (
                                                                             <div className="mt-3 grid grid-cols-2 gap-3">
                                                                                    {previewImageList.map((imageUrl, index) => (
                                                                                           <a key={`${imageUrl}-${index}`} href={imageUrl} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                                                                                                  <img
                                                                                                        src={imageUrl}
                                                                                                         alt={`OLX ${index + 1}`}
                                                                                                         className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                                                                                                  />
                                                                                           </a>
                                                                                    ))}
                                                                             </div>
                                                                      ) : (
                                                                             <p className="mt-3 text-sm text-gray-500">No images found in the page HTML.</p>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 ) : (
                                                        <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                                                               <i className="fa-regular fa-image text-3xl text-gray-300"></i>
                                                               <p className="mt-4 text-sm font-semibold text-gray-500">
                                                                      Paste an OLX listing URL and click Preview to extract data.
                                                               </p>
                                                        </div>
                                                 )}
                                          </section>

                                          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                 <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Debug</h2>
                                                 <p className="mt-1 text-[11px] font-medium text-gray-400">Useful only if extraction fails.</p>
                                                 <pre className="mt-4 max-h-[320px] overflow-auto rounded-2xl bg-gray-950 p-4 text-[11px] leading-6 text-gray-100">
{error || 'No scraper error.'}
                                                 </pre>
                                          </section>
                                   </div>
                           </div>

                           <style>{`
                                  .admin-olx-quill .ql-toolbar.ql-snow {
                                         border: 0;
                                         border-bottom: 1px solid rgb(229 231 235);
                                  }

                                  .admin-olx-quill .ql-container.ql-snow {
                                         border: 0;
                                         min-height: 180px;
                                  }

                                  .admin-olx-quill .ql-editor {
                                         min-height: 180px;
                                         color: rgb(17 24 39);
                                  }

                                  .admin-olx-quill .ql-editor.ql-blank::before {
                                         color: rgb(156 163 175);
                                         font-style: normal;
                                  }
                           `}</style>
                     </div>
              </AdminLayout>
       );
}
