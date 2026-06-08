import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  soon: "bg-sky-100 text-sky-700",
  closed: "bg-slate-100 text-slate-700",
  inactive: "bg-gray-100 text-gray-700"
};
const statusLabel = (status) => {
  if (status === "active") return "Live";
  return status || "N/A";
};
const thumbnailFor = (session) => {
  if (session?.youtube_video_id) {
    return `https://img.youtube.com/vi/${session.youtube_video_id}/hqdefault.jpg`;
  }
  const first = session?.selected_listings?.[0];
  if (first?.youtube_video_id) {
    return `https://img.youtube.com/vi/${first.youtube_video_id}/hqdefault.jpg`;
  }
  return null;
};
function Sessions({ sessions, filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const submit = (e) => {
    e.preventDefault();
    router.get(route("admin.live.index"), { search, status }, { preserveState: true, replace: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Live", children: [
    /* @__PURE__ */ jsx(Head, { title: "Live" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900", children: "Live" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "All live streams, scheduled lives, and closed live auction sessions." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => router.get(route("admin.live-auctions.setup")),
                className: "px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors whitespace-nowrap",
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-tower-broadcast mr-2" }),
                  "Setup Live"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => router.get(route("admin.live-auctions.index")),
                className: "px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap",
                children: "Live Auctions"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex flex-col md:flex-row gap-3 max-w-3xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search live URL, video ID, status...",
                className: "w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: status,
              onChange: (e) => setStatus(e.target.value),
              className: "bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 px-4 py-2.5",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
                /* @__PURE__ */ jsx("option", { value: "active", children: "Live" }),
                /* @__PURE__ */ jsx("option", { value: "soon", children: "Soon" }),
                /* @__PURE__ */ jsx("option", { value: "closed", children: "Closed" }),
                /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800", children: "Filter" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-full overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full table-fixed text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-4 w-[38%]", children: "Stream" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-4 w-[28%]", children: "Selected Auctions" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-4 w-[14%]", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-4 w-[20%] text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: sessions.data.map((session) => {
          const thumb = thumbnailFor(session);
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/60 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-12 rounded-lg overflow-hidden bg-black border border-gray-200 shrink-0", children: thumb ? /* @__PURE__ */ jsx("img", { src: thumb, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-brands fa-youtube" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-gray-900 mb-1 whitespace-nowrap", children: [
                  "Live Session #",
                  session.id
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mb-0 truncate max-w-[200px]", children: session.live_url }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400 mt-1 mb-0 whitespace-nowrap", children: [
                  "Video ID: ",
                  session.youtube_video_id || "N/A"
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-4 min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-black text-gray-900 mb-1 whitespace-nowrap", children: [
                session.selected_count || 0,
                " auctions"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 max-w-[240px]", children: [
                (session.selected_listings || []).slice(0, 3).map((listing) => /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 max-w-[100px] truncate", children: [
                  "#",
                  listing.id,
                  " ",
                  listing.title
                ] }, listing.id)),
                (session.selected_count || 0) > 3 ? /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 whitespace-nowrap", children: [
                  "+",
                  session.selected_count - 3,
                  " more"
                ] }) : null
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses[session.status] || "bg-gray-100 text-gray-700"}`, children: statusLabel(session.status) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 min-w-0", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => router.get(route("admin.live-auctions.session.edit", session.id)),
                  className: "px-2.5 py-2 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 whitespace-nowrap",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => router.get(route("admin.live-auctions.room"), { session: session.id }),
                  className: "px-2.5 py-2 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 whitespace-nowrap",
                  children: "Open Room"
                }
              )
            ] }) })
          ] }, session.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: sessions.data.length ? /* @__PURE__ */ jsx(Pagination, { links: sessions.links }) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-sm text-gray-500", children: "No live sessions found." }) })
    ] })
  ] });
}
export {
  Sessions as default
};
