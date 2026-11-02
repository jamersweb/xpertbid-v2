import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CiJ9dqGe.js";
import { Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { E as ExportCsvButton } from "./ExportCsvButton-0i79GLe1.js";
import "./useTranslate-AOp3QZfJ.js";
import "./useSessionKeepAlive-DtJ4OuSi.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "./Modal-DHAPaXZd.js";
import "@headlessui/react";
import "./TextInput-DDsS-qQQ.js";
import "./InputLabel-CE_n4Upz.js";
import "./SecondaryButton-C9TQBbBR.js";
import "sweetalert2";
const statusColors = {
  sent: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  skipped: "bg-slate-100 text-slate-600"
};
const channelColors = {
  email: "bg-sky-100 text-sky-700",
  whatsapp: "bg-emerald-100 text-emerald-700"
};
function Index({ logs, filters = {}, alertKeys = {} }) {
  const [search, setSearch] = useState(filters.search || "");
  const [channel, setChannel] = useState(filters.channel || "all");
  const [status, setStatus] = useState(filters.status || "all");
  const [alertKey, setAlertKey] = useState(filters.alert_key || "all");
  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const applyFilters = (overrides = {}) => {
    router.get(
      route("admin.buyer-request-alerts.index"),
      {
        search,
        channel,
        status,
        alert_key: alertKey,
        from,
        to,
        ...overrides
      },
      { preserveState: true }
    );
  };
  const handleFilter = (e) => {
    e?.preventDefault();
    applyFilters();
  };
  const resend = (id, channel2) => {
    if (!window.confirm(`Resend this failed ${channel2} alert only?`)) return;
    router.post(route("admin.buyer-request-alerts.resend", id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Request Alerts", children: [
    /* @__PURE__ */ jsx(Head, { title: "Request Alerts" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleFilter, className: "flex flex-1 flex-col xl:flex-row gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 transition-all",
                placeholder: "Search recipient, request, subject, body...",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900",
              value: channel,
              onChange: (e) => {
                setChannel(e.target.value);
                applyFilters({ channel: e.target.value });
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Channels" }),
                /* @__PURE__ */ jsx("option", { value: "email", children: "Email" }),
                /* @__PURE__ */ jsx("option", { value: "whatsapp", children: "WhatsApp" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900",
              value: status,
              onChange: (e) => {
                setStatus(e.target.value);
                applyFilters({ status: e.target.value });
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
                /* @__PURE__ */ jsx("option", { value: "sent", children: "Sent" }),
                /* @__PURE__ */ jsx("option", { value: "failed", children: "Failed" }),
                /* @__PURE__ */ jsx("option", { value: "skipped", children: "Skipped" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900",
              value: alertKey,
              onChange: (e) => {
                setAlertKey(e.target.value);
                applyFilters({ alert_key: e.target.value });
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Alerts" }),
                Object.entries(alertKeys).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900",
              value: from,
              onChange: (e) => setFrom(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              className: "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900",
              value: to,
              onChange: (e) => setTo(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-6 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors",
              children: "Search"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
          ExportCsvButton,
          {
            routeName: "admin.buyer-request-alerts.export",
            params: {
              search,
              channel: channel !== "all" ? channel : void 0,
              status: status !== "all" ? status : void 0,
              alert_key: alertKey !== "all" ? alertKey : void 0
            },
            title: "Export Request Alerts",
            description: "Select a sent date range to download buyer-request alert logs as CSV."
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Channel" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Alert" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Recipient" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Request" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Sent" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: logs.data.map((log) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-xs font-mono text-gray-500", children: [
            "#",
            log.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${channelColors[log.channel] || "bg-gray-100 text-gray-600"}`,
              children: log.channel
            }
          ) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: alertKeys[log.alert_key] || log.alert_key }),
            log.subject && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 line-clamp-1", children: log.subject })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-800", children: log.user?.name || "—" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: log.destination || "—" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800 line-clamp-1", children: log.buyer_request?.title || log.buyerRequest?.title || "—" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[log.status] || "bg-gray-100 text-gray-600"}`,
              children: log.status
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-xs text-gray-500 whitespace-nowrap", children: log.sent_at ? new Date(log.sent_at).toLocaleString() : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => router.get(route("admin.buyer-request-alerts.show", log.id)),
                className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors",
                title: "View",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" })
              }
            ),
            log.status === "failed" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => resend(log.id, log.channel),
                className: "p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",
                title: `Resend ${log.channel} only`,
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-rotate-right" })
              }
            )
          ] }) })
        ] }, log.id)) })
      ] }) }),
      logs.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bell-slash text-4xl mb-4 text-gray-100" }),
        /* @__PURE__ */ jsx("p", { children: "No alert logs found" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: logs.links }) })
    ] })
  ] });
}
export {
  Index as default
};
