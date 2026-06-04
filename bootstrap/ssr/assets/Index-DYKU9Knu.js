import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Link, router, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BQ8UWi9o.js";
import { C as CountdownTimer, O as OwnerInfoRow } from "./OwnerInfoRow-DJ1W7dqV.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { b as isDirectBuyListing, i as isSoldOutListing, g as getDiscountMeta } from "./listingPricing-CwGdsu2n.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
const FavoriteCard = ({ favorite }) => {
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this from your favorites?")) {
      router.post(route("favorites.toggle"), { listing_id: favorite.id }, {
        preserveScroll: true
      });
    }
  };
  const imgPath = favorite.image || "/assets/images/placeholder.jpg";
  const title = favorite.title || favorite.name || "Product";
  const directBuyListing = isDirectBuyListing(favorite);
  const isSoldOut = isSoldOutListing(favorite);
  const discountMeta = getDiscountMeta(favorite);
  const displayLabel = directBuyListing ? "Price" : Number(favorite.current_bid) > 0 ? "Current Bid" : "Minimum Bid";
  return /* @__PURE__ */ jsx("div", { className: "col-lg-4 col-md-6 col-sm-12 mkt-child", children: /* @__PURE__ */ jsxs("div", { className: "market-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "mkt-img", children: [
      /* @__PURE__ */ jsx(Link, { href: `/product/${favorite.slug}`, className: "product-box", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: imgPath,
          alt: title,
          loading: "lazy"
        }
      ) }),
      favorite.end_date && !isSoldOut && !directBuyListing && /* @__PURE__ */ jsx(CountdownTimer, { startDate: favorite.start_date, endDate: favorite.end_date }),
      isSoldOut && /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#111827",
            color: "white",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 10
          },
          children: "Sold Out"
        }
      ),
      !isSoldOut && discountMeta.hasDiscount && /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(220, 53, 69, 0.9)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 10
          },
          children: discountMeta.badgeText
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "favourite-icon", onClick: handleRemove, title: "Remove from favorites", children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "#FF4D4D",
          children: /* @__PURE__ */ jsx("path", { d: "M16.44 3.1001C14.63 3.1001 13.01 3.9801 12 5.3301C10.99 3.9801 9.37 3.1001 7.56 3.1001C4.49 3.1001 2 5.6001 2 8.6901C2 9.8801 2.19 10.9801 2.52 12.0001C4.1 17.0001 8.97 19.9901 11.38 20.8101C11.72 20.9301 12.28 20.9301 12.62 20.8101C15.03 19.9901 19.9 17.0001 21.48 12.0001C21.81 10.9801 22 9.8801 22 8.6901C22 5.6001 19.51 3.1001 16.44 3.1001Z" })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mkt-body", children: [
      /* @__PURE__ */ jsx("div", { className: "mkt-pro-head", children: /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsx(Link, { href: `/product/${favorite.slug}`, children: title }) }) }),
      /* @__PURE__ */ jsx(
        OwnerInfoRow,
        {
          owner: favorite.owner,
          fallbackName: favorite.user_name,
          fallbackAvatar: favorite.profile_pic,
          isFeatured: Boolean(favorite?.featured_name)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mkt-detail", children: [
        /* @__PURE__ */ jsxs("div", { className: "mkt-crt-bid", children: [
          /* @__PURE__ */ jsx("span", { className: "crnt-bid", children: displayLabel }),
          /* @__PURE__ */ jsx("div", { className: "mkt-bid-price", children: isSoldOut ? /* @__PURE__ */ jsx("span", { className: "price text-muted fw-bold", children: "Sold Out" }) : directBuyListing && discountMeta.hasDiscount ? /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column", children: [
            /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted", style: { fontSize: "0.8em", lineHeight: 1 }, children: /* @__PURE__ */ jsx(Price, { className: "price", amountAED: discountMeta.originalPrice }) }),
            /* @__PURE__ */ jsx("span", { className: "text-danger", children: /* @__PURE__ */ jsx(Price, { className: "price", amountAED: discountMeta.finalPrice }) })
          ] }) : /* @__PURE__ */ jsx(
            Price,
            {
              className: "price",
              amountAED: favorite.current_bid || favorite.minimum_bid
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mkt-bid-btn", children: isSoldOut ? /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", padding: "12px 18px", background: "#9ca3af", color: "#fff", fontWeight: 600, cursor: "not-allowed" }, children: "Sold Out" }) : /* @__PURE__ */ jsx(Link, { href: `/product/${favorite.slug}`, children: directBuyListing ? "Buy Now" : "Place Bid" }) })
      ] })
    ] })
  ] }) });
};
function Index({ favorites }) {
  return /* @__PURE__ */ jsxs(AppLayout, { title: "My Favorites", children: [
    /* @__PURE__ */ jsx(Head, { title: "My Favorites" }),
    /* @__PURE__ */ jsx("div", { className: "py-5 bg-light min-vh-100", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
      /* @__PURE__ */ jsx("div", { className: "fav-like-hdig pt-4 mb-4", children: /* @__PURE__ */ jsx("h2", { className: "fw-bold", children: "My Favorites" }) }),
      favorites.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-3 shadow-sm border", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-regular fa-heart fa-4x text-muted opacity-25" }) }),
        /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold text-dark mt-3", children: "No Favorites Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted mb-4", children: "Items you've liked will appear here for quick access." }),
        /* @__PURE__ */ jsx("a", { href: "/marketplace", className: "btn btn-primary px-4 py-2 rounded-pill fw-bold", children: "Discover Auctions" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "row g-4 makt-parent", children: favorites.map((favorite) => /* @__PURE__ */ jsx(FavoriteCard, { favorite }, favorite.id)) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .markt-parent {
                    display: flex;
                    flex-wrap: wrap;
                }
                .marketplace {
                    padding: 40px 0;
                }
                .fav-like-hdig h2 {
                    font-size: 32px;
                    color: #23262F;
                    margin-bottom: 20px;
                }
                .makt-parent {
                    display: flex;
                    flex-wrap: wrap;
                    margin-left: -15px;
                    margin-right: -15px;
                }
                /* Ported mkt- styles */
                .mkt-child {
                    margin-bottom: 30px;
                }
                .market-card {
                    background: #FFFFFF;
                    border: 1px solid #E6E8EC;
                    border-radius: 20px;
                    padding: 12px;
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .market-card:hover {
                    box-shadow: 0 12px 32px rgba(31, 47, 70, 0.12);
                    transform: translateY(-4px);
                }
                .mkt-img {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                }
                .mkt-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .favourite-icon {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #FFFFFF;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 11;
                }
                .mkt-body {
                    padding: 12px 4px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .mkt-pro-head h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #23262F;
                    margin-bottom: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .mkt-detail {
                    margin-top: auto;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    background: #F4F5F6;
                    border-radius: 12px;
                    padding: 12px;
                }
                .crnt-bid {
                    font-size: 11px;
                    color: #777E91;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 4px;
                }
                .mkt-bid-price .price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #23262F;
                }
                .mkt-bid-btn a {
                    background: #43ACE9;
                    color: #FFFFFF;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .mkt-bid-btn a:hover {
                    background: #35a0dc;
                }

                /* Countdown Timer Styling */
                .mkt-img .counter {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(28, 29, 32, 0.85);
                    padding: 8px 12px;
                    border-radius: 10px;
                    z-index: 10;
                    width: auto !important;
                    min-width: 180px;
                }
                .counter-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }
                .counter-box {
                    text-align: center;
                }
                .counter-value {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                }
                .counter-label {
                    color: #fff;
                    font-size: 8px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }

                /* Owner Info Row */
                .owner-info-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 8px 0 12px;
                }
                .owner-info-row img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .owner-info-row span {
                    font-size: 14px;
                    color: #23262F;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `
    } })
  ] });
}
export {
  Index as default
};
