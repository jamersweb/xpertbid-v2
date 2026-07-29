import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';

export default function Index({ malls, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMall, setEditingMall] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    logo: null,
    status: 'active',
  });

  const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${window.location.origin}/${path.replace(/^\/+/, '')}`;
  };

  const openModal = (mall = null) => {
    setEditingMall(mall);
    if (mall) {
      setData({
        name: mall.name || '',
        logo: null,
        status: mall.status || 'active',
      });
    } else {
      reset();
      setData({ name: '', logo: null, status: 'active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMall(null);
    reset();
  };

  const applyFilters = (e) => {
    e?.preventDefault?.();
    router.get(
      route('admin.malls.index'),
      {
        search: search || undefined,
        status: statusFilter || undefined,
      },
      { preserveState: true, replace: true }
    );
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingMall) {
      router.post(
        route('admin.malls.update', editingMall.id),
        { ...data, _method: 'PUT' },
        { forceFormData: true, onSuccess: closeModal }
      );
    } else {
      post(route('admin.malls.store'), {
        forceFormData: true,
        onSuccess: closeModal,
      });
    }
  };

  const deleteMall = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This mall will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.delete(route('admin.malls.destroy', id));
    }
  };

  return (
    <AdminLayout title="Malls">
      <Head title="Malls" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mall Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage malls for corporate seller accounts.</p>
        </div>
        <PrimaryButton onClick={() => openModal()}>
          <i className="fa-solid fa-plus mr-2"></i> Add Mall
        </PrimaryButton>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/10">
          <form onSubmit={applyFilters} className="flex flex-col md:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1 group">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900"
                placeholder="Search name or slug"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit" className="px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800">
              Filter
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Logo</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Slug</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Created At</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {malls?.data?.length ? malls.data.map((mall) => (
                <tr key={mall.id} className="border-b border-gray-100/70 hover:bg-gray-50/40">
                  <td className="px-6 py-4 font-semibold text-gray-700">#{mall.id}</td>
                  <td className="px-6 py-4">
                    {mall.logo ? (
                      <img src={assetUrl(mall.logo)} alt={mall.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <i className="fa-solid fa-store"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{mall.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{mall.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        mall.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {mall.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mall.created_at ? new Date(mall.created_at).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openModal(mall)} className="p-2 hover:bg-amber-50 rounded-xl text-amber-600" title="Edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => deleteMall(mall.id)} className="p-2 hover:bg-rose-50 rounded-xl text-rose-600" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-gray-400">No malls found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {malls?.links?.length > 3 && (
          <div className="p-6 border-t border-gray-100 flex flex-wrap gap-2 justify-center">
            {malls.links.map((link, i) => (
              <button
                key={i}
                type="button"
                disabled={!link.url}
                onClick={() => link.url && router.get(link.url)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                  link.active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
        <form onSubmit={submit} className="p-6 space-y-5">
          <h2 className="text-xl font-black text-gray-900">{editingMall ? 'Edit Mall' : 'Create Mall'}</h2>

          <div>
            <InputLabel value="Mall Name" required className="mb-2" />
            <TextInput
              className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-black focus:ring-black/10"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Enter mall name"
              required
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          {editingMall?.slug && (
            <div>
              <InputLabel value="Slug" className="mb-2" />
              <TextInput
                className="w-full bg-gray-50 text-gray-500 border-gray-200"
                value={editingMall.slug}
                disabled
              />
              <p className="mt-1 text-xs text-gray-400">Slug is set on create and cannot be changed.</p>
            </div>
          )}

          <div>
            <InputLabel value="Status" required className="mb-2" />
            <select
              className="w-full rounded-xl border-gray-300 bg-white text-gray-900 focus:border-black focus:ring-black/10"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <InputError message={errors.status} className="mt-2" />
          </div>

          <div>
            <InputLabel value="Logo" className="mb-2" />
            {editingMall?.logo && (
              <img src={assetUrl(editingMall.logo)} alt={editingMall.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 mb-3" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
              onChange={(e) => setData('logo', e.target.files[0])}
              className="block w-full border border-gray-300 rounded-xl p-2 bg-white text-gray-900 file:text-gray-900"
            />
            <InputError message={errors.logo} className="mt-2" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
            <PrimaryButton disabled={processing}>{editingMall ? 'Update' : 'Create'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
