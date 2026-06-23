import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-DNCwhj5R.js";
import { Head, Link } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Show({ user }) {
  const isEmptyValue = (value) => value === null || value === void 0 || value === "";
  const basicInfo = [
    { label: "Name", value: user.name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status },
    { label: "Signup Source", value: user.signup_source },
    { label: "Joined At", value: new Date(user.created_at).toLocaleDateString() }
  ].filter((item) => !isEmptyValue(item.value));
  const addressInfo = [
    { label: "Address Line 1", value: user.address_line1 },
    { label: "Address Line 2", value: user.address_line2 },
    { label: "City", value: user.city },
    { label: "State", value: user.state },
    { label: "Country", value: user.country?.name || user.country },
    { label: "Postal Code", value: user.postal_code }
  ].filter((item) => !isEmptyValue(item.value));
  const verificationInfo = [
    {
      label: "Individual Verification",
      value: user.individual_verification?.status || user.individualVerification?.status || "Not Applied",
      badge: user.individual_verification?.status === "verified" || user.individualVerification?.status === "verified" ? "verified" : "pending"
    },
    {
      label: "Corporate Verification",
      value: user.corporate_verification?.status || user.corporateVerification?.status || "Not Applied",
      badge: user.corporate_verification?.status === "verified" || user.corporateVerification?.status === "verified" ? "verified" : "pending"
    }
  ];
  const stats = [
    { label: "Total Listings", value: user.auctions?.length || 0, icon: "fa-solid fa-layer-group", color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Total Bids", value: user.bids?.length || 0, icon: "fa-solid fa-gavel", color: "text-amber-600", bg: "bg-amber-50" }
  ];
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `User: ${user.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `User: ${user.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.users.index"),
            className: "flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" }),
              "Back to Users"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.users.index"),
            className: "bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen" }),
              "Edit User"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "h-24 bg-gradient-to-r from-gray-900 to-gray-700" }),
            /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 text-center -mt-12", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl bg-white p-1 mx-auto shadow-sm border border-gray-100", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-xl bg-gray-50 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden", children: user.profile_pic ? /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: user.name, referrerPolicy: "no-referrer", className: "w-full h-full object-cover" }) : user.name.charAt(0) }) }),
              /* @__PURE__ */ jsx("h1", { className: "mt-4 text-xl font-bold text-gray-900", children: user.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: user.email }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700", children: user.role })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: stats.map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl`, children: /* @__PURE__ */ jsx("i", { className: stat.icon }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-medium", children: stat.label }),
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-gray-900", children: stat.value })
            ] })
          ] }, idx)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info text-sky-500" }),
              "User Information"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6", children: basicInfo.map((item, idx) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1", children: item.label }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 font-medium leading-relaxed", children: item.value })
            ] }, idx)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-shield-check text-emerald-500" }),
                "Verification Status"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: verificationInfo.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-xl", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-700", children: item.label }),
                /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${item.badge === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`, children: item.value })
              ] }, idx)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-location-dot text-rose-500" }),
                "Primary Address"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: addressInfo.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: addressInfo.map((item, idx) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1", children: item.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 font-medium leading-relaxed", children: item.value })
              ] }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-6", children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-map-location-dot text-gray-200 text-4xl mb-2" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "No address details available" })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bolt text-amber-500" }),
              "Recent Activity Summary"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-50 rounded-2xl text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: user.auctions?.length || 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-500 uppercase", children: "Auctions" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-50 rounded-2xl text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: user.bids?.length || 0 }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-500 uppercase", children: "Bids" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-50 rounded-2xl text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: "0" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-500 uppercase", children: "Orders" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-50 rounded-2xl text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: "0" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-gray-500 uppercase", children: "Inquiries" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
