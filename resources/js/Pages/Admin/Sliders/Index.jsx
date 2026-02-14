import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ sliders }) {
       const deleteSlider = (id) => {
              if (confirm('Are you sure you want to delete this slider?')) {
                     router.delete(route('admin.sliders.destroy', id));
              }
       };

       return (
              <AdminLayout title="Slider Management">
                     <Head title="Slider Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                   <h3 className="font-bold text-gray-800">Home Hero Sliders</h3>
                                   <Link href={route('admin.sliders.create')} className="px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                                          Add New Slider
                                   </Link>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">Image</th>
                                                        <th className="px-6 py-4">Title / Category</th>
                                                        <th className="px-6 py-4">Description</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {sliders.map((slider) => (
                                                        <tr key={slider.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <img src={slider.image || '/images/placeholder.png'} className="w-20 h-10 rounded-lg object-cover" alt="" />
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm font-bold text-gray-800">{slider.title}</p>
                                                                      <p className="text-[10px] text-gray-400 capitalize">{slider.category?.name || 'General'}</p>
                                                               </td>
                                                               <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                                                                      {slider.description}
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <Link href={route('admin.sliders.edit', slider.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </Link>
                                                                             <button onClick={() => deleteSlider(slider.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors">
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
