import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    HiOutlineClipboardList,
    HiOutlinePlus,
    HiOutlineTrendingUp,
    HiOutlineViewGrid,
    HiOutlineScale,
    HiOutlineArrowRight,
} from 'react-icons/hi';
import ListingCard from '@/Components/ListingCard';
import useTranslate from '@/hooks/useTranslate';

export default function Dashboard({ listingsCount = 0, biddingsCount = 0, listings = [] }) {
    const { t } = useTranslate();
    const { auth } = usePage().props;
    const firstName = String(auth?.user?.name || '')
        .trim()
        .split(/\s+/)[0];

    const stats = [
        {
            key: 'listings',
            value: listingsCount,
            label: t('Listings'),
            hint: t('Your active & past posts'),
            href: route('auctions.mylistings'),
            icon: HiOutlineViewGrid,
            img: '/assets/images/dashboard-listing.svg',
        },
        {
            key: 'biddings',
            value: biddingsCount,
            label: t('Biddings'),
            hint: t('Bids you placed'),
            href: route('bids.index'),
            icon: HiOutlineScale,
            img: '/assets/images/dashboard-bidding.svg',
        },
    ];

    return (
        <AppLayout title={t('Dashboard')}>
            <Head title={t('User Dashboard')} />

            <div className="min-h-screen bg-[#eef6fc] pb-24 lg:pb-10">
                <style>{`
                    a.dash-see-all:hover,
                    a.dash-see-all:focus {
                        background-color: #43ACE9 !important;
                        border-color: #43ACE9 !important;
                        color: #ffffff !important;
                    }
                    a.dash-see-all:hover *,
                    a.dash-see-all:focus * {
                        color: #ffffff !important;
                    }
                `}</style>
                <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8">
                    {/* Blue hero — brand #43ACE9 / ink #23262F */}
                    <section className="relative mb-5 overflow-hidden rounded-2xl bg-[#43ACE9] sm:mb-8 sm:rounded-[1.75rem]">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                                backgroundSize: '18px 18px',
                            }}
                        />
                        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#ffffff26] blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#23262F40] blur-3xl" />

                        <div className="relative px-4 py-6 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                            <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ffffffd9] sm:text-[11px]">
                                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                {t('Your marketplace hub')}
                            </div>
                            <h1 className="mt-2.5 max-w-xl text-[1.55rem] font-bold leading-tight tracking-tight text-white sm:mt-3 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.15]">
                                {firstName
                                    ? `${t('Welcome back')}, ${firstName}`
                                    : t('Dashboard')}
                            </h1>
                            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[#ffffffe6] sm:mt-3 sm:text-[15px]">
                                {t('Track listings, bids, and buyer requests — all in one place.')}
                            </p>

                            <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap">
                                <Link
                                    href={route('buyer-requests.create')}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#23262F] no-underline shadow-[0_10px_28px_#23262F24] transition hover:bg-[#f7fafc] sm:w-auto"
                                >
                                    <HiOutlinePlus className="h-4 w-4 shrink-0" />
                                    {t('New request')}
                                </Link>
                                <Link
                                    href={route('buyer-requests.index')}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ffffff99] bg-[#ffffff1a] px-4 py-2.5 text-sm font-semibold text-white no-underline backdrop-blur-[2px] transition hover:bg-[#ffffff33] sm:w-auto"
                                >
                                    <HiOutlineClipboardList className="h-4 w-4 shrink-0" />
                                    {t('Buyer Requests')}
                                </Link>
                                <Link
                                    href={route('seller.buyer-requests.browse')}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ffffff99] bg-[#ffffff1a] px-4 py-2.5 text-sm font-semibold text-white no-underline backdrop-blur-[2px] transition hover:bg-[#ffffff33] sm:w-auto"
                                >
                                    <HiOutlineTrendingUp className="h-4 w-4 shrink-0" />
                                    {t('Request Leads')}
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-5">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Link
                                    key={stat.key}
                                    href={stat.href}
                                    className="group relative overflow-hidden rounded-2xl border border-[#d7ebf8] bg-white p-4 no-underline shadow-[0_10px_30px_#43ACE91f] transition duration-200 hover:-translate-y-0.5 hover:border-[#43ACE980] hover:shadow-[0_16px_40px_#43ACE92e] sm:p-5"
                                >
                                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#43ACE91a] transition group-hover:bg-[#43ACE929]" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#DCECFA] sm:h-[4.5rem] sm:w-[4.5rem]">
                                            <img
                                                src={stat.img}
                                                alt=""
                                                className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextSibling?.classList.remove('hidden');
                                                }}
                                            />
                                            <Icon className="hidden h-8 w-8 text-[#43ACE9]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-3xl font-bold tabular-nums tracking-tight text-[#23262F] sm:text-[2.15rem]">
                                                {stat.value}
                                            </div>
                                            <div className="mt-0.5 text-sm font-semibold text-[#23262F] sm:text-base">
                                                {stat.label}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#606060]">{stat.hint}</div>
                                        </div>
                                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d7ebf8] bg-[#f4faff] text-[#43ACE9] transition group-hover:border-[#43ACE9] group-hover:bg-[#43ACE9] group-hover:text-white">
                                            <HiOutlineArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* My listings */}
                    <section className="rounded-2xl border border-[#d7ebf8] bg-white p-3.5 shadow-[0_8px_30px_#43ACE914] sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold tracking-tight text-[#23262F] sm:text-2xl">
                                    {t('My Listings')}
                                </h2>
                                <p className="mt-0.5 hidden text-sm text-[#606060] sm:block">
                                    {t('Manage and review what you have listed.')}
                                </p>
                            </div>
                            <Link
                                href={route('auctions.mylistings')}
                                className="dash-see-all inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#43ACE966] bg-white px-3.5 py-2 text-sm font-semibold text-[#43ACE9] no-underline transition sm:px-4"
                            >
                                {t('See all')}
                                <HiOutlineArrowRight className="h-4 w-4 shrink-0" />
                            </Link>
                        </div>

                        {listings && listings.length > 0 ? (
                            <div className="space-y-4">
                                {listings.map((listing) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#b9daf0] bg-[#f4faff] px-4 py-12 text-center sm:py-14">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#43ACE9] shadow-sm">
                                    <HiOutlineViewGrid className="h-6 w-6" />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-[#23262F]">
                                    {t('No listings available.')}
                                </p>
                                <p className="mx-auto mt-1 max-w-sm text-sm text-[#606060]">
                                    {t('Create a listing or post a buyer request to get started.')}
                                </p>
                                <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
                                    <Link
                                        href={route('auctions.create')}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#43ACE9] px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_10px_24px_#43ACE959] transition hover:bg-[#35a0df]"
                                    >
                                        <HiOutlinePlus className="h-4 w-4" />
                                        {t('Create listing')}
                                    </Link>
                                    <Link
                                        href={route('buyer-requests.create')}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#43ACE966] bg-white px-4 py-2.5 text-sm font-semibold text-[#43ACE9] no-underline transition hover:bg-[#e8f5fc]"
                                    >
                                        {t('New request')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
