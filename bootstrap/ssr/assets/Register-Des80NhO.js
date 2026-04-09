import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { A as AppLayout } from "./AppLayout-C9PL0wyf.js";
import { useForm, Head, Link } from "@inertiajs/react";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./CurrencyPicker-BYSFLoir.js";
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("register"));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Register", children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsx("div", { className: "container-fluid py-5", style: { background: "#f8f9fa", minHeight: "80vh" }, children: /* @__PURE__ */ jsxs("div", { className: "login-form-step", children: [
      /* @__PURE__ */ jsx("div", { className: "step-heading-and-back text-center mb-4", children: /* @__PURE__ */ jsx("h3", { className: "fw-bold", children: "Create Account" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "auth-input-group", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: "Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "name",
              name: "name",
              value: data.name,
              placeholder: "Full Name",
              onChange: (e) => setData("name", e.target.value),
              required: true,
              autoFocus: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: "Email" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              type: "email",
              name: "email",
              value: data.email,
              placeholder: "name@example.com",
              onChange: (e) => setData("email", e.target.value),
              required: true
            }
          ),
          errors.email && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              value: data.password,
              placeholder: "Create a password",
              onChange: (e) => setData("password", e.target.value),
              required: true
            }
          ),
          errors.password && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: "Confirm Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password_confirmation",
              type: "password",
              name: "password_confirmation",
              value: data.password_confirmation,
              placeholder: "Confirm password",
              onChange: (e) => setData("password_confirmation", e.target.value),
              required: true
            }
          ),
          errors.password_confirmation && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: processing, children: processing ? "Registering..." : "Register" }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("login"),
            className: "small text-muted text-decoration-none",
            children: [
              "Already have an account? ",
              /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark text-decoration-underline", children: "Log in" })
            ]
          }
        ) })
      ] })
    ] }) })
  ] });
}
export {
  Register as default
};
