import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const formInputClass = "w-full px-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-black rounded-xl text-sm text-gray-900 placeholder:text-gray-400";
function Form({ currency = null }) {
  const isEditing = Boolean(currency);
  const { data, setData, post, put, processing, errors } = useForm({
    code: currency?.code || "",
    name: currency?.name || "",
    symbol: currency?.symbol || "",
    manual_rate_to_aed: currency?.manual_rate_to_aed || "",
    decimals: currency?.decimals ?? 2,
    position: currency?.position || "left",
    enabled: currency?.enabled ?? true
  });
  const submit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route("admin.currencies.update", currency.id));
      return;
    }
    post(route("admin.currencies.store"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEditing ? `Edit ${currency.code}` : "Create Currency", children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? `Edit ${currency.code}` : "Create Currency" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900", children: isEditing ? `Edit ${currency.code}` : "Create Currency" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Set currency code, symbol, rate, format, and availability." })
        ] }),
        /* @__PURE__ */ jsxs(Link, { href: route("admin.currencies.index"), className: "inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-200 transition-colors", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" }),
          "Back"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Code" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: `${formInputClass} font-bold uppercase`,
                value: data.code,
                maxLength: 3,
                placeholder: "USD",
                onChange: (e) => setData("code", e.target.value.toUpperCase())
              }
            ),
            errors.code && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Symbol" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: formInputClass,
                value: data.symbol,
                placeholder: "$",
                onChange: (e) => setData("symbol", e.target.value)
              }
            ),
            errors.symbol && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.symbol })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: formInputClass,
              value: data.name,
              placeholder: "US Dollar",
              onChange: (e) => setData("name", e.target.value)
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Rate" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              step: "0.00000001",
              min: "0",
              className: formInputClass,
              value: data.manual_rate_to_aed,
              placeholder: "1.00000000",
              onChange: (e) => setData("manual_rate_to_aed", e.target.value)
            }
          ),
          errors.manual_rate_to_aed && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.manual_rate_to_aed })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Decimals" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "8",
                className: formInputClass,
                value: data.decimals,
                onChange: (e) => setData("decimals", e.target.value)
              }
            ),
            errors.decimals && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.decimals })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-600 uppercase mb-1.5", children: "Position" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: formInputClass,
                value: data.position,
                onChange: (e) => setData("position", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "left", children: "Left" }),
                  /* @__PURE__ */ jsx("option", { value: "right", children: "Right" })
                ]
              }
            ),
            errors.position && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.position })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: "Enabled" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              className: "h-5 w-5 rounded border-gray-300 text-black focus:ring-black",
              checked: data.enabled,
              onChange: (e) => setData("enabled", e.target.checked)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(Link, { href: route("admin.currencies.index"), className: "inline-flex items-center justify-center rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-800 hover:bg-gray-200 transition-colors", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "inline-flex min-w-[170px] items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-colors disabled:opacity-50", children: processing ? "Saving..." : isEditing ? "Update Currency" : "Create Currency" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Form as default
};
