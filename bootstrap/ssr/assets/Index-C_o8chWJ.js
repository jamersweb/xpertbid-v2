import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CjtavrEj.js";
import { useForm, Head, router } from "@inertiajs/react";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput, I as InputError } from "./InputError-CuGgaxYl.js";
import Swal from "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Index({ categories, filters }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    parent_id: "",
    sub_category_id: "",
    slug: "",
    image: null,
    meta_title: "",
    meta_description: "",
    seo_content: "",
    seo_short_content: "",
    schema_markup: ""
  });
  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setData({
        name: category.name || "",
        parent_id: category.parent_id || "",
        sub_category_id: category.sub_category_id || "",
        slug: category.slug || "",
        image: null,
        meta_title: category.meta_title || "",
        meta_description: category.meta_description || "",
        seo_content: category.seo_content || "",
        seo_short_content: category.seo_short_content || "",
        schema_markup: category.schema_markup || ""
      });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      router.post(route("admin.categories.update", editingCategory.id), {
        ...data,
        _method: "PUT"
      }, {
        onSuccess: () => closeModal()
      });
    } else {
      post(route("admin.categories.store"), {
        onSuccess: () => closeModal()
      });
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
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
    const imageUrl = cat.image ? cat.image.startsWith("http") ? cat.image : `${window.location.origin}/${cat.image.replace(/^\/+/, "")}` : null;
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
          /* @__PURE__ */ jsx("button", { onClick: () => openModal(cat), className: "p-2 hover:bg-amber-50 rounded-xl text-amber-600 transition-colors", title: "Edit", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
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
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Click on the arrows to expand sub-categories." })
      ] }),
      /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
        " Add Main Category"
      ] })
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
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-gray-900 uppercase tracking-tight", children: editingCategory ? "Modify Category" : "New Category" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: closeModal, className: "w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark text-gray-400" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Category Name", required: true, className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "w-full text-gray-900 font-bold",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                required: true,
                placeholder: "e.g. Vehicles"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "SEO Slug (URL)", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                className: "w-full text-gray-900",
                value: data.slug,
                onChange: (e) => setData("slug", e.target.value),
                placeholder: "auto-generated-slug"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.slug, className: "mt-2" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Parent Level", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "w-full border-gray-200 focus:border-black focus:ring-4 focus:ring-black/5 rounded-2xl shadow-sm text-gray-900 font-medium py-3",
                value: data.parent_id,
                onChange: (e) => setData("parent_id", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Top-Level Category" }),
                  categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Sub-Category Level", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "w-full border-gray-200 focus:border-black focus:ring-4 focus:ring-black/5 rounded-2xl shadow-sm text-gray-900 font-medium py-3 disabled:opacity-30 disabled:bg-gray-50",
                value: data.sub_category_id,
                onChange: (e) => setData("sub_category_id", e.target.value),
                disabled: !data.parent_id,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Root of Sub-Category" }),
                  categories.find((c) => c.id == data.parent_id)?.subCategories?.map((sc) => /* @__PURE__ */ jsx("option", { value: sc.id, children: sc.name }, sc.id))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Upload Category Image", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-4 p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 hover:bg-gray-50 transition-colors group cursor-pointer relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                className: "absolute inset-0 opacity-0 cursor-pointer",
                onChange: (e) => setData("image", e.target.files[0])
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cloud-arrow-up text-xl" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: "Click to upload image" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG or GIF up to 2MB" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: errors.image, className: "mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex justify-end gap-4", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, className: "px-8 py-3 rounded-2xl", children: "Dismiss" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-10 py-3 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/20 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50",
            children: editingCategory ? "Commit Changes" : "Create Category"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
