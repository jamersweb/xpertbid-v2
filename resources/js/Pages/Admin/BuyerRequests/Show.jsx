import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Price from '@/Components/Price';

const statusColors = {
    open: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
    fulfilled: 'bg-sky-100 text-sky-700',
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    withdrawn: 'bg-slate-100 text-slate-600',
};

function stripHtml(html = '') {
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function imageSrc(img) {
    if (!img) return '';
    if (img.url) return img.url;
    if (img.path) return `/${String(img.path).replace(/^\/+/, '')}`;
    return '';
}

export default function Show({ buyerRequest }) {
    const offers = buyerRequest.offers || [];
    const images = buyerRequest.images || [];
    const categoryLine = [
        buyerRequest.category?.name,
        buyerRequest.sub_category?.name || buyerRequest.subCategory?.name,
        buyerRequest.child_category?.name || buyerRequest.childCategory?.name,
    ]
        .filter(Boolean)
        .join(' › ') || '—';

    const closeRequest = () => {
        if (!window.confirm('Close this buyer request? Sellers will no longer be able to offer.')) return;
        router.post(route('admin.buyer-requests.close', buyerRequest.id));
    };

    const deleteRequest = () => {
        if (!window.confirm('Delete this buyer request? This soft-deletes the record.')) return;
        router.delete(route('admin.buyer-requests.destroy', buyerRequest.id));
    };

    return (
        <AdminLayout title={`Request #${buyerRequest.id}`}>
            <Head title={buyerRequest.title || `Request #${buyerRequest.id}`} />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={route('admin.buyer-requests.index')}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
                >
                    <i className="fa-solid fa-arrow-left mr-2"></i> Back to Buyer Requests
                </Link>
                <div className="flex flex-wrap gap-2">
                    <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            statusColors[buyerRequest.status] || 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {buyerRequest.status}
                    </span>
                    {buyerRequest.status === 'open' && (
                        <button
                            type="button"
                            onClick={closeRequest}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                        >
                            <i className="fa-solid fa-lock"></i> Close
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={deleteRequest}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                    >
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-bottom border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Request #{buyerRequest.id}</p>
                            <h1 className="mt-1 text-xl font-bold text-gray-900">{buyerRequest.title}</h1>
                            <p className="mt-2 text-sm text-gray-500">{categoryLine}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {stripHtml(buyerRequest.description) || 'No description provided.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget</p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        {buyerRequest.budget != null && Number(buyerRequest.budget) > 0 ? (
                                            <Price amountPKR={buyerRequest.budget} />
                                        ) : (
                                            '—'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</p>
                                    <p className="mt-1 text-sm text-gray-700">
                                        {buyerRequest.location_label
                                            || [buyerRequest.city, buyerRequest.state, buyerRequest.country].filter(Boolean).join(', ')
                                            || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-bottom border-gray-100 font-bold text-gray-800">Images</div>
                            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {images.map((img) => (
                                    <a
                                        key={img.id}
                                        href={imageSrc(img)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                                    >
                                        <img src={imageSrc(img)} alt="" className="h-full w-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-gray-800">Offers</span>
                            <span className="text-xs font-semibold text-gray-500">{offers.length} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-3">Seller</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Message</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Chat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {offers.map((offer) => (
                                        <tr key={offer.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-800">{offer.seller?.name || '—'}</p>
                                                <p className="text-[10px] text-gray-500">{offer.seller?.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Price amountPKR={offer.price} className="text-sm font-bold text-gray-800" />
                                            </td>
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-sm text-gray-600 line-clamp-2">{offer.message || '—'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        statusColors[offer.status] || 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {offer.conversation_id ? (
                                                    <Link
                                                        href={`${route('admin.chat.index')}?conversation_id=${offer.conversation_id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-50"
                                                    >
                                                        <i className="fa-solid fa-comments"></i> Open
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {offers.length === 0 && (
                            <div className="p-10 text-center text-gray-400 text-sm">No offers yet</div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Buyer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                {buyerRequest.user?.name?.charAt(0) || '?'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{buyerRequest.user?.name || '—'}</p>
                                <p className="text-[10px] text-gray-500 truncate">{buyerRequest.user?.email}</p>
                            </div>
                        </div>
                        {buyerRequest.user?.id && (
                            <Link
                                href={route('admin.users.show', buyerRequest.user.id)}
                                className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                            >
                                View user profile
                            </Link>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Meta</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium">Created</span>
                                <span className="text-xs font-bold text-gray-800">
                                    {buyerRequest.created_at
                                        ? new Date(buyerRequest.created_at).toLocaleString()
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium">Updated</span>
                                <span className="text-xs font-bold text-gray-800">
                                    {buyerRequest.updated_at
                                        ? new Date(buyerRequest.updated_at).toLocaleString()
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium">Closed at</span>
                                <span className="text-xs font-bold text-gray-800">
                                    {buyerRequest.closed_at
                                        ? new Date(buyerRequest.closed_at).toLocaleString()
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium">Offers</span>
                                <span className="text-xs font-bold text-gray-800">
                                    {buyerRequest.offers_count ?? offers.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {(buyerRequest.accepted_offer || buyerRequest.acceptedOffer) && (
                        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6">
                            <h3 className="text-sm font-bold text-sky-800 mb-4 uppercase tracking-wider">Accepted Offer</h3>
                            <p className="text-sm font-bold text-gray-800">
                                {(buyerRequest.accepted_offer || buyerRequest.acceptedOffer).seller?.name || 'Seller'}
                            </p>
                            <p className="mt-1 text-lg font-bold text-gray-900">
                                <Price amountPKR={(buyerRequest.accepted_offer || buyerRequest.acceptedOffer).price} />
                            </p>
                            {(buyerRequest.accepted_offer || buyerRequest.acceptedOffer).message && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {(buyerRequest.accepted_offer || buyerRequest.acceptedOffer).message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
