import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineExclamationCircle,
    HiOutlineInformationCircle,
    HiOutlineLocationMarker,
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineX,
} from 'react-icons/hi';
import AppLayout from '@/Layouts/AppLayout';
import GoogleLocationPicker from '@/Components/GoogleLocationPicker';
import useTranslate from '@/hooks/useTranslate';
import { confirmAction } from '@/Utils/confirmAction';
import '@/../css/sell.css';

const emptyLocation = () => ({
    location_label: '',
    country: '',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
});

const isFilledLocation = (loc) =>
    !!(loc?.location_label || loc?.city || (loc?.latitude && loc?.longitude));

export default function Preferences({ categories = [], preference = null, isCorporateVerified = false }) {
    const { t } = useTranslate();
    const { flash, errors = {} } = usePage().props;
    const [categoryIds, setCategoryIds] = useState(
        (preference?.categories || []).map((c) => c.id)
    );
    const [locations, setLocations] = useState(
        (preference?.locations || []).length
            ? preference.locations.map((loc) => ({
                location_label: loc.location_label || '',
                country: loc.country || '',
                state: loc.state || '',
                city: loc.city || '',
                latitude: loc.latitude || '',
                longitude: loc.longitude || '',
            }))
            : [emptyLocation()]
    );
    const [saving, setSaving] = useState(false);
    const [categoryQuery, setCategoryQuery] = useState('');

    const toggleCategory = (id) => {
        if (!isCorporateVerified) return;
        setCategoryIds((prev) => (
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        ));
    };

    const updateLocation = (index, patch) => {
        setLocations((prev) => prev.map((loc, i) => (i === index ? { ...loc, ...patch } : loc)));
    };

    const addLocation = () => {
        if (!isCorporateVerified) return;
        setLocations((prev) => [...prev, emptyLocation()]);
    };

    const removeLocation = (index) => {
        if (!isCorporateVerified) return;
        setLocations((prev) => {
            const next = prev.filter((_, i) => i !== index);
            return next.length ? next : [emptyLocation()];
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isCorporateVerified) return;
        setSaving(true);
        router.put(route('seller.buyer-request-preferences.update'), {
            category_ids: categoryIds,
            locations,
        }, {
            onFinish: () => setSaving(false),
        });
    };

    const handleClear = async () => {
        const ok = await confirmAction({
            title: t('Clear all preferences?'),
            text: t('You will still see all open leads. Match alerts will stop until you save new preferences.'),
            confirmText: t('Clear all'),
            cancelText: t('Cancel'),
            danger: true,
        });
        if (!ok) return;
        setCategoryIds([]);
        setLocations([emptyLocation()]);
        setSaving(true);
        router.put(route('seller.buyer-request-preferences.update'), {
            category_ids: [],
            locations: [],
        }, {
            onFinish: () => setSaving(false),
        });
    };

    const filteredCategories = useMemo(() => {
        const cats = Array.isArray(categories) ? categories : Object.values(categories || {});
        const q = categoryQuery.trim().toLowerCase();
        if (!q) return cats;
        return cats.filter((c) => String(c.name || '').toLowerCase().includes(q));
    }, [categories, categoryQuery]);

    const filledLocations = locations.filter(isFilledLocation);
    const hasAnyPrefs = categoryIds.length > 0 || filledLocations.length > 0;

    return (
        <AppLayout title={t('Lead Preferences')}>
            <Head title={t('Lead Preferences')} />

            <div className="min-h-screen overflow-x-hidden bg-slate-50 pb-28 lg:pb-10">
                <div className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8">
                    {/* Back */}
                    <Link
                        href={route('seller.buyer-requests.browse')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        {t('Browse leads')}
                    </Link>

                    {/* Header */}
                    <div className="mt-3 flex flex-wrap items-start justify-between gap-3 sm:mt-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    {t('Lead Preferences')}
                                </h1>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/80 sm:text-xs">
                                    {t('Optional — alerts only')}
                                </span>
                            </div>
                            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2">
                                {t('Tune match alerts for categories and areas you care about. You can skip this and still offer on any open request.')}
                            </p>
                        </div>
                    </div>

                    {/* Verification banner */}
                    {!isCorporateVerified && (
                        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <HiOutlineExclamationCircle className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-amber-900">
                                        {t('Verification required')}
                                    </p>
                                    <p className="mt-0.5 text-sm text-amber-800/90">
                                        {t('Only corporate-verified sellers can receive and respond to buyer requests.')}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('verification.identity')}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
                            >
                                {t('Complete Verification')} →
                            </Link>
                        </div>
                    )}

                    {flash?.success && (
                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
                            {flash.success}
                        </div>
                    )}
                    {errors.verification && (
                        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm">
                            {errors.verification}
                        </div>
                    )}

                    {/* Info tip */}
                    <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-sky-100 bg-sky-50/70 p-3 text-sm text-sky-900/80 shadow-sm sm:mt-6 sm:gap-3 sm:p-4">
                        <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
                        <p className="mb-0 leading-relaxed">
                            {t('You can always browse and offer on all open requests. Preferences only improve match alerts — they never block leads.')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="min-w-0">
                        {/* Categories card */}
                        <section className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:mt-6 sm:p-8">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                        {t('Preferred Categories')}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t('Optional — pick categories you want to focus on.')}
                                    </p>
                                </div>
                                <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-3 sm:text-xs">
                                    {categoryIds.length} {t('selected')}
                                </span>
                            </div>

                            <div className="relative mt-4 sm:mt-5">
                                <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={categoryQuery}
                                    onChange={(e) => setCategoryQuery(e.target.value)}
                                    placeholder={t('Search categories...')}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
                                {filteredCategories.map((cat) => {
                                    const selected = categoryIds.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            disabled={!isCorporateVerified}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`flex min-w-0 items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm transition-all sm:gap-3 sm:p-3 ${
                                                selected
                                                    ? 'border-slate-900 bg-slate-900 font-medium text-white shadow-sm'
                                                    : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                                            } ${!isCorporateVerified ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                                    selected
                                                        ? 'border-white/30 bg-white/15 text-white'
                                                        : 'border-gray-300 bg-white text-transparent'
                                                }`}
                                            >
                                                <HiOutlineCheck className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="min-w-0 flex-1 break-words leading-snug">{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {filteredCategories.length === 0 && (
                                <p className="mt-4 text-center text-sm text-slate-500">
                                    {t('No categories match your search.')}
                                </p>
                            )}
                            {errors.category_ids && (
                                <p className="mt-3 text-sm text-rose-600">{errors.category_ids}</p>
                            )}
                        </section>

                        {/* Locations card */}
                        <section className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:mt-6 sm:p-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                        {t('Preferred Locations')}
                                    </h2>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                        {t('Optional — areas where you can deliver or fulfill requests. Used for smarter match alerts.')}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addLocation}
                                    disabled={!isCorporateVerified}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    <HiOutlinePlus className="h-4 w-4" />
                                    {t('Add Location')}
                                </button>
                            </div>

                            {filledLocations.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {locations.map((loc, index) => {
                                        if (!isFilledLocation(loc)) return null;
                                        const label = loc.location_label || [loc.city, loc.state, loc.country].filter(Boolean).join(', ');
                                        return (
                                            <span
                                                key={`chip-${index}`}
                                                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-slate-700"
                                            >
                                                <HiOutlineLocationMarker className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                <span className="truncate">{label}</span>
                                                <button
                                                    type="button"
                                                    disabled={!isCorporateVerified}
                                                    onClick={() => removeLocation(index)}
                                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                                                    aria-label={t('Remove')}
                                                >
                                                    <HiOutlineX className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                                {locations.map((loc, index) => (
                                    <div
                                        key={`loc-${index}`}
                                        className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <div className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-800">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm ring-1 ring-slate-100">
                                                    <HiOutlineLocationMarker className="h-4 w-4" />
                                                </span>
                                                {t('Location')} {index + 1}
                                            </div>
                                            {locations.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLocation(index)}
                                                    disabled={!isCorporateVerified}
                                                    className="shrink-0 text-xs font-semibold text-slate-500 transition hover:text-rose-600 disabled:opacity-40"
                                                >
                                                    {t('Remove')}
                                                </button>
                                            )}
                                        </div>

                                        <div className="min-w-0 max-w-full overflow-hidden">
                                            <GoogleLocationPicker
                                                addressValue={loc.location_label}
                                                latitudeValue={loc.latitude}
                                                longitudeValue={loc.longitude}
                                                label={t('Location')}
                                                fallbackLabel={t('Location')}
                                                placeholder={t('Search city, area or address...')}
                                                fallbackPlaceholder={t('Enter delivery location')}
                                                helperText={t('Search or use current location to pin where you can fulfill requests.')}
                                                required={false}
                                                onChange={({
                                                    property_address,
                                                    location_label,
                                                    latitude,
                                                    longitude,
                                                    country,
                                                    state,
                                                    city,
                                                    area,
                                                }) => {
                                                    const label = location_label || property_address || '';
                                                    const cityWithArea = [area, city]
                                                        .filter(Boolean)
                                                        .filter((v, i, arr) => arr.indexOf(v) === i)
                                                        .join(', ');
                                                    updateLocation(index, {
                                                        location_label: label,
                                                        latitude: latitude || '',
                                                        longitude: longitude || '',
                                                        country: country || '',
                                                        state: state || '',
                                                        city: cityWithArea || city || '',
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Footer actions */}
                        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                <button
                                    type="submit"
                                    disabled={!isCorporateVerified || saving}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {saving ? t('Saving...') : t('Save Preferences')}
                                </button>
                                <Link
                                    href={route('seller.buyer-requests.browse')}
                                    className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-gray-500 no-underline transition hover:text-gray-900 sm:w-auto"
                                >
                                    {t('Skip for now')}
                                </Link>
                            </div>

                            {hasAnyPrefs && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    disabled={!isCorporateVerified || saving}
                                    className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:w-auto"
                                >
                                    {t('Clear all')}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
