import { jsxs, jsx } from "react/jsx-runtime";
import { Link, router, usePage, Head } from "@inertiajs/react";
import { a as AuthModalProvider, A as AppLayout } from "./AppLayout-CWZvIfaV.js";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
/* empty css                */
/* empty css                    */
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { C as CountdownTimer } from "./CountdownTimer-BG03Al8T.js";
import { Y as YoutubeLiveEmbed, B as BidSection, a as BidHistory } from "./YoutubeLiveEmbed-BWS8zHJE.js";
import { A as AuctionCard } from "./AuctionCard-Cg35nH1x.js";
import { L as ListingLiveChat } from "./ListingLiveChat-DrCA7khS.js";
import axios from "axios";
import { P as Price } from "./Price-CF5NSPt0.js";
import { C as CartProvider } from "./productUrl-SijKnuS_.js";
import "ziggy-js";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "./listingPricing-C5UuJtWm.js";
import "./FavoriteToggleButton-1jmbejDw.js";
function ProductHeader({ views, productId, slug, link, backHref = "/marketplace" }) {
  const shareUrl = typeof window !== "undefined" ? link || `${window.location.origin}/product/${slug}` : "";
  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => alert("Link copied to clipboard!")).catch((err) => console.error("Failed to copy link:", err));
  };
  const handleBack = (event) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
      return;
    }
    if (backHref) {
      event.preventDefault();
      router.visit(backHref, { preserveScroll: false, preserveState: false });
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "prodcut-detail-links product-detail-header-section", style: { paddingTop: "100px" }, children: [
    /* @__PURE__ */ jsx("div", { className: "container-fluid", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "product-back-and-head", children: [
        /* @__PURE__ */ jsx(Link, { href: backHref || "/marketplace", onClick: handleBack, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
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
      (status === "sold_out" || status === "sold out") && /* @__PURE__ */ jsx("div", { className: "soldOutBadge", style: {
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
        color: "white",
        padding: "8px 24px",
        borderRadius: "50px",
        fontWeight: "800",
        fontSize: "0.9rem",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.35)",
        whiteSpace: "nowrap",
        border: "2px solid rgba(255, 255, 255, 0.2)"
      }, children: "SOLD OUT" }),
      String(listType || "").toLowerCase() === "auction" && endDate && !(status === "sold_out" || status === "sold out") && /* @__PURE__ */ jsx("div", { style: {
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
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesProgress: true,
        modules: [FreeMode, Navigation, Thumbs],
        className: "mySwiper product-thumb-swiper",
        children: allMedia.map((media, index) => /* @__PURE__ */ jsx(SwiperSlide, { className: "product-thumb-slide", children: /* @__PURE__ */ jsx("div", { className: "pro-image product-thumb-frame", children: media.type === "youtube" ? /* @__PURE__ */ jsx("div", { style: {
          position: "relative",
          width: "100%",
          height: "100%",
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
            style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" },
            onError: (e) => {
              e.target.src = "/assets/images/hero-prodcut1.jpg";
            }
          }
        ) : /* @__PURE__ */ jsx("div", { style: {
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#000",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play text-white" }) }) }) }, index))
      }
    ) }),
    /* @__PURE__ */ jsx("style", { children: `
                            .product-thumb-swiper {
                                   width: 100%;
                                   padding: 2px 0 8px;
                            }
                            .product-thumb-swiper .swiper-wrapper {
                                   align-items: flex-start;
                            }
                            .product-thumb-slide {
                                   width: 76px !important;
                                   height: 88px !important;
                                   flex: 0 0 76px;
                            }
                            .product-thumb-frame {
                                   width: 76px;
                                   height: 88px;
                                   min-width: 76px;
                                   max-width: 76px;
                                   min-height: 88px;
                                   max-height: 88px;
                                   position: relative;
                                   overflow: hidden;
                                   border-radius: 8px;
                                   background: #f1f5f9;
                            }
                            .product-thumb-frame img,
                            .product-thumb-frame video {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            @media (max-width: 575px) {
                                   .product-thumb-slide {
                                          width: 64px !important;
                                          height: 76px !important;
                                          flex-basis: 64px;
                                   }
                                   .product-thumb-frame {
                                          width: 64px;
                                          height: 76px;
                                          min-width: 64px;
                                          max-width: 64px;
                                          min-height: 76px;
                                          max-height: 76px;
                                   }
                            }
                     ` })
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
const MAP_URL_PATTERNS = [
  /google\.com\/maps/i,
  /maps\.google\.com/i,
  /goo\.gl\/maps/i,
  /maps\.app\.goo\.gl/i
];
const SHORT_MAP_URL_PATTERNS = [
  /goo\.gl\/maps/i,
  /maps\.app\.goo\.gl/i
];
const COORDINATE_PATTERN = /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/;
const isValidCoordinate = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
const normalizeCategoryFeatures = (categoryFeatures) => {
  if (!categoryFeatures) {
    return null;
  }
  if (typeof categoryFeatures === "string") {
    try {
      return JSON.parse(categoryFeatures);
    } catch (error) {
      return null;
    }
  }
  if (typeof categoryFeatures === "object") {
    return categoryFeatures;
  }
  return null;
};
const isGoogleMapsUrl = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return MAP_URL_PATTERNS.some((pattern) => pattern.test(value));
};
const isShortGoogleMapsUrl = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return SHORT_MAP_URL_PATTERNS.some((pattern) => pattern.test(value));
};
const findGoogleMapsUrl = (categoryFeatures) => {
  const parsedFeatures = normalizeCategoryFeatures(categoryFeatures);
  if (!parsedFeatures) {
    return null;
  }
  const values = Array.isArray(parsedFeatures) ? parsedFeatures : Object.values(parsedFeatures);
  for (const value of values) {
    if (isGoogleMapsUrl(value)) {
      return value.trim();
    }
  }
  return null;
};
const coordinatesFromMatch = (match) => {
  if (!match) {
    return null;
  }
  const lat = Number.parseFloat(match[1]);
  const lng = Number.parseFloat(match[2]);
  return isValidCoordinate(lat, lng) ? { lat, lng } : null;
};
const parseGoogleMapsCoordinates = (url) => {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }
  const trimmedUrl = url.trim();
  try {
    const parsedUrl = new URL(trimmedUrl);
    const queryValue = parsedUrl.searchParams.get("q");
    if (queryValue) {
      const fromQuery = coordinatesFromMatch(decodeURIComponent(queryValue).match(COORDINATE_PATTERN));
      if (fromQuery) {
        return fromQuery;
      }
    }
  } catch (error) {
  }
  const fromAtPattern = coordinatesFromMatch(trimmedUrl.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,|z|$)/i));
  if (fromAtPattern) {
    return fromAtPattern;
  }
  return coordinatesFromMatch(trimmedUrl.match(/[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i));
};
const resolveShortMapUrl = async (shortUrl) => {
  const response = await axios.post("/api/resolve-map-url", { url: shortUrl });
  const data = response?.data || {};
  return data.resolved_url || data.resolvedUrl || data.final_url || data.finalUrl || data.url || null;
};
const extractMapCoordinates = async (categoryFeatures) => {
  const mapUrl = findGoogleMapsUrl(categoryFeatures);
  if (!mapUrl) {
    return null;
  }
  const directCoordinates = parseGoogleMapsCoordinates(mapUrl);
  if (directCoordinates) {
    return directCoordinates;
  }
  if (!isShortGoogleMapsUrl(mapUrl)) {
    return null;
  }
  try {
    const resolvedUrl = await resolveShortMapUrl(mapUrl);
    return parseGoogleMapsCoordinates(resolvedUrl);
  } catch (error) {
    return null;
  }
};
function PropertyLocationMap({ categoryFeatures }) {
  const mapUrl = findGoogleMapsUrl(categoryFeatures);
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriedResolving, setHasTriedResolving] = useState(false);
  const [leafletModules, setLeafletModules] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const ensureLeafletStyles = () => {
      if (typeof document === "undefined") {
        return;
      }
      const existingLink = document.querySelector('link[data-leaflet-styles="true"]');
      if (existingLink) {
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.crossOrigin = "";
      link.setAttribute("data-leaflet-styles", "true");
      document.head.appendChild(link);
    };
    ensureLeafletStyles();
    const loadMapModules = async () => {
      if (typeof window === "undefined") {
        return;
      }
      const [reactLeaflet, leaflet] = await Promise.all([
        import("react-leaflet"),
        import("leaflet")
      ]);
      const locationIcon2 = leaflet.divIcon({
        className: "property-location-marker",
        html: `
                                   <span class="property-location-marker__pin">
                                          <span class="property-location-marker__core"></span>
                                   </span>
                            `,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -34]
      });
      if (isMounted) {
        setLeafletModules({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          locationIcon: locationIcon2
        });
      }
    };
    loadMapModules().catch(() => {
      if (isMounted) {
        setLeafletModules(null);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (!mapUrl) {
      setCoordinates(null);
      setHasTriedResolving(false);
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const resolveCoordinates = async () => {
      setIsLoading(true);
      setHasTriedResolving(false);
      const parsedCoordinates = await extractMapCoordinates(categoryFeatures);
      if (isMounted) {
        setCoordinates(parsedCoordinates);
        setHasTriedResolving(true);
        setIsLoading(false);
      }
    };
    resolveCoordinates().catch(() => {
      if (isMounted) {
        setCoordinates(null);
        setHasTriedResolving(true);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [categoryFeatures, mapUrl]);
  if (!mapUrl) {
    return null;
  }
  const showLoading = isLoading || coordinates && !leafletModules;
  if (showLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "property-location-map property-location-map--state", children: [
      /* @__PURE__ */ jsx("div", { className: "property-location-spinner", "aria-label": "Loading location" }),
      /* @__PURE__ */ jsx("span", { children: "Loading location..." }),
      /* @__PURE__ */ jsx("style", { children: propertyLocationMapStyles })
    ] });
  }
  if (!coordinates || !leafletModules || !hasTriedResolving) {
    return /* @__PURE__ */ jsxs("div", { className: "property-location-map property-location-map--state", children: [
      /* @__PURE__ */ jsx("span", { children: "Location not available" }),
      /* @__PURE__ */ jsx("style", { children: propertyLocationMapStyles })
    ] });
  }
  const { MapContainer, TileLayer, Marker, Popup, locationIcon } = leafletModules;
  const position = [coordinates.lat, coordinates.lng];
  return /* @__PURE__ */ jsxs("div", { className: "property-location-map", children: [
    /* @__PURE__ */ jsxs(
      MapContainer,
      {
        center: position,
        zoom: 15,
        scrollWheelZoom: false,
        style: { width: "100%", height: "100%" },
        children: [
          /* @__PURE__ */ jsx(
            TileLayer,
            {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          ),
          /* @__PURE__ */ jsx(Marker, { position, icon: locationIcon, children: /* @__PURE__ */ jsx(Popup, { children: "Property location" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: propertyLocationMapStyles })
  ] });
}
const propertyLocationMapStyles = `
       .property-location-map {
              width: 100%;
              height: 360px;
              min-height: 300px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
              background: #f8fafc;
       }

       .property-location-map--state {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              color: #6b7280;
              font-size: 14px;
              font-weight: 600;
       }

       .property-location-marker {
              background: transparent;
              border: 0;
       }

       .property-location-marker__pin {
              position: relative;
              display: block;
              width: 22px;
              height: 22px;
              margin: 0 auto;
              background: #ef4444;
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
       }

       .property-location-marker__core {
              position: absolute;
              inset: 5px;
              border-radius: 50%;
              background: #ffffff;
       }

       .property-location-spinner {
              width: 18px;
              height: 18px;
              border: 2px solid #d1d5db;
              border-top-color: #43ace9;
              border-radius: 999px;
              animation: property-location-spin 0.7s linear infinite;
       }

       @keyframes property-location-spin {
              to {
                     transform: rotate(360deg);
              }
       }

       @media (max-width: 767px) {
              .property-location-map {
                     height: 280px;
                     min-height: 260px;
              }
       }
`;
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
const listingImageUrl = (path) => {
  if (!path) return "/assets/images/WebsiteBanner2.png";
  if (String(path).startsWith("http") || String(path).startsWith("/")) return path;
  return `/${String(path).replace(/^\/+/, "")}`;
};
const normalizeSchemaMarkup = (schemaMarkup) => {
  if (typeof schemaMarkup !== "string") {
    return "";
  }
  const rawMarkup = schemaMarkup.trim();
  if (!rawMarkup) {
    return "";
  }
  try {
    const parsed = JSON.parse(rawMarkup);
    return JSON.stringify(parsed);
  } catch (error) {
    const normalizedMarkup = rawMarkup.replace(/^\s*html\s*/i, "").replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i, "").replace(/<\/script>\s*$/i, "").trim();
    if (!normalizedMarkup) {
      return "";
    }
    try {
      const parsed = JSON.parse(normalizedMarkup);
      return JSON.stringify(parsed);
    } catch (nestedError) {
      return "";
    }
  }
};
const extractSchemaMarkupBlocks = (schemaMarkup) => {
  if (typeof schemaMarkup !== "string") {
    return [];
  }
  const rawMarkup = schemaMarkup.trim();
  if (!rawMarkup) {
    return [];
  }
  const scriptMatches = [...rawMarkup.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (scriptMatches.length > 0) {
    return scriptMatches.map((match) => normalizeSchemaMarkup(match[1] || "")).filter(Boolean);
  }
  const normalizedMarkup = normalizeSchemaMarkup(rawMarkup);
  return normalizedMarkup ? [normalizedMarkup] : [];
};
function Show({ auction, bids, related, highestBid, winnerDetails, isFavorite, dynamicFields = [], liveVideoId = null, liveActiveAuction = null, marketplaceBackUrl = null }) {
  const { auth } = usePage().props;
  const listingType = String(auction?.listing_type || "").toLowerCase();
  const listingStatus = String(auction?.status || "").trim().toLowerCase();
  const showLiveChat = listingType === "live_auction" && listingStatus === "active";
  const [mobileBidAmount, setMobileBidAmount] = useState("");
  const [mobileBidSending, setMobileBidSending] = useState(false);
  const activeLiveVideoId = liveVideoId || auction?.youtube_video_id;
  const schemaMarkupBlocks = extractSchemaMarkupBlocks(auction?.category?.schema_markup);
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
    if (!formatted || isGoogleMapsUrl(value)) return null;
    mappedKeys.add(idKey);
    if (base) mappedKeys.add(base);
    if (featureKey) mappedKeys.add(featureKey);
    return {
      key: idKey,
      label: field?.label || prettifyKey(base || idKey),
      value: formatted
    };
  }).filter(Boolean);
  const allFeatureRows = dynamicFeatureRows;
  useEffect(() => {
    if (listingType !== "live_auction") {
      return void 0;
    }
    const refreshLiveBids = () => {
      router.reload({
        only: ["auction", "bids", "highestBid", "winnerDetails", "liveVideoId", "liveActiveAuction"],
        preserveScroll: true,
        preserveState: true,
        showProgress: false
      });
    };
    const timer = window.setInterval(refreshLiveBids, 2500);
    return () => window.clearInterval(timer);
  }, [listingType]);
  useEffect(() => {
    if (listingType === "live_auction" && listingStatus === "closed") {
      router.visit("/live-auctions", {
        replace: true,
        preserveScroll: false,
        preserveState: false
      });
      return;
    }
    if (listingType === "live_auction" && liveActiveAuction?.slug && liveActiveAuction.slug !== auction?.slug) {
      router.visit(route("product.show", liveActiveAuction.slug), {
        replace: true,
        preserveScroll: false,
        preserveState: false
      });
    }
  }, [listingType, listingStatus, liveActiveAuction?.slug, auction?.slug]);
  const handleMobileLiveBid = () => {
    if (!auth?.user) {
      window.alert("Please login to place a bid");
      return;
    }
    if (!mobileBidAmount || Number(mobileBidAmount) <= Number(highestBid || 0)) {
      window.alert("Bid must be higher than the current highest bid");
      return;
    }
    setMobileBidSending(true);
    router.post("/bids", {
      listing_id: auction.id,
      bid_amount: mobileBidAmount,
      bid_source: "web"
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setMobileBidAmount("");
        router.reload({
          only: ["auction", "bids", "highestBid", "winnerDetails", "liveVideoId", "liveActiveAuction"],
          preserveScroll: true,
          preserveState: true,
          showProgress: false
        });
      },
      onError: (errors) => {
        const message = Object.values(errors || {}).flat().join("\n") || "Failed to place bid";
        window.alert(message);
      },
      onFinish: () => setMobileBidSending(false)
    });
  };
  if (listingType === "live_auction") {
    return /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs(AuthModalProvider, { children: [
      /* @__PURE__ */ jsxs(Head, { children: [
        /* @__PURE__ */ jsx("title", { children: auction.title }),
        /* @__PURE__ */ jsx("meta", { name: "description", content: auction.description?.substring(0, 160) }),
        schemaMarkupBlocks.map((schemaMarkup, index) => /* @__PURE__ */ jsx(
          "script",
          {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: schemaMarkup }
          },
          `auction-schema-${index}`
        ))
      ] }),
      /* @__PURE__ */ jsx("main", { className: "live-product-detail-page", children: /* @__PURE__ */ jsxs("div", { className: "live-product-detail-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "live-product-mobile-video-panel", children: [
          /* @__PURE__ */ jsxs(Link, { href: "/live-auctions", className: "live-product-back-btn live-product-mobile-back-btn", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" }),
            /* @__PURE__ */ jsx("span", { children: "Back to Live Auction" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "live-product-video-wrap", children: activeLiveVideoId ? /* @__PURE__ */ jsx(YoutubeLiveEmbed, { videoId: activeLiveVideoId, title: auction.title }) : /* @__PURE__ */ jsx("img", { src: listingImageUrl(auction.image_url), alt: auction.title }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "live-product-mobile-controls", children: [
          /* @__PURE__ */ jsx("h1", { children: auction.title }),
          /* @__PURE__ */ jsxs("div", { className: "live-product-mobile-highest", children: [
            /* @__PURE__ */ jsx("span", { children: "Highest Bid" }),
            /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(Price, { amountAED: highestBid || 0 }) })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              placeholder: "Enter amount",
              value: mobileBidAmount,
              onChange: (e) => setMobileBidAmount(e.target.value),
              disabled: mobileBidSending
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: handleMobileLiveBid, disabled: mobileBidSending, children: mobileBidSending ? "Placing Bid..." : "Place Bid" }),
          /* @__PURE__ */ jsxs("div", { className: "live-product-mobile-prices", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Starting bid price: ",
              /* @__PURE__ */ jsx("b", { children: /* @__PURE__ */ jsx(Price, { amountAED: auction.minimum_bid || auction.listing_data?.start_price || 0 }) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Market Value: ",
              /* @__PURE__ */ jsx("b", { children: /* @__PURE__ */ jsx(Price, { amountAED: auction.reserve_price || auction.listing_data?.reserve_price || 0 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "live-product-main-panel", children: [
          /* @__PURE__ */ jsx("div", { className: "live-product-video-wrap", children: activeLiveVideoId ? /* @__PURE__ */ jsx(YoutubeLiveEmbed, { videoId: activeLiveVideoId, title: auction.title }) : /* @__PURE__ */ jsx("img", { src: listingImageUrl(auction.image_url), alt: auction.title }) }),
          /* @__PURE__ */ jsx(
            BidSection,
            {
              product: auction,
              highestBidProp: highestBid,
              onBidPlaced: () => {
                router.reload({
                  only: ["auction", "bids", "highestBid", "winnerDetails", "liveVideoId", "liveActiveAuction"],
                  preserveScroll: true,
                  preserveState: true,
                  showProgress: false
                });
              },
              winnerDetails,
              isFavoriteProp: isFavorite
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "live-product-side-panel live-product-chat-panel", children: [
          /* @__PURE__ */ jsx("div", { className: "live-product-chat-actions", children: /* @__PURE__ */ jsxs(Link, { href: "/live-auctions", className: "live-product-back-btn", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" }),
            /* @__PURE__ */ jsx("span", { children: "Back to Live Auction" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "live-product-panel-heading", children: /* @__PURE__ */ jsx("h2", { children: "Live Chat" }) }),
          /* @__PURE__ */ jsx(ListingLiveChat, { listingId: auction.id, listingSlug: auction.slug })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: "live-product-side-panel live-product-bids-panel", children: /* @__PURE__ */ jsx(BidHistory, { bids }) })
      ] }) }),
      /* @__PURE__ */ jsx("style", { children: `
                                   html,
                                   body {
                                          overflow: hidden;
                                   }

                                   .live-product-detail-page {
                                          background: #f5f7fb;
                                          padding: 8px 16px 14px;
                                          min-height: 100vh;
                                          height: 100vh;
                                          display: flex;
                                          flex-direction: column;
                                          overflow: hidden;
                                   }

                                   .live-product-back-btn {
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          gap: 6px;
                                          min-height: 34px;
                                          padding: 0 12px;
                                          border-radius: 8px;
                                          background: #f8fafc;
                                          color: #111827;
                                          border: 1px solid #e5e7eb;
                                          text-decoration: none;
                                          font-size: 12px;
                                          font-weight: 900;
                                   }

                                   .live-product-detail-grid {
                                          width: min(1480px, 100%);
                                          margin: 0 auto;
                                          display: grid;
                                          grid-template-columns: minmax(420px, 1.25fr) minmax(300px, 0.75fr) minmax(320px, 0.8fr);
                                          gap: 16px;
                                          align-items: stretch;
                                          flex: 1 1 auto;
                                          min-height: 0;
                                   }

                                   .live-product-main-panel,
                                   .live-product-mobile-video-panel,
                                   .live-product-mobile-controls,
                                   .live-product-side-panel {
                                          background: #ffffff;
                                          border: 1px solid #e5e7eb;
                                          border-radius: 10px;
                                          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
                                          overflow: hidden;
                                   }

                                   .live-product-mobile-video-panel {
                                          display: none;
                                          padding: 10px;
                                    }

                                   .live-product-mobile-controls {
                                          display: none;
                                   }

                                   .live-product-main-panel {
                                          padding: 14px;
                                          min-height: 0;
                                          overflow-y: auto;
                                   }

                                   .live-product-video-wrap {
                                          margin-bottom: 14px;
                                          height: clamp(230px, 39vh, 390px);
                                          background: #000000;
                                          border-radius: 10px;
                                          overflow: hidden;
                                   }

                                   .live-product-video-wrap .xb-youtube-embed,
                                   .live-product-video-wrap .ratio {
                                          height: 100% !important;
                                          padding-bottom: 0 !important;
                                          border: 0 !important;
                                          border-radius: 10px !important;
                                          box-shadow: none !important;
                                   }

                                   .live-product-video-wrap img {
                                          width: 100%;
                                          height: 100%;
                                          object-fit: cover;
                                          display: block;
                                   }

                                   .live-product-main-panel .product-details-brief-parent {
                                          padding: 0 !important;
                                   }

                                   .live-product-main-panel .product-heading {
                                          font-size: clamp(20px, 2vw, 28px);
                                          line-height: 1.05;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .owned-by-and-favoruite {
                                          display: none !important;
                                   }

                                   .live-product-main-panel .detail-auction-strip {
                                          border-radius: 10px;
                                          padding: 14px 16px;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .detail-auction-meta .price {
                                          font-size: clamp(24px, 2.3vw, 32px);
                                   }

                                   .live-product-main-panel .bid-input-wrap input,
                                   .live-product-main-panel .bid-input-wrap button {
                                          height: 44px !important;
                                          font-size: 15px !important;
                                   }

                                   .live-product-main-panel .min-bid-and-estimate {
                                          gap: 12px;
                                          flex-wrap: wrap;
                                   }

                                   .live-product-side-panel {
                                          padding: 18px;
                                          min-height: 0;
                                          overflow: hidden;
                                          display: flex;
                                          flex-direction: column;
                                   }

                                   .live-product-bids-panel {
                                          overflow-y: auto;
                                          order: 2;
                                   }

                                   .live-product-chat-panel {
                                          order: 3;
                                   }

                                   .live-product-side-panel .bid-history-parent {
                                          margin: 0;
                                          box-shadow: none;
                                          border: 0;
                                          padding: 0;
                                          height: 100%;
                                          min-height: 0;
                                          display: flex;
                                          flex-direction: column;
                                          flex: 1 1 auto;
                                   }

                                   .live-product-side-panel .bid-history-header {
                                          padding: 8px 0 16px;
                                          margin-bottom: 16px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-side-panel .bid-history-header .description {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          padding: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-side-panel .bid-history-scroll {
                                          max-height: none;
                                          flex: 0 0 auto;
                                          min-height: auto;
                                          overflow: visible;
                                          padding: 0 4px 4px;
                                   }

                                   .live-product-side-panel .bid-history-scroll > .text-center {
                                          min-height: 260px;
                                          border-radius: 10px;
                                          background: #f8fafc;
                                          border: 1px dashed #dbe3ee;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          color: #64748b !important;
                                          font-size: 16px;
                                          font-weight: 800;
                                          margin: 0 !important;
                                    }

                                   .live-product-side-panel .history-user.parent {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          gap: 12px;
                                          padding: 12px;
                                          margin-bottom: 10px;
                                          border: 1px solid #edf2f7;
                                          border-radius: 10px;
                                          background: #ffffff;
                                          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
                                   }

                                   .live-product-side-panel .history-user-profile {
                                          display: flex;
                                          align-items: center;
                                          min-width: 0;
                                   }

                                   .live-product-side-panel .history-user-name,
                                   .live-product-side-panel .history-no {
                                          margin: 0;
                                   }

                                   .live-product-side-panel .history-user-name {
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 900;
                                   }

                                   .live-product-side-panel .username-and-date .date {
                                          color: #64748b;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-side-panel .history-user-payAmount {
                                          flex: 0 0 auto;
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 950;
                                   }

                                   .live-product-side-panel .history-user-payAmount .price,
                                   .live-product-side-panel .history-user-payAmount span {
                                          font-size: 16px !important;
                                          line-height: 1.1;
                                    }

                                   .live-product-panel-heading {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          padding: 0 0 14px;
                                          margin-bottom: 14px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-panel-heading h2 {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-chat-actions {
                                          display: flex;
                                          justify-content: flex-end;
                                          margin-bottom: 12px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat {
                                          min-height: 0;
                                          flex: 1 1 auto;
                                          height: auto !important;
                                          border: 0 !important;
                                          border-radius: 0 !important;
                                          box-shadow: none !important;
                                          background: transparent !important;
                                          overflow: hidden !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 10px 10px 0 0;
                                          padding: 10px 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom .small {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          letter-spacing: 0.02em;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat .badge {
                                          background: #111827 !important;
                                          color: #ffffff !important;
                                          border-radius: 999px;
                                          padding: 5px 9px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                          background: #ffffff;
                                          border-left: 1px solid #e5e7eb;
                                          border-right: 1px solid #e5e7eb;
                                          padding: 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div {
                                          border: 1px solid #edf2f7 !important;
                                          border-radius: 10px;
                                          padding: 10px 12px !important;
                                          margin-bottom: 10px !important;
                                          background: #f8fafc;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .fw-semibold {
                                          color: #111827 !important;
                                          font-size: 13px;
                                          font-weight: 900 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-muted {
                                          color: #64748b !important;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-body {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          line-height: 1.45;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 0 0 10px 10px;
                                          padding: 8px !important;
                                          flex: 0 0 auto;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form > .d-flex {
                                          align-items: center;
                                          gap: 8px !important;
                                          min-height: 40px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat input {
                                          height: 40px;
                                          min-height: 40px;
                                          border: 1px solid #dbe3ee;
                                          border-radius: 8px;
                                          box-shadow: none !important;
                                          font-size: 13px;
                                          padding: 0 12px !important;
                                          line-height: 40px;
                                          margin: 0 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 40px;
                                          min-height: 40px;
                                          border-radius: 8px;
                                          background: #111827;
                                          border-color: #111827;
                                          font-weight: 900;
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          padding: 0 !important;
                                          margin: 0 !important;
                                          line-height: 1;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] i {
                                          font-size: 15px;
                                    }

                                   @media (max-width: 1199px) {
                                          html,
                                          body {
                                                 overflow: auto;
                                          }

                                          .live-product-detail-page {
                                                 height: auto;
                                                 min-height: 100vh;
                                                 overflow: visible;
                                          }

                                          .live-product-detail-grid {
                                                 grid-template-columns: 1fr 1fr;
                                                 overflow-y: auto;
                                          }

                                          .live-product-main-panel {
                                                 grid-column: 1 / -1;
                                                 overflow-y: visible;
                                          }
                                   }

                                   @media (max-width: 767px) {
                                          html,
                                          body {
                                                 overflow: hidden;
                                          }

                                          .live-product-detail-page {
                                                 padding: 8px 10px 16px;
                                                 height: 100vh;
                                                 min-height: 100vh;
                                                 overflow: hidden;
                                          }

                                          .live-product-video-wrap {
                                                 height: 178px;
                                                 margin-bottom: 12px;
                                          }

                                          .live-product-detail-grid {
                                                 display: flex;
                                                 flex-direction: column;
                                                 grid-template-columns: 1fr;
                                                 overflow-y: auto;
                                                 align-items: start;
                                                 padding-top: 236px;
                                                 padding-bottom: 18px;
                                          }

                                          .live-product-main-panel,
                                          .live-product-mobile-video-panel,
                                          .live-product-mobile-controls,
                                          .live-product-side-panel {
                                                 border-radius: 8px;
                                                 overflow: visible;
                                          }

                                          .live-product-mobile-video-panel {
                                                 display: block;
                                                 order: 1;
                                                 position: fixed;
                                                 top: 8px;
                                                 left: 10px;
                                                 right: 10px;
                                                 z-index: 30;
                                                 padding: 8px;
                                                 background: #ffffff;
                                                  overflow: hidden;
                                                 height: 228px;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 8px;
                                          }

                                          .live-product-mobile-back-btn {
                                                 align-self: flex-start;
                                                 min-height: 32px;
                                                 background: #ffffff;
                                          }

                                          .live-product-mobile-video-panel .live-product-video-wrap {
                                                margin-bottom: 0;
                                                 height: 170px;
                                          }

                                          .live-product-main-panel {
                                                 padding: 10px;
                                                 order: 2;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 0;
                                                 display: none;
                                          }

                                          .live-product-main-panel > .live-product-video-wrap {
                                                 display: none;
                                          }

                                          .live-product-mobile-controls {
                                                 display: flex;
                                                 flex-direction: column;
                                                 order: 2;
                                                 padding: 12px;
                                                 gap: 12px;
                                                 margin-top: 0;
                                                 width: 100%;
                                                 align-self: stretch;
                                                 box-sizing: border-box;
                                          }

                                          .live-product-mobile-controls h1 {
                                                 color: #111827;
                                                 font-size: 20px;
                                                 font-weight: 950;
                                                 line-height: 1.2;
                                                 margin: 0;
                                          }

                                          .live-product-mobile-highest {
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 background: #f8fafc;
                                                 padding: 12px 14px;
                                          }

                                          .live-product-mobile-highest span {
                                                 display: block;
                                                 color: #64748b;
                                                 font-size: 11px;
                                                 font-weight: 800;
                                                 text-transform: uppercase;
                                                 letter-spacing: 0.04em;
                                                 margin-bottom: 6px;
                                          }

                                          .live-product-mobile-highest strong {
                                                 display: block;
                                                 color: #111827;
                                                 font-size: 28px;
                                                 line-height: 1.1;
                                                 font-weight: 950;
                                          }

                                          .live-product-mobile-controls input {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 padding: 0 14px;
                                                 font-size: 14px;
                                                 outline: 0;
                                          }

                                          .live-product-mobile-controls button {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 0;
                                                 border-radius: 10px;
                                                 background: #23262f;
                                                 color: #ffffff;
                                                 font-size: 14px;
                                                 font-weight: 900;
                                          }

                                          .live-product-mobile-prices {
                                                 display: grid;
                                                 gap: 8px;
                                                 color: #64748b;
                                                 font-size: 14px;
                                          }

                                          .live-product-mobile-prices b {
                                                 color: #111827;
                                                 font-weight: 800;
                                          }

                                          .live-product-main-panel .product-details-brief-parent {
                                                 display: block !important;
                                                 padding: 0 !important;
                                          }

                                          .live-product-main-panel .product-heading {
                                                 display: block !important;
                                                 font-size: 20px !important;
                                                 line-height: 1.2 !important;
                                                 margin: 0 0 10px !important;
                                          }

                                          .live-product-main-panel .detail-auction-strip {
                                                 display: block !important;
                                                 padding: 12px 14px !important;
                                                 margin-bottom: 12px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .rank {
                                                 display: block !important;
                                                 font-size: 11px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .price {
                                                 display: block !important;
                                                 font-size: 28px !important;
                                                 line-height: 1.1 !important;
                                          }

                                          .live-product-main-panel .product-details-brief-parent,
                                          .live-product-main-panel .bid-input-wrap,
                                          .live-product-main-panel .min-bid-and-estimate {
                                                 position: static !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap {
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 12px;
                                                 margin-bottom: 14px !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap button {
                                                 position: static !important;
                                                 inset: auto !important;
                                                 transform: none !important;
                                                 display: flex !important;
                                                 align-items: center;
                                                 justify-content: center;
                                                 width: 100% !important;
                                                 margin: 0 !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .min-bid-and-estimate {
                                                 display: grid !important;
                                                 grid-template-columns: 1fr;
                                                 gap: 8px;
                                                 margin-top: 0 !important;
                                          }

                                          .live-product-chat-panel {
                                                 order: 3;
                                                 position: relative;
                                                 z-index: 2;
                                                 margin-top: 12px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-chat-panel .live-product-chat-actions {
                                                 display: none;
                                          }

                                          .live-product-bids-panel {
                                                 order: 4;
                                                 position: relative;
                                                 z-index: 1;
                                                 margin-top: 14px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel {
                                                 overflow: hidden;
                                          }

                                          .live-product-bids-panel .bid-history-parent {
                                                 height: auto;
                                                 min-height: auto;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel .bid-history-scroll {
                                                 max-height: 246px;
                                                 overflow-y: auto;
                                                 padding-right: 4px;
                                          }

                                          .live-product-bids-panel .history-user.parent {
                                                 min-height: 66px;
                                          }

                                          .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                                 max-height: 252px;
                                                 min-height: 252px;
                                                 overflow-y: auto !important;
                                          }
                                   }
                            ` })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { title: auction.title, children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("meta", { name: "description", content: auction.description?.substring(0, 160) }),
      schemaMarkupBlocks.map((schemaMarkup, index) => /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: schemaMarkup }
        },
        `auction-live-schema-${index}`
      ))
    ] }),
    /* @__PURE__ */ jsx(
      ProductHeader,
      {
        views: auction.views,
        productId: auction.id,
        slug: auction.slug,
        backHref: marketplaceBackUrl
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
        (auction.description || auction.product_location) && /* @__PURE__ */ jsxs(AccordionItem, { title: "Key Information", defaultOpen: true, children: [
          auction.description && /* @__PURE__ */ jsx("div", { className: "mb-3", dangerouslySetInnerHTML: { __html: auction.description } }),
          /* @__PURE__ */ jsx(PropertyLocationMap, { categoryFeatures: auction.category_features })
        ] }),
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
