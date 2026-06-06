import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AuctionCard } from "./AuctionCard-CkLAuDiK.js";
import "@inertiajs/react";
import "./OwnerInfoRow-DJ1W7dqV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "./FavoriteToggleButton-1jmbejDw.js";
import "./CartContext-DXNQZwkV.js";
import "ziggy-js";
import "./listingPricing-CwGdsu2n.js";
function ExploreProducts({ products }) {
  if (!products || products.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-3 shadow-sm border mt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 d-flex justify-content-center", children: /* @__PURE__ */ jsx(
        "svg",
        {
          width: "64",
          height: "64",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx("path", { d: "M3 8.5L12 3L21 8.5M3 8.5V15.5L12 21M3 8.5L12 14M21 8.5V15.5L12 21M21 8.5L12 14M12 14V21", stroke: "#94A3B8", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })
        }
      ) }),
      /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-dark", children: "No Products Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted", children: "We couldn't find any products matching your current filters." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.href = route("marketplace.index"),
          className: "btn btn-dark rounded-3 px-4 py-2 mt-2",
          children: "Clear All Filters"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "row makt-parent w-100 mx-auto", children: products.map((product) => /* @__PURE__ */ jsx("div", { className: "col-md-6 col-xl-4 mkt-child mb-4", children: /* @__PURE__ */ jsx(AuctionCard, { auction: product, showPropertyMeta: true }) }, product.id)) });
}
export {
  ExploreProducts as default
};
