import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-d9CWnUKb.js";
import { Head, router } from "@inertiajs/react";
import "./CurrencyPicker-BYSFLoir.js";
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
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Sent At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
          emailLogs.data.map((log) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800", children: log.recipient_email }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 uppercase tracking-tighter", children: log.user?.name || "Guest" })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 line-clamp-1", children: log.subject }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase", children: log.type }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400 font-medium", children: new Date(log.sent_at).toLocaleString() }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider", children: "Sent" }) })
          ] }, log.id)),
          emailLogs.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-12 text-center text-gray-400 italic text-sm", children: "No email logs found." }) })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  Index as default
};
