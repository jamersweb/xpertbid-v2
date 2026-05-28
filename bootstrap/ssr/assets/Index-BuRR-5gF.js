import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CZrc0vs-.js";
import { useForm, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ roles, permissions }) {
  const [editing, setEditing] = useState(null);
  const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
    name: "",
    permissions: []
  });
  const handleEdit = (role) => {
    setEditing(role.id);
    setData({
      name: role.name,
      permissions: role.permissions.map((p) => p.name)
    });
  };
  const togglePermission = (permName) => {
    const newPerms = data.permissions.includes(permName) ? data.permissions.filter((p) => p !== permName) : [...data.permissions, permName];
    setData("permissions", newPerms);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editing) {
      put(route("admin.roles.update", editing), {
        onSuccess: () => {
          setEditing(null);
          reset();
        }
      });
    } else {
      post(route("admin.roles.store"), {
        onSuccess: () => reset()
      });
    }
  };
  const deleteRole = async (roleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This role will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      destroy(route("admin.roles.destroy", roleId));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Roles & Permissions", children: [
    /* @__PURE__ */ jsx(Head, { title: "Roles" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: roles.map((role) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: role.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(role), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-400 group-hover:text-black", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square text-xs" }) }),
            role.name !== "Admin" && /* @__PURE__ */ jsx("button", { onClick: () => deleteRole(role.id), className: "p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash-can text-xs" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          role.permissions.slice(0, 5).map((p) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md", children: p.name }, p.id)),
          role.permissions.length > 5 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-md", children: [
            "+",
            role.permissions.length - 5,
            " more"
          ] })
        ] })
      ] }, role.id)) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider", children: editing ? "Edit Role" : "Create New Role" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-2", children: "Role Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm",
                placeholder: "Editor, Manager...",
                value: data.name,
                onChange: (e) => setData("name", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-4", children: "Permissions" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar", children: permissions.map((perm) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "w-4 h-4 rounded border-gray-300 text-black focus:ring-black",
                  checked: data.permissions.includes(perm.name),
                  onChange: () => togglePermission(perm.name)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-gray-700", children: perm.name })
            ] }, perm.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2 flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "flex-1 py-4 bg-black text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all disabled:opacity-50", children: editing ? "Update Role" : "Create Role" }),
            editing && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
              setEditing(null);
              reset();
            }, className: "px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-200", children: "Cancel" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
