import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    HiOutlineArrowLeft,
    HiOutlineCalendar,
    HiOutlineCash,
    HiOutlineChatAlt2,
    HiOutlineCheckCircle,
    HiOutlineClipboardList,
    HiOutlineLocationMarker,
    HiOutlinePhotograph,
    HiOutlineX,
} from 'react-icons/hi';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import useTranslate from '@/hooks/useTranslate';
import useCurrencyList from '@/Utils/useCurrencyList';
import { alertAction, confirmAction } from '@/Utils/confirmAction';
import { convertPKRTo, convertToPKR, getSelectedCurrency } from '@/Utils/formatPrice';
import { publicBuyerRequestLocation } from '@/Utils/buyerRequestLocation';

const statusClasses = (status) => {
    const map = {
        open: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        closed: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
        fulfilled: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
        pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        accepted: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
        rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
        withdrawn: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    };
    return map[status] || map.closed;
};

const formatPostedDate = (value) => {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return '—';
    }
};

function stripHtml(html = '') {
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUserVerified(person) {
    if (!person) return false;
    if (person.is_verified) return true;
    if (person.verification_type) return true;
    const statuses = [
        person.corporate_verification?.status,
        person.corporateVerification?.status,
        person.individual_verification?.status,
        person.individualVerification?.status,
    ];
    return statuses.some((status) => ['verified', 'approved'].includes(String(status || '').toLowerCase()));
}

function verificationLabel(person, role = 'seller') {
    const corporateOk = ['verified', 'approved'].includes(
        String(person?.corporateVerification?.status || person?.corporate_verification?.status || '').toLowerCase()
    );
    const type = person?.verification_type || (corporateOk ? 'corporate' : 'individual');
    if (role === 'buyer') {
        return type === 'corporate' ? 'Verified business' : 'Verified buyer';
    }
    return type === 'corporate' ? 'Verified business' : 'Verified seller';
}

function VerifiedBadge({ title }) {
    return (
        <span className="inline-flex shrink-0 items-center" title={title} aria-label={title}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="#2F80ED" />
                <path d="M6.8 10.2L8.9 12.3L13.3 7.9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

/** Same pattern as desktop Header.jsx profile avatar. */
function userAvatarSrc(person) {
    const src = person?.profile_pic || person?.profile;
    if (!src) return '/assets/images/user.jpg';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }
    return `/${String(src).replace(/^\/+/, '')}`;
}

export default function Show({ buyerRequest, isOwner = false, canOffer = false, myOffer = null, offersCount: offersCountProp = null }) {
    const { t } = useTranslate();
    const { auth, flash } = usePage().props;
    const { list } = useCurrencyList();
    const [currencyTick, setCurrencyTick] = useState(0);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState(myOffer?.message || '');
    const [busy, setBusy] = useState(false);
    const [chatBusyId, setChatBusyId] = useState(null);
    const [priceHydrated, setPriceHydrated] = useState(false);
    const [lightbox, setLightbox] = useState(null);
    const [descExpanded, setDescExpanded] = useState(false);

    const selectedMeta = useMemo(() => {
        const code = getSelectedCurrency();
        return list.find((c) => c.code === code) || { code: 'PKR', manual_rate_to_aed: 1 };
    }, [list, currencyTick]);

    React.useEffect(() => {
        const onCurrencyChange = () => {
            setCurrencyTick((n) => n + 1);
            setPriceHydrated(false);
        };
        window.addEventListener('xb-currency-change', onCurrencyChange);
        document.addEventListener('xb-currency-change', onCurrencyChange);
        return () => {
            window.removeEventListener('xb-currency-change', onCurrencyChange);
            document.removeEventListener('xb-currency-change', onCurrencyChange);
        };
    }, []);

    React.useEffect(() => {
        if (priceHydrated || !myOffer?.price) return;
        if (!list.length && selectedMeta.code !== 'PKR') return;
        const display = convertPKRTo(myOffer.price, selectedMeta);
        setOfferPrice(String(Math.round(display * 100) / 100));
        setPriceHydrated(true);
    }, [myOffer, selectedMeta, list, priceHydrated]);

    // Live sync: seller bid ↔ buyer accept/reject without manual refresh
    React.useEffect(() => {
        const requestId = buyerRequest?.id;
        if (!requestId) return undefined;

        let cancelled = false;
        let debounceTimer = null;

        const refresh = () => {
            if (cancelled || busy) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (cancelled || busy) return;
                router.reload({
                    only: ['buyerRequest', 'myOffer', 'canOffer', 'offersCount', 'isOwner'],
                    preserveScroll: true,
                    preserveState: true,
                });
            }, 120);
        };

        let channelName = null;
        if (window.Echo) {
            channelName = `buyer-request.${requestId}`;
            window.Echo.private(channelName).listen('.BuyerRequestChanged', refresh);
        }

        // Echo/Reverb when configured; otherwise short poll so other browsers stay in sync
        const pollMs = window.Echo ? 12000 : 3000;
        const poll = setInterval(refresh, pollMs);

        return () => {
            cancelled = true;
            clearTimeout(debounceTimer);
            clearInterval(poll);
            if (window.Echo && channelName) {
                window.Echo.leave(channelName);
            }
        };
    }, [buyerRequest?.id, busy]);

    // Keep local offer fields in sync when remote myOffer changes (accept/reject/update)
    React.useEffect(() => {
        if (busy) return;
        setOfferMessage(myOffer?.message || '');
        setPriceHydrated(false);
    }, [myOffer?.id, myOffer?.status, myOffer?.price, myOffer?.message, busy]);

    const actionsLocked = buyerRequest.status !== 'open';
    const offers = buyerRequest.offers || [];
    const offersCount = offersCountProp != null
        ? Number(offersCountProp)
        : (buyerRequest.offers_count != null ? Number(buyerRequest.offers_count) : offers.length);
    const images = buyerRequest.images || [];
    const categoryLine = [
        buyerRequest.category?.name,
        buyerRequest.sub_category?.name || buyerRequest.subCategory?.name,
        buyerRequest.child_category?.name || buyerRequest.childCategory?.name,
    ].filter(Boolean).join(' › ') || t('Uncategorized');

    const plainDescription = stripHtml(buyerRequest.description || '');
    const descriptionLong = plainDescription.length > 280;

    const backHref = isOwner
        ? route('buyer-requests.index')
        : route('seller.buyer-requests.browse');
    const backLabel = isOwner ? t('Back to Requests') : t('Back to Leads');

    const trackerSteps = useMemo(() => {
        const status = myOffer?.status;
        if (!myOffer) {
            return [
                { key: 'submit', label: t('Offer submitted'), state: 'muted' },
                { key: 'review', label: t('Pending review'), state: 'muted' },
                { key: 'decision', label: t('Decision'), state: 'muted' },
            ];
        }
        if (status === 'pending') {
            return [
                { key: 'submit', label: t('Offer submitted'), state: 'done' },
                { key: 'review', label: t('Pending review'), state: 'active' },
                { key: 'decision', label: t('Decision'), state: 'muted' },
            ];
        }
        if (status === 'accepted') {
            return [
                { key: 'submit', label: t('Offer submitted'), state: 'done' },
                { key: 'review', label: t('Pending review'), state: 'done' },
                { key: 'decision', label: t('Accepted'), state: 'done' },
            ];
        }
        if (status === 'rejected') {
            return [
                { key: 'submit', label: t('Offer submitted'), state: 'done' },
                { key: 'review', label: t('Pending review'), state: 'done' },
                { key: 'decision', label: t('Rejected'), state: 'rejected' },
            ];
        }
        return [
            { key: 'submit', label: t('Offer submitted'), state: 'done' },
            { key: 'review', label: t('Withdrawn'), state: 'muted' },
            { key: 'decision', label: t('Decision'), state: 'muted' },
        ];
    }, [myOffer, t]);

    const handleClose = async () => {
        const ok = await confirmAction({
            title: t('Close this request?'),
            text: t('Sellers will no longer be able to offer on this request.'),
            confirmText: t('Close request'),
            cancelText: t('Cancel'),
            danger: true,
        });
        if (!ok) return;
        router.post(route('buyer-requests.close', buyerRequest.slug || buyerRequest));
    };

    const handleAccept = async (offerId) => {
        const ok = await confirmAction({
            title: t('Accept this offer?'),
            text: t('All other offers will be disabled after you accept.'),
            confirmText: t('Accept offer'),
            cancelText: t('Cancel'),
        });
        if (!ok) return;
        router.post(route('buyer-requests.offers.accept', [buyerRequest.slug || buyerRequest, offerId]));
    };

    const handleReject = async (offerId) => {
        const ok = await confirmAction({
            title: t('Reject this offer?'),
            text: t('The seller will be notified that their offer was rejected.'),
            confirmText: t('Reject offer'),
            cancelText: t('Cancel'),
            danger: true,
        });
        if (!ok) return;
        router.post(route('buyer-requests.offers.reject', [buyerRequest.slug || buyerRequest, offerId]));
    };

    const handleContactSupport = (offer) => {
        const message = encodeURIComponent(
            `Hello XpertBid Support, I accepted an offer on request: ${buyerRequest.title} (Request #${buyerRequest.id}, Offer #${offer.id})`
        );
        window.open(`https://wa.me/923022113202?text=${message}`, '_blank', 'noopener,noreferrer');
    };

    const handleChat = async (offer) => {
        if (!auth?.user || !offer) return;
        setChatBusyId(offer.id);
        try {
            const response = await axios.post('/chat/initiate', {
                user_id: isOwner ? offer.seller_id : buyerRequest.user_id,
                buyer_request_offer_id: offer.id,
            });
            window.location.href = route('chat.open', response.data.id);
        } catch (err) {
            await alertAction({
                title: t('Unable to start chat'),
                text: err?.response?.data?.message || t('Please try again in a moment.'),
                icon: 'error',
                confirmText: t('OK'),
            });
            setChatBusyId(null);
        }
    };

    const submitOffer = (e) => {
        e.preventDefault();
        setBusy(true);
        const pricePkr = convertToPKR(offerPrice, selectedMeta);
        const payload = {
            price: pricePkr,
            message: offerMessage || null,
        };
        const onFinish = () => setBusy(false);

        if (myOffer?.id && myOffer.status === 'pending') {
            router.put(route('buyer-request-offers.update', myOffer.id), payload, { onFinish });
        } else {
            router.post(route('buyer-requests.offers.store', buyerRequest.slug || buyerRequest), payload, { onFinish });
        }
    };

    const withdrawOffer = async () => {
        if (!myOffer?.id) return;
        const ok = await confirmAction({
            title: t('Withdraw your offer?'),
            text: t('You can submit a new offer later while the request is still open.'),
            confirmText: t('Withdraw offer'),
            cancelText: t('Cancel'),
            danger: true,
        });
        if (!ok) return;
        router.delete(route('buyer-request-offers.destroy', myOffer.id));
    };

    return (
        <AppLayout title={buyerRequest.title}>
            <Head title={buyerRequest.title} />

            <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
                <div className="mx-auto max-w-7xl px-2.5 py-4 sm:px-6 sm:py-6 lg:px-8">
                    {/* Breadcrumb + back */}
                    <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
                        <Link
                            href={backHref}
                            className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900"
                        >
                            <HiOutlineArrowLeft className="h-4 w-4 shrink-0" />
                            <span className="truncate">{backLabel}</span>
                        </Link>
                        <nav className="hidden flex-wrap items-center gap-1.5 text-sm text-slate-500 sm:flex">
                            <Link href={backHref} className="hover:text-slate-800 transition-colors">
                                {t('Buyer requests')}
                            </Link>
                            <span className="text-slate-300">/</span>
                            <span className="max-w-xs truncate font-medium text-slate-800">
                                {buyerRequest.title}
                            </span>
                        </nav>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 sm:mb-6 sm:px-4 sm:py-3">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                        {/* LEFT */}
                        <div className="space-y-4 lg:col-span-2 sm:space-y-6">
                            {/* Request details */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6">
                                <div className="flex items-start justify-between gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:px-3 sm:text-xs ${statusClasses(buyerRequest.status)}`}
                                    >
                                        {buyerRequest.status}
                                    </span>
                                    {isOwner && buyerRequest.status !== 'fulfilled' && (
                                        <Link
                                            href={route('buyer-requests.edit', buyerRequest.slug || buyerRequest)}
                                            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 no-underline transition hover:bg-slate-50 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm"
                                        >
                                            {t('Edit')}
                                        </Link>
                                    )}
                                </div>

                                <h1 className="mt-2.5 text-xl font-bold tracking-tight text-gray-900 sm:mt-3 sm:text-3xl">
                                    {buyerRequest.title}
                                </h1>

                                {buyerRequest.user && (
                                    <div className="mt-3 flex items-center gap-2.5">
                                        <img
                                            src={userAvatarSrc(buyerRequest.user)}
                                            alt={buyerRequest.user.name || t('Buyer')}
                                            className="h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/assets/images/user.jpg';
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <span className="truncate text-sm font-semibold text-slate-900">
                                                    {buyerRequest.user.name || t('Buyer')}
                                                </span>
                                                {isUserVerified(buyerRequest.user) && (
                                                    <VerifiedBadge title={t(verificationLabel(buyerRequest.user, 'buyer'))} />
                                                )}
                                            </div>
                                            {isUserVerified(buyerRequest.user) && (
                                                <div className="text-[11px] font-medium text-sky-600">
                                                    {t(verificationLabel(buyerRequest.user, 'buyer'))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3 space-y-1.5 text-xs text-slate-500 sm:mt-3 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2 sm:space-y-0 sm:text-sm">
                                    <div className="flex min-w-0 items-start gap-1.5">
                                        <HiOutlineClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500 sm:h-4 sm:w-4" />
                                        <span className="min-w-0 break-words">{categoryLine}</span>
                                    </div>
                                    {publicBuyerRequestLocation(buyerRequest) && (
                                        <div className="flex min-w-0 items-start gap-1.5">
                                            <HiOutlineLocationMarker className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500 sm:h-4 sm:w-4" />
                                            <span className="min-w-0 break-words">{publicBuyerRequestLocation(buyerRequest)}</span>
                                        </div>
                                    )}
                                    {buyerRequest.budget != null && Number(buyerRequest.budget) > 0 && (
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                            <HiOutlineCash className="h-3.5 w-3.5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
                                            <span className="text-slate-500 font-medium">{t('Target budget')}:</span>
                                            <Price amountPKR={buyerRequest.budget} />
                                        </div>
                                    )}
                                </div>

                                {isOwner && buyerRequest.status === 'open' && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <HiOutlineX className="h-4 w-4" />
                                            {t('Close request')}
                                        </button>
                                    </div>
                                )}

                                {buyerRequest.description && (
                                    <div className="mt-4 border-t border-slate-100 pt-4 sm:mt-5 sm:pt-5">
                                        <h2 className="mb-2 text-sm font-semibold text-slate-800">
                                            {t('Description')}
                                        </h2>
                                        <div
                                            className={`buyer-request-description prose prose-sm max-w-none text-slate-700 ${
                                                !descExpanded && descriptionLong ? 'line-clamp-6' : ''
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: buyerRequest.description }}
                                        />
                                        {descriptionLong && (
                                            <button
                                                type="button"
                                                onClick={() => setDescExpanded((v) => !v)}
                                                className="mt-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                                            >
                                                {descExpanded ? t('Show less') : t('Read more')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {images.length > 0 && (
                                    <div className="mt-4 sm:mt-6">
                                        <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-800 sm:mb-3">
                                            <HiOutlinePhotograph className="h-4 w-4 text-slate-400" />
                                            {t('Images')}
                                            <span className="font-normal text-slate-400">({images.length})</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                                            {images.map((img) => {
                                                const src = img.url || `/${img.path}`;
                                                return (
                                                    <button
                                                        key={img.id}
                                                        type="button"
                                                        onClick={() => setLightbox(src)}
                                                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt=""
                                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                        />
                                                        <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Seller offer form */}
                            {canOffer && (
                                <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {myOffer?.status === 'pending'
                                            ? t('Update your offer')
                                            : t('Submit an offer')}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t('Send a competitive price and a short message to the buyer.')}
                                        {' '}
                                        {t('Multiple sellers can offer on the same request.')}
                                    </p>
                                    {offersCount > 0 && !myOffer && (
                                        <p className="mt-2 text-sm font-medium text-amber-700">
                                            {offersCount === 1
                                                ? t('1 other seller has already offered — you can still compete.')
                                                : t(':count other sellers have already offered — you can still compete.').replace(':count', String(offersCount))}
                                        </p>
                                    )}

                                    <form onSubmit={submitOffer} className="mt-5 space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                                                {t('Price')}
                                            </label>
                                            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                                                <span className="inline-flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                                                    {selectedMeta.code || 'PKR'}
                                                </span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 focus:ring-0"
                                                    value={offerPrice}
                                                    onChange={(e) => setOfferPrice(e.target.value)}
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                                                {t('Message')} <span className="font-normal text-slate-400">({t('optional')})</span>
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                                value={offerMessage}
                                                onChange={(e) => setOfferMessage(e.target.value)}
                                                placeholder={t('Explain your delivery time, condition, or why the buyer should choose you...')}
                                            />
                                        </div>

                                        <div
                                            className={`grid gap-2 pt-1 ${
                                                myOffer?.status === 'pending' ? 'grid-cols-2' : 'grid-cols-1'
                                            }`}
                                        >
                                            <button
                                                type="submit"
                                                disabled={busy}
                                                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {busy
                                                    ? t('Saving...')
                                                    : (myOffer?.status === 'pending' ? t('Update offer') : t('Submit offer'))}
                                            </button>
                                            {myOffer?.status === 'pending' && (
                                                <button
                                                    type="button"
                                                    onClick={withdrawOffer}
                                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    {t('Withdraw offer')}
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    {myOffer && myOffer.status !== 'pending' && (
                                        <div className="mt-4 text-sm text-slate-500">
                                            {t('Your offer status')}:{' '}
                                            <span className={`ml-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(myOffer.status)}`}>
                                                {myOffer.status}
                                            </span>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Offers list — all competing seller bids (buyer + sellers) */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-6">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                                    <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                        {t('Offers')}
                                        <span className="ml-2 text-sm font-medium text-slate-400 sm:text-base">
                                            ({offersCount})
                                        </span>
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        {isOwner
                                            ? t('Multiple sellers can bid until you accept one.')
                                            : t('Compare competing offers before you bid.')}
                                    </p>
                                </div>

                                {!offers.length ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                                        <p className="text-sm font-medium text-slate-700">{t('No offers yet')}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {isOwner
                                                ? t('Sellers will appear here when they bid on your request.')
                                                : t('Be the first to submit an offer.')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {offers.map((offer) => {
                                            const canDecide = isOwner && offer.status === 'pending' && !actionsLocked;
                                            const isAccepted = offer.status === 'accepted';
                                            const decisionDisabled = isOwner && !canDecide;
                                            const isMine = !isOwner && (
                                                Number(offer.seller_id ?? offer.seller?.id) === Number(auth?.user?.id)
                                            );
                                            const canChat = isOwner || isMine;

                                            return (
                                                <div
                                                    key={offer.id}
                                                    className={`rounded-xl border p-4 transition ${
                                                        isMine
                                                            ? 'border-amber-200 bg-amber-50/50'
                                                            : isAccepted
                                                                ? 'border-sky-200 bg-sky-50/60'
                                                                : 'border-slate-100 bg-white'
                                                    } ${offer.status === 'rejected' || offer.status === 'withdrawn' ? 'opacity-70' : ''}`}
                                                >
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2.5">
                                                                <img
                                                                    src={userAvatarSrc(offer.seller)}
                                                                    alt={offer.seller?.name || t('Seller')}
                                                                    className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover bg-slate-100"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/assets/images/user.jpg';
                                                                    }}
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                                        <span className="truncate font-semibold text-slate-900">
                                                                            {offer.seller?.name || t('Seller')}
                                                                        </span>
                                                                        {isMine && (
                                                                            <span className="inline-flex shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                                                                                {t('You')}
                                                                            </span>
                                                                        )}
                                                                        {isUserVerified(offer.seller) && (
                                                                            <VerifiedBadge title={t(verificationLabel(offer.seller, 'seller'))} />
                                                                        )}
                                                                    </div>
                                                                    {isUserVerified(offer.seller) && (
                                                                        <div className="text-[11px] font-medium text-sky-600">
                                                                            {t(verificationLabel(offer.seller, 'seller'))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-xl font-bold text-slate-900">
                                                                <Price amountPKR={offer.price} />
                                                            </div>
                                                            {offer.message && (
                                                                <p className="mt-2 text-sm text-slate-600">{offer.message}</p>
                                                            )}
                                                            <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(offer.status)}`}>
                                                                {offer.status}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {canChat && (
                                                            <button
                                                                type="button"
                                                                disabled={chatBusyId === offer.id}
                                                                onClick={() => handleChat(offer)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                                            >
                                                                <HiOutlineChatAlt2 className="h-4 w-4" />
                                                                {chatBusyId === offer.id ? t('Opening...') : t('Chat')}
                                                            </button>
                                                            )}

                                                            {isOwner && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        disabled={decisionDisabled}
                                                                        onClick={() => handleAccept(offer.id)}
                                                                        className="inline-flex items-center rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                                    >
                                                                        {t('Accept')}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        disabled={decisionDisabled}
                                                                        onClick={() => handleReject(offer.id)}
                                                                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                                    >
                                                                        {t('Reject')}
                                                                    </button>
                                                                </>
                                                            )}

                                                            {isOwner && isAccepted && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleContactSupport(offer)}
                                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-95"
                                                                >
                                                                    <i className="fa-brands fa-whatsapp" />
                                                                    {t('Contact Support')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start sm:space-y-6">
                            {/* Summary — desktop mainly; compact strip on mobile */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
                                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                                    {t('Request summary')}
                                </h3>
                                <dl className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                                    {buyerRequest.budget != null && Number(buyerRequest.budget) > 0 && (
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <dt className="inline-flex items-center gap-2 text-slate-500">
                                                <HiOutlineCash className="h-4 w-4 text-emerald-500" />
                                                {t('Target budget')}
                                            </dt>
                                            <dd className="font-semibold text-slate-900">
                                                <Price amountPKR={buyerRequest.budget} />
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <dt className="inline-flex items-center gap-2 text-slate-500">
                                            <HiOutlineCalendar className="h-4 w-4" />
                                            {t('Posted')}
                                        </dt>
                                        <dd className="font-medium text-slate-900">
                                            {formatPostedDate(buyerRequest.created_at)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <dt className="inline-flex items-center gap-2 text-slate-500">
                                            <HiOutlineClipboardList className="h-4 w-4" />
                                            {t('Offers')}
                                        </dt>
                                        <dd className="font-medium text-slate-900">{offersCount}</dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <dt className="inline-flex items-center gap-2 text-slate-500">
                                            <HiOutlinePhotograph className="h-4 w-4" />
                                            {t('Images')}
                                        </dt>
                                        <dd className="font-medium text-slate-900">{images.length}</dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <dt className="text-slate-500">{t('Status')}</dt>
                                        <dd>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(buyerRequest.status)}`}>
                                                {buyerRequest.status}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                            </section>

                            {/* Status tracker — sellers with offer context */}
                            {(canOffer || myOffer) && (
                                <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
                                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                                        {t('Offer progress')}
                                    </h3>
                                    <ol className="relative ml-1.5 mt-3 space-y-0 border-l border-slate-200 sm:ml-2 sm:mt-4">
                                        {trackerSteps.map((step) => {
                                            const done = step.state === 'done';
                                            const active = step.state === 'active';
                                            const rejected = step.state === 'rejected';
                                            return (
                                                <li key={step.key} className="relative pb-3.5 pl-5 last:pb-0 sm:pb-5 sm:pl-6">
                                                    <span
                                                        className={`absolute -left-[9px] top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-white ${
                                                            done || rejected
                                                                ? rejected
                                                                    ? 'bg-rose-500'
                                                                    : 'bg-emerald-500'
                                                                : active
                                                                    ? 'bg-amber-400'
                                                                    : 'bg-slate-300'
                                                        }`}
                                                    >
                                                        {(done || rejected) && (
                                                            <HiOutlineCheckCircle className="h-3 w-3 text-white" />
                                                        )}
                                                    </span>
                                                    <div
                                                        className={`text-sm font-medium leading-snug ${
                                                            active
                                                                ? 'text-amber-700'
                                                                : rejected
                                                                    ? 'text-rose-700'
                                                                    : done
                                                                        ? 'text-slate-900'
                                                                        : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </div>
                                                    {active && (
                                                        <div className="mt-0.5 text-xs leading-snug text-amber-600">
                                                            {t('Waiting for buyer decision')}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </section>
                            )}

                            {/* Chat / your offer widget */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
                                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                                    {t('Communication')}
                                </h3>

                                {myOffer ? (
                                    <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
                                                    {t('Your offer')}
                                                </span>
                                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClasses(myOffer.status)}`}>
                                                    {myOffer.status}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 text-base font-bold text-slate-900 sm:mt-2 sm:text-lg">
                                                <Price amountPKR={myOffer.price} />
                                            </div>
                                            {myOffer.message && (
                                                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                                    {myOffer.message}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={chatBusyId === myOffer.id}
                                            onClick={() => handleChat(myOffer)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 sm:py-3"
                                        >
                                            <HiOutlineChatAlt2 className="h-5 w-5" />
                                            {chatBusyId === myOffer.id
                                                ? t('Opening...')
                                                : t('Chat with Buyer')}
                                        </button>
                                    </div>
                                ) : isOwner ? (
                                    <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                                        <p className="text-sm text-slate-500">
                                            {offersCount
                                                ? t('Use Chat on each offer to talk with sellers.')
                                                : t('When sellers offer, you can chat with them here.')}
                                        </p>
                                        {offers[0] && (
                                            <button
                                                type="button"
                                                disabled={chatBusyId === offers[0].id}
                                                onClick={() => handleChat(offers[0])}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 sm:py-3"
                                            >
                                                <HiOutlineChatAlt2 className="h-5 w-5" />
                                                {t('Chat with seller')}
                                            </button>
                                        )}
                                    </div>
                                ) : canOffer ? (
                                    <p className="mt-3 text-sm text-slate-500 sm:mt-4">
                                        {t('Submit an offer first to unlock chat with the buyer.')}
                                    </p>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-500 sm:mt-4">
                                        {t('Corporate verification is required to offer and chat.')}
                                    </p>
                                )}
                            </section>
                        </aside>
                    </div>
                </div>
            </div>

            {lightbox && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[1080] flex items-center justify-center bg-black/75 p-6"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                        aria-label={t('Close')}
                        onClick={() => setLightbox(null)}
                    >
                        <HiOutlineX className="h-5 w-5" />
                    </button>
                    <img
                        src={lightbox}
                        alt=""
                        className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <style>{`
                .buyer-request-description p { margin-bottom: 0.5rem; }
                .buyer-request-description p:last-child { margin-bottom: 0; }
                .buyer-request-description ul,
                .buyer-request-description ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
                .buyer-request-description img { max-width: 100%; height: auto; border-radius: 8px; }
            `}</style>
        </AppLayout>
    );
}
