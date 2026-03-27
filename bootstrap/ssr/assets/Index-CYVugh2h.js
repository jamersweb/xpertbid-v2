import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { useForm, Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-C1GVdotZ.js";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { T as TextInput, I as InputError } from "./InputError-CuGgaxYl.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import "@headlessui/react";
function Index({ rows }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    id: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    schema_markup: "",
    canonical_url: ""
  });
  const openModal = (row = null) => {
    setEditingRow(row);
    if (row) {
      setData({
        id: row.id,
        slug: row.slug,
        meta_title: row.meta_title || "",
        meta_description: row.meta_description || "",
        meta_keywords: row.meta_keywords || "",
        schema_markup: row.schema_markup || "",
        canonical_url: row.canonical_url || ""
      });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRow(null);
    clearErrors();
    reset();
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.seo.store"), {
      onSuccess: () => closeModal()
    });
  };
  const deleteRow = (id) => {
    if (confirm("Are you sure you want to delete this SEO record?")) {
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
        /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-2" }),
          " Add Record"
        ] })
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
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm font-medium", children: row.meta_title }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500 max-w-xs truncate", children: row.meta_description }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openModal(row),
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
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-6", children: editingRow ? "Edit SEO Record" : "Add SEO Record" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "slug", value: "Slug / Page Path" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "slug",
              className: "mt-1 block w-full",
              value: data.slug,
              onChange: (e) => setData("slug", e.target.value),
              placeholder: "/my-page-path",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.slug, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "meta_title", value: "Meta Title" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "meta_title",
              className: "mt-1 block w-full",
              value: data.meta_title,
              onChange: (e) => setData("meta_title", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.meta_title, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "meta_description", value: "Meta Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "meta_description",
              className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
              value: data.meta_description,
              onChange: (e) => setData("meta_description", e.target.value),
              rows: "3"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.meta_description, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "meta_keywords", value: "Meta Keywords" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "meta_keywords",
              className: "mt-1 block w-full",
              value: data.meta_keywords,
              onChange: (e) => setData("meta_keywords", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "canonical_url", value: "Canonical URL" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "canonical_url",
              className: "mt-1 block w-full",
              value: data.canonical_url,
              onChange: (e) => setData("canonical_url", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.canonical_url, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "schema_markup", value: "Schema Markup (JSON-LD)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "schema_markup",
              className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-mono text-sm",
              value: data.schema_markup,
              onChange: (e) => setData("schema_markup", e.target.value),
              rows: "5"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingRow ? "Update" : "Create" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
