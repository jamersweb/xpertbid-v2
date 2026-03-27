import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { Head, Link, router } from "@inertiajs/react";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import "@headlessui/react";
function Auctions({ auctions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const canApprove = (status) => ["inactive", "declined", "resubmit"].includes(status);
  const canDecline = (status) => ["inactive", "resubmit"].includes(status);
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
  const acceptAuction = (id) => {
    if (confirm("Are you sure you want to approve and publish this listing?")) {
      router.post(route("admin.verifications.auctions.accept", id));
    }
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
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Showing inactive, declined, and resubmit listings" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Listing Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Seller" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Verification Check" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: auctions.data.map((auction) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: auction.image_url || "/images/placeholder.png", className: "w-12 h-12 rounded-lg object-cover", alt: "" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: auction.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400", children: auction.category?.name }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 mr-1 inline-block ${statusBadges[auction.status] || "bg-gray-100 text-gray-700"}`, children: auction.status }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block ${auction.listing_type === "auction" ? "bg-violet-100 text-violet-700" : auction.listing_type === "business" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`, children: auction.listing_type === "auction" ? "Auction" : auction.listing_type === "business" ? "Business" : "Normal" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800", children: auction.user?.name }),
            /* @__PURE__ */ jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded-full ${auction.user?.individual_verification?.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`, children: [
              auction.user?.individual_verification?.status || "unverified",
              " Seller"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            auction.vehicle_verification && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-blue-600 font-bold", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-car mr-1" }),
              " Vehicle Docs Provided"
            ] }),
            auction.property_verification && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-purple-600 font-bold", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-house mr-1" }),
              " Property Docs Provided"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.listings.show", auction.id),
                className: "px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors",
                children: "View"
              }
            ),
            canApprove(auction.status) && /* @__PURE__ */ jsx("button", { onClick: () => acceptAuction(auction.id), className: "px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors", children: "Approve" }),
            canDecline(auction.status) && /* @__PURE__ */ jsx("button", { onClick: () => openDeclineModal(auction), className: "px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors", children: "Decline" })
          ] }) })
        ] }, auction.id)) })
      ] }) }),
      auctions.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check-circle text-4xl mb-4 text-emerald-100" }),
        /* @__PURE__ */ jsx("p", { children: "No inactive, declined, or resubmit listings found" })
      ] })
    ] }),
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
