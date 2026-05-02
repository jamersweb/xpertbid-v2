import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-C2LKEM9N.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Index({ languages = [] }) {
  const [showForm, setShowForm] = useState(false);
  const { data, setData, post, processing, reset, errors } = useForm({
    code: "",
    name: "",
    native_name: "",
    direction: "ltr",
    is_active: true
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.languages.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setShowForm(false);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Languages", children: [
    /* @__PURE__ */ jsx(Head, { title: "Languages" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-bottom border-gray-100 d-flex align-items-center justify-content-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800 mb-1", children: "Languages" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-0", children: "Manage site languages and edit static translation content from the admin panel." })
        ] }),
        /* @__PURE__ */ jsxs(PrimaryButton, { type: "button", onClick: () => setShowForm((value) => !value), children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-2" }),
          "Add Language"
        ] })
      ] }),
      showForm && /* @__PURE__ */ jsx("div", { className: "p-6 border-bottom border-gray-100 bg-gray-50", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "row g-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-md-2", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-dark", children: "Code" }),
          /* @__PURE__ */ jsx("input", { className: "form-control", value: data.code, onChange: (e) => setData("code", e.target.value), placeholder: "fr" }),
          errors.code && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.code })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-md-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-dark", children: "Name" }),
          /* @__PURE__ */ jsx("input", { className: "form-control", value: data.name, onChange: (e) => setData("name", e.target.value), placeholder: "French" }),
          errors.name && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-md-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-dark", children: "Native Name" }),
          /* @__PURE__ */ jsx("input", { className: "form-control", value: data.native_name, onChange: (e) => setData("native_name", e.target.value), placeholder: "Francais" }),
          errors.native_name && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.native_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-md-2", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-semibold text-dark", children: "Direction" }),
          /* @__PURE__ */ jsxs("select", { className: "form-select", value: data.direction, onChange: (e) => setData("direction", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "ltr", children: "LTR" }),
            /* @__PURE__ */ jsx("option", { value: "rtl", children: "RTL" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-md-2 d-flex align-items-end", children: /* @__PURE__ */ jsxs("div", { className: "form-check", children: [
          /* @__PURE__ */ jsx("input", { id: "is_active", type: "checkbox", className: "form-check-input", checked: data.is_active, onChange: (e) => setData("is_active", e.target.checked) }),
          /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "form-check-label", children: "Active" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "col-12 d-flex justify-content-end gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "btn btn-light", onClick: () => setShowForm(false), children: "Cancel" }),
          /* @__PURE__ */ jsx(PrimaryButton, { type: "submit", disabled: processing, children: processing ? "Saving..." : "Save Language" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "table-responsive", children: /* @__PURE__ */ jsxs("table", { className: "table align-middle mb-0", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-light", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Language" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Code" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Direction" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-end", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: languages.map((language) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "fw-bold text-dark", children: language.name }),
            /* @__PURE__ */ jsx("div", { className: "text-muted small", children: language.native_name })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "badge bg-light text-dark text-uppercase", children: language.code }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-uppercase", children: language.direction }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `btn btn-sm ${language.is_active ? "btn-success" : "btn-outline-secondary"}`,
              disabled: language.is_default,
              onClick: () => router.patch(route("admin.languages.toggle-status", language.id)),
              children: language.is_default ? "Default" : language.is_active ? "Active" : "Inactive"
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-end", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-dark btn-sm",
              onClick: () => router.visit(route("admin.languages.edit", language.id)),
              children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-language me-2" }),
                "Manage Translations"
              ]
            }
          ) })
        ] }, language.id)) })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
