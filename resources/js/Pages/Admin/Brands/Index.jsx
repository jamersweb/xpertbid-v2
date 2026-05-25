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

export default function Index({ brands, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    image: null,
  });

  const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${window.location.origin}/${path.replace(/^\/+/, '')}`;
  };

  const openModal = (brand = null) => {
    setEditingBrand(brand);
    if (brand) {
      setData({ name: brand.name || '', image: null });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    reset();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.brands.index'), { search }, { preserveState: true, replace: true });
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingBrand) {
      router.post(route('admin.brands.update', editingBrand.id), { ...data, _method: 'PUT' }, {
        onSuccess: closeModal,
      });
    } else {
      post(route('admin.brands.store'), { onSuccess: closeModal });
    }
  };

  const deleteBrand = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This brand will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.delete(route('admin.brands.destroy', id));
    }
  };

  return (
    <AdminLayout title="Brands">
      <Head title="Brands" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Brand Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage product brands with logo/image.</p>
        </div>
        <PrimaryButton onClick={() => openModal()}>
          <i className="fa-solid fa-plus mr-2"></i> Add Brand
        </PrimaryButton>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/10">
          <form onSubmit={handleSearch} className="max-w-xl flex gap-3">
            <div className="relative flex-1 group">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900"
                placeholder="Search brand name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Created At</th>
                <th className="px-6 py-5">Updated At</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands?.data?.length ? brands.data.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-100/70 hover:bg-gray-50/40">
                  <td className="px-6 py-4 font-semibold text-gray-700">#{brand.id}</td>
                  <td className="px-6 py-4">
                    {brand.image ? (
                      <img src={assetUrl(brand.image)} alt={brand.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <i className="fa-solid fa-image"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{brand.created_at ? new Date(brand.created_at).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{brand.updated_at ? new Date(brand.updated_at).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <a href={route('admin.brands.show', brand.id)} className="p-2 hover:bg-sky-50 rounded-xl text-sky-600" title="View">
                        <i className="fa-solid fa-eye"></i>
                      </a>
                      <button onClick={() => openModal(brand)} className="p-2 hover:bg-amber-50 rounded-xl text-amber-600" title="Edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => deleteBrand(brand.id)} className="p-2 hover:bg-rose-50 rounded-xl text-rose-600" title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-gray-400">No brands found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
        <form onSubmit={submit} className="p-6 space-y-5">
          <h2 className="text-xl font-black text-gray-900">{editingBrand ? 'Edit Brand' : 'Create Brand'}</h2>

          <div>
            <InputLabel value="Brand Name" required className="mb-2" />
            <TextInput
              className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-black focus:ring-black/10"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Enter brand name"
              required
            />
            <InputError message={errors.name} className="mt-2" />
          </div>

          <div>
            <InputLabel value="Brand Image" className="mb-2" />
            {editingBrand?.image && (
              <img src={assetUrl(editingBrand.image)} alt={editingBrand.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200 mb-3" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setData('image', e.target.files[0])}
              className="block w-full border border-gray-300 rounded-xl p-2 bg-white text-gray-900 file:text-gray-900"
            />
            <InputError message={errors.image} className="mt-2" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
            <PrimaryButton disabled={processing}>{editingBrand ? 'Update' : 'Create'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
