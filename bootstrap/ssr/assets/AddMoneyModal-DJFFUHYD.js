import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { useForm } from "@inertiajs/react";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import "@headlessui/react";
function AddMoneyModal({ isOpen, onClose }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    amount: "",
    payment_method: "stripe"
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("wallet.add"), {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };
  return /* @__PURE__ */ jsx(Modal, { show: isOpen, onClose, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center justify-content-between mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "h4 fw-bold m-0 text-dark", children: "Add Money to Wallet" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "btn-close" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold small text-muted text-uppercase", children: "Amount (PKR)" }),
        /* @__PURE__ */ jsxs("div", { className: "input-group input-group-lg shadow-sm border rounded-3 overflow-hidden", children: [
          /* @__PURE__ */ jsx("span", { className: "input-group-text border-0 bg-white", children: "PKR" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              className: "form-control border-0",
              value: data.amount,
              onChange: (e) => setData("amount", e.target.value),
              placeholder: "0.00",
              required: true
            }
          )
        ] }),
        errors.amount && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold small text-muted text-uppercase", children: "Payment Method" }),
        /* @__PURE__ */ jsx("div", { className: "row g-2", children: ["stripe", "paypal", "bank_transfer"].map((method) => /* @__PURE__ */ jsxs("div", { className: "col-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              className: "btn-check",
              name: "payment_method",
              id: `method-${method}`,
              value: method,
              checked: data.payment_method === method,
              onChange: (e) => setData("payment_method", e.target.value),
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxs("label", { className: "btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center gap-2 border rounded-3", htmlFor: `method-${method}`, children: [
            /* @__PURE__ */ jsx("i", { className: `fa-solid ${method === "stripe" ? "fa-credit-card" : method === "paypal" ? "fa-brands fa-paypal" : "fa-building-columns"} fs-5` }),
            /* @__PURE__ */ jsx("span", { className: "small fw-bold text-capitalize", children: method.replace("_", " ") })
          ] })
        ] }, method)) }),
        errors.payment_method && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.payment_method })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 d-grid", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "btn btn-primary btn-lg rounded-pill fw-bold py-3 shadow",
          disabled: processing,
          children: processing ? "Processing..." : "Confirm Deposit"
        }
      ) })
    ] })
  ] }) });
}
export {
  AddMoneyModal as default
};
