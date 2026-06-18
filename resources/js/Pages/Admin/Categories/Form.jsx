import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Form({ category, categories = [], mode = 'create' }) {
       const imageInputRef = useRef(null);
       const iconInputRef = useRef(null);
       const imageInputId = 'category-image-input';
       const iconInputId = 'category-icon-input';

       const [imagePreview, setImagePreview] = useState(null);
       const [iconPreview, setIconPreview] = useState(null);

       const isEditing = mode === 'edit' && Boolean(category);

       const { data, setData, post, processing, errors, reset } = useForm({
              _method: isEditing ? 'PUT' : 'POST',
              name: category?.name || '',
              parent_id: category?.parent_id || '',
              sub_category_id: category?.sub_category_id || '',
              slug: category?.slug || '',
              image: null,
              icon: null,
              meta_title: category?.meta_title || '',
              meta_description: category?.meta_description || '',
              seo_content: category?.seo_content || '',
              seo_short_content: category?.seo_short_content || '',
              schema_markup: category?.schema_markup || '',
       });

       useEffect(() => {
              if (!data.image) {
                     setImagePreview(null);
                     return undefined;
              }

              const previewUrl = URL.createObjectURL(data.image);
              setImagePreview(previewUrl);

              return () => URL.revokeObjectURL(previewUrl);
       }, [data.image]);

       useEffect(() => {
              if (!data.icon) {
                     setIconPreview(null);
                     return undefined;
              }

              const previewUrl = URL.createObjectURL(data.icon);
              setIconPreview(previewUrl);

              return () => URL.revokeObjectURL(previewUrl);
       }, [data.icon]);

       const currentImageUrl = useMemo(() => {
              if (!isEditing || !category?.image) {
                     return null;
              }

              return category.image.startsWith('http') ? category.image : `/${String(category.image).replace(/^\/+/, '')}`;
       }, [category, isEditing]);

       const currentIconUrl = useMemo(() => {
              if (!isEditing || !category?.icon) {
                     return null;
              }

              return category.icon.startsWith('http') ? category.icon : `/${String(category.icon).replace(/^\/+/, '')}`;
       }, [category, isEditing]);

       const selectedParent = categories.find((item) => String(item.id) === String(data.parent_id));
       const subCategories = selectedParent?.subCategories || selectedParent?.sub_categories || [];

       const handleImageChange = (event) => {
              const file = event.target.files?.[0] || null;
              setData('image', file);
       };

       const handleIconChange = (event) => {
              const file = event.target.files?.[0] || null;
              setData('icon', file);
       };

       const clearImageSelection = () => {
              setData('image', null);
              if (imageInputRef.current) {
                     imageInputRef.current.value = '';
              }
       };

       const clearIconSelection = () => {
              setData('icon', null);
              if (iconInputRef.current) {
                     iconInputRef.current.value = '';
              }
       };

       const submit = (e) => {
              e.preventDefault();

              if (isEditing) {
                     post(route('admin.categories.update', category.id));
                     return;
              }

              post(route('admin.categories.store'));
       };

       return (
              <AdminLayout title={isEditing ? 'Edit Category' : 'New Category'}>
                     <Head title={isEditing ? 'Edit Category' : 'New Category'} />

                     <div className="mx-auto max-w-7xl pb-12">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                   <div>
                                          <Link href={route('admin.categories.index')} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                                 <i className="fa-solid fa-arrow-left mr-2"></i> Back to Categories
                                          </Link>
                                          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
                                                 {isEditing ? 'Edit Category' : 'Create Category'}
                                          </h1>
                                          <p className="mt-1 text-sm text-gray-500">
                                                 Manage category basics, SEO content and schema from one polished form.
                                          </p>
                                   </div>
                                   <div className="hidden md:flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg shadow-black/10">
                                          <i className="fa-solid fa-layer-group text-xs"></i>
                                          <span className="text-xs font-black uppercase tracking-[0.15em]">Category Studio</span>
                                   </div>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                   <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                                          <div className="space-y-8">
                                                 <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                        <div className="mb-6 flex items-center gap-3">
                                                               <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                                                                      <i className="fa-solid fa-pen-to-square text-sm"></i>
                                                               </div>
                                                               <div>
                                                                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Category Basics</h2>
                                                                      <p className="text-[11px] font-medium text-gray-400">Core fields used across the admin and marketplace.</p>
                                                               </div>
                                                        </div>

                                                        <div className="grid gap-6 md:grid-cols-2">
                                                               <div className="md:col-span-2">
                                                                      <InputLabel value="Category Name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <TextInput
                                                                             className="w-full text-gray-900 font-bold"
                                                                             value={data.name}
                                                                             onChange={(e) => setData('name', e.target.value)}
                                                                             required
                                                                             placeholder="e.g. Vehicles"
                                                                      />
                                                                      <InputError message={errors.name} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="SEO Slug (URL)" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <TextInput
                                                                             className="w-full text-gray-900"
                                                                             value={data.slug}
                                                                             onChange={(e) => setData('slug', e.target.value)}
                                                                             placeholder="auto-generated-slug"
                                                                      />
                                                                      <InputError message={errors.slug} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Parent Level" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <select
                                                                             className="w-full rounded-2xl border-gray-200 bg-white py-3 text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5"
                                                                             value={data.parent_id}
                                                                             onChange={(e) => {
                                                                                    setData('parent_id', e.target.value);
                                                                                    setData('sub_category_id', '');
                                                                             }}
                                                                      >
                                                                             <option value="">Top-Level Category</option>
                                                                             {categories.map((item) => (
                                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                             ))}
                                                                      </select>
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Sub-Category Level" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <select
                                                                             className="w-full rounded-2xl border-gray-200 bg-white py-3 text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5 disabled:bg-gray-50 disabled:text-gray-400"
                                                                             value={data.sub_category_id}
                                                                             onChange={(e) => setData('sub_category_id', e.target.value)}
                                                                             disabled={!data.parent_id}
                                                                      >
                                                                             <option value="">Root of Sub-Category</option>
                                                                             {subCategories.map((item) => (
                                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                             ))}
                                                                      </select>
                                                               </div>
                                                        </div>
                                                 </section>

                                                 <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                        <div className="mb-6 flex items-center gap-3">
                                                               <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white">
                                                                      <i className="fa-solid fa-image text-sm"></i>
                                                               </div>
                                                               <div>
                                                                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Media</h2>
                                                                      <p className="text-[11px] font-medium text-gray-400">Upload category image and icon for cards and listings.</p>
                                                               </div>
                                                        </div>

                                                        <div className="grid gap-6 md:grid-cols-2">
                                                               <div>
                                                                      <InputLabel value="Category Image" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <div className="rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/40 p-4">
                                                                             <input
                                                                                    id={imageInputId}
                                                                                    ref={imageInputRef}
                                                                                    type="file"
                                                                                    accept=".jpeg,.jpg,.png,.gif,image/jpeg,image/png,image/gif"
                                                                                    className="hidden"
                                                                                    onChange={handleImageChange}
                                                                             />
                                                                             <label htmlFor={imageInputId} className="flex cursor-pointer items-center gap-3 rounded-[1.25rem] bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
                                                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                                                                                           <i className="fa-solid fa-cloud-arrow-up"></i>
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                           <p className="text-sm font-bold text-gray-900">Upload image</p>
                                                                                           <p className="text-xs text-gray-400">PNG, JPG or GIF up to 2MB</p>
                                                                                    </div>
                                                                             </label>
                                                                             {data.image && (
                                                                                    <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white">
                                                                                           <img src={imagePreview} alt="Selected preview" className="h-40 w-full object-cover" />
                                                                                           <div className="flex items-center justify-between gap-3 px-4 py-3">
                                                                                                  <p className="truncate text-xs font-bold text-emerald-700">{data.image.name}</p>
                                                                                                  <button type="button" onClick={clearImageSelection} className="text-xs font-black uppercase tracking-widest text-rose-600">
                                                                                                         Remove
                                                                                                  </button>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                             {!data.image && currentImageUrl && (
                                                                                    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                                                                                           <img src={currentImageUrl} alt="Current category" className="h-40 w-full object-cover" />
                                                                                           <div className="px-4 py-3 text-xs font-bold text-gray-500">Current image</div>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                      <InputError message={errors.image} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Category Icon" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <div className="rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/40 p-4">
                                                                             <input
                                                                                    id={iconInputId}
                                                                                    ref={iconInputRef}
                                                                                    type="file"
                                                                                    accept=".jpeg,.jpg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                                                                                    className="hidden"
                                                                                    onChange={handleIconChange}
                                                                             />
                                                                             <label htmlFor={iconInputId} className="flex cursor-pointer items-center gap-3 rounded-[1.25rem] bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
                                                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                                                                                           <i className="fa-solid fa-icons"></i>
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                           <p className="text-sm font-bold text-gray-900">Upload icon</p>
                                                                                           <p className="text-xs text-gray-400">PNG, JPG, JPEG or SVG up to 2MB</p>
                                                                                    </div>
                                                                             </label>
                                                                             {data.icon && (
                                                                                    <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4">
                                                                                           <div className="flex items-center gap-3">
                                                                                                  <img src={iconPreview} alt="Selected icon preview" className="h-16 w-16 rounded-2xl object-contain border border-gray-100 bg-gray-50 p-2" />
                                                                                                  <div className="min-w-0 flex-1">
                                                                                                         <p className="truncate text-xs font-bold text-emerald-700">{data.icon.name}</p>
                                                                                                         <button type="button" onClick={clearIconSelection} className="mt-2 text-xs font-black uppercase tracking-widest text-rose-600">
                                                                                                                Remove
                                                                                                         </button>
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                             {!data.icon && currentIconUrl && (
                                                                                    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
                                                                                           <div className="flex items-center gap-3">
                                                                                                  <img src={currentIconUrl} alt="Current icon" className="h-16 w-16 rounded-2xl object-contain border border-gray-100 bg-gray-50 p-2" />
                                                                                                  <div className="text-xs font-bold text-gray-500">Current icon</div>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                      <InputError message={errors.icon} className="mt-2" />
                                                               </div>
                                                        </div>
                                                 </section>
                                          </div>

                                          <div className="space-y-8">
                                                 <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8">
                                                        <div className="mb-6 flex items-center gap-3">
                                                               <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                                                                      <i className="fa-solid fa-earth-americas text-sm"></i>
                                                               </div>
                                                               <div>
                                                                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">SEO & Schema</h2>
                                                                      <p className="text-[11px] font-medium text-gray-400">Search content and structured data for the category page.</p>
                                                               </div>
                                                        </div>

                                                        <div className="space-y-5">
                                                               <div>
                                                                      <InputLabel value="Meta Title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <TextInput
                                                                             className="w-full text-gray-900 font-bold"
                                                                             value={data.meta_title}
                                                                             onChange={(e) => setData('meta_title', e.target.value)}
                                                                             placeholder="Category meta title"
                                                                      />
                                                                      <InputError message={errors.meta_title} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Meta Description" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <textarea
                                                                             className="w-full min-h-[120px] rounded-2xl border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5"
                                                                             value={data.meta_description}
                                                                             onChange={(e) => setData('meta_description', e.target.value)}
                                                                             placeholder="Short description for search results"
                                                                      />
                                                                      <InputError message={errors.meta_description} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="SEO Short Content" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <div className="admin-category-quill">
                                                                             <ReactQuill
                                                                                    theme="snow"
                                                                                    value={data.seo_short_content}
                                                                                    onChange={(value) => setData('seo_short_content', value)}
                                                                                    placeholder="Short SEO copy..."
                                                                             />
                                                                      </div>
                                                                      <InputError message={errors.seo_short_content} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="SEO Content" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <div className="admin-category-quill">
                                                                             <ReactQuill
                                                                                    theme="snow"
                                                                                    value={data.seo_content}
                                                                                    onChange={(value) => setData('seo_content', value)}
                                                                                    placeholder="Long SEO content..."
                                                                             />
                                                                      </div>
                                                                      <InputError message={errors.seo_content} className="mt-2" />
                                                               </div>

                                                               <div>
                                                                      <InputLabel value="Schema Markup (JSON-LD)" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                                      <textarea
                                                                             className="w-full min-h-[180px] rounded-3xl border-gray-200 bg-white px-4 py-4 font-mono text-xs text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5"
                                                                             value={data.schema_markup}
                                                                             onChange={(e) => setData('schema_markup', e.target.value)}
                                                                             placeholder='{"@context":"https://schema.org","@type":"CollectionPage"}'
                                                                      />
                                                                      <InputError message={errors.schema_markup} className="mt-2" />
                                                               </div>
                                                        </div>
                                                 </section>

                                                 <section className="rounded-[2rem] border border-gray-100 bg-gradient-to-br from-black to-gray-800 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:p-8">
                                                        <h3 className="text-lg font-black uppercase tracking-tight">Ready to publish?</h3>
                                                        <p className="mt-2 text-sm text-white/70">
                                                               Save the category once the media, SEO and schema are in place.
                                                        </p>
                                                        <div className="mt-6 flex gap-3">
                                                               <button
                                                                      type="button"
                                                                      onClick={() => window.history.back()}
                                                                      className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/20"
                                                               >
                                                                      Cancel
                                                               </button>
                                                               <button
                                                                      type="submit"
                                                                      disabled={processing}
                                                                      className="rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-gray-100 disabled:opacity-50"
                                                               >
                                                                      {processing ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                                                               </button>
                                                        </div>
                                                 </section>
                                          </div>
                                   </div>
                            </form>
                     </div>

                     <style>{`
                            .admin-category-quill .ql-toolbar.ql-snow {
                                   border: none;
                                   border-bottom: 1px solid rgb(243 244 246);
                                   padding: 1rem 1.25rem;
                                   background: rgb(249 250 251);
                                   border-radius: 24px 24px 0 0;
                            }

                            .admin-category-quill .ql-container.ql-snow {
                                   border: none;
                                   padding: 0.75rem 0.75rem;
                                   background: #fff;
                                   min-height: 220px;
                                   font-size: 15px;
                                   font-family: inherit;
                                   border-radius: 0 0 24px 24px;
                            }

                            .admin-category-quill .ql-editor {
                                   min-height: 220px;
                                   color: #111827;
                                   line-height: 1.8;
                            }

                            .admin-category-quill .ql-editor.ql-blank::before {
                                   color: #d1d5db;
                                   font-style: normal;
                                   left: 18px;
                                   font-weight: 500;
                            }

                            .admin-category-quill {
                                   border: 2px solid transparent;
                                   background: rgb(249 250 251);
                                   border-radius: 28px;
                                   overflow: hidden;
                                   transition: all 0.3s ease;
                            }
                     `}</style>
              </AdminLayout>
       );
}
