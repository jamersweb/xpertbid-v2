import { jsx, jsxs } from "react/jsx-runtime";
import { Head, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D8SyV4pl.js";
import "react";
import { B as BidSection, a as BidHistory } from "./BidHistory-Cat596rx.js";
import { L as ListingLiveChat } from "./ListingLiveChat-Bt0qLAKB.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
function YoutubeLiveEmbed({ videoId, title = "Live stream" }) {
  if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
    return null;
  }
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;
  return /* @__PURE__ */ jsx("div", { className: "xb-youtube-embed rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "ratio ratio-16x9", style: { position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      title,
      src,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      loading: "lazy",
      referrerPolicy: "strict-origin-when-cross-origin",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: 0
      }
    }
  ) }) });
}
function LiveAuction({
  auction,
  bids,
  highestBid,
  winnerDetails,
  isFavorite,
  youtubeVideoId,
  standardProductUrl
}) {
  const refreshAuctionProps = () => {
    router.reload({
      only: ["auction", "bids", "highestBid", "winnerDetails", "isFavorite"],
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Live demo — ${auction.title}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Live demo — ${auction.title}` }),
    /* @__PURE__ */ jsxs("div", { className: "container-fluid py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "badge bg-primary me-2", children: "Demo" }),
          /* @__PURE__ */ jsx("h1", { className: "h4 d-inline m-0", children: "Live stream + room chat + bidding" }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted small mb-0 mt-1", children: [
            "Same listing as",
            " ",
            /* @__PURE__ */ jsx("a", { href: standardProductUrl, children: "the standard product page" }),
            ". Bids and chat are on XpertBid; video is embedded from YouTube."
          ] })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "btn btn-outline-secondary btn-sm", href: standardProductUrl, children: "Open classic layout" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "row g-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-lg-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "h6 text-uppercase text-muted mb-2", children: "Live video" }),
          /* @__PURE__ */ jsx(YoutubeLiveEmbed, { videoId: youtubeVideoId, title: auction.title }),
          /* @__PURE__ */ jsxs("p", { className: "small text-muted mt-2 mb-0", children: [
            "If you set a ",
            /* @__PURE__ */ jsx("strong", { children: "YouTube Live / video" }),
            " on this listing in Admin, that stream is used here. Otherwise a default 24/7 stream is shown for the demo layout."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-lg-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "h6 text-uppercase text-muted mb-2", children: "Room chat" }),
          /* @__PURE__ */ jsx(ListingLiveChat, { listingId: auction.id, listingSlug: auction.slug })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-lg-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "h6 text-uppercase text-muted mb-2", children: "Bid on XpertBid" }),
          /* @__PURE__ */ jsx("div", { className: "border rounded-3 p-2 p-md-3 bg-light bg-opacity-25", children: /* @__PURE__ */ jsx(
            BidSection,
            {
              product: auction,
              highestBidProp: highestBid,
              onBidPlaced: refreshAuctionProps,
              winnerDetails,
              isFavoriteProp: isFavorite
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "row g-4 mt-1", children: /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "h6 text-uppercase text-muted mb-2", children: "Bid history" }),
        /* @__PURE__ */ jsx(BidHistory, { bids })
      ] }) })
    ] })
  ] });
}
export {
  LiveAuction as default
};
