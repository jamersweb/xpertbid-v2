import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ categories, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [expanded, setExpanded] = useState({});
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.categories.index"), { search }, { preserveState: true });
  };
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${window.location.origin}/${path.replace(/^\/+/, "")}`;
  };
  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.categories.destroy", id));
    }
  };
  const renderCategoryRows = (cat, depth = 0) => {
    const styles = {
      0: { bg: "bg-white", badge: "bg-sky-100 text-sky-700", label: "Main" },
      1: { bg: "bg-emerald-50/5", badge: "bg-emerald-100 text-emerald-700", label: "Sub" },
      2: { bg: "bg-gray-50/20", badge: "bg-indigo-100 text-indigo-700", label: "Child" }
    };
    const currentStyle = styles[depth] || styles[2];
    const isExpanded = expanded[cat.id];
    const children = cat.sub_categories || cat.subCategories || cat.child_categories || cat.childCategories || [];
    const hasChildren = children.length > 0;
    const imageUrl = assetUrl(cat.image);
    const rows = [
      /* @__PURE__ */ jsxs("tr", { className: `${currentStyle.bg} hover:bg-gray-50/80 transition-all border-b border-gray-100/50`, children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm",
            style: { marginLeft: `${depth * 2}rem` },
            children: imageUrl ? /* @__PURE__ */ jsx("img", { src: imageUrl, className: "w-full h-full object-cover", alt: "", referrerPolicy: "no-referrer" }) : /* @__PURE__ */ jsx("i", { className: "fa-solid fa-folder text-gray-300" })
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", style: { marginLeft: `${depth * 1.5}rem` }, children: [
          hasChildren ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleExpand(cat.id),
              className: `w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isExpanded ? "bg-black text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`,
              children: /* @__PURE__ */ jsx("i", { className: `fa-solid fa-chevron-right text-[10px] transform ${isExpanded ? "rotate-90" : "rotate-0"}` })
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-6 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-gray-200" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: `text-sm font-black text-gray-900 ${depth === 0 ? "text-base" : ""}`, children: cat.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400 font-medium tracking-wide", children: [
              "/",
              cat.slug
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${currentStyle.badge}`, children: currentStyle.label }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-black uppercase tracking-widest ${hasChildren ? "text-emerald-600" : "text-gray-300"}`, children: [
          children.length,
          " Children"
        ] }) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsx(Link, { href: route("admin.categories.edit", cat.id), className: "p-2 hover:bg-amber-50 rounded-xl text-amber-600 transition-colors", title: "Edit", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => deleteCategory(cat.id), className: "p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition-colors", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
        ] }) })
      ] }, cat.id)
    ];
    if (isExpanded || search) {
      children.forEach((child) => {
        rows.push(...renderCategoryRows(child, depth + 1));
      });
    }
    return rows;
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Product Categories", children: [
    /* @__PURE__ */ jsx(Head, { title: "Product Categories" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-gray-900 tracking-tight", children: "Category Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Browse categories and open a full-page editor for create/edit." })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.categories.create"),
          className: "inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900",
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
            " Add Main Category"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-8 border-b border-gray-100 bg-gray-50/10", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "max-w-xl flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 group", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm transition-all text-gray-900 placeholder:text-gray-400 font-medium",
              placeholder: "Search results will be auto-expanded...",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2 active:scale-95", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass" }),
          "Filter"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto min-h-[400px]", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 w-16", children: "Image" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Name & Path" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Level" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Stats" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: categories.length > 0 ? categories.map((cat) => renderCategoryRows(cat)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-28 text-center bg-gray-50/20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-gray-200", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-folder-open text-4xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-900 font-bold", children: "No categories found" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Create your first main category to get started." })
          ] })
        ] }) }) }) })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
