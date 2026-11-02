import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { HiOutlineArrowLeft, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiOutlineSearch, HiOutlineCheck, HiOutlinePlus, HiOutlineLocationMarker, HiOutlineX } from "react-icons/hi";
import { A as AppLayout } from "./AppLayout-DaOB_wGA.js";
import { G as GoogleLocationPicker } from "./GoogleLocationPicker-DhaovosO.js";
import { u as useTranslate } from "./useTranslate-AOp3QZfJ.js";
import { c as confirmAction } from "./confirmAction-Jvw1Icl9.js";
/* empty css              */
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "./Price-7qyok_Wm.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-DtJ4OuSi.js";
const emptyLocation = () => ({
  location_label: "",
  country: "",
  state: "",
  city: "",
  latitude: "",
  longitude: ""
});
const isFilledLocation = (loc) => !!(loc?.location_label || loc?.city || loc?.latitude && loc?.longitude);
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
    })) : [emptyLocation()]
  );
  const [saving, setSaving] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const toggleCategory = (id) => {
    if (!isCorporateVerified) return;
    setCategoryIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const updateLocation = (index, patch) => {
    setLocations((prev) => prev.map((loc, i) => i === index ? { ...loc, ...patch } : loc));
  };
  const addLocation = () => {
    if (!isCorporateVerified) return;
    setLocations((prev) => [...prev, emptyLocation()]);
  };
  const removeLocation = (index) => {
    if (!isCorporateVerified) return;
    setLocations((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [emptyLocation()];
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCorporateVerified) return;
    setSaving(true);
    router.put(route("seller.buyer-request-preferences.update"), {
      category_ids: categoryIds,
      locations
    }, {
      onFinish: () => setSaving(false)
    });
  };
  const handleClear = async () => {
    const ok = await confirmAction({
      title: t("Clear all preferences?"),
      text: t("You will still see all open leads. Match alerts will stop until you save new preferences."),
      confirmText: t("Clear all"),
      cancelText: t("Cancel"),
      danger: true
    });
    if (!ok) return;
    setCategoryIds([]);
    setLocations([emptyLocation()]);
    setSaving(true);
    router.put(route("seller.buyer-request-preferences.update"), {
      category_ids: [],
      locations: []
    }, {
      onFinish: () => setSaving(false)
    });
  };
  const filteredCategories = useMemo(() => {
    const cats = Array.isArray(categories) ? categories : Object.values(categories || {});
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return cats;
    return cats.filter((c) => String(c.name || "").toLowerCase().includes(q));
  }, [categories, categoryQuery]);
  const filledLocations = locations.filter(isFilledLocation);
  const hasAnyPrefs = categoryIds.length > 0 || filledLocations.length > 0;
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Lead Preferences"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Lead Preferences") }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen overflow-x-hidden bg-slate-50 pb-28 lg:pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("seller.buyer-requests.browse"),
          className: "inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900",
          children: [
            /* @__PURE__ */ jsx(HiOutlineArrowLeft, { className: "h-4 w-4" }),
            t("Browse leads")
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap items-start justify-between gap-3 sm:mt-4", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl", children: t("Lead Preferences") }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/80 sm:text-xs", children: t("Optional — alerts only") })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:mt-2", children: t("Tune match alerts for categories and areas you care about. You can skip this and still offer on any open request.") })
      ] }) }),
      !isCorporateVerified && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700", children: /* @__PURE__ */ jsx(HiOutlineExclamationCircle, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-amber-900", children: t("Verification required") }),
            /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-amber-800/90", children: t("Only corporate-verified sellers can receive and respond to buyer requests.") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("verification.identity"),
            className: "inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700",
            children: [
              t("Complete Verification"),
              " →"
            ]
          }
        )
      ] }),
      flash?.success && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm", children: flash.success }),
      errors.verification && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm", children: errors.verification }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-start gap-2.5 rounded-2xl border border-sky-100 bg-sky-50/70 p-3 text-sm text-sky-900/80 shadow-sm sm:mt-6 sm:gap-3 sm:p-4", children: [
        /* @__PURE__ */ jsx(HiOutlineInformationCircle, { className: "mt-0.5 h-5 w-5 shrink-0 text-sky-500" }),
        /* @__PURE__ */ jsx("p", { className: "mb-0 leading-relaxed", children: t("You can always browse and offer on all open requests. Preferences only improve match alerts — they never block leads.") })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "min-w-0", children: [
        /* @__PURE__ */ jsxs("section", { className: "mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:mt-6 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-900 sm:text-lg", children: t("Preferred Categories") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: t("Optional — pick categories you want to focus on.") })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-3 sm:text-xs", children: [
              categoryIds.length,
              " ",
              t("selected")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative mt-4 sm:mt-5", children: [
            /* @__PURE__ */ jsx(HiOutlineSearch, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "search",
                value: categoryQuery,
                onChange: (e) => setCategoryQuery(e.target.value),
                placeholder: t("Search categories..."),
                className: "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3", children: filteredCategories.map((cat) => {
            const selected = categoryIds.includes(cat.id);
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                disabled: !isCorporateVerified,
                onClick: () => toggleCategory(cat.id),
                className: `flex min-w-0 items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm transition-all sm:gap-3 sm:p-3 ${selected ? "border-slate-900 bg-slate-900 font-medium text-white shadow-sm" : "border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100"} ${!isCorporateVerified ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${selected ? "border-white/30 bg-white/15 text-white" : "border-gray-300 bg-white text-transparent"}`,
                      children: /* @__PURE__ */ jsx(HiOutlineCheck, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 break-words leading-snug", children: cat.name })
                ]
              },
              cat.id
            );
          }) }),
          filteredCategories.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-sm text-slate-500", children: t("No categories match your search.") }),
          errors.category_ids && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-rose-600", children: errors.category_ids })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm sm:mt-6 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-gray-900 sm:text-lg", children: t("Preferred Locations") }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-slate-500", children: t("Optional — areas where you can deliver or fulfill requests. Used for smarter match alerts.") })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addLocation,
                disabled: !isCorporateVerified,
                className: "inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
                children: [
                  /* @__PURE__ */ jsx(HiOutlinePlus, { className: "h-4 w-4" }),
                  t("Add Location")
                ]
              }
            )
          ] }),
          filledLocations.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: locations.map((loc, index) => {
            if (!isFilledLocation(loc)) return null;
            const label = loc.location_label || [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
            return /* @__PURE__ */ jsxs(
              "span",
              {
                className: "inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-slate-700",
                children: [
                  /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "h-3.5 w-3.5 shrink-0 text-sky-500" }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: label }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      disabled: !isCorporateVerified,
                      onClick: () => removeLocation(index),
                      className: "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40",
                      "aria-label": t("Remove"),
                      children: /* @__PURE__ */ jsx(HiOutlineX, { className: "h-3.5 w-3.5" })
                    }
                  )
                ]
              },
              `chip-${index}`
            );
          }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3 sm:mt-5 sm:space-y-4", children: locations.map((loc, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-800", children: [
                    /* @__PURE__ */ jsx("span", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm ring-1 ring-slate-100", children: /* @__PURE__ */ jsx(HiOutlineLocationMarker, { className: "h-4 w-4" }) }),
                    t("Location"),
                    " ",
                    index + 1
                  ] }),
                  locations.length > 1 && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeLocation(index),
                      disabled: !isCorporateVerified,
                      className: "shrink-0 text-xs font-semibold text-slate-500 transition hover:text-rose-600 disabled:opacity-40",
                      children: t("Remove")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "min-w-0 max-w-full overflow-hidden", children: /* @__PURE__ */ jsx(
                  GoogleLocationPicker,
                  {
                    addressValue: loc.location_label,
                    latitudeValue: loc.latitude,
                    longitudeValue: loc.longitude,
                    label: t("Location"),
                    fallbackLabel: t("Location"),
                    placeholder: t("Search city, area or address..."),
                    fallbackPlaceholder: t("Enter delivery location"),
                    helperText: t("Search or use current location to pin where you can fulfill requests."),
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
                ) })
              ]
            },
            `loc-${index}`
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: !isCorporateVerified || saving,
                className: "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
                children: saving ? t("Saving...") : t("Save Preferences")
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("seller.buyer-requests.browse"),
                className: "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-gray-500 no-underline transition hover:text-gray-900 sm:w-auto",
                children: t("Skip for now")
              }
            )
          ] }),
          hasAnyPrefs && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleClear,
              disabled: !isCorporateVerified || saving,
              className: "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:w-auto",
              children: t("Clear all")
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Preferences as default
};
