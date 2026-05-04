import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-drJ3vZBs.js";
import { useState } from "react";
import { S as SuccessPopup, E as ErrorPopup } from "./ErrorPopup-VSFE5nHL.js";
import { u as useTranslate } from "./CurrencyPicker-KgG9a2BI.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
const ContactForm = () => {
  const { t } = useTranslate();
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
    clearErrors(e.target.name);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    post(route("contact.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setSuccessPopupMessage(t("contact.success"));
        setSuccessPopupSubMessage(t("contact.success_sub"));
        setShowSuccessPopup(true);
        reset();
      },
      onError: (validationErrors) => {
        setErrorPopupMessage(t("contact.error"));
        setErrorPopupSubMessage(Object.values(validationErrors).join(" "));
        setShowErrorPopup(true);
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "container py-4", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
    /* @__PURE__ */ jsxs("div", { className: "col-md-6 contact-section text-gray-900", children: [
      /* @__PURE__ */ jsx("h2", { className: "main-heading-about mb-4 text-gray-900", children: t("contact.title") }),
      /* @__PURE__ */ jsxs("div", { className: "social-icons mb-4", children: [
        /* @__PURE__ */ jsx("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "67", height: "67", viewBox: "0 0 67 67", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M36.3701 5.5835C39.5107 5.59187 41.1048 5.60862 42.4811 5.6477L43.0227 5.66725C43.648 5.68958 44.2649 5.7175 45.0103 5.751C47.9807 5.89058 50.0074 6.35958 51.7857 7.04912C53.6282 7.7582 55.1804 8.71854 56.7325 10.2679C58.1526 11.663 59.2511 13.3512 59.9513 15.2147C60.6409 16.993 61.1099 19.0198 61.2495 21.9929C61.283 22.7355 61.3109 23.3525 61.3332 23.9806L61.3499 24.5222C61.3918 25.8957 61.4086 27.4897 61.4142 30.6303L61.4169 32.7129V36.37C61.4237 38.4062 61.4023 40.4425 61.3527 42.4782L61.336 43.0197C61.3137 43.6479 61.2857 44.2648 61.2522 45.0074C61.1127 47.9805 60.6381 50.0045 59.9513 51.7856C59.2511 53.6491 58.1526 55.3373 56.7325 56.7324C55.3374 58.1525 53.6492 59.251 51.7857 59.9512C50.0074 60.6407 47.9807 61.1097 45.0103 61.2493L43.0227 61.3331L42.4811 61.3498C41.1048 61.3889 39.5107 61.4085 36.3701 61.414L34.2875 61.4168H30.6332C28.5961 61.424 26.5589 61.4026 24.5223 61.3526L23.9807 61.3359C23.318 61.3108 22.6554 61.2819 21.993 61.2493C19.0227 61.1097 16.996 60.6407 15.2149 59.9512C13.3524 59.2507 11.6651 58.1522 10.2708 56.7324C8.84972 55.3376 7.75026 53.6493 7.04924 51.7856C6.3597 50.0073 5.8907 47.9805 5.75112 45.0074L5.66737 43.0197L5.65341 42.4782C5.60195 40.4425 5.57868 38.4063 5.58362 36.37V30.6303C5.57589 28.5941 5.59637 26.5578 5.64504 24.5222L5.66458 23.9806C5.68691 23.3525 5.71483 22.7355 5.74833 21.9929C5.88791 19.0198 6.35691 16.9958 7.04645 15.2147C7.7491 13.3505 8.85049 11.6622 10.2736 10.2679C11.6671 8.84849 13.3534 7.75003 15.2149 7.04912C16.996 6.35958 19.0199 5.89058 21.993 5.751C22.7356 5.7175 23.3554 5.68958 23.9807 5.66725L24.5223 5.6505C26.5579 5.6009 28.5942 5.57949 30.6305 5.58629L36.3701 5.5835ZM33.5003 19.5418C29.7983 19.5418 26.2479 21.0124 23.6303 23.6301C21.0126 26.2478 19.542 29.7982 19.542 33.5002C19.542 37.2021 21.0126 40.7525 23.6303 43.3702C26.2479 45.9879 29.7983 47.4585 33.5003 47.4585C37.2023 47.4585 40.7526 45.9879 43.3703 43.3702C45.988 40.7525 47.4586 37.2021 47.4586 33.5002C47.4586 29.7982 45.988 26.2478 43.3703 23.6301C40.7526 21.0124 37.2023 19.5418 33.5003 19.5418ZM33.5003 25.1252C34.6001 25.125 35.6892 25.3414 36.7054 25.7621C37.7215 26.1829 38.6449 26.7996 39.4227 27.5772C40.2005 28.3547 40.8176 29.2779 41.2386 30.2939C41.6597 31.3099 41.8765 32.3989 41.8767 33.4988C41.8769 34.5986 41.6604 35.6877 41.2397 36.7038C40.819 37.72 40.2022 38.6434 39.4247 39.4212C38.6471 40.199 37.724 40.8161 36.7079 41.2371C35.6919 41.6582 34.6029 41.875 33.5031 41.8752C31.2819 41.8752 29.1517 40.9928 27.5811 39.4222C26.0104 37.8516 25.1281 35.7214 25.1281 33.5002C25.1281 31.279 26.0104 29.1488 27.5811 27.5781C29.1517 26.0075 31.2819 25.1252 33.5031 25.1252M48.1593 15.3543C47.2338 15.3543 46.3462 15.722 45.6918 16.3764C45.0374 17.0308 44.6697 17.9184 44.6697 18.8439C44.6697 19.7694 45.0374 20.657 45.6918 21.3114C46.3462 21.9658 47.2338 22.3335 48.1593 22.3335C49.0848 22.3335 49.9724 21.9658 50.6268 21.3114C51.2813 20.657 51.6489 19.7694 51.6489 18.8439C51.6489 17.9184 51.2813 17.0308 50.6268 16.3764C49.9724 15.722 49.0848 15.3543 48.1593 15.3543Z", fill: "#43ACE9" }) }) }),
        /* @__PURE__ */ jsx("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.linkedin.com/company/xpertbid/", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "51", height: "51", viewBox: "0 0 51 51", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M45.0417 0.375C46.5225 0.375 47.9426 0.963242 48.9897 2.01032C50.0368 3.0574 50.625 4.47754 50.625 5.95833V45.0417C50.625 46.5225 50.0368 47.9426 48.9897 48.9897C47.9426 50.0368 46.5225 50.625 45.0417 50.625H5.95833C4.47754 50.625 3.0574 50.0368 2.01032 48.9897C0.963242 47.9426 0.375 46.5225 0.375 45.0417V5.95833C0.375 4.47754 0.963242 3.0574 2.01032 2.01032C3.0574 0.963242 4.47754 0.375 5.95833 0.375H45.0417ZM43.6458 43.6458V28.85C43.6458 26.4363 42.687 24.1215 40.9803 22.4147C39.2735 20.708 36.9587 19.7492 34.545 19.7492C32.1721 19.7492 29.4083 21.2008 28.0683 23.3783V20.2796H20.2796V43.6458H28.0683V29.8829C28.0683 27.7333 29.7992 25.9746 31.9488 25.9746C32.9853 25.9746 33.9794 26.3864 34.7124 27.1193C35.4453 27.8523 35.8571 28.8464 35.8571 29.8829V43.6458H43.6458ZM11.2067 15.8967C12.4505 15.8967 13.6435 15.4025 14.523 14.523C15.4025 13.6435 15.8967 12.4505 15.8967 11.2067C15.8967 8.61042 13.8029 6.48875 11.2067 6.48875C9.9554 6.48875 8.75538 6.98581 7.8706 7.8706C6.98581 8.75538 6.48875 9.9554 6.48875 11.2067C6.48875 13.8029 8.61042 15.8967 11.2067 15.8967ZM15.0871 43.6458V20.2796H7.35417V43.6458H15.0871Z", fill: "#43ACE9" }) }) }),
        /* @__PURE__ */ jsx("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "67", height: "67", viewBox: "0 0 67 67", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M25.6771 60.0207H36.8438V37.6594H46.9049L48.0104 26.5486H36.8438V20.9373C36.8438 20.1969 37.1379 19.4869 37.6614 18.9633C38.185 18.4398 38.8951 18.1457 39.6354 18.1457H48.0104V6.979H39.6354C35.9335 6.979 32.3831 8.44961 29.7654 11.0673C27.1477 13.685 25.6771 17.2354 25.6771 20.9373V26.5486H20.0938L18.9883 37.6594H25.6771V60.0207Z", fill: "#43ACE9" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "contact-container", children: [
        /* @__PURE__ */ jsx("div", { className: "contact-item", children: "support@xpertbid.com" }),
        /* @__PURE__ */ jsx("div", { className: "contact-item", children: "+923022113202" }),
        /* @__PURE__ */ jsx("div", { className: "contact-item", children: /* @__PURE__ */ jsx("span", { className: "ms-1", style: { fontSize: "18px" }, children: t("contact.address") }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "col-md-6", children: /* @__PURE__ */ jsxs("div", { className: "ms-md-auto contact-form shadow-lg bg-white", children: [
      /* @__PURE__ */ jsx("h2", { className: "fw-bolder my-4 text-gray-900", children: t("contact.form_title") }),
      showSuccessPopup && /* @__PURE__ */ jsx(SuccessPopup, { isOpen: showSuccessPopup, onClose: () => setShowSuccessPopup(false), message: successPopupMessage, subMessage: successPopupSubMessage }),
      showErrorPopup && /* @__PURE__ */ jsx(ErrorPopup, { isOpen: showErrorPopup, onClose: () => setShowErrorPopup(false), message: errorPopupMessage, subMessage: errorPopupSubMessage }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "text-gray-900", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { children: t("contact.name") }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "name", value: data.name, onChange: handleChange, className: "ps-4", required: true }),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-danger small", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { children: t("contact.email") }),
          /* @__PURE__ */ jsx("input", { type: "email", name: "email", value: data.email, onChange: handleChange, className: "ps-4", required: true }),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-danger small", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { children: t("contact.phone") }),
          /* @__PURE__ */ jsx("input", { type: "number", name: "subject", value: data.subject, onChange: handleChange, className: "ps-4", required: true }),
          errors.subject && /* @__PURE__ */ jsx("p", { className: "text-danger small", children: errors.subject })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { children: t("contact.message") }),
          /* @__PURE__ */ jsx("textarea", { name: "message", value: data.message, onChange: handleChange, className: "ps-4", required: true }),
          errors.message && /* @__PURE__ */ jsx("p", { className: "text-danger small", children: errors.message })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "py-4", disabled: processing, children: processing ? t("contact.sending") : t("contact.send") }) })
      ] })
    ] }) })
  ] }) });
};
function ContactUs() {
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Contact Us" }),
    /* @__PURE__ */ jsx("div", { className: "color py-5", children: /* @__PURE__ */ jsx(ContactForm, {}) })
  ] });
}
export {
  ContactUs as default
};
