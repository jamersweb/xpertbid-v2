import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AuctionCard } from "./AuctionCard-Bk42QYyW.js";
import "@inertiajs/react";
import "./OwnerInfoRow-Bp3cN_Xd.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "./FavoriteToggleButton-1jmbejDw.js";
import "./CartContext-DXNQZwkV.js";
import "ziggy-js";
function ExploreProducts({ products }) {
  if (!products || products.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-5 bg-white rounded-3 shadow-sm border mt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 opacity-25", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open fa-4x" }) }),
      /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-dark", children: "No Products Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted", children: "We couldn't find any products matching your current filters." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.href = route("marketplace.index"),
          className: "btn btn-primary rounded-pill px-4 mt-2",
          children: "Clear All Filters"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "row makt-parent w-100 mx-auto", children: products.map((product) => /* @__PURE__ */ jsx("div", { className: "col-md-6 col-xl-4 mkt-child mb-4", children: /* @__PURE__ */ jsx(AuctionCard, { auction: product }) }, product.id)) });
}
export {
  ExploreProducts as default
};
