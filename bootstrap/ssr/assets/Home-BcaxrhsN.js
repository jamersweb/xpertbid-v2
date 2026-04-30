import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BWciRgbg.js";
import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
/* empty css                */
import { u as useTranslate } from "./CurrencyPicker-KgG9a2BI.js";
import { C as CountdownTimer, O as OwnerInfoRow } from "./OwnerInfoRow-C3IMd42a.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { F as FavoriteToggleButton } from "./FavoriteToggleButton-1jmbejDw.js";
import { FaClock, FaGlobe, FaClipboardList } from "react-icons/fa";
import "react";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useCurrencyList-Ce5tJXO9.js";
const heroSlides = [
  {
    image: "/assets/images/1_rupee.png",
    mobileImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    href: "/1-rupee-auctions"
  },
  {
    image: "/assets/images/WebsiteBanner1.png",
    mobileImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
    href: "/marketplace"
  },
  {
    image: "/assets/images/WebsiteBanner2.png",
    mobileImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    href: "/search"
  },
  {
    image: "/assets/images/WebsiteBanner3.png",
    mobileImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    href: "/marketplace"
  }
];
function HeroSection() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "final-banner-section my-5", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "hero-banner-shell", children: /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay, EffectFade],
        effect: "fade",
        autoplay: {
          delay: 3e3,
          disableOnInteraction: false
        },
        loop: true,
        speed: 1e3,
        className: "hero-slider",
        children: heroSlides.map((slide, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(Link, { href: slide.href, className: "hero-banner-link", children: /* @__PURE__ */ jsxs("picture", { children: [
          /* @__PURE__ */ jsx("source", { media: "(max-width: 767px)", srcSet: slide.mobileImage || slide.image }),
          /* @__PURE__ */ jsx("img", { src: slide.image, alt: `Hero Banner ${index + 1}`, className: "hero-banner-image" })
        ] }) }) }, slide.image))
      }
    ) }) }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .hero-banner-shell {
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-slider,
        .hero-slider .swiper-wrapper,
        .hero-slider .swiper-slide {
          border-radius: 32px;
        }

        /* Override global swiper flex-centering so slide content can stretch full width */
        .hero-slider .swiper-slide {
          display: block !important;
        }

        .hero-banner-link {
          display: block;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-banner-image {
          width: 100%;
       //    height: 520px;
          object-fit: cover;
          display: block;
        }

        .hero-slider .swiper-button-prev,
        .hero-slider .swiper-button-next {
          display: none !important;
        }

        @media (min-width: 1500px) {
          .final-banner-section .container {
            max-width: 1380px;
          }
        }

        @media (max-width: 991px) {
          .hero-banner-image {
            height: 430px;
          }

          .hero-banner-content {
            left: 28px;
            right: 28px;
            bottom: 28px;
          }
        }

        @media (max-width: 767px) {
          .final-banner-section {
            margin-top: 24px !important;
            margin-bottom: 24px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .final-banner-section .container {
            --bs-gutter-x: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide,
          .hero-banner-link {
            border-radius: 24px;
          }
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-banner-shell {
            box-shadow: none;
            background: transparent;
            margin-left: 0;
            margin-right: 0;
          }
          .hero-slider .swiper-slide {
            background: transparent;
          }
          .hero-banner-link picture {
            display: block;
            line-height: 0;
          }

          .hero-banner-image {
            height: 210px;
            width: 100%;
            max-width: 100%;
          }
        }
      ` })
  ] });
}
function SliderBrowseCategories({ categories }) {
  const { t } = useTranslate();
  const displayCategories = (categories || []).slice(0, 12);
  if (!displayCategories.length) return null;
  return /* @__PURE__ */ jsxs("section", { className: "browsecategories pt-4 pb-4", style: { backgroundColor: "#F7F8F9" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "container-fluid", children: [
      /* @__PURE__ */ jsxs("div", { className: "home-section-header mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Categories") }) }),
        /* @__PURE__ */ jsx(Link, { href: route("categories.page"), className: "section-view-all-btn", children: t("View All") })
      ] }),
      /* @__PURE__ */ jsx(
        Swiper,
        {
          className: "categories-slider",
          spaceBetween: 14,
          slidesPerView: 3.1,
          breakpoints: {
            576: { slidesPerView: 3.6, spaceBetween: 14 },
            768: { slidesPerView: 5, spaceBetween: 18 },
            992: { slidesPerView: 6, spaceBetween: 20 },
            1200: { slidesPerView: 7, spaceBetween: 20 }
          },
          children: displayCategories.map((cat, i) => /* @__PURE__ */ jsx(SwiperSlide, { className: "category-item-wrapper", children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: `/marketplace?category=${cat.slug}`,
              className: "text-decoration-none category-link",
              children: [
                /* @__PURE__ */ jsx("div", { className: "image-circle", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `${cat.image?.startsWith("/") ? "" : "/"}${cat.image ?? "images/placeholder.png"}`,
                    alt: cat.name,
                    className: "category-icon"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "category-title-wrapper", children: /* @__PURE__ */ jsx("h3", { className: "category-name", children: cat.name }) })
              ]
            }
          ) }, cat.id || i))
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .section-title {
          font-weight: 700;
          color: #002f34;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .categories-slider {
          padding: 0 6px;
        }

        .category-item-wrapper {
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .category-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          width: 100%;
        }
        
        .image-circle {
          width: 100%;
          max-width: 110px;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          overflow: hidden;
          background-color: #f2f4f5;
        }

        .category-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .category-title-wrapper {
          width: 100%;
          max-width: 110px;
          display: flex;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 13px;
          color: #002f34;
          margin: 0;
          line-height: 1.25;
          text-transform: capitalize;
          word-wrap: break-word;
          
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-item-wrapper:hover .category-name {
            color: #3a77ff;
        }

        @media (min-width: 768px) {
          .categories-slider { padding: 0; }
          .image-circle,
          .category-title-wrapper {
            max-width: 150px;
          }
          .category-name {
            font-size: 14px;
          }
        }
      ` })
  ] });
}
const getProductImageSrc$4 = (product) => {
  const directImage = product?.image_url;
  if (directImage) return directImage;
  let albumData = product?.album;
  if (typeof albumData === "string") {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
    }
  }
  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return "/assets/images/placeholder.png";
  if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, "")}`;
};
function FeaturedProducts({ products }) {
  const { t } = useTranslate();
  const displayProducts = (products || []).slice(0, 3);
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Featured Listings") }) }),
      /* @__PURE__ */ jsx(Link, { href: "/marketplace?featured=home_featured", className: "section-view-all-btn", children: t("View All") })
    ] }),
    displayProducts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "row g-4 home-mobile-scroll-row", children: displayProducts.map((product, index) => {
      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
      const minBid = Number(product?.minimum_bid ?? 0);
      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
      const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
      const isNormalList = normalizedListType === "normal" || normalizedListType === "normal_list";
      const displayLabel = isNormalList ? t("Price") : hasMaxBid ? t("Current Bid") : t("Minimum Bid");
      const displayAmount = hasMaxBid ? maxBid : minBid;
      const imageSrc = getProductImageSrc$4(product);
      return /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "pro-image", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: product.id }),
          /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imageSrc,
              alt: product.title || product.name || "Product",
              style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" },
              className: "object-cover img-fluid",
              loading: index === 0 ? "eager" : "lazy"
            }
          ) }) }),
          isNormalList && product.discount_type && product.discount_value > 0 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }, children: product.discount_type === "percent" ? `${Math.round(product.discount_value)}% OFF` : "SALE" }),
          !isNormalList && /* @__PURE__ */ jsx(CountdownTimer, { startDate: product.start_date, endDate: product.end_date })
        ] }),
        /* @__PURE__ */ jsx(
          OwnerInfoRow,
          {
            owner: product.user,
            fallbackName: product.user?.name,
            fallbackAvatar: product.user?.profile_pic,
            isFeatured: Boolean(product?.featured_name)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: displayLabel }),
            /* @__PURE__ */ jsx("div", { className: "price", children: (() => {
              let finalPrice = Number(displayAmount);
              const originalPrice = finalPrice;
              if (isNormalList && product.discount_type && product.discount_value > 0) {
                if (product.discount_type === "percent") {
                  finalPrice = originalPrice - originalPrice * (product.discount_value / 100);
                } else if (product.discount_type === "flat") {
                  finalPrice = originalPrice - product.discount_value;
                }
                if (finalPrice < 0) finalPrice = 0;
                return /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted", style: { fontSize: "0.8em", lineHeight: 1 }, children: /* @__PURE__ */ jsx(Price, { amountAED: originalPrice }) }),
                  /* @__PURE__ */ jsx("span", { className: "price text-danger", children: /* @__PURE__ */ jsx(Price, { amountAED: finalPrice }) })
                ] });
              }
              return /* @__PURE__ */ jsx("span", { className: "price", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: finalPrice }) });
            })() })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? t("Buy Now") : t("Place Bid") }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) }) : /* @__PURE__ */ jsx("p", { children: t("No products found.") })
  ] }) });
}
const getProductImageSrc$3 = (product) => {
  const directImage = product?.image_url;
  if (directImage) return directImage;
  let albumData = product?.album;
  if (typeof albumData === "string") {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
    }
  }
  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return "/assets/images/placeholder.png";
  if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, "")}`;
};
function VehicleSection({ products }) {
  const { t } = useTranslate();
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Latest Vehicles") }) }),
      /* @__PURE__ */ jsx(Link, { href: "/marketplace/vehicles?type=auction", className: "section-view-all-btn", children: t("View All") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4 home-mobile-scroll-row", children: displayProducts.map((product, index) => {
      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
      const minBid = Number(product?.minimum_bid ?? 0);
      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
      const displayAmount = hasMaxBid ? maxBid : minBid;
      const imageSrc = getProductImageSrc$3(product);
      const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
      const isNormalList = normalizedListType === "normal" || normalizedListType === "normal_list";
      return /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "pro-image", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: product.id }),
          /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imageSrc,
              alt: product.title || product.name || "Product",
              style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" },
              className: "object-cover img-fluid",
              loading: "lazy"
            }
          ) }) }),
          !isNormalList && /* @__PURE__ */ jsx(CountdownTimer, { startDate: product.start_date, endDate: product.end_date })
        ] }),
        /* @__PURE__ */ jsx(
          OwnerInfoRow,
          {
            owner: product.user,
            fallbackName: product.user?.name,
            fallbackAvatar: product.user?.profile_pic,
            isFeatured: Boolean(product?.featured_name)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? t("Current Bid") : t("Minimum Bid") }),
            /* @__PURE__ */ jsx("p", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "me-1", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? t("Buy Now") : t("Place Bid") }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) })
  ] }) });
}
const getProductImageSrc$2 = (product) => {
  const directImage = product?.image_url;
  if (directImage) return directImage;
  let albumData = product?.album;
  if (typeof albumData === "string") {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
    }
  }
  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return "/assets/images/placeholder.png";
  if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, "")}`;
};
function PropertySection({ products }) {
  const { t } = useTranslate();
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Latest Properties") }) }),
      /* @__PURE__ */ jsx(Link, { href: "/marketplace/real-estate-property-auction?type=auction", className: "section-view-all-btn", children: t("View All") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4 home-mobile-scroll-row", children: displayProducts.map((product, index) => {
      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
      const minBid = Number(product?.minimum_bid ?? 0);
      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
      const displayAmount = hasMaxBid ? maxBid : minBid;
      const imageSrc = getProductImageSrc$2(product);
      const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
      const isNormalList = normalizedListType === "normal" || normalizedListType === "normal_list";
      return /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "pro-image", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: product.id }),
          /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imageSrc,
              alt: product.title || product.name || "Product",
              style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" },
              className: "object-cover img-fluid",
              loading: "lazy"
            }
          ) }) }),
          !isNormalList && /* @__PURE__ */ jsx(CountdownTimer, { startDate: product.start_date, endDate: product.end_date })
        ] }),
        /* @__PURE__ */ jsx(
          OwnerInfoRow,
          {
            owner: product.user,
            fallbackName: product.user?.name,
            fallbackAvatar: product.user?.profile_pic,
            isFeatured: Boolean(product?.featured_name)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? t("Current Bid") : t("Minimum Bid") }),
            /* @__PURE__ */ jsx("p", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "me-1", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? t("Buy Now") : t("Place Bid") }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) })
  ] }) });
}
const getProductImageSrc$1 = (product) => {
  const directImage = product?.image_url;
  if (directImage) return directImage;
  let albumData = product?.album;
  if (typeof albumData === "string") {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
    }
  }
  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return "/assets/images/placeholder.png";
  if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, "")}`;
};
function AuctionSection({ products }) {
  const { t } = useTranslate();
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Latest Auctions") }) }),
      /* @__PURE__ */ jsx(Link, { href: "/search", className: "section-view-all-btn", children: t("View All") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4 home-mobile-scroll-row", children: displayProducts.map((product, index) => {
      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
      const minBid = Number(product?.minimum_bid ?? 0);
      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
      const displayAmount = hasMaxBid ? maxBid : minBid;
      const imageSrc = getProductImageSrc$1(product);
      return /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "pro-image", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: product.id }),
          /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imageSrc,
              alt: product.title || product.name || "Product",
              style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" },
              className: "object-cover img-fluid",
              loading: "lazy"
            }
          ) }) }),
          /* @__PURE__ */ jsx(CountdownTimer, { startDate: product.start_date, endDate: product.end_date })
        ] }),
        /* @__PURE__ */ jsx(
          OwnerInfoRow,
          {
            owner: product.user,
            fallbackName: product.user?.name,
            fallbackAvatar: product.user?.profile_pic,
            isFeatured: Boolean(product?.featured_name)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name || "Untitled" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? t("Current Bid") : t("Minimum Bid") }),
            /* @__PURE__ */ jsx("div", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "price", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: t("Place Bid") }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) })
  ] }) });
}
const getProductImageSrc = (product) => {
  const directImage = product?.image_url;
  if (directImage) return directImage;
  let albumData = product?.album;
  if (typeof albumData === "string") {
    try {
      albumData = JSON.parse(albumData);
    } catch (e) {
    }
  }
  const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
  if (!rawPath) return "/assets/images/placeholder.png";
  if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
  return `/${String(rawPath).replace(/^\/+/, "")}`;
};
function NormalListSection({ products }) {
  const { t } = useTranslate();
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: t("Latest Listings") }) }),
      /* @__PURE__ */ jsx(Link, { href: "/marketplace", className: "section-view-all-btn", children: t("View All") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4 home-mobile-scroll-row", children: displayProducts.map((product, index) => {
      const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
      const isBusinessListing = normalizedListType === "business" || normalizedListType === "business_list";
      const price = Number(product?.price ?? product?.buy_now_price ?? product?.minimum_bid ?? 0);
      const imageSrc = getProductImageSrc(product);
      return /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "pro-image", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: product.id }),
          product.discount_type && product.discount_value > 0 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }, children: product.discount_type === "percent" ? `${Math.round(product.discount_value)}% OFF` : "SALE" }),
          /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: imageSrc,
              alt: product.title || product.name || "Product",
              style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" },
              className: "object-cover img-fluid",
              loading: "lazy"
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsx(
          OwnerInfoRow,
          {
            owner: product.user,
            fallbackName: product.user?.name,
            fallbackAvatar: product.user?.profile_pic,
            isFeatured: Boolean(product?.featured_name)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: isBusinessListing ? t("Business Price") : t("Price") }),
            /* @__PURE__ */ jsx("div", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "me-1", style: { color: "#23262F" }, children: (() => {
              if (product.discount_type && product.discount_value > 0) {
                let finalPrice = price;
                const originalPrice = price;
                if (product.discount_type === "percent") {
                  finalPrice = originalPrice - originalPrice * (product.discount_value / 100);
                } else if (product.discount_type === "flat") {
                  finalPrice = originalPrice - product.discount_value;
                }
                if (finalPrice < 0) finalPrice = 0;
                return /* @__PURE__ */ jsxs("span", { className: "d-flex align-items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted fs-6", style: { fontSize: "0.8em" }, children: /* @__PURE__ */ jsx(Price, { amountAED: originalPrice }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-danger fw-bold", children: /* @__PURE__ */ jsx(Price, { amountAED: finalPrice }) })
                ] });
              }
              return /* @__PURE__ */ jsx(Price, { amountAED: price });
            })() }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isBusinessListing ? t("View Product") : t("Buy Now") }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) })
  ] }) });
}
function WhyChooseXpertBid() {
  const { t } = useTranslate();
  const whyChooseData = [
    {
      icon: /* @__PURE__ */ jsx(FaClock, {}),
      title: t("Real-time Auctions"),
      description: t("Get better offers through live bidding.")
    },
    {
      icon: /* @__PURE__ */ jsx(FaGlobe, {}),
      title: t("Wide Market Reach"),
      description: t("Pakistan, UAE & expanding regions.")
    },
    {
      icon: /* @__PURE__ */ jsx(FaClipboardList, {}),
      title: t("Easy Listing & Tracking"),
      description: t("Tools to list and manage all your sales.")
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "why-choose-section pt-5 bg-light", children: [
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center mb-4 heading-text", style: { fontWeight: 700, color: "#333" }, children: t("Why Choose XpertBid?") }),
      /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Autoplay, Pagination],
          autoplay: { delay: 3e3, disableOnInteraction: false },
          loop: true,
          pagination: { clickable: true },
          spaceBetween: 30,
          breakpoints: {
            360: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 3 }
          },
          className: "pb-5",
          children: whyChooseData.map((item, index) => /* @__PURE__ */ jsx(SwiperSlide, { className: "h-auto", children: /* @__PURE__ */ jsxs("div", { className: "card list-card text-center px-4 py-4 h-100 d-flex flex-column justify-content-center align-items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "icon-box mb-3", children: item.icon }),
            /* @__PURE__ */ jsx("h5", { children: item.title }),
            /* @__PURE__ */ jsx("p", { children: item.description })
          ] }) }, index))
        }
      )
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .why-choose-section {
            background-color: #f8f9fa !important; /* bg-light */
        }
        .heading-text {
          font-weight: 700;
          color: #333;
          font-size: 30px;
        }

        .swiper-slide {
          display: flex;
          height: auto;
        }

        .list-card {
          flex: 1;
          border: 2px solid transparent;
          border-radius: 10px;
          background: #f9f9f9;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 260px;
        }

        .list-card:hover {
          border: 2px solid #43ACE9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .icon-box {
          font-size: 2.5rem;
          color: #43ACE9;
          transition: transform 0.3s ease;
        }

        .list-card:hover .icon-box {
          transform: rotate(360deg);
        }

        .list-card h5 {
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .list-card p {
          color: #666;
          margin-bottom: 0;
        }

        .home-page .why-choose-section .swiper-pagination {
          margin-top: 20px;
        }

        @media (max-width: 767px) {
          .home-page .why-choose-section.py-5 {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }

          .home-page .why-choose-section .heading-text {
            margin-bottom: 20px !important;
          }

          .home-page .why-choose-section .swiper-pagination {
            display: none !important;
          }
        }
      ` })
  ] });
}
const SeoContentSection = () => {
  const { t } = useTranslate();
  const fairList = [
    t("seo.fair_list.item_1"),
    t("seo.fair_list.item_2"),
    t("seo.fair_list.item_3"),
    t("seo.fair_list.item_4"),
    t("seo.fair_list.item_5")
  ];
  const features = [
    t("seo.features.item_1"),
    t("seo.features.item_2"),
    t("seo.features.item_3"),
    t("seo.features.item_4"),
    t("seo.features.item_5"),
    t("seo.features.item_6")
  ];
  return /* @__PURE__ */ jsxs("section", { className: "seo-content-section", children: [
    /* @__PURE__ */ jsxs("div", { className: "seo-content-shell container", children: [
      /* @__PURE__ */ jsxs("div", { className: "seo-hero-card", children: [
        /* @__PURE__ */ jsx("div", { className: "seo-badge", children: "Trusted Digital Marketplace" }),
        /* @__PURE__ */ jsx("h1", { className: "seo-main-heading", children: t("seo.heading") }),
        /* @__PURE__ */ jsx("p", { className: "seo-lead", children: t("seo.intro_one") }),
        /* @__PURE__ */ jsx("p", { className: "seo-support-copy", children: t("seo.intro_two") }),
        /* @__PURE__ */ jsxs("div", { className: "seo-highlight-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "seo-highlight-tile", children: [
            /* @__PURE__ */ jsx("span", { className: "seo-highlight-kicker", children: "Buy smarter" }),
            /* @__PURE__ */ jsx("h2", { className: "seo-sub-heading", children: t("seo.smarter_title") }),
            /* @__PURE__ */ jsx("p", { children: t("seo.smarter_one") }),
            /* @__PURE__ */ jsx("p", { children: t("seo.smarter_two") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "seo-highlight-tile seo-highlight-tile--accent", children: [
            /* @__PURE__ */ jsx("span", { className: "seo-highlight-kicker", children: "Bid with confidence" }),
            /* @__PURE__ */ jsx("h2", { className: "seo-sub-heading", children: t("seo.fair_title") }),
            /* @__PURE__ */ jsx("p", { children: t("seo.fair_intro") }),
            /* @__PURE__ */ jsx("ul", { className: "seo-check-list", children: fairList.map((item) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { className: "seo-check-icon", children: /* @__PURE__ */ jsx("i", { className: "fas fa-check", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)) }),
            /* @__PURE__ */ jsx("p", { className: "seo-outro-copy", children: t("seo.fair_outro") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "seo-seller-panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "seo-seller-copy", children: [
          /* @__PURE__ */ jsx("span", { className: "seo-panel-kicker", children: "For sellers" }),
          /* @__PURE__ */ jsx("h2", { className: "seo-sub-heading", children: t("seo.sell_title") }),
          /* @__PURE__ */ jsx("p", { children: t("seo.sell_one") }),
          /* @__PURE__ */ jsx("p", { children: t("seo.sell_two") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "seo-standout-card", children: [
          /* @__PURE__ */ jsx("span", { className: "seo-panel-kicker", children: "Why people choose us" }),
          /* @__PURE__ */ jsx("h3", { className: "seo-card-heading", children: t("seo.stand_out_title") }),
          /* @__PURE__ */ jsx("div", { className: "seo-feature-grid", children: features.map((feature) => /* @__PURE__ */ jsxs("div", { className: "seo-feature-chip", children: [
            /* @__PURE__ */ jsx("span", { className: "seo-feature-icon", children: /* @__PURE__ */ jsx("i", { className: "fas fa-bolt", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsx("span", { children: feature })
          ] }, feature)) }),
          /* @__PURE__ */ jsx("p", { className: "seo-closing-copy", children: t("seo.closing") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .seo-content-section {
          position: relative;
          overflow: hidden;
          padding: 72px 0 90px;
          background:
            radial-gradient(circle at top left, rgba(242, 201, 76, 0.20), transparent 34%),
            radial-gradient(circle at top right, rgba(15, 23, 42, 0.10), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
          color: #0f172a;
        }
        .seo-content-section::before,
        .seo-content-section::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(10px);
        }
        .seo-content-section::before {
          width: 280px;
          height: 280px;
          top: -90px;
          left: -60px;
          background: rgba(251, 191, 36, 0.15);
        }
        .seo-content-section::after {
          width: 360px;
          height: 360px;
          right: -120px;
          bottom: -160px;
          background: rgba(14, 165, 233, 0.10);
        }
        .seo-content-shell {
          position: relative;
          z-index: 1;
        }
        .seo-hero-card {
          position: relative;
          padding: 44px;
          border-radius: 36px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.82)),
            linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(248, 250, 252, 0.35));
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .seo-badge,
        .seo-panel-kicker,
        .seo-highlight-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .seo-badge {
          margin-bottom: 20px;
          background: linear-gradient(135deg, #fff3cd, #fef7e7);
          color: #9a6700;
          border: 1px solid rgba(242, 201, 76, 0.45);
        }
        .seo-main-heading {
          max-width: 960px;
          margin: 0 auto 20px;
          text-align: center;
          font-size: clamp(2.35rem, 4vw, 4.3rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }
        .seo-lead,
        .seo-support-copy {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          color: #475569;
          line-height: 1.85;
        }
        .seo-lead {
          margin-bottom: 14px;
          font-size: 1.17rem;
        }
        .seo-support-copy {
          margin-bottom: 34px;
          font-size: 1.03rem;
        }
        .seo-highlight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 10px;
        }
        .seo-highlight-tile {
          height: 100%;
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-highlight-tile--accent {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }
        .seo-sub-heading {
          margin: 14px 0 14px;
          font-size: clamp(1.6rem, 2vw, 2.15rem);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111827;
        }
        .seo-highlight-tile p,
        .seo-seller-copy p,
        .seo-closing-copy {
          margin-bottom: 0;
          color: #475569;
          line-height: 1.8;
          font-size: 1rem;
        }
        .seo-highlight-tile p + p,
        .seo-seller-copy p + p {
          margin-top: 12px;
        }
        .seo-check-list {
          list-style: none;
          padding: 0;
          margin: 18px 0 0;
          display: grid;
          gap: 12px;
        }
        .seo-check-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #1e293b;
          font-weight: 600;
        }
        .seo-check-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0f172a, #334155);
          color: #ffffff;
          font-size: 11px;
          margin-top: 1px;
        }
        .seo-outro-copy {
          margin-top: 18px !important;
        }
        .seo-seller-panel {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 24px;
          margin-top: 26px;
        }
        .seo-seller-copy,
        .seo-standout-card {
          padding: 30px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
        }
        .seo-card-heading {
          margin: 14px 0 18px;
          font-size: 1.7rem;
          line-height: 1.2;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }
        .seo-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .seo-feature-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 64px;
          padding: 14px 16px;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.95);
          color: #1e293b;
          font-weight: 600;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        }
        .seo-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b, #facc15);
          color: #ffffff;
          font-size: 13px;
          box-shadow: 0 10px 18px rgba(245, 158, 11, 0.24);
        }
        .seo-closing-copy {
          margin-top: 18px;
          font-weight: 700;
          color: #0f172a;
        }
        @media (max-width: 991px) {
          .seo-content-section {
            padding: 56px 0 72px;
          }
          .seo-hero-card {
            padding: 30px 22px;
            border-radius: 26px;
          }
          .seo-highlight-grid,
          .seo-seller-panel,
          .seo-feature-grid {
            grid-template-columns: 1fr;
          }
          .seo-highlight-tile,
          .seo-seller-copy,
          .seo-standout-card {
            padding: 24px 20px;
            border-radius: 24px;
          }
          .seo-main-heading {
            max-width: 100%;
          }
        }
        @media (max-width: 576px) {
          .seo-content-section {
            padding: 46px 0 58px;
          }
          .seo-main-heading {
            font-size: 2rem;
          }
          .seo-lead,
          .seo-support-copy {
            font-size: 0.98rem;
            line-height: 1.75;
          }
          .seo-sub-heading,
          .seo-card-heading {
            font-size: 1.45rem;
          }
          .seo-badge,
          .seo-panel-kicker,
          .seo-highlight-kicker {
            font-size: 11px;
            letter-spacing: 0.06em;
          }
          .seo-feature-chip {
            min-height: 58px;
          }
        }
      ` })
  ] });
};
function Home({ auth, sliders, categories, featuredAuctions, latestAuctions, latestVehicles, latestProperties, latestNormalLists, favoriteListingIds }) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsx(AppLayout, { title: t("Online Auction Marketplace Pakistan | Bid & Sell on XpertBid"), children: /* @__PURE__ */ jsxs("div", { className: "home-page overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(HeroSection, { sliders }),
    /* @__PURE__ */ jsx(SliderBrowseCategories, { categories }),
    /* @__PURE__ */ jsx(FeaturedProducts, { products: featuredAuctions }),
    /* @__PURE__ */ jsx(VehicleSection, { products: latestVehicles }),
    /* @__PURE__ */ jsx(PropertySection, { products: latestProperties }),
    /* @__PURE__ */ jsx(AuctionSection, { products: latestAuctions }),
    /* @__PURE__ */ jsx(NormalListSection, { products: latestNormalLists }),
    /* @__PURE__ */ jsx(WhyChooseXpertBid, {}),
    /* @__PURE__ */ jsx(SeoContentSection, {})
  ] }) });
}
export {
  Home as default
};
