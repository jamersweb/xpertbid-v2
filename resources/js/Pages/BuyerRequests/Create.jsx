import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import {
    HiOutlineCloudUpload,
    HiOutlineX,
} from 'react-icons/hi';
import AppLayout from '@/Layouts/AppLayout';
import GoogleLocationPicker from '@/Components/GoogleLocationPicker';
import useTranslate from '@/hooks/useTranslate';
import useCurrencyList from '@/Utils/useCurrencyList';
import { convertToPKR, convertPKRTo, getSelectedCurrency } from '@/Utils/formatPrice';
import FormLayout, {
    FieldError,
    FieldLabel,
    FormCard,
    inputClass,
} from '@/Pages/BuyerRequests/FormLayout';
import 'react-quill/dist/quill.snow.css';

const MAX_IMAGES = 8;

export default function Create({ categories = [] }) {
    const { t } = useTranslate();
    const { errors = {} } = usePage().props;
    const { list } = useCurrencyList();
    const fileInputRef = useRef(null);
    const prevCurrencyRef = useRef(getSelectedCurrency());
    const [currencyTick, setCurrencyTick] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category_id: '',
        sub_category_id: '',
        child_category_id: '',
        budget: '',
        location_label: '',
        country: '',
        state: '',
        city: '',
        latitude: '',
        longitude: '',
    });

    const selectedMeta = useMemo(() => {
        const code = getSelectedCurrency();
        return list.find((c) => c.code === code) || { code: 'PKR', manual_rate_to_aed: 1 };
    }, [list, currencyTick]);

    const previews = useMemo(
        () => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
        [files]
    );

    useEffect(() => {
        return () => {
            previews.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    useEffect(() => {
        const onCurrencyChange = () => setCurrencyTick((n) => n + 1);
        window.addEventListener('xb-currency-change', onCurrencyChange);
        document.addEventListener('xb-currency-change', onCurrencyChange);
        return () => {
            window.removeEventListener('xb-currency-change', onCurrencyChange);
            document.removeEventListener('xb-currency-change', onCurrencyChange);
        };
    }, []);

    // Keep budget display in sync when header currency changes
    useEffect(() => {
        const nextCode = selectedMeta.code || 'PKR';
        const prevCode = prevCurrencyRef.current;
        if (prevCode === nextCode) return;

        setForm((prev) => {
            if (prev.budget === '' || prev.budget == null) {
                prevCurrencyRef.current = nextCode;
                return prev;
            }
            const oldMeta = list.find((c) => c.code === prevCode) || { code: prevCode, manual_rate_to_aed: 1 };
            const pkr = convertToPKR(prev.budget, oldMeta);
            const display = convertPKRTo(pkr, selectedMeta);
            prevCurrencyRef.current = nextCode;
            return { ...prev, budget: String(Math.round(display * 100) / 100) };
        });
    }, [selectedMeta, list]);

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const addFiles = (incoming) => {
        const list = Array.from(incoming || []);
        if (!list.length) return;
        setFiles((prev) => {
            const remaining = MAX_IMAGES - prev.length;
            if (remaining <= 0) return prev;
            return [...prev, ...list.slice(0, remaining)];
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImagesChange = (e) => {
        addFiles(e.target.files);
    };

    const removeImage = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCategoryChange = (categoryId) => {
        setForm((prev) => ({
            ...prev,
            category_id: categoryId,
            sub_category_id: '',
            child_category_id: '',
        }));
        setSubCategories([]);
        setChildCategories([]);

        if (!categoryId) return;

        setLoadingSubs(true);
        axios.get(`/get-subcategories/${categoryId}`)
            .then((res) => setSubCategories(res.data.subcategories || []))
            .catch(() => setSubCategories([]))
            .finally(() => setLoadingSubs(false));
    };

    const handleSubCategoryChange = (subCategoryId) => {
        setForm((prev) => ({
            ...prev,
            sub_category_id: subCategoryId,
            child_category_id: '',
        }));
        setChildCategories([]);

        if (!subCategoryId) return;

        setLoadingChildren(true);
        axios.get(`/get-children/${subCategoryId}`)
            .then((res) => setChildCategories(res.data.subcategories || []))
            .catch(() => setChildCategories([]))
            .finally(() => setLoadingChildren(false));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'sub_category_id' && (!value || subCategories.length === 0)) return;
            if (key === 'child_category_id' && (!value || childCategories.length === 0)) return;
            if (key === 'budget') {
                if (value === '' || value === null || value === undefined) return;
                data.append('budget', String(convertToPKR(value, selectedMeta)));
                return;
            }
            if (value !== '' && value !== null && value !== undefined) {
                data.append(key, value);
            }
        });
        files.forEach((file) => data.append('images[]', file));

        router.post(route('buyer-requests.store'), data, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
        });
    };

    const openFilePicker = () => {
        if (files.length >= MAX_IMAGES) return;
        fileInputRef.current?.click();
    };

    return (
        <AppLayout title={t('New Buyer Request')}>
            <Head title={t('New Buyer Request')} />

            <FormLayout
                title={t('Create New Request')}
                submitting={submitting}
                onSubmit={handleSubmit}
                submitLabel={t('Publish Request')}
                submittingLabel={t('Publishing...')}
            >
                <FormCard
                    title={t('General info')}
                    description={t('Tell sellers exactly what you need.')}
                >
                    <div className="space-y-5">
                        <div>
                            <FieldLabel required>{t('Product name')}</FieldLabel>
                            <input
                                className={inputClass(!!errors.title)}
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="e.g., iPhone 15 Pro Max 256GB Natural Titanium"
                                required
                            />
                            <FieldError message={errors.title} />
                        </div>

                        <div>
                            <FieldLabel required>{t('Category')}</FieldLabel>
                            <select
                                className={inputClass(!!errors.category_id)}
                                value={form.category_id}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                required
                            >
                                <option value="">{t('Select category')}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <FieldError message={errors.category_id} />
                        </div>

                        {form.category_id && loadingSubs && (
                            <p className="text-xs text-slate-500">{t('Loading subcategories...')}</p>
                        )}

                        {form.category_id && !loadingSubs && subCategories.length > 0 && (
                            <div>
                                <FieldLabel>{t('Subcategory')}</FieldLabel>
                                <select
                                    className={inputClass(!!errors.sub_category_id)}
                                    value={form.sub_category_id}
                                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                                >
                                    <option value="">{t('Select subcategory')}</option>
                                    {subCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <FieldError message={errors.sub_category_id} />
                            </div>
                        )}

                        {form.sub_category_id && loadingChildren && (
                            <p className="text-xs text-slate-500">{t('Loading child categories...')}</p>
                        )}

                        {form.sub_category_id && !loadingChildren && childCategories.length > 0 && (
                            <div>
                                <FieldLabel>{t('Child category')}</FieldLabel>
                                <select
                                    className={inputClass(!!errors.child_category_id)}
                                    value={form.child_category_id}
                                    onChange={(e) => setField('child_category_id', e.target.value)}
                                >
                                    <option value="">{t('Select child category')}</option>
                                    {childCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <FieldError message={errors.child_category_id} />
                            </div>
                        )}

                        <div>
                            <FieldLabel>{t('Description')}</FieldLabel>
                            <div
                                className={`br-quill overflow-hidden rounded-xl border focus-within:ring-2 focus-within:ring-slate-900/20 ${
                                    errors.description ? 'border-rose-300' : 'border-gray-200'
                                }`}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={form.description || ''}
                                    onChange={(content) => setField('description', content)}
                                    placeholder={t('Size, quantity, condition, and other details...')}
                                />
                            </div>
                            <FieldError message={errors.description} />
                        </div>
                    </div>
                </FormCard>

                <FormCard
                    title={t('Photos / reference images')}
                    description={t('Upload up to :count images. Clear photos get faster offers.', { count: MAX_IMAGES })}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        disabled={files.length >= MAX_IMAGES}
                        onChange={handleImagesChange}
                    />

                    <div
                        role="button"
                        tabIndex={0}
                        onClick={openFilePicker}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openFilePicker();
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            addFiles(e.dataTransfer.files);
                        }}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                            files.length >= MAX_IMAGES
                                ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                                : dragOver
                                    ? 'border-slate-900 bg-slate-50'
                                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-white'
                        }`}
                    >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <HiOutlineCloudUpload className="h-6 w-6 text-slate-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                            {files.length >= MAX_IMAGES
                                ? t('Maximum images reached')
                                : t('Upload files or drag and drop')}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {t('PNG, JPG, WEBP or GIF · max 10MB each · up to :count images', { count: MAX_IMAGES })}
                        </p>
                        <p className="mt-2 text-xs font-medium text-slate-600">
                            {files.length}/{MAX_IMAGES} {t('attached')}
                        </p>
                    </div>

                    {previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {previews.map((p, idx) => (
                                <div
                                    key={p.url}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-slate-100"
                                >
                                    <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        aria-label={t('Remove image')}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(idx);
                                        }}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 opacity-100 shadow-sm ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                                    >
                                        <HiOutlineX className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <FieldError message={errors.images} />
                </FormCard>

                <FormCard
                    title={t('Budget & delivery preference')}
                    description={t('Help sellers match your price and location.')}
                >
                    <div className="space-y-5">
                        <div>
                            <FieldLabel>{t('Expected price / target budget')}</FieldLabel>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-500">
                                    {selectedMeta.code || 'PKR'}
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={`${inputClass(!!errors.budget)} pl-14`}
                                    value={form.budget}
                                    onChange={(e) => setField('budget', e.target.value)}
                                    placeholder={selectedMeta.code === 'PKR' ? 'e.g. 150000' : 'e.g. 2000'}
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {t('Optional. Sellers can still offer above or below this amount.')}
                            </p>
                            <FieldError message={errors.budget} />
                        </div>

                        <div>
                            <GoogleLocationPicker
                                addressValue={form.location_label}
                                latitudeValue={form.latitude}
                                longitudeValue={form.longitude}
                                label={t('Fulfillment location')}
                                fallbackLabel={t('Fulfillment location')}
                                placeholder={t('Search city, area or address...')}
                                fallbackPlaceholder={t('Enter your location')}
                                helperText={t('Search an address or use current location so sellers nearby can offer.')}
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
                                    setForm((prev) => ({
                                        ...prev,
                                        location_label: label,
                                        latitude: latitude || '',
                                        longitude: longitude || '',
                                        country: country || prev.country || '',
                                        state: state || prev.state || '',
                                        city: cityWithArea || city || prev.city || '',
                                    }));
                                }}
                                error={errors.location_label}
                            />
                        </div>
                    </div>
                </FormCard>
            </FormLayout>
        </AppLayout>
    );
}
