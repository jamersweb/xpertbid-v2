import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-DGCnkUrN.js";
import { A as AuctionCard } from "./AuctionCard-DJtDXSLr.js";
import { M as MallHeroBanner } from "./MallHeroBanner-CRohH5SK.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./productUrl-DG64MGAp.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CountdownTimer-BG03Al8T.js";
import "./FavoriteToggleButton-1jmbejDw.js";
import "./listingPricing-AMeF2Tun.js";
const SELLER_BANNER = "/assets/images/WebsiteBanner3.png";
function Seller({ mall, seller, listings }) {
  const { t } = useTranslate();
  const listingItems = Array.isArray(listings?.data) ? listings.data : [];
  const paginationLinks = Array.isArray(listings?.links) ? listings.links : [];
  const sellerLabel = seller?.label || seller?.company_name || seller?.name || t("Seller");
  const [sortBy, setSortBy] = useState("latest");
  const sortedItems = useMemo(() => {
    const items = [...listingItems];
    if (sortBy === "price_asc" || sortBy === "price_desc") {
      items.sort((a, b) => {
        const priceA = Number(a?.price || a?.buy_now_price || a?.minimum_bid || 0);
        const priceB = Number(b?.price || b?.buy_now_price || b?.minimum_bid || 0);
        return sortBy === "price_asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (sortBy === "title") {
      items.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    }
    return items;
  }, [listingItems, sortBy]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: sellerLabel, children: [
    /* @__PURE__ */ jsx(Head, { title: `${sellerLabel} | ${mall?.name || t("Malls")}` }),
    /* @__PURE__ */ jsxs("section", { className: "mall-seller-page", children: [
      /* @__PURE__ */ jsx(
        MallHeroBanner,
        {
          image: SELLER_BANNER,
          eyebrow: mall?.name,
          title: sellerLabel,
          subtitle: t("Products from this seller")
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "container py-4 py-lg-5", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("malls.show", mall.slug),
            className: "mall-seller-page__back",
            children: [
              "← ",
              mall?.name
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mall-seller-toolbar", children: [
          /* @__PURE__ */ jsxs("span", { className: "mall-seller-toolbar__count", children: [
            listings?.total ?? sortedItems.length,
            " ",
            (listings?.total ?? sortedItems.length) === 1 ? t("product") : t("products")
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "mall-seller-toolbar__sort", children: [
            /* @__PURE__ */ jsx("span", { children: t("Sort by") }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "latest", children: t("Most relevant") }),
                  /* @__PURE__ */ jsx("option", { value: "title", children: t("Name A–Z") }),
                  /* @__PURE__ */ jsx("option", { value: "price_asc", children: t("Price: Low to High") }),
                  /* @__PURE__ */ jsx("option", { value: "price_desc", children: t("Price: High to Low") })
                ]
              }
            )
          ] })
        ] }),
        sortedItems.length > 0 ? /* @__PURE__ */ jsx("div", { className: "row g-4 mall-seller-products", children: sortedItems.map((listing) => /* @__PURE__ */ jsx("div", { className: "col-12 col-sm-6 col-lg-4", children: /* @__PURE__ */ jsx("div", { className: "mall-seller-product-card h-100", children: /* @__PURE__ */ jsx(AuctionCard, { auction: listing, showPropertyMeta: true }) }) }, listing.id)) }) : /* @__PURE__ */ jsx("div", { className: "mall-seller-page__empty text-center py-5", children: /* @__PURE__ */ jsx("p", { className: "mb-0", children: t("This seller has no active listings yet.") }) }),
        paginationLinks.length > 3 && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center mt-5", children: /* @__PURE__ */ jsx("nav", { "aria-label": "Seller listings pagination", children: /* @__PURE__ */ jsx("ul", { className: "pagination", children: paginationLinks.map((link, i) => /* @__PURE__ */ jsx(
          "li",
          {
            className: `page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`,
            children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "page-link",
                disabled: !link.url,
                onClick: () => link.url && router.get(link.url, {}, { preserveScroll: true }),
                dangerouslySetInnerHTML: { __html: link.label }
              }
            )
          },
          i
        )) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                            .mall-seller-page {
                                   background: #fff;
                                   min-height: 60vh;
                            }
                            .mall-seller-page__back {
                                   display: inline-block;
                                   margin-bottom: 16px;
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                                   text-decoration: none;
                            }
                            .mall-seller-page__back:hover {
                                   color: #23262F;
                            }
                            .mall-seller-toolbar {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 16px;
                                   flex-wrap: wrap;
                                   padding: 14px 0;
                                   margin-bottom: 20px;
                                   border-top: 1px solid #ECEEF2;
                                   border-bottom: 1px solid #ECEEF2;
                            }
                            .mall-seller-toolbar__count {
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                            }
                            .mall-seller-toolbar__sort {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 10px;
                                   margin: 0;
                                   color: #777E91;
                                   font-size: 13px;
                                   font-weight: 600;
                            }
                            .mall-seller-toolbar__sort select {
                                   border: 1px solid #D0D5DD;
                                   border-radius: 8px;
                                   padding: 8px 12px;
                                   background: #fff;
                                   color: #23262F;
                                   font-size: 13px;
                                   font-weight: 600;
                                   min-width: 160px;
                            }
                            .mall-seller-product-card {
                                   background: transparent;
                                   padding: 0;
                                   border: none;
                                   border-radius: 0;
                                   height: 100%;
                            }
                            .mall-seller-page__empty {
                                   color: #777E91;
                                   font-size: 15px;
                                   font-weight: 500;
                                   background: #F9F9F9;
                                   border-radius: 16px;
                                   border: 1px solid #ECEEF2;
                            }
                     `
    } })
  ] });
}
export {
  Seller as default
};
