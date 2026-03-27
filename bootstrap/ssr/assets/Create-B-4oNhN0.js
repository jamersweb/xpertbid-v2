import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-DRg1Tysv.js";
import { useForm, Head, Link } from "@inertiajs/react";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    content: "",
    image: null
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.blogs.store"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Create New Blog", children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Blog" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(Link, { href: route("admin.blogs.index"), className: "text-sm font-bold text-gray-500 hover:text-black transition-colors", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
        " Back to Blogs"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Blog Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all",
              placeholder: "Enter blog title...",
              value: data.title,
              onChange: (e) => setData("title", e.target.value)
            }
          ),
          errors.title && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Featured Image" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-black transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-center", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image text-3xl text-gray-400 mb-2" }),
            /* @__PURE__ */ jsxs("div", { className: "flex text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxs("label", { className: "relative cursor-pointer bg-white rounded-md font-bold text-black hover:text-gray-700", children: [
                /* @__PURE__ */ jsx("span", { children: "Upload a file" }),
                /* @__PURE__ */ jsx("input", { type: "file", className: "sr-only", onChange: (e) => setData("image", e.target.files[0]) })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "pl-1", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "PNG, JPG, GIF up to 2MB" })
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
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-gray-700 mb-2", children: "Content" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl transition-all min-h-[300px]",
              placeholder: "Write your blog content here...",
              value: data.content,
              onChange: (e) => setData("content", e.target.value)
            }
          ),
          errors.content && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-rose-500", children: errors.content })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50",
            children: processing ? "Publishing..." : "Publish Blog Post"
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
