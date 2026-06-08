import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import AddMoneyModal from "./AddMoneyModal-B0TZ79_y.js";
import PayoutModal from "./PayoutModal-UA9fXA8E.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "react-loader-spinner";
import "sweetalert2";
import "axios";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "./Modal-DHAPaXZd.js";
import "@headlessui/react";
function Index({ balance, transactions }) {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "My Wallet", children: [
    /* @__PURE__ */ jsx(Head, { title: "My Wallet" }),
    /* @__PURE__ */ jsx("div", { className: "py-5 bg-light min-vh-100", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "row justify-content-center", children: /* @__PURE__ */ jsxs("div", { className: "col-lg-11", children: [
      /* @__PURE__ */ jsx("h1", { className: "h2 fw-bold text-dark mb-4 px-2", children: "My Wallet" }),
      /* @__PURE__ */ jsx("div", { className: "card border-0 shadow-sm rounded-4 mb-4 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "card-body p-4 p-md-5 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "row align-items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start", children: [
          /* @__PURE__ */ jsx("span", { className: "text-secondary small fw-bold text-uppercase tracking-wider mb-2", children: "Available Balance" }),
          /* @__PURE__ */ jsx("div", { className: "d-flex align-items-baseline", children: /* @__PURE__ */ jsx("span", { className: "h1 fw-black text-dark mb-0 me-2", style: { fontSize: "3.5rem" }, children: /* @__PURE__ */ jsx(Price, { amountAED: balance }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "d-flex flex-column flex-sm-row gap-3 justify-content-md-end", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsAddMoneyModalOpen(true),
              className: "btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2",
              children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus-circle" }),
                " Add Money"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsPayoutModalOpen(true),
              className: "btn btn-outline-primary btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2",
              children: [
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-money-bill-transfer" }),
                " Get Paid"
              ]
            }
          )
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "card border-0 shadow-sm rounded-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "h5 fw-bold text-dark mb-0", children: "Recent Transactions" }),
          /* @__PURE__ */ jsx(Link, { href: "/payment-requests", className: "btn btn-link text-primary text-decoration-none fw-bold small", children: "View Payout Requests" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "card-body p-0", children: /* @__PURE__ */ jsx("div", { className: "table-responsive", children: /* @__PURE__ */ jsxs("table", { className: "table table-hover mb-0", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-light", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 border-0 text-secondary small fw-bold text-uppercase", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 border-0 text-secondary small fw-bold text-uppercase", children: "Amount" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 border-0 text-secondary small fw-bold text-uppercase", children: "Type" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 border-0 text-secondary small fw-bold text-uppercase", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 border-0 text-secondary small fw-bold text-uppercase", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: transactions.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: "text-center py-5", children: /* @__PURE__ */ jsx("p", { className: "text-muted m-0", children: "No transactions yet." }) }) }) : transactions.data.map((tx) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-0", children: /* @__PURE__ */ jsx("span", { className: "fw-medium text-dark", children: tx.description }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-0", children: /* @__PURE__ */ jsxs("span", { className: `fw-bold ${tx.type === "add" ? "text-success" : "text-danger"}`, children: [
              tx.type === "add" ? "+" : "-",
              " ",
              /* @__PURE__ */ jsx(Price, { amountAED: tx.amount })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-0", children: /* @__PURE__ */ jsx("span", { className: "badge bg-light text-dark text-capitalize px-3 rounded-pill border", children: tx.type }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-0", children: /* @__PURE__ */ jsx("span", { className: `badge rounded-pill px-3 ${tx.status === "completed" ? "bg-success-soft text-success" : tx.status === "pending" ? "bg-warning-soft text-warning" : "bg-danger-soft text-danger"}`, children: tx.status }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-0 text-muted small", children: new Date(tx.created_at).toLocaleDateString() })
          ] }, tx.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "card-footer bg-white border-0 py-3 px-4" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      AddMoneyModal,
      {
        isOpen: isAddMoneyModalOpen,
        onClose: () => setIsAddMoneyModalOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      PayoutModal,
      {
        isOpen: isPayoutModalOpen,
        onClose: () => setIsPayoutModalOpen(false),
        balance
      }
    ),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .bg-success-soft { background-color: rgba(40, 167, 69, 0.1); }
                .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
                .bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
                .tracking-wider { letter-spacing: 0.1em; }
            `
    } })
  ] });
}
export {
  Index as default
};
