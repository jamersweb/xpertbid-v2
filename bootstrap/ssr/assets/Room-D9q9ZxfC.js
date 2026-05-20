import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { L as ListingLiveChat } from "./ListingLiveChat-DrCA7khS.js";
import Swal from "sweetalert2";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-gray-100 text-gray-700",
  ended: "bg-orange-100 text-orange-700",
  closed: "bg-slate-100 text-slate-700",
  awarded: "bg-violet-100 text-violet-700",
  pending: "bg-amber-100 text-amber-700"
};
function YoutubePlayer({ videoId, title }) {
  if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 bg-black rounded-2xl flex items-center justify-center text-white", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-brands fa-youtube text-4xl mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-0", children: "No YouTube video selected" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 bg-black rounded-2xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx(
    "iframe",
    {
      title: title || "Live auction stream",
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      loading: "lazy",
      referrerPolicy: "strict-origin-when-cross-origin",
      className: "w-full h-full border-0"
    }
  ) });
}
function Room({ session = null, liveAuctions = [], selectedIds = [], liveUrl = "", globalVideoId = null }) {
  const [activeId, setActiveId] = useState(liveAuctions[0]?.id || null);
  const activeAuction = useMemo(
    () => liveAuctions.find((auction) => auction.id === activeId) || liveAuctions[0],
    [liveAuctions, activeId]
  );
  const activeVideoId = globalVideoId || activeAuction?.youtube_video_id;
  const startPrice = activeAuction?.listing_data?.start_price;
  const reservePrice = activeAuction?.listing_data?.reserve_price;
  const refreshRoomState = () => {
    router.reload({
      only: ["session", "liveAuctions", "selectedIds", "liveUrl", "globalVideoId"],
      preserveScroll: true,
      preserveState: true,
      showProgress: false
    });
  };
  useEffect(() => {
    const timer = window.setInterval(refreshRoomState, 2500);
    return () => window.clearInterval(timer);
  }, []);
  const confirmPatch = async ({ title, text, routeName, confirmButtonText, confirmButtonColor = "#111827" }) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor,
      cancelButtonColor: "#d1d5db",
      confirmButtonText,
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.patch(route(routeName, activeAuction.id), {}, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: refreshRoomState
      });
    }
  };
  const closeSessionAndBack = async () => {
    if (!session?.id) {
      router.get(route("admin.live-auctions.index"));
      return;
    }
    const result = await Swal.fire({
      title: "Close live session?",
      text: "This will close the live session, close selected products, and move viewers back to the live auctions page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#475569",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Close & Back",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.patch(route("admin.live-auctions.session.close", session.id), {}, {
        preserveScroll: false,
        preserveState: false
      });
    }
  };
  if (!activeAuction) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(Head, { title: "Live Room" }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-10 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "No live auctions selected." }),
        /* @__PURE__ */ jsx("button", { onClick: () => router.get(route("admin.live-auctions.setup")), className: "px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold", children: "Setup Live" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-screen w-screen overflow-hidden bg-gray-100 text-gray-900", children: [
    /* @__PURE__ */ jsx(Head, { title: "Live Auction Room" }),
    /* @__PURE__ */ jsx("div", { className: "h-full w-full p-3 lg:p-4 flex flex-col gap-3 min-w-0", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "live-room-main-grid min-h-0 flex-1 overflow-hidden",
        style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "0.75rem" },
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "live-room-left-column min-w-0 min-h-0 overflow-hidden",
              style: { display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: "0.75rem" },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 min-w-0 overflow-hidden", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("h1", { className: "text-lg lg:text-xl font-black text-gray-900 leading-tight mb-0", children: "Live Auction Room" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-0 mb-0 truncate", children: "Control selected live products, stream, status and website chats." }),
                      session ? /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${session.status === "active" ? "bg-emerald-100 text-emerald-700" : session.status === "soon" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-700"}`, children: session.status === "active" ? "Live" : session.status }),
                        session.scheduled_at ? /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-gray-500", children: [
                          "Scheduled: ",
                          new Date(session.scheduled_at).toLocaleString()
                        ] }) : null
                      ] }) : null
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: closeSessionAndBack,
                          className: "px-3 py-2 rounded-xl bg-slate-600 text-white text-xs font-bold hover:bg-slate-700",
                          children: "Back & Close Live"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => router.get(route("admin.live-auctions.setup")),
                          className: "px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200",
                          children: "Setup Again"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => router.get(route("admin.live-auctions.index")),
                          className: "px-3 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800",
                          children: "Live Auctions"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "live-room-tabs mt-3 flex gap-2 overflow-x-auto overflow-y-hidden pb-1", children: liveAuctions.map((auction) => /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setActiveId(auction.id),
                      className: `shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-colors max-w-[180px] truncate ${auction.id === activeAuction.id ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`,
                      children: [
                        "#",
                        auction.id,
                        " ",
                        auction.title
                      ]
                    },
                    auction.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 min-h-0 overflow-hidden flex flex-col", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3 shrink-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                        /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClasses[activeAuction.status] || "bg-gray-100 text-gray-700"}`, children: activeAuction.status }),
                        /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase", children: "Live Control" })
                      ] }),
                      /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-gray-900 mb-0 truncate", children: activeAuction.title }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mb-0 truncate", children: [
                        activeAuction.category?.name || "No Category",
                        " | Seller: ",
                        activeAuction.user?.name || "N/A"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Highest Bid" }),
                      /* @__PURE__ */ jsx("div", { className: "text-base font-black text-gray-900", children: /* @__PURE__ */ jsx(Price, { amountAED: activeAuction.bids_max_bid_amount || 0 }) }),
                      /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                        activeAuction.bids_count || 0,
                        " bids"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(YoutubePlayer, { videoId: activeVideoId, title: activeAuction.title }),
                  liveUrl ? /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-500 mt-2 mb-0 truncate shrink-0", children: [
                    "Live URL: ",
                    liveUrl
                  ] }) : null
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "live-room-right-column min-w-0 min-h-0 overflow-hidden",
              style: { display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: "0.75rem" },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm p-3 lg:p-4 min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-gray-900 uppercase tracking-wide mb-3", children: "Product Controls" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-50 p-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Start Price" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-gray-900 truncate", children: startPrice ? /* @__PURE__ */ jsx(Price, { amountPKR: startPrice }) : "N/A" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-50 p-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Reserve Price" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-gray-900 truncate", children: reservePrice ? /* @__PURE__ */ jsx(Price, { amountPKR: reservePrice }) : "N/A" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-gray-50 p-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Status" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-gray-900 capitalize truncate", children: activeAuction.status })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    activeAuction.status !== "active" && !["awarded", "closed"].includes(activeAuction.status) && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => confirmPatch({
                          title: "Start live auction?",
                          text: `${activeAuction.title} will become active.`,
                          routeName: "admin.live-auctions.start",
                          confirmButtonText: "Start",
                          confirmButtonColor: "#059669"
                        }),
                        className: "px-3 py-2 rounded-xl text-xs font-black",
                        style: { backgroundColor: "#059669", color: "#ffffff", minWidth: "120px", flex: "1 1 120px" },
                        children: "Start"
                      }
                    ),
                    activeAuction.status === "active" && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => confirmPatch({
                          title: "End live auction?",
                          text: "If bids exist, this will award to highest bidder. Otherwise status will become ended.",
                          routeName: "admin.live-auctions.end",
                          confirmButtonText: "End",
                          confirmButtonColor: "#ea580c"
                        }),
                        className: "px-3 py-2 rounded-xl text-xs font-black",
                        style: { backgroundColor: "#ea580c", color: "#ffffff", minWidth: "120px", flex: "1 1 120px" },
                        children: "End"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => confirmPatch({
                          title: "Close live auction?",
                          text: "This will close the auction without awarding it.",
                          routeName: "admin.live-auctions.close",
                          confirmButtonText: "Close",
                          confirmButtonColor: "#475569"
                        }),
                        className: "px-3 py-2 rounded-xl text-xs font-black",
                        style: { backgroundColor: "#475569", color: "#ffffff", minWidth: "120px", flex: "1 1 120px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
                        children: "Closed"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => confirmPatch({
                          title: "Award highest bidder?",
                          text: "This will award this auction to the highest bidder.",
                          routeName: "admin.live-auctions.award",
                          confirmButtonText: "Award",
                          confirmButtonColor: "#7c3aed"
                        }),
                        className: "px-3 py-2 rounded-xl text-xs font-black",
                        style: { backgroundColor: "#7c3aed", color: "#ffffff", minWidth: "120px", flex: "1 1 120px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
                        children: "Awarded"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => router.get(route("product.show", activeAuction.slug)),
                        className: "px-3 py-2 rounded-xl text-xs font-black",
                        style: { backgroundColor: "#f3f4f6", color: "#111827", minWidth: "120px", flex: "1 1 120px" },
                        children: "View Product"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "live-room-chat bg-white rounded-2xl border border-gray-200 shadow-sm p-3 min-w-0 min-h-0 overflow-hidden flex flex-col", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 shrink-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-gray-900 uppercase tracking-wide mb-0", children: "Website Chat" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                      "#",
                      activeAuction.id
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(ListingLiveChat, { listingId: activeAuction.id, listingSlug: activeAuction.slug })
                ] })
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("style", { children: `
                            .live-room-chat .xb-listing-live-chat {
                                   height: 100% !important;
                                   min-height: 0 !important;
                            }
                            .live-room-chat .xb-listing-live-chat input,
                            .live-room-chat .xb-listing-live-chat .form-control {
                                   color: #111827 !important;
                                   -webkit-text-fill-color: #111827 !important;
                            }
                            .live-room-chat .xb-listing-live-chat > div:nth-child(2) {
                                   min-height: 0 !important;
                            }
                            .live-room-tabs {
                                   scrollbar-width: thin;
                                   scrollbar-color: #cbd5e1 transparent;
                            }
                            .live-room-tabs::-webkit-scrollbar {
                                   height: 6px;
                            }
                            .live-room-tabs::-webkit-scrollbar-track {
                                   background: transparent;
                            }
                            .live-room-tabs::-webkit-scrollbar-thumb {
                                   background: #cbd5e1;
                                   border-radius: 999px;
                            }
                            @media (max-width: 900px) {
                                   .live-room-main-grid {
                                          grid-template-columns: minmax(0, 1fr) !important;
                                          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) !important;
                                   }
                                   .live-room-left-column {
                                          grid-template-columns: minmax(0, 1fr) !important;
                                   }
                            }
                            @media (max-width: 1023px) {
                                   body:has(.live-room-chat) {
                                          overflow: hidden;
                                   }
                            }
                     ` })
  ] });
}
export {
  Room as default
};
