import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CiJ9dqGe.js";
import { Head, router } from "@inertiajs/react";
import { P as Price } from "./Price-7qyok_Wm.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "./useTranslate-AOp3QZfJ.js";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const statusColors = {
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
  fulfilled: "bg-sky-100 text-sky-700"
};
function Index({ requests, filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const handleFilter = (e) => {
    e?.preventDefault();
    router.get(route("admin.buyer-requests.index"), { search, status }, { preserveState: true });
  };
  const closeRequest = (id) => {
    if (!window.confirm("Close this buyer request? Sellers will no longer be able to offer.")) return;
    router.post(route("admin.buyer-requests.close", id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Buyer Requests", children: [
    /* @__PURE__ */ jsx(Head, { title: "Buyer Requests" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 flex-col sm:flex-row gap-3 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
              placeholder: "Search title, buyer, location...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
            value: status,
            onChange: (e) => {
              setStatus(e.target.value);
              router.get(
                route("admin.buyer-requests.index"),
                { search, status: e.target.value },
                { preserveState: true }
              );
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "open", children: "Open" }),
              /* @__PURE__ */ jsx("option", { value: "closed", children: "Closed" }),
              /* @__PURE__ */ jsx("option", { value: "fulfilled", children: "Fulfilled" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors",
            children: "Search"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Request" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Buyer" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Budget" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Offers" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: requests.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-xs font-mono text-gray-500", children: [
            "#",
            item.id
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 line-clamp-1", children: item.location_label || [item.city, item.country].filter(Boolean).join(", ") || "—" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: item.user?.name || "—" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: item.user?.email })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: item.category?.name || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: item.budget != null && Number(item.budget) > 0 ? /* @__PURE__ */ jsx(Price, { amountPKR: item.budget, className: "text-sm font-bold text-gray-800" }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "—" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: item.offers_count || 0 }),
            Number(item.pending_offers_count || 0) > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-600 font-semibold", children: [
              item.pending_offers_count,
              " pending"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`,
              children: item.status
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: item.created_at ? new Date(item.created_at).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => router.get(route("admin.buyer-requests.show", item.id)),
                className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors",
                title: "View",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" })
              }
            ),
            item.status === "open" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => closeRequest(item.id),
                className: "p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",
                title: "Close",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-lock" })
              }
            )
          ] }) })
        ] }, item.id)) })
      ] }) }),
      requests.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-clipboard-list text-4xl mb-4 text-gray-100" }),
        /* @__PURE__ */ jsx("p", { children: "No buyer requests found" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: requests.links }) })
    ] })
  ] });
}
export {
  Index as default
};
