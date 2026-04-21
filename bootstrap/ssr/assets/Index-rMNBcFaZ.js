import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BWciRgbg.js";
import ExploreProducts from "./ExploreProducts-kg0d-6as.js";
import { P as Pagination } from "./Pagination-yoJpev1-.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./AuctionCard-CZnrqB8V.js";
import "./OwnerInfoRow-BzmY3N9i.js";
import "./FavoriteToggleButton-1jmbejDw.js";
const parseDynamicOptions = (options) => {
  if (Array.isArray(options)) {
    return options.filter((item) => String(item || "").trim() !== "");
  }
  if (typeof options === "string") {
    const trimmed = options.trim();
    if (trimmed === "") {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => String(item || "").trim() !== "");
      }
    } catch (error) {
    }
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};
const getInitialDynamicFilters = (filters = {}) => {
  const initial = {};
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (!String(key).startsWith("df_")) {
      return;
    }
    if (Array.isArray(value)) {
      initial[key] = value.map((item) => String(item));
      return;
    }
    if (value === null || value === void 0 || value === "") {
      return;
    }
    const text = String(value);
    initial[key] = text.includes(",") ? text.split(",").map((item) => item.trim()).filter(Boolean) : text;
  });
  return initial;
};
function Index({
  products = { data: [], links: [] },
  categories = [],
  currentCategory = null,
  currentTopCategory = null,
  subcategoryTabs = [],
  currentSubcategory = null,
  childCategoryTabs = [],
  countries = [],
  dynamicFields = [],
  filters = {}
}) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(filters?.country_id ? String(filters.country_id) : "");
  const [selectedStateId, setSelectedStateId] = useState(filters?.state_id ? String(filters.state_id) : "");
  const [selectedCityId, setSelectedCityId] = useState(filters?.city_id ? String(filters.city_id) : "");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [dynamicFilterValues, setDynamicFilterValues] = useState(() => getInitialDynamicFilters(filters));
  const heroImage = currentTopCategory?.image_url || currentCategory?.image_url || null;
  const currentType = filters?.type || "auction";
  const showChildTabs = Boolean(currentSubcategory);
  const tabs = [
    { key: "auction", label: "Auction", mobileLabel: "Auction" },
    { key: "normal", label: "Normal Products", mobileLabel: "Normal" },
    { key: "business", label: "Business Products", mobileLabel: "Business" }
  ];
  const handleTabChange = (type) => {
    router.get(
      route("marketplace.index", route().params),
      {
        ...filters,
        type,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      route("marketplace.index", route().params),
      {
        ...filters,
        search: searchTerm,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const handleCategoryTabChange = (slug) => {
    router.get(
      route("marketplace.index", { slug }),
      {
        ...filters,
        page: 1
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  useEffect(() => {
    setSearchTerm(filters?.search || "");
    setSelectedCountryId(filters?.country_id ? String(filters.country_id) : "");
    setSelectedStateId(filters?.state_id ? String(filters.state_id) : "");
    setSelectedCityId(filters?.city_id ? String(filters.city_id) : "");
    setDynamicFilterValues(getInitialDynamicFilters(filters));
  }, [filters]);
  useEffect(() => {
    let cancelled = false;
    const loadStates = async () => {
      if (!selectedCountryId) {
        setStates([]);
        setSelectedStateId("");
        setCities([]);
        setSelectedCityId("");
        return;
      }
      try {
        const response = await fetch(`/get-states/${selectedCountryId}`);
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const nextStates = Array.isArray(data?.state) ? data.state : [];
        setStates(nextStates);
        if (!nextStates.find((state) => String(state.id) === String(selectedStateId))) {
          setSelectedStateId("");
          setCities([]);
          setSelectedCityId("");
        }
      } catch (error) {
        if (!cancelled) {
          setStates([]);
          setSelectedStateId("");
          setCities([]);
          setSelectedCityId("");
        }
      }
    };
    loadStates();
    return () => {
      cancelled = true;
    };
  }, [selectedCountryId]);
  useEffect(() => {
    let cancelled = false;
    const loadCities = async () => {
      if (!selectedStateId) {
        setCities([]);
        setSelectedCityId("");
        return;
      }
      try {
        const response = await fetch(`/get-cities/${selectedStateId}`);
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const nextCities = Array.isArray(data?.city) ? data.city : [];
        setCities(nextCities);
        if (!nextCities.find((city) => String(city.id) === String(selectedCityId))) {
          setSelectedCityId("");
        }
      } catch (error) {
        if (!cancelled) {
          setCities([]);
          setSelectedCityId("");
        }
      }
    };
    loadCities();
    return () => {
      cancelled = true;
    };
  }, [selectedStateId]);
  const applyFilters = () => {
    const nextFilters = {
      ...filters,
      search: searchTerm,
      page: 1
    };
    if (selectedCountryId) nextFilters.country_id = selectedCountryId;
    else delete nextFilters.country_id;
    if (selectedStateId) nextFilters.state_id = selectedStateId;
    else delete nextFilters.state_id;
    if (selectedCityId) nextFilters.city_id = selectedCityId;
    else delete nextFilters.city_id;
    dynamicFields.forEach((field) => {
      const key = `df_${field.id}`;
      const value = dynamicFilterValues[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          nextFilters[key] = value.join(",");
        } else {
          delete nextFilters[key];
        }
        return;
      }
      if (value !== void 0 && value !== null && String(value).trim() !== "") {
        nextFilters[key] = value;
      } else {
        delete nextFilters[key];
      }
    });
    router.get(route("marketplace.index", route().params), nextFilters, {
      preserveState: true,
      preserveScroll: true
    });
    setIsFilterDrawerOpen(false);
  };
  const clearFilters = () => {
    setSelectedCountryId("");
    setSelectedStateId("");
    setSelectedCityId("");
    setStates([]);
    setCities([]);
    setDynamicFilterValues({});
    const nextFilters = {
      ...filters,
      search: searchTerm,
      page: 1
    };
    delete nextFilters.country_id;
    delete nextFilters.state_id;
    delete nextFilters.city_id;
    Object.keys(nextFilters).forEach((key) => {
      if (key.startsWith("df_")) {
        delete nextFilters[key];
      }
    });
    router.get(route("marketplace.index", route().params), nextFilters, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const handleCheckboxDynamicChange = (fieldId, option, checked) => {
    const key = `df_${fieldId}`;
    setDynamicFilterValues((prev) => {
      const previousValue = prev[key];
      const currentValues = Array.isArray(previousValue) ? previousValue : previousValue ? [String(previousValue)] : [];
      const nextValues = checked ? Array.from(/* @__PURE__ */ new Set([...currentValues, option])) : currentValues.filter((item) => item !== option);
      return {
        ...prev,
        [key]: nextValues
      };
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: currentCategory?.meta_title || "Marketplace", children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: currentCategory?.meta_title || "Marketplace | XpertBid" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: currentCategory?.meta_description || "Explore our marketplace for the best deals."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pb-5 bg-light min-vh-100", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "marketplace-topbar-wrap",
          style: heroImage ? {
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url(${heroImage})`
          } : void 0,
          children: /* @__PURE__ */ jsx("div", { className: "container-fluid px-lg-5", children: /* @__PURE__ */ jsxs("div", { className: "marketplace-topbar p-3 p-lg-4", children: [
            /* @__PURE__ */ jsx("div", { className: "marketplace-selected-category mb-3", children: currentCategory?.name || currentTopCategory?.name || "Marketplace" }),
            currentTopCategory && !showChildTabs && /* @__PURE__ */ jsxs("div", { className: "marketplace-subcategory-tabs mb-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(currentTopCategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === currentTopCategory.slug ? "is-active" : ""}`,
                  children: [
                    "All ",
                    currentTopCategory.name
                  ]
                }
              ),
              subcategoryTabs.map((subcategory) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(subcategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === subcategory.slug ? "is-active" : ""}`,
                  children: subcategory.name
                },
                subcategory.id
              ))
            ] }),
            currentTopCategory && showChildTabs && /* @__PURE__ */ jsxs("div", { className: "marketplace-subcategory-tabs mb-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(currentTopCategory.slug),
                  className: "marketplace-subcategory-back",
                  "aria-label": "Back to subcategories",
                  children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "←" })
                }
              ),
              childCategoryTabs.map((childCategory) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCategoryTabChange(childCategory.slug),
                  className: `marketplace-subcategory-tab ${currentCategory?.slug === childCategory.slug ? "is-active" : ""}`,
                  children: childCategory.name
                },
                childCategory.id
              ))
            ] }),
            /* @__PURE__ */ jsx("form", { onSubmit: handleSearchSubmit, className: "marketplace-searchbar mb-3", children: /* @__PURE__ */ jsxs("div", { className: "marketplace-searchbar-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  placeholder: "Search products..."
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "marketplace-filter-btn",
                  onClick: () => setIsFilterDrawerOpen(true),
                  "aria-label": "Open filters",
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 6h16M7 12h10M10 18h4", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }) })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "marketplace-top-tabs", children: tabs.map((tab) => {
              const isActive = tab.key === "auction" && currentType === "auction" || tab.key === "normal" && ["normal", "normal_list"].includes(currentType) || tab.key === "business" && ["business", "business_list"].includes(currentType);
              const tabType = tab.key === "normal" ? "normal" : tab.key === "business" ? "business" : "auction";
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleTabChange(tabType),
                  className: `marketplace-top-tab ${isActive ? "is-active" : ""}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "d-none d-md-inline", children: tab.label }),
                    /* @__PURE__ */ jsx("span", { className: "d-inline d-md-none", children: tab.mobileLabel || tab.label })
                  ]
                },
                tab.key
              );
            }) })
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "container-fluid px-lg-5 pt-4", children: [
        currentCategory?.seo_short_content && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-4 p-4 shadow-sm mb-4 border text-center text-dark content-wrapper", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: currentCategory.seo_short_content } }) }),
        /* @__PURE__ */ jsxs("div", { className: "mkt-right", children: [
          /* @__PURE__ */ jsx(ExploreProducts, { products: products.data }),
          products.links && /* @__PURE__ */ jsx("div", { className: "mt-5 d-flex justify-content-center", children: /* @__PURE__ */ jsx(Pagination, { links: products.links }) }),
          currentCategory?.seo_content && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-4 p-5 shadow-sm mt-5 border text-dark content-wrapper", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: currentCategory.seo_content } }) })
        ] })
      ] }),
      isFilterDrawerOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "marketplace-filter-backdrop", onClick: () => setIsFilterDrawerOpen(false) }),
        /* @__PURE__ */ jsxs("aside", { className: "marketplace-filter-drawer", children: [
          /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-header", children: [
            /* @__PURE__ */ jsx("h3", { children: "Filters" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFilterDrawerOpen(false), "aria-label": "Close filters", children: "×" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-group", children: [
              /* @__PURE__ */ jsx("label", { children: "Country" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedCountryId,
                  onChange: (e) => {
                    const value = e.target.value;
                    setSelectedCountryId(value);
                    setSelectedStateId("");
                    setSelectedCityId("");
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All Countries" }),
                    countries.map((country) => /* @__PURE__ */ jsx("option", { value: country.id, children: country.name }, country.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-group", children: [
              /* @__PURE__ */ jsx("label", { children: "State" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedStateId,
                  onChange: (e) => {
                    setSelectedStateId(e.target.value);
                    setSelectedCityId("");
                  },
                  disabled: !selectedCountryId,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All States" }),
                    states.map((state) => /* @__PURE__ */ jsx("option", { value: state.id, children: state.name }, state.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-group", children: [
              /* @__PURE__ */ jsx("label", { children: "City" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedCityId,
                  onChange: (e) => setSelectedCityId(e.target.value),
                  disabled: !selectedStateId,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "All Cities" }),
                    cities.map((city) => /* @__PURE__ */ jsx("option", { value: city.id, children: city.name }, city.id))
                  ]
                }
              )
            ] }),
            dynamicFields.map((field) => {
              const key = `df_${field.id}`;
              const inputType = String(field.input_type || "").toLowerCase();
              const options = parseDynamicOptions(field.options);
              if (options.length === 0) {
                return null;
              }
              const fieldLabel = field.label || field.field_name || `Field ${field.id}`;
              const selectedValue = dynamicFilterValues[key];
              return /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-group", children: [
                /* @__PURE__ */ jsx("label", { children: fieldLabel }),
                inputType === "select" && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: Array.isArray(selectedValue) ? "" : selectedValue || "",
                    onChange: (e) => setDynamicFilterValues((prev) => ({
                      ...prev,
                      [key]: e.target.value
                    })),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
                      options.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, `${field.id}-${option}`))
                    ]
                  }
                ),
                inputType === "radio" && /* @__PURE__ */ jsx("div", { className: "marketplace-filter-options", children: options.map((option) => /* @__PURE__ */ jsxs("label", { className: "marketplace-filter-option-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: `dynamic-radio-${field.id}`,
                      value: option,
                      checked: String(selectedValue || "") === option,
                      onChange: () => setDynamicFilterValues((prev) => ({
                        ...prev,
                        [key]: option
                      }))
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: option })
                ] }, `${field.id}-${option}`)) }),
                inputType === "checkbox" && /* @__PURE__ */ jsx("div", { className: "marketplace-filter-options", children: options.map((option) => {
                  const values = Array.isArray(selectedValue) ? selectedValue : selectedValue ? [String(selectedValue)] : [];
                  return /* @__PURE__ */ jsxs("label", { className: "marketplace-filter-option-row", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: values.includes(option),
                        onChange: (e) => handleCheckboxDynamicChange(field.id, option, e.target.checked)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: option })
                  ] }, `${field.id}-${option}`);
                }) }),
                !["select", "radio", "checkbox"].includes(inputType) && /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: Array.isArray(selectedValue) ? "" : selectedValue || "",
                    onChange: (e) => setDynamicFilterValues((prev) => ({
                      ...prev,
                      [key]: e.target.value
                    })),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
                      options.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, `${field.id}-${option}`))
                    ]
                  }
                )
              ] }, field.id);
            })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "marketplace-filter-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "filter-clear-btn", onClick: clearFilters, children: "Clear" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "filter-apply-btn", onClick: applyFilters, children: "Apply Filters" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                            .content-wrapper {
                                   color: #212529 !important;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                            .marketplace-topbar-wrap {
                                   width: 100%;
                                   background-color: #fff;
                                   background-position: center;
                                   background-repeat: no-repeat;
                                   background-size: cover;
                                   border-bottom: none;
                                   box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
                                   padding-top: 22px;
                                   padding-bottom: 22px;
                            }
                            .marketplace-topbar {
                                   width: 100%;
                                   border-radius: 28px;
                                   background: rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(5px);
                                   -webkit-backdrop-filter: blur(5px);
                                   min-height: 340px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                                   align-items: center;
                                   text-align: center;
                            }
                            .marketplace-topbar > * {
                                   width: 100%;
                            }
                            .marketplace-selected-category {
                                   color: #fff;
                                   font-size: 36px;
                                   font-weight: 800;
                                   line-height: 1.1;
                                   text-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);
                            }
                            .marketplace-searchbar input {
                                   width: 100%;
                                   height: 62px;
                                   border: none;
                                   border-radius: 16px;
                                   background: rgba(255, 255, 255, 0.92);
                                   padding: 0 20px;
                                   font-size: 15px;
                                   color: #111827;
                                   box-shadow: none;
                            }
                            .marketplace-searchbar input:focus {
                                   outline: none;
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-searchbar-row {
                                   display: grid;
                                   grid-template-columns: 1fr 58px;
                                   gap: 10px;
                                   align-items: center;
                            }
                            .marketplace-filter-btn {
                                   width: 58px;
                                   height: 58px;
                                   border: none;
                                   border-radius: 16px;
                                   background: #0f172a;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-filter-btn:hover {
                                   background: #111827;
                            }
                            .marketplace-filter-btn svg {
                                   width: 22px;
                                   height: 22px;
                            }
                            .marketplace-filter-backdrop {
                                   position: fixed;
                                   inset: 0;
                                   z-index: 1040;
                                   background: rgba(15, 23, 42, 0.42);
                            }
                            .marketplace-filter-drawer {
                                   position: fixed;
                                   top: 0;
                                   right: 0;
                                   width: 360px;
                                   max-width: 94vw;
                                   height: 100vh;
                                   z-index: 1050;
                                   background: #fff;
                                   box-shadow: -12px 0 28px rgba(15, 23, 42, 0.2);
                                   display: flex;
                                   flex-direction: column;
                            }
                            .marketplace-filter-header {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   padding: 20px 18px 14px;
                                   border-bottom: 1px solid #e5e7eb;
                            }
                            .marketplace-filter-header h3 {
                                   margin: 0;
                                   font-size: 20px;
                                   font-weight: 800;
                                   color: #0f172a;
                            }
                            .marketplace-filter-header button {
                                   width: 36px;
                                   height: 36px;
                                   border: none;
                                   border-radius: 10px;
                                   background: #f3f4f6;
                                   font-size: 24px;
                                   line-height: 1;
                                   color: #0f172a;
                            }
                            .marketplace-filter-body {
                                   flex: 1;
                                   overflow-y: auto;
                                   padding: 16px 18px;
                            }
                            .marketplace-filter-group {
                                   margin-bottom: 14px;
                            }
                            .marketplace-filter-group > label {
                                   display: block;
                                   margin-bottom: 8px;
                                   font-size: 13px;
                                   font-weight: 700;
                                   color: #0f172a;
                            }
                            .marketplace-filter-group select {
                                   width: 100%;
                                   height: 46px;
                                   border-radius: 12px;
                                   border: 1px solid #d1d5db;
                                   background: #fff;
                                   color: #111827;
                                   padding: 0 12px;
                            }
                            .marketplace-filter-options {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                            }
                            .marketplace-filter-option-row {
                                   display: flex;
                                   align-items: center;
                                   gap: 8px;
                                   font-size: 14px;
                                   color: #111827;
                            }
                            .marketplace-filter-footer {
                                   display: flex;
                                   gap: 10px;
                                   border-top: 1px solid #e5e7eb;
                                   padding: 14px 18px 16px;
                            }
                            .filter-clear-btn,
                            .filter-apply-btn {
                                   flex: 1;
                                   min-height: 44px;
                                   border-radius: 12px;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .filter-clear-btn {
                                   border: 1px solid #cbd5e1;
                                   background: #fff;
                                   color: #334155;
                            }
                            .filter-apply-btn {
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-top-tabs {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                            }
                            .marketplace-top-tab {
                                   min-height: 58px;
                                   border-radius: 16px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #5f6c80;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                                   box-shadow: none;
                            }
                            .marketplace-top-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                                   color: #435168;
                            }
                            .marketplace-top-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-tabs {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   justify-content: center;
                            }
                            .marketplace-subcategory-tab {
                                   min-height: 50px;
                                   padding: 0 20px;
                                   border-radius: 14px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #435168;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-subcategory-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-back {
                                   width: 50px;
                                   min-width: 50px;
                                   height: 50px;
                                   border-radius: 14px;
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   font-size: 20px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-back:hover {
                                   background: #0b1220;
                            }
                            @media (max-width: 767px) {
                                   .marketplace-topbar {
                                          padding-inline: 0;
                                          min-height: 380px;
                                   }
                                   .marketplace-selected-category {
                                          font-size: 28px;
                                   }
                                   .marketplace-top-tabs {
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                          gap: 8px;
                                   }
                                   .marketplace-top-tab {
                                          min-height: 46px;
                                          padding: 0 10px;
                                          font-size: 12px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-searchbar-row {
                                          grid-template-columns: 1fr 52px;
                                          gap: 8px;
                                   }
                                   .marketplace-filter-btn {
                                          width: 52px;
                                          height: 52px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-filter-drawer {
                                          width: 100%;
                                          max-width: 100%;
                                   }
                                   .marketplace-subcategory-tabs {
                                          display: flex;
                                          flex-wrap: nowrap;
                                          justify-content: center;
                                          align-items: center;
                                          gap: 10px;
                                          overflow-x: auto;
                                          padding-bottom: 4px;
                                          scrollbar-width: none;
                                   }
                                   .marketplace-subcategory-tabs::-webkit-scrollbar {
                                          display: none;
                                   }
                                   .marketplace-subcategory-tab {
                                          min-height: 44px;
                                          white-space: nowrap;
                                          flex: 0 0 auto;
                                          font-size: 13px;
                                   }
                                   .marketplace-subcategory-back {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 44px;
                                          flex: 0 0 auto;
                                   }
                            }
                     ` })
  ] });
}
export {
  Index as default
};
