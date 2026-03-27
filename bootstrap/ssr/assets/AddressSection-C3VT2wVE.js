import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
function AddressSection() {
  const { address, errors, flash } = usePage().props;
  const [form, setForm] = useState({
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    country: address?.country ? String(address.country) : "",
    city: address?.city ? String(address.city) : "",
    state: address?.state ? String(address.state) : "",
    postalCode: address?.postalCode || "",
    contactNumber: address?.contactNumber || "",
    otherNumber: address?.otherNumber || ""
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (address) {
      setForm({
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        country: address.country ? String(address.country) : "",
        city: address.city ? String(address.city) : "",
        state: address.state ? String(address.state) : "",
        postalCode: address.postalCode || "",
        contactNumber: address.contactNumber || "",
        otherNumber: address.otherNumber || ""
      });
      if (address.country) loadStates(address.country);
      if (address.state) loadCities(address.state);
    }
  }, [address]);
  useEffect(() => {
    fetch("/get-countries").then((res) => res.json()).then((data) => setCountries(data.country || []));
  }, []);
  const loadStates = (countryId) => {
    fetch(`/get-states/${countryId}`).then((res) => res.json()).then((data) => setStates(data.state || []));
  };
  const loadCities = (stateId) => {
    fetch(`/get-cities/${stateId}`).then((res) => res.json()).then((data) => setCities(data.city || []));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "country") {
      setStates([]);
      setCities([]);
      if (value) loadStates(value);
    } else if (name === "state") {
      setCities([]);
      if (value) loadCities(value);
    }
  };
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post(route("user.address.update"), form, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false)
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "profile-settings-section", children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between align-items-center mb-4", children: [
      /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "700", color: "#23262F", margin: 0 }, children: "Address" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "button-style-2",
          onClick: handleSave,
          disabled: loading,
          children: loading ? "Saving..." : address ? "Save Changes" : "Save Address"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-muted mb-5", style: { fontSize: "14px", color: "#777E91" }, children: "Add your shipping address to ensure smooth deliveries for your auction wins. You can update or edit this address anytime for future purchases." }),
    /* @__PURE__ */ jsxs("form", { className: "row g-4", onSubmit: handleSave, children: [
      /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Street Address 1*" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "addressLine1", value: form.addressLine1, onChange: handleChange, className: `form-control ${errors.addressLine1 ? "is-invalid" : ""}` }),
        errors.addressLine1 && /* @__PURE__ */ jsx("div", { className: "invalid-feedback", children: errors.addressLine1 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-12", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Street Address 2 (Optional)" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "addressLine2", value: form.addressLine2, onChange: handleChange, className: "form-control" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Country*" }),
        /* @__PURE__ */ jsxs("select", { name: "country", value: form.country, onChange: handleChange, className: `form-select ${errors.country ? "is-invalid" : ""}`, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
          countries.map((c) => /* @__PURE__ */ jsx("option", { value: String(c.id), children: c.name }, c.id))
        ] }),
        errors.country && /* @__PURE__ */ jsx("div", { className: "invalid-feedback", children: errors.country })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "State*" }),
        /* @__PURE__ */ jsxs("select", { name: "state", value: form.state, onChange: handleChange, className: `form-select ${errors.state ? "is-invalid" : ""}`, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select State" }),
          states.map((s) => /* @__PURE__ */ jsx("option", { value: String(s.id), children: s.name }, s.id))
        ] }),
        errors.state && /* @__PURE__ */ jsx("div", { className: "invalid-feedback", children: errors.state })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "City*" }),
        /* @__PURE__ */ jsxs("select", { name: "city", value: form.city, onChange: handleChange, className: `form-select ${errors.city ? "is-invalid" : ""}`, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
          cities.map((c) => /* @__PURE__ */ jsx("option", { value: String(c.id), children: c.name }, c.id))
        ] }),
        errors.city && /* @__PURE__ */ jsx("div", { className: "invalid-feedback", children: errors.city })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Postal Code" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "postalCode", value: form.postalCode, onChange: handleChange, className: "form-control" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Contact Number" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "contactNumber", value: form.contactNumber, onChange: handleChange, className: "form-control" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", style: { fontWeight: "600" }, children: "Other Number (Optional)" }),
        /* @__PURE__ */ jsx("input", { type: "text", name: "otherNumber", value: form.otherNumber, onChange: handleChange, className: "form-control" })
      ] })
    ] })
  ] });
}
export {
  AddressSection as default
};
