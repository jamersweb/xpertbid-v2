import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppLayout } from "./AppLayout-drJ3vZBs.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { u as useTranslate } from "./CurrencyPicker-KgG9a2BI.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
function Login({ status, canResetPassword }) {
  const { t } = useTranslate();
  const [step, setStep] = useState("main");
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("login"));
  };
  const [phoneData, setPhoneData] = useState({ phone: "", otp: "", otp_type: "sms" });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState({});
  const sendOtp = async () => {
    setLoading(true);
    setPhoneErrors({});
    try {
      const response = await axios.post("/api/auth/send-otp", {
        phone: phoneData.phone,
        type: "login",
        otp_type: phoneData.otp_type
      });
      setOtpSent(true);
    } catch (error) {
      setPhoneErrors(error.response?.data?.errors || { phone: error.response?.data?.message || t("auth.failed_send_otp") });
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setLoading(true);
    setPhoneErrors({});
    try {
      const response = await axios.post("/api/auth/verify-otp", {
        phone: phoneData.phone,
        otp: phoneData.otp
      });
      router.visit(route("dashboard"));
    } catch (error) {
      setPhoneErrors(error.response?.data?.errors || { otp: error.response?.data?.message || t("auth.invalid_otp") });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = route("auth.google");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: t("auth.login_page_title"), children: [
    /* @__PURE__ */ jsx(Head, { title: t("auth.login_page_title") }),
    /* @__PURE__ */ jsxs("div", { className: "container-fluid py-5", style: { background: "#f8f9fa", minHeight: "80vh" }, children: [
      step === "main" && /* @__PURE__ */ jsxs("div", { className: "login-form-step text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 fw-bold", children: t("auth.login_or_signup") }),
        status && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-green-600", children: status }),
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          setStep("phone");
          setPhoneData({ ...phoneData, otp_type: "whatsapp" });
        }, className: "loginContinueIcon", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp me-2 fs-5 text-success" }),
          t("auth.continue_whatsapp")
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          setStep("phone");
          setPhoneData({ ...phoneData, otp_type: "sms" });
        }, className: "loginContinueIcon", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-mobile-screen me-2 fs-5" }),
          t("auth.continue_phone")
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: handleGoogleLogin, className: "loginContinueIcon", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-brands fa-google me-2 fs-5 text-danger" }),
          t("auth.continue_google")
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setStep("email"), className: "loginContinueIcon", children: [
          /* @__PURE__ */ jsx("i", { className: "fa-regular fa-envelope me-2 fs-5" }),
          t("auth.continue_email")
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-4 text-muted small", children: [
          t("auth.by_continuing_prefix"),
          " xpertBid ",
          /* @__PURE__ */ jsx(Link, { href: route("terms"), className: "text-decoration-underline text-primary", children: t("auth.terms_of_service") }),
          " ",
          t("auth.and"),
          " ",
          /* @__PURE__ */ jsx(Link, { href: route("privacy.policy"), className: "text-decoration-underline text-primary", children: t("auth.privacy_policy") }),
          "."
        ] })
      ] }),
      step === "email" && /* @__PURE__ */ jsxs("div", { className: "login-form-step", children: [
        /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
          /* @__PURE__ */ jsx("button", { id: "backPhoneLogin", onClick: () => setStep("main"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
          /* @__PURE__ */ jsx("h3", { children: t("auth.login_with_email") })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "auth-input-group", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                placeholder: t("auth.enter_email"),
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                required: true,
                autoFocus: true
              }
            ),
            errors.email && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                type: "password",
                placeholder: t("auth.enter_password_placeholder"),
                value: data.password,
                onChange: (e) => setData("password", e.target.value),
                required: true
              }
            ),
            errors.password && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mt-3 mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "d-flex align-items-center small text-muted", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: data.remember,
                  onChange: (e) => setData("remember", e.target.checked),
                  className: "me-2",
                  style: { width: "auto", margin: 0 }
                }
              ),
              t("auth.remember_me")
            ] }),
            canResetPassword && /* @__PURE__ */ jsx(
              Link,
              {
                href: route("password.request"),
                className: "small text-decoration-none text-dark fw-bold",
                children: t("auth.forgot_password")
              }
            )
          ] }),
          /* @__PURE__ */ jsx("button", { className: "form-button-1", disabled: processing, children: processing ? t("auth.logging_in") : t("auth.continue") }),
          /* @__PURE__ */ jsxs("div", { className: "text-center mt-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted small", children: [
              t("auth.no_account"),
              " "
            ] }),
            /* @__PURE__ */ jsx(Link, { href: route("register"), className: "small fw-bold text-dark text-decoration-underline", children: t("auth.register") })
          ] })
        ] })
      ] }),
      step === "phone" && /* @__PURE__ */ jsxs("div", { className: "login-form-step", children: [
        /* @__PURE__ */ jsxs("div", { className: "step-heading-and-back", children: [
          /* @__PURE__ */ jsx("button", { id: "backPhoneLogin", onClick: () => setStep("main"), children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-chevron-left" }) }),
          /* @__PURE__ */ jsx("h3", { children: phoneData.otp_type === "whatsapp" ? t("auth.login_with_whatsapp") : t("auth.login_with_phone") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "auth-input-group", children: !otpSent ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-center text-muted mb-4 small", children: [
            "Enter your phone number to receive a verification code via ",
            phoneData.otp_type === "whatsapp" ? "WhatsApp" : "SMS",
            "."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "phone-input-wrapper mb-4", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                placeholder: "Enter phone number (e.g., 923...)",
                value: phoneData.phone,
                onChange: (e) => setPhoneData({ ...phoneData, phone: e.target.value }),
                className: "w-full"
              }
            ),
            phoneErrors.phone && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: phoneErrors.phone })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: sendOtp,
              className: "form-button-1",
              disabled: loading,
              children: loading ? "Sending..." : "Send OTP"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-center text-muted mb-4 small", children: [
            "An OTP has been sent to ",
            phoneData.phone,
            "."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "otp-input-wrapper mb-4", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Enter 6-digit OTP",
                value: phoneData.otp,
                onChange: (e) => setPhoneData({ ...phoneData, otp: e.target.value }),
                maxLength: 6,
                className: "w-full text-center tracking-widest font-bold text-xl"
              }
            ),
            phoneErrors.otp && /* @__PURE__ */ jsx("div", { className: "text-danger small mt-1", children: phoneErrors.otp })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: verifyOtp,
              className: "form-button-1",
              disabled: loading,
              children: loading ? "Verifying..." : "Verify & Login"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-center mt-3", children: /* @__PURE__ */ jsx("button", { onClick: () => setOtpSent(false), className: "btn btn-link btn-sm text-dark text-decoration-none", children: "Change Phone Number" }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Login as default
};
