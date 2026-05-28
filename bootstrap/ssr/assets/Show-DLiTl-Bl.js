import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-CZrc0vs-.js";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Show({ brand }) {
  const imageUrl = brand?.image ? `${window.location.origin}/${String(brand.image).replace(/^\/+/, "")}` : null;
  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(void 0, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Brand Details", children: [
    /* @__PURE__ */ jsx(Head, { title: "Brand Details" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl text-gray-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900", children: "Brand Details" }),
        /* @__PURE__ */ jsx(Link, { href: route("admin.brands.index"), className: "px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50", children: "Back" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm text-gray-900", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-gray-900", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "ID:" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: brand.id })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-900", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Name:" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: brand.name })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-900", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Created At:" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: formatDate(brand.created_at) })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-900", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Updated At:" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: formatDate(brand.updated_at) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Image:" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: imageUrl ? /* @__PURE__ */ jsx("img", { src: imageUrl, alt: brand.name, className: "w-32 h-32 object-cover rounded-xl border border-gray-200" }) : /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "N/A" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
