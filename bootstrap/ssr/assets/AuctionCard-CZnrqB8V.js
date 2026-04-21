import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Link, router } from "@inertiajs/react";
import { C as CountdownTimer, O as OwnerInfoRow } from "./OwnerInfoRow-BzmY3N9i.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { F as FavoriteToggleButton } from "./FavoriteToggleButton-1jmbejDw.js";
import { u as useCart } from "./CartContext-DXNQZwkV.js";
const AuctionCard = ({ auction, activeTab = "active", showPropertyMeta = false }) => {
  const { addToCart } = useCart();
  const isWonAuction = activeTab === "won";
  const listingKind = auction?.list_type || auction?.listing_type;
  const isDirectBuyListing = ["normal", "normal_list", "business", "business_list"].includes(listingKind);
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
  const beds = getFeatureValue("field_5", "5");
  const baths = getFeatureValue("field_6", "6__6", "6");
  const areaSize = getFeatureValue("field_3", "3");
  const areaUnit = getFeatureValue("field_4", "4");
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
  const imgPath = auction.image_url || "/assets/images/WebsiteBanner2.png";
  const maxBid = Number(auction?.current_highest_bid || auction?.bids_max_bid_amount || 0);
  const minBid = Number(auction?.minimum_bid || auction?.price || 0);
  const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
  const displayAmount = isWonAuction ? winningBidAmount : hasMaxBid ? maxBid : minBid;
  const displayLabel = isWonAuction ? "Winning Bid" : isDirectBuyListing ? "Price" : hasMaxBid ? "Current Bid" : "Minimum Bid";
  return /* @__PURE__ */ jsxs("div", { className: "product-card-wrapper h-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "pro-image m-0", style: { position: "relative" }, children: [
      /* @__PURE__ */ jsx(FavoriteToggleButton, { listingId: auction.id }),
      /* @__PURE__ */ jsx(Link, { href: `/product/${auction.slug}`, className: "product-box", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] w-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: imgPath,
          alt: auction.title || auction.name || "Auction item",
          style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", borderRadius: "18px" },
          className: "img-fluid object-cover",
          loading: "lazy"
        }
      ) }) }),
      !isWonAuction && !isDirectBuyListing && /* @__PURE__ */ jsx(CountdownTimer, { startDate: auction.start_date, endDate: auction.end_date })
    ] }),
    /* @__PURE__ */ jsx(
      OwnerInfoRow,
      {
        owner: auction.user,
        fallbackName: auction.user?.name,
        fallbackAvatar: auction.user?.profile_pic
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pro-title", style: { color: "black" }, children: /* @__PURE__ */ jsx("h2", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${auction.slug}`, className: "text-color-black", children: auction.title || auction.name || "Untitled" }) }) }),
    shouldRenderPropertyMeta && /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-2 mt-2 mb-2", children: [
      beds && /* @__PURE__ */ jsxs("span", { className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-3 py-2", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bed text-primary", "aria-hidden": "true" }),
        beds,
        " Beds"
      ] }),
      baths && /* @__PURE__ */ jsxs("span", { className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-3 py-2", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bath text-primary", "aria-hidden": "true" }),
        baths,
        " Baths"
      ] }),
      area && /* @__PURE__ */ jsxs("span", { className: "badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-3 py-2", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-ruler-combined text-primary", "aria-hidden": "true" }),
        area
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pro-meta", children: [
      /* @__PURE__ */ jsxs("div", { className: "pro-price", children: [
        /* @__PURE__ */ jsx("span", { children: displayLabel }),
        /* @__PURE__ */ jsx("div", { className: "price", children: /* @__PURE__ */ jsx("span", { className: "price", style: { color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: displayAmount }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pro-buy-btn", children: isWonAuction ? /* @__PURE__ */ jsx(
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
      ) : /* @__PURE__ */ jsx("div", { className: "pro-bid-btn", children: /* @__PURE__ */ jsx(Link, { href: `/product/${auction.slug}`, children: isDirectBuyListing ? "Buy Now" : "Place Bid" }) }) })
    ] })
  ] });
};
export {
  AuctionCard as A
};
