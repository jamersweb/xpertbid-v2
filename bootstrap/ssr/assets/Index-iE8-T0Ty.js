import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { Head, router } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const money = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;
function Index({ rewards, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "pending");
  const handleFilter = (event) => {
    event?.preventDefault();
    router.get(route("admin.referral-rewards.index"), { search, status }, { preserveState: true });
  };
  const act = (reward, action) => {
    const note = window.prompt(action === "approve" ? "Approval note (optional)" : "Rejection reason (optional)", "");
    if (note === null) return;
    router.post(route(`admin.referral-rewards.${action}`, reward.id), { admin_note: note }, { preserveScroll: true });
  };
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    paid: "bg-blue-100 text-blue-700"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Referral Rewards", children: [
    /* @__PURE__ */ jsx(Head, { title: "Referral Rewards" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Referral Reward Review" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Approve 1% referral rewards after validating completed sales or purchases." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 gap-3 max-w-2xl", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "flex-1 px-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
              placeholder: "Search users, order, listing...",
              value: search,
              onChange: (event) => setSearch(event.target.value)
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
              value: status,
              onChange: (event) => setStatus(event.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All" }),
                /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
                /* @__PURE__ */ jsx("option", { value: "approved", children: "Approved" }),
                /* @__PURE__ */ jsx("option", { value: "rejected", children: "Rejected" }),
                /* @__PURE__ */ jsx("option", { value: "paid", children: "Paid" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Search" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Referrer" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Referred User" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Source" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Reward" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: rewards.data.map((reward) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: reward.referrer?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500", children: reward.referrer?.email || reward.referrer?.phone })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: reward.referred_user?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500", children: reward.referred_user?.email || reward.referred_user?.phone })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: reward.listing?.title || reward.order?.order_number || reward.source_type }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 capitalize", children: reward.trigger_type })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: money(reward.reward_amount) }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-500", children: [
              "1% of ",
              money(reward.amount_base)
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[reward.status] || "bg-gray-100 text-gray-700"}`, children: reward.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: reward.status === "pending" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => act(reward, "approve"), className: "px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700", children: "Approve" }),
            /* @__PURE__ */ jsx("button", { onClick: () => act(reward, "reject"), className: "px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700", children: "Reject" })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "Reviewed" }) })
        ] }, reward.id)) })
      ] }) }),
      rewards.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-share-nodes text-4xl mb-4 text-gray-100" }),
        /* @__PURE__ */ jsx("p", { children: "No referral rewards found" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: rewards.links }) })
    ] })
  ] });
}
export {
  Index as default
};
