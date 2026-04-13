import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage, router, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
/* empty css                */
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { C as CountdownTimer } from "./OwnerInfoRow-BzmY3N9i.js";
import axios from "axios";
import { P as Price } from "./Price-CF5NSPt0.js";
import { u as useCart } from "./CartContext-DXNQZwkV.js";
import { A as AuctionCard } from "./AuctionCard-BtoirWdd.js";
import "ziggy-js";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
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
function ProductImages({ albumImages, videos = null, status, mainImage, listType, startDate, endDate }) {
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
  const allMedia = [...processedAlbum, ...processedVideos];
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
          children: allMedia.map((media, index) => /* @__PURE__ */ jsx(SwiperSlide, { style: { margin: "0px" }, children: /* @__PURE__ */ jsx("div", { className: "pro-image-main", style: { position: "relative", width: "100%", minHeight: "500px" }, children: media.type === "image" ? /* @__PURE__ */ jsx(
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
        children: allMedia.map((media, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("div", { className: "pro-image", style: { height: "100%", position: "relative", minHeight: "80px" }, children: media.type === "image" ? /* @__PURE__ */ jsx(
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
function BidSection({ product, highestBidProp, onBidPlaced, winnerDetails, isFavoriteProp }) {
  const { auth, flash } = usePage().props;
  const { addToCart } = useCart();
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [highestBid, setHighestBid] = useState(highestBidProp || 0);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const normalizedListType = String(product?.list_type || product?.listing_type || "").toLowerCase();
  const isDirectSale = normalizedListType === "normal" || normalizedListType === "normal_list" || normalizedListType === "business" || normalizedListType === "business_list";
  const baseSalePrice = Number(product.buy_now_price || product.minimum_bid || 0);
  const discountValue = Number(product.discount_value || 0);
  const hasDiscount = isDirectSale && discountValue > 0;
  const finalSalePrice = (() => {
    if (!hasDiscount) return baseSalePrice;
    if (product.discount_type === "percent") {
      return Math.max(0, baseSalePrice - baseSalePrice * (discountValue / 100));
    }
    if (product.discount_type === "flat") {
      return Math.max(0, baseSalePrice - discountValue);
    }
    return baseSalePrice;
  })();
  useEffect(() => {
    if (flash?.success) {
      showNotification(flash.success, "success");
    }
    if (flash?.error) {
      showNotification(flash.error, "error");
    }
  }, [flash]);
  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4e3);
  };
  useEffect(() => {
    setHighestBid(highestBidProp);
  }, [highestBidProp]);
  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);
  const handleToggleFavorite = () => {
    if (!auth.user) {
      showNotification("Please login to add to favorites", "error");
      return;
    }
    setIsTogglingFavorite(true);
    router.post(route("favorites.toggle"), {
      listing_id: product.id
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsFavorite(!isFavorite);
        setIsTogglingFavorite(false);
      },
      onError: () => {
        setIsTogglingFavorite(false);
        showNotification("Failed to update favorites", "error");
      }
    });
  };
  const isOwner = auth.user && (auth.user.id === product.user_id || auth.user.id === product.owner_id || auth.user.id === product.seller_id);
  const handlePlaceBid = async () => {
    if (!auth.user) {
      showNotification("Please login to place a bid", "error");
      return;
    }
    if (isOwner) {
      showNotification("You cannot bid on your own product", "error");
      return;
    }
    if (!bidAmount || Number(bidAmount) <= highestBid) {
      showNotification("Bid must be higher than the current highest bid", "error");
      return;
    }
    setShowConfirm(true);
  };
  const handleConfirmPlaceBid = () => {
    setShowConfirm(false);
    setIsPlacingBid(true);
    router.post("/bids", {
      listing_id: product.id,
      bid_amount: bidAmount,
      bid_source: "web"
    }, {
      onSuccess: () => {
        setBidAmount("");
        setIsPlacingBid(false);
        if (onBidPlaced) onBidPlaced();
      },
      onError: (errors) => {
        setIsPlacingBid(false);
        const errorMsg = Object.values(errors).join("\n");
        showNotification(errorMsg || "Failed to place bid", "error");
      },
      onFinish: () => {
        setIsPlacingBid(false);
      }
    });
  };
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const result = await addToCart(product.id, "product", null, product);
    setIsAddingToCart(false);
    if (result.success) {
      showNotification(result.message, "success");
    } else {
      showNotification(result.message, "error");
    }
  };
  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    const result = await addToCart(product.id, "product", null, product);
    if (result.success || result.message === "Product already in cart") {
      router.visit(route("checkout.index"));
    } else {
      setIsAddingToCart(false);
      showNotification(result.message, "error");
    }
  };
  const handleChat = async () => {
    if (!auth.user) {
      showNotification("Please login to chat with the seller", "error");
      return;
    }
    if (isOwner) {
      showNotification("You cannot chat with yourself", "error");
      return;
    }
    try {
      const response = await axios.post("/chat/initiate", {
        user_id: product.user_id || product.seller_id || product.owner_id,
        product_id: product.id
      });
      if (response.data && response.data.id) {
        router.visit(`/chat?conversation_id=${response.data.id}`);
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      showNotification("Failed to start conversation. Please try again.", "error");
    }
  };
  const buildAvatarUrl = (avatar) => {
    if (!avatar) return "/assets/images/user-fallback.png";
    if (String(avatar).startsWith("http")) return avatar;
    const normalized = String(avatar).replace(/\\/g, "/");
    if (normalized.startsWith("/")) return normalized;
    return `/${normalized.replace(/^\/+/, "")}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "product-details-brief-parent", style: { padding: "0 10px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "product-heading mb-3", children: product.title }),
    /* @__PURE__ */ jsxs("div", { className: "owned-by-and-favoruite d-flex align-items-center justify-content-between mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "owned d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "customer-profile-wrap", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: buildAvatarUrl(product.seller?.profile_pic || product.user?.profile_pic),
            alt: "Owner",
            style: { width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" },
            onError: (e) => {
              e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "customer-name d-flex flex-column", children: [
          /* @__PURE__ */ jsx("span", { className: "owner text-muted small fw-semibold", style: { fontSize: "12px" }, children: "Owned By" }),
          /* @__PURE__ */ jsx("p", { className: "name mb-0 fw-bold text-dark", style: { fontSize: "15px" }, children: product.seller?.name || product.user?.name || "Ali" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleChat,
            className: "btn btn-outline-primary btn-sm d-flex align-items-center gap-2",
            style: { borderRadius: "20px", padding: "5px 15px", fontSize: "13px" },
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comment-dots" }),
              "Chat"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleToggleFavorite,
            disabled: isTogglingFavorite,
            className: "fav-btn border-0 bg-light p-2 rounded-2",
            children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: isFavorite ? "#ef4444" : "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { d: "M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z", stroke: isFavorite ? "#ef4444" : "#23262F", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
          }
        )
      ] })
    ] }),
    product.list_type === "auction" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "bid-rank-and-time detail-auction-strip mb-3", children: /* @__PURE__ */ jsxs("div", { className: "detail-auction-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "rank", children: "Highest Bid" }),
        /* @__PURE__ */ jsx("div", { className: "price", title: String(highestBid), children: /* @__PURE__ */ jsx(Price, { amountAED: highestBid }) })
      ] }) }),
      (product.status === "awarded" || product.status === "awarded ") && /* @__PURE__ */ jsxs("div", { className: "winner-section-ref mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted small fw-bold text-uppercase mb-1", style: { fontSize: "11px", letterSpacing: "0.5px" }, children: "Winning Bidder" }),
        /* @__PURE__ */ jsxs("div", { className: "winner-text-ref", children: [
          /* @__PURE__ */ jsx("span", { className: "trophy-icon-ref", children: "🏆" }),
          "Establishing contact with the highest bidder"
        ] })
      ] }),
      product.status !== "awarded" && product.status !== "awarded " && /* @__PURE__ */ jsxs("div", { className: "bid-input-wrap mb-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            placeholder: "Enter amount",
            className: "form-control border-secondary-subtle",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", padding: "0 20px" },
            value: bidAmount,
            onChange: (e) => setBidAmount(e.target.value),
            disabled: isPlacingBid || isOwner
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold mt-3",
            style: { height: "50px", fontSize: "18px", borderRadius: "10px", backgroundColor: "#23262F", color: "#fff", border: "none" },
            onClick: handlePlaceBid,
            disabled: isPlacingBid || isOwner,
            children: isPlacingBid ? "Placing Bid..." : "Place Bid"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-bid-and-estimate d-flex justify-content-between mt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "minimum-bid text-muted small", children: [
          "Starting bid price: ",
          /* @__PURE__ */ jsx("span", { className: "text-dark fw-semibold", children: /* @__PURE__ */ jsx(Price, { amountAED: product.minimum_bid }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "estimate-bid text-muted small", children: [
          "Market Value: ",
          /* @__PURE__ */ jsx("span", { className: "text-dark fw-semibold", children: /* @__PURE__ */ jsx(Price, { amountAED: product.reserve_price }) })
        ] })
      ] }),
      (product.is_1_rupee === 1 || product.is_1_rupee === "1") && (product.status !== "awarded" && product.status !== "awarded ") && /* @__PURE__ */ jsx("div", { className: "disclaimer mt-3 bg-secondary bg-opacity-5 p-2 rounded-2", children: /* @__PURE__ */ jsxs("p", { className: "mb-0 text-muted", style: { fontSize: "12px" }, children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info me-1" }),
        "In our Rs. 1 Auction, if a new bid is placed in the last 5 minutes, the auction timer will automatically reset to 15 minutes."
      ] }) })
    ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "normal-pricing-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-2 mb-3", children: [
        product.product_condition && /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2", style: { backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small", children: "Condition" }),
          /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark text-capitalize", children: product.product_condition })
        ] }),
        product.product_year && /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2", style: { backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small", children: "Year" }),
          /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark", children: product.product_year })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bid-rank-and-time bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center", children: /* @__PURE__ */ jsxs("div", { className: "bid-price-and-rank d-flex flex-column", children: [
        /* @__PURE__ */ jsx("span", { className: "rank text-muted small fw-semibold", children: "Price" }),
        /* @__PURE__ */ jsxs("div", { className: "price fw-bold d-flex align-items-center gap-2", children: [
          hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted", style: { fontSize: "16px" }, children: /* @__PURE__ */ jsx(Price, { amountAED: baseSalePrice }) }),
          /* @__PURE__ */ jsx("span", { className: "text-dark", style: { fontSize: "28px" }, children: /* @__PURE__ */ jsx(Price, { amountAED: finalSalePrice }) }),
          hasDiscount && /* @__PURE__ */ jsx("span", { className: "badge bg-danger", children: product.discount_type === "percent" ? `${discountValue}% OFF` : "SALE" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "action-buttons d-grid gap-2 mb-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#23262F", color: "#fff", border: "none" },
            onClick: handleAddToCart,
            disabled: isOwner || isAddingToCart,
            children: isAddingToCart ? "Adding..." : "Add to Cart"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#43ACE9", color: "#fff", border: "none" },
            onClick: handleBuyNow,
            disabled: isOwner || isAddingToCart,
            children: "Buy Now"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                            .winner-section-ref {
                                   width: 100%;
                                   text-align: center;
                                   background: #f0f9ff !important;
                                   padding: 10px;
                                   border-radius: 8px;
                                   border: 1px dashed #43ACE9 !important;
                            }
                            .winner-text-ref {
                                   font-size: 1.1rem;
                                   font-weight: 700;
                                   color: #0284c7;
                                   margin-top: 4px;
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 6px;
                            }
                            .trophy-icon-ref {
                                   color: #eab308;
                                   font-size: 1.2rem;
                            }
                            .detail-auction-strip {
                                   background: #f8fafc;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 18px;
                                   padding: 18px 20px;
                                   box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
                            }
                            .detail-auction-meta {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                                   min-width: 0;
                            }
                            .detail-auction-meta .rank {
                                   color: #6b7280;
                                   font-size: 13px;
                                   font-weight: 600;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }
                            .detail-auction-meta .price {
                                   color: #111827;
                                   font-size: clamp(24px, 3vw, 36px);
                                   font-weight: 800;
                                   line-height: 1.05;
                                   letter-spacing: -0.03em;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .detail-auction-meta .price span {
                                   color: inherit !important;
                            }
                            @media (max-width: 575px) {
                                   .detail-auction-strip {
                                          padding: 16px 14px;
                                    }
                                   .detail-auction-meta {
                                          min-width: 0;
                                   }
                                   .detail-auction-meta .price {
                                          font-size: 28px;
                                   }
                            }
                     ` }),
    showConfirm && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e4,
      animation: "fadeInOverlay 0.3s ease-out"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff",
        padding: "40px 30px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "450px",
        width: "90%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: "popupIn 0.3s ease-out"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { marginBottom: "20px" }, children: /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: "#f3f4f6",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px"
        }, children: "💰" }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "800", marginBottom: "10px", color: "#111827" }, children: "Confirm Your Bid" }),
        /* @__PURE__ */ jsxs("p", { style: { color: "#6b7280", fontSize: "16px", marginBottom: "30px" }, children: [
          "Are you sure you want to place a bid of ",
          /* @__PURE__ */ jsx("span", { style: { color: "#000", fontWeight: "700" }, children: /* @__PURE__ */ jsx(Price, { amountAED: bidAmount }) }),
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex gap-3 justify-content-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowConfirm(false),
              style: {
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontWeight: "600",
                color: "#374151"
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleConfirmPlaceBid,
              style: {
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "#000",
                color: "#fff",
                fontWeight: "600"
              },
              children: "Confirm Bid"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                                          @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                                          @keyframes popupIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                                   ` })
    ] }),
    toast.show && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      right: "25px",
      bottom: "25px",
      zIndex: 9999,
      minWidth: "280px",
      backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
      color: "#fff",
      padding: "16px 20px",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "slideIn 0.3s ease-out forwards"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: toast.type === "success" ? "✓" : "!" }),
      /* @__PURE__ */ jsx("div", { style: { fontWeight: "600", fontSize: "14px" }, children: toast.message }),
      /* @__PURE__ */ jsx("style", { children: `
                                          @keyframes slideIn {
                                                 from { transform: translateX(100%); opacity: 0; }
                                                  to { transform: translateX(0); opacity: 1; }
                                          }
                                   ` })
    ] })
  ] });
}
function BidHistory({ bids }) {
  const defaultProfileImage = "/assets/images/user.jpg";
  const getUrl = (path) => {
    if (!path) return defaultProfileImage;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://admin.xpertbid.com/${cleanPath}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "bid-history-parent", children: [
    /* @__PURE__ */ jsx("div", { className: "bid-history-header", children: /* @__PURE__ */ jsx("h2", { className: "description", children: "Bid History" }) }),
    /* @__PURE__ */ jsx("div", { className: "bid-history-scroll", children: Array.isArray(bids) && bids.length > 0 ? bids.map((bid) => {
      const user = bid.user || {};
      const userImage = user.profile_pic || user.image;
      const img = getUrl(userImage);
      const amountAED = Number(bid.bid_amount || bid.amount) || 0;
      const dateStr = new Date(bid.created_at).toLocaleString(void 0, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      return /* @__PURE__ */ jsxs("div", { className: "history-user parent", children: [
        /* @__PURE__ */ jsxs("div", { className: "history-user-profile", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: img,
              alt: "Bidder",
              referrerPolicy: "no-referrer",
              style: {
                width: "30px",
                height: "30px",
                borderRadius: "40%",
                objectFit: "cover"
              },
              onError: (e) => {
                e.target.src = defaultProfileImage;
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "username-and-date ms-3", children: [
            /* @__PURE__ */ jsx("p", { className: "history-user-name", children: user.name ? user.name.length > 15 ? user.name.substring(0, 15) + "..." : user.name : "Unknown" }),
            /* @__PURE__ */ jsx("span", { className: "date", children: dateStr })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "history-user-payAmount", children: /* @__PURE__ */ jsx("p", { className: "history-no", children: /* @__PURE__ */ jsx(Price, { amountAED }) }) })
      ] }, bid.id);
    }) : /* @__PURE__ */ jsx("p", { className: "text-center text-muted my-4", children: "No Bid History" }) })
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
function Show({ auction, bids, related, highestBid, winnerDetails, isFavorite }) {
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
          endDate: auction.end_date
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
        (auction.description || auction.product_year || auction.product_location) && /* @__PURE__ */ jsxs(AccordionItem, { title: "Key Information", defaultOpen: true, children: [
          auction.description && /* @__PURE__ */ jsx("div", { className: "mb-3", dangerouslySetInnerHTML: { __html: auction.description } }),
          auction.product_year && /* @__PURE__ */ jsxs("div", { className: "row gx-3 gy-2 align-items-center mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "col-auto", children: /* @__PURE__ */ jsx("span", { className: "badge bg-dark-subtle text-dark fw-normal", children: "Year" }) }),
            /* @__PURE__ */ jsx("div", { className: "col", children: /* @__PURE__ */ jsx("strong", { children: auction.product_year }) })
          ] })
        ] }),
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
    /* @__PURE__ */ jsx(RelatedItems, { items: related })
  ] });
}
export {
  Show as default
};
