import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DNCwhj5R.js";
import { Head, Link, router } from "@inertiajs/react";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Auctions({ auctions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const hasPendingEdit = (auction) => Boolean(auction.pending_edit);
  const canApprove = (auction) => ["inactive", "declined", "resubmit"].includes(auction.status) || hasPendingEdit(auction);
  const canDecline = (auction) => ["inactive", "resubmit"].includes(auction.status) || hasPendingEdit(auction);
  const listingTypeMeta = (type) => {
    if (type === "auction") return { label: "Auction", className: "bg-violet-100 text-violet-700" };
    if (type === "business") return { label: "Business", className: "bg-blue-100 text-blue-700" };
    if (type === "live_auction") return { label: "Live Auction", className: "bg-red-100 text-red-700" };
    return { label: "Normal", className: "bg-amber-100 text-amber-700" };
  };
  const openDeclineModal = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };
  const confirmDecline = () => {
    if (!declineReason) return alert("Please provide a reason.");
    router.post(route("admin.verifications.auctions.decline", selectedAuction.id), {
      reason: declineReason
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setDeclineReason("");
      }
    });
  };
  const openApproveModal = (auction) => {
    setSelectedAuction(auction);
    setIsApproveModalOpen(true);
  };
  const confirmApprove = () => {
    router.post(route("admin.verifications.auctions.accept", selectedAuction.id), {}, {
      onSuccess: () => setIsApproveModalOpen(false)
    });
  };
  const statusBadges = {
    inactive: "bg-gray-100 text-gray-700",
    declined: "bg-rose-100 text-rose-700",
    resubmit: "bg-amber-100 text-amber-700"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Listing Approval", children: [
    /* @__PURE__ */ jsx(Head, { title: "Listing Approval" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Listing Review Queue" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Showing inactive, declined, resubmit, and active listings with pending edits" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Seller" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: auctions.data.map((auction) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: auction.image_url || "/images/placeholder.png", className: "w-12 h-12 rounded-lg object-cover", alt: "" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: auction.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400", children: auction.category?.name }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 mr-1 inline-block ${statusBadges[auction.status] || "bg-gray-100 text-gray-700"}`, children: auction.status }),
              hasPendingEdit(auction) && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 mr-1 inline-block bg-blue-100 text-blue-700", children: "pending edit" }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block ${listingTypeMeta(auction.listing_type).className}`, children: listingTypeMeta(auction.listing_type).label })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: auction.user?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500 mt-0.5", children: auction.user?.email || auction.user?.phone }),
            (auction.user?.individual_verification?.status === "verified" || auction.user?.corporate_verification?.status === "verified") && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1 inline-block", children: "verified Seller" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.listings.show", auction.id),
                className: "w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors",
                title: "View",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye text-sm" })
              }
            ),
            canApprove(auction) && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openApproveModal(auction),
                className: "w-8 h-8 flex items-center justify-center bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors",
                title: "Approve",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check text-sm" })
              }
            ),
            canDecline(auction) && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openDeclineModal(auction),
                className: "w-8 h-8 flex items-center justify-center bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors",
                title: "Decline",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark text-sm" })
              }
            )
          ] }) })
        ] }, auction.id)) })
      ] }) }),
      auctions.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-circle text-4xl mb-4 text-emerald-100" }),
        /* @__PURE__ */ jsx("p", { children: "No listing approvals or pending edits found" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isApproveModalOpen, onClose: () => setIsApproveModalOpen(false), maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check text-xl" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-2", children: "Approve Listing" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-6", children: selectedAuction?.pending_edit ? `Are you sure you want to approve the pending edits for "${selectedAuction?.title}"? The live listing will be updated immediately.` : `Are you sure you want to approve "${selectedAuction?.title}"? Once approved, it will be published and visible to all users.` }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsApproveModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmApprove,
            className: "px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors",
            children: selectedAuction?.pending_edit ? "Approve Edits" : "Approve & Publish"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: () => setIsModalOpen(false), maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: "Decline Listing" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Reason for Decline" }),
        /* @__PURE__ */ jsx("textarea", { className: "mt-1 block w-full rounded-xl border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-rose-500 shadow-sm", rows: "4", value: declineReason, onChange: (e) => setDeclineReason(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: confirmDecline, className: "px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors", children: "Confirm Decline" })
      ] })
    ] }) })
  ] });
}
export {
  Auctions as default
};
