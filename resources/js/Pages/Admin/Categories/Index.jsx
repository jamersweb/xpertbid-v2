import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ categories, filters }) {
       const [search, setSearch] = useState(filters.search || '');
       const [expanded, setExpanded] = useState({});

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.categories.index'), { search }, { preserveState: true });
       };

       const toggleExpand = (id) => {
              setExpanded((prev) => ({
                     ...prev,
                     [id]: !prev[id],
              }));
       };

       const assetUrl = (path) => {
              if (!path) return null;
              if (path.startsWith('http')) return path;
              return `${window.location.origin}/${path.replace(/^\/+/, '')}`;
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
              }
       };

       const renderCategoryRows = (cat, depth = 0) => {
              const styles = {
                     0: { bg: 'bg-white', badge: 'bg-sky-100 text-sky-700', label: 'Main' },
                     1: { bg: 'bg-emerald-50/5', badge: 'bg-emerald-100 text-emerald-700', label: 'Sub' },
                     2: { bg: 'bg-gray-50/20', badge: 'bg-indigo-100 text-indigo-700', label: 'Child' },
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
                                                        type="button"
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
                                          <Link href={route('admin.categories.edit', cat.id)} className="p-2 hover:bg-amber-50 rounded-xl text-amber-600 transition-colors" title="Edit">
                                                 <i className="fa-solid fa-pen-to-square"></i>
                                          </Link>
                                          <button onClick={() => deleteCategory(cat.id)} className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-colors" title="Delete">
                                                 <i className="fa-solid fa-trash"></i>
                                          </button>
                                   </div>
                            </td>
                     </tr>,
              ];

              if (isExpanded || search) {
                     children.forEach((child) => {
                            rows.push(...renderCategoryRows(child, depth + 1));
                     });
              }

              return rows;
       };

       return (
              <AdminLayout title="Product Categories">
                     <Head title="Product Categories" />

                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                   <h1 className="text-3xl font-black text-gray-900 tracking-tight">Category Management</h1>
                                   <p className="text-sm text-gray-500 font-medium">Browse categories and open a full-page editor for create/edit.</p>
                            </div>
                            <Link
                                   href={route('admin.categories.create')}
                                   className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                            >
                                   <i className="fa-solid fa-plus mr-2"></i> Add Main Category
                            </Link>
                     </div>

                     <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
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
                                                 {categories.length > 0 ? categories.map((cat) => renderCategoryRows(cat)) : (
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
              </AdminLayout>
       );
}
