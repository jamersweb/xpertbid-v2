import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-CiJ9dqGe.js";
import { Head, Link, router } from "@inertiajs/react";
import { P as Price } from "./Price-7qyok_Wm.js";
import "./useTranslate-AOp3QZfJ.js";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const statusColors = {
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
  fulfilled: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  withdrawn: "bg-slate-100 text-slate-600"
};
function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function imageSrc(img) {
  if (!img) return "";
  if (img.url) return img.url;
  if (img.path) return `/${String(img.path).replace(/^\/+/, "")}`;
  return "";
}
function Show({ buyerRequest }) {
  const offers = buyerRequest.offers || [];
  const images = buyerRequest.images || [];
  const categoryLine = [
    buyerRequest.category?.name,
    buyerRequest.sub_category?.name || buyerRequest.subCategory?.name,
    buyerRequest.child_category?.name || buyerRequest.childCategory?.name
  ].filter(Boolean).join(" › ") || "—";
  const closeRequest = () => {
    if (!window.confirm("Close this buyer request? Sellers will no longer be able to offer.")) return;
    router.post(route("admin.buyer-requests.close", buyerRequest.id));
  };
  const deleteRequest = () => {
    if (!window.confirm("Delete this buyer request? This soft-deletes the record.")) return;
    router.delete(route("admin.buyer-requests.destroy", buyerRequest.id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Request #${buyerRequest.id}`, children: [
    /* @__PURE__ */ jsx(Head, { title: buyerRequest.title || `Request #${buyerRequest.id}` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.buyer-requests.index"),
          className: "flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
            " Back to Buyer Requests"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[buyerRequest.status] || "bg-gray-100 text-gray-600"}`,
            children: buyerRequest.status
          }
        ),
        buyerRequest.status === "open" && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: closeRequest,
            className: "inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-lock" }),
              " Close"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: deleteRequest,
            className: "inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }),
              " Delete"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold uppercase tracking-wider text-gray-400", children: [
              "Request #",
              buyerRequest.id
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "mt-1 text-xl font-bold text-gray-900", children: buyerRequest.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: categoryLine })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1", children: "Description" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 leading-relaxed whitespace-pre-wrap", children: stripHtml(buyerRequest.description) || "No description provided." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-gray-400", children: "Budget" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-bold text-gray-900", children: buyerRequest.budget != null && Number(buyerRequest.budget) > 0 ? /* @__PURE__ */ jsx(Price, { amountPKR: buyerRequest.budget }) : "—" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-gray-400", children: "Location" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-700", children: buyerRequest.location_label || [buyerRequest.city, buyerRequest.state, buyerRequest.country].filter(Boolean).join(", ") || "—" })
              ] })
            ] })
          ] })
        ] }),
        images.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 font-bold text-gray-800", children: "Images" }),
          /* @__PURE__ */ jsx("div", { className: "p-6 grid grid-cols-2 sm:grid-cols-3 gap-3", children: images.map((img) => /* @__PURE__ */ jsx(
            "a",
            {
              href: imageSrc(img),
              target: "_blank",
              rel: "noreferrer",
              className: "block aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-50",
              children: /* @__PURE__ */ jsx("img", { src: imageSrc(img), alt: "", className: "h-full w-full object-cover" })
            },
            img.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800", children: "Offers" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-gray-500", children: [
              offers.length,
              " total"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Seller" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Price" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Message" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right", children: "Chat" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: offers.map((offer) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: offer.seller?.name || "—" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: offer.seller?.email })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(Price, { amountPKR: offer.price, className: "text-sm font-bold text-gray-800" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 max-w-xs", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: offer.message || "—" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[offer.status] || "bg-gray-100 text-gray-600"}`,
                  children: offer.status
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: offer.conversation_id ? /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `${route("admin.chat.index")}?conversation_id=${offer.conversation_id}`,
                  className: "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-50",
                  children: [
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-comments" }),
                    " Open"
                  ]
                }
              ) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-300", children: "—" }) })
            ] }, offer.id)) })
          ] }) }),
          offers.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-10 text-center text-gray-400 text-sm", children: "No offers yet" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Buyer" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold", children: buyerRequest.user?.name?.charAt(0) || "?" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 truncate", children: buyerRequest.user?.name || "—" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 truncate", children: buyerRequest.user?.email })
            ] })
          ] }),
          buyerRequest.user?.id && /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.users.show", buyerRequest.user.id),
              className: "inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50",
              children: "View user profile"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Meta" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Created" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800", children: buyerRequest.created_at ? new Date(buyerRequest.created_at).toLocaleString() : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Updated" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800", children: buyerRequest.updated_at ? new Date(buyerRequest.updated_at).toLocaleString() : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Closed at" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800", children: buyerRequest.closed_at ? new Date(buyerRequest.closed_at).toLocaleString() : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Offers" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-800", children: buyerRequest.offers_count ?? offers.length })
            ] })
          ] })
        ] }),
        (buyerRequest.accepted_offer || buyerRequest.acceptedOffer) && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-sky-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-sky-800 mb-4 uppercase tracking-wider", children: "Accepted Offer" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: (buyerRequest.accepted_offer || buyerRequest.acceptedOffer).seller?.name || "Seller" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg font-bold text-gray-900", children: /* @__PURE__ */ jsx(Price, { amountPKR: (buyerRequest.accepted_offer || buyerRequest.acceptedOffer).price }) }),
          (buyerRequest.accepted_offer || buyerRequest.acceptedOffer).message && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: (buyerRequest.accepted_offer || buyerRequest.acceptedOffer).message })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
