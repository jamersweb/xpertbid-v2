import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import { router } from "@inertiajs/react";
import { L as ListingCard } from "./ListingCard-B94e3GBu.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./ErrorPopup-VSFE5nHL.js";
import "./listingPricing-CwGdsu2n.js";
function MyListings({ auctions }) {
  const { t } = useTranslate();
  useEffect(() => {
    const reloadListings = () => {
      if (document.visibilityState === "visible") {
        router.reload({
          only: ["auctions"],
          preserveScroll: true,
          preserveState: true
        });
      }
    };
    const interval = setInterval(reloadListings, 1e4);
    const handleVisibilityChange = () => reloadListings();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return /* @__PURE__ */ jsx(AppLayout, { title: t("My Listings"), children: /* @__PURE__ */ jsx("section", { className: "listing", children: /* @__PURE__ */ jsxs("div", { className: "container-fluid", children: [
    /* @__PURE__ */ jsx("div", { className: "listing-main-heading", children: /* @__PURE__ */ jsx("h2", { children: t("My Listings") }) }),
    /* @__PURE__ */ jsx("div", { className: "row", children: auctions && auctions.length > 0 ? auctions.map((auction) => /* @__PURE__ */ jsx(
      ListingCard,
      {
        listing: auction,
        onDeleted: () => router.reload({
          only: ["auctions"],
          preserveScroll: true
        })
      },
      auction.id
    )) : /* @__PURE__ */ jsx("p", { className: "text-center py-5", children: t("No listings found.") }) })
  ] }) }) });
}
export {
  MyListings as default
};
