import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import OwnerInfoRow from '@/Components/OwnerInfoRow';
import Price from '@/Components/Price';
import AuctionCard from '@/Components/AuctionCard';
import { getDiscountMeta, isDirectBuyListing, isSoldOutListing } from '@/Utils/listingPricing';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const IMAGE_FIELDS = [
  { key: 'banner_img', label: 'Banner Image (Desktop)' },
  { key: 'banner_img_mob', label: 'Banner Image (Mobile)' },
];

const emptySection = () => ({
  _clientId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  title: '',
  listing_ids: [],
});

const createSectionClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) {
    return `/brand-assets/${path.replace(/^\/storage\//, '')}`;
  }
  return `/${path.replace(/^\/+/, '')}`;
};

const normalizeSection = (section) => ({
  _clientId: section?._clientId || createSectionClientId(),
  title: section?.title || '',
  listing_ids: Array.isArray(section?.listing_ids)
    ? section.listing_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [],
});

const getImageSrc = (listing) => {
  const directImage = listing?.image_url;
  if (directImage) return directImage;

  let albumData = listing?.album;
  if (typeof albumData === 'string') {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
      // keep original string value
    }
  }

  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return '/assets/images/placeholder.png';
  if (typeof rawPath === 'string' && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, '')}`;
};

const getPropertyMeta = (listing) => {
  const categoryFeatures = listing?.category_features && typeof listing.category_features === 'object'
    ? listing.category_features
    : {};

  const getFeatureValue = (...keys) => {
    for (const key of keys) {
      const value = categoryFeatures?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim();
      }
    }
    return '';
  };

  const beds = getFeatureValue('field_1', '1');
  const baths = getFeatureValue('field_2', '2');
  const areaSize = getFeatureValue('field_6', '6');
  const areaUnit = getFeatureValue('field_5', '5');
  const area = [areaSize, areaUnit].filter(Boolean).join(' ');

  return { beds, baths, area };
};

function BrandPageProductCard({ listing, selected = false, onClick = null, showPropertyMeta = true }) {
  return (
    <div
      className={`position-relative brand-page-admin-card ${selected ? 'brand-page-admin-card-selected' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick || undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <AuctionCard auction={listing} showPropertyMeta={showPropertyMeta} />

      <div
        className="position-absolute"
        style={{
          top: 12,
          right: 12,
          zIndex: 10,
          background: selected ? '#111827' : 'rgba(17, 24, 39, 0.9)',
          color: '#fff',
          borderRadius: '999px',
          padding: '7px 11px',
          fontSize: 12,
          fontWeight: 700,
          pointerEvents: 'none',
        }}
      >
        {selected ? 'Selected' : 'Add Product'}
      </div>

      {onClick && (
        <button
          type="button"
          aria-label={`Select ${listing?.title || 'product'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }}
          className="position-absolute"
          style={{ inset: 0, zIndex: 9, background: 'transparent', border: 0, padding: 0 }}
        />
      )}
    </div>
  );
}

export default function PageBuilder({ brands = [], selectedBrand = null, brandListings = [] }) {
  const fileInputRefs = useRef({});
  const [sections, setSections] = useState([]);
  const [activePickerIndex, setActivePickerIndex] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [localPreviewUrls, setLocalPreviewUrls] = useState({});

  const {
    data,
    setData,
    processing,
    errors,
    reset,
  } = useForm({
    banner_img: null,
    banner_img_mob: null,
    sections_json: '[]',
  });

  useEffect(() => {
    const nextSections = Array.isArray(selectedBrand?.page_sections)
      ? selectedBrand.page_sections.map(normalizeSection)
      : [];

    setSections(nextSections);
    setActivePickerIndex(null);
    setProductSearch('');
    setLocalPreviewUrls({});
    setData({
      banner_img: null,
      banner_img_mob: null,
      sections_json: JSON.stringify(nextSections),
    });
  }, [selectedBrand?.id]);

  useEffect(() => {
    setData('sections_json', JSON.stringify(sections));
  }, [sections]);

  const selectedBrandId = selectedBrand?.id ? String(selectedBrand.id) : '';

  const brandListingsById = useMemo(() => {
    return new Map((Array.isArray(brandListings) ? brandListings : []).map((listing) => [Number(listing.id), listing]));
  }, [brandListings]);

  const filteredBrandListings = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    if (!query) {
      return Array.isArray(brandListings) ? brandListings : [];
    }

    return (Array.isArray(brandListings) ? brandListings : []).filter((listing) => {
      const title = String(listing?.title || '').toLowerCase();
      return title.includes(query) || String(listing?.id || '').includes(query);
    });
  }, [brandListings, productSearch]);

  const activeSection = activePickerIndex !== null ? sections[activePickerIndex] : null;

  const handleBrandChange = (brandId) => {
    router.get(route('admin.brand-pages.index'), { brand_id: brandId }, {
      preserveScroll: true,
      replace: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBrand?.id) return;

    router.post(route('admin.brand-pages.update', selectedBrand.id), {
      ...data,
      _method: 'PUT',
    }, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        router.get(route('admin.brand-pages.index'), { brand_id: selectedBrand.id }, {
          preserveScroll: true,
          replace: true,
        });
      },
    });
  };

  const updateSection = (index, key, value) => {
    setSections((current) => current.map((section, idx) => (
      idx === index ? { ...section, [key]: value } : section
    )));
  };

  const addSection = () => {
    setSections((current) => [...current, emptySection()]);
  };

  const removeSection = (index) => {
    setSections((current) => current.filter((_, idx) => idx !== index));
    setActivePickerIndex((current) => (current === index ? null : current));
  };

  const toggleListingSelection = (listingId) => {
    if (activePickerIndex === null) return;

    setSections((current) => current.map((section, index) => {
      if (index !== activePickerIndex) {
        return section;
      }

      const exists = section.listing_ids.includes(listingId);
      return {
        ...section,
        listing_ids: exists
          ? section.listing_ids.filter((id) => id !== listingId)
          : [...section.listing_ids, listingId],
      };
    }));
  };

  const selectAllListings = () => {
    if (activePickerIndex === null) return;

    setSections((current) => current.map((section, index) => {
      if (index !== activePickerIndex) {
        return section;
      }

      return {
        ...section,
        listing_ids: filteredBrandListings.map((listing) => Number(listing.id)),
      };
    }));
  };

  const clearSectionListings = () => {
    if (activePickerIndex === null) return;

    setSections((current) => current.map((section, index) => (
      index === activePickerIndex
        ? { ...section, listing_ids: [] }
        : section
    )));
  };

  const brandPageUrl = selectedBrand?.slug
    ? route('properties.brand', selectedBrand.slug)
    : null;

  const uploadPreview = (field) => assetUrl(selectedBrand?.[field]);
  const bannerPreview = (field) => localPreviewUrls[field] || uploadPreview(field);

  const triggerFilePicker = (field) => {
    fileInputRefs.current[field]?.click();
  };

  const handleImageChange = (field, file) => {
    setData(field, file || null);

    setLocalPreviewUrls((current) => {
      const next = { ...current };

      if (next[field]) {
        URL.revokeObjectURL(next[field]);
        delete next[field];
      }

      if (file) {
        next[field] = URL.createObjectURL(file);
      }

      return next;
    });
  };

  useEffect(() => {
    return () => {
      Object.values(localPreviewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [localPreviewUrls]);

  return (
    <AdminLayout title="Brand Pages">
      <Head title="Brand Pages" />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Brand Pages</p>
              <h1 className="mt-2 text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                Brand Page Builder
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Select a brand, upload the banner exactly like the frontend, and place the exact products into each section.
              </p>
            </div>

            {brandPageUrl && (
              <a
                href={brandPageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800"
              >
                View Public Page
              </a>
            )}
          </div>

          <div className="mt-6">
            <InputLabel value="Select Brand" className="mb-2" />
            <select
              value={selectedBrandId}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full lg:w-96 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"
            >
              <option value="">Choose a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedBrand ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            Select a brand to start building its page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 lg:p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Banner</p>
                    <h2 className="mt-2 text-xl lg:text-2xl font-black text-gray-900">Banner Preview</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      The banner should feel exactly like the public page, with separate desktop and mobile uploads.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 px-4 py-3 text-right shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Editing</p>
                    <p className="text-sm font-black text-gray-900">{selectedBrand.name}</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50">
                  <div className="brand-builder-banner">
                    <picture>
                      <source media="(max-width: 767px)" srcSet={uploadPreview('banner_img_mob') || uploadPreview('banner_img') || '/assets/images/placeholder.png'} />
                      <img
                        src={uploadPreview('banner_img') || uploadPreview('banner_img_mob') || '/assets/images/placeholder.png'}
                        alt={`${selectedBrand.name} banner preview`}
                        className="h-full w-full object-cover"
                      />
                    </picture>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70">Banner Controls</p>
                      <h3 className="mt-1 text-lg lg:text-xl font-black">{selectedBrand.name}</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => triggerFilePicker('banner_img')}
                        className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50"
                      >
                        Upload Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerFilePicker('banner_img_mob')}
                        className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800"
                      >
                        Upload Mobile
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {IMAGE_FIELDS.map((field) => (
                    <div key={field.key} className="hidden">
                      <InputLabel value={field.label} />
                      <input
                        ref={(el) => {
                          fileInputRefs.current[field.key] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(field.key, e.target.files[0] || null)}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {IMAGE_FIELDS.map((field) => {
                    const preview = bannerPreview(field.key);
                    const selectedFile = data[field.key];

                    return (
                      <div key={field.key} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{field.label}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {field.key === 'banner_img' ? 'Desktop hero image' : 'Mobile hero image'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerFilePicker(field.key)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            Change
                          </button>
                        </div>

                        {preview ? (
                          <img
                            src={preview}
                            alt={field.label}
                            className="h-28 w-full rounded-2xl object-cover border border-gray-200 bg-gray-50"
                          />
                        ) : (
                          <div className="h-28 w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                            No image selected
                          </div>
                        )}

                        {selectedFile instanceof File && (
                          <p className="text-xs text-gray-500">Selected: {selectedFile.name}</p>
                        )}
                        {errors[field.key] && <InputError message={errors[field.key]} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Sections</p>
                    <h2 className="mt-2 text-xl lg:text-2xl font-black text-gray-900">Product Sections</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Add a section title and then attach the products that should appear on the frontend.
                    </p>
                  </div>
                  <PrimaryButton type="button" onClick={addSection}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add Section
                  </PrimaryButton>
                </div>

                <InputError message={errors.sections_json} className="mt-4" />

                <div className="mt-5 space-y-4">
                  {sections.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                      No sections yet. Click Add Section to create the first block.
                    </div>
                  ) : sections.map((section, index) => {
                    const selectedListings = (section.listing_ids || [])
                      .map((id) => brandListingsById.get(Number(id)))
                      .filter(Boolean);

                    return (
                      <div key={section._clientId || index} className="rounded-[28px] border border-gray-200 p-4 lg:p-5 space-y-4 bg-gray-50/30">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Section {index + 1}</p>
                            <p className="mt-1 text-[clamp(1.25rem,2vw,1.6rem)] font-black text-gray-900 leading-tight">
                              {section.title?.trim() || 'Untitled section'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>

                        <div>
                          <InputLabel value="Section Title" className="mb-2" />
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                            placeholder="e.g. Featured Homes"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <PrimaryButton type="button" onClick={() => setActivePickerIndex(index)}>
                            <i className="fa-solid fa-layer-group mr-2"></i>
                            Add Products
                          </PrimaryButton>
                          <p className="text-sm text-gray-500">
                            {section.listing_ids?.length || 0} selected
                          </p>
                        </div>

                        {selectedListings.length > 0 && (
                          <div className="brand-page-admin-slider">
                            <Swiper
                              modules={[Navigation]}
                              navigation
                              spaceBetween={18}
                              breakpoints={{
                                320: { slidesPerView: 1.05 },
                                576: { slidesPerView: 1.4 },
                                768: { slidesPerView: 2.1 },
                                992: { slidesPerView: 2.6 },
                                1200: { slidesPerView: 3.1 },
                              }}
                            >
                              {selectedListings.map((listing) => (
                                <SwiperSlide key={listing.id}>
                                  <BrandPageProductCard listing={listing} selected showPropertyMeta />
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <SecondaryButton
                type="button"
                onClick={() => setSections(Array.isArray(selectedBrand?.page_sections) ? selectedBrand.page_sections.map(normalizeSection) : [])}
              >
                Reset Sections
              </SecondaryButton>
              <PrimaryButton disabled={processing}>
                {processing ? 'Saving...' : 'Save Brand Page'}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>

      {activePickerIndex !== null && activeSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-5xl rounded-[28px] bg-white shadow-2xl overflow-hidden flex max-h-[90vh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Select Products</p>
                <h3 className="text-xl font-black text-gray-900">
                  {activeSection.title?.trim() || `Section ${activePickerIndex + 1}`}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pick the listings that should appear in this brand section.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePickerIndex(null)}
                className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="relative w-full md:max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search brand products"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"
                />
              </div>

              <div className="flex items-center gap-3">
                <SecondaryButton type="button" onClick={selectAllListings}>
                  Select All
                </SecondaryButton>
                <SecondaryButton type="button" onClick={clearSectionListings}>
                  Clear
                </SecondaryButton>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filteredBrandListings.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  No products found for this brand.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredBrandListings.map((listing) => {
                    const checked = activeSection.listing_ids.includes(Number(listing.id));

                    return (
                      <BrandPageProductCard
                        key={listing.id}
                        listing={listing}
                        selected={checked}
                        onClick={() => toggleListingSelection(Number(listing.id))}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 bg-white">
              <p className="text-sm text-gray-500">
                {activeSection.listing_ids.length} product{activeSection.listing_ids.length === 1 ? '' : 's'} selected
              </p>

              <div className="flex items-center gap-3">
                <SecondaryButton type="button" onClick={() => setActivePickerIndex(null)} className="px-5 py-3">
                  Done
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .brand-page-admin-slider {
          position: relative;
          padding-bottom: 2px;
        }

        .brand-page-admin-slider .swiper {
          overflow: hidden;
          padding: 4px 2px 78px;
        }

        .brand-page-admin-slider .swiper-slide {
          height: auto;
        }

        .brand-page-admin-slider .swiper-button-prev,
        .brand-page-admin-slider .swiper-button-next {
          top: auto !important;
          bottom: 14px !important;
          left: auto !important;
          right: auto !important;
          transform: none !important;
          width: 44px;
          height: 40px;
          border-radius: 0;
          background: #ffffff;
          color: #111827;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
          z-index: 5;
        }

        .brand-page-admin-slider .swiper-button-prev {
          left: calc(50% - 43px) !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          margin-right: 0 !important;
        }

        .brand-page-admin-slider .swiper-button-next {
          left: calc(50% + 3px) !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          border-left: none;
        }

        .brand-page-admin-slider .swiper-button-prev::after,
        .brand-page-admin-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }

        .brand-page-admin-slider .swiper-button-disabled {
          opacity: 1 !important;
          color: #cbd5e1 !important;
          background: #ffffff !important;
        }

        .brand-page-admin-card-selected {
          transform: translateY(-1px);
        }

        .brand-page-admin-card .product-box {
          display: block !important;
          height: auto !important;
          flex-direction: initial !important;
        }

        .brand-page-admin-card .product-card-wrapper {
          height: auto;
        }

        .brand-page-admin-card .pro-image {
          height: auto !important;
        }

        .brand-page-admin-card .pro-image .counter {
          width: calc(100% - 32px);
          max-width: 380px;
        }

        .brand-page-admin-card .product-favorite-btn {
          z-index: 4;
        }

        .brand-builder-banner {
          height: 420px;
        }

        .brand-builder-banner picture,
        .brand-builder-banner img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .brand-builder-banner {
            height: 360px;
          }
        }

        @media (max-width: 767px) {
          .brand-builder-banner {
            height: 210px;
          }

          .brand-page-admin-slider .swiper {
            padding-bottom: 8px;
          }

          .brand-page-admin-slider .swiper-button-prev,
          .brand-page-admin-slider .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
