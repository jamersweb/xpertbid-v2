import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D5kT_nGG.js";
import { P as Price } from "./Price-DkWoIW3k.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useCurrencyList-Ce5tJXO9.js";
function Browse({
  requests = [],
  isCorporateVerified = false,
  hasPreferences = false
}) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Request leads"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Request leads") }),
    /* @__PURE__ */ jsx("div", { className: "py-5", style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-0 fw-bold", style: { fontSize: 32, color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: t("Matched buyer requests") }),
        /* @__PURE__ */ jsx(Link, { href: route("seller.buyer-request-preferences.edit"), className: "button-style-3", children: t("Edit preferences") })
      ] }),
      !isCorporateVerified ? /* @__PURE__ */ jsxs("div", { className: "alert alert-warning", children: [
        t("Corporate verification is required to view and offer on buyer requests."),
        " ",
        /* @__PURE__ */ jsx(Link, { href: route("verification.identity"), children: t("Verify now") })
      ] }) : !hasPreferences ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: "text-center py-5 bg-white",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold", style: { color: "#23262F" }, children: t("Set your preferences first") }),
            /* @__PURE__ */ jsx("p", { className: "mb-4", style: { color: "#606060" }, children: t("Choose categories and delivery locations so we can match relevant buyer requests.") }),
            /* @__PURE__ */ jsx(Link, { href: route("seller.buyer-request-preferences.edit"), className: "button-style-2", children: t("Set preferences") })
          ]
        }
      ) : requests.length === 0 ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: "text-center py-5 bg-white",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold", style: { color: "#23262F" }, children: t("No matching requests") }),
            /* @__PURE__ */ jsx("p", { className: "mb-0", style: { color: "#606060" }, children: t("We will notify you when a new request matches your preferences.") })
          ]
        }
      ) : /* @__PURE__ */ jsx("div", { className: "row g-3", children: requests.map((item) => /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-white p-4",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold mb-1", style: { color: "#23262F" }, children: item.title }),
              /* @__PURE__ */ jsxs("div", { className: "small mb-2", style: { color: "#606060" }, children: [
                [
                  item.category?.name,
                  item.sub_category?.name || item.subCategory?.name,
                  item.child_category?.name || item.childCategory?.name
                ].filter(Boolean).join(" › "),
                item.location_label ? ` · ${item.location_label}` : ""
              ] }),
              item.description && /* @__PURE__ */ jsx("p", { className: "mb-0", style: { whiteSpace: "pre-wrap", color: "#23262F" }, children: item.description }),
              item.my_offer && /* @__PURE__ */ jsxs("div", { className: "mt-2 small", style: { color: "#606060" }, children: [
                t("Your offer"),
                ": ",
                /* @__PURE__ */ jsx(Price, { amountPKR: item.my_offer.price }),
                /* @__PURE__ */ jsxs("span", { className: "ms-2 text-capitalize", children: [
                  "(",
                  item.my_offer.status,
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              Link,
              {
                href: route("buyer-requests.show", item.id),
                className: "button-style-2",
                children: item.my_offer ? t("View / update offer") : t("View & offer")
              }
            ) })
          ] })
        }
      ) }, item.id)) })
    ] }) })
  ] });
}
export {
  Browse as default
};
