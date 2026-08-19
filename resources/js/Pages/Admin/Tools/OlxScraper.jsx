import { Head, router, useForm, usePage } from '@inertiajs/react';
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

export default function OlxScraper({
       users = [],
       categories = [],
       preview = null,
       preview_price = null,
       error = null,
       status = null,
       url = '',
       tool_name = 'OLX Scraper',
       tool_short = 'OLX',
       preview_route = 'admin.olx-scraper.preview',
       save_route = 'admin.olx-scraper.save',
       url_placeholder = 'https://www.olx.com.pk/...',
       default_listing_type = 'auction',
}) {
       const previewSyncRef = useRef('');
       const formSyncRef = useRef('');
       const imageInputRef = useRef(null);
       const [managedImages, setManagedImages] = useState([]);
       const [isSaving, setIsSaving] = useState(false);
       const [saveBannerError, setSaveBannerError] = useState(null);
       const { flash } = usePage().props;
       const bannerStatus = status || flash?.success || null;
       const bannerError = error || flash?.error || saveBannerError || null;
       const previewPriceValue = preview_price ?? preview?.price ?? preview?.minimum_bid ?? preview?.reserve_price ?? '';
       const previewPriceText = previewPriceValue === null || previewPriceValue === undefined || previewPriceValue === ''
              ? 'Not found'
              : `PKR ${String(previewPriceValue).trim()}`;

       const previewForm = useForm({
              url: url || '',
       });

       const saveForm = useForm({
              url: url || '',
              user_id: '',
              category_id: '',
              sub_category_id: '',
              child_category_id: '',
              listing_type: default_listing_type,
              title: preview?.title || '',
              description: preview?.description || '',
              price: previewPriceValue || '',
              minimum_bid: preview?.minimum_bid || previewPriceValue || '',
              reserve_price: preview?.reserve_price || previewPriceValue || '',
              stock: '',
              start_date: '',
              end_date: '',
              discount_type: '',
              discount_value: '',
              variations: Array.isArray(preview?.variations) ? preview.variations : [],
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

              const syncKey = `${preview.source_url}::${default_listing_type}`;

              if (previewSyncRef.current === preview.source_url && formSyncRef.current === syncKey) {
                     return;
              }

              previewSyncRef.current = preview.source_url;
              formSyncRef.current = syncKey;
              setSaveData('url', preview.source_url || saveData.url);
              setSaveData('listing_type', default_listing_type);
              setSaveData('title', preview.title || '');
              setSaveData('description', preview.description || '');
              setSaveData('price', default_listing_type === 'normal' || default_listing_type === 'business' ? (previewPriceValue || preview.minimum_bid || '') : '');
              setSaveData('minimum_bid', default_listing_type === 'auction' || default_listing_type === 'live_auction' ? (preview.minimum_bid || previewPriceValue || '') : '');
              setSaveData('reserve_price', default_listing_type === 'auction' || default_listing_type === 'live_auction' ? (preview.reserve_price || previewPriceValue || '') : '');
              setSaveData('stock', default_listing_type === 'business' ? (saveForm.data.stock || '') : '');
              setSaveData('discount_type', default_listing_type === 'normal' || default_listing_type === 'business' ? (preview.discount_type || '') : '');
              setSaveData('discount_value', default_listing_type === 'normal' || default_listing_type === 'business' ? (preview.discount_value || '') : '');
              setSaveData(
                     'variations',
                     default_listing_type === 'normal' || default_listing_type === 'business'
                            ? toArray(preview.variations).map((variation) => ({
                                   name: variation?.name || '',
                                   price: variation?.price || previewPriceValue || '',
                                   discount_type: variation?.discount_type || '',
                                   discount_value: variation?.discount_value || '',
                            }))
                            : [],
              );
       }, [preview, saveData.url, setSaveData, default_listing_type, saveForm.data.stock]);

       useEffect(() => {
              if (!preview?.source_url) {
                     setManagedImages((prev) => {
                            prev.forEach((img) => {
                                   if (img.type === 'local' && img.url?.startsWith('blob:')) {
                                          URL.revokeObjectURL(img.url);
                                   }
                            });
                            return [];
                     });
                     return;
              }

              const urls = toArray(preview?.images).length > 0
                     ? toArray(preview.images)
                     : toArray(preview?.preview_images);

              setManagedImages((prev) => {
                     prev.forEach((img) => {
                            if (img.type === 'local' && img.url?.startsWith('blob:')) {
                                   URL.revokeObjectURL(img.url);
                            }
                     });

                     return urls.map((imageUrl, index) => ({
                            id: `remote-${index}-${imageUrl}`,
                            type: 'remote',
                            url: imageUrl,
                     }));
              });
       }, [preview?.source_url, preview?.images, preview?.preview_images]);

       useEffect(() => {
              if (!preview) {
                     return;
              }

              if (isAuctionType) {
                     if (!saveForm.data.minimum_bid) {
                            saveForm.setData('minimum_bid', preview.minimum_bid || previewPriceValue || '');
                     }

                     if (!saveForm.data.reserve_price) {
                            saveForm.setData('reserve_price', preview.reserve_price || previewPriceValue || '');
                     }
              }

              if (isNormalType || isBusinessType) {
                     if (!saveForm.data.price) {
                            saveForm.setData('price', previewPriceValue || preview.minimum_bid || '');
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
                     saveForm.setData('minimum_bid', preview?.minimum_bid || previewPriceValue || saveForm.data.minimum_bid || '');
                     saveForm.setData('reserve_price', preview?.reserve_price || previewPriceValue || saveForm.data.reserve_price || '');
                     saveForm.setData('price', '');
                     saveForm.setData('stock', '');
                     saveForm.setData('start_date', '');
                     saveForm.setData('end_date', '');
                     saveForm.setData('discount_type', '');
                     saveForm.setData('discount_value', '');
                     saveForm.setData('variations', []);
                     return;
              }

              const scrapedVariations = toArray(preview?.variations).map((variation) => ({
                     name: variation?.name || '',
                     price: variation?.price || previewPriceValue || '',
                     discount_type: variation?.discount_type || '',
                     discount_value: variation?.discount_value || '',
              }));

              if (normalized === 'business') {
                     saveForm.setData('price', previewPriceValue || preview?.minimum_bid || saveForm.data.price || '');
                     saveForm.setData('minimum_bid', '');
                     saveForm.setData('reserve_price', '');
                     saveForm.setData('start_date', '');
                     saveForm.setData('end_date', '');
                     saveForm.setData('variations', scrapedVariations);
                     return;
              }

              saveForm.setData('price', previewPriceValue || preview?.minimum_bid || saveForm.data.price || '');
              saveForm.setData('minimum_bid', '');
              saveForm.setData('reserve_price', '');
              saveForm.setData('stock', '');
              saveForm.setData('start_date', '');
              saveForm.setData('end_date', '');
              saveForm.setData('variations', scrapedVariations);
       };

       const addVariation = () => {
              saveForm.setData('variations', [
                     ...(saveForm.data.variations || []),
                     { name: '', price: previewPriceValue || saveForm.data.price || '', discount_type: '', discount_value: '' },
              ]);
       };

       const removeVariation = (index) => {
              const nextVariations = [...(saveForm.data.variations || [])];
              nextVariations.splice(index, 1);
              saveForm.setData('variations', nextVariations);
       };

       const updateVariation = (index, field, value) => {
              const nextVariations = [...(saveForm.data.variations || [])];
              nextVariations[index] = {
                     ...(nextVariations[index] || {}),
                     [field]: value,
              };
              saveForm.setData('variations', nextVariations);
       };

       const submitPreview = (event) => {
              event.preventDefault();
              previewForm.post(route(preview_route), {
                     preserveScroll: true,
              });
       };

       const removeManagedImage = (imageId) => {
              setManagedImages((prev) => {
                     const target = prev.find((img) => img.id === imageId);
                     if (target?.type === 'local' && target.url?.startsWith('blob:')) {
                            URL.revokeObjectURL(target.url);
                     }
                     return prev.filter((img) => img.id !== imageId);
              });
       };

       const onUploadImages = (event) => {
              const files = Array.from(event.target.files || []);
              if (!files.length) {
                     return;
              }

              const next = files.map((file, index) => ({
                     id: `local-${Date.now()}-${index}-${file.name}`,
                     type: 'local',
                     url: URL.createObjectURL(file),
                     file,
              }));

              setManagedImages((prev) => [...prev, ...next]);
              event.target.value = '';
       };

       const submitSave = (event) => {
              event.preventDefault();
              saveForm.clearErrors();
              setSaveBannerError(null);

              const formData = new FormData();
              Object.entries(saveForm.data).forEach(([key, value]) => {
                     if (value === null || value === undefined) {
                            return;
                     }

                     if (key === 'variations' && Array.isArray(value)) {
                            value.forEach((variation, index) => {
                                   formData.append(`variations[${index}][name]`, variation?.name ?? '');
                                   formData.append(`variations[${index}][price]`, variation?.price ?? '');
                                   formData.append(`variations[${index}][discount_type]`, variation?.discount_type ?? '');
                                   formData.append(`variations[${index}][discount_value]`, variation?.discount_value ?? '');
                            });
                            return;
                     }

                     formData.append(key, value);
              });

              formData.append('images_managed', '1');
              managedImages
                     .filter((img) => img.type === 'remote' && img.url)
                     .forEach((img) => formData.append('kept_images[]', img.url));
              managedImages
                     .filter((img) => img.type === 'local' && img.file)
                     .forEach((img) => formData.append('new_images[]', img.file));

              router.post(route(save_route), formData, {
                     forceFormData: true,
                     preserveScroll: false,
                     onStart: () => setIsSaving(true),
                     onFinish: () => setIsSaving(false),
                     onError: (errors) => {
                            if (errors && typeof errors === 'object') {
                                   Object.entries(errors).forEach(([key, message]) => {
                                          saveForm.setError(key, Array.isArray(message) ? message[0] : message);
                                   });

                                   const firstError = Object.values(errors)[0];
                                   setSaveBannerError(
                                          Array.isArray(firstError) ? firstError[0] : String(firstError || 'Save failed. Please check the form.')
                                   );
                            } else {
                                   setSaveBannerError('Save failed. Please try again.');
                            }
                     },
              });
       };

       return (
              <AdminLayout title={tool_name}>
                     <Head title={tool_name} />

                     <div className="mx-auto max-w-7xl space-y-6 pb-12">
                            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                   <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                          <div>
                                                 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Admin Tool</p>
                                                 <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">{tool_name}</h1>
                                                 <p className="mt-2 max-w-3xl text-sm text-gray-500">
                                                        Extract title, description, images and price directly from {tool_short} HTML attributes. Category, seller and publishing details stay manual for the admin.
                                                 </p>
                                          </div>

                                          <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg shadow-black/10">
                                                 <i className="fa-solid fa-bolt text-xs"></i>
                                                 <span className="text-xs font-black uppercase tracking-[0.2em]">HTML Attribute Parser</span>
                                          </div>
                                   </div>

                                          <form onSubmit={submitPreview} className="mt-6 space-y-3">
                                          <InputLabel value={`${tool_short} URL`} className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                          <div className="flex flex-col gap-3 lg:flex-row">
                                                 <TextInput
                                                        type="url"
                                                        value={previewData.url}
                                                        onChange={(event) => updateUrl(event.target.value)}
                                                        placeholder={url_placeholder}
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

                            {(bannerStatus || bannerError) && (
                                   <div className={`rounded-[1.5rem] border px-5 py-4 shadow-sm ${bannerError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                          <div className="flex items-start gap-3">
                                                 <i className={`fa-solid ${bannerError ? 'fa-triangle-exclamation' : 'fa-circle-check'} mt-0.5`}></i>
                                                 <div className="min-w-0">
                                                        <p className="font-bold">{bannerError ? 'Error' : 'Success'}</p>
                                                        <p className="text-sm">{bannerError || bannerStatus}</p>
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

                                                        {(isNormalType || isBusinessType) && (
                                                               <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                                                                      <div className="flex items-center justify-between gap-3">
                                                                             <div>
                                                                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Discount & Variations</h3>
                                                                                    <p className="mt-1 text-xs text-gray-500">Scraped size/color options fill here. You can edit, remove, or add more before save.</p>
                                                                             </div>
                                                                             <button
                                                                                    type="button"
                                                                                    onClick={addVariation}
                                                                                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50"
                                                                             >
                                                                                    Add Variation
                                                                             </button>
                                                                      </div>

                                                                      <div className="grid gap-4 md:grid-cols-2">
                                                                             <div>
                                                                                    <InputLabel value="Discount Type" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                    <select
                                                                                           value={saveForm.data.discount_type || ''}
                                                                                           onChange={(event) => saveForm.setData('discount_type', event.target.value)}
                                                                                           className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                    >
                                                                                           <option value="">No discount</option>
                                                                                           <option value="percent">Percent</option>
                                                                                           <option value="flat">Flat</option>
                                                                                    </select>
                                                                                    <InputError message={saveForm.errors.discount_type} className="mt-2" />
                                                                             </div>
                                                                             <div>
                                                                                    <InputLabel value="Discount Value" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                    <TextInput
                                                                                           type="number"
                                                                                           step="0.01"
                                                                                           min="0"
                                                                                           value={saveForm.data.discount_value || ''}
                                                                                           onChange={(event) => saveForm.setData('discount_value', event.target.value)}
                                                                                           disabled={!saveForm.data.discount_type}
                                                                                           className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                    />
                                                                                    <InputError message={saveForm.errors.discount_value} className="mt-2" />
                                                                             </div>
                                                                      </div>

                                                                      {(saveForm.data.variations || []).length > 0 ? (
                                                                             <div className="space-y-3">
                                                                                    {(saveForm.data.variations || []).map((variation, index) => (
                                                                                           <div key={`variation-${index}`} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
                                                                                                  <div className="flex items-center justify-between gap-3">
                                                                                                         <h4 className="text-sm font-bold text-gray-800">Variation {index + 1}</h4>
                                                                                                         <button
                                                                                                                type="button"
                                                                                                                onClick={() => removeVariation(index)}
                                                                                                                className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                                                                                                         >
                                                                                                                Remove
                                                                                                         </button>
                                                                                                  </div>
                                                                                                  <div className="grid gap-4 md:grid-cols-2">
                                                                                                         <div>
                                                                                                                <InputLabel value="Variation Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                                                <TextInput
                                                                                                                       value={variation?.name || ''}
                                                                                                                       onChange={(event) => updateVariation(index, 'name', event.target.value)}
                                                                                                                       placeholder="Black / 7-8 Years"
                                                                                                                       className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                                                />
                                                                                                                <InputError message={saveForm.errors[`variations.${index}.name`]} className="mt-2" />
                                                                                                         </div>
                                                                                                         <div>
                                                                                                                <InputLabel value="Variation Price" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                                                <TextInput
                                                                                                                       type="number"
                                                                                                                       step="0.01"
                                                                                                                       min="0"
                                                                                                                       value={variation?.price || ''}
                                                                                                                       onChange={(event) => updateVariation(index, 'price', event.target.value)}
                                                                                                                       className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                                                />
                                                                                                                <InputError message={saveForm.errors[`variations.${index}.price`]} className="mt-2" />
                                                                                                         </div>
                                                                                                         <div>
                                                                                                                <InputLabel value="Variation Discount Type" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                                                <select
                                                                                                                       value={variation?.discount_type || ''}
                                                                                                                       onChange={(event) => updateVariation(index, 'discount_type', event.target.value)}
                                                                                                                       className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                                                >
                                                                                                                       <option value="">No discount</option>
                                                                                                                       <option value="percent">Percent</option>
                                                                                                                       <option value="flat">Flat</option>
                                                                                                                </select>
                                                                                                         </div>
                                                                                                         <div>
                                                                                                                <InputLabel value="Variation Discount Value" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                                                                <TextInput
                                                                                                                       type="number"
                                                                                                                       step="0.01"
                                                                                                                       min="0"
                                                                                                                       value={variation?.discount_value || ''}
                                                                                                                       onChange={(event) => updateVariation(index, 'discount_value', event.target.value)}
                                                                                                                       disabled={!variation?.discount_type}
                                                                                                                       className="w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                                                                                                                />
                                                                                                         </div>
                                                                                                  </div>
                                                                                           </div>
                                                                                    ))}
                                                                             </div>
                                                                      ) : (
                                                                             <p className="text-xs text-gray-500">No variations yet. Click Add Variation for size/color options.</p>
                                                                      )}
                                                               </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-3 pt-2">
                                                               <PrimaryButton
                                                                      type="submit"
                                                                      disabled={saveForm.processing || isSaving}
                                                                      className="rounded-2xl bg-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800"
                                                               >
                                                                      {(saveForm.processing || isSaving) ? 'Saving...' : 'Save Listing'}
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
                                                               <p className="text-[11px] font-medium text-gray-400">Loaded from {tool_short} HTML attributes and meta tags.</p>
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
                                                                             <p className="mt-2 text-lg font-black text-gray-900">{previewPriceText}</p>
                                                                      </div>
                                                                      <div className="rounded-[1.25rem] border border-gray-100 bg-white p-4">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Source</p>
                                                                             <p className="mt-2 break-all text-sm font-semibold text-gray-700">{preview.source_domain || tool_short}</p>
                                                                      </div>
                                                               </div>

                                                               <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                                                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Description</p>
                                                                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                                                                             {preview.description || 'No description found'}
                                                                      </p>
                                                               </div>

                                                               {toArray(preview.variations).length > 0 && (
                                                                      <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                                                                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Variations</p>
                                                                             <p className="mt-1 text-xs text-gray-500">{toArray(preview.variations).length} size/color options scraped</p>
                                                                             <div className="mt-3 max-h-56 space-y-2 overflow-auto">
                                                                                    {toArray(preview.variations).map((variation, index) => (
                                                                                           <div key={`preview-variation-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
                                                                                                  <span className="text-sm font-semibold text-gray-800">{variation?.name || `Variation ${index + 1}`}</span>
                                                                                                  <span className="text-sm font-black text-gray-900">
                                                                                                         {variation?.price ? `PKR ${variation.price}` : '—'}
                                                                                                  </span>
                                                                                           </div>
                                                                                    ))}
                                                                             </div>
                                                                      </div>
                                                               )}

                                                               <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                                                                      <div className="flex flex-wrap items-center justify-between gap-3">
                                                                             <div>
                                                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Images</p>
                                                                                    <p className="mt-1 text-xs text-gray-500">Remove scraped images or upload new ones before save.</p>
                                                                             </div>
                                                                             <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-bold text-gray-500">{managedImages.length}</span>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => imageInputRef.current?.click()}
                                                                                           className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white hover:bg-gray-800"
                                                                                    >
                                                                                           <i className="fa-solid fa-plus"></i>
                                                                                           Upload
                                                                                    </button>
                                                                                    <input
                                                                                           ref={imageInputRef}
                                                                                           type="file"
                                                                                           accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                                                                                           multiple
                                                                                           className="hidden"
                                                                                           onChange={onUploadImages}
                                                                                    />
                                                                             </div>
                                                                      </div>

                                                                      {managedImages.length > 0 ? (
                                                                             <div className="mt-3 grid grid-cols-2 gap-3">
                                                                                    {managedImages.map((imageItem) => (
                                                                                           <div key={imageItem.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                                                                                                  <img
                                                                                                         src={imageItem.url}
                                                                                                         alt={`${tool_short} preview`}
                                                                                                         className="h-36 w-full object-cover"
                                                                                                  />
                                                                                                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                                                                                                         <span className="rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                                                                                                {imageItem.type === 'local' ? 'New' : 'Scraped'}
                                                                                                         </span>
                                                                                                         <button
                                                                                                                type="button"
                                                                                                                onClick={() => removeManagedImage(imageItem.id)}
                                                                                                                className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow hover:bg-rose-700"
                                                                                                                title="Remove image"
                                                                                                         >
                                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                                         </button>
                                                                                                  </div>
                                                                                           </div>
                                                                                    ))}
                                                                             </div>
                                                                      ) : (
                                                                             <div className="mt-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                                                                    <p className="text-sm text-gray-500">No images selected. Upload at least one if needed.</p>
                                                                                    <button
                                                                                           type="button"
                                                                                           onClick={() => imageInputRef.current?.click()}
                                                                                           className="mt-3 text-xs font-black uppercase tracking-wider text-black underline"
                                                                                    >
                                                                                           Upload images
                                                                                    </button>
                                                                             </div>
                                                                      )}
                                                                      <InputError message={saveForm.errors.new_images || saveForm.errors.kept_images} className="mt-2" />
                                                               </div>
                                                        </div>
                                                 ) : (
                                                        <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                                                               <i className="fa-regular fa-image text-3xl text-gray-300"></i>
                                                               <p className="mt-4 text-sm font-semibold text-gray-500">
                                                                      Paste a {tool_short} listing URL and click Preview to extract data.
                                                               </p>
                                                        </div>
                                                 )}
                                          </section>

                                          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Debug</h2>
                                                <p className="mt-1 text-[11px] font-medium text-gray-400">Useful only if extraction fails.</p>
                                                <p className="mt-2 text-[11px] font-semibold text-gray-500">Raw preview price: {String(preview?.price ?? '') || 'empty'}</p>
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
