import { jsxs, jsx } from "react/jsx-runtime";
import React, { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { useForm, Head, router } from "@inertiajs/react";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput, I as InputError } from "./InputError-CuGgaxYl.js";
import "@headlessui/react";
function Index({ categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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
  const deleteCategory = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      router.delete(route("admin.categories.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Auction Categories", children: [
    /* @__PURE__ */ jsx(Head, { title: "Auction Categories" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Product Categories" }),
      /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
        " Add Category"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-16", children: "Image" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Hierarchy" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Stats" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: categories.map((category) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/30", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("img", { src: category.image || "/images/placeholder.png", className: "w-10 h-10 rounded-lg object-cover border border-gray-200", alt: "" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-800", children: category.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
              "/",
              category.slug
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase", children: "Main Category" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-xs text-gray-500", children: [
            category.subCategories?.length || 0,
            " Sub-categories"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openModal(category), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteCategory(category.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }),
        category.subCategories?.map((sub) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 pl-10", children: /* @__PURE__ */ jsx("img", { src: sub.image || "/images/placeholder.png", className: "w-8 h-8 rounded-lg object-cover border border-gray-200", alt: "" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-700", children: sub.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
                "/",
                sub.slug
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase", children: "Sub-category" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-xs text-gray-500", children: [
              sub.childCategories?.length || 0,
              " Children"
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => openModal(sub), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => deleteCategory(sub.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
            ] }) })
          ] }),
          sub.childCategories?.map((child) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors bg-gray-50/20", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 pl-16", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-[8px] text-gray-500", children: "3rd" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-600", children: child.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-400", children: [
                "/",
                child.slug
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full uppercase", children: "Child" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-[10px] text-gray-400", children: "-" }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => openModal(child), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => deleteCategory(child.id), className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
            ] }) })
          ] }, child.id))
        ] }, sub.id))
      ] }, category.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-6", children: editingCategory ? "Edit Category" : "Add New Category" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Category Name", required: true }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              className: "mt-1 block w-full",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Slug (Optional)" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              className: "mt-1 block w-full",
              value: data.slug,
              onChange: (e) => setData("slug", e.target.value),
              placeholder: "auto-generated from name"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.slug, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Parent Category" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm",
              value: data.parent_id,
              onChange: (e) => setData("parent_id", e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Root Category" }),
                categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Sub Category" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm",
              value: data.sub_category_id,
              onChange: (e) => setData("sub_category_id", e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "None (Is a Sub-category)" }),
                categories.find((c) => c.id == data.parent_id)?.subCategories?.map((sc) => /* @__PURE__ */ jsx("option", { value: sc.id, children: sc.name }, sc.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Category Image" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition-all",
              onChange: (e) => setData("image", e.target.files[0])
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.image, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider", children: "SEO Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Meta Title" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  className: "mt-1 block w-full",
                  value: data.meta_title,
                  onChange: (e) => setData("meta_title", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Meta Description" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "mt-1 block w-full border-gray-300 focus:border-black focus:ring-black rounded-xl shadow-sm",
                  rows: "2",
                  value: data.meta_description,
                  onChange: (e) => setData("meta_description", e.target.value)
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingCategory ? "Update Category" : "Create Category" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
