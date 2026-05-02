import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D8SyV4pl.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
const thumbnailFor = (auction) => {
  if (auction?.youtube_video_id) {
    return `https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg`;
  }
  return auction?.image_url || "/assets/images/WebsiteBanner2.png";
};
const thumbnailForVideoId = (videoId, fallbackAuction = null) => {
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return thumbnailFor(fallbackAuction);
};
const statusStyle = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "active") return { background: "#dcfce7", color: "#047857" };
  if (normalized === "awarded") return { background: "#ede9fe", color: "#6d28d9" };
  if (normalized === "closed") return { background: "#e2e8f0", color: "#334155" };
  if (normalized === "ended") return { background: "#ffedd5", color: "#c2410c" };
  return { background: "#f1f5f9", color: "#475569" };
};
function LiveAuctionCard({ auction, isActive, activeSlug }) {
  const highestBid = Number(auction?.bids_max_bid_amount || auction?.current_highest_bid || 0);
  const startPrice = Number(auction?.minimum_bid || auction?.price || auction?.listing_data?.start_price || 0);
  const joinSlug = isActive ? auction?.slug : activeSlug || auction?.slug;
  return /* @__PURE__ */ jsxs("article", { className: `live-auction-card ${isActive ? "is-active" : ""}`, children: [
    /* @__PURE__ */ jsxs(Link, { href: joinSlug ? route("product.show", joinSlug) : "#", className: "live-auction-card-media", children: [
      /* @__PURE__ */ jsx("img", { src: thumbnailFor(auction), alt: auction?.title || "Live auction" }),
      /* @__PURE__ */ jsx("span", { className: "live-auction-play", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-play" }) }),
      /* @__PURE__ */ jsx("span", { className: "live-auction-badge", style: statusStyle(auction?.status), children: isActive ? "Live Now" : auction?.status || "Selected" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "live-auction-card-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "live-auction-meta-row", children: [
        /* @__PURE__ */ jsx("span", { children: auction?.category?.name || "Live Auction" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "#",
          auction?.id
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: auction?.title || "Untitled live auction" }),
      /* @__PURE__ */ jsxs("div", { className: "live-auction-price-row", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: highestBid > 0 ? "Highest Bid" : "Start Price" }),
          /* @__PURE__ */ jsx("strong", { children: /* @__PURE__ */ jsx(Price, { amountAED: highestBid > 0 ? highestBid : startPrice }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: "Bids" }),
          /* @__PURE__ */ jsx("strong", { children: auction?.bids_count || 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { href: joinSlug ? route("product.show", joinSlug) : "#", className: `live-auction-join ${isActive ? "is-live" : ""}`, children: isActive ? "Join Live" : "View Active Live" })
    ] })
  ] });
}
function LiveAuctionsIndex({ session, liveAuctions = [], activeAuction = null }) {
  const activeSlug = activeAuction?.slug || liveAuctions.find((auction) => auction?.status === "active")?.slug || liveAuctions[0]?.slug;
  const liveSetupThumbnail = thumbnailForVideoId(session?.youtube_video_id, activeAuction);
  const sortedAuctions = [...liveAuctions].sort((a, b) => {
    if (a?.id === activeAuction?.id) return -1;
    if (b?.id === activeAuction?.id) return 1;
    return 0;
  });
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Live Auctions | XpertBid", children: [
    /* @__PURE__ */ jsxs("main", { className: "live-auctions-page", children: [
      /* @__PURE__ */ jsxs("section", { className: "live-auctions-hero", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "live-auctions-kicker", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle" }),
            "Live Auction Room"
          ] }),
          /* @__PURE__ */ jsx("h1", { children: "Join the current live auction" }),
          /* @__PURE__ */ jsx("p", { children: "Watch the live stream, follow the selected products, and place bids on the product that is active right now." }),
          /* @__PURE__ */ jsxs("div", { className: "live-auctions-actions", children: [
            activeSlug ? /* @__PURE__ */ jsx(Link, { href: route("product.show", activeSlug), className: "live-auctions-primary", children: "Join Live" }) : /* @__PURE__ */ jsx("span", { className: "live-auctions-primary is-disabled", children: "No Live Auction" }),
            /* @__PURE__ */ jsx(Link, { href: "/marketplace?type=live_auction", className: "live-auctions-secondary", children: "Browse All Live Auctions" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "live-auctions-feature", children: activeAuction ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("img", { src: liveSetupThumbnail, alt: activeAuction.title || "Active live auction" }),
          /* @__PURE__ */ jsxs("div", { className: "live-auctions-feature-info", children: [
            /* @__PURE__ */ jsx("span", { children: "Currently Active" }),
            /* @__PURE__ */ jsx("h2", { children: activeAuction.title }),
            /* @__PURE__ */ jsx("p", { children: activeAuction.category?.name || "Live Auction" })
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { className: "live-auctions-empty-feature", children: "No active live auction selected yet." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "live-auctions-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "live-auctions-section-head", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { children: "Selected Live Products" }),
            /* @__PURE__ */ jsx("p", { children: session ? "These products are selected by admin for the current live room." : "Latest live auction products are shown below." })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            liveAuctions.length,
            " products"
          ] })
        ] }),
        sortedAuctions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "live-auctions-grid", children: sortedAuctions.map((auction) => /* @__PURE__ */ jsx(
          LiveAuctionCard,
          {
            auction,
            isActive: auction.id === activeAuction?.id || auction.status === "active",
            activeSlug
          },
          auction.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "live-auctions-empty", children: [
          /* @__PURE__ */ jsx("h3", { children: "No live auctions yet" }),
          /* @__PURE__ */ jsx("p", { children: "Please check again later." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .live-auctions-page {
                                   background: #f5f7fb;
                                   padding: 32px 0 56px;
                                   min-height: 80vh;
                            }
                            .live-auctions-hero,
                            .live-auctions-section {
                                   width: min(1200px, calc(100% - 32px));
                                   margin: 0 auto;
                            }
                            .live-auctions-hero {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
                                   gap: 24px;
                                   align-items: stretch;
                                   background: #ffffff;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 8px;
                                   padding: 28px;
                                   box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
                            }
                            .live-auctions-kicker {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 8px;
                                   color: #dc2626;
                                   font-weight: 900;
                                   font-size: 13px;
                                   text-transform: uppercase;
                                   margin-bottom: 12px;
                            }
                            .live-auctions-kicker i {
                                   font-size: 8px;
                            }
                            .live-auctions-hero h1 {
                                   font-size: clamp(30px, 4vw, 52px);
                                   line-height: 1;
                                   color: #111827;
                                   font-weight: 950;
                                   margin: 0 0 14px;
                                   letter-spacing: 0;
                            }
                            .live-auctions-hero p {
                                   color: #64748b;
                                   font-size: 16px;
                                   max-width: 620px;
                                   margin: 0;
                            }
                            .live-auctions-actions {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   margin-top: 24px;
                            }
                            .live-auctions-primary,
                            .live-auctions-secondary {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   min-height: 48px;
                                   padding: 0 22px;
                                   border-radius: 8px;
                                   font-weight: 900;
                                   text-decoration: none;
                            }
                            .live-auctions-primary {
                                   background: #111827;
                                   color: #ffffff;
                            }
                            .live-auctions-primary.is-disabled {
                                   background: #9ca3af;
                            }
                            .live-auctions-secondary {
                                   background: #eef2f7;
                                   color: #111827;
                            }
                            .live-auctions-feature {
                                   min-height: 260px;
                                   border-radius: 8px;
                                   overflow: hidden;
                                   position: relative;
                                   background: #111827;
                            }
                            .live-auctions-feature img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                                   opacity: 0.85;
                            }
                            .live-auctions-feature-info {
                                   position: absolute;
                                   left: 18px;
                                   right: 18px;
                                   bottom: 18px;
                                   color: #ffffff;
                            }
                            .live-auctions-feature-info span {
                                   display: inline-flex;
                                   background: #dc2626;
                                   color: #ffffff;
                                   border-radius: 999px;
                                   padding: 6px 10px;
                                   font-size: 12px;
                                   font-weight: 900;
                                   margin-bottom: 10px;
                            }
                            .live-auctions-feature-info h2 {
                                   font-size: 24px;
                                   font-weight: 950;
                                   margin: 0 0 4px;
                                   color: #ffffff;
                                   letter-spacing: 0;
                            }
                            .live-auctions-feature-info p {
                                   color: rgba(255, 255, 255, 0.82);
                                   margin: 0;
                            }
                            .live-auctions-section {
                                   margin-top: 28px;
                                   background: #ffffff;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 8px;
                                   padding: 24px;
                            }
                            .live-auctions-section-head {
                                   display: flex;
                                   justify-content: space-between;
                                   gap: 16px;
                                   align-items: end;
                                   margin-bottom: 20px;
                            }
                            .live-auctions-section-head h2 {
                                   font-size: 24px;
                                   color: #111827;
                                   font-weight: 950;
                                   margin: 0 0 4px;
                                   letter-spacing: 0;
                            }
                            .live-auctions-section-head p,
                            .live-auctions-section-head span {
                                   color: #64748b;
                                   margin: 0;
                                   font-weight: 700;
                            }
                            .live-auctions-grid {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 18px;
                            }
                            .live-auction-card {
                                   border: 1px solid #e5e7eb;
                                   border-radius: 8px;
                                   overflow: hidden;
                                   background: #ffffff;
                                   box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
                            }
                            .live-auction-card.is-active {
                                   border-color: #dc2626;
                                   box-shadow: 0 14px 36px rgba(220, 38, 38, 0.14);
                            }
                            .live-auction-card-media {
                                   display: block;
                                   aspect-ratio: 4 / 3;
                                   position: relative;
                                   overflow: hidden;
                                   background: #111827;
                              }
                            .live-auction-card-media img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            .live-auction-play {
                                   position: absolute;
                                   inset: 0;
                                   margin: auto;
                                   width: 58px;
                                   height: 42px;
                                   border-radius: 12px;
                                   background: #ef4444;
                                   color: #ffffff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
                            }
                            .live-auction-badge {
                                   position: absolute;
                                   left: 12px;
                                   top: 12px;
                                   border-radius: 999px;
                                   padding: 7px 10px;
                                   font-size: 12px;
                                   font-weight: 950;
                                   text-transform: uppercase;
                            }
                            .live-auction-card-body {
                                   padding: 16px;
                            }
                            .live-auction-meta-row {
                                   display: flex;
                                   justify-content: space-between;
                                   gap: 12px;
                                   color: #64748b;
                                   font-size: 12px;
                                   font-weight: 800;
                                   margin-bottom: 8px;
                            }
                            .live-auction-card h3 {
                                   font-size: 18px;
                                   line-height: 1.25;
                                   color: #111827;
                                   font-weight: 950;
                                   margin: 0 0 14px;
                                   min-height: 45px;
                                   letter-spacing: 0;
                            }
                            .live-auction-price-row {
                                   display: grid;
                                   grid-template-columns: 1fr auto;
                                   gap: 12px;
                                   border-top: 1px solid #eef2f7;
                                   padding-top: 12px;
                                   margin-bottom: 14px;
                            }
                            .live-auction-price-row span {
                                   display: block;
                                   color: #64748b;
                                   font-size: 12px;
                                   font-weight: 800;
                                   margin-bottom: 2px;
                            }
                            .live-auction-price-row strong {
                                   display: block;
                                   color: #111827;
                                   font-size: 18px;
                                   font-weight: 950;
                            }
                            .live-auction-join {
                                   min-height: 46px;
                                   width: 100%;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   border-radius: 8px;
                                   background: #eef2f7;
                                   color: #111827;
                                   text-decoration: none;
                                   font-weight: 950;
                            }
                            .live-auction-join.is-live {
                                   background: #111827;
                                   color: #ffffff;
                            }
                            .live-auctions-empty,
                            .live-auctions-empty-feature {
                                   min-height: 220px;
                                   display: flex;
                                   flex-direction: column;
                                   align-items: center;
                                   justify-content: center;
                                   text-align: center;
                                   color: #64748b;
                            }
                            .live-auctions-empty h3 {
                                   color: #111827;
                                   font-weight: 950;
                                   margin-bottom: 4px;
                            }
                            @media (max-width: 991px) {
                                   .live-auctions-hero,
                                   .live-auctions-grid {
                                          grid-template-columns: 1fr;
                                   }
                                   .live-auctions-section-head {
                                          align-items: start;
                                          flex-direction: column;
                                   }
                            }
                     ` })
  ] });
}
export {
  LiveAuctionsIndex as default
};
