import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { router } from "@inertiajs/react";
function SecuritySection() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPassword_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post(route("user.password.update"), form, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        setForm({ oldPassword: "", newPassword: "", newPassword_confirmation: "" });
      },
      onError: () => setLoading(false)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
    /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", marginBottom: "40px" }, children: "Password & Login" }),
    /* @__PURE__ */ jsxs("form", { className: "row g-4", onSubmit: handleSave, children: [
      /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Old Password" }),
        /* @__PURE__ */ jsx("input", { type: "password", name: "oldPassword", value: form.oldPassword, onChange: handleChange, className: "form-control", style: { height: "50px", backgroundColor: "#F8F8F8", border: "none" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "New Password" }),
        /* @__PURE__ */ jsx("input", { type: "password", name: "newPassword", value: form.newPassword, onChange: handleChange, className: "form-control", style: { height: "50px", backgroundColor: "#F8F8F8", border: "none" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Confirm New Password" }),
        /* @__PURE__ */ jsx("input", { type: "password", name: "newPassword_confirmation", value: form.newPassword_confirmation, onChange: handleChange, className: "form-control", style: { height: "50px", backgroundColor: "#F8F8F8", border: "none" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-12 mt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "button-style-2",
          disabled: loading,
          children: loading ? "Changing..." : "Change Password"
        }
      ) })
    ] })
  ] });
}
export {
  SecuritySection as default
};
