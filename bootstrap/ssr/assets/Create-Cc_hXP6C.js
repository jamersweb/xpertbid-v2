import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-1PrU1nIM.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Create({ categories }) {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    subtitle: "",
    description: "",
    image: null,
    slider_category_id: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.sliders.store"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Add New Slider", children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Slider" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(Link, { href: route("admin.sliders.index"), className: "text-sm font-bold text-gray-500 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
        " Back to Sliders"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Slider Title" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all",
                placeholder: "Enter title...",
                value: data.title,
                onChange: (e) => setData("title", e.target.value)
              }
            ),
            errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Category" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all font-medium",
                value: data.slider_category_id,
                onChange: (e) => setData("slider_category_id", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select Category" }),
                  categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                ]
              }
            ),
            errors.slider_category_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.slider_category_id })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Subtitle" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all",
              placeholder: "Enter subtitle...",
              value: data.subtitle,
              onChange: (e) => setData("subtitle", e.target.value)
            }
          ),
          errors.subtitle && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.subtitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Slider Image" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-black transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image text-3xl text-gray-400 mb-2" }),
            /* @__PURE__ */ jsx("input", { type: "file", className: "sr-only", id: "slider-image", onChange: (e) => setData("image", e.target.files[0]) }),
            /* @__PURE__ */ jsx("label", { htmlFor: "slider-image", className: "relative cursor-pointer bg-white rounded-md font-bold text-black hover:text-gray-700", children: /* @__PURE__ */ jsx("span", { children: "Upload a file" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Wide aspect ratio recommended (1920x600)" })
          ] }) }),
          data.image && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-emerald-600 font-bold flex items-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check mr-1" }),
            " ",
            data.image.name,
            " selected"
          ] }),
          errors.image && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.image })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all min-h-[100px]",
              placeholder: "Enter short description...",
              value: data.description,
              onChange: (e) => setData("description", e.target.value)
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.description })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50",
            children: processing ? "Creating..." : "Create Slider"
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
