import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-CWZvIfaV.js";
import "ziggy-js";
import "./productUrl-SijKnuS_.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
const Index = ({ invoices }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "invoice-status-paid";
      case "In Progress":
        return "invoice-status-inprogress";
      case "Rejected":
        return "invoice-status-rejected";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "My Invoices" }),
    /* @__PURE__ */ jsx("section", { className: "invoices py-10", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("div", { className: "invoices-main-heading mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "My Invoices" }) }),
      /* @__PURE__ */ jsx("div", { className: "invoices-table overflow-x-auto bg-white rounded-lg shadow", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Invoice #" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Description" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }),
          /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: invoices.length > 0 ? invoices.map((invoice) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: invoice.id }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [
            "$",
            invoice.final_cost
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: invoice.booking ? invoice.booking.cargo_type : "N/A" }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(invoice.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`, children: invoice.status }) })
        ] }, invoice.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "px-6 py-4 text-center text-sm text-gray-500", children: "No invoices found." }) }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
                .invoice-status-paid {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .invoice-status-inprogress {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                .invoice-status-rejected {
                    background-color: #fee2e2;
                    color: #991b1b;
                }
            ` })
  ] });
};
export {
  Index as default
};
