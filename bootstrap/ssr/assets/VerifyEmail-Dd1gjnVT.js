import { jsxs, jsx } from "react/jsx-runtime";
import { M as Modal } from "./Modal-DHAPaXZd.js";
import { P as PrimaryButton } from "./PrimaryButton-DgVfVBwo.js";
import { A as AppLayout } from "./AppLayout-CWZvIfaV.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { useRef } from "react";
import "@headlessui/react";
import "ziggy-js";
import "./productUrl-SijKnuS_.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
function VerifyEmail({ status }) {
  const { auth } = usePage().props;
  const otpInputRefs = useRef([]);
  const {
    data,
    setData,
    post,
    processing,
    errors,
    clearErrors
  } = useForm({
    code: ""
  });
  const resendForm = useForm({});
  const updateCodeDigit = (index, value) => {
    clearErrors("code");
    const digits = value.replace(/\D/g, "");
    if (digits.length > 1) {
      const nextCode2 = digits.slice(0, 6);
      setData("code", nextCode2);
      otpInputRefs.current[Math.min(nextCode2.length, 5)]?.focus();
      return;
    }
    const codeDigits = (data.code || "").padEnd(6, " ").split("");
    codeDigits[index] = digits;
    const nextCode = codeDigits.join("").replace(/\s/g, "");
    setData("code", nextCode);
    if (digits && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };
  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !(data.code || "")[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };
  const verifyCode = (e) => {
    e.preventDefault();
    post(route("verification.code.verify"));
  };
  const resendCode = (e) => {
    e.preventDefault();
    resendForm.post(route("verification.send"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Email Verification", children: [
    /* @__PURE__ */ jsx(Head, { title: "Email Verification" }),
    /* @__PURE__ */ jsx("div", { className: "verify-email-shell", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "verify-email-shell__inner" }) }),
    /* @__PURE__ */ jsx(Modal, { show: true, closeable: false, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("div", { className: "verify-email-modal", children: [
      /* @__PURE__ */ jsx("div", { className: "verify-email-modal__header", children: /* @__PURE__ */ jsx("h2", { children: "Verify Email" }) }),
      /* @__PURE__ */ jsx("div", { className: "verify-email-modal__divider" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Enter the 6-digit verification code sent to",
        " ",
        /* @__PURE__ */ jsx("span", { children: auth?.user?.email || "your email address" }),
        "."
      ] }),
      status === "verification-code-sent" && /* @__PURE__ */ jsx("div", { className: "verify-email-alert verify-email-alert--success", children: "A new verification code has been sent." }),
      status === "verification-code-failed" && /* @__PURE__ */ jsx("div", { className: "verify-email-alert verify-email-alert--error", children: "We could not send the verification code right now. Please try again later." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: verifyCode, className: "verify-email-code-form", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "verify-email-code-inputs",
            onPaste: (e) => {
              e.preventDefault();
              updateCodeDigit(0, e.clipboardData.getData("text"));
            },
            children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx(
              "input",
              {
                ref: (el) => otpInputRefs.current[index] = el,
                type: "text",
                inputMode: "numeric",
                maxLength: 1,
                value: (data.code || "")[index] || "",
                onChange: (e) => updateCodeDigit(index, e.target.value),
                onKeyDown: (e) => handleCodeKeyDown(index, e),
                "aria-label": `Verification code digit ${index + 1}`
              },
              index
            ))
          }
        ),
        errors.code && /* @__PURE__ */ jsx("div", { className: "verify-email-alert verify-email-alert--error", children: errors.code }),
        /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing || data.code.length < 6, children: processing ? "Verifying..." : "Verify Email" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "verify-email-modal__actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "verify-email-modal__link",
            disabled: resendForm.processing,
            onClick: resendCode,
            children: resendForm.processing ? "Sending..." : "Resend Code"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "verify-email-modal__muted", children: "Check spam folder if you do not see the email." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .verify-email-shell {
                    min-height: 62vh;
                    background: #f6f8fb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .verify-email-shell__inner {
                    width: min(720px, calc(100vw - 32px));
                    height: 220px;
                    border: 1px dashed #d8e0ea;
                    border-radius: 8px;
                    background: #ffffff;
                    opacity: 0.45;
                }
                #modal .verify-email-modal {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .verify-email-modal {
                    padding: 20px 20px 28px;
                    text-align: center;
                    color: #23262f;
                }
                .verify-email-modal__header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .verify-email-modal h2 {
                    margin: 0;
                    font-size: 25px;
                    line-height: 1.25;
                    font-weight: 800;
                    letter-spacing: 0;
                }
                .verify-email-modal__divider {
                    height: 1px;
                    background: #eceef2;
                    margin: 0 0 40px;
                }
                .verify-email-modal p {
                    margin: 0 0 28px;
                    color: #5f6472;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.6;
                    text-align: left;
                }
                .verify-email-modal p span {
                    color: #23262f;
                    display: block;
                    margin-top: 12px;
                    border-radius: 10px;
                    background: #eaf1ff;
                    border: 1px solid #dce7ff;
                    padding: 18px 20px;
                    font-size: 16px;
                    font-weight: 800;
                    overflow-wrap: anywhere;
                }
                .verify-email-code-form {
                    margin: 0;
                }
                .verify-email-code-inputs {
                    display: grid;
                    grid-template-columns: repeat(6, minmax(0, 1fr));
                    gap: 10px;
                    margin: 0 0 34px;
                }
                .verify-email-code-inputs input {
                    width: 100%;
                    height: 66px;
                    border: 1px solid #eef2f7;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #23262f;
                    font-size: 26px;
                    font-weight: 800;
                    text-align: center;
                    outline: none;
                    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                .verify-email-code-inputs input:focus {
                    border-color: #dce7ff;
                    background: #eaf1ff;
                    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08), 0 0 0 3px rgba(67, 172, 233, 0.12);
                }
                .verify-email-code-form > button {
                    min-height: 66px;
                    width: 100%;
                    justify-content: center;
                    border-radius: 10px;
                    background: #23262f;
                    font-size: 17px;
                    font-weight: 800;
                    text-transform: none;
                }
                .verify-email-alert {
                    margin: 0 0 16px;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.45;
                }
                .verify-email-alert--success {
                    background: #ecfdf3;
                    color: #027a48;
                }
                .verify-email-alert--error {
                    background: #fff1f3;
                    color: #c01048;
                }
                .verify-email-modal__actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    flex-wrap: wrap;
                    margin-top: 18px;
                }
                .verify-email-modal__link {
                    border: 0;
                    background: transparent;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: underline;
                    cursor: pointer;
                    min-height: 36px;
                    padding: 0 4px;
                }
                .verify-email-modal__link:hover {
                    color: #23262f;
                }
                .verify-email-modal__link:disabled {
                    cursor: not-allowed;
                    opacity: 0.65;
                }
                .verify-email-modal__muted {
                    color: #8a90a0;
                    font-size: 13px;
                    font-weight: 600;
                }
                @media (max-width: 640px) {
                    .verify-email-shell {
                        min-height: 46vh;
                    }
                    .verify-email-modal {
                        padding: 18px 16px 24px;
                    }
                    .verify-email-modal h2 {
                        font-size: 22px;
                    }
                    .verify-email-modal__divider {
                        margin-bottom: 28px;
                    }
                    .verify-email-modal p {
                        font-size: 15px;
                    }
                    .verify-email-code-inputs {
                        gap: 6px;
                    }
                    .verify-email-code-inputs input {
                        height: 54px;
                        font-size: 21px;
                    }
                    .verify-email-code-form > button {
                        min-height: 54px;
                    }
                }
            ` })
  ] });
}
export {
  VerifyEmail as default
};
