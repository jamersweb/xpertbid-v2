import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BH44Qpoe.js";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import ProfileSection from "./ProfileSection-Vio-Pnpz.js";
import AddressSection from "./AddressSection-C3VT2wVE.js";
import SecuritySection from "./SecuritySection-CaMZmEEF.js";
import ReferralSection from "./ReferralSection-DPbEmZ_w.js";
import NotificationSection from "./NotificationSection-CDhlYagw.js";
import IdentityVerificationSection from "./IdentityVerificationSection-FXS5U_R0.js";
import "ziggy-js";
import "./CartContext-DXNQZwkV.js";
import "sweetalert2";
import "./Price-CF5NSPt0.js";
import "./useCurrencyList-Ce5tJXO9.js";
import "axios";
import "react-loader-spinner";
import "./useSessionKeepAlive-BIm1aJlj.js";
function Edit({ auth, mustVerifyEmail, status, address, identity, notificationSettings }) {
  const { url, props } = usePage();
  const { flash } = props;
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const initialTab = queryParams.get("tab") || "profile";
  const [activeSection, setActiveSection] = useState(initialTab === "identity_verification" ? "identity" : initialTab);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Account Settings", children: [
    /* @__PURE__ */ jsx("section", { className: "account-setting bg-light", style: { minHeight: "100vh", padding: "80px 0" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx("h2", { className: "mkt-sec mb-5 px-3", style: { fontSize: "36px", fontWeight: "700", color: "#23262F" }, children: "Account Settings" }),
      /* @__PURE__ */ jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsx("div", { className: "col-md-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "setting bg-white shadow-sm p-4 p-md-5", style: { borderRadius: "25px", boxShadow: "0 45px 90px 0 #00000021" }, children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4", style: { fontSize: "20px", fontWeight: "700", color: "#23262F" }, children: "User Settings" }),
          /* @__PURE__ */ jsx("ul", { className: "userSettingsMenu list-unstyled", children: [
            { id: "profile", label: "My Profile" },
            { id: "address", label: "Address" },
            { id: "referral", label: "My Referral Code" },
            { id: "notifications", label: "Notification Settings" },
            { id: "password", label: "Password & Login" },
            { id: "identity", label: "Identity Verification" }
          ].map((item) => /* @__PURE__ */ jsx("li", { className: "mb-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              className: `btn w-100 text-start py-3 px-4 border-0 ${activeSection === item.id ? "active-item" : ""}`,
              style: {
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "30px",
                color: activeSection === item.id ? "#43ACE9" : "#353945",
                backgroundColor: activeSection === item.id ? "#DCECFA" : "transparent",
                fontFamily: '"Inter", sans-serif',
                transition: "all 0.3s ease"
              },
              onClick: () => setActiveSection(item.id),
              children: item.label
            }
          ) }, item.id)) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "col-md-8", children: /* @__PURE__ */ jsxs("div", { className: "user-profile bg-white shadow-sm p-4 p-md-5", style: { borderRadius: "25px", boxShadow: "0 45px 90px 0 #00000021" }, children: [
          activeSection === "profile" && /* @__PURE__ */ jsx(ProfileSection, { mustVerifyEmail, status }),
          activeSection === "address" && /* @__PURE__ */ jsx(AddressSection, {}, address?.id || "new-address"),
          activeSection === "referral" && /* @__PURE__ */ jsx(ReferralSection, {}),
          activeSection === "password" && /* @__PURE__ */ jsx(SecuritySection, {}),
          activeSection === "notifications" && /* @__PURE__ */ jsx(NotificationSection, {}),
          activeSection === "identity" && /* @__PURE__ */ jsx(IdentityVerificationSection, {})
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .active-item {
                    color: #43ACE9 !important;
                    background-color: #DCECFA !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button {
                    transition: all 0.3s ease !important;
                    padding: 10px 16px !important;
                    border-radius: 30px !important;
                }
                .userSettingsMenu button:hover:not(.active-item) {
                    background-color: #F8F8F8 !important;
                    color: #23262F !important;
                }
                .account-setting h3, .account-setting h4, .account-setting h2 {
                    font-family: "Inter", sans-serif;
                    color: #23262F;
                }
                .user-profile {
                    background: #fff;
                }
                .form-label {
                    color: #777E91;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                .form-control, .form-select {
                    border-radius: 12px !important;
                    padding: 12px 20px !important;
                    font-weight: 500;
                    color: #23262F;
                    border: 1px solid #E6E8EC !important;
                }
                
                /* Global Button Styles from xpertbid-frontend */
                .button-style-1 {
                    background-color: #43ACE9;
                    color: #fff;
                    border: 1px solid #43ACE9;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-2 {
                    background-color: #23262F;
                    color: #fff;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                .button-style-3 {
                    background-color: transparent;
                    color: #23262F;
                    border: 1px solid #23262F;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 500;
                    padding: 12px 24px;
                    transition: all 0.3s ease;
                }
                
                /* Shine effect */
                .button-style-1, .button-style-2, .button-style-3 {
                    position: relative;
                    overflow: hidden;
                }
                .button-style-1::after, .button-style-2::after, .button-style-3::after {
                    content: "";
                    position: absolute;
                    top: -70%;
                    left: -140%;
                    width: 80%;
                    height: 240%;
                    background: linear-gradient(115deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0) 100%);
                    transform: rotate(20deg);
                    opacity: 0;
                }
                .button-style-1:hover::after, .button-style-2:hover::after, .button-style-3:hover::after {
                    animation: button-shine-sweep 0.9s ease forwards;
                }
                @keyframes button-shine-sweep {
                    0% { left: -140%; opacity: 0; }
                    20% { opacity: 0.7; }
                    100% { left: 160%; opacity: 0; }
                }
                .button-style-1:hover, .button-style-2:hover, .button-style-3:hover {
                    filter: brightness(1.1);
                }

            ` })
  ] });
}
export {
  Edit as default
};
