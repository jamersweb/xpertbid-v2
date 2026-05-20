import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CHif9vZp.js";
import { Head, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ orders, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const handleFilter = (e) => {
    e?.preventDefault();
    router.get(route("admin.orders.index"), { search, status }, { preserveState: true });
  };
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Order Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Order Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 gap-4 max-w-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
              placeholder: "Search by number, name, email...",
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
              handleFilter();
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
              /* @__PURE__ */ jsx("option", { value: "processing", children: "Processing" }),
              /* @__PURE__ */ jsx("option", { value: "completed", children: "Completed" }),
              /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelled" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Search" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Order Info" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Customer" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: orders.data.map((order) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: order.order_number }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
              order.items?.length || 0,
              " Items"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: order.billing_name }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: order.billing_email })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx(Price, { amountPKR: order.total, className: "text-sm font-bold text-gray-800" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 capitalize", children: order.payment_method?.replace("_", " ") })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || "bg-gray-100"}`, children: order.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: new Date(order.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => router.get(route("admin.orders.show", order.id)), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" }) }) })
        ] }, order.id)) })
      ] }) }),
      orders.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open text-4xl mb-4 text-gray-100" }),
        /* @__PURE__ */ jsx("p", { children: "No orders found" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: orders.links }) })
    ] })
  ] });
}
export {
  Index as default
};
