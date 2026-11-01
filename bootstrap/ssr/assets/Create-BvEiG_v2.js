import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { A as AppLayout } from "./AppLayout-D5kT_nGG.js";
import { G as GoogleLocationPicker } from "./GoogleLocationPicker-i_DvbBtU.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
/* empty css              */
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "./Price-DkWoIW3k.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "react-loader-spinner";
import "sweetalert2";
function Create({ categories = [] }) {
  const { t } = useTranslate();
  const { errors = {} } = usePage().props;
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    sub_category_id: "",
    child_category_id: "",
    location_label: "",
    country: "",
    state: "",
    city: "",
    latitude: "",
    longitude: ""
  });
  const previews = useMemo(
    () => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [files]
  );
  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleCategoryChange = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      category_id: categoryId,
      sub_category_id: "",
      child_category_id: ""
    }));
    setSubCategories([]);
    setChildCategories([]);
    if (!categoryId) return;
    setLoadingSubs(true);
    axios.get(`/get-subcategories/${categoryId}`).then((res) => setSubCategories(res.data.subcategories || [])).catch(() => setSubCategories([])).finally(() => setLoadingSubs(false));
  };
  const handleSubCategoryChange = (subCategoryId) => {
    setForm((prev) => ({
      ...prev,
      sub_category_id: subCategoryId,
      child_category_id: ""
    }));
    setChildCategories([]);
    if (!subCategoryId) return;
    setLoadingChildren(true);
    axios.get(`/get-children/${subCategoryId}`).then((res) => setChildCategories(res.data.subcategories || [])).catch(() => setChildCategories([])).finally(() => setLoadingChildren(false));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "sub_category_id" && (!value || subCategories.length === 0)) return;
      if (key === "child_category_id" && (!value || childCategories.length === 0)) return;
      if (value !== "" && value !== null && value !== void 0) {
        data.append(key, value);
      }
    });
    files.forEach((file) => data.append("images[]", file));
    router.post(route("buyer-requests.store"), data, {
      forceFormData: true,
      onFinish: () => setSubmitting(false)
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("New Buyer Request"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("New Buyer Request") }),
    /* @__PURE__ */ jsx("section", { className: "details-form py-5", style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", style: { maxWidth: 820 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-0 fw-bold", style: { fontSize: 32, color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: t("New product request") }),
        /* @__PURE__ */ jsx(Link, { href: route("buyer-requests.index"), className: "button-style-3", children: t("Back") })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "bg-white p-4 p-md-5",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
                t("Product name"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "form-control verify_input",
                  value: form.title,
                  onChange: (e) => setField("title", e.target.value),
                  placeholder: "e.g. Laptop, office chair, camera",
                  required: true
                }
              ),
              errors.title && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: t("Short description") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "form-control verify_input",
                  rows: 4,
                  value: form.description,
                  onChange: (e) => setField("description", e.target.value),
                  placeholder: t("Size, quantity, condition...")
                }
              ),
              errors.description && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.description })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
                t("Category"),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-danger", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "form-control verify_input",
                  value: form.category_id,
                  onChange: (e) => handleCategoryChange(e.target.value),
                  required: true,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("Select category") }),
                    categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                  ]
                }
              ),
              errors.category_id && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.category_id })
            ] }),
            form.category_id && loadingSubs && /* @__PURE__ */ jsx("p", { className: "small mb-3", style: { color: "#606060" }, children: t("Loading subcategories...") }),
            form.category_id && !loadingSubs && subCategories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: t("Subcategory") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "form-control verify_input",
                  value: form.sub_category_id,
                  onChange: (e) => handleSubCategoryChange(e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("Select subcategory") }),
                    subCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                  ]
                }
              ),
              errors.sub_category_id && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.sub_category_id })
            ] }),
            form.sub_category_id && loadingChildren && /* @__PURE__ */ jsx("p", { className: "small mb-3", style: { color: "#606060" }, children: t("Loading child categories...") }),
            form.sub_category_id && !loadingChildren && childCategories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: t("Child category") }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "form-control verify_input",
                  value: form.child_category_id,
                  onChange: (e) => setField("child_category_id", e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("Select child category") }),
                    childCategories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                  ]
                }
              ),
              errors.child_category_id && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.child_category_id })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
              GoogleLocationPicker,
              {
                addressValue: form.location_label,
                latitudeValue: form.latitude,
                longitudeValue: form.longitude,
                label: t("Location"),
                fallbackLabel: t("Location"),
                placeholder: t("Search city, area or address..."),
                fallbackPlaceholder: t("Enter your location"),
                helperText: t("Search an address or use current location so sellers nearby can offer."),
                onChange: ({
                  property_address,
                  location_label,
                  latitude,
                  longitude,
                  country,
                  state,
                  city,
                  area
                }) => {
                  const label = location_label || property_address || "";
                  const cityWithArea = [area, city].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(", ");
                  setForm((prev) => ({
                    ...prev,
                    location_label: label,
                    latitude: latitude || "",
                    longitude: longitude || "",
                    country: country || prev.country || "",
                    state: state || prev.state || "",
                    city: cityWithArea || city || prev.city || ""
                  }));
                },
                error: errors.location_label
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "form-group mb-4", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: t("Images") }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  className: "form-control verify_input",
                  accept: "image/*",
                  multiple: true,
                  onChange: (e) => setFiles(Array.from(e.target.files || []).slice(0, 8))
                }
              ),
              previews.length > 0 && /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2 mt-3", children: previews.map((p) => /* @__PURE__ */ jsx(
                "img",
                {
                  src: p.url,
                  alt: p.name,
                  style: { width: 84, height: 84, objectFit: "cover", borderRadius: 10 }
                },
                p.url
              )) }),
              errors.images && /* @__PURE__ */ jsx("p", { className: "text-danger small mt-1 mb-0", children: errors.images })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "button-style-2", disabled: submitting, children: submitting ? t("Posting...") : t("Post request") })
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Create as default
};
