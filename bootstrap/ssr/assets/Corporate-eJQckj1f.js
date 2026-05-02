import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-C2LKEM9N.js";
import { Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Corporate({ verifications, filters }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [search, setSearch] = useState(filters.search || "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.verifications.corporate.index"), { search }, { preserveState: true });
  };
  const openDeclineModal = (verification) => {
    setSelectedVerification(verification);
    setIsModalOpen(true);
  };
  const confirmDecline = () => {
    if (!declineReason) return alert("Please provide a reason.");
    router.post(route("admin.verifications.corporate.decline", selectedVerification.id), {
      decline_reason: declineReason
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setDeclineReason("");
      }
    });
  };
  const acceptVerification = (id) => {
    if (confirm("Are you sure you want to accept this verification?")) {
      router.post(route("admin.verifications.corporate.accept", id));
    }
  };
  const statusBadges = {
    verified: "bg-emerald-100 text-emerald-700",
    declined: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-700",
    not_verified: "bg-gray-100 text-gray-700",
    resubmit: "bg-blue-100 text-blue-700"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Corporate Verifications", children: [
    /* @__PURE__ */ jsx(Head, { title: "Corporate Verifications" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex-1 max-w-md flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all text-gray-900",
              placeholder: "Search by entity name...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass" }),
          "Search"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Entity Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Applicant" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Documents" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: verifications.data.map((verification) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: verification.legal_entity_name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-500", children: [
              verification.entity_type,
              " (",
              verification.country,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800", children: verification.user?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-500", children: verification.user?.email })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap max-w-[150px]", children: (verification.business_documents || []).map((doc, idx) => /* @__PURE__ */ jsxs("a", { href: "/" + doc, target: "_blank", className: "text-[10px] bg-gray-100 text-gray-900 hover:bg-gray-200 px-2 py-1 rounded", children: [
            "Doc ",
            idx + 1
          ] }, idx)) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadges[verification.status] || "bg-gray-100"}`, children: verification.status.replace("_", " ") }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: verification.status !== "verified" && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => acceptVerification(verification.id), className: "p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors", title: "Accept", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => openDeclineModal(verification), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", title: "Decline", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-xmark" }) })
          ] }) })
        ] }, verification.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: verifications.links }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: () => setIsModalOpen(false), maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: "Decline Corporate Verification" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Reason for Decline" }),
        /* @__PURE__ */ jsx("textarea", { className: "mt-1 block w-full border-gray-300 focus:border-rose-500 focus:ring-rose-500 rounded-md shadow-sm text-gray-900", rows: "4", value: declineReason, onChange: (e) => setDeclineReason(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: confirmDecline, className: "px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors", children: "Confirm Decline" })
      ] })
    ] }) })
  ] });
}
export {
  Corporate as default
};
