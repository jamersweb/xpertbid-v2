import { jsxs, jsx } from "react/jsx-runtime";
import { Link, usePage, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D8SyV4pl.js";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
/* empty css                */
/* empty css                    */
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { C as CountdownTimer } from "./OwnerInfoRow-C3IMd42a.js";
import { B as BidSection, a as BidHistory } from "./BidHistory-Cat596rx.js";
import { A as AuctionCard } from "./AuctionCard-CKL8Vumi.js";
import { L as ListingLiveChat } from "./ListingLiveChat-Bt0qLAKB.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./FavoriteToggleButton-1jmbejDw.js";
function ProductHeader({ views, productId, slug, link }) {
  const shareUrl = typeof window !== "undefined" ? link || `${window.location.origin}/product/${slug}` : "";
  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => alert("Link copied to clipboard!")).catch((err) => console.error("Failed to copy link:", err));
  };
  return /* @__PURE__ */ jsxs("section", { className: "prodcut-detail-links product-detail-header-section", style: { paddingTop: "100px" }, children: [
    /* @__PURE__ */ jsx("div", { className: "container-fluid", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "product-back-and-head", children: [
        /* @__PURE__ */ jsx(Link, { href: "/marketplace", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
        /* @__PURE__ */ jsx("h3", { children: "Product Detail" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "product-copy-and-view", children: [
        /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              style: { marginRight: "8px" },
              children: [
                /* @__PURE__ */ jsx("path", { d: "M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z", fill: "#43ACE9", stroke: "#43ACE9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
                /* @__PURE__ */ jsx("path", { d: "M12.0001 20.2702C15.5301 20.2702 18.8201 18.1902 21.1101 14.5902C22.0101 13.1802 22.0101 10.8102 21.1101 9.40021C18.8201 5.80021 15.5301 3.72021 12.0001 3.72021C8.47009 3.72021 5.18009 5.80021 2.89009 9.40021C1.99009 10.8102 1.99009 13.1802 2.89009 14.5902C5.18009 18.1902 8.47009 20.2702 12.0001 20.2702Z", stroke: "#43ACE9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
              ]
            }
          ),
          views || 0
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: handleCopyLink, className: "copy-link-button", style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", style: { marginRight: "12px" }, children: [
            /* @__PURE__ */ jsx("path", { d: "M20.3601 12.7301C19.9901 12.7301 19.6801 12.4501 19.6401 12.0801C19.4001 9.88007 18.2201 7.90007 16.4001 6.64007C16.0701 6.41007 15.9901 5.96007 16.2201 5.63007C16.4501 5.30007 16.9001 5.22007 17.2301 5.45007C19.4001 6.96007 20.8001 9.32007 21.0901 11.9301C21.1301 12.3301 20.8401 12.6901 20.4401 12.7301C20.4101 12.7301 20.3901 12.7301 20.3601 12.7301Z", fill: "#23262F" }),
            /* @__PURE__ */ jsx("path", { d: "M3.74029 12.7802C3.72029 12.7802 3.69029 12.7802 3.67029 12.7802C3.27029 12.7402 2.98029 12.3802 3.02029 11.9802C3.29029 9.3702 4.67029 7.0102 6.82029 5.4902C7.14029 5.2602 7.60029 5.3402 7.83029 5.6602C8.06029 5.9902 7.98029 6.4402 7.66029 6.6702C5.86029 7.9502 4.69029 9.9302 4.47029 12.1202C4.43029 12.5002 4.11029 12.7802 3.74029 12.7802Z", fill: "#23262F" }),
            /* @__PURE__ */ jsx("path", { d: "M15.9896 21.0998C14.7596 21.6898 13.4396 21.9898 12.0596 21.9898C10.6196 21.9898 9.24961 21.6698 7.96961 21.0198C7.60961 20.8498 7.46961 20.4098 7.64961 20.0498C7.81961 19.6898 8.25961 19.5498 8.61961 19.7198C9.24961 20.0398 9.91961 20.2598 10.5996 20.3898C11.5196 20.5698 12.4596 20.5798 13.3796 20.4198C14.0596 20.2998 14.7296 20.0898 15.3496 19.7898C15.7196 19.6198 16.1596 19.7598 16.3196 20.1298C16.4996 20.4898 16.3596 20.9298 15.9896 21.0998Z", fill: "#23262F" }),
            /* @__PURE__ */ jsx("path", { d: "M12.0505 2.00977C10.5005 2.00977 9.23047 3.26977 9.23047 4.82977C9.23047 6.38977 10.4905 7.64977 12.0505 7.64977C13.6105 7.64977 14.8705 6.38977 14.8705 4.82977C14.8705 3.26977 13.6105 2.00977 12.0505 2.00977Z", fill: "#23262F" }),
            /* @__PURE__ */ jsx("path", { d: "M5.05047 13.8701C3.50047 13.8701 2.23047 15.1301 2.23047 16.6901C2.23047 18.2501 3.49047 19.5101 5.05047 19.5101C6.61047 19.5101 7.87047 18.2501 7.87047 16.6901C7.87047 15.1301 6.60047 13.8701 5.05047 13.8701Z", fill: "#23262F" }),
            /* @__PURE__ */ jsx("path", { d: "M18.9499 13.8701C17.3999 13.8701 16.1299 15.1301 16.1299 16.6901C16.1299 18.2501 17.3899 19.5101 18.9499 19.5101C20.5099 19.5101 21.7699 18.2501 21.7699 16.6901C21.7699 15.1301 20.5099 13.8701 18.9499 13.8701Z", fill: "#23262F" })
          ] }),
          "Share"
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                            @media (max-width: 767px) {
                                   .product-detail-header-section {
                                          padding-top: 36px !important;
                                   }
                            }
                     ` })
  ] });
}
function ProductImages({ albumImages, videos = null, status, mainImage, listType, startDate, endDate, youtubeVideoId = null }) {
  let parsedAlbum = [];
  if (Array.isArray(albumImages)) {
    parsedAlbum = albumImages;
  } else if (typeof albumImages === "string") {
    try {
      parsedAlbum = JSON.parse(albumImages.replace(/\\/g, ""));
    } catch (e) {
      parsedAlbum = [];
    }
  }
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  let parsedVideos = [];
  if (Array.isArray(videos)) {
    parsedVideos = videos;
  } else if (typeof videos === "string" && videos) {
    try {
      parsedVideos = JSON.parse(videos.replace(/\\/g, ""));
    } catch (e) {
    }
  }
  const isVideoFile = (filename) => {
    if (!filename || typeof filename !== "string") return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv"];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
    return videoExtensions.includes(extension);
  };
  const processedAlbum = parsedAlbum.map((item) => ({
    type: isVideoFile(item) ? "video" : "image",
    src: item
  }));
  const processedVideos = parsedVideos.map((item) => ({
    type: "video",
    src: item
  }));
  const youtubeMedia = youtubeVideoId && typeof youtubeVideoId === "string" && youtubeVideoId.length === 11 ? [{ type: "youtube", src: youtubeVideoId }] : [];
  const allMedia = [...youtubeMedia, ...processedAlbum, ...processedVideos];
  if (allMedia.length === 0 && mainImage) {
    allMedia.push({ type: "image", src: mainImage });
  }
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const getUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://admin.xpertbid.com/${cleanPath}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "product-images-parent m-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "product-main-image", style: { position: "relative" }, children: [
      (status === "awarded" || status === "awarded ") && /* @__PURE__ */ jsx("div", { className: "awardedBadge", style: {
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "linear-gradient(135deg, #43ACE9 0%, #0ea5e9 100%)",
        color: "white",
        padding: "8px 24px",
        borderRadius: "50px",
        fontWeight: "800",
        fontSize: "0.9rem",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        boxShadow: "0 10px 15px -3px rgba(67, 172, 233, 0.4)",
        whiteSpace: "nowrap",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        animation: "pulseGlow 2s infinite"
      }, children: "AWARDED" }),
      String(listType || "").toLowerCase() === "auction" && endDate && /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "18px",
        zIndex: 15,
        pointerEvents: "none"
      }, children: /* @__PURE__ */ jsx(CountdownTimer, { startDate, endDate, className: "detail-image-timer" }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          ref: prevRef,
          className: "btn-prev",
          style: {
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            border: "none",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          },
          children: "‹"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          ref: nextRef,
          className: "btn-next",
          style: {
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            border: "none",
            background: "rgba(0,0,0,0.45)",
            color: "#fff",
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          },
          children: "›"
        }
      ),
      /* @__PURE__ */ jsx(
        Swiper,
        {
          style: {
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
            margin: "0px"
          },
          loop: allMedia.length > 1,
          spaceBetween: 10,
          navigation: {
            prevEl: prevRef.current,
            nextEl: nextRef.current
          },
          onBeforeInit: (swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          },
          thumbs: { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null },
          modules: [FreeMode, Navigation, Thumbs],
          className: "mySwiper2 m-0",
          children: allMedia.map((media, index) => /* @__PURE__ */ jsx(SwiperSlide, { style: { margin: "0px" }, children: /* @__PURE__ */ jsx("div", { className: "pro-image-main", style: { position: "relative", width: "100%", minHeight: "500px" }, children: media.type === "youtube" ? /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%", minHeight: "500px", background: "#000", borderRadius: "10px", overflow: "hidden" }, children: /* @__PURE__ */ jsx(
            "iframe",
            {
              title: "YouTube live stream",
              src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.src)}?rel=0`,
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              allowFullScreen: true,
              loading: "lazy",
              referrerPolicy: "strict-origin-when-cross-origin",
              style: { position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }
            }
          ) }) : media.type === "image" ? /* @__PURE__ */ jsx(
            "img",
            {
              src: getUrl(media.src),
              alt: `Product ${index}`,
              style: { width: "100%", height: "100%", minHeight: "500px", objectFit: "cover", borderRadius: "10px" },
              onError: (e) => {
                e.target.src = "/assets/images/hero-prodcut1.jpg";
              }
            }
          ) : /* @__PURE__ */ jsx("video", { controls: true, style: { width: "100%", height: "100%", minHeight: "500px", objectFit: "cover", borderRadius: "10px" }, children: /* @__PURE__ */ jsx("source", { src: getUrl(media.src), type: "video/mp4" }) }) }) }, index))
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
                                   @keyframes pulseGlow {
                                          0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0.7); }
                                          50% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 10px rgba(67, 172, 233, 0); }
                                          100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0); }
                                   }
                                   @keyframes timerFloat {
                                          0%, 100% { transform: translateY(0); }
                                          50% { transform: translateY(-2px); }
                                   }
                                   @keyframes timerGlow {
                                          0%, 100% { box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28); }
                                          50% { box-shadow: 0 14px 28px rgba(67, 172, 233, 0.28); }
                                   }
                                   @keyframes digitPulse {
                                          0%, 100% { transform: scale(1); opacity: 1; }
                                          50% { transform: scale(1.06); opacity: 0.96; }
                                   }
                                   .detail-image-timer.counter {
                                          position: relative;
                                          margin: 0 auto;
                                          width: calc(100% - 32px);
                                          max-width: 360px;
                                          background: rgba(28, 29, 32, 0.88);
                                          padding: 10px 14px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
                                          backdrop-filter: blur(4px);
                                          border: 1px solid rgba(255, 255, 255, 0.08);
                                          animation: timerFloat 2.8s ease-in-out infinite, timerGlow 2.8s ease-in-out infinite;
                                   }
                                   .detail-image-timer .counter-grid {
                                          display: grid;
                                          grid-template-columns: repeat(4, 1fr);
                                          gap: 8px;
                                          align-items: stretch;
                                   }
                                   .detail-image-timer .counter-box {
                                          display: flex;
                                          flex-direction: column;
                                          align-items: center;
                                          justify-content: center;
                                          min-width: 0;
                                   }
                                   .detail-image-timer .counter-value {
                                          color: #fff;
                                          font-size: 18px;
                                          font-weight: 800;
                                          line-height: 1.1;
                                          text-align: center;
                                          white-space: nowrap;
                                          animation: digitPulse 1.2s ease-in-out infinite;
                                    }
                                    .detail-image-timer .counter-label {
                                          color: rgba(255, 255, 255, 0.88);
                                          font-size: 9px;
                                          font-weight: 600;
                                          text-transform: uppercase;
                                          letter-spacing: 0.5px;
                                          text-align: center;
                                          white-space: nowrap;
                                   }
                                    @media (max-width: 575px) {
                                          .detail-image-timer.counter {
                                                 width: calc(100% - 20px);
                                                 padding: 8px 10px;
                                          }
                                          .detail-image-timer .counter-grid {
                                                 gap: 6px;
                                          }
                                          .detail-image-timer .counter-value {
                                                 font-size: 16px;
                                          }
                                          .detail-image-timer .counter-label {
                                                 font-size: 8px;
                                          }
                                   }
                            ` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "product-images-album", style: { height: "auto", marginTop: "15px", paddingBottom: "5px" }, children: /* @__PURE__ */ jsx(
      Swiper,
      {
        onSwiper: setThumbsSwiper,
        loop: allMedia.length > 4,
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        modules: [FreeMode, Navigation, Thumbs],
        className: "mySwiper",
        children: allMedia.map((media, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("div", { className: "pro-image", style: { height: "100%", position: "relative", minHeight: "80px" }, children: media.type === "youtube" ? /* @__PURE__ */ jsx("div", { style: {
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "80px",
          background: `url(https://img.youtube.com/vi/${media.src}/hqdefault.jpg) center/cover`,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx("span", { style: {
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "rgba(220, 38, 38, 0.92)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)"
        }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play", style: { fontSize: 13, marginLeft: 2 } }) }) }) : media.type === "image" ? /* @__PURE__ */ jsx(
          "img",
          {
            src: getUrl(media.src),
            alt: `Thumb ${index}`,
            style: { width: "100%", height: "100%", minHeight: "80px", objectFit: "cover", borderRadius: "8px" },
            onError: (e) => {
              e.target.src = "/assets/images/hero-prodcut1.jpg";
            }
          }
        ) : /* @__PURE__ */ jsx("div", { style: {
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "80px",
          background: "#000",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-white" }) }) }) }, index))
      }
    ) })
  ] });
}
function RelatedItems({ items }) {
  if (!items || items.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "featured-product related-items-section", children: /* @__PURE__ */ jsxs("div", { className: "container-fluid ps-sm-5", children: [
    /* @__PURE__ */ jsx("div", { className: "product-detail", children: /* @__PURE__ */ jsx("h2", { children: "Other items of interest" }) }),
    /* @__PURE__ */ jsx("div", { className: "swiper-featured-product related-items-slider", children: /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Navigation],
        navigation: items.length > 4,
        spaceBetween: 30,
        loop: items.length > 4,
        breakpoints: {
          390: { slidesPerView: 1 },
          550: { slidesPerView: 2 },
          888: { slidesPerView: 2 },
          1024: { slidesPerView: 3.2 },
          1367: { slidesPerView: 3.6 },
          1567: { slidesPerView: 4 }
        },
        children: items.map((item) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(AuctionCard, { auction: item }) }, item.id))
      }
    ) })
  ] }) });
}
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: `xb-accordion ${open ? "open" : ""}`, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "xb-acc-head",
        onClick: () => setOpen((o) => !o),
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsx("span", { children: title }),
          /* @__PURE__ */ jsx("i", { className: `fa-solid ${open ? "fa-chevron-up" : "fa-chevron-down"}` })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "xb-acc-body", children })
  ] });
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function formatHuman(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const mon = monthNames[dt.getMonth()];
  return `${dd}/${mm}/${mon}`;
}
function Show({ auction, bids, related, highestBid, winnerDetails, isFavorite, dynamicFields = [] }) {
  const { auth } = usePage().props;
  const listingType = String(auction?.listing_type || "").toLowerCase();
  const listingStatus = String(auction?.status || "").trim().toLowerCase();
  const isAuctionLikeListing = ["auction", "live_auction"].includes(listingType);
  const showLiveChat = isAuctionLikeListing && listingStatus === "active";
  const categoryFeatures = auction?.category_features && typeof auction.category_features === "object" ? auction.category_features : {};
  const fieldNameCounts = dynamicFields.reduce((acc, field) => {
    const key = String(field?.field_name || "").trim();
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const prettifyKey = (rawKey) => String(rawKey || "").replace(/^field_/, "").replace(/__\d+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
  const formatFeatureValue = (value) => {
    if (value === null || value === void 0 || value === "") return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };
  const mappedKeys = /* @__PURE__ */ new Set();
  const dynamicFeatureRows = dynamicFields.map((field) => {
    const idKey = `field_${field.id}`;
    const base = String(field?.field_name || "").trim();
    const featureKey = fieldNameCounts[base] > 1 ? `${base}__${field.id}` : base;
    const value = categoryFeatures[idKey] ?? categoryFeatures[featureKey] ?? categoryFeatures[base] ?? "";
    const formatted = formatFeatureValue(value);
    if (!formatted) return null;
    mappedKeys.add(idKey);
    if (base) mappedKeys.add(base);
    if (featureKey) mappedKeys.add(featureKey);
    return {
      key: idKey,
      label: field?.label || prettifyKey(base || idKey),
      value: formatted
    };
  }).filter(Boolean);
  const fallbackRows = Object.entries(categoryFeatures).filter(([key, value]) => !mappedKeys.has(key) && formatFeatureValue(value)).map(([key, value]) => ({
    key,
    label: prettifyKey(key),
    value: formatFeatureValue(value)
  }));
  const allFeatureRows = [...dynamicFeatureRows, ...fallbackRows];
  return /* @__PURE__ */ jsxs(AppLayout, { title: auction.title, children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("meta", { name: "description", content: auction.description?.substring(0, 160) }) }),
    /* @__PURE__ */ jsx(
      ProductHeader,
      {
        views: auction.views,
        productId: auction.id,
        slug: auction.slug
      }
    ),
    auction.slug === "car-showcase-4-vkxgiyxw" && /* @__PURE__ */ jsx("div", { className: "container-fluid pt-3", children: /* @__PURE__ */ jsxs("div", { className: "alert alert-primary d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0", role: "status", children: [
      /* @__PURE__ */ jsxs("span", { className: "small mb-0", children: [
        /* @__PURE__ */ jsx("strong", { children: "Live demo:" }),
        " open the same auction with YouTube video, XpertBid live chat, and bidding in one layout."
      ] }),
      /* @__PURE__ */ jsx(Link, { href: route("demo.live_auction_car_showcase"), className: "btn btn-sm btn-light text-primary fw-semibold", children: "Open live demo" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "product-image-and-brief", children: /* @__PURE__ */ jsx("div", { className: "container-fluid", children: /* @__PURE__ */ jsx("div", { className: `products-brief-parent${auction.featured_name === "home_featured" ? " listing_promoted" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsx(
        ProductImages,
        {
          albumImages: auction.album_urls,
          videos: auction.video,
          status: auction.status,
          mainImage: auction.image_url,
          listType: auction.list_type,
          startDate: auction.start_date,
          endDate: auction.end_date,
          youtubeVideoId: auction.youtube_video_id
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        auction.featured_name === "home_featured" && /* @__PURE__ */ jsx("div", { style: { display: "block" }, children: /* @__PURE__ */ jsxs("button", { type: "button", className: "pro_feature", disabled: true, children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bolt me-2" }),
          "Featured"
        ] }) }),
        /* @__PURE__ */ jsx(
          BidSection,
          {
            product: auction,
            highestBidProp: highestBid,
            onBidPlaced: () => {
            },
            winnerDetails,
            isFavoriteProp: isFavorite
          }
        )
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "product-detailed-info", children: /* @__PURE__ */ jsx("div", { className: "container-fluid", children: /* @__PURE__ */ jsx("div", { className: "product-detailed-info-parent", children: /* @__PURE__ */ jsxs("div", { className: "row justify-content-between", children: [
      /* @__PURE__ */ jsx("div", { className: "col-lg-7 col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "x-accordions", children: [
        (auction.description || auction.product_location) && /* @__PURE__ */ jsx(AccordionItem, { title: "Key Information", defaultOpen: true, children: auction.description && /* @__PURE__ */ jsx("div", { className: "mb-3", dangerouslySetInnerHTML: { __html: auction.description } }) }),
        allFeatureRows.length > 0 && /* @__PURE__ */ jsx(AccordionItem, { title: "Additional Details", defaultOpen: true, children: /* @__PURE__ */ jsx("div", { className: "row gx-3 gy-2", children: allFeatureRows.map((item) => /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center border rounded px-3 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small", children: item.label }),
          /* @__PURE__ */ jsx("strong", { className: "small text-dark", children: item.value })
        ] }) }, item.key)) }) }),
        (auction.developer || auction.delivery_date || auction.sale_starts || auction.payment_plan || auction.number_of_buildings || auction.government_fee) && /* @__PURE__ */ jsxs(AccordionItem, { title: "Project by", children: [
          auction.developer && /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx("div", { children: auction.developer }) }),
          auction.delivery_date && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("h6", { className: "mb-1", children: "Delivery Date" }),
            /* @__PURE__ */ jsx("div", { children: formatHuman(auction.delivery_date) })
          ] }),
          auction.sale_starts && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("h6", { className: "mb-1", children: "Sale Starts" }),
            /* @__PURE__ */ jsx("div", { children: formatHuman(auction.sale_starts) })
          ] }),
          auction.payment_plan && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("h6", { className: "mb-1", children: "Payment Plan" }),
            /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.payment_plan } })
          ] }),
          auction.number_of_buildings && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsx("h6", { className: "mb-1", children: "Number of Buildings" }),
            /* @__PURE__ */ jsx("div", { children: auction.number_of_buildings })
          ] }),
          auction.government_fee && /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
            /* @__PURE__ */ jsx("h6", { className: "mb-1", children: "Government Fee" }),
            /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.government_fee } })
          ] })
        ] }),
        auction.location_url && /* @__PURE__ */ jsx(AccordionItem, { title: "Location", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.location_url }, style: { width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" } }) }),
        auction.amenities && /* @__PURE__ */ jsx(AccordionItem, { title: "Amenities", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.amenities } }) }),
        auction.facilities && /* @__PURE__ */ jsx(AccordionItem, { title: "Facilities", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.facilities } }) }),
        auction.nearby_location && /* @__PURE__ */ jsx(AccordionItem, { title: "Location & Nearby Attractions", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: auction.nearby_location } }) })
      ] }) }),
      auction.list_type === "auction" && /* @__PURE__ */ jsx("div", { className: "col-lg-4 col-md-6", children: /* @__PURE__ */ jsx(BidHistory, { bids }) })
    ] }) }) }) }),
    showLiveChat && /* @__PURE__ */ jsxs("section", { className: "container-fluid py-4 border-top", children: [
      /* @__PURE__ */ jsx("h2", { className: "h5 fw-bold mb-3", children: "Auction live chat" }),
      /* @__PURE__ */ jsxs("div", { className: "row g-3", children: [
        /* @__PURE__ */ jsx("div", { className: "col-lg-5 col-xl-4", children: /* @__PURE__ */ jsx(ListingLiveChat, { listingId: auction.id, listingSlug: auction.slug }) }),
        /* @__PURE__ */ jsx("div", { className: "col-lg-7 col-xl-8", children: /* @__PURE__ */ jsxs("p", { className: "text-muted small mb-0", children: [
          "Public room for this listing. Sign in to send messages; everyone can read recent history. For private questions to the seller, use ",
          /* @__PURE__ */ jsx(Link, { href: route("chat.index"), children: "Messages" }),
          "."
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(RelatedItems, { items: related })
  ] });
}
export {
  Show as default
};
