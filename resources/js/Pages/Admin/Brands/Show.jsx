import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ brand }) {
  const imageUrl = brand?.image
    ? `${window.location.origin}/${String(brand.image).replace(/^\/+/, '')}`
    : null;
  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout title="Brand Details">
      <Head title="Brand Details" />

      <div className="max-w-3xl text-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900">Brand Details</h1>
          <Link href={route('admin.brands.index')} className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Back
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm text-gray-900">
          <p className="text-gray-900"><span className="font-bold text-gray-900">ID:</span> <span className="text-gray-800">{brand.id}</span></p>
          <p className="text-gray-900"><span className="font-bold text-gray-900">Name:</span> <span className="text-gray-800">{brand.name}</span></p>
          <p className="text-gray-900"><span className="font-bold text-gray-900">Created At:</span> <span className="text-gray-800">{formatDate(brand.created_at)}</span></p>
          <p className="text-gray-900"><span className="font-bold text-gray-900">Updated At:</span> <span className="text-gray-800">{formatDate(brand.updated_at)}</span></p>
          <div>
            <span className="font-bold text-gray-900">Image:</span>
            <div className="mt-2">
              {imageUrl ? (
                <img src={imageUrl} alt={brand.name} className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
