import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-D5kT_nGG.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./productUrl-D-dT-lp_.js";
import "./Price-DkWoIW3k.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function Index({ requests = [] }) {
  const { t } = useTranslate();
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Buyer Requests"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("My Buyer Requests") }),
    /* @__PURE__ */ jsx("div", { className: "py-5", style: { backgroundColor: "#F9F9F9", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-0 fw-bold", style: { fontSize: 32, color: "#23262F", fontFamily: '"Inter", sans-serif' }, children: t("My Buyer Requests") }),
        /* @__PURE__ */ jsxs(Link, { href: route("buyer-requests.create"), className: "button-style-2", children: [
          "+ ",
          t("New request")
        ] })
      ] }),
      requests.length === 0 ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: "text-center py-5 bg-white",
          style: { borderRadius: 16, border: "1px solid #EDEDED", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" },
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-regular fa-clipboard fa-3x mb-3", style: { color: "#C0C0C0" } }),
            /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold", style: { color: "#23262F" }, children: t("No requests yet") }),
            /* @__PURE__ */ jsx("p", { className: "mb-4", style: { color: "#606060" }, children: t("Post what you need and let sellers compete with offers.") }),
            /* @__PURE__ */ jsx(Link, { href: route("buyer-requests.create"), className: "button-style-2", children: t("Create request") })
          ]
        }
      ) : /* @__PURE__ */ jsx("div", { className: "row g-3", children: requests.map((item) => /* @__PURE__ */ jsx("div", { className: "col-12", children: /* @__PURE__ */ jsx(
        Link,
        {
          href: route("buyer-requests.show", item.id),
          className: "d-block text-decoration-none bg-white p-4",
          style: {
            color: "inherit",
            borderRadius: 16,
            border: "1px solid #EDEDED",
            boxShadow: "0 12px 40px rgba(0,0,0,0.04)"
          },
          children: /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap justify-content-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold mb-1", style: { color: "#23262F" }, children: item.title }),
              /* @__PURE__ */ jsxs("div", { className: "small", style: { color: "#606060" }, children: [
                [
                  item.category?.name,
                  item.sub_category?.name || item.subCategory?.name,
                  item.child_category?.name || item.childCategory?.name
                ].filter(Boolean).join(" › ") || t("Uncategorized"),
                item.location_label ? ` · ${item.location_label}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-end", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "badge text-capitalize me-2",
                  style: {
                    background: "#F8F8F8",
                    color: "#23262F",
                    border: "1px solid #EDEDED",
                    borderRadius: 10,
                    fontWeight: 500
                  },
                  children: item.status
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "fw-semibold", style: { color: "#43ACE9" }, children: [
                item.offers_count || 0,
                " ",
                t("offers")
              ] })
            ] })
          ] })
        }
      ) }, item.id)) })
    ] }) })
  ] });
}
export {
  Index as default
};
