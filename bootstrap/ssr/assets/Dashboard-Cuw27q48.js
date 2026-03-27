import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { Head } from "@inertiajs/react";
function Dashboard({ stats }) {
  const cards = [
    { label: "Total Users", value: stats.total_users, icon: "fa-users", color: "bg-blue-500" },
    { label: "Total Auctions", value: stats.total_auctions, icon: "fa-gavel", color: "bg-indigo-500" },
    { label: "Active Bids", value: stats.total_bids, icon: "fa-hand-point-up", color: "bg-emerald-500" },
    { label: "Wallet Balance", value: `PKR ${stats.wallet_balance.toLocaleString()}`, icon: "fa-wallet", color: "bg-amber-500" },
    { label: "Active Auctions", value: stats.active_auctions, icon: "fa-bolt", color: "bg-rose-500" },
    { label: "Pending Verifications", value: stats.pending_verifications, icon: "fa-user-shield", color: "bg-purple-500" }
  ];
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Dashboard", children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin Dashboard" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6", children: cards.map((card, index) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsx("div", { className: `${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${card.icon} fs-5` }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-gray-500 text-xs font-bold uppercase tracking-wider mb-1", children: card.label }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-gray-800 tracking-tight", children: card.value })
    ] }, index)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800 mb-6", children: "Recent Activity" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 italic text-sm", children: "Activity feed coming soon..." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800 mb-6", children: "Market Trends" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 italic text-sm", children: "Real-time charts coming soon..." }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
