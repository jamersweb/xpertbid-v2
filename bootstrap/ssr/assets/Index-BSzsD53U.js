import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CZrc0vs-.js";
import { Head, router } from "@inertiajs/react";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ outreaches, filters }) {
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const handleEdit = (item) => {
    setEditing(item.id);
    setEditData({
      call_status: item.call_status,
      customer_feedback_summary: item.customer_feedback_summary || "",
      contract_date: item.contract_date || ""
    });
  };
  const submitUpdate = (e) => {
    e.preventDefault();
    router.put(route("admin.crm.update", editing), editData, {
      onSuccess: () => setEditing(null)
    });
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    router.get(route("admin.crm.index"), { ...filters, search: value }, { preserveState: true, replace: true });
  };
  const handleStatusFilter = (status) => {
    router.get(route("admin.crm.index"), { ...filters, call_status: status }, { preserveState: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "CRM / Customer Outreach", children: [
    /* @__PURE__ */ jsx(Head, { title: "CRM" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-12 pr-4 py-3 bg-white border-none focus:ring-2 focus:ring-black rounded-2xl shadow-sm text-sm",
              placeholder: "Search by name, email or phone...",
              defaultValue: filters.search,
              onChange: handleSearch
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2 md:pb-0", children: ["All", "Pending", "In Progress", "Completed", "Cancelled"].map((status) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleStatusFilter(status === "All" ? "" : status),
            className: `px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${(filters.call_status || "All") === status ? "bg-black text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50 shadow-sm"}`,
            children: status
          },
          status
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Customer Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Verification" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Next Action" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: outreaches.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "group hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs uppercase", children: item.name?.charAt(0) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: item.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
                item.email,
                " • ",
                item.phone
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.user?.individual_verification?.status === "verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`, children: item.user?.individual_verification?.status || "Not Verified" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.call_status === "Completed" ? "bg-blue-50 text-blue-600" : item.call_status === "Pending" ? "bg-gray-100 text-gray-500" : "bg-indigo-50 text-indigo-600"}`, children: item.call_status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 line-clamp-1", children: item.customer_feedback_summary || "-" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(item), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }) })
        ] }, item.id)) })
      ] }) }) })
    ] }),
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Update Outreach Status" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "text-gray-400 hover:text-black", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitUpdate, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-2", children: "Call Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm",
                value: editData.call_status,
                onChange: (e) => setEditData({ ...editData, call_status: e.target.value }),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Pending", children: "Pending" }),
                  /* @__PURE__ */ jsx("option", { value: "In Progress", children: "In Progress" }),
                  /* @__PURE__ */ jsx("option", { value: "Completed", children: "Completed" }),
                  /* @__PURE__ */ jsx("option", { value: "Cancelled", children: "Cancelled" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-2", children: "Next Contact Date" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm",
                value: editData.contract_date,
                onChange: (e) => setEditData({ ...editData, contract_date: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-2", children: "Feedback Summary" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm min-h-[120px]",
              placeholder: "Summarize the customer interaction...",
              value: editData.customer_feedback_summary,
              onChange: (e) => setEditData({ ...editData, customer_feedback_summary: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all", children: "Update CRM Entry" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
