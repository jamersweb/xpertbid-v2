import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    HiOutlineCalendar,
    HiOutlineCash,
    HiOutlineClipboardList,
    HiOutlineCog,
    HiOutlineLocationMarker,
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineTrendingUp,
} from 'react-icons/hi';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import useTranslate from '@/hooks/useTranslate';
import { publicBuyerRequestLocation } from '@/Utils/buyerRequestLocation';

function stripHtml(html = '') {
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatPostedDate(value) {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        });
    } catch {
        return '—';
    }
}

function imageSrc(img) {
    return img?.url || (img?.path ? `/${img.path}` : '');
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

function verificationLabel(person) {
    const corporateOk = ['verified', 'approved'].includes(
        String(person?.corporateVerification?.status || person?.corporate_verification?.status || '').toLowerCase()
    );
    const type = person?.verification_type || (corporateOk ? 'corporate' : 'individual');
    return type === 'corporate' ? 'Verified business' : 'Verified buyer';
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

function VerifiedBadge({ title }) {
    return (
        <span className="inline-flex shrink-0 items-center" title={title} aria-label={title}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="#2F80ED" />
                <path d="M6.8 10.2L8.9 12.3L13.3 7.9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

export default function Browse({
    requests = [],
    isCorporateVerified = false,
    hasPreferences = false,
}) {
    const { t } = useTranslate();
    const [navFilter, setNavFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [search, setSearch] = useState('');

    const requestIdsKey = useMemo(
        () => requests.map((r) => r.id).filter(Boolean).join(','),
        [requests]
    );

    useEffect(() => {
        if (!isCorporateVerified) return undefined;

        let cancelled = false;
        let debounceTimer = null;

        const refresh = () => {
            if (cancelled) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (cancelled) return;
                router.reload({
                    only: ['requests', 'isCorporateVerified', 'hasPreferences'],
                    preserveScroll: true,
                    preserveState: true,
                });
            }, 150);
        };

        const ids = requestIdsKey
            ? requestIdsKey.split(',').map((id) => Number(id)).filter(Boolean)
            : [];

        // Cap channel subscriptions on large lead lists
        const listenIds = ids.slice(0, 40);
        if (window.Echo && listenIds.length) {
            listenIds.forEach((id) => {
                window.Echo.private(`buyer-request.${id}`).listen('.BuyerRequestChanged', refresh);
            });
        }

        const pollMs = window.Echo ? 20000 : 5000;
        const poll = setInterval(refresh, pollMs);

        return () => {
            cancelled = true;
            clearTimeout(debounceTimer);
            clearInterval(poll);
            if (window.Echo && listenIds.length) {
                listenIds.forEach((id) => window.Echo.leave(`buyer-request.${id}`));
            }
        };
    }, [requestIdsKey, isCorporateVerified]);

    const counts = useMemo(() => {
        const all = requests.length;
        const offered = requests.filter((r) => !!r.my_offer).length;
        const available = requests.filter((r) => !r.my_offer).length;
        return { all, offered, available };
    }, [requests]);

    const filtered = useMemo(() => {
        let list = [...requests];
        const q = search.trim().toLowerCase();

        if (navFilter === 'available') {
            list = list.filter((r) => !r.my_offer);
        } else if (navFilter === 'offered') {
            list = list.filter((r) => !!r.my_offer);
        }

        if (q) {
            list = list.filter((r) => {
                const hay = [
                    r.title,
                    r.city,
                    r.country,
                    r.category?.name,
                    r.sub_category?.name || r.subCategory?.name,
                    stripHtml(r.description || ''),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return hay.includes(q);
            });
        }

        if (sortBy === 'budget') {
            list.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
        } else {
            list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        return list;
    }, [requests, navFilter, sortBy, search]);

    const tabs = [
        { key: 'all', label: t('All Leads'), count: counts.all },
        { key: 'available', label: t('Open to offer'), count: counts.available },
        { key: 'offered', label: t('My offers'), count: counts.offered },
    ];

    const spotlightLeads = useMemo(() => {
        const open = requests.filter((r) => !r.my_offer);
        const pool = open.length ? open : requests;
        return pool.slice(0, 3);
    }, [requests]);

    const scrollToLeads = (filter) => {
        if (filter) setNavFilter(filter);
        window.requestAnimationFrame(() => {
            document.getElementById('seller-leads-board')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    };

    return (
        <AppLayout title={t('Request leads')}>
            <Head title={t('Request leads')} />

            <div className="min-h-screen bg-[#f7f7f5] pb-24 lg:pb-10">
                <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8">
                    {/* Unique split hero — navy + theme blue, live lead stack */}
                    <section className="br-hero relative mb-4 overflow-hidden rounded-2xl sm:mb-8 sm:rounded-[1.75rem]">
                        <div className="pointer-events-none absolute inset-0 bg-[#1a2b4b]" />
                        {/* Desktop angled blue panel; mobile uses solid blue on the lead stack section */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] bg-[#43ACE9] lg:block lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]" />
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.07]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                                backgroundSize: '18px 18px',
                            }}
                        />
                        <div className="pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 select-none text-[7.5rem] font-black leading-none tracking-tighter text-white/[0.04] lg:block lg:text-[9.5rem]">
                            XB
                        </div>

                        <div className="relative flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr]">
                            {/* Copy panel — higher z so CTAs stay clickable over angled blue */}
                            <div className="relative z-20 flex flex-col justify-between px-4 py-5 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#43ACE9] sm:text-[11px] sm:tracking-[0.18em]">
                                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#43ACE9]" />
                                        {t('Live marketplace')}
                                    </div>
                                    <h1 className="mt-2.5 max-w-md text-[1.45rem] font-bold leading-[1.18] tracking-tight text-white sm:mt-3 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.15]">
                                        {t('Win deals from')}
                                        <span className="mt-0.5 block text-[#43ACE9] sm:mt-1">{t('buyer requests')}</span>
                                    </h1>
                                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-300 sm:mt-3 sm:text-[15px]">
                                        {t('Buyers post what they need. You bid. Best offer wins.')}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-col gap-3 sm:mt-8 sm:gap-4">
                                    {isCorporateVerified && (
                                        <div className="inline-grid max-w-full grid-cols-3 gap-2 sm:inline-flex sm:items-end sm:gap-7">
                                            <div className="min-w-0 text-center sm:text-left">
                                                <div className="text-xl font-bold tabular-nums text-white sm:text-3xl">{counts.available}</div>
                                                <div className="mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]">
                                                    {t('Open to you')}
                                                </div>
                                            </div>
                                            <div className="hidden h-8 w-px shrink-0 bg-white/15 sm:block" />
                                            <div className="min-w-0 text-center sm:text-left">
                                                <div className="text-xl font-bold tabular-nums text-white sm:text-3xl">{counts.offered}</div>
                                                <div className="mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]">
                                                    {t('Your bids')}
                                                </div>
                                            </div>
                                            <div className="hidden h-8 w-px shrink-0 bg-white/15 sm:block" />
                                            <div className="min-w-0 text-center sm:text-left">
                                                <div className="text-xl font-bold tabular-nums text-white sm:text-3xl">{counts.all}</div>
                                                <div className="mt-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-slate-400 sm:text-[11px]">
                                                    {t('Total')}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative z-20 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                        {isCorporateVerified && counts.available > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => scrollToLeads('available')}
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#43ACE9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(67,172,233,0.45)] transition hover:bg-[#35a0df] sm:w-auto"
                                            >
                                                <HiOutlineTrendingUp className="h-4 w-4 shrink-0" />
                                                {t('Browse open leads')}
                                            </button>
                                        )}
                                        <Link
                                            href="/seller/buyer-request-preferences"
                                            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-white/10 sm:w-auto"
                                        >
                                            <HiOutlineCog className="h-4 w-4 shrink-0" />
                                            {hasPreferences ? t('Preferences') : t('Set preferences')}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Live lead stack — blue band on mobile; keep stack inside angled blue on desktop */}
                            <div className="relative z-10 bg-[#43ACE9] px-4 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-5 lg:flex lg:items-center lg:justify-end lg:bg-transparent lg:py-10 lg:pl-16 lg:pr-10 xl:pr-12 pointer-events-none lg:pointer-events-auto">
                                <div className="relative mx-auto w-full max-w-sm pointer-events-auto lg:mx-0">
                                    <div className="pointer-events-none absolute -inset-4 hidden rounded-[2rem] bg-white/10 blur-2xl lg:block" />
                                    <div className="pointer-events-none absolute -right-1 top-2 hidden h-20 w-20 rounded-full border border-white/25 lg:block" />

                                    {spotlightLeads.length ? (
                                        <>
                                            <div className="relative isolate space-y-2 sm:space-y-2.5">
                                                {spotlightLeads.map((item, idx) => {
                                                    const thumb = imageSrc((item.images || [])[0]);
                                                    const tilt = idx === 0 ? 'sm:-rotate-1' : idx === 1 ? 'sm:rotate-1' : 'sm:-rotate-1';
                                                    // Mobile: show 2 cards; desktop: 3
                                                    const hideOnMobile = idx === 2 ? 'hidden sm:block' : '';
                                                    return (
                                                        <div key={item.id} className={`${tilt} ${hideOnMobile}`}>
                                                            <div
                                                                className="br-hero-float"
                                                                style={{
                                                                    animationDelay: `${idx * 0.4}s`,
                                                                    animationDuration: `${5 + idx * 0.6}s`,
                                                                }}
                                                            >
                                                            <Link
                                                                href={route('buyer-requests.show', item.slug || item)}
                                                                className="group flex items-center gap-2.5 rounded-xl border border-white/50 bg-white p-2.5 no-underline shadow-[0_10px_28px_rgba(26,43,75,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(26,43,75,0.28)] sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-[0_14px_40px_rgba(26,43,75,0.22)]"
                                                            >
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e8f6fc] text-[#43ACE9] sm:h-12 sm:w-12 sm:rounded-xl">
                                                                    {thumb ? (
                                                                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <HiOutlineClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="truncate text-[13px] font-semibold text-[#1a2b4b] transition group-hover:text-[#43ACE9] sm:text-sm">
                                                                        {item.title}
                                                                    </div>
                                                                    <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500 sm:gap-2 sm:text-[11px]">
                                                                        {publicBuyerRequestLocation(item) && (
                                                                            <span className="inline-flex min-w-0 items-center gap-0.5 truncate sm:gap-1">
                                                                                <HiOutlineLocationMarker className="h-3 w-3 shrink-0 text-[#43ACE9]" />
                                                                                <span className="truncate">{publicBuyerRequestLocation(item)}</span>
                                                                            </span>
                                                                        )}
                                                                        {item.budget != null && Number(item.budget) > 0 && (
                                                                            <span className="inline-flex shrink-0 font-semibold text-[#1a2b4b]">
                                                                                <Price amountPKR={item.budget} />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className="shrink-0 rounded-full bg-[#43ACE9]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a7fb8]">
                                                                    {t('Bid')}
                                                                </span>
                                                            </Link>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {counts.all > Math.min(spotlightLeads.length, 2) && (
                                                <button
                                                    type="button"
                                                    onClick={() => scrollToLeads('all')}
                                                    className="relative z-10 mt-3 w-full cursor-pointer rounded-xl border border-dashed border-white/70 bg-white/20 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/30 sm:hidden"
                                                >
                                                    +{Math.max(0, counts.all - Math.min(spotlightLeads.length, 2))} {t('more leads below')}
                                                </button>
                                            )}
                                            {counts.all > spotlightLeads.length && (
                                                <button
                                                    type="button"
                                                    onClick={() => scrollToLeads('all')}
                                                    className="relative z-10 mt-3.5 hidden w-full cursor-pointer rounded-xl border border-dashed border-white/70 bg-white/20 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/30 sm:block"
                                                >
                                                    +{counts.all - spotlightLeads.length} {t('more leads below')}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="relative rounded-2xl border border-white/35 bg-white/15 p-5 text-center text-sm text-white backdrop-blur sm:p-6">
                                            <HiOutlineSearch className="mx-auto h-7 w-7 text-white/80 sm:h-8 sm:w-8" />
                                            <p className="mt-2.5 font-medium sm:mt-3">{t('No open leads yet')}</p>
                                            <p className="mt-1 text-xs text-white/75">{t('New buyer requests will appear here.')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <style>{`
                        @keyframes brHeroFloat {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                        }
                        .br-hero-float {
                            transform-origin: center;
                        }
                        @media (min-width: 640px) {
                            .br-hero-float {
                                animation-name: brHeroFloat;
                                animation-timing-function: ease-in-out;
                                animation-iteration-count: infinite;
                            }
                        }
                        @media (prefers-reduced-motion: reduce) {
                            .br-hero-float { animation: none !important; }
                        }
                    `}</style>

                    {!isCorporateVerified ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 shadow-sm">
                            {t('Corporate verification is required to view and offer on buyer requests.')}{' '}
                            <Link href={route('verification.identity')} className="font-semibold underline">
                                {t('Verify now')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {!hasPreferences && (
                                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-slate-900">
                                            {t('Preferences are optional')}
                                        </div>
                                        <p className="mt-0.5 text-sm text-slate-600">
                                            {t('You can offer on any open request right now. Preferences only help with match alerts.')}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('seller.buyer-request-preferences.edit')}
                                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-black"
                                    >
                                        <HiOutlinePlus className="h-4 w-4" />
                                        {t('Optional setup')}
                                    </Link>
                                </div>
                            )}

                            {/* Tabs + filters */}
                            <div
                                id="seller-leads-board"
                                className="mb-6 scroll-mt-24 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:mb-8 sm:p-4"
                            >
                                <nav className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100/80 p-1 sm:flex sm:flex-wrap">
                                    {tabs.map((tab) => {
                                        const active = navFilter === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                type="button"
                                                onClick={() => setNavFilter(tab.key)}
                                                className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:justify-start sm:gap-2 sm:px-3.5 sm:text-sm ${
                                                    active
                                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/25'
                                                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                                                }`}
                                            >
                                                <span className="truncate">{tab.label}</span>
                                                <span
                                                    className={`inline-flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                                                        active ? 'bg-white/20 text-white' : 'bg-white text-slate-600 shadow-sm'
                                                    }`}
                                                >
                                                    {tab.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>

                                <div className="mt-3 flex flex-col gap-2.5 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
                                    <div className="relative min-w-0 flex-1">
                                        <HiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t('Search leads...')}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15"
                                        />
                                    </div>
                                    <label className="relative block w-full sm:w-48 sm:shrink-0">
                                        <span className="sr-only">{t('Sort By')}</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/15"
                                        >
                                            <option value="newest">{t('Sort By')}: {t('Newest')}</option>
                                            <option value="budget">{t('Highest budget')}</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">▾</span>
                                    </label>
                                </div>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/90 px-4 py-14 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-16">
                                    <HiOutlineClipboardList className="mx-auto h-9 w-9 text-slate-300 sm:h-10 sm:w-10" />
                                    <h2 className="mt-3 text-base font-bold text-gray-900 sm:text-lg">
                                        {requests.length === 0 ? t('No open requests') : t('No matching leads')}
                                    </h2>
                                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                        {requests.length === 0
                                            ? t('New buyer requests will appear here when available.')
                                            : t('Try another filter or clear your search.')}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                                    {filtered.map((item) => {
                                        const categoryLine = [
                                            item.category?.name,
                                            item.sub_category?.name || item.subCategory?.name,
                                            item.child_category?.name || item.childCategory?.name,
                                        ].filter(Boolean).join(' › ') || t('Uncategorized');
                                        const description = stripHtml(item.description || '');
                                        const thumbs = (item.images || []).slice(0, 4);
                                        const extraImages = Math.max(0, (item.images || []).length - 3);
                                        const previewThumbs = extraImages > 0 ? thumbs.slice(0, 3) : thumbs;

                                        return (
                                            <article
                                                key={item.id}
                                                className="group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.11)] sm:p-4"
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                                            {t('Open')}
                                                        </span>
                                                        {item.my_offer ? (
                                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-700 ring-1 ring-amber-200">
                                                                {item.my_offer.status}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                                                {t('No offer yet')}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h2 className="mt-3 line-clamp-1 text-lg font-bold text-gray-900">
                                                        {item.title}
                                                    </h2>

                                                    {item.user && (
                                                        <div className="mt-2.5 flex items-center gap-2">
                                                            <img
                                                                src={userAvatarSrc(item.user)}
                                                                alt={item.user.name || t('Buyer')}
                                                                className="h-7 w-7 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/assets/images/user.jpg';
                                                                }}
                                                            />
                                                            <div className="min-w-0 flex items-center gap-1">
                                                                <span className="truncate text-xs font-semibold text-slate-800">
                                                                    {item.user.name || t('Buyer')}
                                                                </span>
                                                                {isUserVerified(item.user) && (
                                                                    <VerifiedBadge title={t(verificationLabel(item.user))} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                                                        <div className="flex min-w-0 items-start gap-1.5">
                                                            <HiOutlineClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                            <span className="line-clamp-1">{categoryLine}</span>
                                                        </div>
                                                        {publicBuyerRequestLocation(item) && (
                                                            <div className="flex min-w-0 items-start gap-1.5">
                                                                <HiOutlineLocationMarker className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                                <span className="line-clamp-1">{publicBuyerRequestLocation(item)}</span>
                                                            </div>
                                                        )}
                                                        {item.budget != null && Number(item.budget) > 0 && (
                                                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                                <HiOutlineCash className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                                <span className="font-medium text-slate-500">{t('Target')}:</span>
                                                                <Price amountPKR={item.budget} />
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <HiOutlineCalendar className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                            <span>{formatPostedDate(item.created_at)}</span>
                                                        </div>
                                                        {Number(item.offers_count || 0) > 0 && (
                                                            <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                                                <HiOutlineClipboardList className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                                                                <span>
                                                                    {Number(item.offers_count)}{' '}
                                                                    {Number(item.offers_count) === 1 ? t('offer so far') : t('offers so far')}
                                                                    {!item.my_offer ? ` — ${t('you can still bid')}` : ''}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {description && (
                                                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                                            {description}
                                                        </p>
                                                    )}

                                                    {item.my_offer && (
                                                        <div className="mt-2 text-xs font-medium text-slate-600">
                                                            {t('Your offer')}: <Price amountPKR={item.my_offer.price} />
                                                        </div>
                                                    )}

                                                    {previewThumbs.length > 0 && (
                                                        <div className="mt-3 flex gap-2">
                                                            {previewThumbs.map((img, idx) => (
                                                                <div
                                                                    key={img.id || idx}
                                                                    className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-sm"
                                                                >
                                                                    <img
                                                                        src={imageSrc(img)}
                                                                        alt=""
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                    {extraImages > 0 && idx === previewThumbs.length - 1 && (
                                                                        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-bold text-white">
                                                                            +{extraImages}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4 border-t border-slate-100 pt-4">
                                                    <Link
                                                        href={route('buyer-requests.show', item.slug || item)}
                                                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white no-underline shadow-md shadow-slate-900/20 transition hover:bg-black hover:text-white"
                                                    >
                                                        {item.my_offer ? t('View / update offer') : t('View & offer')}
                                                    </Link>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
