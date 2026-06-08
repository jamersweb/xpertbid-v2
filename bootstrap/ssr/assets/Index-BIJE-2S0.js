import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { Head, Link, router } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ currencies = [], currencyLastSyncedAt }) {
  const formattedCurrencySyncTime = useMemo(() => {
    if (!currencyLastSyncedAt) return "Not synced yet";
    return new Date(currencyLastSyncedAt).toLocaleString();
  }, [currencyLastSyncedAt]);
  const deleteCurrency = (currency) => {
    if (!window.confirm(`Delete ${currency.code}?`)) return;
    router.delete(route("admin.currencies.destroy", currency.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Currencies", children: [
    /* @__PURE__ */ jsx(Head, { title: "Currencies" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-[260px]", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-950 mb-1", children: "Currencies" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Manage currency symbols, rates, formats, and availability." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex h-11 items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-rotate text-xs" }) }),
            /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-bold uppercase tracking-wider text-sky-600", children: "Last Sync" }),
              /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-gray-900", children: formattedCurrencySyncTime })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Link, { href: route("admin.currencies.create"), className: "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-colors", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus text-xs" }),
            "Add Currency"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle", children: "Currency" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle", children: "Symbol" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle", children: "Rate" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle", children: "Format" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 align-middle text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
          currencies.map((currency) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-900", children: currency.code }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: currency.code }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: currency.name })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-10 justify-center rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-bold text-gray-900", children: currency.symbol }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-sm text-gray-800", children: currency.manual_rate_to_aed || "N/A" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-gray-700 capitalize", children: [
                currency.decimals,
                " decimals"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 capitalize", children: [
                "Symbol ",
                currency.position
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex min-w-[82px] justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${currency.enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`, children: currency.enabled ? "Enabled" : "Disabled" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(Link, { href: route("admin.currencies.edit", currency.id), className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors", title: "Edit currency", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen" }) }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => deleteCurrency(currency), className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors", title: "Delete currency", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
            ] }) })
          ] }, currency.id)),
          !currencies.length && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-12 text-center text-sm text-gray-500", children: "No currencies found." }) })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  Index as default
};
