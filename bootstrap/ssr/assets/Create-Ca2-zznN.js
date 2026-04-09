import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { A as AdminLayout } from "./AdminLayout-CCDzOvsD.js";
import { useForm, Head, Link } from "@inertiajs/react";
import ReactQuill from "react-quill";
/* empty css                    */
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    content: "",
    image: null,
    meta_title: "",
    meta_description: "",
    schema_markup: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.blogs.store"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Create New Blog", children: [
    /* @__PURE__ */ jsx(Head, { title: "Create Blog" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(Link, { href: route("admin.blogs.index"), className: "text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
          " Back to Blogs"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-gray-300", children: "Blog Editor v2.0" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3", children: "Blog Title" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "w-full px-6 py-4 bg-gray-50 border-none focus:ring-4 focus:ring-black/5 focus:bg-white rounded-2xl transition-all text-gray-900 font-bold text-lg placeholder:text-gray-300",
                  placeholder: "Enter blog title...",
                  value: data.title,
                  onChange: (e) => setData("title", e.target.value)
                }
              ),
              errors.title && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3", children: "Featured Image" }),
              /* @__PURE__ */ jsx("div", { className: "relative group", children: /* @__PURE__ */ jsxs("div", { className: "mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-100 border-dashed rounded-3xl hover:border-black hover:bg-gray-50/50 transition-all cursor-pointer relative overflow-hidden", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    className: "absolute inset-0 opacity-0 cursor-pointer z-10",
                    onChange: (e) => setData("image", e.target.files[0])
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image text-2xl text-gray-300 group-hover:text-black transition-colors" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex text-sm text-gray-600 justify-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "relative font-black text-black", children: "Upload a file" }),
                    /* @__PURE__ */ jsx("p", { className: "pl-1 text-gray-400", children: "or drag and drop" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-300 font-bold uppercase tracking-wider", children: "PNG, JPG, GIF up to 2MB" })
                ] })
              ] }) }),
              data.image && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-check" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-emerald-900 truncate max-w-xs", children: data.image.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-600 font-bold uppercase tracking-tight", children: "File selected" })
                ] })
              ] }),
              errors.image && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.image })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3", children: "Main Content" }),
              /* @__PURE__ */ jsx("div", { className: "admin-blog-quill", children: /* @__PURE__ */ jsx(
                ReactQuill,
                {
                  theme: "snow",
                  value: data.content,
                  onChange: (value) => setData("content", value),
                  placeholder: "Write your blog content here..."
                }
              ) }),
              errors.content && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.content })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-100 mx-[-2rem]" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8 bg-gray-50/30 p-8 rounded-3xl border border-gray-50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-earth-americas" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-black text-gray-900 uppercase tracking-tighter", children: "SEO & Structured Data" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1", children: "Meta Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full px-5 py-4 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-2xl transition-all text-gray-900 font-bold placeholder:text-gray-200",
                    placeholder: "Search engine title...",
                    value: data.meta_title,
                    onChange: (e) => setData("meta_title", e.target.value)
                  }
                ),
                errors.meta_title && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.meta_title })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1", children: "Meta Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full px-5 py-4 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-2xl transition-all text-gray-900 font-medium placeholder:text-gray-200 min-h-[110px]",
                    placeholder: "Short summary for search results...",
                    value: data.meta_description,
                    onChange: (e) => setData("meta_description", e.target.value)
                  }
                ),
                errors.meta_description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.meta_description })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1", children: "Schema Markup (JSON-LD)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full px-5 py-5 bg-white border border-gray-100 focus:ring-4 focus:ring-black/5 rounded-3xl transition-all text-gray-900 font-mono text-xs placeholder:text-gray-200 min-h-[150px]",
                    placeholder: '{"@context": "https://schema.org", "@type": "BlogPosting", ...}',
                    value: data.schema_markup,
                    onChange: (e) => setData("schema_markup", e.target.value)
                  }
                ),
                errors.schema_markup && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-500 font-bold", children: errors.schema_markup }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-[10px] text-gray-400 font-bold italic px-1", children: "* Use JSON format for structured data to improve Google ranking." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-gray-800 transition-all shadow-xl shadow-black/20 hover:shadow-black/10 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 text-xs flex items-center gap-3",
            children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-notch fa-spin text-[10px]" }),
              "Publishing..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Publish Blog Post",
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-paper-plane text-[9px]" })
            ] })
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                             .admin-blog-quill .ql-toolbar.ql-snow {
                                    border: none;
                                    border-bottom: 1px solid rgb(243 244 246);
                                    padding: 1.5rem 1.5rem;
                                    background: rgb(249 250 251);
                                    border-radius: 24px 24px 0 0;
                             }

                             .admin-blog-quill .ql-container.ql-snow {
                                    border: none;
                                    padding: 1rem 1rem;
                                    background: #fff;
                                    min-height: 400px;
                                    font-size: 16px;
                                    font-family: inherit;
                                    border-radius: 0 0 24px 24px;
                             }

                             .admin-blog-quill .ql-editor {
                                    min-height: 400px;
                                    color: #111827;
                                    line-height: 1.8;
                             }

                             .admin-blog-quill .ql-editor.ql-blank::before {
                                    color: #d1d5db;
                                    font-style: normal;
                                    left: 24px;
                                    font-weight: 500;
                             }
                             
                             .admin-blog-quill {
                                    border: 2px solid transparent;
                                    background: rgb(249 250 251);
                                    border-radius: 32px;
                                    overflow: hidden;
                                    transition: all 0.3s ease;
                             }

                             .admin-blog-quill:focus-within {
                                    border-color: rgba(0,0,0,0.05);
                                    background: #fff;
                                    box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
                             }
                      ` })
  ] });
}
export {
  Create as default
};
