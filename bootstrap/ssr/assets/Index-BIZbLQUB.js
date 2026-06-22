import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ bids, filters = {} }) {
  const safeFilters = Array.isArray(filters) ? {} : filters || {};
  const [search, setSearch] = useState(safeFilters.search || "");
  const [sort, setSort] = useState(safeFilters.sort || "newest");
  const handleFilter = (e) => {
    e?.preventDefault();
    router.get(route("admin.bids.index"), { search, sort }, { preserveState: true });
  };
  const handleSortChange = (value) => {
    setSort(value);
    router.get(route("admin.bids.index"), { search, sort: value }, { preserveState: true });
  };
  const handleEditBid = async (bid) => {
    const result = await Swal.fire({
      title: "Edit bid amount",
      input: "number",
      inputValue: bid.bid_amount,
      inputLabel: "Bid amount",
      inputAttributes: {
        min: 0,
        step: "0.01"
      },
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      preConfirm: (value) => {
        if (value === "" || Number(value) < 0) {
          Swal.showValidationMessage("Please enter a valid bid amount");
          return false;
        }
        return value;
      }
    });
    if (result.isConfirmed) {
      router.patch(route("admin.bids.update", bid.id), {
        bid_amount: result.value
      }, {
        preserveScroll: true
      });
    }
  };
  const handleDeleteBid = async (bidId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This bid will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.bids.destroy", bidId), {
        preserveScroll: true
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Bids History", children: [
    /* @__PURE__ */ jsx(Head, { title: "Bids History" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 gap-4 max-w-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-500 transition-all",
              placeholder: "Search by auction, user, or amount...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 px-4 py-2 min-w-[170px] transition-all",
            value: sort,
            onChange: (e) => handleSortChange(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
              /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest First" }),
              /* @__PURE__ */ jsx("option", { value: "highest", children: "Highest Amount" }),
              /* @__PURE__ */ jsx("option", { value: "lowest", children: "Lowest Amount" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors", children: "Filter" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Bid ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Bidder" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Placed At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: bids.data.map((bid) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono text-gray-400", children: [
            "#",
            bid.id
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: bid.listing?.title }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-gray-400", children: [
              "ID: ",
              bid.listing_id
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800 font-medium", children: bid.user?.name }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: bid.user?.email })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-emerald-600", children: /* @__PURE__ */ jsx(Price, { amountAED: bid.bid_amount }) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500", children: new Date(bid.created_at).toLocaleString() }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleEditBid(bid), className: "p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors", title: "Edit Amount", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteBid(bid.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, bid.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: bids.links }) })
    ] })
  ] });
}
export {
  Index as default
};
