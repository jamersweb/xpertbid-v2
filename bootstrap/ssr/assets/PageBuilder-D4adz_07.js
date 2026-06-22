import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useMemo } from "react";
import { useForm, Head, router } from "@inertiajs/react";
import { A as AdminLayout } from "./AdminLayout-Bstw8cGQ.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { S as SecondaryButton } from "./SecondaryButton-C9TQBbBR.js";
import { I as InputLabel } from "./InputLabel-CE_n4Upz.js";
import { I as InputError } from "./InputError-CBvD_6aD.js";
import { A as AuctionCard } from "./AuctionCard-C7p_2vdQ.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
/* empty css                */
/* empty css                    */
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "./CountdownTimer-BG03Al8T.js";
import "./Price-CF5NSPt0.js";
import "./FavoriteToggleButton-1jmbejDw.js";
import "./productUrl-BGZvQc2j.js";
import "ziggy-js";
import "./listingPricing-C5UuJtWm.js";
const IMAGE_FIELDS = [
  { key: "banner_img", label: "Banner Image (Desktop)" },
  { key: "banner_img_mob", label: "Banner Image (Mobile)" }
];
const emptySection = () => ({
  _clientId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  title: "",
  listing_ids: []
});
const createSectionClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) {
    return `/brand-assets/${path.replace(/^\/storage\//, "")}`;
  }
  return `/${path.replace(/^\/+/, "")}`;
};
const normalizeSection = (section) => ({
  _clientId: section?._clientId || createSectionClientId(),
  title: section?.title || "",
  listing_ids: Array.isArray(section?.listing_ids) ? section.listing_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0) : []
});
function BrandPageProductCard({ listing, selected = false, onClick = null, showPropertyMeta = true }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `position-relative brand-page-admin-card ${selected ? "brand-page-admin-card-selected" : ""}`,
      style: { cursor: onClick ? "pointer" : "default" },
      onClick: onClick || void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onKeyDown: (e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      },
      children: [
        /* @__PURE__ */ jsx(AuctionCard, { auction: listing, showPropertyMeta }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "position-absolute",
            style: {
              top: 12,
              right: 12,
              zIndex: 10,
              background: selected ? "#111827" : "rgba(17, 24, 39, 0.9)",
              color: "#fff",
              borderRadius: "999px",
              padding: "7px 11px",
              fontSize: 12,
              fontWeight: 700,
              pointerEvents: "none"
            },
            children: selected ? "Selected" : "Add Product"
          }
        ),
        onClick && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": `Select ${listing?.title || "product"}`,
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            },
            className: "position-absolute",
            style: { inset: 0, zIndex: 9, background: "transparent", border: 0, padding: 0 }
          }
        )
      ]
    }
  );
}
function PageBuilder({ brands = [], selectedBrand = null, brandListings = [] }) {
  const fileInputRefs = useRef({});
  const [sections, setSections] = useState([]);
  const [activePickerIndex, setActivePickerIndex] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [localPreviewUrls, setLocalPreviewUrls] = useState({});
  const {
    data,
    setData,
    processing,
    errors,
    reset
  } = useForm({
    banner_img: null,
    banner_img_mob: null,
    sections_json: "[]"
  });
  useEffect(() => {
    const nextSections = Array.isArray(selectedBrand?.page_sections) ? selectedBrand.page_sections.map(normalizeSection) : [];
    setSections(nextSections);
    setActivePickerIndex(null);
    setProductSearch("");
    setLocalPreviewUrls({});
    setData({
      banner_img: null,
      banner_img_mob: null,
      sections_json: JSON.stringify(nextSections)
    });
  }, [selectedBrand?.id]);
  useEffect(() => {
    setData("sections_json", JSON.stringify(sections));
  }, [sections]);
  const selectedBrandId = selectedBrand?.id ? String(selectedBrand.id) : "";
  const brandListingsById = useMemo(() => {
    return new Map((Array.isArray(brandListings) ? brandListings : []).map((listing) => [Number(listing.id), listing]));
  }, [brandListings]);
  const filteredBrandListings = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) {
      return Array.isArray(brandListings) ? brandListings : [];
    }
    return (Array.isArray(brandListings) ? brandListings : []).filter((listing) => {
      const title = String(listing?.title || "").toLowerCase();
      return title.includes(query) || String(listing?.id || "").includes(query);
    });
  }, [brandListings, productSearch]);
  const activeSection = activePickerIndex !== null ? sections[activePickerIndex] : null;
  const handleBrandChange = (brandId) => {
    router.get(route("admin.brand-pages.index"), { brand_id: brandId }, {
      preserveScroll: true,
      replace: true
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBrand?.id) return;
    router.post(route("admin.brand-pages.update", selectedBrand.id), {
      ...data,
      _method: "PUT"
    }, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        router.get(route("admin.brand-pages.index"), { brand_id: selectedBrand.id }, {
          preserveScroll: true,
          replace: true
        });
      }
    });
  };
  const updateSection = (index, key, value) => {
    setSections((current) => current.map((section, idx) => idx === index ? { ...section, [key]: value } : section));
  };
  const addSection = () => {
    setSections((current) => [...current, emptySection()]);
  };
  const removeSection = (index) => {
    setSections((current) => current.filter((_, idx) => idx !== index));
    setActivePickerIndex((current) => current === index ? null : current);
  };
  const toggleListingSelection = (listingId) => {
    if (activePickerIndex === null) return;
    setSections((current) => current.map((section, index) => {
      if (index !== activePickerIndex) {
        return section;
      }
      const exists = section.listing_ids.includes(listingId);
      return {
        ...section,
        listing_ids: exists ? section.listing_ids.filter((id) => id !== listingId) : [...section.listing_ids, listingId]
      };
    }));
  };
  const selectAllListings = () => {
    if (activePickerIndex === null) return;
    setSections((current) => current.map((section, index) => {
      if (index !== activePickerIndex) {
        return section;
      }
      return {
        ...section,
        listing_ids: filteredBrandListings.map((listing) => Number(listing.id))
      };
    }));
  };
  const clearSectionListings = () => {
    if (activePickerIndex === null) return;
    setSections((current) => current.map((section, index) => index === activePickerIndex ? { ...section, listing_ids: [] } : section));
  };
  const brandPageUrl = selectedBrand?.slug ? route("properties.brand", selectedBrand.slug) : null;
  const uploadPreview = (field) => assetUrl(selectedBrand?.[field]);
  const bannerPreview = (field) => localPreviewUrls[field] || uploadPreview(field);
  const triggerFilePicker = (field) => {
    fileInputRefs.current[field]?.click();
  };
  const handleImageChange = (field, file) => {
    setData(field, file || null);
    setLocalPreviewUrls((current) => {
      const next = { ...current };
      if (next[field]) {
        URL.revokeObjectURL(next[field]);
        delete next[field];
      }
      if (file) {
        next[field] = URL.createObjectURL(file);
      }
      return next;
    });
  };
  useEffect(() => {
    return () => {
      Object.values(localPreviewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [localPreviewUrls]);
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Brand Pages", children: [
    /* @__PURE__ */ jsx(Head, { title: "Brand Pages" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 lg:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.28em] text-gray-400", children: "Brand Pages" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl lg:text-4xl font-black text-gray-900 tracking-tight", children: "Brand Page Builder" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500", children: "Select a brand, upload the banner exactly like the frontend, and place the exact products into each section." })
          ] }),
          brandPageUrl && /* @__PURE__ */ jsx(
            "a",
            {
              href: brandPageUrl,
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800",
              children: "View Public Page"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx(InputLabel, { value: "Select Brand", className: "mb-2" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedBrandId,
              onChange: (e) => handleBrandChange(e.target.value),
              className: "w-full lg:w-96 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Choose a brand" }),
                brands.map((brand) => /* @__PURE__ */ jsx("option", { value: brand.id, children: brand.name }, brand.id))
              ]
            }
          )
        ] })
      ] }),
      !selectedBrand ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500", children: "Select a brand to start building its page." }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 lg:p-6 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.24em] text-gray-400", children: "Banner" }),
                /* @__PURE__ */ jsx("h2", { className: "mt-2 text-xl lg:text-2xl font-black text-gray-900", children: "Banner Preview" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "The banner should feel exactly like the public page, with separate desktop and mobile uploads." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-gray-50 px-4 py-3 text-right shrink-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400", children: "Editing" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-gray-900", children: selectedBrand.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[30px] border border-gray-200 bg-gray-50", children: [
              /* @__PURE__ */ jsx("div", { className: "brand-builder-banner", children: /* @__PURE__ */ jsxs("picture", { children: [
                /* @__PURE__ */ jsx("source", { media: "(max-width: 767px)", srcSet: uploadPreview("banner_img_mob") || uploadPreview("banner_img") || "/assets/images/placeholder.png" }),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: uploadPreview("banner_img") || uploadPreview("banner_img_mob") || "/assets/images/placeholder.png",
                    alt: `${selectedBrand.name} banner preview`,
                    className: "h-full w-full object-cover"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-white", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.24em] text-white/70", children: "Banner Controls" }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg lg:text-xl font-black", children: selectedBrand.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => triggerFilePicker("banner_img"),
                      className: "inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50",
                      children: "Upload Desktop"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => triggerFilePicker("banner_img_mob"),
                      className: "inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800",
                      children: "Upload Mobile"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: IMAGE_FIELDS.map((field) => /* @__PURE__ */ jsxs("div", { className: "hidden", children: [
              /* @__PURE__ */ jsx(InputLabel, { value: field.label }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: (el) => {
                    fileInputRefs.current[field.key] = el;
                  },
                  type: "file",
                  accept: "image/*",
                  onChange: (e) => handleImageChange(field.key, e.target.files[0] || null)
                }
              )
            ] }, field.key)) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: IMAGE_FIELDS.map((field) => {
              const preview = bannerPreview(field.key);
              const selectedFile = data[field.key];
              return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-4 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: field.label }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: field.key === "banner_img" ? "Desktop hero image" : "Mobile hero image" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => triggerFilePicker(field.key),
                      className: "rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50",
                      children: "Change"
                    }
                  )
                ] }),
                preview ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: preview,
                    alt: field.label,
                    className: "h-28 w-full rounded-2xl object-cover border border-gray-200 bg-gray-50"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "h-28 w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400", children: "No image selected" }),
                selectedFile instanceof File && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                  "Selected: ",
                  selectedFile.name
                ] }),
                errors[field.key] && /* @__PURE__ */ jsx(InputError, { message: errors[field.key] })
              ] }, field.key);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.24em] text-gray-400", children: "Sections" }),
                /* @__PURE__ */ jsx("h2", { className: "mt-2 text-xl lg:text-2xl font-black text-gray-900", children: "Product Sections" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Add a section title and then attach the products that should appear on the frontend." })
              ] }),
              /* @__PURE__ */ jsxs(PrimaryButton, { type: "button", onClick: addSection, children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
                "Add Section"
              ] })
            ] }),
            /* @__PURE__ */ jsx(InputError, { message: errors.sections_json, className: "mt-4" }),
            /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-4", children: sections.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400", children: "No sections yet. Click Add Section to create the first block." }) : sections.map((section, index) => {
              const selectedListings = (section.listing_ids || []).map((id) => brandListingsById.get(Number(id))).filter(Boolean);
              return /* @__PURE__ */ jsxs("div", { className: "rounded-[28px] border border-gray-200 p-4 lg:p-5 space-y-4 bg-gray-50/30", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-400", children: [
                      "Section ",
                      index + 1
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-[clamp(1.25rem,2vw,1.6rem)] font-black text-gray-900 leading-tight", children: section.title?.trim() || "Untitled section" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeSection(index),
                      className: "rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50",
                      children: "Remove"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(InputLabel, { value: "Section Title", className: "mb-2" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: section.title,
                      onChange: (e) => updateSection(index, "title", e.target.value),
                      placeholder: "e.g. Featured Homes",
                      className: "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
                  /* @__PURE__ */ jsxs(PrimaryButton, { type: "button", onClick: () => setActivePickerIndex(index), children: [
                    /* @__PURE__ */ jsx("i", { className: "fa-solid fa-layer-group mr-2" }),
                    "Add Products"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
                    section.listing_ids?.length || 0,
                    " selected"
                  ] })
                ] }),
                selectedListings.length > 0 && /* @__PURE__ */ jsx("div", { className: "brand-page-admin-slider", children: /* @__PURE__ */ jsx(
                  Swiper,
                  {
                    modules: [Navigation],
                    navigation: true,
                    spaceBetween: 18,
                    breakpoints: {
                      320: { slidesPerView: 1.05 },
                      576: { slidesPerView: 1.4 },
                      768: { slidesPerView: 2.1 },
                      992: { slidesPerView: 2.6 },
                      1200: { slidesPerView: 3.1 }
                    },
                    children: selectedListings.map((listing) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(BrandPageProductCard, { listing, selected: true, showPropertyMeta: true }) }, listing.id))
                  }
                ) })
              ] }, section._clientId || index);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
          /* @__PURE__ */ jsx(
            SecondaryButton,
            {
              type: "button",
              onClick: () => setSections(Array.isArray(selectedBrand?.page_sections) ? selectedBrand.page_sections.map(normalizeSection) : []),
              children: "Reset Sections"
            }
          ),
          /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: processing ? "Saving..." : "Save Brand Page" })
        ] })
      ] })
    ] }),
    activePickerIndex !== null && activeSection && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl rounded-[28px] bg-white shadow-2xl overflow-hidden flex max-h-[90vh] flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.22em] text-gray-400", children: "Select Products" }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-gray-900", children: activeSection.title?.trim() || `Section ${activePickerIndex + 1}` }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Pick the listings that should appear in this brand section." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setActivePickerIndex(null),
            className: "rounded-2xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50",
            children: "Close"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:max-w-md", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: productSearch,
              onChange: (e) => setProductSearch(e.target.value),
              placeholder: "Search brand products",
              className: "w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-black/10"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: selectAllListings, children: "Select All" }),
          /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: clearSectionListings, children: "Clear" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children: filteredBrandListings.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-16 text-center text-gray-500", children: "No products found for this brand." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: filteredBrandListings.map((listing) => {
        const checked = activeSection.listing_ids.includes(Number(listing.id));
        return /* @__PURE__ */ jsx(
          BrandPageProductCard,
          {
            listing,
            selected: checked,
            onClick: () => toggleListingSelection(Number(listing.id))
          },
          listing.id
        );
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 bg-white", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          activeSection.listing_ids.length,
          " product",
          activeSection.listing_ids.length === 1 ? "" : "s",
          " selected"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(SecondaryButton, { type: "button", onClick: () => setActivePickerIndex(null), className: "px-5 py-3", children: "Done" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .brand-page-admin-slider {
          position: relative;
          padding-bottom: 2px;
        }

        .brand-page-admin-slider .swiper {
          overflow: hidden;
          padding: 4px 2px 78px;
        }

        .brand-page-admin-slider .swiper-slide {
          height: auto;
        }

        .brand-page-admin-slider .swiper-button-prev,
        .brand-page-admin-slider .swiper-button-next {
          top: auto !important;
          bottom: 14px !important;
          left: auto !important;
          right: auto !important;
          transform: none !important;
          width: 44px;
          height: 40px;
          border-radius: 0;
          background: #ffffff;
          color: #111827;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
          z-index: 5;
        }

        .brand-page-admin-slider .swiper-button-prev {
          left: calc(50% - 43px) !important;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          margin-right: 0 !important;
        }

        .brand-page-admin-slider .swiper-button-next {
          left: calc(50% + 3px) !important;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          border-left: none;
        }

        .brand-page-admin-slider .swiper-button-prev::after,
        .brand-page-admin-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }

        .brand-page-admin-slider .swiper-button-disabled {
          opacity: 1 !important;
          color: #cbd5e1 !important;
          background: #ffffff !important;
        }

        .brand-page-admin-card-selected {
          transform: translateY(-1px);
        }

        .brand-page-admin-card .product-box {
          display: block !important;
          height: auto !important;
          flex-direction: initial !important;
        }

        .brand-page-admin-card .product-card-wrapper {
          height: auto;
        }

        .brand-page-admin-card .pro-image {
          height: auto !important;
        }

        .brand-page-admin-card .pro-image .counter {
          width: calc(100% - 32px);
          max-width: 380px;
        }

        .brand-page-admin-card .product-favorite-btn {
          z-index: 4;
        }

        .brand-builder-banner {
          height: 420px;
        }

        .brand-builder-banner picture,
        .brand-builder-banner img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        @media (max-width: 991px) and (min-width: 768px) {
          .brand-builder-banner {
            height: 360px;
          }
        }

        @media (max-width: 767px) {
          .brand-builder-banner {
            height: 210px;
          }

          .brand-page-admin-slider .swiper {
            padding-bottom: 8px;
          }

          .brand-page-admin-slider .swiper-button-prev,
          .brand-page-admin-slider .swiper-button-next {
            display: none !important;
          }
        }
      ` })
  ] });
}
export {
  PageBuilder as default
};
