import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ categories }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingCategory, setEditingCategory] = useState(null);

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
                     // For file uploads in Inertia with PUT, we often use POST with _method spoofing
                     router.post(route('admin.auction_categories.update', editingCategory.id), {
                            ...data,
                            _method: 'PUT'
                     }, {
                            onSuccess: () => closeModal(),
                     });
              } else {
                     post(route('admin.auction_categories.store'), {
                            onSuccess: () => closeModal(),
                     });
              }
       };

       const closeModal = () => {
              setIsModalOpen(false);
              setEditingCategory(null);
              reset();
       };

       const deleteCategory = (id) => {
              if (confirm('Are you sure you want to delete this category?')) {
                     router.delete(route('admin.auction_categories.destroy', id));
              }
       };

       return (
              <AdminLayout title="Auction Categories">
                     <Head title="Auction Categories" />

                     <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
                            <PrimaryButton onClick={() => openModal()}>
                                   <i className="fa-solid fa-plus mr-2"></i> Add Category
                            </PrimaryButton>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4 w-16">Image</th>
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Hierarchy</th>
                                                        <th className="px-6 py-4">Stats</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {categories.map((category) => (
                                                        <React.Fragment key={category.id}>
                                                               <tr className="bg-gray-50/30">
                                                                      <td className="px-6 py-4">
                                                                             <img src={category.image || '/images/placeholder.png'} className="w-10 h-10 rounded-lg object-cover border border-gray-200" alt="" />
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="text-sm font-bold text-gray-800">{category.name}</span>
                                                                             <p className="text-[10px] text-gray-400">/{category.slug}</p>
                                                                      </td>
                                                                      <td className="px-6 py-4">
                                                                             <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Main Category</span>
                                                                      </td>
                                                                      <td className="px-6 py-4 text-xs text-gray-500">
                                                                             {category.sub_categories?.length || 0} Sub-categories
                                                                      </td>
                                                                      <td className="px-6 py-4 text-right">
                                                                             <div className="flex gap-2 justify-end">
                                                                                    <button onClick={() => openModal(category)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                    <button onClick={() => deleteCategory(category.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"><i className="fa-solid fa-trash"></i></button>
                                                                             </div>
                                                                      </td>
                                                               </tr>
                                                               {category.sub_categories?.map(sub => (
                                                                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                                                             <td className="px-6 py-4 pl-10">
                                                                                    <img src={sub.image || '/images/placeholder.png'} className="w-8 h-8 rounded-lg object-cover border border-gray-200" alt="" />
                                                                             </td>
                                                                             <td className="px-6 py-4">
                                                                                    <span className="text-sm font-semibold text-gray-700">{sub.name}</span>
                                                                                    <p className="text-[10px] text-gray-400">/{sub.slug}</p>
                                                                             </td>
                                                                             <td className="px-6 py-4">
                                                                                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase">Sub-category</span>
                                                                             </td>
                                                                             <td className="px-6 py-4 text-xs text-gray-500">
                                                                                    {sub.child_categories?.length || 0} Children
                                                                             </td>
                                                                             <td className="px-6 py-4 text-right">
                                                                                    <div className="flex gap-2 justify-end">
                                                                                           <button onClick={() => openModal(sub)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                                                                                           <button onClick={() => deleteCategory(sub.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"><i className="fa-solid fa-trash"></i></button>
                                                                                    </div>
                                                                             </td>
                                                                      </tr>
                                                               ))}
                                                        </React.Fragment>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                            <form onSubmit={submit} className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-6">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                                 <InputLabel value="Category Name" required />
                                                 <TextInput
                                                        className="mt-1 block w-full"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                        required
                                                 />
                                                 <InputError message={errors.name} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel value="Slug (Optional)" />
                                                 <TextInput
                                                        className="mt-1 block w-full"
                                                        value={data.slug}
                                                        onChange={e => setData('slug', e.target.value)}
                                                        placeholder="auto-generated from name"
                                                 />
                                                 <InputError message={errors.slug} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel value="Parent Category" />
                                                 <select
                                                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm"
                                                        value={data.parent_id}
                                                        onChange={e => setData('parent_id', e.target.value)}
                                                 >
                                                        <option value="">Root Category</option>
                                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                 </select>
                                          </div>

                                          <div>
                                                 <InputLabel value="Sub Category" />
                                                 <select
                                                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm"
                                                        value={data.sub_category_id}
                                                        onChange={e => setData('sub_category_id', e.target.value)}
                                                 >
                                                        <option value="">None (Is a Sub-category)</option>
                                                        {categories.find(c => c.id == data.parent_id)?.sub_categories?.map(sc => (
                                                               <option key={sc.id} value={sc.id}>{sc.name}</option>
                                                        ))}
                                                 </select>
                                          </div>

                                          <div className="md:col-span-2">
                                                 <InputLabel value="Category Image" />
                                                 <input
                                                        type="file"
                                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition-all"
                                                        onChange={e => setData('image', e.target.files[0])}
                                                 />
                                                 <InputError message={errors.image} className="mt-2" />
                                          </div>

                                          <div className="md:col-span-2 border-t pt-6">
                                                 <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">SEO Settings</h3>
                                                 <div className="space-y-4">
                                                        <div>
                                                               <InputLabel value="Meta Title" />
                                                               <TextInput
                                                                      className="mt-1 block w-full"
                                                                      value={data.meta_title}
                                                                      onChange={e => setData('meta_title', e.target.value)}
                                                               />
                                                        </div>
                                                        <div>
                                                               <InputLabel value="Meta Description" />
                                                               <textarea
                                                                      className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm"
                                                                      rows="2"
                                                                      value={data.meta_description}
                                                                      onChange={e => setData('meta_description', e.target.value)}
                                                               ></textarea>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="mt-8 flex justify-end gap-3">
                                          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                          <PrimaryButton disabled={processing}>{editingCategory ? 'Update Category' : 'Create Category'}</PrimaryButton>
                                   </div>
                            </form>
                     </Modal>
              </AdminLayout>
       );
}
