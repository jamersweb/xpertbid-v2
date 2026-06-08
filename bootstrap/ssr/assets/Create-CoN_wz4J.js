import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import axios from "axios";
import ReactQuill from "react-quill";
/* empty css                    */
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
function ListTypeSelection({ onSelect, onSaveDraft, isSavingDraft, progressPercent = 0 }) {
  const [infoTab, setInfoTab] = useState(null);
  const listingTypes = [
    {
      id: "auction",
      title: "Auction Product",
      copy: "Let buyers compete and place bids on your listing.",
      description: "An auction listing allows buyers to compete by placing progressively higher bids. You set a starting price and a duration. Once the auction ends, the highest bidder over the reserve price wins the item. This is perfect for high-demand items, collectibles, or unique products where the market value might be higher than expected.",
      iconClass: "list-type-option--auction",
      icon: "fa-gavel"
    },
    {
      id: "normal_list",
      title: "Normal Product",
      copy: "Set a fixed price and receive direct purchase requests.",
      description: "A normal listing is a standard 'Buy It Now' format. You set a fixed price for your product. Buyers can purchase the item immediately at that price. You can also add variations like color and size, and set specific discounts. This is ideal for everyday items with a clear market price.",
      iconClass: "list-type-option--normal",
      icon: "fa-tags"
    },
    {
      id: "business_list",
      title: "Business Product",
      copy: "Manage inventory, stock, and business-specific details.",
      description: "Business listings are designed for professional sellers and shops. They include advanced inventory management features such as SKU tracking and multi-quantity stock control. This format allows you to list products that you have in bulk and manage your business stock levels directly through the platform.",
      iconClass: "list-type-option--business",
      icon: "fa-briefcase"
    }
  ];
  const openModal = (e, id) => {
    e.stopPropagation();
    setInfoTab(id);
  };
  const closeModal = () => setInfoTab(null);
  const activeInfo = listingTypes.find((t) => t.id === infoTab);
  return /* @__PURE__ */ jsx("section", { className: "list-type-stage", children: /* @__PURE__ */ jsxs("div", { className: "list-type-stage-inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "list-type-card shadow-lg position-relative", children: [
      onSaveDraft && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-black save-draft-btn-header my-3 me-3",
          onClick: onSaveDraft,
          disabled: isSavingDraft,
          children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
            "Saving..."
          ] }) : "Save as Draft"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "list-type-title", children: "What would you like to list?" }),
      /* @__PURE__ */ jsx("p", { className: "list-type-subtitle", children: "Select the listing format that suits your product." }),
      /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "progress-bar bg-primary",
          role: "progressbar",
          style: { width: `${progressPercent}%` },
          "aria-valuenow": progressPercent,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "list-type-grid", children: listingTypes.map((type, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `list-type-option-wrapper ${index === 2 ? "list-type-option-wrapper--wide" : ""}`,
          children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: `list-type-option ${type.iconClass}`,
              onClick: () => onSelect(type.id),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-start mb-2 w-100", children: [
                  /* @__PURE__ */ jsx("span", { className: "list-type-option-title", children: type.title }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "info-toggle-btn p-1",
                      onClick: (e) => openModal(e, type.id),
                      title: "Click for more info",
                      children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info mt-1" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("span", { className: "list-type-option-copy text-start w-100", children: type.copy })
              ]
            }
          )
        },
        type.id
      )) })
    ] }),
    infoTab && /* @__PURE__ */ jsx("div", { className: "list-type-modal-overlay", onClick: closeModal, children: /* @__PURE__ */ jsxs("div", { className: "list-type-modal-content shadow-lg", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "list-type-modal-header d-flex justify-content-between align-items-center mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `modal-icon-circle ${activeInfo.iconClass}`, children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${activeInfo.icon}` }) }),
          /* @__PURE__ */ jsx("h2", { className: "m-0 h4 fw-bold text-dark", children: activeInfo.title })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "btn-close", onClick: closeModal })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "list-type-modal-body", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted leading-relaxed mb-4", children: activeInfo.description }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black w-100 py-3 fw-bold",
            onClick: () => {
              onSelect(activeInfo.id);
              closeModal();
            },
            children: "Select This Listing Type"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "sell-back-home-wrapper sell-back-home-wrapper--list-type", children: /* @__PURE__ */ jsx(Link, { href: "/", className: "btn btn-black sell-back-home-btn", children: "Back to Home" }) })
  ] }) });
}
const OTHER_CATEGORY_OPTION = {
  id: "other_category",
  name: "Other",
  isOther: true
};
const OTHER_SUBCATEGORY_OPTION = {
  id: "other_subcategory",
  name: "Other",
  isOther: true
};
const OTHER_CHILD_CATEGORY_OPTION = {
  id: "other_childcategory",
  name: "Other",
  isOther: true
};
function CategorySelection({ categories: initialCategories, onSelect, onBack, onSaveDraft, isSavingDraft, progressPercent = 0 }) {
  const [viewMode, setViewMode] = useState("grid");
  const [categories, setCategories] = useState(initialCategories || []);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [customCategoryBase, setCustomCategoryBase] = useState({
    category: "",
    sub: "",
    child: ""
  });
  const buildAbsoluteMediaUrl = (path) => {
    if (!path) return "https://admin.xpertbid.com/assets/images/category_images/1750684943_6859550f2948f.png";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const clean = path.replace(/^\/+/, "");
    return `https://admin.xpertbid.com/${clean}`;
  };
  const getCategoryMedia = (item) => {
    const candidate = item?.image || item?.icon || item?.thumbnail || item?.photo || item?.media;
    return buildAbsoluteMediaUrl(candidate);
  };
  const loadSubCategories = async (categoryId) => {
    if (!categoryId || categoryId === "other_category") {
      setSubCategories([]);
      return;
    }
    try {
      const response = await axios.get(`/get-subcategories/${categoryId}`);
      setSubCategories(response.data.subcategories || []);
    } catch (error) {
      console.error("Error loading subcategories", error);
    }
  };
  const loadChildCategories = async (subCategoryId) => {
    if (!subCategoryId || subCategoryId === "other_subcategory") {
      setChildCategories([]);
      return;
    }
    try {
      const response = await axios.get(`/get-children/${subCategoryId}`);
      setChildCategories(response.data.subcategories || []);
    } catch (error) {
      console.error("Error loading child categories", error);
    }
  };
  const handleGridCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setViewMode("list");
    setSelectedSubCategory(null);
    setSelectedChildCategory(null);
    setChildCategories([]);
    if (cat.id === "other_category") {
      setSubCategories([]);
    } else {
      loadSubCategories(cat.id);
    }
  };
  const handleSubCategoryClick = (sub) => {
    setSelectedSubCategory(sub);
    setSelectedChildCategory(null);
    if (sub.id === "other_subcategory") {
      setChildCategories([]);
    } else {
      loadChildCategories(sub.id);
    }
  };
  const handleChildCategoryClick = (child) => {
    setSelectedChildCategory(child);
  };
  const handleCustomInputChange = (e, level) => {
    setCustomCategoryBase((prev) => ({ ...prev, [level]: e.target.value }));
  };
  const canProceed = () => {
    if (!selectedCategory) return false;
    if (selectedCategory.id === "other_category") return !!customCategoryBase.category;
    if (subCategories.length > 0) {
      if (!selectedSubCategory) return false;
      if (selectedSubCategory.id === "other_subcategory") return !!customCategoryBase.sub;
      if (childCategories.length > 0) {
        if (!selectedChildCategory) return false;
        if (selectedChildCategory.id === "other_childcategory") return !!customCategoryBase.child;
      }
    }
    return true;
  };
  const handleContinue = () => {
    onSelect({
      category: selectedCategory,
      subCategory: selectedSubCategory,
      childCategory: selectedChildCategory,
      customInputs: customCategoryBase
    });
  };
  const categoryOptions = [...categories, OTHER_CATEGORY_OPTION];
  const subCategoryOptions = selectedCategory ? [...subCategories, OTHER_SUBCATEGORY_OPTION] : [];
  const childCategoryOptions = selectedSubCategory ? [...childCategories, OTHER_CHILD_CATEGORY_OPTION] : [];
  if (viewMode === "grid") {
    return /* @__PURE__ */ jsxs("section", { className: "category-stage category-stage--active", children: [
      /* @__PURE__ */ jsxs("div", { className: "category-stage-header text-center position-relative", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black save-draft-btn-header",
            onClick: onSaveDraft,
            disabled: isSavingDraft || !onSaveDraft,
            children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
              "Saving..."
            ] }) : "Save Draft"
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "up-listing mb-2", children: "Post Your Listing" }),
        /* @__PURE__ */ jsx("p", { className: "category-stage-subtitle", children: "Choose a category that best matches your product." }),
        /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "progress-bar bg-primary",
            role: "progressbar",
            style: { width: `${progressPercent}%` },
            "aria-valuenow": progressPercent,
            "aria-valuemin": "0",
            "aria-valuemax": "100"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "category-grid", children: categoryOptions.map((category) => {
        const media = getCategoryMedia(category);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "category-grid-card shadow-sm",
            onClick: () => handleGridCategoryClick(category),
            children: [
              /* @__PURE__ */ jsx("div", { className: "category-grid-thumb", children: /* @__PURE__ */ jsx("img", { src: media, alt: category.name }) }),
              /* @__PURE__ */ jsx("span", { className: "category-grid-title", children: category.name })
            ]
          },
          category.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "sell-back-home-wrapper sell-back-home-wrapper--secondary", children: /* @__PURE__ */ jsx("button", { onClick: onBack, className: "btn btn-outline-secondary sell-back-home-btn me-2", children: "Back" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "category-stage category-stage--active", children: [
    /* @__PURE__ */ jsxs("div", { className: "category-stage-header text-center position-relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-black save-draft-btn-header",
          onClick: onSaveDraft,
          disabled: isSavingDraft || !onSaveDraft,
          children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
            "Saving..."
          ] }) : "Save Draft"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "up-listing mb-2", children: "Post Your Listing" }),
      /* @__PURE__ */ jsx("p", { className: "category-stage-subtitle", children: "Choose a category that best matches your product." }),
      /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "progress-bar bg-primary",
          role: "progressbar",
          style: { width: `${progressPercent}%` },
          "aria-valuenow": progressPercent,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "category-list-wrapper", children: [
      /* @__PURE__ */ jsxs("div", { className: "category-columns", children: [
        /* @__PURE__ */ jsxs("div", { className: "category-column", children: [
          /* @__PURE__ */ jsx("div", { className: "category-column-header", children: /* @__PURE__ */ jsx("h3", { children: "Categories" }) }),
          /* @__PURE__ */ jsx("div", { className: "category-column-body", children: categoryOptions.map((category) => {
            const media = getCategoryMedia(category);
            const isActive = selectedCategory && String(selectedCategory.id) === String(category.id);
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: `category-list-item ${isActive ? "is-active" : ""}`,
                onClick: () => handleGridCategoryClick(category),
                children: [
                  /* @__PURE__ */ jsx("div", { className: "category-list-thumb", children: /* @__PURE__ */ jsx("img", { src: media, alt: category.name }) }),
                  /* @__PURE__ */ jsx("span", { children: category.name }),
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-right" })
                ]
              },
              category.id
            );
          }) }),
          selectedCategory && selectedCategory.id === "other_category" && /* @__PURE__ */ jsxs("div", { className: "custom-category-input mt-3", children: [
            /* @__PURE__ */ jsx("label", { children: "Create Your Own Category" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "form-control",
                placeholder: "Enter custom category",
                value: customCategoryBase.category,
                onChange: (e) => handleCustomInputChange(e, "category")
              }
            )
          ] })
        ] }),
        selectedCategory && selectedCategory.id !== "other_category" && /* @__PURE__ */ jsxs("div", { className: "category-column", children: [
          /* @__PURE__ */ jsx("div", { className: "category-column-header", children: /* @__PURE__ */ jsx("h3", { children: "Subcategories" }) }),
          /* @__PURE__ */ jsxs("div", { className: "category-column-body", children: [
            !subCategories || subCategories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "category-empty-state", children: 'No subcategories found. Choose "Other" to add your own.' }) : null,
            subCategoryOptions.map((subCategory) => {
              const isActive = selectedSubCategory && String(selectedSubCategory.id) === String(subCategory.id);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: `category-list-item ${isActive ? "is-active" : ""}`,
                  onClick: () => handleSubCategoryClick(subCategory),
                  children: [
                    /* @__PURE__ */ jsx("span", { children: subCategory.name }),
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-right" })
                  ]
                },
                subCategory.id
              );
            })
          ] }),
          selectedSubCategory && selectedSubCategory.id === "other_subcategory" && /* @__PURE__ */ jsxs("div", { className: "custom-category-input mt-3", children: [
            /* @__PURE__ */ jsx("label", { children: "Create Your Own Subcategory" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "form-control",
                placeholder: "Enter custom subcategory",
                value: customCategoryBase.sub,
                onChange: (e) => handleCustomInputChange(e, "sub")
              }
            )
          ] })
        ] }),
        selectedSubCategory && selectedSubCategory.id !== "other_subcategory" && /* @__PURE__ */ jsxs("div", { className: "category-column", children: [
          /* @__PURE__ */ jsx("div", { className: "category-column-header", children: /* @__PURE__ */ jsx("h3", { children: "Child Categories" }) }),
          /* @__PURE__ */ jsxs("div", { className: "category-column-body", children: [
            !childCategories || childCategories.length === 0 ? /* @__PURE__ */ jsx("p", { className: "category-empty-state", children: 'No child categories found. Choose "Other" to add your own.' }) : null,
            childCategoryOptions.map((child) => {
              const isActive = selectedChildCategory && String(selectedChildCategory.id) === String(child.id);
              return /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `category-list-item ${isActive ? "is-active" : ""}`,
                  onClick: () => handleChildCategoryClick(child),
                  children: /* @__PURE__ */ jsx("span", { children: child.name })
                },
                child.id
              );
            })
          ] }),
          selectedChildCategory && selectedChildCategory.id === "other_childcategory" && /* @__PURE__ */ jsxs("div", { className: "custom-category-input mt-3", children: [
            /* @__PURE__ */ jsx("label", { children: "Create Your Own Child Category" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "form-control",
                placeholder: "Enter custom child category",
                value: customCategoryBase.child,
                onChange: (e) => handleCustomInputChange(e, "child")
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "category-stage-actions d-flex justify-content-between align-items-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black",
            onClick: () => setViewMode("grid"),
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black",
            disabled: !canProceed(),
            onClick: handleContinue,
            children: "Continue"
          }
        )
      ] })
    ] })
  ] });
}
function SummaryCard({ type, title, subtitle, icon, onEdit, initial }) {
  const renderIcon = () => {
    if (icon) {
      return /* @__PURE__ */ jsx("img", { src: icon, alt: title, style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" } });
    }
    return /* @__PURE__ */ jsx("span", { className: "list-type-initial", children: initial || (title ? title.slice(0, 1).toUpperCase() : "L") });
  };
  return /* @__PURE__ */ jsx("div", { className: "details-summary-card shadow-sm mb-4", children: /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "sell-summary-thumb", children: renderIcon() }),
    /* @__PURE__ */ jsxs("div", { className: "flex-grow-1", children: [
      /* @__PURE__ */ jsx("p", { className: "sell-summary-label mb-1", children: type }),
      /* @__PURE__ */ jsx("h3", { className: "sell-summary-title mb-0", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "sell-summary-subtitle mb-0 text-muted small", children: subtitle })
    ] }),
    onEdit && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "btn btn-link ms-auto sell-summary-change",
        onClick: onEdit,
        children: "Change"
      }
    )
  ] }) });
}
function DetailsForm({
  listType,
  formData,
  setFormData,
  countries = [],
  states = [],
  cities = [],
  summaryData,
  dynamicFields = [],
  onContinue,
  onBack,
  onEditListType,
  onEditCategory,
  onSaveDraft,
  isSavingDraft,
  progressPercent = 0
}) {
  const [errors, setErrors] = useState({});
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
  const getSafeFeatures = () => {
    const rawFeatures = formData?.category_features;
    if (!rawFeatures || typeof rawFeatures !== "object" || Array.isArray(rawFeatures)) {
      return {};
    }
    return rawFeatures;
  };
  const fieldNameCounts = (dynamicFields || []).reduce((acc, field) => {
    const base = normalizedFieldName(field);
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});
  const getIdFeatureKey = (field) => `field_${field?.id}`;
  const getFeatureKey = (field) => {
    const base = normalizedFieldName(field);
    const idKey = getIdFeatureKey(field);
    return fieldNameCounts[base] > 1 ? `${base}__${field.id}` : base || idKey;
  };
  const getFeatureValue = (field) => {
    const features = getSafeFeatures();
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
    setFormData((prev) => {
      const prevFeatures = prev?.category_features && typeof prev.category_features === "object" && !Array.isArray(prev.category_features) ? prev.category_features : {};
      const nextFeatures = {
        ...prevFeatures,
        [idKey]: value,
        [key]: value
      };
      if (!isDuplicateFieldName && base) {
        nextFeatures[base] = value;
      }
      return {
        ...prev,
        category_features: nextFeatures
      };
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "country_id") {
        next.state_id = "";
        next.city_id = "";
      } else if (name === "state_id") {
        next.city_id = "";
      }
      return next;
    });
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const handleQuillChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };
  const handleAddVariation = () => {
    const newVariations = [...formData.variations || [], { name: "", price: "", discount_type: "", discount_value: "" }];
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };
  const handleRemoveVariation = (index) => {
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };
  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData((prev) => ({ ...prev, variations: newVariations }));
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description || formData.description === "<p><br></p>") newErrors.description = "Description is required";
    if (listType === "auction") {
      if (!formData.minimum_bid) newErrors.minimum_bid = "Starting bid is required";
      if (!formData.reserve_price) newErrors.reserve_price = "Market price is required";
      if (!formData.start_date) newErrors.start_date = "Start date is required";
      if (!formData.end_date) newErrors.end_date = "End date is required";
    }
    if (listType === "normal_list" || listType === "business_list") {
      if (!formData.variations || formData.variations.length === 0) {
        if (!formData.minimum_bid) newErrors.minimum_bid = "Price is required";
      }
    }
    if (listType === "business_list") {
      if (!formData.stock) newErrors.stock = "Stock is required";
      if (!formData.quantity) newErrors.quantity = "Quantity is required";
    }
    dynamicFields.forEach((field) => {
      if (field.is_required && !getFeatureValue(field)) {
        newErrors[`field_${field.id}`] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      onContinue();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "details-stage py-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "details-stage-header text-center position-relative mb-5", children: [
      onSaveDraft && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-black save-draft-btn-header",
          onClick: onSaveDraft,
          disabled: isSavingDraft,
          children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
            "Saving..."
          ] }) : "Save as Draft"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "up-listing mb-2 text-dark", children: "Listing Details" }),
      /* @__PURE__ */ jsx("p", { className: "details-stage-subtitle", children: "Fill in the information below to describe your product." }),
      /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "progress-bar bg-primary",
          role: "progressbar",
          style: { width: `${progressPercent}%` },
          "aria-valuenow": progressPercent,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx("form", { className: "details-form", onSubmit: handleNext, noValidate: true, children: /* @__PURE__ */ jsxs("div", { className: "sell-form-inner", children: [
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "List Type",
          title: summaryData.listType,
          subtitle: summaryData.listTypeDescription,
          onEdit: onEditListType
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Category",
          title: summaryData.category?.name || "Category",
          subtitle: `${summaryData.subCategory?.name || ""}${summaryData.childCategory ? " > " + summaryData.childCategory.name : ""}`,
          icon: summaryData.categoryIcon,
          onEdit: onEditCategory
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
        /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
          "Product Title ",
          /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            className: "form-control verify_input",
            placeholder: "e.g. 2024 Rolex Submariner",
            value: formData.title || "",
            onChange: handleChange
          }
        ),
        errors.title && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group mb-4 r-quill", children: [
        /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
          "Product Description ",
          /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          ReactQuill,
          {
            theme: "snow",
            value: formData.description || "",
            onChange: handleQuillChange,
            placeholder: "Provide a detailed description of your product..."
          }
        ),
        errors.description && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "details-row mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Country" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "country_id",
              className: "form-control verify_input",
              value: formData.country_id || "",
              onChange: handleChange,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
                countries.map((country) => /* @__PURE__ */ jsx("option", { value: country.id, children: country.name }, country.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "State" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "state_id",
              className: "form-control verify_input",
              value: formData.state_id || "",
              onChange: handleChange,
              disabled: !formData.country_id,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select State" }),
                states.map((state) => /* @__PURE__ */ jsx("option", { value: state.id, children: state.name }, state.id))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "City" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            name: "city_id",
            className: "form-control verify_input",
            value: formData.city_id || "",
            onChange: handleChange,
            disabled: !formData.state_id,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
              cities.map((city) => /* @__PURE__ */ jsx("option", { value: city.id, children: city.name }, city.id))
            ]
          }
        )
      ] }),
      listType === "auction" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "details-row mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "Starting Bid ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                name: "minimum_bid",
                className: "form-control verify_input",
                value: formData.minimum_bid || "",
                onChange: handleChange
              }
            ),
            errors.minimum_bid && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.minimum_bid })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "Market Price ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                name: "reserve_price",
                className: "form-control verify_input",
                value: formData.reserve_price || "",
                onChange: handleChange
              }
            ),
            errors.reserve_price && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.reserve_price })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "details-row mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "Start Date ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "datetime-local",
                name: "start_date",
                className: "form-control verify_input",
                value: formData.start_date || "",
                onChange: handleChange,
                min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16)
              }
            ),
            errors.start_date && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.start_date })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "End Date ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "datetime-local",
                name: "end_date",
                className: "form-control verify_input",
                value: formData.end_date || "",
                onChange: handleChange,
                min: formData.start_date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 16)
              }
            ),
            errors.end_date && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.end_date })
          ] })
        ] })
      ] }),
      (listType === "normal_list" || listType === "business_list") && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          (!formData.variations || formData.variations.length === 0) && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-sm btn-outline-primary mb-4",
              onClick: handleAddVariation,
              children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-1" }),
                " Add Variation"
              ]
            }
          ),
          formData.variations?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("label", { className: "mb-2 fw-bold text-dark", children: "Variations" }),
            (formData.variations || []).map((variation, index) => /* @__PURE__ */ jsxs("div", { className: "d-flex gap-2 mb-2 align-items-center flex-wrap", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-grow-1", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Variation (e.g. Size L)",
                    className: "form-control verify_input",
                    value: variation.name,
                    onChange: (e) => handleVariationChange(index, "name", e.target.value)
                  }
                ),
                errors[`variation_${index}_name`] && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors[`variation_${index}_name`] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { width: "120px" }, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "Price",
                    className: "form-control verify_input",
                    value: variation.price,
                    onChange: (e) => handleVariationChange(index, "price", e.target.value)
                  }
                ),
                errors[`variation_${index}_price`] && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors[`variation_${index}_price`] })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { width: "120px" }, children: /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "form-control verify_input",
                  value: variation.discount_type || "",
                  onChange: (e) => handleVariationChange(index, "discount_type", e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "No Disc" }),
                    /* @__PURE__ */ jsx("option", { value: "percent", children: "% Off" }),
                    /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat Off" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("div", { style: { width: "100px" }, children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  placeholder: "Value",
                  className: "form-control verify_input",
                  value: variation.discount_value || "",
                  onChange: (e) => handleVariationChange(index, "discount_value", e.target.value),
                  disabled: !variation.discount_type
                }
              ) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "btn text-danger p-0 border-0 ms-2",
                  onClick: () => handleRemoveVariation(index),
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
                }
              )
            ] }, index)),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-sm btn-outline-primary mt-3",
                onClick: handleAddVariation,
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus me-1" }),
                  " Add Another Variation"
                ]
              }
            )
          ] }),
          (!formData.variations || formData.variations.length === 0) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
                "Price ",
                /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  name: "minimum_bid",
                  className: "form-control verify_input",
                  value: formData.minimum_bid || "",
                  onChange: handleChange
                }
              ),
              errors.minimum_bid && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.minimum_bid })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Discount (Optional)" }),
              /* @__PURE__ */ jsxs("div", { className: "d-flex gap-2", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "discount_type",
                    className: "form-control verify_input",
                    value: formData.discount_type || "",
                    onChange: handleChange,
                    style: { flex: 1 },
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "No Discount" }),
                      /* @__PURE__ */ jsx("option", { value: "percent", children: "Percentage (%)" }),
                      /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat Amount" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    name: "discount_value",
                    placeholder: "Discount Value",
                    className: "form-control verify_input",
                    value: formData.discount_value || "",
                    onChange: handleChange,
                    style: { flex: 1 },
                    disabled: !formData.discount_type
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        listType === "business_list" && /* @__PURE__ */ jsxs("div", { className: "details-row mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "Stock SKU ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                name: "stock",
                className: "form-control verify_input",
                placeholder: "e.g. SKU-12345",
                value: formData.stock || "",
                onChange: handleChange
              }
            ),
            errors.stock && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.stock })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group flex-fill mb-0", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
              "Available Quantity ",
              /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                name: "quantity",
                className: "form-control verify_input",
                placeholder: "e.g. 100",
                value: formData.quantity || "",
                onChange: handleChange
              }
            ),
            errors.quantity && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.quantity })
          ] })
        ] })
      ] }),
      dynamicFields && dynamicFields.length > 0 && /* @__PURE__ */ jsx("div", { className: "dynamic-fields-section mb-4", children: /* @__PURE__ */ jsx("div", { className: "row", children: dynamicFields.map((field) => {
        const inputType = String(field.input_type || "text").trim().toLowerCase();
        const fieldOptions = parseFieldOptions(field.options);
        return /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
            field.label,
            " ",
            field.is_required ? /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" }) : ""
          ] }),
          inputType === "select" ? /* @__PURE__ */ jsxs(
            "select",
            {
              className: "form-control verify_input",
              value: getFeatureValue(field),
              onChange: (e) => updateFeatureValue(field, e.target.value),
              required: field.is_required,
              children: [
                /* @__PURE__ */ jsxs("option", { value: "", children: [
                  "Select ",
                  field.label
                ] }),
                fieldOptions.map((opt, i) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, i))
              ]
            }
          ) : inputType === "radio" ? /* @__PURE__ */ jsx("div", { className: "pt-2", children: fieldOptions.map((opt, i) => {
            const radioId = `field_${field.id}_${i}`;
            const currentValue = getFeatureValue(field);
            return /* @__PURE__ */ jsxs("div", { className: "form-check mb-2 d-inline-flex align-items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "form-check-input m-0 align-self-center",
                  type: "radio",
                  id: radioId,
                  name: `field_${field.id}`,
                  value: opt,
                  checked: currentValue === opt,
                  onChange: (e) => updateFeatureValue(field, e.target.value)
                }
              ),
              /* @__PURE__ */ jsx("label", { className: "form-check-label small m-0 text-dark d-flex align-items-center", style: { color: "#23262F", opacity: 1, lineHeight: 1.2 }, htmlFor: radioId, children: opt })
            ] }, radioId);
          }) }) : inputType === "textarea" ? /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "form-control verify_input",
              value: getFeatureValue(field),
              onChange: (e) => updateFeatureValue(field, e.target.value),
              required: field.is_required
            }
          ) : inputType === "checkbox" ? /* @__PURE__ */ jsxs("div", { className: "form-check pt-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "form-check-input",
                type: "checkbox",
                checked: !!getFeatureValue(field),
                onChange: (e) => updateFeatureValue(field, e.target.checked),
                id: `field_${field.id}`
              }
            ),
            /* @__PURE__ */ jsxs("label", { className: "form-check-label small ms-2", htmlFor: `field_${field.id}`, children: [
              "Enable ",
              field.label
            ] })
          ] }) : /* @__PURE__ */ jsx(
            "input",
            {
              type: inputType || "text",
              className: "form-control verify_input",
              value: getFeatureValue(field),
              onChange: (e) => updateFeatureValue(field, e.target.value),
              required: field.is_required
            }
          ),
          errors[`field_${field.id}`] && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors[`field_${field.id}`] })
        ] }, field.id);
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "details-stage-actions d-flex justify-content-between align-items-center mt-5", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black px-4",
            onClick: onBack,
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-black px-5", children: "Continue" })
      ] })
    ] }) })
  ] });
}
function VerificationStep({ categoryId, formData, setFormData, summaryData, onContinue, onBack, onEditListType, onEditCategory, onEditDetails, onSaveDraft, isSavingDraft, progressPercent = 0 }) {
  const isProperty = String(categoryId) === "222";
  const isVehicle = String(categoryId) === "311";
  const existingPropertyDocs = formData.existing_property_documents || [];
  const existingVehicleDocs = formData.existing_vehicle_documents || [];
  const [errors, setErrors] = useState({});
  const handleDocsChange = (e, fieldName) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Max 3 documents allowed" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    setFormData((prev) => ({ ...prev, [fieldName]: files }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const newErrors = {};
    if (isProperty) {
      if (!formData.property_type) newErrors.property_type = "Required";
      if (!formData.property_address) newErrors.property_address = "Required";
      if (!formData.title_deed_number) newErrors.title_deed_number = "Required";
      if (!formData.property_documents?.length && !existingPropertyDocs.length) newErrors.property_documents = "Upload documents";
    }
    if (isVehicle) {
      if (!formData.vehicle_make_model) newErrors.vehicle_make_model = "Required";
      if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "Required";
      if (!formData.chassis_vin) newErrors.chassis_vin = "Required";
      if (!formData.vehicle_documents?.length && !existingVehicleDocs.length) newErrors.vehicle_documents = "Upload documents";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      onContinue();
    }
  };
  if (!isProperty && !isVehicle) return null;
  const getDocumentUrl = (doc) => {
    if (!doc) return "#";
    if (typeof doc === "string" && (doc.startsWith("http://") || doc.startsWith("https://"))) {
      return doc;
    }
    return `/${String(doc).replace(/^\/+/, "")}`;
  };
  const getDocumentLabel = (doc, idx) => {
    if (!doc) return `Document ${idx + 1}`;
    if (typeof doc !== "string") return `Document ${idx + 1}`;
    const parts = doc.split("/");
    return parts[parts.length - 1] || `Document ${idx + 1}`;
  };
  return /* @__PURE__ */ jsxs("section", { className: "verification-stage py-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "verification-stage-header text-center position-relative mb-5", children: [
      onSaveDraft && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-black save-draft-btn-header",
          onClick: onSaveDraft,
          disabled: isSavingDraft,
          children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
            "Saving..."
          ] }) : "Save as Draft"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "up-listing mb-2", children: isProperty ? "Property Verification" : "Vehicle Verification" }),
      /* @__PURE__ */ jsx("p", { className: "verification-stage-subtitle", children: "Provide verification details before continuing." }),
      /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "progress-bar bg-primary",
          role: "progressbar",
          style: { width: `${progressPercent}%` },
          "aria-valuenow": progressPercent,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx("form", { className: "verification-form", onSubmit: handleNext, noValidate: true, children: /* @__PURE__ */ jsxs("div", { className: "sell-form-inner", children: [
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "List Type",
          title: summaryData.listType === "Auction" ? "Auction Product" : "Normal Product",
          subtitle: summaryData.listTypeDescription,
          onEdit: onEditListType
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Category",
          title: summaryData.category?.name || "Category",
          subtitle: `${summaryData.subCategory?.name || ""}${summaryData.childCategory ? " > " + summaryData.childCategory.name : ""}`,
          icon: summaryData.categoryIcon,
          onEdit: onEditCategory
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Listing Details",
          title: summaryData.listingTitle || "Untitled Listing",
          onEdit: onEditDetails
        }
      ),
      isProperty && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Property Type" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control verify_input",
              placeholder: "Please enter property type",
              name: "property_type",
              value: formData.property_type || "",
              onChange: handleChange
            }
          ),
          errors.property_type && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.property_type })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Property Address" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control verify_input",
              placeholder: "Please enter property address",
              name: "property_address",
              value: formData.property_address || "",
              onChange: handleChange
            }
          ),
          errors.property_address && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.property_address })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Title Deed Number" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control verify_input",
              placeholder: "Please enter title deed number",
              name: "title_deed_number",
              value: formData.title_deed_number || "",
              onChange: handleChange
            }
          ),
          errors.title_deed_number && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.title_deed_number })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "identity-upload-section mb-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "form-label fw-bold mb-3", children: "Upload Ownership & NOC Documents" }),
          /* @__PURE__ */ jsxs("ul", { className: "liss mb-3 small", style: { color: "#4b5563" }, children: [
            /* @__PURE__ */ jsx("li", { children: "Click the box to select your files (PNG/JPG)." }),
            /* @__PURE__ */ jsx("li", { children: "Maximum 3 documents." })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "upload-dropzone p-4 text-center border rounded cursor-pointer",
              onClick: () => document.getElementById("propertyDocsInput")?.click(),
              style: { borderStyle: "dashed", backgroundColor: "#f9f9f9" },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "propertyDocsInput",
                    type: "file",
                    hidden: true,
                    multiple: true,
                    accept: ".pdf, .jpg, .png",
                    onChange: (e) => handleDocsChange(e, "property_documents")
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "upload-dropzone-content", children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cloud-arrow-up fa-2x mb-3", style: { color: "#6b7280" } }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 fw-bold text-dark", children: "Drag & drop or click to upload documents" }),
                  /* @__PURE__ */ jsx("span", { className: "text-dark small", children: "PNG, JPG formats only. Max 3 files." })
                ] })
              ]
            }
          ),
          errors.property_documents && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-2", children: errors.property_documents }),
          existingPropertyDocs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "small fw-bold mb-2", style: { color: "#111827" }, children: "Existing Documents:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-unstyled mb-0", children: existingPropertyDocs.map((doc, idx) => /* @__PURE__ */ jsx("li", { className: "small mb-1", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: getDocumentUrl(doc),
                target: "_blank",
                rel: "noreferrer",
                className: "text-decoration-underline text-dark",
                children: getDocumentLabel(doc, idx)
              }
            ) }, `existing-property-${idx}`)) })
          ] }),
          formData.property_documents && formData.property_documents.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "small fw-bold mb-2", style: { color: "#111827" }, children: "Selected Files:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-unstyled", children: Array.from(formData.property_documents).map((file, idx) => /* @__PURE__ */ jsx("li", { className: "small", style: { color: "#374151" }, children: file.name }, idx)) })
          ] })
        ] })
      ] }),
      isVehicle && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Vehicle Make & Model" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control verify_input",
              placeholder: "Please enter vehicle make & model",
              name: "vehicle_make_model",
              value: formData.vehicle_make_model || "",
              onChange: handleChange
            }
          ),
          errors.vehicle_make_model && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.vehicle_make_model })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Year of Manufacture" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              className: "form-control verify_input",
              placeholder: "Please enter year of manufacture",
              name: "year_of_manufacture",
              value: formData.year_of_manufacture || "",
              onChange: handleChange
            }
          ),
          errors.year_of_manufacture && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.year_of_manufacture })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Chassis / VIN" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "form-control verify_input",
              placeholder: "Please enter chassis / VIN",
              name: "chassis_vin",
              value: formData.chassis_vin || "",
              onChange: handleChange
            }
          ),
          errors.chassis_vin && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1", children: errors.chassis_vin })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "identity-upload-section mb-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "form-label fw-bold mb-3", children: "Upload Vehicle Documents" }),
          /* @__PURE__ */ jsxs("ul", { className: "liss mb-3 small", style: { color: "#4b5563" }, children: [
            /* @__PURE__ */ jsx("li", { children: "Upload up to 3 documents for verification." }),
            /* @__PURE__ */ jsx("li", { children: "Accepted formats: PNG/JPG/PDF." })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "upload-dropzone p-4 text-center border rounded cursor-pointer",
              onClick: () => document.getElementById("vehicleDocsInput")?.click(),
              style: { borderStyle: "dashed", backgroundColor: "#f9f9f9" },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "vehicleDocsInput",
                    type: "file",
                    hidden: true,
                    multiple: true,
                    accept: ".pdf, .jpg, .png",
                    onChange: (e) => handleDocsChange(e, "vehicle_documents")
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "upload-dropzone-content", children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cloud-arrow-up fa-2x mb-3", style: { color: "#6b7280" } }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 fw-bold", style: { color: "#111827" }, children: "Drag & drop or click to upload documents" }),
                  /* @__PURE__ */ jsx("span", { className: "text-dark small", children: "PNG, JPG, PDF formats only. Max 3 files." })
                ] })
              ]
            }
          ),
          errors.vehicle_documents && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-2", children: errors.vehicle_documents }),
          existingVehicleDocs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "small fw-bold mb-2", style: { color: "#111827" }, children: "Existing Documents:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-unstyled mb-0", children: existingVehicleDocs.map((doc, idx) => /* @__PURE__ */ jsx("li", { className: "small mb-1", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: getDocumentUrl(doc),
                target: "_blank",
                rel: "noreferrer",
                className: "text-decoration-underline text-dark",
                children: getDocumentLabel(doc, idx)
              }
            ) }, `existing-vehicle-${idx}`)) })
          ] }),
          formData.vehicle_documents && formData.vehicle_documents.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "small fw-bold mb-2", style: { color: "#111827" }, children: "Selected Files:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-unstyled", children: Array.from(formData.vehicle_documents).map((file, idx) => /* @__PURE__ */ jsx("li", { className: "small", style: { color: "#374151" }, children: file.name }, idx)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "verification-stage-actions d-flex justify-content-between align-items-center mt-5", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black px-4",
            onClick: onBack,
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-black px-5", children: "Continue" })
      ] })
    ] }) })
  ] });
}
function MediaUpload({ files, setFiles, existingFiles = [], setExistingFiles, summaryData, onContinue, onBack, onEditListType, onEditCategory, onEditDetails, onEditVerification, onSaveDraft, isSavingDraft, canPublish = true, publishBlockedMessage = "", progressPercent = 0 }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    const validFiles = [];
    let err = "";
    selectedFiles.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
      if (!["image/png", "image/jpeg", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
        err = "Only PNG, JPG, WEBP, GIF, MP4, WEBM, and MOV files are allowed.";
      } else if (file.size > maxSize) {
        err = isVideo ? "Video file size must be less than 15MB." : "Image file size must be less than 10MB.";
      } else {
        validFiles.push(file);
      }
    });
    if (err) setError(err);
    else setError("");
    setFiles([...files, ...validFiles]);
  };
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  const getPreview = (file) => {
    return URL.createObjectURL(file);
  };
  const handleNext = (e) => {
    e.preventDefault();
    onContinue();
  };
  return /* @__PURE__ */ jsxs("section", { className: "media-stage py-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "media-stage-header text-center position-relative mb-5", children: [
      onSaveDraft && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "btn btn-black save-draft-btn-header",
          onClick: onSaveDraft,
          disabled: isSavingDraft,
          children: isSavingDraft ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }),
            "Saving..."
          ] }) : "Save as Draft"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "up-listing mb-2", children: "Upload Media" }),
      /* @__PURE__ */ jsx("p", { className: "media-stage-subtitle", children: "Add images or videos for your listing." }),
      /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 bg-white", children: /* @__PURE__ */ jsx("div", { className: "progress", style: { height: "8px" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "progress-bar bg-primary",
          role: "progressbar",
          style: { width: `${progressPercent}%` },
          "aria-valuenow": progressPercent,
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx("form", { className: "media-form", onSubmit: handleNext, children: /* @__PURE__ */ jsxs("div", { className: "sell-form-inner", children: [
      !canPublish && /* @__PURE__ */ jsxs(
        "div",
        {
          className: "alert border-0 mb-4",
          style: {
            background: "#FFF4E5",
            color: "#8A4B08",
            borderRadius: "18px",
            padding: "16px 18px"
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: "fw-bold mb-1", children: "Verification required to publish" }),
            /* @__PURE__ */ jsx("div", { className: "small mb-0", children: publishBlockedMessage })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "List Type",
          title: summaryData.listType === "Auction" ? "Auction Product" : "Normal Product",
          subtitle: summaryData.listTypeDescription,
          onEdit: onEditListType
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Category",
          title: summaryData.category?.name || "Category",
          subtitle: `${summaryData.subCategory?.name || ""}${summaryData.childCategory ? " > " + summaryData.childCategory.name : ""}`,
          icon: summaryData.categoryIcon,
          onEdit: onEditCategory
        }
      ),
      /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Listing Details",
          title: summaryData.listingTitle || "Untitled Listing",
          onEdit: onEditDetails
        }
      ),
      (summaryData.category?.id === 222 || summaryData.category?.id === 311 || String(summaryData.category?.id) === "222" || String(summaryData.category?.id) === "311") && /* @__PURE__ */ jsx(
        SummaryCard,
        {
          type: "Verification",
          title: summaryData.category?.id === 222 || String(summaryData.category?.id) === "222" ? "Property Verified" : "Vehicle Verified",
          onEdit: onEditVerification
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "upload-dropzone p-5 text-center border rounded cursor-pointer mb-4",
          style: { borderStyle: "dashed", backgroundColor: "#f9f9f9" },
          onClick: () => fileInputRef.current?.click(),
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                hidden: true,
                ref: fileInputRef,
                multiple: true,
                accept: "image/png, image/jpeg, image/webp, image/gif, video/mp4, video/webm, video/quicktime",
                onChange: handleFileChange
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "upload-dropzone-content", children: [
              /* @__PURE__ */ jsx("i", { className: "fa-solid fa-cloud-arrow-up fa-3x mb-3 text-muted" }),
              /* @__PURE__ */ jsx("h5", { className: "fw-bold text-dark", children: "Click to upload or drag and drop" }),
              /* @__PURE__ */ jsx("p", { className: "text-dark small mb-0", children: "PNG, JPG, WEBP or GIF (max. 10MB) / MP4, WEBM or MOV (max. 15MB)" })
            ] })
          ]
        }
      ),
      error && /* @__PURE__ */ jsx("div", { className: "alert alert-danger", children: error }),
      (files.length > 0 || existingFiles.length > 0) && /* @__PURE__ */ jsxs("div", { className: "upload-preview-grid mt-4", children: [
        existingFiles.map((url, idx) => {
          const isVideo = /\.(mp4|webm|mov)$/i.test(url);
          const fullUrl = url.startsWith("http") ? url : `https://admin.xpertbid.com${url}`;
          return /* @__PURE__ */ jsxs("div", { className: "upload-preview-item position-relative", children: [
            isVideo ? /* @__PURE__ */ jsx("video", { src: fullUrl, className: "w-100 h-100 object-fit-cover rounded" }) : /* @__PURE__ */ jsx("img", { src: fullUrl, alt: "preview", className: "w-100 h-100 object-fit-cover rounded" }),
            /* @__PURE__ */ jsx("span", { className: "position-absolute bottom-0 start-0 m-2 badge bg-primary", children: "Saved" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "btn-close position-absolute top-0 end-0 m-2 bg-white p-2",
                "aria-label": "Remove",
                onClick: () => {
                  if (setExistingFiles) {
                    const newExisting = [...existingFiles];
                    newExisting.splice(idx, 1);
                    setExistingFiles(newExisting);
                  }
                },
                style: { opacity: 0.8 }
              }
            )
          ] }, `existing-${idx}`);
        }),
        files.map((file, idx) => /* @__PURE__ */ jsxs("div", { className: "upload-preview-item position-relative", children: [
          file.type.startsWith("video") ? /* @__PURE__ */ jsx("video", { src: getPreview(file), className: "w-100 h-100 object-fit-cover rounded" }) : /* @__PURE__ */ jsx("img", { src: getPreview(file), alt: "preview", className: "w-100 h-100 object-fit-cover rounded" }),
          /* @__PURE__ */ jsx("span", { className: "position-absolute bottom-0 start-0 m-2 badge bg-success", children: "New" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "btn-close position-absolute top-0 end-0 m-2 bg-white p-2",
              "aria-label": "Remove",
              onClick: () => removeFile(idx),
              style: { opacity: 0.8 }
            }
          )
        ] }, `new-${idx}`))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "media-stage-actions d-flex justify-content-between align-items-center mt-5", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "btn btn-black px-4",
            onClick: onBack,
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "btn btn-black px-5",
            disabled: !canPublish || files.length === 0 && existingFiles.length === 0,
            title: !canPublish ? publishBlockedMessage : void 0,
            children: canPublish ? "Continue" : "Verification Required"
          }
        )
      ] })
    ] }) })
  ] });
}
function Create({ categories, countries = [], profileLocation = null, listing = null, vehicleVerification = null, propertyVerification = null }) {
  const { auth } = usePage().props;
  const individualVerificationStatus = auth?.user?.individual_verification?.status || auth?.user?.individualVerification?.status || "";
  const corporateVerificationStatus = auth?.user?.corporate_verification?.status || auth?.user?.corporateVerification?.status || "";
  const canPublishListing = [individualVerificationStatus, corporateVerificationStatus].some(
    (status) => ["verified", "approved"].includes(String(status || "").toLowerCase())
  );
  const publishBlockedMessage = "Complete individual or corporate verification before publishing a listing. You can still save it as a draft.";
  const listingData = listing?.listing_data || {};
  const categoryFeatures = listing?.category_features || {};
  const initialListType = listing?.list_type === "normal" || listing?.listing_type === "normal" ? "normal_list" : listing?.list_type === "business" || listing?.listing_type === "business" ? "business_list" : "auction";
  const [step, setStep] = useState(listing ? "details" : "listType");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const buildAbsoluteMediaUrl = (path) => {
    if (!path) return "https://admin.xpertbid.com/assets/images/category_images/1750684943_6859550f2948f.png";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const clean = path.replace(/^\/+/, "");
    return `https://admin.xpertbid.com/${clean}`;
  };
  const getCategoryMedia = (item) => {
    const candidate = item?.image || item?.icon || item?.thumbnail || item?.photo || item?.media;
    return buildAbsoluteMediaUrl(candidate);
  };
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("T") && dateStr.length >= 16) return dateStr.substring(0, 16);
    try {
      const date = new Date(dateStr);
      return dateStr.replace(" ", "T").substring(0, 16);
    } catch (e) {
      return "";
    }
  };
  const [formData, setFormData] = useState({
    list_type: listing ? initialListType : "auction",
    category_id: listing?.category_id || "",
    sub_category_id: listing?.sub_category_id || "",
    child_category_id: listing?.child_category_id || "",
    title: listing?.title || "",
    description: listing?.description || "",
    minimum_bid: listing?.minimum_bid || listingData.minimum_bid || listingData.start_price || listingData.price || "",
    reserve_price: listing?.reserve_price || listingData.reserve_price || "",
    start_date: formatDateForInput(listing?.start_date),
    end_date: formatDateForInput(listing?.end_date),
    variations: listing?.variations || listingData.variations || [],
    discount_type: listing?.discount_type || listingData.discount_type || "",
    discount_value: listing?.discount_value || listingData.discount_value || "",
    status: listing?.status || "inactive",
    property_type: listing?.property_type || propertyVerification?.property_type || categoryFeatures.property_type || "",
    property_address: listing?.property_address || propertyVerification?.property_address || categoryFeatures.property_address || "",
    title_deed_number: listing?.title_deed_number || propertyVerification?.title_deed_number || categoryFeatures.title_deed_number || "",
    property_documents: [],
    vehicle_make_model: listing?.vehicle_make_model || vehicleVerification?.vehicle_make_model || categoryFeatures.vehicle_make_model || "",
    year_of_manufacture: listing?.year_of_manufacture || vehicleVerification?.year_of_manufacture || categoryFeatures.year_of_manufacture || "",
    chassis_vin: listing?.chassis_vin || vehicleVerification?.chassis_vin || categoryFeatures.chassis_vin || "",
    vehicle_documents: [],
    existing_property_documents: propertyVerification?.property_documents || categoryFeatures.property_documents || [],
    existing_vehicle_documents: vehicleVerification?.vehicle_documents || categoryFeatures.vehicle_documents || [],
    category_features: categoryFeatures,
    stock: listing?.stock || listingData.stock || "",
    quantity: listingData.quantity || "",
    country_id: ["", null, void 0, "null", "undefined"].includes(listing?.country_id) ? ["", null, void 0, "null", "undefined"].includes(listingData.country_id) ? "" : String(listingData.country_id) : String(listing?.country_id),
    state_id: ["", null, void 0, "null", "undefined"].includes(listing?.state_id) ? ["", null, void 0, "null", "undefined"].includes(listingData.state_id) ? "" : String(listingData.state_id) : String(listing?.state_id),
    city_id: ["", null, void 0, "null", "undefined"].includes(listing?.city_id) ? ["", null, void 0, "null", "undefined"].includes(listingData.city_id) ? "" : String(listingData.city_id) : String(listing?.city_id)
  });
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState(() => {
    if (listing?.album_urls?.length) {
      return listing.album_urls;
    }
    if (listing?.album) {
      try {
        const album = typeof listing.album === "string" ? JSON.parse(listing.album) : listing.album;
        return Array.isArray(album) ? album.map((item) => buildAbsoluteMediaUrl(item)) : [];
      } catch (e) {
        console.error("Failed to parse existing album", e);
        return [];
      }
    }
    return listing?.image_url ? [listing.image_url] : listing?.image ? [buildAbsoluteMediaUrl(listing.image)] : [];
  });
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [locationCountries, setLocationCountries] = useState(countries || []);
  const [locationStates, setLocationStates] = useState([]);
  const [locationCities, setLocationCities] = useState([]);
  const [autoLocationTried, setAutoLocationTried] = useState(false);
  const [profileLocationTried, setProfileLocationTried] = useState(false);
  const isDraftListing = listing?.is_draft === true || listing?.status === "draft";
  const hasValidLocationId = (value) => !["", null, void 0, "null", "undefined", 0, "0"].includes(value);
  const normalizeLocationName = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const findLocationMatch = (items, targetName) => {
    if (!targetName || !Array.isArray(items)) return null;
    const target = normalizeLocationName(targetName);
    if (!target) return null;
    return items.find((item) => {
      const name = normalizeLocationName(item?.name);
      return name === target || name.includes(target) || target.includes(name);
    }) || null;
  };
  const loadStates = async (countryId) => {
    if (!countryId) {
      setLocationStates([]);
      return [];
    }
    try {
      const res = await axios.get("/get-states/" + countryId);
      const states = res.data?.state || [];
      setLocationStates(states);
      return states;
    } catch (err) {
      console.error("Failed to fetch states", err);
      setLocationStates([]);
      return [];
    }
  };
  const loadCities = async (stateId) => {
    if (!stateId) {
      setLocationCities([]);
      return [];
    }
    try {
      const res = await axios.get("/get-cities/" + stateId);
      const cities = res.data?.city || [];
      setLocationCities(cities);
      return cities;
    } catch (err) {
      console.error("Failed to fetch cities", err);
      setLocationCities([]);
      return [];
    }
  };
  const detectLocationFromBrowser = () => new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    const geoErrorMap = {
      1: "PERMISSION_DENIED",
      2: "POSITION_UNAVAILABLE",
      3: "TIMEOUT"
    };
    if (navigator?.permissions?.query) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        console.info(`[Geolocation] permission state: ${status.state}`);
      }).catch(() => {
      });
    }
    const getCurrentPositionAsync = (options) => new Promise((resolvePosition, rejectPosition) => {
      navigator.geolocation.getCurrentPosition(resolvePosition, rejectPosition, options);
    });
    const resolveAddressFromCoords = async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      return {
        country: data?.countryName || "",
        state: data?.principalSubdivision || "",
        city: data?.city || data?.locality || ""
      };
    };
    const failWithGeoError = (error) => {
      reject({
        code: error?.code ?? null,
        reason: geoErrorMap[error?.code] || "UNKNOWN",
        message: error?.message || "Geolocation failed"
      });
    };
    (async () => {
      try {
        const position = await getCurrentPositionAsync({
          enableHighAccuracy: false,
          timeout: 1e4,
          maximumAge: 3e5
        });
        const detected = await resolveAddressFromCoords(position);
        resolve(detected);
      } catch (firstError) {
        try {
          const retryPosition = await getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 16e3,
            maximumAge: 0
          });
          const detected = await resolveAddressFromCoords(retryPosition);
          resolve(detected);
        } catch (retryError) {
          failWithGeoError(retryError || firstError);
        }
      }
    })().catch((error) => failWithGeoError(error));
  });
  const detectLocationFromIP = async () => {
    const response = await fetch("/detect-location-ip");
    const data = await response.json();
    return {
      country: data?.country || "",
      state: data?.state || "",
      city: data?.city || "",
      source: data?.source || "ip"
    };
  };
  useEffect(() => {
    if (listing && categories && !selectedCategory) {
      const cat = categories.find((c) => String(c.id) === String(listing.category_id));
      if (cat) setSelectedCategory(cat);
    }
  }, [listing, categories, selectedCategory]);
  useEffect(() => {
    if (Array.isArray(countries) && countries.length > 0) {
      setLocationCountries(countries);
      return;
    }
    axios.get("/get-countries").then((res) => setLocationCountries(res.data?.country || [])).catch((err) => console.error("Failed to fetch countries", err));
  }, [countries]);
  useEffect(() => {
    if (!hasValidLocationId(formData.country_id)) {
      setLocationStates([]);
      setLocationCities([]);
      return;
    }
    loadStates(formData.country_id);
  }, [formData.country_id]);
  useEffect(() => {
    if (!hasValidLocationId(formData.state_id)) {
      setLocationCities([]);
      return;
    }
    loadCities(formData.state_id);
  }, [formData.state_id]);
  useEffect(() => {
    if (profileLocationTried) return;
    if (!hasValidLocationId(profileLocation?.country_id) && !hasValidLocationId(profileLocation?.state_id) && !hasValidLocationId(profileLocation?.city_id)) {
      setProfileLocationTried(true);
      return;
    }
    let cancelled = false;
    const prefillFromProfileLocation = async () => {
      try {
        const countryId = hasValidLocationId(profileLocation?.country_id) ? String(profileLocation.country_id) : "";
        const stateIdFromProfile = hasValidLocationId(profileLocation?.state_id) ? String(profileLocation.state_id) : "";
        const cityIdFromProfile = hasValidLocationId(profileLocation?.city_id) ? String(profileLocation.city_id) : "";
        if (!countryId) return;
        const states = await loadStates(countryId);
        if (cancelled) return;
        const stateId = stateIdFromProfile && states.some((state) => String(state.id) === stateIdFromProfile) ? stateIdFromProfile : "";
        let cityId = "";
        if (stateId) {
          const cities = await loadCities(stateId);
          if (cancelled) return;
          if (cityIdFromProfile && cities.some((city) => String(city.id) === cityIdFromProfile)) {
            cityId = cityIdFromProfile;
          }
        }
        setFormData((prev) => {
          return {
            ...prev,
            country_id: hasValidLocationId(prev.country_id) ? prev.country_id : countryId,
            state_id: hasValidLocationId(prev.state_id) ? prev.state_id : stateId,
            city_id: hasValidLocationId(prev.city_id) ? prev.city_id : cityId
          };
        });
      } finally {
        if (!cancelled) {
          setProfileLocationTried(true);
        }
      }
    };
    prefillFromProfileLocation();
    return () => {
      cancelled = true;
    };
  }, [profileLocationTried, profileLocation, formData.country_id, formData.state_id, formData.city_id]);
  useEffect(() => {
    if (autoLocationTried) return;
    if (!profileLocationTried) return;
    if (!locationCountries.length) return;
    if (hasValidLocationId(formData.country_id) && hasValidLocationId(formData.state_id) && hasValidLocationId(formData.city_id)) return;
    let cancelled = false;
    const autoFillLocation = async () => {
      try {
        let detected = null;
        let ipDetected = null;
        try {
          detected = await detectLocationFromBrowser();
        } catch (err) {
          const reason = err?.reason || "UNKNOWN";
          const logTitle = reason === "PERMISSION_DENIED" ? "Geolocation permission denied, trying IP fallback." : "Geolocation unavailable (position/timeout), trying IP fallback.";
          console.warn(logTitle, {
            code: err?.code ?? null,
            reason,
            message: err?.message || ""
          });
        }
        if (!detected) {
          try {
            ipDetected = await detectLocationFromIP();
            detected = ipDetected;
          } catch (err) {
            console.warn("IP location fallback failed.");
            return;
          }
        } else {
          const needsIpEnrichment = !String(detected.state || "").trim() || !String(detected.city || "").trim();
          if (needsIpEnrichment) {
            try {
              ipDetected = await detectLocationFromIP();
              detected = {
                country: detected.country || ipDetected?.country || "",
                state: detected.state || ipDetected?.state || "",
                city: detected.city || ipDetected?.city || ""
              };
            } catch (err) {
            }
          }
        }
        if (cancelled || !detected) return;
        const selectedCountry = hasValidLocationId(formData.country_id) ? locationCountries.find((country) => String(country.id) === String(formData.country_id)) : null;
        const detectedCountry = findLocationMatch(locationCountries, detected.country);
        const matchedCountry = selectedCountry || detectedCountry;
        if (!matchedCountry) return;
        const states = await loadStates(matchedCountry.id);
        if (cancelled) return;
        const matchedState = findLocationMatch(states, detected.state);
        const stateId = hasValidLocationId(formData.state_id) ? String(formData.state_id) : matchedState?.id ? String(matchedState.id) : "";
        if (!matchedState && String(detected.state || "").trim()) {
          console.info("[Geolocation] state not matched in local DB", {
            detectedState: detected.state,
            country: detected.country
          });
        }
        let cityId = "";
        if (stateId) {
          const cities = await loadCities(stateId);
          if (cancelled) return;
          const matchedCity = findLocationMatch(cities, detected.city);
          cityId = hasValidLocationId(formData.city_id) ? String(formData.city_id) : matchedCity?.id ? String(matchedCity.id) : "";
          if (!matchedCity && String(detected.city || "").trim()) {
            console.info("[Geolocation] city not matched in local DB", {
              detectedCity: detected.city,
              stateId
            });
          }
        }
        setFormData((prev) => {
          return {
            ...prev,
            country_id: hasValidLocationId(prev.country_id) ? prev.country_id : matchedCountry.id || "",
            state_id: hasValidLocationId(prev.state_id) ? prev.state_id : stateId,
            city_id: hasValidLocationId(prev.city_id) ? prev.city_id : cityId
          };
        });
      } finally {
        if (!cancelled) {
          setAutoLocationTried(true);
        }
      }
    };
    autoFillLocation();
    return () => {
      cancelled = true;
    };
  }, [autoLocationTried, profileLocationTried, locationCountries, formData.country_id, formData.state_id, formData.city_id]);
  useEffect(() => {
    if (formData.category_id) {
      let type = formData.list_type;
      if (type === "normal_list") type = "normal";
      if (type === "business_list") type = "business";
      axios.get("/get-dynamic-fields/" + formData.category_id + "/" + type).then((res) => {
        if (res.data.status === "success") {
          setDynamicFields(res.data.data || []);
        }
      }).catch((err) => console.error("Failed to fetch dynamic fields", err));
    } else {
      setDynamicFields([]);
    }
  }, [formData.category_id, formData.list_type]);
  const handleListTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, list_type: type }));
    setStep("category");
  };
  const handleCategorySelect = ({ category, subCategory, childCategory }) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    setSelectedChildCategory(childCategory);
    setFormData((prev) => ({
      ...prev,
      category_id: category?.id,
      sub_category_id: subCategory?.id || "",
      child_category_id: childCategory?.id || ""
    }));
    setStep("details");
  };
  const handleDetailsContinue = () => {
    const catId = String(formData.category_id);
    if (catId === "222" || catId === "311") {
      setStep("verification");
    } else {
      setStep("media");
    }
  };
  const handleVerificationContinue = () => {
    setStep("media");
  };
  const submitAuction = async (status) => {
    if (!auth.user) {
      router.get(route("login"));
      return;
    }
    if (status === "draft") {
      setIsSavingDraft(true);
    }
    let listing_type = formData.list_type;
    if (listing_type === "normal_list") listing_type = "normal";
    if (listing_type === "business_list") listing_type = "business";
    const cleanData = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== void 0 && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
    };
    const listing_data = cleanData({
      price: formData.minimum_bid,
      reserve_price: formData.reserve_price,
      start_date: formData.start_date,
      end_date: formData.end_date,
      variations: formData.variations,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      stock: formData.stock,
      quantity: formData.quantity,
      country_id: formData.country_id,
      state_id: formData.state_id,
      city_id: formData.city_id
    });
    let category_features = { ...formData.category_features };
    const catId = String(formData.category_id);
    if (catId === "222") {
      category_features.property_type = formData.property_type;
      category_features.property_address = formData.property_address;
      category_features.title_deed_number = formData.title_deed_number;
    } else if (catId === "311") {
      category_features.vehicle_make_model = formData.vehicle_make_model;
      category_features.year_of_manufacture = formData.year_of_manufacture;
      category_features.chassis_vin = formData.chassis_vin;
    }
    category_features = cleanData(category_features);
    const data = new FormData();
    const selectedCurrency = typeof window !== "undefined" ? localStorage.getItem("xb_currency") || "PKR" : "PKR";
    const sourcePlatform = typeof window !== "undefined" ? "web" : null;
    data.append("listing_type", listing_type);
    data.append("category_id", formData.category_id);
    data.append("sub_category_id", formData.sub_category_id);
    data.append("child_category_id", formData.child_category_id);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("country_id", formData.country_id || "");
    data.append("state_id", formData.state_id || "");
    data.append("city_id", formData.city_id || "");
    data.append("status", status);
    data.append("selected_currency", selectedCurrency);
    if (sourcePlatform) {
      data.append("listing_source", sourcePlatform);
    }
    data.append("listing_data", JSON.stringify(listing_data));
    data.append("category_features", JSON.stringify(category_features));
    files.forEach((file) => data.append("album[]", file));
    existingFiles.forEach((url) => data.append("existing_album[]", url));
    if (catId === "222") {
      formData.property_documents?.forEach((file) => data.append("property_documents[]", file));
    } else if (catId === "311") {
      formData.vehicle_documents?.forEach((file) => data.append("vehicle_documents[]", file));
    }
    data.append("user_id", auth.user.id);
    try {
      if (listing && listing.id) {
        data.append("_method", "PUT");
        router.post(
          isDraftListing ? route("auctions.drafts.update", { draft: listing.id }) : route("auctions.update", { listing: listing.slug || listing.id }),
          data,
          {
            forceFormData: true,
            onSuccess: () => {
              setIsSavingDraft(false);
            },
            onError: (errors) => {
              console.error("Submission failed", errors);
              alert("Failed to update listing. Please check the form.");
              setIsSavingDraft(false);
            }
          }
        );
      } else {
        router.post("/auctions", data, {
          forceFormData: true,
          onSuccess: () => {
            setIsSavingDraft(false);
          },
          onError: (errors) => {
            console.error("Submission failed", errors);
            alert("Failed to submit listing. Please check the form.");
            setIsSavingDraft(false);
          }
        });
      }
    } catch (error) {
      console.error("Submission error", error);
      setIsSavingDraft(false);
    }
  };
  const handleSubmit = () => {
    if (!canPublishListing) {
      alert(publishBlockedMessage);
      return;
    }
    submitAuction(listing ? "resubmit" : "inactive");
  };
  const handleSaveDraft = () => submitAuction("draft");
  const summaryData = {
    listType: formData.list_type === "auction" ? "Auction" : formData.list_type === "business_list" ? "Business List" : "Normal List",
    listTypeDescription: formData.list_type === "auction" ? "Let buyers bid and compete for your listing." : formData.list_type === "business_list" ? "Manage inventory, stock, and business-specific details." : "Set a fixed price for direct purchase requests.",
    category: selectedCategory,
    subCategory: selectedSubCategory,
    childCategory: selectedChildCategory,
    categoryIcon: getCategoryMedia(selectedCategory),
    listingTitle: formData.title
  };
  const needsVerificationStep = ["222", "311"].includes(String(formData.category_id || ""));
  const progressSteps = needsVerificationStep ? ["listType", "category", "details", "verification", "media"] : ["listType", "category", "details", "media"];
  const currentStepIndex = Math.max(progressSteps.indexOf(step), 0);
  const progressPercent = Math.round((currentStepIndex + 1) / progressSteps.length * 100);
  return /* @__PURE__ */ jsxs(AppLayout, { title: listing ? "Edit Listing" : "Start Selling", children: [
    /* @__PURE__ */ jsx(Head, { title: listing ? "Edit Listing" : "Start Selling" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white min-vh-100", children: [
      step === "listType" && /* @__PURE__ */ jsx(
        ListTypeSelection,
        {
          onSelect: handleListTypeSelect,
          onSaveDraft: handleSaveDraft,
          isSavingDraft,
          progressPercent
        }
      ),
      step === "category" && /* @__PURE__ */ jsx(
        CategorySelection,
        {
          categories,
          onSelect: handleCategorySelect,
          onBack: () => setStep("listType"),
          onSaveDraft: handleSaveDraft,
          isSavingDraft,
          progressPercent
        }
      ),
      step === "details" && /* @__PURE__ */ jsx(
        DetailsForm,
        {
          listType: formData.list_type,
          formData,
          setFormData,
          countries: locationCountries,
          states: locationStates,
          cities: locationCities,
          summaryData,
          dynamicFields,
          onContinue: handleDetailsContinue,
          onBack: () => setStep("category"),
          onEditListType: () => setStep("listType"),
          onEditCategory: () => setStep("category"),
          onSaveDraft: handleSaveDraft,
          isSavingDraft,
          progressPercent
        }
      ),
      step === "verification" && /* @__PURE__ */ jsx(
        VerificationStep,
        {
          categoryId: formData.category_id,
          formData,
          setFormData,
          summaryData,
          onContinue: handleVerificationContinue,
          onBack: () => setStep("details"),
          onEditListType: () => setStep("listType"),
          onEditCategory: () => setStep("category"),
          onEditDetails: () => setStep("details"),
          onSaveDraft: handleSaveDraft,
          isSavingDraft,
          progressPercent
        }
      ),
      step === "media" && /* @__PURE__ */ jsx(
        MediaUpload,
        {
          files,
          setFiles,
          existingFiles,
          setExistingFiles,
          summaryData,
          onContinue: handleSubmit,
          onBack: () => setStep(formData.category_id === "222" || formData.category_id === "311" ? "verification" : "details"),
          onEditListType: () => setStep("listType"),
          onEditCategory: () => setStep("category"),
          onEditDetails: () => setStep("details"),
          onEditVerification: () => setStep("verification"),
          onSaveDraft: handleSaveDraft,
          isSavingDraft,
          canPublish: canPublishListing,
          publishBlockedMessage,
          progressPercent
        }
      )
    ] })
  ] });
}
export {
  Create as default
};
