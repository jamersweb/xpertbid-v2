import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D5kT_nGG.js";
import { G as GoogleLocationPicker } from "./GoogleLocationPicker-i_DvbBtU.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
/* empty css              */
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "./Price-DkWoIW3k.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function Preferences({ categories = [], preference = null, isCorporateVerified = false }) {
  const { t } = useTranslate();
  const { flash, errors = {} } = usePage().props;
  const [categoryIds, setCategoryIds] = useState(
    (preference?.categories || []).map((c) => c.id)
  );
  const [locations, setLocations] = useState(
    (preference?.locations || []).length ? preference.locations.map((loc) => ({
      location_label: loc.location_label || "",
      country: loc.country || "",
      state: loc.state || "",
      city: loc.city || "",
      latitude: loc.latitude || "",
      longitude: loc.longitude || ""
    })) : [{ location_label: "", country: "", state: "", city: "", latitude: "", longitude: "" }]
  );
  const [saving, setSaving] = useState(false);
  const toggleCategory = (id) => {
    setCategoryIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const updateLocation = (index, patch) => {
    setLocations((prev) => prev.map((loc, i) => i === index ? { ...loc, ...patch } : loc));
  };
  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      { location_label: "", country: "", state: "", city: "", latitude: "", longitude: "" }
    ]);
  };
  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    router.put(route("seller.buyer-request-preferences.update"), {
      category_ids: categoryIds,
      locations
    }, {
      onFinish: () => setSaving(false)
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Request lead preferences"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Request lead preferences") }),
    /* @__PURE__ */ jsx("section", { className: "details-form py-5", style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", style: { maxWidth: 860 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-0 fw-bold", style: { fontSize: 32, color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: t("Preferred categories & locations") }),
        /* @__PURE__ */ jsx(Link, { href: route("seller.buyer-requests.browse"), className: "button-style-3", children: t("Browse requests") })
      ] }),
      !isCorporateVerified && /* @__PURE__ */ jsxs("div", { className: "alert alert-warning", children: [
        t("Only corporate-verified sellers can receive and respond to buyer requests."),
        " ",
        /* @__PURE__ */ jsx(Link, { href: route("verification.identity"), children: t("Complete verification") })
      ] }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "alert alert-success", children: flash.success }),
      errors.verification && /* @__PURE__ */ jsx("div", { className: "alert alert-danger", children: errors.verification }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "bg-white p-4 p-md-5",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "h5 fw-bold mb-3", style: { color: "#23262F" }, children: t("Preferred categories") }),
            /* @__PURE__ */ jsx("div", { className: "row g-2 mb-4", children: categories.map((cat) => /* @__PURE__ */ jsx("div", { className: "col-md-4", children: /* @__PURE__ */ jsxs(
              "label",
              {
                className: "px-3 py-2 d-flex align-items-center gap-2 w-100",
                style: {
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  color: "#23262F",
                  cursor: isCorporateVerified ? "pointer" : "not-allowed"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: categoryIds.includes(cat.id),
                      onChange: () => toggleCategory(cat.id),
                      disabled: !isCorporateVerified
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "fw-semibold", children: cat.name })
                ]
              }
            ) }, cat.id)) }),
            /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-3", children: [
              /* @__PURE__ */ jsx("h2", { className: "h5 fw-bold mb-0", style: { color: "#23262F" }, children: t("Preferred locations") }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "button-style-3",
                  onClick: addLocation,
                  disabled: !isCorporateVerified,
                  children: [
                    "+ ",
                    t("Add location")
                  ]
                }
              )
            ] }),
            locations.map((loc, index) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "p-3 mb-3",
                style: { border: "1px solid #EDEDED", borderRadius: 12 },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-2", children: [
                    /* @__PURE__ */ jsxs("strong", { style: { color: "#23262F" }, children: [
                      t("Location"),
                      " ",
                      index + 1
                    ] }),
                    locations.length > 1 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "button-style-3",
                        onClick: () => removeLocation(index),
                        disabled: !isCorporateVerified,
                        style: { padding: "6px 12px", fontSize: 14 },
                        children: t("Remove")
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    GoogleLocationPicker,
                    {
                      addressValue: loc.location_label,
                      latitudeValue: loc.latitude,
                      longitudeValue: loc.longitude,
                      label: t("Delivery location"),
                      fallbackLabel: t("Delivery location"),
                      placeholder: t("Search city, area or address..."),
                      fallbackPlaceholder: t("Enter delivery location"),
                      helperText: t("Areas where you can deliver or fulfill buyer requests."),
                      required: false,
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
                        updateLocation(index, {
                          location_label: label,
                          latitude: latitude || "",
                          longitude: longitude || "",
                          country: country || "",
                          state: state || "",
                          city: cityWithArea || city || ""
                        });
                      }
                    }
                  )
                ]
              },
              index
            )),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "button-style-2",
                disabled: !isCorporateVerified || saving,
                children: saving ? t("Saving...") : t("Save preferences")
              }
            )
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Preferences as default
};
