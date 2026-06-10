import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-DE5nDs2t.js";
import { Head, Link } from "@inertiajs/react";
import { L as ListingCard } from "./ListingCard-_a306Jge.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "react";
import "./CartContext-eSDe5PYw.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./ErrorPopup-VSFE5nHL.js";
import "./listingPricing-C5UuJtWm.js";
function Dashboard({ listingsCount, biddingsCount, listings }) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Dashboard"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("User Dashboard") }),
    /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: [
      /* @__PURE__ */ jsx("section", { className: "dashboard-records py-4", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsx("h1", { className: "mkt-sec mb-4 px-3", style: { fontSize: "32px", fontWeight: "800", color: "#23262F" }, children: t("Dashboard") }),
        /* @__PURE__ */ jsx("div", { className: "col-md-6 mb-4 px-3", children: /* @__PURE__ */ jsxs("div", { className: "records-box d-flex align-items-center p-4 bg-white", style: {
          borderRadius: "25px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
          gap: "20px",
          border: "1px solid #f0f0f0"
        }, children: [
          /* @__PURE__ */ jsx("img", { src: "/assets/images/dashboard-listing.svg", alt: "Listings", style: {
            backgroundColor: "#DCECFA",
            borderRadius: "100%",
            padding: "15px",
            width: "80px",
            height: "80px"
          } }),
          /* @__PURE__ */ jsxs("div", { className: "score-title", children: [
            /* @__PURE__ */ jsx("span", { className: "score d-block fw-bold", style: {
              fontSize: "38px",
              lineHeight: "44px",
              color: "#23262F",
              fontFamily: '"Inter", sans-serif'
            }, children: listingsCount }),
            /* @__PURE__ */ jsx("h6", { className: "title mb-0", style: {
              fontSize: "18px",
              lineHeight: "26px",
              fontWeight: "700",
              color: "#606060",
              fontFamily: '"Inter", sans-serif'
            }, children: t("Listings") })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "col-md-6 mb-4 px-3", children: /* @__PURE__ */ jsxs("div", { className: "records-box d-flex align-items-center p-4 bg-white", style: {
          borderRadius: "25px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
          gap: "20px",
          border: "1px solid #f0f0f0"
        }, children: [
          /* @__PURE__ */ jsx("img", { src: "/assets/images/dashboard-bidding.svg", alt: "Biddings", style: {
            backgroundColor: "#DCECFA",
            borderRadius: "100%",
            padding: "15px",
            width: "80px",
            height: "80px"
          } }),
          /* @__PURE__ */ jsxs("div", { className: "score-title", children: [
            /* @__PURE__ */ jsx("span", { className: "score d-block fw-bold", style: {
              fontSize: "38px",
              lineHeight: "44px",
              color: "#23262F",
              fontFamily: '"Inter", sans-serif'
            }, children: biddingsCount }),
            /* @__PURE__ */ jsx("h6", { className: "title mb-0", style: {
              fontSize: "18px",
              lineHeight: "26px",
              fontWeight: "700",
              color: "#606060",
              fontFamily: '"Inter", sans-serif'
            }, children: t("Biddings") })
          ] })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mx-4 px-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-0", style: { fontSize: "34px", fontWeight: "700", color: "#23262F" }, children: t("My Listings") }),
        /* @__PURE__ */ jsx(Link, { className: "button-style-3", href: route("auctions.mylistings"), children: t("See all") })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "listing pb-5", children: /* @__PURE__ */ jsx("div", { className: "container dashboard-listing", children: /* @__PURE__ */ jsx("div", { className: "row g-4", children: listings && listings.length > 0 ? listings.map((listing) => /* @__PURE__ */ jsx("div", { className: "col-12 px-3", children: /* @__PURE__ */ jsx(ListingCard, { listing }) }, listing.id)) : /* @__PURE__ */ jsx("div", { className: "col-12 text-center py-5", children: /* @__PURE__ */ jsx("p", { className: "text-muted", children: t("No listings available.") }) }) }) }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
