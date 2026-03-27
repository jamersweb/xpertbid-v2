import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
function ReferralSection() {
  const { auth } = usePage().props;
  const referralCode = auth.user.referral_code;
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", marginBottom: "20px" }, children: "My Referral Code" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted mb-4", children: "Share this code with your friends and earn rewards when they join XpertBid." }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 d-flex align-items-center justify-content-between mb-4", style: { backgroundColor: "#F4F7FE", borderRadius: "15px", border: "1px dashed #D2D9EE" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", letterSpacing: "2px" }, children: referralCode || "Not Generated" }),
      referralCode && /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn btn-link text-decoration-none",
          onClick: handleCopy,
          style: { color: copied ? "#45B36B" : "#43ACE9", fontWeight: "600", transition: "all 0.3s ease" },
          children: copied ? "Copied!" : "Copy Code"
        }
      )
    ] })
  ] });
}
export {
  ReferralSection as default
};
