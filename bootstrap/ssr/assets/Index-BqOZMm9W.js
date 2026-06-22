import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
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
function Index({ brands, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    image: null
  });
  const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${window.location.origin}/${path.replace(/^\/+/, "")}`;
  };
  const openModal = (brand = null) => {
    setEditingBrand(brand);
    if (brand) {
      setData({ name: brand.name || "", image: null });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    reset();
  };
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.brands.index"), { search }, { preserveState: true, replace: true });
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingBrand) {
      router.post(route("admin.brands.update", editingBrand.id), { ...data, _method: "PUT" }, {
        onSuccess: closeModal
      });
    } else {
      post(route("admin.brands.store"), { onSuccess: closeModal });
    }
  };
  const deleteBrand = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This brand will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.brands.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Brands", children: [
    /* @__PURE__ */ jsx(Head, { title: "Brands" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-gray-900 tracking-tight", children: "Brand Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Manage product brands with logo/image." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs(SecondaryButton, { type: "button", onClick: () => router.visit(route("admin.brand-pages.index")), children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-ruler mr-2" }),
          " Brand Pages"
        ] }),
        /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
          " Add Brand"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-8 border-b border-gray-100 bg-gray-50/10", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "max-w-xl flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 group", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black rounded-2xl text-sm text-gray-900",
              placeholder: "Search brand name",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-8 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800", children: "Filter" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "ID" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Image" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Name" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Created At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Updated At" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: brands?.data?.length ? brands.data.map((brand) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100/70 hover:bg-gray-50/40", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 font-semibold text-gray-700", children: [
            "#",
            brand.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: brand.image ? /* @__PURE__ */ jsx("img", { src: assetUrl(brand.image), alt: brand.name, className: "w-12 h-12 rounded-xl object-cover border border-gray-200" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image" }) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-gray-900", children: brand.name }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: brand.created_at ? new Date(brand.created_at).toLocaleString() : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: brand.updated_at ? new Date(brand.updated_at).toLocaleString() : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsx("a", { href: route("admin.brands.show", brand.id), className: "p-2 hover:bg-sky-50 rounded-xl text-sky-600", title: "View", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" }) }),
            /* @__PURE__ */ jsx("a", { href: route("admin.brand-pages.index", { brand_id: brand.id }), className: "p-2 hover:bg-gray-100 rounded-xl text-gray-600", title: "Brand Page", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-ruler" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => openModal(brand), className: "p-2 hover:bg-amber-50 rounded-xl text-amber-600", title: "Edit", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteBrand(brand.id), className: "p-2 hover:bg-rose-50 rounded-xl text-rose-600", title: "Delete", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
          ] }) })
        ] }, brand.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-6 py-16 text-center text-gray-400", children: "No brands found." }) }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-gray-900", children: editingBrand ? "Edit Brand" : "Create Brand" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Brand Name", required: true, className: "mb-2" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            className: "w-full bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-black focus:ring-black/10",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            placeholder: "Enter brand name",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { value: "Brand Image", className: "mb-2" }),
        editingBrand?.image && /* @__PURE__ */ jsx("img", { src: assetUrl(editingBrand.image), alt: editingBrand.name, className: "w-16 h-16 rounded-xl object-cover border border-gray-200 mb-3" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: (e) => setData("image", e.target.files[0]),
            className: "block w-full border border-gray-300 rounded-xl p-2 bg-white text-gray-900 file:text-gray-900"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.image, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingBrand ? "Update" : "Create" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
