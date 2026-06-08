import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const toLocalDateTimeInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 6e4;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};
const formStatusFromSession = (status) => {
  if (status === "active") return "live";
  if (["soon", "closed", "inactive"].includes(status)) return status;
  return "live";
};
function Setup({ liveAuctions = [], session = null, isEditing = false }) {
  const [search, setSearch] = useState("");
  const { data, setData, post, put, processing, errors } = useForm({
    live_url: session?.live_url || "",
    session_status: formStatusFromSession(session?.status),
    scheduled_at: toLocalDateTimeInput(session?.scheduled_at),
    auction_ids: (session?.selected_listing_ids || []).map((id) => Number(id))
  });
  const filteredAuctions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return liveAuctions;
    return liveAuctions.filter((auction) => {
      return String(auction.title || "").toLowerCase().includes(term) || String(auction.id || "").includes(term) || String(auction.category?.name || "").toLowerCase().includes(term);
    });
  }, [liveAuctions, search]);
  const toggleAuction = (id) => {
    const normalizedId = Number(id);
    const next = data.auction_ids.includes(normalizedId) ? data.auction_ids.filter((item) => item !== normalizedId) : [...data.auction_ids, normalizedId];
    setData("auction_ids", next);
  };
  const submit = (e) => {
    e.preventDefault();
    if (isEditing && session?.id) {
      put(route("admin.live-auctions.session.update", session.id));
      return;
    }
    post(route("admin.live-auctions.launch"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEditing ? "Edit Live Auction" : "Setup Live Auction", children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? "Edit Live Auction" : "Setup Live Auction" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900", children: isEditing ? `Edit Live Session #${session?.id}` : "Setup Live Auction" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: isEditing ? "Update YouTube URL, status, schedule, and selected products for this live room." : "Add YouTube live URL and select the products for the live control room." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => router.get(isEditing ? route("admin.live.index") : route("admin.live-auctions.index")),
              className: "px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200",
              children: "Back"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-800 mb-2", children: "YouTube Live URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: data.live_url,
              onChange: (e) => setData("live_url", e.target.value),
              placeholder: "https://www.youtube.com/live/...",
              className: "w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-950 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black",
              style: { color: "#111827", WebkitTextFillColor: "#111827" }
            }
          ),
          errors.live_url && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-2", children: errors.live_url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-800 mb-3", children: "Live Status" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
            { value: "live", label: "Live", icon: "fa-circle-play", copy: "Show this room as currently live." },
            { value: "closed", label: "Closed", icon: "fa-circle-xmark", copy: "Keep this setup closed on frontend." },
            { value: "soon", label: "Soon", icon: "fa-clock", copy: "Schedule this live auction for later." }
          ].map((option) => {
            const active = data.session_status === option.value;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setData({
                  ...data,
                  session_status: option.value,
                  scheduled_at: option.value === "soon" ? data.scheduled_at : ""
                }),
                className: `text-left rounded-xl border px-4 py-3 transition-all ${active ? "border-black bg-gray-950 text-white shadow-sm" : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-black", children: [
                    /* @__PURE__ */ jsx("i", { className: `fa-solid ${option.icon}` }),
                    option.label
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: `text-xs mt-1 mb-0 ${active ? "text-gray-200" : "text-gray-500"}`, children: option.copy })
                ]
              },
              option.value
            );
          }) }),
          errors.session_status && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-2", children: errors.session_status })
        ] }),
        data.session_status === "soon" && /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-800 mb-2", children: "Live Date & Time" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "datetime-local",
              value: data.scheduled_at,
              onChange: (e) => setData("scheduled_at", e.target.value),
              className: "w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-950 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-black",
              style: { color: "#111827", WebkitTextFillColor: "#111827" }
            }
          ),
          errors.scheduled_at && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 mt-2", children: errors.scheduled_at })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-gray-900", children: "Select Auctions" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
              data.auction_ids.length,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-80", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search live auctions...",
                className: "w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-black focus:border-black"
              }
            )
          ] })
        ] }),
        errors.auction_ids && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 px-6 pt-4 mb-0", children: errors.auction_ids }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100 max-h-[520px] overflow-auto", children: filteredAuctions.length ? filteredAuctions.map((auction) => {
          const checked = data.auction_ids.includes(Number(auction.id));
          const startPrice = auction.listing_data?.start_price;
          return /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 ${checked ? "bg-sky-50" : ""}`, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked,
                onChange: () => toggleAuction(auction.id),
                className: "w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0", children: auction.youtube_video_id ? /* @__PURE__ */ jsx(
              "img",
              {
                src: `https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg`,
                alt: "",
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-youtube" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-gray-900 mb-1 truncate", children: auction.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mb-0", children: [
                "ID: ",
                auction.id,
                " | ",
                auction.category?.name || "No Category"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "hidden md:block text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase", children: auction.status }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-gray-900 mt-1", children: startPrice ? /* @__PURE__ */ jsx(Price, { amountPKR: startPrice }) : "N/A" })
            ] })
          ] }, auction.id);
        }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-10 text-center text-sm text-gray-500", children: "No live auctions found." }) }),
        /* @__PURE__ */ jsx("div", { className: "p-6 border-t border-gray-100 flex justify-end", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-7 py-3 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 disabled:opacity-60",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-play mr-2" }),
              processing ? isEditing ? "Saving..." : "Opening..." : isEditing ? "Save Live Session" : data.session_status === "live" ? "Live Now" : data.session_status === "soon" ? "Schedule Soon" : "Save Closed"
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  Setup as default
};
