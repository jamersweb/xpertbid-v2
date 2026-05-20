import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-CHif9vZp.js";
import { useForm, Head } from "@inertiajs/react";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ settings }) {
  const [editing, setEditing] = useState(null);
  const { data, setData, post, reset, processing, errors } = useForm({
    title: "",
    key: "",
    description: "",
    image: null
  });
  const editSetting = (setting) => {
    setEditing(setting.id);
    setData({
      title: setting.title || "",
      key: setting.key || "",
      description: setting.description || "",
      image: null
    });
  };
  const submit = (e) => {
    e.preventDefault();
    if (editing) {
      post(route("admin.master-settings.update", editing), {
        forceFormData: true,
        onSuccess: () => {
          setEditing(null);
          reset();
        }
      });
    } else {
      post(route("admin.master-settings.store"), {
        onSuccess: () => reset()
      });
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "General Settings", children: [
    /* @__PURE__ */ jsx(Head, { title: "General Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 flex items-center justify-between", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Master Settings" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Title / Key" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Value / Image" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: settings.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-800", children: item.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-mono tracking-tighter uppercase", children: item.key })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: item.image ? /* @__PURE__ */ jsx("img", { src: item.image, className: "h-8 rounded border", alt: "" }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 line-clamp-1", children: item.description }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => editSetting(item), className: "p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square" }) }) })
          ] }, item.id)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider", children: editing ? "Edit Setting" : "Create New Setting" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-1", children: "Title" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm",
                placeholder: "Site Logo, Helpline...",
                value: data.title,
                onChange: (e) => setData("title", e.target.value)
              }
            ),
            errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-rose-500", children: errors.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-1", children: "Key" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm font-mono",
                placeholder: "site_logo, phone_number...",
                value: data.key,
                onChange: (e) => setData("key", e.target.value)
              }
            ),
            errors.key && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-rose-500", children: errors.key })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-1", children: "Value (Text)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "w-full px-4 py-2 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl text-sm min-h-[80px]",
                placeholder: "Setting value or description...",
                value: data.description,
                onChange: (e) => setData("description", e.target.value)
              }
            ),
            errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-rose-500", children: errors.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-gray-400 uppercase mb-1", children: "Upload File (Optional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                className: "w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800",
                onChange: (e) => setData("image", e.target.files[0])
              }
            ),
            errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-rose-500", children: errors.image })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2 flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: processing, className: "flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50", children: processing ? "Saving..." : editing ? "Update Setting" : "Create Setting" }),
            editing && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
              setEditing(null);
              reset();
            }, className: "px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors", children: "Cancel" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
