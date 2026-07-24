import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Link, router } from "@inertiajs/react";
import { C as CountdownTimer, O as OwnerInfoRow } from "./CountdownTimer-BG03Al8T.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { F as FavoriteToggleButton } from "./FavoriteToggleButton-1jmbejDw.js";
import { u as useCart, b as buildProductHref } from "./productUrl-SijKnuS_.js";
import { i as isSoldOutListing, a as isDirectBuyListing, g as getDiscountMeta, b as getBaseListingPrice } from "./listingPricing-C5UuJtWm.js";
const AuctionCard = ({ auction, activeTab = "active", showPropertyMeta = false }) => {
  const { addToCart } = useCart();
  const isWonAuction = activeTab === "won";
  const listingKind = auction?.list_type || auction?.listing_type;
  const isLiveAuction = listingKind === "live_auction";
  const isSoldOut = isSoldOutListing(auction);
  const directBuyListing = isDirectBuyListing(auction);
  const discountMeta = getDiscountMeta(auction);
  const categoryFeatures = auction?.category_features && typeof auction.category_features === "object" ? auction.category_features : {};
  const isPropertyListing = String(auction?.category_id || "") === "222";
  const getFeatureValue = (...keys) => {
    for (const key of keys) {
      const value = categoryFeatures?.[key];
      if (value !== void 0 && value !== null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return "";
  };
  const beds = getFeatureValue("field_1", "1");
  const baths = getFeatureValue("field_2", "2");
  const areaSize = getFeatureValue("field_6", "6");
  const areaUnit = getFeatureValue("field_5", "5");
  const area = [areaSize, areaUnit].filter(Boolean).join(" ");
  const shouldRenderPropertyMeta = showPropertyMeta && isPropertyListing && (beds || baths || area);
  const handleCheckout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (auction.status === "closed") {
      alert("This product is closed and cannot be checked out.");
      return;
    }
    const result = await addToCart(auction.id, "product", null, auction);
    if (result.success || result.message === "Product already in cart") {
      router.visit(route("checkout.index"));
    } else {
      alert(result.message);
    }
  };
  const winningBidAmount = isWonAuction ? auction.current_highest_bid || auction.reserve_price || auction.minimum_bid || 0 : null;
  const imgPath = auction.image_url || (isLiveAuction && auction.youtube_video_id ? `https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg` : null) || "/assets/images/WebsiteBanner2.png";
  const maxBid = Number(auction?.current_highest_bid || auction?.bids_max_bid_amount || 0);
  const minBid = Number(auction?.minimum_bid || auction?.price || 0);
  const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
  const directBuyAmount = discountMeta.hasDiscount ? discountMeta.finalPrice : getBaseListingPrice(auction);
  const displayAmount = isWonAuction ? winningBidAmount : directBuyListing ? directBuyAmount : hasMaxBid ? maxBid : minBid;
  const displayLabel = isWonAuction ? "Winning Bid" : directBuyListing ? "Price" : isLiveAuction ? hasMaxBid ? "Live Bid" : "Start Price" : hasMaxBid ? "Current Bid" : "Minimum Bid";
  return /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "pro-image m-0", style: { position: "relative" }, children: [
      /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: auction.id }),
      /* @__PURE__ */ jsx(Link, { href: buildProductHref(auction.slug), className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: imgPath,
          alt: auction.title || auction.name || "Auction item",
          style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", borderRadius: "18px" },
          className: "img-fluid object-cover",
          loading: "lazy"
        }
      ) }) }),
      isLiveAuction && /* @__PURE__ */ jsxs(
        "span",
        {
          className: "badge rounded-pill bg-danger text-white",
          style: { position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px" },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle me-1", style: { fontSize: 8 } }),
            "Live Auction"
          ]
        }
      ),
      isSoldOut && /* @__PURE__ */ jsx(
        "span",
        {
          className: "badge rounded-pill bg-dark text-white",
          style: { position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px" },
          children: "Sold Out"
        }
      ),
      !isSoldOut && discountMeta.hasDiscount && /* @__PURE__ */ jsx(
        "span",
        {
          className: "badge text-white",
          style: { position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px", background: "rgba(220, 53, 69, 0.9)", borderRadius: "999px" },
          children: discountMeta.badgeText
        }
      ),
      !isSoldOut && !isWonAuction && !directBuyListing && !isLiveAuction && /* @__PURE__ */ jsx(CountdownTimer, { startDate: auction.start_date, endDate: auction.end_date })
    ] }),
    /* @__PURE__ */ jsx(
      OwnerInfoRow,
      {
        owner: auction.user,
        fallbackName: auction.user?.name,
        fallbackAvatar: auction.user?.profile_pic,
        isFeatured: Boolean(auction?.featured_name)
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: buildProductHref(auction.slug), className: "text-color-black", children: auction.title || auction.name || "Untitled" }) }) }),
    shouldRenderPropertyMeta && /* @__PURE__ */ jsxs("div", { className: "d-flex flex-nowrap gap-1 mt-2 mb-2 align-items-center overflow-hidden", children: [
      beds && /* @__PURE__ */ jsxs(
        "span",
        {
          className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate",
          style: { maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bed text-primary", "aria-hidden": "true" }),
            beds,
            " Beds"
          ]
        }
      ),
      baths && /* @__PURE__ */ jsxs(
        "span",
        {
          className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate",
          style: { maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bath text-primary", "aria-hidden": "true" }),
            baths,
            " Baths"
          ]
        }
      ),
      area && /* @__PURE__ */ jsxs(
        "span",
        {
          className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2",
          style: { fontSize: "0.88rem", minWidth: 0, whiteSpace: "normal", flex: "0 0 auto" },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-ruler-combined text-primary", "aria-hidden": "true" }),
            area
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
      /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
        /* @__PURE__ */ jsx("span", { children: displayLabel }),
        /* @__PURE__ */ jsx("div", { className: "price", children: directBuyListing && discountMeta.hasDiscount ? /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column", children: [
          /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted", style: { fontSize: "0.8em", lineHeight: 1 }, children: /* @__PURE__ */ jsx(Price, { amountAED: discountMeta.originalPrice }) }),
          /* @__PURE__ */ jsx("span", { className: "price text-danger", children: /* @__PURE__ */ jsx(Price, { amountAED: discountMeta.finalPrice }) })
        ] }) : /* @__PURE__ */ jsx("span", { className: "price", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: isWonAuction ? isSoldOut ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: true,
          style: {
            border: "none",
            background: "#9ca3af",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px 22px",
            fontWeight: 600,
            lineHeight: 1,
            cursor: "not-allowed"
          },
          children: "Sold Out"
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleCheckout,
          disabled: auction.status === "closed",
          style: {
            border: "none",
            background: "#23262F",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px 22px",
            fontWeight: 600,
            lineHeight: 1
          },
          children: "Checkout"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: isSoldOut ? /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", padding: "14px 22px", background: "#9ca3af", color: "#fff", fontWeight: 600, cursor: "not-allowed" }, children: "Sold Out" }) : /* @__PURE__ */ jsx(Link, { href: buildProductHref(auction.slug), children: directBuyListing ? "Buy Now" : isLiveAuction ? "Join Live" : "Place Bid" }) }) })
    ] })
  ] });
};
export {
  AuctionCard as A
};
