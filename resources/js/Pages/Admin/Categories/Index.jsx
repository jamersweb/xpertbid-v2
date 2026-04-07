import React, { useState, useMemo } from 'react';
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
       const [currentPath, setCurrentPath] = useState([]); // List of category objects tracking path
       const [search, setSearch] = useState(filters.search || '');

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.categories.index'), { search }, { preserveState: true });
       };

       const { data, setData, post, put, processing, errors, reset } = useForm({
              name: '',
              parent_id: '',
              sub_category_id: '',
              slug: '',
              image: null,
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

       // NAVIGATION LOGIC //
       const drillDown = (category) => {
              setCurrentPath([...currentPath, category]);
       };

       const goToLevel = (index) => {
              if (index === -1) {
                     setCurrentPath([]);
              } else {
                     setCurrentPath(currentPath.slice(0, index + 1));
              }
       };

       const displayedCategories = useMemo(() => {
              if (search) return categories; // Flat view on search

              if (currentPath.length === 0) return categories; // Top level

              const currentParent = currentPath[currentPath.length - 1];
              return currentParent.sub_categories || currentParent.subCategories || currentParent.child_categories || currentParent.childCategories || [];
       }, [categories, currentPath, search]);

       const formatHierarchy = (category) => {
              if (category.sub_category_id) return { label: 'Child Category', color: 'bg-indigo-100 text-indigo-700' };
              if (category.parent_id) return { label: 'Sub Category', color: 'bg-emerald-100 text-emerald-700' };
              return { label: 'Main Category', color: 'bg-sky-100 text-sky-700' };
       };

       return (
              <AdminLayout title="Auction Categories">
                     <Head title="Auction Categories" />

                     {/* Header Header */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                   <h1 className="text-2xl font-bold text-gray-900 leading-none">Category Management</h1>
                                   <div className="flex items-center gap-1 mt-2">
                                          <button 
                                                 onClick={() => goToLevel(-1)} 
                                                 className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${currentPath.length === 0 ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                                          >
                                                 Categories
                                          </button>
                                          {currentPath.map((item, idx) => (
                                                 <React.Fragment key={idx}>
                                                        <i className="fa-solid fa-chevron-right text-[8px] text-gray-300"></i>
                                                        <button 
                                                               onClick={() => goToLevel(idx)} 
                                                               className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${idx === currentPath.length - 1 ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                                                        >
                                                               {item.name}
                                                        </button>
                                                 </React.Fragment>
                                          ))}
                                   </div>
                            </div>
                            <PrimaryButton onClick={() => openModal()}>
                                   <i className="fa-solid fa-plus mr-2"></i> Add Top-Level
                            </PrimaryButton>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Search Header */}
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
                                          <div className="relative flex-1">
                                                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                                 <input
                                                        type="text"
                                                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all text-gray-900"
                                                        placeholder="Search categories..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                 />
                                          </div>
                                          <button type="submit" className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
                                                 <i className="fa-solid fa-magnifying-glass"></i>
                                                 Search
                                          </button>
                                   </form>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4 w-16">Image</th>
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Hierarchy</th>
                                                        <th className="px-6 py-4">Children</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {displayedCategories.length > 0 ? displayedCategories.map((category) => (
                                                        <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                                                             {category.image ? (
                                                                                    <img src={category.image} className="w-full h-full object-cover" alt="" />
                                                                             ) : (
                                                                                    <i className="fa-solid fa-folder-open text-gray-300"></i>
                                                                             )}
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className="text-sm font-bold text-gray-800">{category.name}</span>
                                                                      <p className="text-[10px] text-gray-400">/{category.slug}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${formatHierarchy(category).color}`}>
                                                                             {formatHierarchy(category).label}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      {(category.subCategories?.length > 0 || category.sub_categories?.length > 0 || category.childCategories?.length > 0) ? (
                                                                             <button 
                                                                                    onClick={() => drillDown(category)}
                                                                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1"
                                                                             >
                                                                                    <i className="fa-solid fa-list-tree"></i>
                                                                                    {category.subCategories?.length || category.sub_categories?.length || category.childCategories?.length} Children...
                                                                             </button>
                                                                      ) : (
                                                                             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Children</span>
                                                                      )}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex gap-2 justify-end">
                                                                             <button onClick={() => openModal(category)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors" title="Edit"><i className="fa-solid fa-pen-to-square"></i></button>
                                                                             <button onClick={() => deleteCategory(category.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 )) : (
                                                        <tr>
                                                               <td colSpan="5" className="px-6 py-20 text-center">
                                                                      <div className="flex flex-col items-center gap-3">
                                                                             <i className="fa-solid fa-folder-open text-gray-200 text-6xl"></i>
                                                                             <p className="text-gray-400 font-medium">No categories found at this level</p>
                                                                             <button onClick={() => goToLevel(-1)} className="text-xs font-bold text-black border-b border-black pb-0.5">Return to top</button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 )}
                                          </tbody>
                                   </table>
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                            <form onSubmit={submit} className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                                 <InputLabel value="Category Name" required />
                                                 <TextInput
                                                        className="mt-1 block w-full text-gray-900"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                        required
                                                 />
                                                 <InputError message={errors.name} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel value="Slug (Optional)" />
                                                 <TextInput
                                                        className="mt-1 block w-full text-gray-900"
                                                        value={data.slug}
                                                        onChange={e => setData('slug', e.target.value)}
                                                        placeholder="auto-generated from name"
                                                 />
                                                 <InputError message={errors.slug} className="mt-2" />
                                          </div>

                                          <div className="md:col-span-2 border-t pt-6 bg-gray-50/50 -mx-6 px-6 -mb-6 pb-6">
                                                 <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">SEO & Metadata</h3>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                               <InputLabel value="Meta Title" />
                                                               <TextInput
                                                                      className="mt-1 block w-full text-gray-900"
                                                                      value={data.meta_title}
                                                                      onChange={e => setData('meta_title', e.target.value)}
                                                               />
                                                        </div>
                                                        <div>
                                                               <InputLabel value="Meta Description" />
                                                               <textarea
                                                                      className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm text-gray-900"
                                                                      rows="2"
                                                                      value={data.meta_description}
                                                                      onChange={e => setData('meta_description', e.target.value)}
                                                               ></textarea>
                                                        </div>
                                                 </div>
                                          </div>

                                          <div className="md:col-span-2 mt-4">
                                                 <InputLabel value="Category Image" />
                                                 <input
                                                        type="file"
                                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer"
                                                        onChange={e => setData('image', e.target.files[0])}
                                                 />
                                                 <InputError message={errors.image} className="mt-2" />
                                          </div>
                                   </div>

                                   <div className="mt-12 flex justify-end gap-3">
                                          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                          <button 
                                                 type="submit" 
                                                 disabled={processing}
                                                 className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                                          >
                                                 {editingCategory ? 'Update Category' : 'Create Category'}
                                          </button>
                                   </div>
                            </form>
                     </Modal>
              </AdminLayout>
       );
}
