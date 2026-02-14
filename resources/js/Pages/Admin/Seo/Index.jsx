import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ rows }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingRow, setEditingRow] = useState(null);

       const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
              id: '',
              slug: '',
              meta_title: '',
              meta_description: '',
              meta_keywords: '',
              schema_markup: '',
              canonical_url: '',
       });

       const openModal = (row = null) => {
              setEditingRow(row);
              if (row) {
                     setData({
                            id: row.id,
                            slug: row.slug,
                            meta_title: row.meta_title || '',
                            meta_description: row.meta_description || '',
                            meta_keywords: row.meta_keywords || '',
                            schema_markup: row.schema_markup || '',
                            canonical_url: row.canonical_url || '',
                     });
              } else {
                     reset();
              }
              setIsModalOpen(true);
       };

       const closeModal = () => {
              setIsModalOpen(false);
              setEditingRow(null);
              clearErrors();
              reset();
       };

       const submit = (e) => {
              e.preventDefault();
              post(route('admin.seo.store'), {
                     onSuccess: () => closeModal(),
              });
       };

       const deleteRow = (id) => {
              if (confirm('Are you sure you want to delete this SEO record?')) {
                     router.delete(route('admin.seo.destroy', id));
              }
       };

       return (
              <AdminLayout title="SEO Management">
                     <Head title="SEO Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                   <div>
                                          <h3 className="text-lg font-bold text-gray-800">SEO Records</h3>
                                          <p className="text-sm text-gray-500">Manage meta tags and SEO for dynamic pages.</p>
                                   </div>
                                   <PrimaryButton onClick={() => openModal()}>
                                          <i className="fa-solid fa-plus me-2"></i> Add Record
                                   </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Slug / Page</th>
                                                        <th className="px-6 py-4">Meta Title</th>
                                                        <th className="px-6 py-4">Description</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {rows.data.map((row) => (
                                                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-primary">{row.slug}</span>
                                                               </td>
                                                               <td className="px-6 py-4 text-sm font-medium">{row.meta_title}</td>
                                                               <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{row.meta_description}</td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <button
                                                                                    onClick={() => openModal(row)}
                                                                                    className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                                                                             >
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </button>
                                                                             <button
                                                                                    onClick={() => deleteRow(row.id)}
                                                                                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                                                                             >
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                             </button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>

                            <div className="p-6 border-top border-gray-100">
                                   <Pagination links={rows.links} />
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                            <form onSubmit={submit} className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-6">
                                          {editingRow ? 'Edit SEO Record' : 'Add SEO Record'}
                                   </h2>

                                   <div className="grid grid-cols-1 gap-4">
                                          <div>
                                                 <InputLabel htmlFor="slug" value="Slug / Page Path" />
                                                 <TextInput
                                                        id="slug"
                                                        className="mt-1 block w-full"
                                                        value={data.slug}
                                                        onChange={(e) => setData('slug', e.target.value)}
                                                        placeholder="/my-page-path"
                                                        required
                                                 />
                                                 <InputError message={errors.slug} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_title" value="Meta Title" />
                                                 <TextInput
                                                        id="meta_title"
                                                        className="mt-1 block w-full"
                                                        value={data.meta_title}
                                                        onChange={(e) => setData('meta_title', e.target.value)}
                                                 />
                                                 <InputError message={errors.meta_title} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_description" value="Meta Description" />
                                                 <textarea
                                                        id="meta_description"
                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        value={data.meta_description}
                                                        onChange={(e) => setData('meta_description', e.target.value)}
                                                        rows="3"
                                                 ></textarea>
                                                 <InputError message={errors.meta_description} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="meta_keywords" value="Meta Keywords" />
                                                 <TextInput
                                                        id="meta_keywords"
                                                        className="mt-1 block w-full"
                                                        value={data.meta_keywords}
                                                        onChange={(e) => setData('meta_keywords', e.target.value)}
                                                 />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="canonical_url" value="Canonical URL" />
                                                 <TextInput
                                                        id="canonical_url"
                                                        className="mt-1 block w-full"
                                                        value={data.canonical_url}
                                                        onChange={(e) => setData('canonical_url', e.target.value)}
                                                 />
                                                 <InputError message={errors.canonical_url} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="schema_markup" value="Schema Markup (JSON-LD)" />
                                                 <textarea
                                                        id="schema_markup"
                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-mono text-sm"
                                                        value={data.schema_markup}
                                                        onChange={(e) => setData('schema_markup', e.target.value)}
                                                        rows="5"
                                                 ></textarea>
                                          </div>
                                   </div>

                                   <div className="mt-8 flex justify-end gap-3">
                                          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                          <PrimaryButton disabled={processing}>
                                                 {editingRow ? 'Update' : 'Create'}
                                          </PrimaryButton>
                                   </div>
                            </form>
                     </Modal>
              </AdminLayout>
       );
}
