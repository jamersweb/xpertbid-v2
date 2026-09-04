import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  is_email_verified: false,
  legal_entity_name: "",
  registered_address: "",
  date_of_incorporation: "",
  entity_type: "",
  country: "",
  mall_id: "",
  business_documents: []
};
function Index({ users, filters, malls = [], countries = [] }) {
  const { flash } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState(filters.search || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data, setData, processing, errors, reset, clearErrors, setError } = useForm({ ...emptyForm });
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.mall-sellers.index"), { search }, { preserveState: true });
  };
  const getUserPhone = (user) => user.phone || "No phone";
  const openModal = (user = null) => {
    setEditingUser(user);
    setShowPassword(false);
    clearErrors();
    if (user) {
      setData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        is_email_verified: Boolean(user.is_email_verified),
        legal_entity_name: user.legal_entity_name || "",
        registered_address: user.registered_address || "",
        date_of_incorporation: user.date_of_incorporation ? String(user.date_of_incorporation).slice(0, 10) : "",
        entity_type: user.entity_type || "",
        country: user.country || "",
        mall_id: user.mall_id ? String(user.mall_id) : "",
        business_documents: []
      });
    } else {
      setData({ ...emptyForm });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setShowPassword(false);
    clearErrors();
    reset();
  };
  const submit = (e) => {
    e.preventDefault();
    clearErrors();
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("email", data.email || "");
    formData.append("phone", data.phone || "");
    formData.append("is_email_verified", data.is_email_verified ? "1" : "0");
    formData.append("legal_entity_name", data.legal_entity_name || "");
    formData.append("registered_address", data.registered_address || "");
    formData.append("date_of_incorporation", data.date_of_incorporation || "");
    formData.append("entity_type", data.entity_type || "");
    formData.append("country", data.country || "");
    formData.append("mall_id", data.mall_id || "");
    if (data.password) {
      formData.append("password", data.password);
    }
    (data.business_documents || []).forEach((file) => {
      if (file) {
        formData.append("business_documents[]", file);
      }
    });
    const options = {
      forceFormData: true,
      preserveScroll: true,
      onStart: () => setIsSaving(true),
      onFinish: () => setIsSaving(false),
      onSuccess: () => closeModal(),
      onError: (errs) => {
        if (errs && typeof errs === "object") {
          Object.entries(errs).forEach(([key, message]) => {
            setError(key, Array.isArray(message) ? message[0] : message);
          });
        }
      }
    };
    if (editingUser) {
      formData.append("_method", "put");
      router.post(route("admin.mall-sellers.update", editingUser.id), formData, options);
    } else {
      router.post(route("admin.mall-sellers.store"), formData, options);
    }
  };
  const toggleStatus = (user) => {
    const newStatus = user.status === "enable" ? "disable" : "enable";
    router.patch(route("admin.mall-sellers.update-status", user.id), { status: newStatus });
  };
  const deleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `${user.name} will be deleted permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      router.delete(route("admin.mall-sellers.destroy", user.id));
    }
  };
  const bannerStatus = flash?.success || null;
  const bannerError = flash?.error || null;
  const existingDocs = editingUser?.business_documents || [];
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Mall Sellers", children: [
    /* @__PURE__ */ jsx(Head, { title: "Mall Sellers" }),
    (bannerStatus || bannerError) && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-4 rounded-2xl border px-5 py-4 shadow-sm ${bannerError ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("i", { className: `fa-solid ${bannerError ? "fa-triangle-exclamation" : "fa-circle-check"} mt-0.5` }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold", children: bannerError ? "Error" : "Success" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: bannerError || bannerStatus })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex flex-col gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row xl:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex-1 max-w-md flex gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full pl-11 pr-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm transition-all text-gray-900",
                placeholder: "Search by name, email, phone or company...",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass" }),
                "Search"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-2" }),
          " Add Mall Seller"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "User Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Contact" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Mall" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Legal Entity" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
          users.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden", children: user.profile_pic ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: user.profile_pic,
                  alt: user.name,
                  referrerPolicy: "no-referrer",
                  className: "w-full h-full object-cover"
                }
              ) : user.name?.charAt(0) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: user.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                  "ID: #",
                  user.id
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800", children: user.email }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: getUserPhone(user) })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700", children: user.mall_name || "—" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800", children: user.legal_entity_name || "—" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 capitalize", children: user.corporate_verification_status || "—" })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleStatus(user),
                className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${user.status === "enable" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`,
                children: user.status === "enable" ? "Active" : "Disabled"
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openModal(user),
                  className: "p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",
                  title: "Edit Mall Seller",
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteUser(user),
                  className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors",
                  title: "Delete Mall Seller",
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
                }
              )
            ] }) })
          ] }, user.id)),
          users.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-sm text-gray-500", children: "No mall sellers found. Create one to get started." }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: users.links }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-6", children: editingUser ? "Edit Mall Seller" : "Add Mall Seller" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-h-[70vh] overflow-y-auto pr-1", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-3", children: "Account" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Name" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "name",
                  className: "mt-1 block w-full text-gray-900",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "email",
                  type: "email",
                  className: "mt-1 block w-full text-gray-900",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone", value: "Phone No" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "phone",
                  className: "mt-1 block w-full text-gray-900",
                  value: data.phone,
                  onChange: (e) => setData("phone", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.phone, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-gray-800", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 text-black focus:ring-black",
                  checked: Boolean(data.is_email_verified),
                  onChange: (e) => setData("is_email_verified", e.target.checked)
                }
              ),
              "Email verified"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  htmlFor: "password",
                  value: editingUser ? "Password (leave blank to keep current)" : "Password"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    className: "block w-full pr-11 text-gray-900",
                    value: data.password,
                    onChange: (e) => setData("password", e.target.value),
                    required: !editingUser
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword((prev) => !prev),
                    className: "absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700",
                    title: showPassword ? "Hide password" : "Show password",
                    children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}` })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-3", children: "Corporate Verification" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "legal_entity_name", value: "Legal Entity Name" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  id: "legal_entity_name",
                  className: "mt-1 block w-full text-gray-900",
                  value: data.legal_entity_name,
                  onChange: (e) => setData("legal_entity_name", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.legal_entity_name, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { htmlFor: "registered_address", value: "Registered Address" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "registered_address",
                  className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900",
                  rows: 3,
                  value: data.registered_address,
                  onChange: (e) => setData("registered_address", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.registered_address, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "date_of_incorporation", value: "Date of Incorporation" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "date_of_incorporation",
                    type: "date",
                    className: "mt-1 block w-full text-gray-900",
                    value: data.date_of_incorporation,
                    onChange: (e) => setData("date_of_incorporation", e.target.value),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.date_of_incorporation, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "entity_type", value: "Type of Entity" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    id: "entity_type",
                    className: "mt-1 block w-full text-gray-900",
                    value: data.entity_type,
                    onChange: (e) => setData("entity_type", e.target.value),
                    placeholder: "Private Limited, LLC, ...",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.entity_type, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                InputLabel,
                {
                  htmlFor: "business_documents",
                  value: editingUser ? "Upload your documents (optional if already uploaded)" : "Upload your documents"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "business_documents",
                  type: "file",
                  accept: ".jpg,.jpeg,.png,.pdf",
                  multiple: true,
                  className: "mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white hover:file:bg-gray-800",
                  onChange: (e) => setData("business_documents", Array.from(e.target.files || []).slice(0, 3)),
                  required: !editingUser && existingDocs.length === 0
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500", children: "JPG, PNG or PDF. Max 3 files, 10MB each." }),
              editingUser && existingDocs.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-1", children: existingDocs.map((doc) => /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/${String(doc).replace(/^\//, "")}`,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "block text-xs font-medium text-sky-600 hover:underline",
                  children: String(doc).split("/").pop()
                },
                doc
              )) }),
              /* @__PURE__ */ jsx(InputError, { message: errors.business_documents, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "country", value: "Country" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "country",
                    className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-900",
                    value: data.country,
                    onChange: (e) => setData("country", e.target.value),
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select country" }),
                      countries.map((country) => /* @__PURE__ */ jsx("option", { value: country.name, children: country.name }, country.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.country, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { htmlFor: "mall_id", value: "Mall" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "mall_id",
                    className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-900",
                    value: data.mall_id,
                    onChange: (e) => setData("mall_id", e.target.value),
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select mall" }),
                      malls.map((mall) => /* @__PURE__ */ jsx("option", { value: mall.id, children: mall.name }, mall.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.mall_id, className: "mt-2" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing || isSaving, children: processing || isSaving ? "Saving..." : editingUser ? "Update Mall Seller" : "Create Mall Seller" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
