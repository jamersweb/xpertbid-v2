import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Index({ malls, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMall, setEditingMall] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    logo: null,
    status: "active"
  });
  const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${window.location.origin}/${path.replace(/^\/+/, "")}`;
  };
  const openModal = (mall = null) => {
    setEditingMall(mall);
    if (mall) {
      setData({
        name: mall.name || "",
        logo: null,
        status: mall.status || "active"
      });
    } else {
      reset();
      setData({ name: "", logo: null, status: "active" });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMall(null);
    reset();
  };
  const applyFilters = (e) => {
    e?.preventDefault?.();
    router.get(
      route("admin.malls.index"),
      {
        search: search || void 0,
        status: statusFilter || void 0
      },
      { preserveState: true, replace: true }
    );
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingMall) {
      router.post(
        route("admin.malls.update", editingMall.id),
        { ...data, _method: "PUT" },
        { forceFormData: true, onSuccess: closeModal }
      );
    } else {
      post(route("admin.malls.store"), {
        forceFormData: true,
        onSuccess: closeModal
      });
    }
  };
  const deleteMall = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This mall will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.malls.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Malls", children: [
    /* @__PURE__ */ jsx(Head, { title: "Malls" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-gray-900 tracking-tight", children: "Mall Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Manage malls for corporate seller accounts." })
      ] }),
      /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
        " Add Mall"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-8 border-b border-gray-100 bg-gray-50/10", children: /* @__PURE__ */ jsxs("form", { onSubmit: applyFilters, className: "flex flex-col md:flex-row gap-3 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 group", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900",
              placeholder: "Search name or slug",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "px-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All statuses" }),
              /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800", children: "Filter" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Logo" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Name" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Slug" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Created At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: malls?.data?.length ? malls.data.map((mall) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100/70 hover:bg-gray-50/40", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 font-semibold text-gray-700", children: [
            "#",
            mall.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: mall.logo ? /* @__PURE__ */ jsx("img", { src: assetUrl(mall.logo), alt: mall.name, className: "w-12 h-12 rounded-xl object-cover border border-gray-200" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-store" }) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-gray-900", children: mall.name }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500 font-mono", children: mall.slug }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${mall.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`,
              children: mall.status
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: mall.created_at ? new Date(mall.created_at).toLocaleString() : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openModal(mall), className: "p-2 hover:bg-amber-50 rounded-xl text-amber-600", title: "Edit", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteMall(mall.id), className: "p-2 hover:bg-rose-50 rounded-xl text-rose-600", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, mall.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-6 py-16 text-center text-gray-400", children: "No malls found." }) }) })
      ] }) }),
      malls?.links?.length > 3 && /* @__PURE__ */ jsx("div", { className: "p-6 border-t border-gray-100 flex flex-wrap gap-2 justify-center", children: malls.links.map((link, i) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: !link.url,
          onClick: () => link.url && router.get(link.url),
          className: `px-4 py-2 rounded-xl text-sm font-semibold border ${link.active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"} ${!link.url ? "opacity-40 cursor-not-allowed" : ""}`,
          dangerouslySetInnerHTML: { __html: link.label }
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-gray-900", children: editingMall ? "Edit Mall" : "Create Mall" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Mall Name", required: true, className: "mb-2" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "w-full bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-black focus:ring-black/10",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "Enter mall name",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
      ] }),
      editingMall?.slug && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Slug", className: "mb-2" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "w-full bg-gray-50 text-gray-500 border-gray-200",
            value: editingMall.slug,
            disabled: true
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: "Slug is set on create and cannot be changed." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Status", required: true, className: "mb-2" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full rounded-xl border-gray-300 bg-white text-gray-900 focus:border-black focus:ring-black/10",
            value: data.status,
            onChange: (e) => setData("status", e.target.value),
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
              /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.status, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Logo", className: "mb-2" }),
        editingMall?.logo && /* @__PURE__ */ jsx("img", { src: assetUrl(editingMall.logo), alt: editingMall.name, className: "w-16 h-16 rounded-xl object-cover border border-gray-200 mb-3" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/jpeg,image/png,image/jpg,image/webp,image/gif",
            onChange: (e) => setData("logo", e.target.files[0]),
            className: "block w-full border border-gray-300 rounded-xl p-2 bg-white text-gray-900 file:text-gray-900"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.logo, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingMall ? "Update" : "Create" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
