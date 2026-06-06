import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BQ8UWi9o.js";
import { A as AuctionCard } from "./AuctionCard-CkLAuDiK.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
/* empty css                */
/* empty css                    */
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./OwnerInfoRow-DJ1W7dqV.js";
import "./FavoriteToggleButton-1jmbejDw.js";
import "./listingPricing-CwGdsu2n.js";
const PROPERTY_BANNER_IMAGES = {
  skyline: {
    desktop: "https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620",
    mobile: "https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420"
  },
  apartmentBlocks: {
    desktop: "https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1920&h=620",
    mobile: "https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900&h=420"
  },
  aerialComplex: "https://images.unsplash.com/photo-1776066361467-f70a25cf0dc8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400&h=900",
  cityView: "https://images.unsplash.com/photo-1764232165240-73be9237845f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400&h=900",
  buildingComplex: "https://images.unsplash.com/photo-1764254810930-4cdf96de0ef0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1400&h=900"
};
const BRAND_BANNERS = {
  1: {
    top: PROPERTY_BANNER_IMAGES.skyline,
    small: [
      PROPERTY_BANNER_IMAGES.aerialComplex,
      PROPERTY_BANNER_IMAGES.cityView,
      PROPERTY_BANNER_IMAGES.buildingComplex
    ]
  },
  2: {
    top: PROPERTY_BANNER_IMAGES.apartmentBlocks,
    small: [
      PROPERTY_BANNER_IMAGES.cityView,
      PROPERTY_BANNER_IMAGES.buildingComplex,
      PROPERTY_BANNER_IMAGES.aerialComplex
    ]
  }
};
function PropertiesBrand({ brand, listings }) {
  const items = Array.isArray(listings) ? listings : listings?.data || [];
  const brandName = brand?.name || "Brand";
  const bannerSet = BRAND_BANNERS[Number(brand?.id)] || {
    top: PROPERTY_BANNER_IMAGES.skyline,
    small: [
      PROPERTY_BANNER_IMAGES.aerialComplex,
      PROPERTY_BANNER_IMAGES.cityView,
      PROPERTY_BANNER_IMAGES.buildingComplex
    ]
  };
  const detectBedrooms = (listing) => {
    const categoryFeatures = listing?.category_features && typeof listing.category_features === "object" ? listing.category_features : {};
    const directKeys = ["field_1", "1", "bedrooms", "bedroom", "beds", "bed"];
    for (const key of directKeys) {
      const raw = categoryFeatures[key];
      const value = Number.parseInt(raw, 10);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    const title = String(listing?.title || "").toLowerCase();
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
    const categoryFeatures = listing?.category_features && typeof listing.category_features === "object" ? listing.category_features : {};
    const directKeys = ["field_6", "6", "area", "sqft", "sq_ft", "square_feet", "squarefeet"];
    for (const key of directKeys) {
      const raw = categoryFeatures[key];
      const value = Number.parseFloat(String(raw).replace(/,/g, ""));
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    const title = String(listing?.title || "").toLowerCase();
    const match = title.match(/(\d[\d,]*)\s*(sq\s*ft|sqft|square\s*feet|squarefeet)/i);
    if (match) {
      const value = Number.parseFloat(match[1].replace(/,/g, ""));
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    return null;
  };
  const sections = Number(brand?.id) === 2 ? [
    { key: "1000_plus", title: `${brandName} 1000+ Sq Ft`, filter: (area) => area >= 1e3 && area < 1200 },
    { key: "1200_plus", title: `${brandName} 1200+ Sq Ft`, filter: (area) => area >= 1200 && area < 1450 },
    { key: "1450_plus", title: `${brandName} 1450+ Sq Ft`, filter: (area) => area >= 1450 }
  ] : [
    { key: "two", title: `${brandName} 2 Bedrooms`, filter: (n) => n === 2 },
    { key: "three", title: `${brandName} 3 Bedrooms`, filter: (n) => n === 3 },
    { key: "four", title: `${brandName} 4 Bedrooms`, filter: (n) => n === 4 },
    { key: "five_plus", title: `${brandName} 5+ Bedrooms`, filter: (n) => n >= 5 }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${brand?.name || "Brand"} Properties` }),
    /* @__PURE__ */ jsxs("div", { className: "container py-4 py-lg-5 text-dark", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 overflow-hidden brand-top-banner", children: /* @__PURE__ */ jsxs("picture", { children: [
        /* @__PURE__ */ jsx("source", { media: "(max-width: 767px)", srcSet: bannerSet.top.mobile || bannerSet.top.desktop || bannerSet.top }),
        /* @__PURE__ */ jsx("img", { src: bannerSet.top.desktop || bannerSet.top, alt: "Properties banner", className: "w-100 h-100 object-fit-cover", style: { borderRadius: "28px" } })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "row g-3 mb-4", children: bannerSet.small.map((src, index) => /* @__PURE__ */ jsx("div", { className: "col-12 col-md-4", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden position-relative brand-small-banner", children: /* @__PURE__ */ jsx("img", { src, alt: `Promo ${index + 1}`, className: "w-100 h-100 object-fit-cover brand-small-banner-image" }) }) }, src)) }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-4 border", children: [
        /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold", children: "No listings found" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted mb-0", children: "No active listings are currently available for this brand." })
      ] }) : sections.map((section) => {
        const sectionItems = Number(brand?.id) === 2 ? items.filter((listing) => section.filter(detectAreaSize(listing))) : items.filter((listing) => section.filter(detectBedrooms(listing)));
        if (sectionItems.length === 0) {
          return null;
        }
        return /* @__PURE__ */ jsxs("section", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "d-flex align-items-center justify-content-between mb-3", children: /* @__PURE__ */ jsx("h3", { className: "fw-bold mb-0 text-dark properties-section-title", children: section.title }) }),
          sectionItems.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-4 bg-white rounded-4 border text-dark", children: "No listings found in this section." }) : /* @__PURE__ */ jsx("div", { className: "marketplace-curated-slider", children: /* @__PURE__ */ jsx(
            Swiper,
            {
              modules: [Navigation],
              navigation: true,
              spaceBetween: 18,
              breakpoints: {
                320: { slidesPerView: 1.05 },
                576: { slidesPerView: 1.4 },
                768: { slidesPerView: 2.1 },
                992: { slidesPerView: 2.6 },
                1200: { slidesPerView: 3.1 }
              },
              children: sectionItems.map((listing) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(AuctionCard, { auction: listing, showPropertyMeta: true }) }, `${section.key}-${listing.id}`))
            }
          ) })
        ] }, section.key);
      })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
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

        .brand-small-banner {
          height: 240px;
          border-radius: 22px;
        }

        .brand-small-banner-image {
          border-radius: 22px;
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

          .brand-small-banner {
            height: 180px;
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
      ` })
  ] });
}
export {
  PropertiesBrand as default
};
