import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState, useEffect, useRef } from "react";
import { A as AdminLayout } from "./AdminLayout-C1RliH-Q.js";
import { useForm, Head, router } from "@inertiajs/react";
import ReactQuill from "react-quill";
import axios from "axios";
/* empty css                    */
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black";
const fileInputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold";
function Field({ label, error, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: label }),
    children,
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600", children: error })
  ] });
}
function SearchableSelect({
  value,
  options = [],
  placeholder = "Search...",
  onChange,
  disabled = false
}) {
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
    if (!keyword) return options;
    return options.filter((option) => option.label.toLowerCase().includes(keyword));
  }, [options, query]);
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: query,
        onChange: (e) => {
          setQuery(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        placeholder,
        disabled,
        className: `${inputClass} pr-10 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`
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
    open && !disabled && /* @__PURE__ */ jsx("div", { className: "absolute z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto", children: filteredOptions.length > 0 ? filteredOptions.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          onChange(option.value);
          setQuery(option.label);
          setOpen(false);
        },
        className: "w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50",
        children: option.label
      },
      option.value
    )) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-gray-400", children: "No results found" }) })
  ] });
}
function Form({
  listing = null,
  users = [],
  categories = [],
  brands = [],
  statuses = [],
  defaultListingType = "normal",
  backRouteName = "admin.listings.index",
  returnTo = ""
}) {
  const isEditing = Boolean(listing?.id);
  const initialAlbum = useMemo(() => listing?.album_urls || [], [listing]);
  const rootCategories = categories.filter((item) => !item.parent_id && !item.sub_category_id);
  const subCategories = categories.filter((item) => item.parent_id && !item.sub_category_id);
  const childCategories = categories.filter((item) => item.sub_category_id);
  const sellerOptions = useMemo(
    () => users.map((user) => ({ value: user.id, label: `${user.name} (${user.email})` })),
    [users]
  );
  const categoryOptions = useMemo(
    () => rootCategories.map((category) => ({ value: category.id, label: category.name })),
    [rootCategories]
  );
  const { data, setData, processing, errors } = useForm({
    user_id: listing?.user_id || "",
    title: listing?.title || "",
    description: listing?.description || "",
    listing_type: listing?.listing_type || defaultListingType,
    status: listing?.status || "inactive",
    category_id: listing?.category_id || "",
    sub_category_id: listing?.sub_category_id || "",
    child_category_id: listing?.child_category_id || "",
    brand_id: listing?.brand_id || "",
    price: listing?.listing_data?.price ?? listing?.listing_data?.start_price ?? "",
    reserve_price: listing?.listing_data?.reserve_price ?? "",
    start_date: listing?.listing_data?.start_date ?? "",
    end_date: listing?.listing_data?.end_date ?? "",
    stock: listing?.listing_data?.stock ?? "",
    variations: listing?.listing_data?.variations ?? [],
    discount_type: listing?.listing_data?.discount_type ?? "",
    discount_value: listing?.listing_data?.discount_value ?? "",
    category_features: listing?.category_features ?? {},
    image: null,
    album: [],
    existing_album: initialAlbum,
    return_to: returnTo,
    is_1_rupee: Boolean(listing?.is_1_rupee),
    is_autobidder_on: Boolean(listing?.is_autobidder_on)
  });
  const [imagePreview, setImagePreview] = useState(listing?.image_url || "");
  const [imagePreviewIsVideo, setImagePreviewIsVideo] = useState(
    Boolean(listing?.image_url && /\.(mp4|webm|mov)$/i.test(listing.image_url))
  );
  const [dynamicFields, setDynamicFields] = useState([]);
  const isLiveAuction = data.listing_type === "live_auction";
  const availableSubCategories = subCategories.filter((item) => String(item.parent_id) === String(data.category_id));
  const availableChildCategories = childCategories.filter((item) => String(item.sub_category_id) === String(data.sub_category_id));
  const supportsCatalogEnhancements = data.listing_type !== "live_auction";
  const parseFieldOptions = (options) => {
    if (Array.isArray(options)) return options;
    if (typeof options === "string") {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };
  const normalizedFieldName = (field) => {
    const raw = String(field?.field_name || "").trim();
    return raw || `field_${field?.id}`;
  };
  const fieldNameCounts = useMemo(() => {
    return (dynamicFields || []).reduce((acc, field) => {
      const base = normalizedFieldName(field);
      acc[base] = (acc[base] || 0) + 1;
      return acc;
    }, {});
  }, [dynamicFields]);
  const getIdFeatureKey = (field) => `field_${field?.id}`;
  const getFeatureKey = (field) => {
    const base = normalizedFieldName(field);
    const idKey = getIdFeatureKey(field);
    return fieldNameCounts[base] > 1 ? `${base}__${field.id}` : base || idKey;
  };
  const getFeatureValue = (field) => {
    const features = data?.category_features && typeof data.category_features === "object" && !Array.isArray(data.category_features) ? data.category_features : {};
    const idKey = getIdFeatureKey(field);
    const key = getFeatureKey(field);
    const base = normalizedFieldName(field);
    return features[idKey] ?? features[key] ?? features[base] ?? "";
  };
  const updateFeatureValue = (field, value) => {
    const base = normalizedFieldName(field);
    const key = getFeatureKey(field);
    const idKey = getIdFeatureKey(field);
    const isDuplicateFieldName = fieldNameCounts[base] > 1;
    const previousFeatures = data?.category_features && typeof data.category_features === "object" && !Array.isArray(data.category_features) ? data.category_features : {};
    const nextFeatures = {
      ...previousFeatures,
      [idKey]: value,
      [key]: value
    };
    if (!isDuplicateFieldName && base) {
      nextFeatures[base] = value;
    }
    setData("category_features", nextFeatures);
  };
  const addVariation = () => {
    const nextVariations = [...data.variations || [], { name: "", price: "", discount_type: "", discount_value: "" }];
    setData("variations", nextVariations);
  };
  const removeVariation = (index) => {
    const nextVariations = [...data.variations || []];
    nextVariations.splice(index, 1);
    setData("variations", nextVariations);
  };
  const updateVariation = (index, field, value) => {
    const nextVariations = [...data.variations || []];
    nextVariations[index] = {
      ...nextVariations[index] || {},
      [field]: value
    };
    setData("variations", nextVariations);
  };
  const handleListingTypeChange = (value) => {
    setData({
      ...data,
      listing_type: value,
      return_to: value === "live_auction" ? "live_auctions" : "",
      ...value === "live_auction" ? {
        user_id: "",
        start_date: "",
        end_date: "",
        stock: ""
      } : {},
      ...value === "auction" || value === "live_auction" ? {
        variations: [],
        discount_type: "",
        discount_value: ""
      } : {}
    });
  };
  useEffect(() => {
    if (!data.category_id) {
      setDynamicFields([]);
      return;
    }
    const listingTypeForFields = data.listing_type === "live_auction" ? "auction" : data.listing_type;
    axios.get(`/get-dynamic-fields/${data.category_id}/${listingTypeForFields}`).then((res) => {
      if (res.data?.status === "success") {
        setDynamicFields(res.data.data || []);
        return;
      }
      setDynamicFields([]);
    }).catch(() => setDynamicFields([]));
  }, [data.category_id, data.listing_type]);
  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      album: Array.from(data.album || []),
      variations: Array.isArray(data.variations) ? data.variations : []
    };
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
            onClick: () => router.get(route(backRouteName)),
            className: "px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50",
            children: backRouteName === "admin.live-auctions.index" ? "Back to Live Auctions" : "Back to Listings"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: `grid grid-cols-1 ${isLiveAuction ? "" : "md:grid-cols-2"} gap-4`, children: [
            !isLiveAuction && /* @__PURE__ */ jsx(Field, { label: "Seller", error: errors.user_id, children: /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                value: data.user_id,
                options: sellerOptions,
                placeholder: "Search seller...",
                onChange: (selectedValue) => setData("user_id", selectedValue)
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Listing Type", error: errors.listing_type, children: /* @__PURE__ */ jsxs("select", { className: inputClass, value: data.listing_type, onChange: (e) => handleListingTypeChange(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "normal", children: "Normal" }),
              /* @__PURE__ */ jsx("option", { value: "auction", children: "Auction" }),
              /* @__PURE__ */ jsx("option", { value: "business", children: "Business" }),
              /* @__PURE__ */ jsx("option", { value: "live_auction", children: "Live Auction" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Status", error: errors.status, children: /* @__PURE__ */ jsx("select", { className: inputClass, value: data.status, onChange: (e) => setData("status", e.target.value), children: statuses.map((status) => /* @__PURE__ */ jsx("option", { value: status, children: status === "sold_out" ? "Sold Out" : status }, status)) }) }),
            /* @__PURE__ */ jsx(Field, { label: "Category", error: errors.category_id, children: /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                value: data.category_id,
                options: categoryOptions,
                placeholder: "Search category...",
                onChange: (selectedValue) => {
                  setData("category_id", selectedValue);
                  setData("sub_category_id", "");
                  setData("child_category_id", "");
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "h-4 w-4 rounded border-gray-300 text-black focus:ring-black",
                  checked: Boolean(data.is_1_rupee),
                  onChange: (e) => setData("is_1_rupee", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800", children: "Is 1 Rupee Listing" })
            ] }),
            errors.is_1_rupee && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600 mt-2", children: errors.is_1_rupee })
          ] }),
          data.listing_type === "auction" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3", children: [
            /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "h-4 w-4 rounded border-gray-300 text-black focus:ring-black",
                  checked: Boolean(data.is_autobidder_on),
                  onChange: (e) => setData("is_autobidder_on", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800", children: "Auto Bidder On" })
            ] }),
            errors.is_autobidder_on && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600 mt-2", children: errors.is_autobidder_on })
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
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsx(Field, { label: "Brand", error: errors.brand_id, children: /* @__PURE__ */ jsxs("select", { className: inputClass, value: data.brand_id, onChange: (e) => setData("brand_id", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select brand (optional)" }),
            brands.map((brand) => /* @__PURE__ */ jsx("option", { value: brand.id, children: brand.name }, brand.id))
          ] }) }) }),
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
          supportsCatalogEnhancements && /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Discount & Variations" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Add base discount details or create product variations for this listing." })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: addVariation,
                  className: "px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-white",
                  children: "Add Variation"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(Field, { label: "Discount Type", error: errors.discount_type, children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: inputClass,
                  value: data.discount_type,
                  onChange: (e) => setData("discount_type", e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "No discount" }),
                    /* @__PURE__ */ jsx("option", { value: "percent", children: "Percent" }),
                    /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(Field, { label: "Discount Value", error: errors.discount_value, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  className: inputClass,
                  value: data.discount_value,
                  onChange: (e) => setData("discount_value", e.target.value),
                  disabled: !data.discount_type
                }
              ) })
            ] }),
            (data.variations || []).length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (data.variations || []).map((variation, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-4 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-gray-800", children: [
                  "Variation ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeVariation(index),
                    className: "text-sm font-semibold text-rose-600 hover:text-rose-700",
                    children: "Remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsx(Field, { label: "Variation Name", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: inputClass,
                    value: variation?.name || "",
                    onChange: (e) => updateVariation(index, "name", e.target.value)
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Variation Price", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: inputClass,
                    value: variation?.price || "",
                    onChange: (e) => updateVariation(index, "price", e.target.value)
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsx(Field, { label: "Variation Discount Type", children: /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: inputClass,
                    value: variation?.discount_type || "",
                    onChange: (e) => updateVariation(index, "discount_type", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "No discount" }),
                      /* @__PURE__ */ jsx("option", { value: "percent", children: "Percent" }),
                      /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx(Field, { label: "Variation Discount Value", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: inputClass,
                    value: variation?.discount_value || "",
                    onChange: (e) => updateVariation(index, "discount_value", e.target.value),
                    disabled: !variation?.discount_type
                  }
                ) })
              ] })
            ] }, `variation-${index}`)) })
          ] }),
          data.listing_type === "auction" || isLiveAuction ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Start Price", error: errors.price, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.price, onChange: (e) => setData("price", e.target.value) }) }),
            /* @__PURE__ */ jsx(Field, { label: "Reserve Price", error: errors.reserve_price, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.reserve_price, onChange: (e) => setData("reserve_price", e.target.value) }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Price", error: errors.price, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.price, onChange: (e) => setData("price", e.target.value) }) }),
            data.listing_type === "business" && /* @__PURE__ */ jsx(Field, { label: "Stock", error: errors.stock, children: /* @__PURE__ */ jsx("input", { type: "number", className: inputClass, value: data.stock, onChange: (e) => setData("stock", e.target.value) }) })
          ] }),
          data.listing_type === "auction" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Start Date", error: errors.start_date, children: /* @__PURE__ */ jsx("input", { type: "datetime-local", className: inputClass, value: data.start_date, onChange: (e) => setData("start_date", e.target.value) }) }),
            /* @__PURE__ */ jsx(Field, { label: "End Date", error: errors.end_date, children: /* @__PURE__ */ jsx("input", { type: "datetime-local", className: inputClass, value: data.end_date, onChange: (e) => setData("end_date", e.target.value) }) })
          ] }),
          dynamicFields.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: "Dynamic Fields" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Category-specific fields configured from the dynamic fields module." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: dynamicFields.map((field) => {
              const inputType = String(field.input_type || "text").trim().toLowerCase();
              const fieldOptions = parseFieldOptions(field.options);
              return /* @__PURE__ */ jsx(Field, { label: field.label, error: errors[`category_features.field_${field.id}`] || errors[`field_${field.id}`], children: inputType === "select" ? /* @__PURE__ */ jsxs(
                "select",
                {
                  className: inputClass,
                  value: getFeatureValue(field),
                  onChange: (e) => updateFeatureValue(field, e.target.value),
                  children: [
                    /* @__PURE__ */ jsxs("option", { value: "", children: [
                      "Select ",
                      field.label
                    ] }),
                    fieldOptions.map((option, index) => /* @__PURE__ */ jsx("option", { value: option, children: option }, `${field.id}-${index}`))
                  ]
                }
              ) : inputType === "radio" ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 pt-2", children: fieldOptions.map((option, index) => {
                const radioId = `admin_dynamic_${field.id}_${index}`;
                return /* @__PURE__ */ jsxs("label", { htmlFor: radioId, className: "inline-flex items-center gap-2 text-sm text-gray-700", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: radioId,
                      type: "radio",
                      name: `admin_dynamic_${field.id}`,
                      className: "h-4 w-4 border-gray-300 text-black focus:ring-black",
                      value: option,
                      checked: getFeatureValue(field) === option,
                      onChange: (e) => updateFeatureValue(field, e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: option })
                ] }, radioId);
              }) }) : inputType === "textarea" ? /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: inputClass,
                  value: getFeatureValue(field),
                  onChange: (e) => updateFeatureValue(field, e.target.value)
                }
              ) : inputType === "checkbox" ? /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-3 cursor-pointer py-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "h-4 w-4 rounded border-gray-300 text-black focus:ring-black",
                    checked: Boolean(getFeatureValue(field)),
                    onChange: (e) => updateFeatureValue(field, e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-700", children: [
                  "Enable ",
                  field.label
                ] })
              ] }) : /* @__PURE__ */ jsx(
                "input",
                {
                  type: inputType || "text",
                  className: inputClass,
                  value: getFeatureValue(field),
                  onChange: (e) => updateFeatureValue(field, e.target.value)
                }
              ) }, field.id);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Media" }),
          /* @__PURE__ */ jsx(Field, { label: isLiveAuction ? "Primary Image (optional)" : "Primary Image", error: errors.image, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/png, image/jpeg, image/jpg, image/gif, image/webp, video/mp4, video/webm, video/quicktime",
              className: fileInputClass,
              onChange: (e) => {
                const file = e.target.files?.[0] || null;
                setData("image", file);
                setImagePreview(file ? URL.createObjectURL(file) : listing?.image_url || "");
                setImagePreviewIsVideo(
                  file ? Boolean(file.type?.startsWith("video/")) : Boolean(listing?.image_url && /\.(mp4|webm|mov)$/i.test(listing.image_url))
                );
              }
            }
          ) }),
          imagePreview ? imagePreviewIsVideo ? /* @__PURE__ */ jsx("video", { src: imagePreview, controls: true, className: "w-full h-48 object-cover rounded-xl border border-gray-100" }) : /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Preview", className: "w-full h-48 object-cover rounded-xl border border-gray-100" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-48 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400", children: "No image selected" }),
          /* @__PURE__ */ jsx(Field, { label: isLiveAuction ? "Images (optional)" : "Album Images", error: errors.album, children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/png, image/jpeg, image/jpg, image/gif, image/webp, video/mp4, video/webm, video/quicktime",
              multiple: true,
              className: fileInputClass,
              onChange: (e) => setData("album", e.target.files)
            }
          ) }),
          data.existing_album?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700", children: "Existing Album" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: data.existing_album.map((url) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /\.(mp4|webm|mov)$/i.test(url) ? /* @__PURE__ */ jsx("video", { src: url, className: "w-full h-20 object-cover rounded-lg border border-gray-100" }) : /* @__PURE__ */ jsx("img", { src: url, alt: "", className: "w-full h-20 object-cover rounded-lg border border-gray-100" }),
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
