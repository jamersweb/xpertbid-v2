import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { A as AppLayout } from "./AppLayout-CWZvIfaV.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { u as useTranslate } from "./useSessionKeepAlive-BIm1aJlj.js";
import "ziggy-js";
import "./productUrl-SijKnuS_.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function Register() {
  const { t } = useTranslate();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: ""
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("register"));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("auth.register"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("auth.register") }),
    /* @__PURE__ */ jsx("div", { className: "container-fluid py-5", style: { background: "#f8f9fa", minHeight: "80vh" }, children: /* @__PURE__ */ jsxs("div", { className: "login-form-step", children: [
      /* @__PURE__ */ jsx("div", { className: "step-heading-and-back text-center mb-4", children: /* @__PURE__ */ jsx("h3", { className: "fw-bold", children: t("auth.create_account") }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "auth-input-group", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: t("auth.name") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "name",
              name: "name",
              value: data.name,
              placeholder: t("auth.full_name"),
              onChange: (e) => setData("name", e.target.value),
              required: true,
              autoFocus: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: t("auth.email") }),
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
          /* @__PURE__ */ jsx("label", { className: "form-label small fw-bold text-muted", children: t("auth.password") }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              value: data.password,
              placeholder: t("auth.create_password"),
              onChange: (e) => setData("password", e.target.value),
              required: true
            }
          ),
          errors.password && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.password })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: processing, children: processing ? t("auth.registering") : t("auth.register") }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("login"),
            className: "small text-muted text-decoration-none",
            children: [
              t("auth.already_have_account"),
              " ",
              /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark text-decoration-underline", children: t("auth.log_in") })
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
