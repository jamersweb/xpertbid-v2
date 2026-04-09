import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CCDzOvsD.js";
import { Head, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import Swal from "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ listings, filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.listings.index"), { search, status }, { preserveState: true });
  };
  const handleDelete = async (listingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This listing will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.listings.destroy", listingId));
    }
  };
  const statusBadges = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    declined: "bg-rose-100 text-rose-700",
    inactive: "bg-gray-100 text-gray-700",
    resubmit: "bg-sky-100 text-sky-700",
    ended: "bg-orange-100 text-orange-700",
    closed: "bg-slate-100 text-slate-700",
    awarded: "bg-violet-100 text-violet-700"
  };
  const statusOptions = ["", "pending", "active", "declined", "inactive", "resubmit", "ended", "closed", "awarded"];
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Listings Management (Dynamic)", children: [
    /* @__PURE__ */ jsx(Head, { title: "Listings Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex flex-1 gap-4 max-w-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all",
                placeholder: "Search listings...",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 px-4 py-2 appearance-none transition-all",
              value: status,
              onChange: (e) => setStatus(e.target.value),
              children: statusOptions.map((statusOption) => /* @__PURE__ */ jsx("option", { value: statusOption, children: statusOption ? statusOption.charAt(0).toUpperCase() + statusOption.slice(1) : "All Status" }, statusOption || "all"))
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Filter" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => router.get(route("admin.listings.create")),
            className: "px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap",
            children: "Create Listing"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Seller" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Price" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: listings.data.map((listing) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: listing.image_url || "/assets/images/placeholder.png", className: "w-10 h-10 rounded-lg object-cover", alt: "" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: listing.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400 mt-1 mb-0", children: [
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
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            Price,
            {
              amountPKR: listing.listing_type === "auction" ? listing.minimum_bid : listing.buy_now_price || listing.minimum_bid,
              className: "text-sm font-bold text-black"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[listing.status] || "bg-gray-100 text-gray-700"}`, children: listing.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => router.get(route("admin.listings.edit", listing.id)), className: "p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors", title: "Edit", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => router.get(route("admin.listings.show", listing.id)), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", title: "View Details", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(listing.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
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
