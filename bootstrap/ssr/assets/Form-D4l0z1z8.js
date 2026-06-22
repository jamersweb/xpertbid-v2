import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Form({ title, heading, seo = null, submitLabel, submitRoute, submitMethod = "post" }) {
  const { data, setData, post, put, processing, errors } = useForm({
    slug: seo?.slug || "",
    meta_title: seo?.meta_title || "",
    meta_description: seo?.meta_description || "",
    meta_keywords: seo?.meta_keywords || "",
    schema_markup: seo?.schema_markup || "",
    canonical_url: seo?.canonical_url || ""
  });
  const submit = (e) => {
    e.preventDefault();
    const options = {
      preserveScroll: true
    };
    if (submitMethod === "put") {
      put(submitRoute, options);
      return;
    }
    post(submitRoute, options);
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title, children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(Link, { href: route("admin.seo.index"), className: "text-sm font-bold text-gray-500 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
        " Back to SEO Records"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-8", children: heading }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "slug", value: "Slug / Page Path" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "slug",
                className: "mt-1 block w-full text-gray-900 placeholder:text-gray-400",
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
                className: "mt-1 block w-full text-gray-900 placeholder:text-gray-400",
                value: data.meta_title,
                onChange: (e) => setData("meta_title", e.target.value),
                placeholder: "Enter meta title"
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
                className: "mt-1 block w-full border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                value: data.meta_description,
                onChange: (e) => setData("meta_description", e.target.value),
                rows: "4",
                placeholder: "Enter meta description"
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
                className: "mt-1 block w-full text-gray-900 placeholder:text-gray-400",
                value: data.meta_keywords,
                onChange: (e) => setData("meta_keywords", e.target.value),
                placeholder: "keyword1, keyword2, keyword3"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.meta_keywords, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "canonical_url", value: "Canonical URL" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "canonical_url",
                className: "mt-1 block w-full text-gray-900 placeholder:text-gray-400",
                value: data.canonical_url,
                onChange: (e) => setData("canonical_url", e.target.value),
                placeholder: "https://example.com/page"
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
                className: "mt-1 block w-full border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-mono text-sm",
                value: data.schema_markup,
                onChange: (e) => setData("schema_markup", e.target.value),
                rows: "8",
                placeholder: '{"@context":"https://schema.org"}'
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.schema_markup, className: "mt-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center justify-end gap-3", children: [
            /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: () => window.history.back(), children: "Cancel" }),
            /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Saving..." : submitLabel })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Form as default
};
