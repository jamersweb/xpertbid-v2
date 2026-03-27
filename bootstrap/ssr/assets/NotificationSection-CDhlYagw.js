import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
function NotificationSection() {
  const { notificationSettings: savedSettings } = usePage().props;
  const [preferences, setPreferences] = useState({
    inspiration: savedSettings?.inspiration || false,
    newsletter: savedSettings?.newsletter || false,
    outbid: savedSettings?.outbid || false,
    republished: savedSettings?.republished || false,
    oneDayReminder: savedSettings?.oneDayReminder || false,
    oneHourReminder: savedSettings?.oneHourReminder || false,
    fifteenMinutesReminder: savedSettings?.fifteenMinutesReminder || false
  });
  const [loading, setLoading] = useState(false);
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post(route("user.notifications.update"), preferences, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-5", children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", margin: 0 }, children: "Notification Settings" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "button-style-2",
          onClick: handleSave,
          disabled: loading,
          children: loading ? "Saving..." : "Save Changes"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-muted mb-5", style: { fontSize: "14px", color: "#777E91" }, children: "Manage your notification preferences to stay updated on auction wins, bids, and important updates. Customize how and when you would like to receive alerts." }),
    /* @__PURE__ */ jsxs("div", { className: "notify-setting-inner-box mb-5", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3", style: { fontSize: "20px", fontWeight: "700" }, children: "Newsletters" }),
      /* @__PURE__ */ jsxs("div", { className: "nofify-form-1 d-flex flex-column gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: "inspiration",
              id: "inspiration",
              checked: preferences.inspiration,
              onChange: handleCheckboxChange,
              style: { marginTop: "5px", transform: "scale(1.2)" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "inspiration", style: { fontWeight: "700", color: "#23262F" }, children: "Inspiration" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted small mb-0", children: "Inspiration in your inbox! You can always unsubscribe later if you change your mind." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: "newsletter",
              id: "newsletter",
              checked: preferences.newsletter,
              onChange: handleCheckboxChange,
              style: { marginTop: "5px", transform: "scale(1.2)" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "newsletter", style: { fontWeight: "700", color: "#23262F" }, children: "Other newsletters" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted small mb-0", children: "Sometimes we may send newsletters with other interesting and relevant information." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "notify-setting-inner-box", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-3", style: { fontSize: "20px", fontWeight: "700" }, children: "Bidding" }),
      /* @__PURE__ */ jsx("div", { className: "nofify-form-1 d-flex flex-column gap-3", children: [
        { key: "outbid", label: "Let me know when I am outbid" },
        { key: "republished", label: "Let me know when items are republished" },
        { key: "oneDayReminder", label: "Remind me 1 day before bidding closes" },
        { key: "oneHourReminder", label: "Remind me 1 hour before bidding closes" },
        { key: "fifteenMinutesReminder", label: "Remind me 15 minutes before bidding closes" }
      ].map((item) => /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            name: item.key,
            id: item.key,
            checked: preferences[item.key],
            onChange: handleCheckboxChange,
            style: { transform: "scale(1.2)" }
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: item.key, style: { fontWeight: "600", color: "#23262F" }, children: item.label })
      ] }, item.key)) })
    ] })
  ] });
}
export {
  NotificationSection as default
};
