import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DNCwhj5R.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { E as ExportCsvButton } from "./ExportCsvButton-0i79GLe1.js";
import Swal from "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "@headlessui/react";
function Index({ users, filters, roles = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState(filters.search || "");
  const defaultRole = roles.includes("User") ? "User" : roles[0] || "User";
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: defaultRole,
    is_email_verified: false,
    is_individual_verified: false,
    is_corporate_verified: false
  });
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.users.index"), { search }, { preserveState: true });
  };
  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setData({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone || "",
        role: user.role_name || defaultRole,
        is_email_verified: Boolean(user.is_email_verified),
        is_individual_verified: user.individual_verification_status === "verified",
        is_corporate_verified: user.corporate_verification_status === "verified"
      });
    } else {
      setData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: defaultRole,
        is_email_verified: false,
        is_individual_verified: false,
        is_corporate_verified: false
      });
      clearErrors();
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    clearErrors();
    reset();
  };
  const submit = (e) => {
    e.preventDefault();
    if (editingUser) {
      put(route("admin.users.update", editingUser.id), {
        onSuccess: () => closeModal()
      });
    } else {
      post(route("admin.users.store"), {
        onSuccess: () => closeModal()
      });
    }
  };
  const toggleStatus = (user) => {
    const newStatus = user.status === "enable" ? "disable" : "enable";
    router.patch(route("admin.users.update-status", user.id), { status: newStatus });
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
      router.delete(route("admin.users.destroy", user.id));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "User Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "User Management" }),
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
                placeholder: "Search by name, email or phone...",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass" }),
            "Search"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            ExportCsvButton,
            {
              routeName: "admin.users.export",
              params: { search },
              title: "Export Users",
              description: "Select a signup date range to download users as a CSV file."
            }
          ),
          /* @__PURE__ */ jsxs(PrimaryButton, { onClick: () => openModal(), children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-2" }),
            " Add New User"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "User Details" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Contact" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Signup Source" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: users.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden", children: user.profile_pic ? /* @__PURE__ */ jsx("img", { src: user.profile_pic, alt: user.name, referrerPolicy: "no-referrer", className: "w-full h-full object-cover" }) : user.name.charAt(0) }),
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
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: user.phone || "No phone" })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700", children: user.signup_source || "web" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggleStatus(user),
              className: `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${user.status === "enable" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`,
              children: user.status === "enable" ? "Active" : "Disabled"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.users.show", user.id),
                className: "p-2 hover:bg-sky-50 rounded-lg text-sky-600 transition-colors",
                title: "View Details",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openModal(user),
                className: "p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",
                title: "Edit User",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => deleteUser(user),
                className: "p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors",
                title: "Delete User",
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
              }
            )
          ] }) })
        ] }, user.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 border-top border-gray-100", children: /* @__PURE__ */ jsx(Pagination, { links: users.links }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-800 mb-6", children: editingUser ? "Edit User" : "Add New User" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "name", value: "Full Name" }),
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
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email Address" }),
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
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone", value: "Phone Number" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "phone",
              className: "mt-1 block w-full text-gray-900",
              value: data.phone,
              onChange: (e) => setData("phone", e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.phone, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: editingUser ? "New Password (Leave blank to keep current)" : "Password" }),
          /* @__PURE__ */ jsx(
            TextInput,
            {
              id: "password",
              type: "password",
              className: "mt-1 block w-full text-gray-900",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              required: !editingUser
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InputLabel, { htmlFor: "role", value: "User Role" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-gray-900",
              value: data.role,
              onChange: (e) => setData("role", e.target.value),
              children: roles.length > 0 ? roles.map((role) => /* @__PURE__ */ jsx("option", { value: role, children: role }, role)) : /* @__PURE__ */ jsx("option", { value: defaultRole, children: defaultRole })
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.role, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-3", children: "Admin Verification" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-gray-800", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 text-black focus:ring-black",
                  checked: data.is_email_verified,
                  onChange: (e) => setData("is_email_verified", e.target.checked)
                }
              ),
              "Email verified"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-gray-800", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 text-black focus:ring-black",
                  checked: data.is_individual_verified,
                  onChange: (e) => setData("is_individual_verified", e.target.checked)
                }
              ),
              "Individual verification approved"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-gray-800", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "rounded border-gray-300 text-black focus:ring-black",
                  checked: data.is_corporate_verified,
                  onChange: (e) => setData("is_corporate_verified", e.target.checked)
                }
              ),
              "Corporate verification approved"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: editingUser ? "Update User" : "Create User" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
