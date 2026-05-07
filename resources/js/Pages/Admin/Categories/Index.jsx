import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function Index({ categories, filters }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingCategory, setEditingCategory] = useState(null);
       const [search, setSearch] = useState(filters.search || '');
       const [expanded, setExpanded] = useState({}); // Tracking expanded states by cat.id

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.categories.index'), { search }, { preserveState: true });
       };

       const toggleExpand = (id) => {
              setExpanded(prev => ({
                     ...prev,
                     [id]: !prev[id]
              }));
       };

       const assetUrl = (path) => {
              if (!path) return null;
              if (path.startsWith('http')) return path;
              return `${window.location.origin}/${path.replace(/^\/+/, '')}`;
       };

       const { data, setData, post, put, processing, errors, reset } = useForm({
              name: '',
              parent_id: '',
              sub_category_id: '',
              slug: '',
              image: null,
              icon: null,
              meta_title: '',
              meta_description: '',
              seo_content: '',
              seo_short_content: '',
              schema_markup: '',
       });

       const openModal = (category = null) => {
              setEditingCategory(category);
              if (category) {
                     setData({
                            name: category.name || '',
                            parent_id: category.parent_id || '',
                            sub_category_id: category.sub_category_id || '',
                            slug: category.slug || '',
                            image: null,
                            icon: null,
                            meta_title: category.meta_title || '',
                            meta_description: category.meta_description || '',
                            seo_content: category.seo_content || '',
                            seo_short_content: category.seo_short_content || '',
                            schema_markup: category.schema_markup || '',
                     });
              } else {
                     reset();
              }
              setIsModalOpen(true);
       };

       const submit = (e) => {
              e.preventDefault();
              if (editingCategory) {
                     router.post(route('admin.categories.update', editingCategory.id), {
                            ...data,
                            _method: 'PUT'
                     }, {
                            onSuccess: () => closeModal(),
                     });
              } else {
                     post(route('admin.categories.store'), {
                            onSuccess: () => closeModal(),
                     });
              }
       };

       const closeModal = () => {
              setIsModalOpen(false);
              setEditingCategory(null);
              reset();
       };

       const deleteCategory = async (id) => {
              const result = await Swal.fire({
                     title: 'Are you sure?',
                     text: 'This category will be deleted permanently.',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#000000',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'Yes, delete it',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.delete(route('admin.categories.destroy', id));
              };
       };

       // Nested Rendering Helper with Accordion //
       const renderCategoryRows = (cat, depth = 0) => {
              const styles = {
                     0: { bg: 'bg-white', badge: 'bg-sky-100 text-sky-700', label: 'Main' },
                     1: { bg: 'bg-emerald-50/5', badge: 'bg-emerald-100 text-emerald-700', label: 'Sub' },
                     2: { bg: 'bg-gray-50/20', badge: 'bg-indigo-100 text-indigo-700', label: 'Child' }
              };

              const currentStyle = styles[depth] || styles[2];
              const isExpanded = expanded[cat.id];
              const children = cat.sub_categories || cat.subCategories || cat.child_categories || cat.childCategories || [];
              const hasChildren = children.length > 0;

              const imageUrl = assetUrl(cat.image);

              const rows = [
                     <tr key={cat.id} className={`${currentStyle.bg} hover:bg-gray-50/80 transition-all border-b border-gray-100/50`}>
                            <td className="px-6 py-4">
                                   <div 
                                          className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm"
                                          style={{ marginLeft: `${depth * 2}rem` }}
                                   >
                                          {imageUrl ? (
                                                 <img src={imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                          ) : (
                                                 <i className="fa-solid fa-folder text-gray-300"></i>
                                          )}
                                   </div>
                            </td>
                            <td className="px-6 py-4">
                                   <div className="flex items-center gap-3" style={{ marginLeft: `${depth * 1.5}rem` }}>
                                          {hasChildren ? (
                                                 <button 
                                                        onClick={() => toggleExpand(cat.id)}
                                                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                 >
                                                        <i className={`fa-solid fa-chevron-right text-[10px] transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}></i>
                                                 </button>
                                          ) : (
                                                 <div className="w-6 h-6 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                                 </div>
                                          )}
                                          <div>
                                                 <span className={`text-sm font-black text-gray-900 ${depth === 0 ? 'text-base' : ''}`}>{cat.name}</span>
                                                 <p className="text-[10px] text-gray-400 font-medium tracking-wide">/{cat.slug}</p>
                                          </div>
                                   </div>
                            </td>
                            <td className="px-6 py-4">
                                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${currentStyle.badge}`}>
                                          {currentStyle.label}
                                   </span>
                            </td>
                            <td className="px-6 py-4">
                                   <div className="flex flex-col">
                                          <span className={`text-[10px] font-black uppercase tracking-widest ${hasChildren ? 'text-emerald-600' : 'text-gray-300'}`}>
                                                 {children.length} Children
                                          </span>
                                   </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                   <div className="flex gap-2 justify-end">
                                          <button onClick={() => openModal(cat)} className="p-2 hover:bg-amber-50 rounded-xl text-amber-600 transition-colors" title="Edit"><i className="fa-solid fa-pen-to-square"></i></button>
                                          <button onClick={() => deleteCategory(cat.id)} className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-colors" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                   </div>
                            </td>
                     </tr>
              ];

              if (isExpanded || search) {
                     children.forEach(child => {
                            rows.push(...renderCategoryRows(child, depth + 1));
                     });
              }

              return rows;
       };

       return (
              <AdminLayout title="Product Categories">
                     <Head title="Product Categories" />

                     {/* Header */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                   <h1 className="text-3xl font-black text-gray-900 tracking-tight">Category Management</h1>
                                   <p className="text-sm text-gray-500 font-medium">Click on the arrows to expand sub-categories.</p>
                            </div>
                            <PrimaryButton onClick={() => openModal()}>
                                   <i className="fa-solid fa-plus mr-2"></i> Add Main Category
                            </PrimaryButton>
                     </div>

                     <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            {/* Search */}
                            <div className="p-8 border-b border-gray-100 bg-gray-50/10">
                                   <form onSubmit={handleSearch} className="max-w-xl flex gap-3">
                                          <div className="relative flex-1 group">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                                                        placeholder="Search results will be auto-expanded..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <button type="submit" className="px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2 active:scale-95">
                                                 <i className="fa-solid fa-magnifying-glass"></i>
                                                 Filter
                                          </button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto min-h-[400px]">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <th className="px-6 py-5 w-16">Image</th>
                                                        <th className="px-6 py-5">Name & Path</th>
                                                        <th className="px-6 py-5">Level</th>
                                                        <th className="px-6 py-5">Stats</th>
                                                        <th className="px-6 py-5 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {categories.length > 0 ? categories.map(cat => renderCategoryRows(cat)) : (
                                                        <tr>
                                                               <td colSpan="5" className="px-6 py-28 text-center bg-gray-50/20">
                                                                      <div className="flex flex-col items-center gap-4">
                                                                             <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-gray-200">
                                                                                    <i className="fa-solid fa-folder-open text-4xl"></i>
                                                                             </div>
                                                                             <div>
                                                                                    <p className="text-gray-900 font-bold">No categories found</p>
                                                                                    <p className="text-gray-400 text-sm">Create your first main category to get started.</p>
                                                                             </div>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 )}
                                          </tbody>
                                   </table>
                            </div>
                     </div>

                     {/* Modal for Add/Edit */}
                     <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                            <form onSubmit={submit} className="flex max-h-[calc(100vh-3rem)] flex-col">
                                   <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
                                          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                                 {editingCategory ? 'Modify Category' : 'New Category'}
                                          </h2>
                                          <button type="button" onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                                 <i className="fa-solid fa-xmark text-gray-400"></i>
                                          </button>
                                   </div>

                                   <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto px-8 py-6">
                                          <div className="space-y-6">
                                                 <div>
                                                        <InputLabel value="Category Name" required className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                        <TextInput
                                                               className="w-full text-gray-900 font-bold"
                                                               value={data.name}
                                                               onChange={e => setData('name', e.target.value)}
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
                                                               onChange={e => setData('slug', e.target.value)}
                                                               placeholder="auto-generated-slug"
                                                        />
                                                        <InputError message={errors.slug} className="mt-2" />
                                                 </div>
                                          </div>

                                          <div className="space-y-6">
                                                 <div>
                                                        <InputLabel value="Parent Level" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                        <select
                                                               className="w-full border-gray-200 focus:border-black focus:ring-4 focus:ring-black/5 rounded-2xl shadow-sm text-gray-900 font-medium py-3"
                                                               value={data.parent_id}
                                                               onChange={e => setData('parent_id', e.target.value)}
                                                        >
                                                               <option value="">Top-Level Category</option>
                                                               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                 </div>

                                                 <div>
                                                        <InputLabel value="Sub-Category Level" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                        <select
                                                               className="w-full border-gray-200 focus:border-black focus:ring-4 focus:ring-black/5 rounded-2xl shadow-sm text-gray-900 font-medium py-3 disabled:opacity-30 disabled:bg-gray-50"
                                                               value={data.sub_category_id}
                                                               onChange={e => setData('sub_category_id', e.target.value)}
                                                               disabled={!data.parent_id}
                                                        >
                                                               <option value="">Root of Sub-Category</option>
                                                               {categories.find(c => c.id == data.parent_id)?.subCategories?.map(sc => (
                                                                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                                                               ))}
                                                        </select>
                                                 </div>
                                          </div>

                                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                 <div>
                                                        <InputLabel value="Upload Category Image" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                        {editingCategory?.image && (
                                                               <div className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                                                                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-white flex items-center justify-center">
                                                                             <img src={assetUrl(editingCategory.image)} className="h-full w-full object-cover" alt="Current category" referrerPolicy="no-referrer" />
                                                                      </div>
                                                                      <div>
                                                                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Image</p>
                                                                             <p className="text-xs font-bold text-gray-900">Uploaded category image</p>
                                                                      </div>
                                                               </div>
                                                        )}
                                                        <div className="mt-2 flex items-center gap-3 p-5 min-h-[110px] border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                                               <input
                                                                      type="file"
                                                                      accept=".jpeg,.jpg,.png,.gif,image/jpeg,image/png,image/gif"
                                                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                                                      onChange={e => setData('image', e.target.files[0])}
                                                               />
                                                               <div className="w-11 h-11 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                                                      <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                                                               </div>
                                                               <div className="min-w-0">
                                                                      <p className="text-sm font-bold text-gray-900">Click to upload image</p>
                                                                      <p className="text-xs text-gray-400">PNG, JPG or GIF up to 2MB</p>
                                                                      {data.image && <p className="mt-1 text-xs font-bold text-emerald-600 truncate">{data.image.name}</p>}
                                                               </div>
                                                        </div>
                                                        <InputError message={errors.image} className="mt-2" />
                                                 </div>

                                                 <div>
                                                        <InputLabel value="Upload Category Icon (Optional)" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                                                        {editingCategory?.icon && (
                                                               <div className="mb-3 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                                                                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center">
                                                                             <img src={assetUrl(editingCategory.icon)} className="h-full w-full object-contain" alt="Current category icon" referrerPolicy="no-referrer" />
                                                                      </div>
                                                                      <div>
                                                                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Icon</p>
                                                                             <p className="text-xs font-bold text-gray-900">Uploaded category icon</p>
                                                                      </div>
                                                               </div>
                                                        )}
                                                        <div className="mt-2 flex items-center gap-3 p-5 min-h-[110px] border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                                               <input
                                                                      type="file"
                                                                      accept=".jpeg,.jpg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                                                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                                                      onChange={e => setData('icon', e.target.files[0])}
                                                               />
                                                               <div className="w-11 h-11 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                                                      <i className="fa-solid fa-icons text-lg"></i>
                                                               </div>
                                                               <div className="min-w-0">
                                                                      <p className="text-sm font-bold text-gray-900">Click to upload icon</p>
                                                                      <p className="text-xs text-gray-400">PNG, JPG, JPEG or SVG up to 2MB</p>
                                                                      {data.icon && <p className="mt-1 text-xs font-bold text-emerald-600 truncate">{data.icon.name}</p>}
                                                               </div>
                                                        </div>
                                                        <InputError message={errors.icon} className="mt-2" />
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="sticky bottom-0 z-10 flex justify-end gap-4 border-t border-gray-100 bg-white px-8 py-5">
                                          <SecondaryButton onClick={closeModal} className="px-8 py-3 rounded-2xl">Dismiss</SecondaryButton>
                                          <button 
                                                 type="submit" 
                                                 disabled={processing}
                                                 className="px-10 py-3 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/20 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50"
                                          >
                                                 {editingCategory ? 'Commit Changes' : 'Create Category'}
                                          </button>
                                   </div>
                            </form>
                     </Modal>
              </AdminLayout>
       );
}
