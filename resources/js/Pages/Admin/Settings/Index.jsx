import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ settings }) {
       const [editing, setEditing] = useState(null);
       const { data, setData, post, reset, processing, errors } = useForm({
              title: '',
              key: '',
              description: '',
              image: null,
       });

       const editSetting = (setting) => {
              setEditing(setting.id);
              setData({
                     title: setting.title || '',
                     key: setting.key || '',
                     description: setting.description || '',
                     image: null
              });
       };

       const submit = (e) => {
              e.preventDefault();
              if (editing) {
                     post(route('admin.master-settings.update', editing), {
                            forceFormData: true,
                            onSuccess: () => { setEditing(null); reset(); }
                     });
              } else {
                     post(route('admin.master-settings.store'), {
                            onSuccess: () => reset()
                     });
              }
       };

       return (
              <AdminLayout title="General Settings">
                     <Head title="General Settings" />

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                          <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                                                 <h3 className="font-bold text-gray-800">Master Settings</h3>
                                          </div>
                                          <div className="overflow-x-auto">
                                                 <table className="w-full text-left border-collapse">
                                                        <thead>
                                                               <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                                      <th className="px-6 py-4">Title / Key</th>
                                                                      <th className="px-6 py-4">Value / Image</th>
                                                                      <th className="px-6 py-4 text-right">Actions</th>
                                                               </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                               {settings.map((item) => (
                                                                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                                             <td className="px-6 py-4">
                                                                                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                                                                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{item.key}</p>
                                                                             </td>
                                                                             <td className="px-6 py-4">
                                                                                    {item.image ? (
                                                                                           <img src={item.image} className="h-8 rounded border" alt="" />
                                                                                    ) : (
                                                                                           <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                                                                                    )}
                                                                             </td>
                                                                             <td className="px-6 py-4 text-right">
                                                                                    <button onClick={() => editSetting(item)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                                                           <i className="fa-solid fa-pen-to-square"></i>
                                                                                    </button>
                                                                             </td>
                                                                      </tr>
                                                               ))}
                                                        </tbody>
                                                 </table>
                                          </div>
                                   </div>
                            </div>

                            <div className="space-y-6">
                                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">{editing ? 'Edit Setting' : 'Create New Setting'}</h3>
                                          <form onSubmit={submit} className="space-y-4">
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                                                        <input
                                                               type="text"
                                                               className="w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm"
                                                               placeholder="Site Logo, Helpline..."
                                                               value={data.title}
                                                               onChange={e => setData('title', e.target.value)}
                                                        />
                                                        {errors.title && <p className="mt-1 text-[10px] text-rose-500">{errors.title}</p>}
                                                 </div>
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Key</label>
                                                        <input
                                                               type="text"
                                                               className="w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm font-mono"
                                                               placeholder="site_logo, phone_number..."
                                                               value={data.key}
                                                               onChange={e => setData('key', e.target.value)}
                                                        />
                                                        {errors.key && <p className="mt-1 text-[10px] text-rose-500">{errors.key}</p>}
                                                 </div>
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Value (Text)</label>
                                                        <textarea
                                                               className="w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm min-h-[80px]"
                                                               placeholder="Setting value or description..."
                                                               value={data.description}
                                                               onChange={e => setData('description', e.target.value)}
                                                        />
                                                        {errors.description && <p className="mt-1 text-[10px] text-rose-500">{errors.description}</p>}
                                                 </div>
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Upload File (Optional)</label>
                                                        <input
                                                               type="file"
                                                               className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                               onChange={e => setData('image', e.target.files[0])}
                                                        />
                                                        {errors.image && <p className="mt-1 text-[10px] text-rose-500">{errors.image}</p>}
                                                 </div>
                                                 <div className="pt-2 flex gap-3">
                                                        <button type="submit" disabled={processing} className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
                                                               {processing ? 'Saving...' : (editing ? 'Update Setting' : 'Create Setting')}
                                                        </button>
                                                        {editing && (
                                                               <button type="button" onClick={() => { setEditing(null); reset(); }} className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                                                                      Cancel
                                                               </button>
                                                        )}
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     </div>
              </AdminLayout>
       );
}
