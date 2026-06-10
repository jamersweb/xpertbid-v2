import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-DE5nDs2t.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./CartContext-eSDe5PYw.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useCurrencyList-Ce5tJXO9.js";
function Index({ requests }) {
  const { t } = useTranslate();
  const statusStyles = (status) => {
    if (status === "completed" || status === "approved") {
      return { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#065f46", border: "1px solid rgba(16, 185, 129, 0.3)" };
    } else if (status === "pending" || status === "processing") {
      return { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#92400e", border: "1px solid rgba(245, 158, 11, 0.3)" };
    }
    return { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#991b1b", border: "1px solid rgba(239, 68, 68, 0.3)" };
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("Payment Requests"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("Payment Requests") }),
    /* @__PURE__ */ jsx("div", { style: { padding: "50px 0", minHeight: "70vh", backgroundColor: "#fff" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("h1", { style: { fontSize: "42px", fontWeight: "800", color: "#23262F", margin: "0 0 32px 0" }, children: t("My Payment Requests") }),
      /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "2px solid #E6E8EC" }, children: [
          /* @__PURE__ */ jsx("th", { style: { padding: "14px 0", fontWeight: "700", color: "#23262F", fontSize: "15px", textAlign: "left" }, children: t("Amount") }),
          /* @__PURE__ */ jsx("th", { style: { padding: "14px 0", fontWeight: "700", color: "#23262F", fontSize: "15px", textAlign: "left" }, children: t("Payment Method") }),
          /* @__PURE__ */ jsx("th", { style: { padding: "14px 0", fontWeight: "700", color: "#23262F", fontSize: "15px", textAlign: "left" }, children: t("Status") })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: requests.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "3", style: { padding: "20px 0", color: "#353945", fontSize: "15px", fontWeight: "500" }, children: t("No payment requests found.") }) }) : requests.data.map((request) => /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #E6E8EC" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "16px 0", fontWeight: "700", color: "#23262F", fontSize: "16px" }, children: /* @__PURE__ */ jsx(Price, { amountAED: request.amount }) }),
          /* @__PURE__ */ jsx("td", { style: { padding: "16px 0", color: "#353945", fontSize: "15px" }, children: request.payment_method?.paymentMethod || t("Direct Transfer") }),
          /* @__PURE__ */ jsx("td", { style: { padding: "16px 0" }, children: /* @__PURE__ */ jsx("span", { style: {
            padding: "5px 14px",
            borderRadius: "50px",
            fontSize: "13px",
            fontWeight: "600",
            textTransform: "capitalize",
            ...statusStyles(request.status)
          }, children: request.status }) })
        ] }, request.id)) })
      ] }),
      requests.links && requests.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "d-flex justify-content-center mt-5", children: /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx("ul", { className: "pagination gap-1", children: requests.links.map((link, i) => /* @__PURE__ */ jsx("li", { className: `page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`, children: /* @__PURE__ */ jsx(
        Link,
        {
          href: link.url || "#",
          className: "page-link rounded-3",
          style: {
            background: link.active ? "#23262F" : "#fff",
            color: link.active ? "#fff" : "#23262F",
            border: "1px solid #E6E8EC",
            fontWeight: "600"
          },
          dangerouslySetInnerHTML: { __html: link.label }
        }
      ) }, i)) }) }) })
    ] }) })
  ] });
}
export {
  Index as default
};
