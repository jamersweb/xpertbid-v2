import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { useRef, useMemo, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { T as TextInput } from "./TextInput-DDsS-qQQ.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
/* empty css                    */
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
function toArray(value) {
  return Array.isArray(value) ? value : [];
}
function categoryChildren(category) {
  return toArray(category?.subCategories || category?.sub_categories);
}
function childChildren(subCategory) {
  return toArray(subCategory?.childCategories || subCategory?.child_categories);
}
function SearchableSelect({ value, options = [], placeholder = "Search...", onChange, disabled = false }) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value]
  );
  useEffect(() => {
    setQuery(selectedOption?.label || "");
  }, [selectedOption]);
  useEffect(() => {
    const onClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery(selectedOption?.label || "");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [selectedOption]);
  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(keyword));
  }, [options, query]);
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: query,
        onChange: (event) => {
          setQuery(event.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        placeholder,
        disabled,
        className: `w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 ${disabled ? "cursor-not-allowed bg-gray-50" : ""}`
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        tabIndex: -1,
        onClick: () => !disabled && setOpen((prev) => !prev),
        className: "absolute inset-y-0 right-3 flex items-center text-gray-400",
        children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${open ? "fa-chevron-up" : "fa-chevron-down"}` })
      }
    ),
    open && !disabled && /* @__PURE__ */ jsx("div", { className: "absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg", children: filteredOptions.length > 0 ? filteredOptions.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          onChange(option.value);
          setQuery(option.label);
          setOpen(false);
        },
        className: "w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50",
        children: option.label
      },
      option.value
    )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-gray-400", children: "No results found" }) })
  ] });
}
function OlxScraper({ users = [], categories = [], preview = null, error = null, status = null, url = "" }) {
  const previewSyncRef = useRef("");
  const previewForm = useForm({
    url: url || ""
  });
  const saveForm = useForm({
    url: url || "",
    user_id: "",
    category_id: "",
    sub_category_id: "",
    child_category_id: "",
    listing_type: "auction",
    title: preview?.title || "",
    description: preview?.description || "",
    price: preview?.price || "",
    minimum_bid: preview?.minimum_bid || preview?.price || "",
    reserve_price: preview?.reserve_price || preview?.price || "",
    stock: "",
    start_date: "",
    end_date: ""
  });
  const { data: saveData, setData: setSaveData } = saveForm;
  const { data: previewData } = previewForm;
  const selectedCategory = useMemo(
    () => categories.find((item) => String(item.id) === String(saveForm.data.category_id)),
    [categories, saveForm.data.category_id]
  );
  const selectedSubCategory = useMemo(
    () => categoryChildren(selectedCategory).find((item) => String(item.id) === String(saveForm.data.sub_category_id)),
    [selectedCategory, saveForm.data.sub_category_id]
  );
  const userOptions = useMemo(
    () => users.map((user) => ({ value: user.id, label: `${user.name} ${user.email ? `(${user.email})` : ""}`.trim() })),
    [users]
  );
  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories]
  );
  const isAuctionType = ["auction", "live_auction"].includes(String(saveForm.data.listing_type || "").toLowerCase());
  const isBusinessType = String(saveForm.data.listing_type || "").toLowerCase() === "business";
  const isNormalType = String(saveForm.data.listing_type || "").toLowerCase() === "normal";
  const subCategories = categoryChildren(selectedCategory);
  const childCategories = childChildren(selectedSubCategory);
  useEffect(() => {
    if (!preview?.source_url) {
      return;
    }
    if (previewSyncRef.current === preview.source_url) {
      return;
    }
    previewSyncRef.current = preview.source_url;
    setSaveData("url", preview.source_url || saveData.url);
    setSaveData("title", preview.title || "");
    setSaveData("description", preview.description || "");
    setSaveData("minimum_bid", preview.minimum_bid || preview.price || "");
    setSaveData("reserve_price", preview.reserve_price || preview.price || "");
  }, [preview, saveData.url, setSaveData]);
  useEffect(() => {
    if (!preview) {
      return;
    }
    if (isAuctionType) {
      if (!saveForm.data.minimum_bid) {
        saveForm.setData("minimum_bid", preview.minimum_bid || preview.price || "");
      }
      if (!saveForm.data.reserve_price) {
        saveForm.setData("reserve_price", preview.reserve_price || preview.price || "");
      }
    }
    if (isNormalType || isBusinessType) {
      if (!saveForm.data.price) {
        saveForm.setData("price", preview.price || preview.minimum_bid || "");
      }
    }
  }, [preview, isAuctionType, isNormalType, isBusinessType, saveForm.data.minimum_bid, saveForm.data.reserve_price, saveForm.data.price]);
  const updateUrl = (value) => {
    previewForm.setData("url", value);
    saveForm.setData("url", value);
  };
  const handleListingTypeChange = (value) => {
    saveForm.setData("listing_type", value);
    const normalized = String(value || "").toLowerCase();
    if (normalized === "auction" || normalized === "live_auction") {
      saveForm.setData("minimum_bid", preview?.minimum_bid || preview?.price || saveForm.data.minimum_bid || "");
      saveForm.setData("reserve_price", preview?.reserve_price || preview?.price || saveForm.data.reserve_price || "");
      saveForm.setData("price", "");
      saveForm.setData("stock", "");
      saveForm.setData("start_date", "");
      saveForm.setData("end_date", "");
      return;
    }
    if (normalized === "business") {
      saveForm.setData("price", preview?.price || preview?.minimum_bid || saveForm.data.price || "");
      saveForm.setData("minimum_bid", "");
      saveForm.setData("reserve_price", "");
      saveForm.setData("start_date", "");
      saveForm.setData("end_date", "");
      return;
    }
    saveForm.setData("price", preview?.price || preview?.minimum_bid || saveForm.data.price || "");
    saveForm.setData("minimum_bid", "");
    saveForm.setData("reserve_price", "");
    saveForm.setData("stock", "");
    saveForm.setData("start_date", "");
    saveForm.setData("end_date", "");
  };
  const submitPreview = (event) => {
    event.preventDefault();
    previewForm.post(route("admin.olx-scraper.preview"), {
      preserveScroll: true
    });
  };
  const submitSave = (event) => {
    event.preventDefault();
    saveForm.post(route("admin.olx-scraper.save"), {
      preserveScroll: true
    });
  };
  const imageList = toArray(preview?.images);
  const previewImageList = toArray(preview?.preview_images).length > 0 ? toArray(preview?.preview_images) : imageList;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "OLX Scraper", children: [
    /* @__PURE__ */ jsx(Head, { title: "OLX Scraper" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6 pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Admin Tool" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl font-black tracking-tight text-gray-900", children: "OLX Scraper" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-gray-500", children: "Extract title, description, images and location directly from OLX HTML attributes. Category, seller and publishing details stay manual for the admin." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-lg shadow-black/10", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bolt text-xs" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black uppercase tracking-[0.2em]", children: "HTML Attribute Parser" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submitPreview, className: "mt-6 space-y-3", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "OLX URL", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row", children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                type: "url",
                value: previewData.url,
                onChange: (event) => updateUrl(event.target.value),
                placeholder: "https://www.olx.com.pk/...",
                className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              PrimaryButton,
              {
                type: "submit",
                disabled: previewForm.processing,
                className: "rounded-2xl bg-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800",
                children: previewForm.processing ? "Scraping..." : "Preview"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(InputError, { message: previewForm.errors.url, className: "mt-2" })
        ] })
      ] }),
      (status || error) && /* @__PURE__ */ jsx("div", { className: `rounded-[1.5rem] border px-5 py-4 shadow-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("i", { className: `fa-solid ${error ? "fa-triangle-exclamation" : "fa-circle-check"} mt-0.5` }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold", children: error ? "Scrape Error" : "Success" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: error || status })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-layer-group text-sm" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Manual Publish" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-gray-400", children: "Choose admin-only metadata before saving the listing." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitSave, className: "space-y-5", children: [
            /* @__PURE__ */ jsx("input", { type: "hidden", value: saveForm.data.url, name: "url" }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Seller/User", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    value: saveForm.data.user_id,
                    options: userOptions,
                    placeholder: "Search user...",
                    onChange: (selectedValue) => saveForm.setData("user_id", selectedValue)
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.user_id, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Listing Type", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: saveForm.data.listing_type,
                    onChange: (event) => handleListingTypeChange(event.target.value),
                    className: "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "auction", children: "Auction" }),
                      /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
                      /* @__PURE__ */ jsx("option", { value: "business", children: "Business" }),
                      /* @__PURE__ */ jsx("option", { value: "live_auction", children: "Live Auction" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-[11px] text-gray-400", children: isAuctionType ? "Auction mode shows starting bid and reserve price." : isBusinessType ? "Business mode shows a price and stock quantity." : "Normal mode shows only a simple price field." })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Category", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    value: saveForm.data.category_id,
                    options: categoryOptions,
                    placeholder: "Search category...",
                    onChange: (selectedValue) => {
                      saveForm.setData("category_id", selectedValue);
                      saveForm.setData("sub_category_id", "");
                      saveForm.setData("child_category_id", "");
                    }
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.category_id, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Sub Category", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: saveForm.data.sub_category_id,
                    onChange: (event) => {
                      saveForm.setData("sub_category_id", event.target.value);
                      saveForm.setData("child_category_id", "");
                    },
                    className: "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 disabled:bg-gray-50",
                    disabled: !selectedCategory,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select sub category" }),
                      subCategories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.sub_category_id, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Child Category", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: saveForm.data.child_category_id,
                    onChange: (event) => saveForm.setData("child_category_id", event.target.value),
                    className: "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10 disabled:bg-gray-50",
                    disabled: !selectedSubCategory,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select child category" }),
                      childCategories.map((category) => /* @__PURE__ */ jsx("option", { value: category.id, children: category.name }, category.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.child_category_id, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Title", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
              /* @__PURE__ */ jsx(
                TextInput,
                {
                  value: saveForm.data.title,
                  onChange: (event) => saveForm.setData("title", event.target.value),
                  className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                  placeholder: "Listing title"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.title, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(InputLabel, { value: "Description", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsx(
                ReactQuill,
                {
                  theme: "snow",
                  value: saveForm.data.description,
                  onChange: (value) => saveForm.setData("description", value),
                  placeholder: "Listing description",
                  className: "admin-olx-quill"
                }
              ) }),
              /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.description, className: "mt-2" })
            ] }),
            isAuctionType ? /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Minimum Bid", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: saveForm.data.minimum_bid,
                    onChange: (event) => saveForm.setData("minimum_bid", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                    placeholder: "0"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.minimum_bid, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Reserve Price", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: saveForm.data.reserve_price,
                    onChange: (event) => saveForm.setData("reserve_price", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                    placeholder: "0"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.reserve_price, className: "mt-2" })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Price", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: saveForm.data.price || "",
                    onChange: (event) => saveForm.setData("price", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                    placeholder: "0"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.price, className: "mt-2" })
              ] }),
              isBusinessType && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Stock", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "number",
                    step: "1",
                    min: "0",
                    value: saveForm.data.stock || "",
                    onChange: (event) => saveForm.setData("stock", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10",
                    placeholder: "0"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.stock, className: "mt-2" })
              ] })
            ] }),
            isAuctionType && /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "Start Date", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "datetime-local",
                    value: saveForm.data.start_date || "",
                    onChange: (event) => saveForm.setData("start_date", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.start_date, className: "mt-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(InputLabel, { value: "End Date", className: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" }),
                /* @__PURE__ */ jsx(
                  TextInput,
                  {
                    type: "datetime-local",
                    value: saveForm.data.end_date || "",
                    onChange: (event) => saveForm.setData("end_date", event.target.value),
                    className: "w-full rounded-2xl border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-black/10"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: saveForm.errors.end_date, className: "mt-2" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                PrimaryButton,
                {
                  type: "submit",
                  disabled: saveForm.processing,
                  className: "rounded-2xl bg-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-gray-800",
                  children: saveForm.processing ? "Saving..." : "Save Listing"
                }
              ),
              /* @__PURE__ */ jsx(
                SecondaryButton,
                {
                  type: "button",
                  className: "rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50",
                  onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  children: "Back to URL"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-wand-magic-sparkles text-sm" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Scraped Preview" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-gray-400", children: "Loaded from OLX HTML attributes and meta tags." })
              ] })
            ] }),
            preview ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Title" }),
                /* @__PURE__ */ jsx("h3", { className: "mt-2 text-lg font-black text-gray-900", children: preview.title || "No title found" }),
                preview.location_text && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: preview.location_text })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-[1.25rem] border border-gray-100 bg-white p-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Price" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-black text-gray-900", children: preview.price ? `PKR ${preview.price}` : "Not found" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-[1.25rem] border border-gray-100 bg-white p-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Source" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 break-all text-sm font-semibold text-gray-700", children: preview.source_domain || "OLX" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-gray-100 bg-white p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Description" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-line text-sm leading-7 text-gray-600", children: preview.description || "No description found" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-gray-100 bg-white p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-gray-400", children: "Images" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-gray-500", children: imageList.length })
                ] }),
                previewImageList.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-3", children: previewImageList.map((imageUrl, index) => /* @__PURE__ */ jsx("a", { href: imageUrl, target: "_blank", rel: "noreferrer", className: "group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: `OLX ${index + 1}`,
                    className: "h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                  }
                ) }, `${imageUrl}-${index}`)) }) : /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No images found in the page HTML." })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 p-8 text-center", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-regular fa-image text-3xl text-gray-300" }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm font-semibold text-gray-500", children: "Paste an OLX listing URL and click Preview to extract data." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-8", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-black uppercase tracking-widest text-gray-900", children: "Debug" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] font-medium text-gray-400", children: "Useful only if extraction fails." }),
            /* @__PURE__ */ jsx("pre", { className: "mt-4 max-h-[320px] overflow-auto rounded-2xl bg-gray-950 p-4 text-[11px] leading-6 text-gray-100", children: error || "No scraper error." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                                  .admin-olx-quill .ql-toolbar.ql-snow {
                                         border: 0;
                                         border-bottom: 1px solid rgb(229 231 235);
                                  }

                                  .admin-olx-quill .ql-container.ql-snow {
                                         border: 0;
                                         min-height: 180px;
                                  }

                                  .admin-olx-quill .ql-editor {
                                         min-height: 180px;
                                         color: rgb(17 24 39);
                                  }

                                  .admin-olx-quill .ql-editor.ql-blank::before {
                                         color: rgb(156 163 175);
                                         font-style: normal;
                                  }
                           ` })
    ] })
  ] });
}
export {
  OlxScraper as default
};
