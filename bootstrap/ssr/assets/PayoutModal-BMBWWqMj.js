import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { useForm } from "@inertiajs/react";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import "@headlessui/react";
function PayoutModal({ isOpen, onClose, balance }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    amount: "",
    payment_method: "bank_transfer"
  });
  const submit = (e) => {
    e.preventDefault();
    if (Number(data.amount) > balance) {
      alert("Insufficient balance for this payout request.");
      return;
    }
    post(route("payment_requests.store"), {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };
  return /* @__PURE__ */ jsx(Modal, { show: isOpen, onClose, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center justify-content-between mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold m-0 text-dark", children: "Request Payout" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "btn-close" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-light p-3 rounded-3 mb-4 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-muted small fw-bold text-uppercase", children: "Current Balance" }),
      /* @__PURE__ */ jsxs("h3", { className: "h4 fw-bold text-primary mb-0", children: [
        "PKR ",
        Number(balance).toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold small text-muted text-uppercase", children: "Payout Amount (PKR)" }),
        /* @__PURE__ */ jsxs("div", { className: "input-group input-group-lg shadow-sm border rounded-3 overflow-hidden", children: [
          /* @__PURE__ */ jsx("span", { className: "input-group-text border-0 bg-white", children: "PKR" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              className: "form-control border-0",
              value: data.amount,
              onChange: (e) => setData("amount", e.target.value),
              placeholder: "Min 50",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "form-text small mt-1 text-muted", children: "A minimum of 50 PKR is required." }),
        errors.amount && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold small text-muted text-uppercase", children: "Payment Method" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "form-select form-select-lg border shadow-sm rounded-3",
            value: data.payment_method,
            onChange: (e) => setData("payment_method", e.target.value),
            required: true,
            children: [
              /* @__PURE__ */ jsx("option", { value: "bank_transfer", children: "Bank Transfer" }),
              /* @__PURE__ */ jsx("option", { value: "paypal", children: "PayPal" })
            ]
          }
        ),
        errors.payment_method && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.payment_method })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 d-grid", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "btn btn-dark btn-lg rounded-pill fw-bold py-3 shadow",
          disabled: processing,
          children: processing ? "Processing..." : "Submit Request"
        }
      ) })
    ] })
  ] }) });
}
export {
  PayoutModal as default
};
