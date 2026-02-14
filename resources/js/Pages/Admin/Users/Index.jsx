import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ users, filters }) {
       const [isModalOpen, setIsModalOpen] = useState(false);
       const [editingUser, setEditingUser] = useState(null);
       const [search, setSearch] = useState(filters.search || '');

       const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
              name: '',
              email: '',
              password: '',
              phone: '',
              role: 'user',
       });

       const handleSearch = (e) => {
              e.preventDefault();
              router.get(route('admin.users.index'), { search }, { preserveState: true });
       };

       const openModal = (user = null) => {
              setEditingUser(user);
              if (user) {
                     setData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            phone: user.phone || '',
                            role: 'user', // Needs dynamic role fetching
                     });
              } else {
                     reset();
              }
              setIsModalOpen(true);
       };

       const closeModal = () => {
              setIsModalOpen(false);
              setEditingUser(null);
              clearErrors();
              reset();
       };

       const submit = (e) => {
              e.preventDefault();
              if (editingUser) {
                     put(route('admin.users.update', editingUser.id), {
                            onSuccess: () => closeModal(),
                     });
              } else {
                     post(route('admin.users.store'), {
                            onSuccess: () => closeModal(),
                     });
              }
       };

       const toggleStatus = (user) => {
              const newStatus = user.status === 'enable' ? 'disable' : 'enable';
              router.patch(route('admin.users.update-status', user.id), { status: newStatus });
       };

       const deleteUser = (user) => {
              if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                     router.delete(route('admin.users.destroy', user.id));
              }
       };

       return (
              <AdminLayout title="User Management">
                     <Head title="User Management" />

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                   <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
                                          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                          <input
                                                 type="text"
                                                 className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all"
                                                 placeholder="Search by name, email or phone..."
                                                 value={search}
                                                 onChange={(e) => setSearch(e.target.value)}
                                          />
                                   </form>
                                   <PrimaryButton onClick={() => openModal()}>
                                          <i className="fa-solid fa-plus me-2"></i> Add New User
                                   </PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                   <table className="w-full text-left border-collapse">
                                          <thead>
                                                 <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                        <th className="px-6 py-4">User Details</th>
                                                        <th className="px-6 py-4">Contact</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                 </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                                 {users.data.map((user) => (
                                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                               <td className="px-6 py-4">
                                                                      <div className="flex items-center gap-3">
                                                                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                                                    {user.name.charAt(0)}
                                                                             </div>
                                                                             <div>
                                                                                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                                                                    <p className="text-xs text-gray-500">ID: #{user.id}</p>
                                                                             </div>
                                                                      </div>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <p className="text-sm text-gray-800">{user.email}</p>
                                                                      <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                                                               </td>
                                                               <td className="px-6 py-4">
                                                                      <button
                                                                             onClick={() => toggleStatus(user)}
                                                                             className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${user.status === 'enable'
                                                                                           ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                                                           : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                                                                    }`}
                                                                      >
                                                                             {user.status === 'enable' ? 'Active' : 'Disabled'}
                                                                      </button>
                                                               </td>
                                                               <td className="px-6 py-4 text-right">
                                                                      <div className="flex items-center justify-end gap-2">
                                                                             <button
                                                                                    onClick={() => openModal(user)}
                                                                                    className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                                                                             >
                                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                             </button>
                                                                             <button
                                                                                    onClick={() => deleteUser(user)}
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
                                   <Pagination links={users.links} />
                            </div>
                     </div>

                     <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                            <form onSubmit={submit} className="p-6">
                                   <h2 className="text-lg font-bold text-gray-800 mb-6">
                                          {editingUser ? 'Edit User' : 'Add New User'}
                                   </h2>

                                   <div className="space-y-4">
                                          <div>
                                                 <InputLabel htmlFor="name" value="Full Name" />
                                                 <TextInput
                                                        id="name"
                                                        className="mt-1 block w-full"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        required
                                                 />
                                                 <InputError message={errors.name} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="email" value="Email Address" />
                                                 <TextInput
                                                        id="email"
                                                        type="email"
                                                        className="mt-1 block w-full"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        required
                                                 />
                                                 <InputError message={errors.email} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="phone" value="Phone Number" />
                                                 <TextInput
                                                        id="phone"
                                                        className="mt-1 block w-full"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                 />
                                                 <InputError message={errors.phone} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="password" value={editingUser ? 'New Password (Leave blank to keep current)' : 'Password'} />
                                                 <TextInput
                                                        id="password"
                                                        type="password"
                                                        className="mt-1 block w-full"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required={!editingUser}
                                                 />
                                                 <InputError message={errors.password} className="mt-2" />
                                          </div>

                                          <div>
                                                 <InputLabel htmlFor="role" value="User Role" />
                                                 <select
                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        value={data.role}
                                                        onChange={(e) => setData('role', e.target.value)}
                                                 >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                 </select>
                                                 <InputError message={errors.role} className="mt-2" />
                                          </div>
                                   </div>

                                   <div className="mt-8 flex justify-end gap-3">
                                          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                          <PrimaryButton disabled={processing}>
                                                 {editingUser ? 'Update User' : 'Create User'}
                                          </PrimaryButton>
                                   </div>
                            </form>
                     </Modal>
              </AdminLayout>
       );
}
