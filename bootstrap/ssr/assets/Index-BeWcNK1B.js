import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-drJ3vZBs.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
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
const relativeTimeAgo = (value) => {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (!Number.isFinite(then)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1e3));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};
function JoinLiveButton({ activeSlug }) {
  const { auth } = usePage().props;
  const isLoggedIn = Boolean(auth?.user);
  const handleJoin = () => {
    if (!activeSlug) return;
    if (!isLoggedIn) {
      router.visit("/live-auctions?auth=register", {
        preserveScroll: true,
        preserveState: true
      });
      return;
    }
    router.visit(route("product.show", activeSlug));
  };
  if (!activeSlug) {
    return /* @__PURE__ */ jsx("span", { className: "live-auctions-primary is-disabled", children: "No Live Auction" });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", className: "live-auctions-primary", onClick: handleJoin, children: "Join Live" });
}
function LiveAuctionsIndex({ session, liveAuctions = [], activeAuction = null }) {
  const [, setTimeTick] = useState(0);
  const activeStatus = String(activeAuction?.status || "").trim().toLowerCase();
  const activeSlug = activeStatus === "active" ? activeAuction?.slug : null;
  const liveSetupThumbnail = thumbnailForVideoId(session?.youtube_video_id, activeAuction);
  const hasActiveLive = Boolean(activeSlug);
  const isComingSoon = String(session?.status || "").toLowerCase() === "soon";
  const isClosed = String(session?.status || "").toLowerCase() === "closed";
  const scheduledLabel = session?.scheduled_at ? new Date(session.scheduled_at).toLocaleString() : "";
  const closedLabel = isClosed ? relativeTimeAgo(session?.closed_at || session?.updated_at) : "";
  useEffect(() => {
    const refreshLiveState = () => {
      router.reload({
        only: ["session", "liveAuctions", "activeAuction"],
        preserveScroll: true,
        preserveState: true,
        showProgress: false
      });
      setTimeTick((tick) => tick + 1);
    };
    const timer = window.setInterval(refreshLiveState, 2500);
    return () => window.clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Live Auctions | XpertBid", children: [
    /* @__PURE__ */ jsx("main", { className: "live-auctions-page", children: /* @__PURE__ */ jsxs("section", { className: "live-auctions-hero", children: [
      /* @__PURE__ */ jsx("div", { children: hasActiveLive ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "live-auctions-kicker", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle" }),
          "Live Auction Room"
        ] }),
        /* @__PURE__ */ jsx("h1", { children: "Join the current live auction" }),
        /* @__PURE__ */ jsx("p", { children: "Watch the live stream, follow the selected products, and place bids on the product that is active right now." }),
        /* @__PURE__ */ jsx("div", { className: "live-auctions-actions", children: /* @__PURE__ */ jsx(JoinLiveButton, { activeSlug }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "live-auctions-no-live", children: [
        /* @__PURE__ */ jsxs("span", { className: "live-auctions-kicker is-muted", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-regular fa-circle" }),
          "Live Auction Room"
        ] }),
        /* @__PURE__ */ jsx("h1", { children: isComingSoon ? "Live auction coming soon" : isClosed ? "Live auction closed" : "There’s no one live right now" }),
        /* @__PURE__ */ jsx("p", { children: isComingSoon && scheduledLabel ? `Scheduled for ${scheduledLabel}.` : isClosed && closedLabel ? `This live auction closed ${closedLabel}.` : "Please check back later for the next live auction." }),
        isClosed && closedLabel ? /* @__PURE__ */ jsxs("div", { className: "live-auctions-closed-note", children: [
          "Closed ",
          closedLabel
        ] }) : null
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "live-auctions-feature", children: hasActiveLive || isComingSoon ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("img", { src: liveSetupThumbnail, alt: activeAuction?.title || "Live auction" }) }) : /* @__PURE__ */ jsxs("div", { className: "live-auctions-empty-feature", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-tower-broadcast" }),
        /* @__PURE__ */ jsx("span", { children: "No live stream right now" })
      ] }) })
    ] }) }),
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
                            .live-auctions-kicker.is-muted {
                                   color: #64748b;
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
                            .live-auctions-closed-note {
                                   display: inline-flex;
                                   align-items: center;
                                   min-height: 36px;
                                   padding: 0 14px;
                                   margin-top: 18px;
                                   border-radius: 8px;
                                   background: #f1f5f9;
                                   color: #475569;
                                   font-size: 13px;
                                   font-weight: 900;
                            }
                            .live-auctions-primary {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   min-height: 48px;
                                   padding: 0 22px;
                                   border-radius: 8px;
                                   font-weight: 900;
                                   text-decoration: none;
                                   border: none;
                                   cursor: pointer;
                            }
                            .live-auctions-primary {
                                   background: #111827;
                                   color: #ffffff;
                            }
                            .live-auctions-primary.is-disabled {
                                   background: #9ca3af;
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
                                   opacity: 1;
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
                            .live-auctions-empty-feature {
                                   gap: 10px;
                                   background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
                                   color: #ffffff;
                                   font-weight: 900;
                            }
                            .live-auctions-empty-feature i {
                                   font-size: 42px;
                                   color: #43ace9;
                            }
                            .live-auctions-empty-feature span {
                                   color: rgba(255,255,255,0.86);
                            }
                            .live-auctions-empty h3 {
                                   color: #111827;
                                   font-weight: 950;
                                   margin-bottom: 4px;
                            }
                            @media (max-width: 991px) {
                                   .live-auctions-hero {
                                          grid-template-columns: 1fr;
                                   }
                            }
                     ` })
  ] });
}
export {
  LiveAuctionsIndex as default
};
