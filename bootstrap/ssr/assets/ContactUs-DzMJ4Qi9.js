import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-DGCnkUrN.js";
import { C as ContactForm } from "./ContactForm-BQglLNCx.js";
import "ziggy-js";
import "react";
import "./productUrl-DG64MGAp.js";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "sweetalert2";
import "./useSessionKeepAlive-BIm1aJlj.js";
import "./ErrorPopup-VSFE5nHL.js";
function ContactUs() {
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Contact Us" }),
    /* @__PURE__ */ jsx("div", { className: "color py-5", children: /* @__PURE__ */ jsx(ContactForm, {}) })
  ] });
}
export {
  ContactUs as default
};
