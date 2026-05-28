import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AuctionCard from '@/Components/AuctionCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TOP_BANNER_DESKTOP = '/assets/images/desk_b_ban.png';
const TOP_BANNER_MOBILE = '/assets/images/mob_b_ban.png';
const SMALL_BANNERS = [
  '/assets/images/shotban1.webp',
  '/assets/images/shotban2.webp',
  '/assets/images/shotban3.webp',
];

export default function PropertiesBrand({ brand, listings }) {
  const items = Array.isArray(listings) ? listings : (listings?.data || []);
  const brandName = brand?.name || 'Brand';

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

  const sections = [
    { key: 'two', title: `${brandName} 2 Bedrooms`, filter: (n) => n === 2 },
    { key: 'three', title: `${brandName} 3 Bedrooms`, filter: (n) => n === 3 },
    { key: 'four', title: `${brandName} 4 Bedrooms`, filter: (n) => n === 4 },
    { key: 'five_plus', title: `${brandName} 5+ Bedrooms`, filter: (n) => n >= 5 },
  ];

  return (
    <AppLayout>
      <Head title={`${brand?.name || 'Brand'} Properties`} />

      <div className="container py-4 py-lg-5 text-dark">
        <div className="mb-4 overflow-hidden" style={{ height: '600px', borderRadius: '28px' }}>
          <picture>
            <source media="(max-width: 767px)" srcSet={TOP_BANNER_MOBILE} />
            <img src={TOP_BANNER_DESKTOP} alt="Properties banner" className="w-100 h-100 object-fit-cover" style={{ borderRadius: '28px' }} />
          </picture>
        </div>

        <div className="row g-3 mb-4">
          {SMALL_BANNERS.map((src, index) => (
            <div className="col-12 col-md-4" key={src}>
              <div className="overflow-hidden position-relative" style={{ minHeight: '140px', borderRadius: '22px' }}>
                <img src={src} alt={`Promo ${index + 1}`} className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px', borderRadius: '22px' }} />
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <h3 className="h5 fw-bold">No listings found</h3>
            <p className="text-muted mb-0">No active listings are currently available for this brand.</p>
          </div>
        ) : sections.map((section) => {
          const sectionItems = items.filter((listing) => section.filter(detectBedrooms(listing)));

          return (
            <section key={section.key} className="mb-6">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="fw-bold mb-0 text-dark properties-section-title">{section.title}</h3>
              </div>

              {sectionItems.length === 0 ? (
                <div className="text-center py-4 bg-white rounded-4 border text-dark">
                  No listings found in this section.
                </div>
              ) : (
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
                    {sectionItems.map((listing) => (
                      <SwiperSlide key={`${section.key}-${listing.id}`}>
                        <AuctionCard auction={listing} showPropertyMeta />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <style>{`
        .properties-section-title {
          font-size: clamp(1.45rem, 2.6vw, 2rem);
          line-height: 1.2;
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
          .marketplace-curated-slider .swiper {
            padding-bottom: 8px;
          }

          .marketplace-curated-slider .swiper-button-prev,
          .marketplace-curated-slider .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
    </AppLayout>
  );
}
