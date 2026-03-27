import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-C1GVdotZ.js";
function Index({ listings, filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.listings.index"), { search, status }, { preserveState: true });
  };
  const statusBadges = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    declined: "bg-rose-100 text-rose-700",
    inactive: "bg-gray-100 text-gray-700"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Listings Management (Dynamic)", children: [
    /* @__PURE__ */ jsx(Head, { title: "Listings Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex flex-1 gap-4 max-w-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all",
              placeholder: "Search listings...",
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
            onChange: (e) => setStatus(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
              /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
              /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "declined", children: "Declined" }),
              /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Filter" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Seller" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Pricing/Type" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: listings.data.map((listing) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: listing.image_url || "/assets/images/placeholder.png", className: "w-10 h-10 rounded-lg object-cover", alt: "" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: listing.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
                "ID: ",
                listing.id,
                " | Type: ",
                /* @__PURE__ */ jsx("span", { className: "uppercase", children: listing.listing_type })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800", children: listing.user?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500", children: listing.user?.email })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded", children: listing.category?.name }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-black", children: listing.listing_type === "auction" ? listing.minimum_bid : listing.buy_now_price || listing.minimum_bid }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
              "Stock: ",
              listing.listing_data?.stock ?? "N/A"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[listing.status] || "bg-gray-100"}`, children: listing.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => router.get(route("admin.listings.show", listing.id)), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", title: "View Details", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              if (confirm("Delete this listing?")) router.delete(route("admin.listings.destroy", listing.id));
            }, className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, listing.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: listings.links }) })
    ] })
  ] });
}
export {
  Index as default
};
