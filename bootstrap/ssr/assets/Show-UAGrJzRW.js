import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-CiJ9dqGe.js";
import { Head, Link, router } from "@inertiajs/react";
import "./useTranslate-AOp3QZfJ.js";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const statusColors = {
  sent: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  skipped: "bg-slate-100 text-slate-600"
};
const channelColors = {
  email: "bg-sky-100 text-sky-700",
  whatsapp: "bg-emerald-100 text-emerald-700"
};
const alertLabels = {
  matched_request: "Matched request",
  offer_received: "Offer received",
  offer_updated: "Offer updated",
  offer_withdrawn: "Offer withdrawn",
  offer_accepted: "Offer accepted",
  offer_rejected: "Offer rejected",
  request_closed: "Request closed"
};
function Show({ log }) {
  const request = log.buyer_request || log.buyerRequest;
  const user = log.user;
  const resend = () => {
    if (!window.confirm(`Resend this failed ${log.channel} alert only?`)) return;
    router.post(route("admin.buyer-request-alerts.resend", log.id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Alert #${log.id}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Alert #${log.id}` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.buyer-request-alerts.index"),
          className: "flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
            " Back to Request Alerts"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${channelColors[log.channel] || "bg-gray-100 text-gray-600"}`,
            children: log.channel
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[log.status] || "bg-gray-100 text-gray-600"}`,
            children: log.status
          }
        ),
        log.status === "failed" && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: resend,
            className: "inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100",
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-rotate-right" }),
              " Resend"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900 mb-1", children: alertLabels[log.alert_key] || log.alert_key }),
          log.subject && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: log.subject }),
          /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap break-words rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-800 font-sans", children: log.body || "—" })
        ] }),
        log.failure_reason && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-rose-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-rose-800 mb-2 uppercase tracking-wider", children: "Failure reason" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-rose-700 whitespace-pre-wrap", children: log.failure_reason }),
          log.provider_response && /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-gray-500", children: [
            "Provider: ",
            log.provider_response
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Recipient" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: user?.name || "—" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: log.destination || "—" }),
          user?.id && /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.users.show", user.id),
              className: "mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50",
              children: "View user profile"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Request" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900 line-clamp-2", children: request?.title || "—" }),
          request?.status && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 uppercase mt-1", children: request.status }),
          log.buyer_request_id && /* @__PURE__ */ jsx(
            Link,
            {
              href: route("admin.buyer-requests.show", log.buyer_request_id),
              className: "mt-4 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50",
              children: "View buyer request"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "Meta" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Alert key" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-gray-800", children: log.alert_key })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Sent at" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: log.sent_at ? new Date(log.sent_at).toLocaleString() : "—" })
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
