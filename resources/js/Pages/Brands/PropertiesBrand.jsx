import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AuctionCard from '@/Components/AuctionCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const DEFAULT_BANNER_SETS = {
  1: {
    banner: {
      desktop: 'https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620',
      mobile: 'https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420',
    },
  },
  2: {
    banner: {
      desktop: 'https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620',
      mobile: 'https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420',
    },
  },
};

const imageSrc = (value) => {
  if (!value) return null;
  if (String(value).startsWith('http')) return value;
  if (String(value).startsWith('/storage/')) {
    return `/brand-assets/${String(value).replace(/^\/storage\//, '')}`;
  }
  return `/${String(value).replace(/^\/+/, '')}`;
};

const normalizeSection = (section) => ({
  title: section?.title || '',
  listing_ids: Array.isArray(section?.listing_ids)
    ? section.listing_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [],
  type: section?.type === 'bedrooms' ? 'bedrooms' : 'square_feet',
  min_value: section?.min_value ?? '',
  max_value: section?.max_value ?? '',
});

export default function PropertiesBrand({ brand, listings }) {
  const items = Array.isArray(listings) ? listings : (listings?.data || []);
  const brandName = brand?.name || 'Brand';
  const configuredSections = Array.isArray(brand?.page_sections)
    ? brand.page_sections.map(normalizeSection)
    : [];
  const itemsById = new Map(items.map((listing) => [Number(listing.id), listing]));

  const defaultBannerSet = DEFAULT_BANNER_SETS[Number(brand?.id)] || DEFAULT_BANNER_SETS[1];
  const bannerDesktop = imageSrc(brand?.banner_img) || defaultBannerSet.banner.desktop;
  const bannerMobile = imageSrc(brand?.banner_img_mob) || imageSrc(brand?.banner_img) || defaultBannerSet.banner.mobile;

  const detectBedrooms = (listing) => {
    const categoryFeatures = listing?.category_features && typeof listing.category_features === 'object'
      ? listing.category_features
      : {};
    const directKeys = ['field_1', '1', 'bedrooms', 'bedroom', 'beds', 'bed'];

    for (const key of directKeys) {
      const raw = categoryFeatures[key];
      const value = Number.parseInt(raw, 10);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    const title = String(listing?.title || '').toLowerCase();
    const match = title.match(/(\d+)\s*\+?\s*(bed|beds|bedroom|bedrooms|bhk)/i);
    if (match) {
      const value = Number.parseInt(match[1], 10);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    return null;
  };

  const detectAreaSize = (listing) => {
    const categoryFeatures = listing?.category_features && typeof listing.category_features === 'object'
      ? listing.category_features
      : {};
    const directKeys = ['field_6', '6', 'area', 'sqft', 'sq_ft', 'square_feet', 'squarefeet'];

    for (const key of directKeys) {
      const raw = categoryFeatures[key];
      const value = Number.parseFloat(String(raw).replace(/,/g, ''));
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    const title = String(listing?.title || '').toLowerCase();
    const match = title.match(/(\d[\d,]*)\s*(sq\s*ft|sqft|square\s*feet|squarefeet)/i);
    if (match) {
      const value = Number.parseFloat(match[1].replace(/,/g, ''));
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }

    return null;
  };

  const resolveSectionListings = (section) => {
    if (Array.isArray(section.listing_ids) && section.listing_ids.length > 0) {
      return section.listing_ids
        .map((listingId) => itemsById.get(Number(listingId)))
        .filter(Boolean);
    }

    const minValue = section.min_value !== '' && section.min_value !== null ? Number(section.min_value) : null;
    const maxValue = section.max_value !== '' && section.max_value !== null ? Number(section.max_value) : null;

    return items.filter((listing) => {
      if (section.type === 'square_feet') {
        const area = detectAreaSize(listing);
        if (area === null || minValue === null) return false;
        if (maxValue === null) return area >= minValue;
        return area >= minValue && area <= maxValue;
      }

      const bedrooms = detectBedrooms(listing);
      if (bedrooms === null || minValue === null) return false;
      if (maxValue === null) return bedrooms >= minValue;
      return bedrooms >= minValue && bedrooms <= maxValue;
    });
  };

  const sections = configuredSections
    .map((section) => ({
      ...section,
      title: section.title?.trim() || `${brandName} Section`,
      items: resolveSectionListings(section),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <AppLayout>
      <Head title={`${brand?.name || 'Brand'} Properties`} />

      <div className="container py-4 py-lg-5 text-dark">
        <div className="mb-4 overflow-hidden brand-top-banner">
          <picture>
            <source media="(max-width: 767px)" srcSet={bannerMobile} />
            <img
              src={bannerDesktop}
              alt={`${brandName} banner`}
              className="w-100 h-100 object-fit-cover"
              style={{ borderRadius: '28px' }}
            />
          </picture>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <h3 className="h5 fw-bold">No listings found</h3>
            <p className="text-muted mb-0">No active listings are currently available for this brand.</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <h3 className="h5 fw-bold">No sections configured</h3>
            <p className="text-muted mb-0">Use the admin brand page builder to add product sections.</p>
          </div>
        ) : sections.map((section, index) => (
          <section key={`${section.title}-${index}`} className="mb-6">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fw-bold mb-0 text-dark properties-section-title">{section.title}</h3>
            </div>

            <div className="marketplace-curated-slider">
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
                {section.items.map((listing) => (
                  <SwiperSlide key={`${section.title}-${listing.id}`}>
                    <AuctionCard auction={listing} showPropertyMeta />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        ))}
      </div>

      <style>{`
        .properties-section-title {
          font-size: clamp(1.45rem, 2.6vw, 2rem);
          line-height: 1.2;
        }

        .brand-top-banner {
          height: 420px;
          border-radius: 32px;
          overflow: hidden;
        }

        .brand-top-banner picture,
        .brand-top-banner img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .marketplace-curated-slider {
          position: relative;
          padding-bottom: 2px;
        }

        .marketplace-curated-slider .swiper {
          overflow: hidden;
          padding: 4px 2px 78px;
        }

        .marketplace-curated-slider .swiper-slide {
          height: auto;
        }

        .marketplace-curated-slider .swiper-button-prev,
        .marketplace-curated-slider .swiper-button-next {
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

        .marketplace-curated-slider .swiper-button-prev {
          left: calc(50% - 43px) !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          margin-right: 0 !important;
        }

        .marketplace-curated-slider .swiper-button-next {
          left: calc(50% + 3px) !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          border-left: none;
        }

        .marketplace-curated-slider .swiper-button-prev::after,
        .marketplace-curated-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }

        .marketplace-curated-slider .swiper-button-disabled {
          opacity: 1 !important;
          color: #cbd5e1 !important;
          background: #ffffff !important;
        }

        @media (max-width: 767px) {
          .brand-top-banner {
            height: 210px;
            border-radius: 24px;
          }

          .marketplace-curated-slider .swiper {
            padding-bottom: 8px;
          }

          .marketplace-curated-slider .swiper-button-prev,
          .marketplace-curated-slider .swiper-button-next {
            display: none !important;
          }
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .brand-top-banner {
            height: 360px;
          }
        }
      `}</style>
    </AppLayout>
  );
}
