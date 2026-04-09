import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function Index({ rows }) {
       const deleteRow = async (id) => {
              const result = await Swal.fire({
                     title: 'Are you sure?',
                     text: 'This SEO record will be deleted permanently.',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#000000',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'Yes, delete it',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.delete(route('admin.seo.destroy', id));
              };
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
                                   <Link href={route('admin.seo.create')}>
                                          <PrimaryButton>
                                                 <i className="fa-solid fa-plus me-2"></i> Add Record
                                          </PrimaryButton>
                                   </Link>
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
                                                               <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.meta_title}</td>
                                                               <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{row.meta_description}</td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <button
                                                                                    onClick={() => router.visit(route('admin.seo.edit', row.id))}
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
              </AdminLayout>
       );
}
