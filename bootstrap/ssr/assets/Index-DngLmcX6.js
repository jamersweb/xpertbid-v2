import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { Head, router } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ emailLogs, filters }) {
  const handleSearch = (e) => {
    router.get(route("admin.email-logs.index"), { search: e.target.value }, { preserveState: true, replace: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "System Email Logs", children: [
    /* @__PURE__ */ jsx(Head, { title: "Email Logs" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "w-full pl-12 pr-4 py-3 bg-white border-none focus:ring-2 focus:ring-black rounded-2xl shadow-sm text-sm",
            placeholder: "Search by email, subject or recipient...",
            defaultValue: filters.search,
            onChange: handleSearch
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Recipient" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Subject" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Type" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Time" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Reason" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
          emailLogs.data.map((log) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800", children: log.recipient_email }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 uppercase tracking-tighter", children: log.user?.name || "Guest" })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 line-clamp-1", children: log.subject || "Email Notification" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase", children: log.type || "Email" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400 font-medium whitespace-nowrap", children: new Date(log.sent_at).toLocaleString() }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 max-w-sm", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-500 line-clamp-2", title: log.failure_reason || "", children: log.failure_reason || "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${log.status === "failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`, children: log.status || "sent" }) })
          ] }, log.id)),
          emailLogs.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-12 text-center text-gray-400 italic text-sm", children: "No email logs found." }) })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  Index as default
};
