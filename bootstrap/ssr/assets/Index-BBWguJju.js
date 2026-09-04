import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { Head, Link, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ rows }) {
  const deleteRow = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This SEO record will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.seo.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "SEO Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "SEO Management" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800", children: "SEO Records" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Manage meta tags and SEO for dynamic pages." })
        ] }),
        /* @__PURE__ */ jsx(Link, { href: route("admin.seo.create"), children: /* @__PURE__ */ jsxs(PrimaryButton, { children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-2" }),
          " Add Record"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Slug / Page" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Meta Title" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Description" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: rows.data.map((row) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-xs bg-gray-100 px-2 py-1 rounded text-primary", children: row.slug }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: row.meta_title }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-700 max-w-xs truncate", children: row.meta_description }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => router.visit(route("admin.seo.edit", row.id)),
                className: "p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => deleteRow(row.id),
                className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
              }
            )
          ] }) })
        ] }, row.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: rows.links }) })
    ] })
  ] });
}
export {
  Index as default
};
