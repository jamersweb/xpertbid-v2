import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-J8lQ9IQV.js";
import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Grid, Pagination } from "swiper/modules";
/* empty css                */
import { C as CountdownTimer, O as OwnerInfoRow } from "./OwnerInfoRow-DymfsfZX.js";
import { P as Price } from "./Price-Bjh-N9Qv.js";
import { F as FavoriteToggleButton } from "./FavoriteToggleButton-1jmbejDw.js";
import { FaClock, FaGlobe, FaClipboardList } from "react-icons/fa";
import "react";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
const heroSlides = [
  {
    image: "/assets/images/1_rupee.png",
    href: "/1-rupee-auctions"
  },
  {
    image: "/assets/images/WebsiteBanner1.png",
    href: "/marketplace"
  },
  {
    image: "/assets/images/WebsiteBanner2.png",
    href: "/search"
  },
  {
    image: "/assets/images/WebsiteBanner3.png",
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
        children: heroSlides.map((slide, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(Link, { href: slide.href, className: "hero-banner-link", children: /* @__PURE__ */ jsx("img", { src: slide.image, alt: `Hero Banner ${index + 1}`, className: "hero-banner-image" }) }) }, slide.image))
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

        .hero-banner-link {
          display: block;
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-banner-image {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }

        .hero-slider .swiper-button-prev,
        .hero-slider .swiper-button-next {
          display: none !important;
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
          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide,
          .hero-banner-link {
            border-radius: 24px;
          }

          .hero-banner-image {
            height: 320px;
          }
        }
      ` })
  ] });
}
function SliderBrowseCategories({ categories }) {
  return /* @__PURE__ */ jsxs("section", { className: "browsecategories pt-4 pb-4", style: { backgroundColor: "#F7F8F9" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "container-fluid", children: [
      /* @__PURE__ */ jsx("div", { className: "categories-grid-container d-none d-md-block", children: categories.map((cat, i) => /* @__PURE__ */ jsx("div", { className: "category-item-wrapper", children: /* @__PURE__ */ jsxs(
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
      ) }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "d-md-none", children: /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Autoplay, Grid],
          grid: {
            rows: 2,
            fill: "row"
          },
          autoplay: { delay: 3e3, disableOnInteraction: false },
          slidesPerView: 3.5,
          spaceBetween: 10,
          breakpoints: {
            360: { slidesPerView: 4, spaceBetween: 10 },
            480: { slidesPerView: 5.5, spaceBetween: 10 }
          },
          className: "categories-swiper-no-nav p-2",
          children: categories.map((cat, i) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: `/marketplace?category=${cat.slug}`,
              className: "text-decoration-none category-link",
              children: /* @__PURE__ */ jsxs("div", { className: "category-item-wrapper mobile-item", children: [
                /* @__PURE__ */ jsx("div", { className: "image-circle", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `${cat.image?.startsWith("/") ? "" : "/"}${cat.image ?? "images/placeholder.png"}`,
                    alt: cat.name,
                    className: "category-icon"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "category-title-wrapper", children: /* @__PURE__ */ jsx("h3", { className: "category-name", children: cat.name }) })
              ] })
            }
          ) }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .section-title {
          font-weight: 700;
          color: #002f34;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .categories-grid-container {
          grid-template-columns: repeat(8, 1fr);
          gap: 25px;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
            .categories-grid-container {
                display: grid !important;
            }
        }

        .category-item-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s ease;
        }
        
        .mobile-item {
            width: 100%;
        }

        .category-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          width: 100%;
        }
        
        .image-circle {
          width: 120px; 
          height: 120px;
          border-radius: 15%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          overflow: hidden;
          background-color: #f2f4f5;
        }

        .category-icon {
          width: 80%;
          height: 80%;
          object-fit: cover;
          border-radius: 10%;
        }

        .category-title-wrapper {
          width: 120px;
          display: flex;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 14px;
          color: #002f34;
          margin: 0;
          line-height: 1.3;
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

        @media (max-width: 768px) {
           .image-circle {
               width: 80px;
               height: 80px;
           }
           .category-name {
               font-size: 13px;
           }
           .category-title-wrapper {
               width: 90px;
           }
        }
        
        .categories-swiper-no-nav .swiper-button-next,
        .categories-swiper-no-nav .swiper-button-prev { display: none !important; }
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
  const displayProducts = (products || []).slice(0, 3);
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: "Featured Listings" }) }),
      /* @__PURE__ */ jsx(Link, { href: "/search", className: "section-view-all-btn", children: "View All" })
    ] }),
    displayProducts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "row g-4", children: displayProducts.map((product, index) => {
      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
      const minBid = Number(product?.minimum_bid ?? 0);
      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
      const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
      const isNormalList = normalizedListType === "normal" || normalizedListType === "normal_list";
      const displayLabel = isNormalList ? "Price" : hasMaxBid ? "Current Bid" : "Minimum Bid";
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
            fallbackAvatar: product.user?.profile_pic
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
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? "Buy Now" : "Place Bid" }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) }) : /* @__PURE__ */ jsx("p", { children: "No products found." })
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
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: "Latest Vehicles" }) }),
      /* @__PURE__ */ jsx(Link, { href: "/search?category_id=311", className: "section-view-all-btn", children: "View All" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4", children: displayProducts.map((product, index) => {
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
            fallbackAvatar: product.user?.profile_pic
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? "Current Bid" : "Minimum Bid" }),
            /* @__PURE__ */ jsx("p", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "me-1", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? "Buy Now" : "Place Bid" }) }) })
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
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: "Latest Properties" }) }),
      /* @__PURE__ */ jsx(Link, { href: "/search?category_id=222", className: "section-view-all-btn", children: "View All" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4", children: displayProducts.map((product, index) => {
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
            fallbackAvatar: product.user?.profile_pic
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? "Current Bid" : "Minimum Bid" }),
            /* @__PURE__ */ jsx("p", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "me-1", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isNormalList ? "Buy Now" : "Place Bid" }) }) })
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
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", style: { backgroundColor: "#F9F9F9" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: "Latest Auctions" }) }),
      /* @__PURE__ */ jsx(Link, { href: "/search", className: "section-view-all-btn", children: "View All" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4", children: displayProducts.map((product, index) => {
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
            fallbackAvatar: product.user?.profile_pic
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name || "Untitled" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: hasMaxBid ? "Current Bid" : "Minimum Bid" }),
            /* @__PURE__ */ jsx("div", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "price", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: "Place Bid" }) }) })
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
  const displayProducts = (products || []).slice(0, 3);
  if (displayProducts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "home-section-header", children: [
      /* @__PURE__ */ jsx("div", { className: "featured-heading mb-0", children: /* @__PURE__ */ jsx("h2", { children: "Latest Listings" }) }),
      /* @__PURE__ */ jsx(Link, { href: "/marketplace", className: "section-view-all-btn", children: "View All" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-4", children: displayProducts.map((product, index) => {
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
            fallbackAvatar: product.user?.profile_pic
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, className: "text-color-black", children: product.title || product.name }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
          /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
            /* @__PURE__ */ jsx("span", { children: isBusinessListing ? "Business Price" : "Price" }),
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
          /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${product.slug}`, children: isBusinessListing ? "View Product" : "Buy Now" }) }) })
        ] })
      ] }) }, `${product.slug}-${index}`);
    }) })
  ] }) });
}
function WhyChooseXpertBid() {
  const whyChooseData = [
    {
      icon: /* @__PURE__ */ jsx(FaClock, {}),
      title: "Real-time Auctions",
      description: "Get better offers through live bidding."
    },
    {
      icon: /* @__PURE__ */ jsx(FaGlobe, {}),
      title: "Wide Market Reach",
      description: "Pakistan, UAE & expanding regions."
    },
    {
      icon: /* @__PURE__ */ jsx(FaClipboardList, {}),
      title: "Easy Listing & Tracking",
      description: "Tools to list and manage all your sales."
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "why-choose-section pt-5 bg-light", children: [
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center mb-4 heading-text", style: { fontWeight: 700, color: "#333" }, children: "Why Choose XpertBid?" }),
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
  return /* @__PURE__ */ jsxs("section", { className: "seo-content-section pb-5 bg-light", children: [
    /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsx("div", { className: "col-lg-10", children: /* @__PURE__ */ jsxs("div", { className: "content-wrapper", children: [
      /* @__PURE__ */ jsx("h1", { className: "main-heading mb-4 text-center", children: "XpertBid Pakistan’s Trusted Online Auction Marketplace" }),
      /* @__PURE__ */ jsx("p", { className: "lead text-center mb-5", children: "Welcome to XpertBid, a modern online auction marketplace designed for everyone in Pakistan who wants to buy or sell with confidence. Our platform brings you real-time bidding, verified listings, and a simple buying experience that makes online trading completely transparent." }),
      /* @__PURE__ */ jsx("p", { className: "text-center mb-5", children: "From everyday items to premium assets, XpertBid is the fastest-growing bidding marketplace where people compete fairly and get the best value all through a seamless digital system." }),
      /* @__PURE__ */ jsxs("div", { className: "row mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-4 mb-md-0", children: [
          /* @__PURE__ */ jsx("h2", { className: "sub-heading mb-3", children: "A Smarter Way to Buy & Sell in Pakistan" }),
          /* @__PURE__ */ jsx("p", { children: "XpertBid combines the convenience of an online marketplace in Pakistan with the excitement of real-time auctions. Whether you’re looking for electronics, vehicles, property, furniture, or collectibles you’ll find live auctions running every day." }),
          /* @__PURE__ */ jsx("p", { children: "Each listing comes with clear details, verified seller, and starting bids so you always know exactly what you’re getting." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "sub-heading mb-3", children: "Fair, Fast & Fully Transparent Auctions" }),
          /* @__PURE__ */ jsx("p", { children: "Our goal is simple: make auctions as open and trustworthy as possible. On XpertBid, you can:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-unstyled check-list", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-check-circle text-primary me-2" }),
              "Join real-time auctions"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-check-circle text-primary me-2" }),
              "Place competitive bids instantly"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-check-circle text-primary me-2" }),
              "Track price changes live"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-check-circle text-primary me-2" }),
              "Explore verified listings"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("i", { className: "fas fa-check-circle text-primary me-2" }),
              "Discover deals based on true market demand"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3", children: "No inflated pricing. No hidden negotiations. Just a clean auction marketplace where every bid counts and the best price wins." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "row align-items-center mb-5", children: /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "sub-heading mb-3", children: "Sell Smarter With Competitive Bidding" }),
        /* @__PURE__ */ jsx("p", { children: "If you want to sell, XpertBid helps you reach serious buyers quickly. Upload your item, set your details, choose a starting bid, and let the marketplace do the work for you." }),
        /* @__PURE__ */ jsx("p", { children: "Competitive bidding naturally increases the final price giving sellers real value, not lowball offers. XpertBid is the go to buy & sell marketplace for individuals, sellers, and small businesses." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "why-choose-box p-4 rounded bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "h3-heading mb-4 text-center", children: "Why XpertBid Stands Out" }),
        /* @__PURE__ */ jsxs("div", { className: "row g-3", children: [
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "Trusted auction marketplace" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "Verified sellers & listings" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "A growing community of real buyers" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "Market-driven pricing" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "Secure bidding environment" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-md-4 col-sm-6", children: /* @__PURE__ */ jsxs("div", { className: "feature-item d-flex align-items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fas fa-check text-success me-2" }),
            /* @__PURE__ */ jsx("span", { children: "Simple experience for both buyers & sellers" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsx("p", { className: "mb-0 fw-bold", children: "XpertBid is building the future of online auctions in Pakistan faster, smarter, and completely transparent." }) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .seo-content-section {
          background-color: #f8f9fa;
          color: #333;
        }
        .main-heading {
          font-weight: 700;
          color: #1a1a1a;
          font-size: 2.5rem;
        }
        .sub-heading {
          font-weight: 600;
          color: #2c2c2c;
          font-size: 1.75rem;
        }
        .h3-heading {
          font-weight: 600;
          color: #2c2c2c;
          font-size: 1.5rem;
        }
        .content-wrapper p {
          line-height: 1.7;
          color: #555;
        }
        .check-list li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        .feature-item {
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .main-heading {
            font-size: 1.8rem;
          }
          .sub-heading {
            font-size: 1.5rem;
          }
          .h3-heading {
            font-size: 1.3rem;
          }
        }
      ` })
  ] });
};
function Home({ auth, sliders, categories, featuredAuctions, latestAuctions, latestVehicles, latestProperties, latestNormalLists, favoriteListingIds }) {
  return /* @__PURE__ */ jsx(AppLayout, { title: "Online Auction Marketplace Pakistan | Bid & Sell on XpertBid", children: /* @__PURE__ */ jsxs("div", { className: "home-page overflow-x-hidden", children: [
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
