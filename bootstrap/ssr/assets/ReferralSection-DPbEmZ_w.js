import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
const money = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;
const colors = {
  dark: "#151927",
  body: "#596579",
  muted: "#6F7A8F",
  border: "#DCE5F2",
  soft: "#F4F7FE"
};
function ReferralSection() {
  const [data, setData] = useState(null);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const loadReferral = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(route("referrals.me"));
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load referral details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadReferral();
  }, []);
  const handleCopy = () => {
    if (!data?.referral_code) return;
    navigator.clipboard.writeText(data.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const applyCode = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await axios.post(route("referrals.apply"), { referral_code: code });
      setCode("");
      setMessage("Referral code linked successfully.");
      await loadReferral();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors?.referral_code?.[0] || err.response?.data?.message || "Unable to apply referral code.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3", style: { fontSize: "24px", fontWeight: "700", color: "#23262F" }, children: "Referral Program" }),
      /* @__PURE__ */ jsx("div", { className: "p-4 rounded-4 bg-light text-muted", children: "Loading referral details..." })
    ] });
  }
  const summary = data?.summary || {};
  const rewards = data?.rewards || [];
  return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", marginBottom: "10px" }, children: "Referral Program" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", style: { color: colors.body, fontWeight: 500 }, children: "Share your code. When a referred user completes an approved sale or purchase, XpertBid can approve a 1% reward." }),
    error && /* @__PURE__ */ jsx("div", { className: "alert alert-danger py-2", children: error }),
    message && /* @__PURE__ */ jsx("div", { className: "alert alert-success py-2", children: message }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4", style: { backgroundColor: colors.soft, borderRadius: "18px", border: `1px dashed ${colors.border}` }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 small fw-bold text-uppercase", style: { color: colors.body }, children: "Your referral code" }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: "26px", fontWeight: "800", color: colors.dark, letterSpacing: "2px" }, children: data?.referral_code || "Not Generated" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "button-style-2",
          onClick: handleCopy,
          disabled: !data?.referral_code,
          type: "button",
          children: copied ? "Copied!" : "Copy Code"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "row g-3 mb-4", children: [
      ["Pending", summary.pending],
      ["Approved", summary.approved],
      ["Paid", summary.paid],
      ["Total referrals", summary.total_referrals]
    ].map(([label, value]) => /* @__PURE__ */ jsx("div", { className: "col-6 col-lg-3", children: /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-4 bg-white h-100", style: { border: `1px solid ${colors.border}` }, children: [
      /* @__PURE__ */ jsx("p", { className: "small mb-1", style: { color: colors.body, fontWeight: 600 }, children: label }),
      /* @__PURE__ */ jsx("h5", { className: "mb-0 fw-bold", style: { color: colors.dark }, children: label === "Total referrals" ? value || 0 : money(value) })
    ] }) }, label)) }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-4 mb-4", style: { border: `1px solid ${colors.border}`, backgroundColor: "#FFFFFF" }, children: [
      /* @__PURE__ */ jsx("h5", { className: "fw-bold mb-2", style: { color: colors.dark }, children: "Code used on your account" }),
      data?.referred_by ? /* @__PURE__ */ jsxs("p", { className: "mb-0", style: { color: colors.body }, children: [
        "Linked to ",
        data.referred_by.name || data.referred_by.email,
        "."
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: applyCode, className: "d-flex flex-column flex-md-row gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "form-control",
            style: { color: colors.dark, borderColor: colors.border },
            value: code,
            onChange: (event) => setCode(event.target.value.toUpperCase()),
            placeholder: "Enter referral code once",
            maxLength: 50
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "button-style-1", type: "submit", disabled: saving || !code.trim(), children: saving ? "Applying..." : "Apply Code" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h5", { className: "fw-bold mb-3", style: { color: colors.dark }, children: "Reward History" }),
    /* @__PURE__ */ jsx("div", { className: "table-responsive rounded-4 border", children: /* @__PURE__ */ jsxs("table", { className: "table mb-0 align-middle", children: [
      /* @__PURE__ */ jsx("thead", { className: "table-light", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { style: { color: colors.dark }, children: "Source" }),
        /* @__PURE__ */ jsx("th", { style: { color: colors.dark }, children: "Base" }),
        /* @__PURE__ */ jsx("th", { style: { color: colors.dark }, children: "Reward" }),
        /* @__PURE__ */ jsx("th", { style: { color: colors.dark }, children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: rewards.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "text-center py-4", style: { color: colors.body }, children: "No referral rewards yet." }) }) : rewards.map((reward) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsxs("td", { style: { color: colors.dark }, children: [
          /* @__PURE__ */ jsx("strong", { children: reward.listing?.title || reward.order?.order_number || reward.trigger_type }),
          /* @__PURE__ */ jsx("div", { className: "small text-capitalize", style: { color: colors.muted }, children: reward.trigger_type })
        ] }),
        /* @__PURE__ */ jsx("td", { style: { color: colors.dark }, children: money(reward.amount_base) }),
        /* @__PURE__ */ jsx("td", { style: { color: colors.dark }, children: money(reward.reward_amount) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "badge rounded-pill bg-secondary text-capitalize", children: reward.status }) })
      ] }, reward.id)) })
    ] }) })
  ] });
}
export {
  ReferralSection as default
};
