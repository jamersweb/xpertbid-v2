import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CCDzOvsD.js";
import { Head, Link, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Show({ listing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const isEmptyValue = (value) => {
    if (value === null || value === void 0) return true;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      return normalized === "" || normalized === "n/a" || normalized === "null";
    }
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  };
  const formatLabel = (value) => String(value).replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (char) => char.toUpperCase());
  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };
  const seller = listing.user;
  const verificationStatus = seller?.individual_verification?.status || seller?.individualVerification?.status || seller?.corporate_verification?.status || seller?.corporateVerification?.status || "unverified";
  const infoItems = [
    { label: "Listing ID", value: listing.id },
    { label: "Title", value: listing.title || "N/A" },
    { label: "Status", value: listing.status || "N/A" },
    { label: "Listing Type", value: listing.listing_type || "N/A" },
    { label: "Category", value: listing.category?.name || "N/A" },
    { label: "Sub Category", value: listing.sub_category?.name || listing.subCategory?.name || "N/A" },
    { label: "Child Category", value: listing.child_category?.name || listing.childCategory?.name || "N/A" },
    { label: "Price", value: listing.price || "N/A" },
    { label: "Minimum Bid", value: listing.minimum_bid || "N/A" },
    { label: "Reserve Price", value: listing.reserve_price || "N/A" },
    { label: "Buy Now Price", value: listing.buy_now_price || "N/A" },
    { label: "Stock", value: listing.stock || "N/A" },
    { label: "Condition", value: listing.product_condition || "N/A" },
    { label: "Year", value: listing.product_year || "N/A" },
    { label: "Start Date", value: listing.start_date || "N/A" },
    { label: "End Date", value: listing.end_date || "N/A" },
    { label: "Views", value: listing.views ?? 0 }
  ].filter((item) => !isEmptyValue(item.value));
  const sellerItems = [
    { label: "Seller Name", value: seller?.name || "N/A" },
    { label: "Username", value: seller?.username || "N/A" },
    { label: "Email", value: seller?.email || "N/A" },
    { label: "Phone", value: seller?.phone || "N/A" },
    { label: "Company", value: seller?.company_name || "N/A" },
    { label: "Role", value: seller?.role || "N/A" },
    { label: "Account Status", value: seller?.status || "N/A" },
    { label: "Verification", value: verificationStatus },
    { label: "Country", value: seller?.country?.name || seller?.country || "N/A" },
    { label: "City", value: seller?.city_name || seller?.city || "N/A" },
    { label: "State", value: seller?.state_name || seller?.state || "N/A" },
    { label: "Address Line 1", value: seller?.address_line1 || "N/A" },
    { label: "Address Line 2", value: seller?.address_line2 || "N/A" },
    { label: "Postal Code", value: seller?.postal_code || "N/A" }
  ].filter((item) => !isEmptyValue(item.value));
  const galleryImages = listing.album_urls?.length ? listing.album_urls : listing.image_url ? [listing.image_url] : [];
  const canApproveListing = ["inactive", "declined", "resubmit"].includes(listing.status);
  const canDeclineListing = ["inactive", "resubmit"].includes(listing.status);
  const acceptListing = () => {
    if (confirm("Are you sure you want to approve and publish this listing?")) {
      router.post(route("admin.verifications.auctions.accept", listing.id));
    }
  };
  const declineListing = () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    router.post(
      route("admin.verifications.auctions.decline", listing.id),
      { reason: declineReason },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setDeclineReason("");
        }
      }
    );
  };
  const renderStructuredData = (data) => {
    if (!data) {
      return /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-2", children: "N/A" });
    }
    const entries = Object.entries(data).filter(([, value]) => !isEmptyValue(value));
    if (!entries.length) {
      return /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-2", children: "N/A" });
    }
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-3", children: entries.map(([key, value]) => {
      const isComplex = Array.isArray(value) || typeof value === "object" && value !== null;
      return /* @__PURE__ */ jsx("div", { className: isComplex ? "md:col-span-2" : "", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-100 bg-gray-50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 uppercase font-bold", children: formatLabel(key) }),
        isComplex ? /* @__PURE__ */ jsx("pre", { className: "mt-2 whitespace-pre-wrap break-words text-xs text-gray-800", children: JSON.stringify(value, null, 2) }) : key.toLowerCase().includes("price") && !isEmptyValue(value) ? /* @__PURE__ */ jsx(Price, { amountPKR: value, className: "mt-1 text-sm text-gray-800 break-words font-medium" }) : /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-800 break-words", children: formatValue(value) })
      ] }) }, key);
    }) });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Listing Details: ${listing.title}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Listing # ${listing.id}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Listing Details" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Review listing data and seller profile from one place." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          canApproveListing && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: acceptListing,
              className: "px-4 py-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700",
              children: "Approve"
            }
          ) }),
          canDeclineListing && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsModalOpen(true),
              className: "px-4 py-2 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700",
              children: "Decline"
            }
          ) }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.verifications.auctions.index"),
              className: "px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50",
              children: "Back to Approval List"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: listing.image_url || "/images/placeholder.png",
                  className: "w-24 h-24 rounded-2xl object-cover border border-gray-100",
                  alt: listing.title
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: listing.title }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold uppercase", children: listing.status || "N/A" }),
                  /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase", children: listing.listing_type || "N/A" }),
                  listing.category?.name && /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[11px] font-bold", children: listing.category.name })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", children: [
              infoItems.map((item) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 uppercase font-bold", children: item.label }),
                ["Price", "Minimum Bid", "Reserve Price", "Buy Now Price"].includes(item.label) && !isEmptyValue(item.value) ? /* @__PURE__ */ jsx(Price, { amountPKR: item.value, className: "mt-1 text-sm text-gray-800 break-words font-medium" }) : /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-800 break-words", children: formatValue(item.value) })
              ] }, item.label)),
              !isEmptyValue(listing.description) && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 uppercase font-bold", children: "Description" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "text-sm text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none",
                    dangerouslySetInnerHTML: { __html: listing.description }
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "Dynamic Data (JSON)" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-700", children: "Listing specific data (listing_data):" }),
                renderStructuredData(listing.listing_data)
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-700", children: "Category features (category_features):" }),
                renderStructuredData(listing.category_features)
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "Seller Information" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden", children: seller?.profile_pic ? /* @__PURE__ */ jsx("img", { src: seller.profile_pic, alt: seller?.name, className: "w-full h-full object-cover" }) : (seller?.name || "U").charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: seller?.name || "Unknown Seller" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: seller?.email || "No email available" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3", children: sellerItems.map((item) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 uppercase font-bold", children: item.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 break-words", children: formatValue(item.value) })
              ] }, item.label)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-gray-900 mb-3", children: "Images" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              galleryImages.map((img, i) => /* @__PURE__ */ jsx("img", { src: img, className: "w-full h-24 object-cover rounded-lg", alt: `Listing image ${i + 1}` }, i)),
              !galleryImages.length && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 italic col-span-2", children: "No images uploaded" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-gray-900 mb-3", children: "Approval Notes" }),
            !isEmptyValue(listing.decline_reason) ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: listing.decline_reason }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No decline reason recorded for this listing." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: () => setIsModalOpen(false), maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: "Decline Listing" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Reason for Decline" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "mt-1 block w-full rounded-xl border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-rose-500 focus:ring-rose-500 shadow-sm",
            rows: "4",
            value: declineReason,
            onChange: (e) => setDeclineReason(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: () => setIsModalOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: declineListing,
            className: "px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors",
            children: "Confirm Decline"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Show as default
};
