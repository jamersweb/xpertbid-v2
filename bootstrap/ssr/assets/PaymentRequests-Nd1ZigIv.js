import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function PaymentRequests({ requests, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const handleFilter = (e) => {
    e?.preventDefault();
    router.get(route("admin.payment-requests.index"), { search, status }, { preserveState: true });
  };
  const updateStatus = (id, newStatus) => {
    if (confirm(`Are you sure you want to mark this request as ${newStatus}?`)) {
      router.patch(route("admin.payment-requests.update-status", id), {
        status: newStatus
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Payment Requests", children: [
    /* @__PURE__ */ jsx(Head, { title: "Payment Requests" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 gap-4 max-w-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all",
              placeholder: "Search by user name or email...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all",
            value: status,
            onChange: (e) => {
              setStatus(e.target.value);
              handleFilter();
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
              /* @__PURE__ */ jsx("option", { value: "approved", children: "Approved" }),
              /* @__PURE__ */ jsx("option", { value: "rejected", children: "Rejected" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Search" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "User" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Method" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: requests.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800", children: item.user?.name }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: item.user?.email })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded capitalize", children: item.payment_method || "N/A" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-black", children: [
            "AED ",
            item.amount
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: new Date(item.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === "approved" ? "bg-emerald-100 text-emerald-700" : item.status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`, children: item.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: item.status === "pending" && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => updateStatus(item.id, "approved"), className: "p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors", title: "Approve", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => updateStatus(item.id, "rejected"), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", title: "Reject", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) })
          ] }) })
        ] }, item.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: requests.links }) })
    ] })
  ] });
}
export {
  PaymentRequests as default
};
