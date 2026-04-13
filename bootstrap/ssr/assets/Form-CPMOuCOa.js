import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { A as AdminLayout } from "./AdminLayout-d9CWnUKb.js";
import { useForm, Head, router } from "@inertiajs/react";
import ReactQuill from "react-quill";
/* empty css                    */
import "./CurrencyPicker-BYSFLoir.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black";
const fileInputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold";
function Field({ label, error, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: label }),
    children,
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600", children: error })
  ] });
}
function Form({ listing = null, users = [], categories = [], statuses = [] }) {
  const isEditing = Boolean(listing?.id);
  const initialAlbum = useMemo(() => listing?.album_urls || [], [listing]);
  const rootCategories = categories.filter((item) => !item.parent_id && !item.sub_category_id);
  const subCategories = categories.filter((item) => item.parent_id && !item.sub_category_id);
  const childCategories = categories.filter((item) => item.sub_category_id);
  const { data, setData, processing, errors } = useForm({
    user_id: listing?.user_id || "",
    title: listing?.title || "",
    description: listing?.description || "",
    listing_type: listing?.listing_type || "normal",
    status: listing?.status || "inactive",
    category_id: listing?.category_id || "",
    sub_category_id: listing?.sub_category_id || "",
    child_category_id: listing?.child_category_id || "",
    price: listing?.listing_data?.price ?? listing?.listing_data?.start_price ?? "",
    reserve_price: listing?.listing_data?.reserve_price ?? "",
    start_date: listing?.listing_data?.start_date ?? "",
    end_date: listing?.listing_data?.end_date ?? "",
    stock: listing?.listing_data?.stock ?? "",
    image: null,
    album: [],
    existing_album: initialAlbum
  });
  const [imagePreview, setImagePreview] = useState(listing?.image_url || "");
  const availableSubCategories = subCategories.filter((item) => String(item.parent_id) === String(data.category_id));
  const availableChildCategories = childCategories.filter((item) => String(item.sub_category_id) === String(data.sub_category_id));
  const submit = (e) => {
    e.preventDefault();
    const payload = { ...data, album: Array.from(data.album || []) };
    if (isEditing) {
      router.post(route("admin.listings.update", listing.id), { ...payload, _method: "put" }, { forceFormData: true });
      return;
    }
    router.post(route("admin.listings.store"), payload, { forceFormData: true });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isEditing ? "Edit Listing" : "Create Listing", children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? "Edit Listing" : "Create Listing" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-black text-gray-900", children: isEditing ? "Edit Listing" : "Create Listing" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Admin can create or update any seller listing from here." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => router.get(route("admin.listings.index")),
            className: "px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50",
            children: "Back to Listings"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Seller", error: errors.user_id, children: /* @__PURE__ */ jsxs("select", { className: inputClass, value: data.user_id, onChange: (e) => setData("user_id", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select seller" }),
              users.map((user) => /* @__PURE__ */ jsxs("option", { value: user.id, children: [
                user.name,
                " (",
                user.email,
                ")"
              ] }, user.id))
            ] }) }),
            /* @__PURE__ */ jsx(Field, { label: "Listing Type", error: errors.listing_type, children: /* @__PURE__ */ jsxs("select", { className: inputClass, value: data.listing_type, onChange: (e) => setData("listing_type", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
              /* @__PURE__ */ jsx("option", { value: "auction", children: "Auction" }),
              /* @__PURE__ */ jsx("option", { value: "business", children: "Business" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Status", error: errors.status, children: /* @__PURE__ */ jsx("select", { className: inputClass, value: data.status, onChange: (e) => setData("status", e.target.value), children: statuses.map((status) => /* @__PURE__ */ jsx("option", { value: status, children: status }, status)) }) }),
            /* @__PURE__ */ jsx(Field, { label: "Category", error: errors.category_id, children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: inputClass,
                value: data.category_id,
                onChange: (e) => {
                  setData("category_id", e.target.value);
                  setData("sub_category_id", "");
                  setData("child_category_id", "");
                },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select category" }),
                  rootCategories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Sub Category", error: errors.sub_category_id, children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: inputClass,
                value: data.sub_category_id,
                onChange: (e) => {
                  setData("sub_category_id", e.target.value);
                  setData("child_category_id", "");
                },
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select sub category" }),
                  availableSubCategories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Child Category", error: errors.child_category_id, children: /* @__PURE__ */ jsxs("select", { className: inputClass, value: data.child_category_id, onChange: (e) => setData("child_category_id", e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select child category" }),
              availableChildCategories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Title", error: errors.title, children: /* @__PURE__ */ jsx("input", { className: inputClass, value: data.title, onChange: (e) => setData("title", e.target.value) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Description", error: errors.description, children: /* @__PURE__ */ jsx("div", { className: "admin-listing-quill", children: /* @__PURE__ */ jsx(
            ReactQuill,
            {
              theme: "snow",
              value: data.description,
              onChange: (value) => setData("description", value),
              placeholder: "Provide a detailed description of the listing..."
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: data.listing_type === "auction" ? "Start Price" : "Price", error: errors.price, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.price, onChange: (e) => setData("price", e.target.value) }) }),
            data.listing_type === "auction" ? /* @__PURE__ */ jsx(Field, { label: "Reserve Price", error: errors.reserve_price, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.reserve_price, onChange: (e) => setData("reserve_price", e.target.value) }) }) : /* @__PURE__ */ jsx(Field, { label: "Stock", error: errors.stock, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.stock, onChange: (e) => setData("stock", e.target.value) }) })
          ] }),
          data.listing_type === "auction" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Start Date", error: errors.start_date, children: /* @__PURE__ */ jsx("input", { type: "datetime-local", className: inputClass, value: data.start_date, onChange: (e) => setData("start_date", e.target.value) }) }),
            /* @__PURE__ */ jsx(Field, { label: "End Date", error: errors.end_date, children: /* @__PURE__ */ jsx("input", { type: "datetime-local", className: inputClass, value: data.end_date, onChange: (e) => setData("end_date", e.target.value) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Media" }),
          /* @__PURE__ */ jsx(Field, { label: "Primary Image", error: errors.image, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              className: fileInputClass,
              onChange: (e) => {
                const file = e.target.files?.[0] || null;
                setData("image", file);
                setImagePreview(file ? URL.createObjectURL(file) : listing?.image_url || "");
              }
            }
          ) }),
          imagePreview ? /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Preview", className: "w-full h-48 object-cover rounded-xl border border-gray-100" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-48 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400", children: "No image selected" }),
          /* @__PURE__ */ jsx(Field, { label: "Album Images", error: errors.album, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              multiple: true,
              className: fileInputClass,
              onChange: (e) => setData("album", e.target.files)
            }
          ) }),
          data.existing_album?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "Existing Album" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: data.existing_album.map((url) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "w-full h-20 object-cover rounded-lg border border-gray-100" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setData("existing_album", data.existing_album.filter((item) => item !== url)),
                  className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-rose-600 text-xs shadow",
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
                }
              )
            ] }, url)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full px-4 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-60",
              children: processing ? "Saving..." : isEditing ? "Update Listing" : "Create Listing"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .admin-listing-quill .ql-toolbar.ql-snow {
                                   border: 1px solid rgb(229 231 235);
                                   border-radius: 0.75rem 0.75rem 0 0;
                                   background: white;
                            }

                            .admin-listing-quill .ql-container.ql-snow {
                                   border: 1px solid rgb(229 231 235);
                                   border-top: 0;
                                   border-radius: 0 0 0.75rem 0.75rem;
                                   min-height: 180px;
                                   color: rgb(17 24 39);
                                   background: white;
                            }

                            .admin-listing-quill .ql-editor {
                                   min-height: 180px;
                                   color: rgb(17 24 39);
                            }

                            .admin-listing-quill .ql-editor.ql-blank::before {
                                   color: rgb(156 163 175);
                                   font-style: normal;
                            }
                     ` })
  ] });
}
export {
  Form as default
};
