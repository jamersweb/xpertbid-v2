import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ roles, permissions }) {
       const [editing, setEditing] = useState(null);
       const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
              name: '',
              permissions: []
       });

       const handleEdit = (role) => {
              setEditing(role.id);
              setData({
                     name: role.name,
                     permissions: role.permissions.map(p => p.name)
              });
       };

       const togglePermission = (permName) => {
              const newPerms = data.permissions.includes(permName)
                     ? data.permissions.filter(p => p !== permName)
                     : [...data.permissions, permName];
              setData('permissions', newPerms);
       };

       const submit = (e) => {
              e.preventDefault();
              if (editing) {
                     put(route('admin.roles.update', editing), {
                            onSuccess: () => { setEditing(null); reset(); }
                     });
              } else {
                     post(route('admin.roles.store'), {
                            onSuccess: () => reset()
                     });
              }
       };

       return (
              <AdminLayout title="Roles & Permissions">
                     <Head title="Roles" />

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {roles.map(role => (
                                                 <div key={role.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                                        <div className="flex items-center justify-between mb-4">
                                                               <h3 className="font-bold text-gray-800">{role.name}</h3>
                                                               <div className="flex gap-2">
                                                                      <button onClick={() => handleEdit(role)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 group-hover:text-black">
                                                                             <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                                      </button>
                                                                      {role.name !== 'Admin' && (
                                                                             <button onClick={() => confirm('Delete role?') && destroy(route('admin.roles.destroy', role.id))} className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500">
                                                                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                                                             </button>
                                                                      )}
                                                               </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                               {role.permissions.slice(0, 5).map(p => (
                                                                      <span key={p.id} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md">
                                                                             {p.name}
                                                                      </span>
                                                               ))}
                                                               {role.permissions.length > 5 && (
                                                                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-md">
                                                                             +{role.permissions.length - 5} more
                                                                      </span>
                                                               )}
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            </div>

                            <div>
                                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
                                          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">{editing ? 'Edit Role' : 'Create New Role'}</h3>
                                          <form onSubmit={submit} className="space-y-6">
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Role Name</label>
                                                        <input
                                                               type="text"
                                                               className="w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm"
                                                               placeholder="Editor, Manager..."
                                                               value={data.name}
                                                               onChange={e => setData('name', e.target.value)}
                                                        />
                                                 </div>
                                                 <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-4">Permissions</label>
                                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                               {permissions.map(perm => (
                                                                      <label key={perm.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                                             <input
                                                                                    type="checkbox"
                                                                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                                                    checked={data.permissions.includes(perm.name)}
                                                                                    onChange={() => togglePermission(perm.name)}
                                                                             />
                                                                             <span className="text-xs font-semibold text-gray-700">{perm.name}</span>
                                                                      </label>
                                                               ))}
                                                        </div>
                                                 </div>
                                                 <div className="pt-2 flex gap-3">
                                                        <button type="submit" disabled={processing} className="flex-1 py-4 bg-black text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                                                               {editing ? 'Update Role' : 'Create Role'}
                                                        </button>
                                                        {editing && (
                                                               <button type="button" onClick={() => { setEditing(null); reset(); }} className="px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-200">
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
