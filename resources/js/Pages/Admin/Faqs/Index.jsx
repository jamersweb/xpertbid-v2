import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ faqs }) {
       const deleteFaq = async (id) => {
              const result = await Swal.fire({
                     title: 'Are you sure?',
                     text: 'This FAQ will be deleted permanently.',
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#000000',
                     cancelButtonColor: '#d1d5db',
                     confirmButtonText: 'Yes, delete it',
                     cancelButtonText: 'Cancel',
              });

              if (result.isConfirmed) {
                     router.delete(route('admin.faqs.destroy', id));
              };
       };

       return (
              <AdminLayout title="FAQ Management">
                     <Head title="FAQ Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                   <h3 className="font-bold text-gray-800">Frequently Asked Questions</h3>
                                   <Link href={route('admin.faqs.create')} className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                                          Add New FAQ
                                   </Link>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Question</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {faqs.map((faq) => (
                                                        <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{faq.question_text}</p>
                                                                      <p className="text-[10px] text-gray-400 line-clamp-1">{faq.answer_text?.substring(0, 100)}...</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${faq.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                             {faq.status}
                                                                      </span>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <Link href={route('admin.faqs.edit', faq.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </Link>
                                                                             <button onClick={() => deleteFaq(faq.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors">
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                             </button>
                                                                      </div>
                                                               </td>
                                                        </tr>
                                                 ))}
                                          </tbody>
                                   </table>
                            </div>
                     </div>
              </AdminLayout>
       );
}
