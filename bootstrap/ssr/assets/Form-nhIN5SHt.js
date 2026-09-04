import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useMemo } from "react";
import { A as AdminLayout } from "./AdminLayout-eq3vmVvI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import ReactQuill from "react-quill";
/* empty css                    */
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function Form({ category, categories = [], mode = "create" }) {
  const imageInputRef = useRef(null);
  const iconInputRef = useRef(null);
  const imageInputId = "category-image-input";
  const iconInputId = "category-icon-input";
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const isEditing = mode === "edit" && Boolean(category);
  const { data, setData, post, processing, errors, reset } = useForm({
    _method: isEditing ? "PUT" : "POST",
    name: category?.name || "",
    parent_id: category?.parent_id || "",
    sub_category_id: category?.sub_category_id || "",
    slug: category?.slug || "",
    image: null,
    icon: null,
    meta_title: category?.meta_title || "",
    meta_description: category?.meta_description || "",
    seo_content: category?.seo_content || "",
    seo_short_content: category?.seo_short_content || "",
    schema_markup: category?.schema_markup || ""
  });
  useEffect(() => {
    if (!data.image) {
      setImagePreview(null);
      return void 0;
    }
    const previewUrl = URL.createObjectURL(data.image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [data.image]);
  useEffect(() => {
    if (!data.icon) {
      setIconPreview(null);
      return void 0;
    }
    const previewUrl = URL.createObjectURL(data.icon);
    setIconPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [data.icon]);
  const currentImageUrl = useMemo(() => {
    if (!isEditing || !category?.image) {
      return null;
    }
    return category.image.startsWith("http") ? category.image : `/${String(category.image).replace(/^\/+/, "")}`;
  }, [category, isEditing]);
  const currentIconUrl = useMemo(() => {
    if (!isEditing || !category?.icon) {
      return null;
    }
    return category.icon.startsWith("http") ? category.icon : `/${String(category.icon).replace(/^\/+/, "")}`;
  }, [category, isEditing]);
  const selectedParent = categories.find((item) => String(item.id) === String(data.parent_id));
  const subCategories = selectedParent?.subCategories || selectedParent?.sub_categories || [];
  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setData("image", file);
  };
  const handleIconChange = (event) => {
    const file = event.target.files?.[0] || null;
    setData("icon", file);
  };
  const clearImageSelection = () => {
    setData("image", null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  const clearIconSelection = () => {
    setData("icon", null);
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
  };
  const submit = (e) => {
    e.preventDefault();
    if (isEditing) {
      post(route("admin.categories.update", category.id));
      return;
    }
    post(route("admin.categories.store"));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEditing ? "Edit Category" : "New Category", children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? "Edit Category" : "New Category" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Link, { href: route("admin.categories.index"), className: "inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left mr-2" }),
            " Back to Categories"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-black tracking-tight text-gray-900", children: isEditing ? "Edit Category" : "Create Category" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Manage category basics, SEO content and schema from one polished form." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg shadow-black/10", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-layer-group text-xs" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-[0.15em]", children: "Category Studio" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: submit, className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.25fr_0.75fr]", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pen-to-square text-sm" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Category Basics" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-gray-400", children: "Core fields used across the admin and marketplace." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Category Name", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    className: "w-full text-gray-900 font-bold",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    required: true,
                    placeholder: "e.g. Vehicles"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "SEO Slug (URL)", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    className: "w-full text-gray-900",
                    value: data.slug,
                    onChange: (e) => setData("slug", e.target.value),
                    placeholder: "auto-generated-slug"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.slug, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Parent Level", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full rounded-2xl border-gray-200 bg-white py-3 text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5",
                    value: data.parent_id,
                    onChange: (e) => {
                      setData("parent_id", e.target.value);
                      setData("sub_category_id", "");
                    },
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Top-Level Category" }),
                      categories.map((item) => /* @__PURE__ */ jsx("option", { value: item.id, children: item.name }, item.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Sub-Category Level", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full rounded-2xl border-gray-200 bg-white py-3 text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5 disabled:bg-gray-50 disabled:text-gray-400",
                    value: data.sub_category_id,
                    onChange: (e) => setData("sub_category_id", e.target.value),
                    disabled: !data.parent_id,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Root of Sub-Category" }),
                      subCategories.map((item) => /* @__PURE__ */ jsx("option", { value: item.id, children: item.name }, item.id))
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-image text-sm" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Media" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-gray-400", children: "Upload category image and icon for cards and listings." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Category Image", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/40 p-4", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: imageInputId,
                      ref: imageInputRef,
                      type: "file",
                      accept: ".jpeg,.jpg,.png,.gif,image/jpeg,image/png,image/gif",
                      className: "hidden",
                      onChange: handleImageChange
                    }
                  ),
                  /* @__PURE__ */ jsxs("label", { htmlFor: imageInputId, className: "flex cursor-pointer items-center gap-3 rounded-[1.25rem] bg-white px-4 py-4 shadow-sm transition hover:shadow-md", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cloud-arrow-up" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: "Upload image" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG or GIF up to 2MB" })
                    ] })
                  ] }),
                  data.image && /* @__PURE__ */ jsxs("div", { className: "mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white", children: [
                    /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Selected preview", className: "h-40 w-full object-cover" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-bold text-emerald-700", children: data.image.name }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: clearImageSelection, className: "text-xs font-black uppercase tracking-widest text-rose-600", children: "Remove" })
                    ] })
                  ] }),
                  !data.image && currentImageUrl && /* @__PURE__ */ jsxs("div", { className: "mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white", children: [
                    /* @__PURE__ */ jsx("img", { src: currentImageUrl, alt: "Current category", className: "h-40 w-full object-cover" }),
                    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-xs font-bold text-gray-500", children: "Current image" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: errors.image, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Category Icon", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/40 p-4", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: iconInputId,
                      ref: iconInputRef,
                      type: "file",
                      accept: ".jpeg,.jpg,.png,.svg,image/jpeg,image/png,image/svg+xml",
                      className: "hidden",
                      onChange: handleIconChange
                    }
                  ),
                  /* @__PURE__ */ jsxs("label", { htmlFor: iconInputId, className: "flex cursor-pointer items-center gap-3 rounded-[1.25rem] bg-white px-4 py-4 shadow-sm transition hover:shadow-md", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-icons" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: "Upload icon" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG, JPEG or SVG up to 2MB" })
                    ] })
                  ] }),
                  data.icon && /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("img", { src: iconPreview, alt: "Selected icon preview", className: "h-16 w-16 rounded-2xl object-contain border border-gray-100 bg-gray-50 p-2" }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-bold text-emerald-700", children: data.icon.name }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: clearIconSelection, className: "mt-2 text-xs font-black uppercase tracking-widest text-rose-600", children: "Remove" })
                    ] })
                  ] }) }),
                  !data.icon && currentIconUrl && /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("img", { src: currentIconUrl, alt: "Current icon", className: "h-16 w-16 rounded-2xl object-contain border border-gray-100 bg-gray-50 p-2" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-gray-500", children: "Current icon" })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: errors.icon, className: "mt-2" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-earth-americas text-sm" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "SEO & Schema" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-gray-400", children: "Search content and structured data for the category page." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Meta Title", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    className: "w-full text-gray-900 font-bold",
                    value: data.meta_title,
                    onChange: (e) => setData("meta_title", e.target.value),
                    placeholder: "Category meta title"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.meta_title, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Meta Description", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full min-h-[120px] rounded-2xl border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5",
                    value: data.meta_description,
                    onChange: (e) => setData("meta_description", e.target.value),
                    placeholder: "Short description for search results"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.meta_description, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "SEO Short Content", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "admin-category-quill", children: /* @__PURE__ */ jsx(
                  ReactQuill,
                  {
                    theme: "snow",
                    value: data.seo_short_content,
                    onChange: (value) => setData("seo_short_content", value),
                    placeholder: "Short SEO copy..."
                  }
                ) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.seo_short_content, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "SEO Content", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx("div", { className: "admin-category-quill", children: /* @__PURE__ */ jsx(
                  ReactQuill,
                  {
                    theme: "snow",
                    value: data.seo_content,
                    onChange: (value) => setData("seo_content", value),
                    placeholder: "Long SEO content..."
                  }
                ) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.seo_content, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Schema Markup (JSON-LD)", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full min-h-[180px] rounded-3xl border-gray-200 bg-white px-4 py-4 font-mono text-xs text-gray-900 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5",
                    value: data.schema_markup,
                    onChange: (e) => setData("schema_markup", e.target.value),
                    placeholder: '{"@context":"https://schema.org","@type":"CollectionPage"}'
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.schema_markup, className: "mt-2" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-gradient-to-br from-black to-gray-800 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:p-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-tight", children: "Ready to publish?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-white/70", children: "Save the category once the media, SEO and schema are in place." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => window.history.back(),
                  className: "rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/20",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-gray-100 disabled:opacity-50",
                  children: processing ? "Saving..." : isEditing ? "Update Category" : "Create Category"
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .admin-category-quill .ql-toolbar.ql-snow {
                                   border: none;
                                   border-bottom: 1px solid rgb(243 244 246);
                                   padding: 1rem 1.25rem;
                                   background: rgb(249 250 251);
                                   border-radius: 24px 24px 0 0;
                            }

                            .admin-category-quill .ql-container.ql-snow {
                                   border: none;
                                   padding: 0.75rem 0.75rem;
                                   background: #fff;
                                   min-height: 220px;
                                   font-size: 15px;
                                   font-family: inherit;
                                   border-radius: 0 0 24px 24px;
                            }

                            .admin-category-quill .ql-editor {
                                   min-height: 220px;
                                   color: #111827;
                                   line-height: 1.8;
                            }

                            .admin-category-quill .ql-editor.ql-blank::before {
                                   color: #d1d5db;
                                   font-style: normal;
                                   left: 18px;
                                   font-weight: 500;
                            }

                            .admin-category-quill {
                                   border: 2px solid transparent;
                                   background: rgb(249 250 251);
                                   border-radius: 28px;
                                   overflow: hidden;
                                   transition: all 0.3s ease;
                            }
                     ` })
  ] });
}
export {
  Form as default
};
