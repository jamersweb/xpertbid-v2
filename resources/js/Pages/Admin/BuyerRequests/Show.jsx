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

function getPhone(user) {
    if (!user) return null;
    return (
        user.resolved_phone ||
        user.phone ||
        user.individual_verification?.contact_number ||
        user.individualVerification?.contact_number ||
        null
    );
}

function getPhoneSource(user) {
    if (!user) return null;
    if (user.phone_source) return user.phone_source;
    if (user.phone) return 'user';
    if (user.individual_verification?.contact_number || user.individualVerification?.contact_number) {
        return 'individual_verification';
    }
    return null;
}

function getLocation(user, fallback = null) {
    if (!user) return fallback || null;
    if (user.resolved_location) return user.resolved_location;
    const corp = user.corporate_verification || user.corporateVerification;
    if (corp?.registered_address) {
        const c = corp.country;
        return c && !corp.registered_address.toLowerCase().includes(c.toLowerCase())
            ? `${corp.registered_address}, ${c}`
            : corp.registered_address;
    }
    const ind = user.individual_verification || user.individualVerification;
    if (ind?.residential_address) {
        const c = ind.country;
        return c && !ind.residential_address.toLowerCase().includes(c.toLowerCase())
            ? `${ind.residential_address}, ${c}`
            : ind.residential_address;
    }
    if (user.address) return user.address;
    const sa = user.shipping_address || user.shippingAddress;
    if (sa) {
        const parts = [sa.addressLine1, sa.city, sa.state, sa.country].filter(Boolean);
        if (parts.length > 0) return parts.join(', ');
    }
    const general = [user.city, user.country?.name || (typeof user.country === 'string' ? user.country : null)].filter(Boolean).join(', ');
    if (general) return general;
    return fallback || null;
}

export default function Show({ buyerRequest }) {
    const offers = buyerRequest.offers || [];
    const images = buyerRequest.images || [];
    const acceptedOffer =
        buyerRequest.accepted_offer ||
        buyerRequest.acceptedOffer ||
        offers.find((o) => o.status === 'accepted') ||
        null;
    const winnerSeller = acceptedOffer?.seller || null;
    const buyer = buyerRequest.user || null;

    const buyerPhone = getPhone(buyer);
    const buyerPhoneSource = getPhoneSource(buyer);
    const buyerLocation = getLocation(buyer);
    const requestLocation =
        buyerRequest.location_label ||
        [buyerRequest.city, buyerRequest.state, buyerRequest.country].filter(Boolean).join(', ') ||
        null;

    const winnerPhone = getPhone(winnerSeller);
    const winnerPhoneSource = getPhoneSource(winnerSeller);
    const winnerLocation = getLocation(winnerSeller);

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
                <div className="flex flex-wrap items-center gap-2">
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
                                        {requestLocation || '—'}
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
                                    {offers.map((offer) => {
                                        const isAccepted = offer.status === 'accepted';
                                        const sellerPhone = getPhone(offer.seller);
                                        const sellerPhoneSource = getPhoneSource(offer.seller);
                                        const sellerLoc = getLocation(offer.seller);

                                        return (
                                            <tr key={offer.id} className={`hover:bg-gray-50/50 ${isAccepted ? 'bg-emerald-50/40' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-sm font-medium text-gray-900">{offer.seller?.name || '—'}</p>
                                                            {isAccepted && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                    Winner
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-gray-500">{offer.seller?.email || '—'}</p>
                                                        {sellerPhone && (
                                                            <p className="text-[11px] text-gray-700 flex items-center gap-1 mt-0.5">
                                                                <i className="fa-solid fa-phone text-[9px] text-emerald-600"></i>
                                                                <span>{sellerPhone}</span>
                                                                {sellerPhoneSource === 'individual_verification' && (
                                                                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">KYC</span>
                                                                )}
                                                            </p>
                                                        )}
                                                        {sellerLoc && (
                                                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 truncate max-w-[220px]" title={sellerLoc}>
                                                                <i className="fa-solid fa-location-dot text-[9px] text-rose-500"></i>
                                                                <span>{sellerLoc}</span>
                                                            </p>
                                                        )}
                                                    </div>
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {offers.length === 0 && (
                            <div className="p-10 text-center text-gray-400 text-sm">No offers yet</div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Buyer Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <i className="fa-solid fa-user text-gray-400"></i> Buyer Details
                            </h3>
                            {buyer?.id && (
                                <span className="text-[11px] font-mono text-gray-400">ID #{buyer.id}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {buyer?.profile_pic ? (
                                <img src={buyer.profile_pic} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                    {buyer?.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 truncate">{buyer?.name || '—'}</p>
                                <p className="text-xs text-gray-500 truncate">{buyer?.email || 'No email'}</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                            <div className="flex items-start gap-2.5">
                                <i className="fa-regular fa-envelope text-gray-400 mt-0.5 w-4 text-center"></i>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Email</span>
                                    {buyer?.email ? (
                                        <a href={`mailto:${buyer.email}`} className="text-gray-900 font-medium hover:text-sky-600 break-all">
                                            {buyer.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic">Not provided</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-phone text-emerald-600 mt-0.5 w-4 text-center"></i>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Phone Number</span>
                                        {buyerPhoneSource === 'individual_verification' && (
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Retrieved from individual verification">
                                                KYC Verified
                                            </span>
                                        )}
                                    </div>
                                    {buyerPhone ? (
                                        <a href={`tel:${buyerPhone}`} className="text-gray-900 font-bold hover:text-emerald-700">
                                            {buyerPhone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic">Not found (checked users & individual table)</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <i className="fa-solid fa-location-dot text-rose-500 mt-0.5 w-4 text-center"></i>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                                    {requestLocation || buyerLocation ? (
                                        <div className="space-y-0.5">
                                            {requestLocation && (
                                                <p className="text-gray-800 font-medium leading-snug">{requestLocation}</p>
                                            )}
                                            {buyerLocation && buyerLocation !== requestLocation && (
                                                <p className="text-[11px] text-gray-500 leading-snug" title="Profile / KYC address">
                                                    <span className="font-semibold text-gray-600">Address:</span> {buyerLocation}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">No location provided</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {buyer?.id && (
                            <Link
                                href={route('admin.users.show', buyer.id)}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                <i className="fa-regular fa-user"></i> View Buyer Profile
                            </Link>
                        )}
                    </div>

                    {/* Winner Seller / Accepted Offer Card */}
                    {acceptedOffer ? (
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-500/20 p-6 space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none opacity-60"></div>
                            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-gray-100">
                                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-trophy text-amber-500"></i> Winner Seller
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Accepted Offer
                                </span>
                            </div>

                            <div className="relative z-10 bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/80 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Accepted Price</p>
                                    <Price amountPKR={acceptedOffer.price} className="text-lg font-black text-emerald-900" />
                                </div>
                                {acceptedOffer.conversation_id && (
                                    <Link
                                        href={`${route('admin.chat.index')}?conversation_id=${acceptedOffer.conversation_id}`}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
                                    >
                                        <i className="fa-solid fa-comments"></i> Chat
                                    </Link>
                                )}
                            </div>

                            <div className="relative z-10 flex items-center gap-3">
                                {winnerSeller?.profile_pic ? (
                                    <img src={winnerSeller.profile_pic} alt="" className="w-12 h-12 rounded-full object-cover border border-emerald-200" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                        {winnerSeller?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-bold text-gray-900 truncate">{winnerSeller?.name || '—'}</p>
                                        {(winnerSeller?.corporate_verification?.status === 'verified' || winnerSeller?.corporateVerification?.status === 'verified') && (
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200" title="Corporate Verified">
                                                Corporate
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{winnerSeller?.email || 'No email'}</p>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-2.5 pt-2 border-t border-gray-100 text-xs">
                                <div className="flex items-start gap-2.5">
                                    <i className="fa-regular fa-envelope text-gray-400 mt-0.5 w-4 text-center"></i>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Email</span>
                                        {winnerSeller?.email ? (
                                            <a href={`mailto:${winnerSeller.email}`} className="text-gray-900 font-medium hover:text-sky-600 break-all">
                                                {winnerSeller.email}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">Not provided</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <i className="fa-solid fa-phone text-emerald-600 mt-0.5 w-4 text-center"></i>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Phone Number</span>
                                            {winnerPhoneSource === 'individual_verification' && (
                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Retrieved from individual verification">
                                                    KYC Verified
                                                </span>
                                            )}
                                        </div>
                                        {winnerPhone ? (
                                            <a href={`tel:${winnerPhone}`} className="text-gray-900 font-bold hover:text-emerald-700">
                                                {winnerPhone}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">Not found (checked users & individual table)</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <i className="fa-solid fa-location-dot text-rose-500 mt-0.5 w-4 text-center"></i>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                                        {winnerLocation ? (
                                            <p className="text-gray-800 font-medium leading-snug">{winnerLocation}</p>
                                        ) : (
                                            <span className="text-gray-400 italic">No location available</span>
                                        )}
                                    </div>
                                </div>

                                {acceptedOffer.message && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Offer Message</span>
                                        <p className="text-xs text-gray-700 bg-gray-50 rounded-lg p-2.5 whitespace-pre-wrap border border-gray-100">
                                            {acceptedOffer.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="relative z-10 flex gap-2 pt-1">
                                {winnerSeller?.id && (
                                    <Link
                                        href={route('admin.users.show', winnerSeller.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <i className="fa-regular fa-user"></i> View Profile
                                    </Link>
                                )}
                                {acceptedOffer.conversation_id && (
                                    <Link
                                        href={`${route('admin.chat.index')}?conversation_id=${acceptedOffer.conversation_id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
                                    >
                                        <i className="fa-solid fa-comments"></i> Open Chat
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-6 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-base">
                                <i className="fa-solid fa-trophy"></i>
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">No Winner Seller Yet</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {offers.length > 0
                                    ? `${offers.length} offer(s) submitted. Winner seller details will appear here once an offer is accepted.`
                                    : 'No offers placed yet on this buyer request.'}
                            </p>
                        </div>
                    )}

                    {/* Meta Card */}
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
                </div>
            </div>
        </AdminLayout>
    );
}
