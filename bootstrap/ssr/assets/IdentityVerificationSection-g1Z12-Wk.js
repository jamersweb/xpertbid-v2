import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
function DateOfBirthSelector({ dob, setDob, errors }) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];
  const parsedParts = dob ? dob.split("-") : ["", "", ""];
  const [year, setYear] = useState(parsedParts[0] || "");
  const [month, setMonth] = useState(parsedParts[1] ? String(parseInt(parsedParts[1])) : "");
  const [day, setDay] = useState(parsedParts[2] ? String(parseInt(parsedParts[2])) : "");
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  useEffect(() => {
    if (year && month && day) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      setDob(`${year}-${mm}-${dd}`);
    }
  }, [year, month, day]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "d-flex gap-2 mb-2", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-select verify_input",
          value: year,
          onChange: (e) => {
            setYear(e.target.value);
            setMonth("");
            setDay("");
            setDob("");
          },
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Year" }),
            years.map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-select verify_input",
          value: month,
          onChange: (e) => {
            setMonth(e.target.value);
            setDay("");
            setDob("");
          },
          disabled: !year,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Month" }),
            months.map((m) => /* @__PURE__ */ jsx("option", { value: m.value, children: m.label }, m.value))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-select verify_input",
          value: day,
          onChange: (e) => setDay(e.target.value),
          disabled: !month,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Day" }),
            days.map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("input", { type: "text", readOnly: true, className: "form-control verify_input mb-1", placeholder: "YYYY-MM-DD", value: dob, required: true }),
    errors?.dob && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.dob })
  ] });
}
function VerifiedCard({ type }) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "60px 40px",
    textAlign: "center",
    color: "#23262F",
    boxShadow: "0 4px 20px rgba(67,172,233,0.15)",
    border: "2px solid #43ACE9",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "inline-block", marginBottom: "30px", position: "relative", zIndex: 1 }, children: /* @__PURE__ */ jsxs(
      "svg",
      {
        style: { width: 80, height: 80, color: "#43ACE9", filter: "drop-shadow(0 2px 8px rgba(67,172,233,0.3))" },
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2" }),
          /* @__PURE__ */ jsx("path", { d: "M8 12L11 15L16 9", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("h3", { style: { fontSize: 32, fontWeight: 700, marginBottom: 20, color: "#23262F", position: "relative", zIndex: 1 }, children: [
      type,
      " Verification Approved"
    ] }),
    /* @__PURE__ */ jsxs("p", { style: { fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: "#606060", maxWidth: 600, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }, children: [
      "Congratulations! Your ",
      type.toLowerCase(),
      " verification has been ",
      /* @__PURE__ */ jsx("strong", { style: { color: "#43ACE9" }, children: "approved" }),
      ". You now have full access to all ",
      /* @__PURE__ */ jsx("strong", { style: { color: "#43ACE9" }, children: "XpertBid" }),
      " features."
    ] }),
    /* @__PURE__ */ jsx("span", { style: {
      display: "inline-block",
      background: "#43ACE9",
      padding: "12px 30px",
      borderRadius: 50,
      fontWeight: 600,
      fontSize: 16,
      color: "#ffffff",
      textTransform: "capitalize",
      position: "relative",
      zIndex: 1
    }, children: "Status: Verified" })
  ] });
}
function DeclinedCard({ type, declineReason, onResubmit }) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "60px 40px",
    textAlign: "center",
    color: "#23262F",
    boxShadow: "0 4px 20px rgba(239,68,68,0.15)",
    border: "2px solid #EF4444",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "inline-block", marginBottom: "30px", position: "relative", zIndex: 1 }, children: /* @__PURE__ */ jsxs(
      "svg",
      {
        style: { width: 80, height: 80, color: "#EF4444", filter: "drop-shadow(0 2px 8px rgba(239,68,68,0.3))" },
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2" }),
          /* @__PURE__ */ jsx("path", { d: "M15 9L9 15M9 9L15 15", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("h3", { style: { fontSize: 32, fontWeight: 700, marginBottom: 20, color: "#23262F", position: "relative", zIndex: 1 }, children: [
      type,
      " Verification Declined"
    ] }),
    /* @__PURE__ */ jsxs("p", { style: { fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: "#606060", maxWidth: 600, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }, children: [
      "Unfortunately, your ",
      type.toLowerCase(),
      " verification could not be approved at this time.",
      declineReason && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("strong", { style: { color: "#EF4444" }, children: [
          "Reason: ",
          declineReason
        ] })
      ] }),
      /* @__PURE__ */ jsx("br", {}),
      "Please review the information you provided and submit again with the correct details."
    ] }),
    /* @__PURE__ */ jsx("div", { style: { position: "relative", zIndex: 1, marginBottom: 30 }, children: /* @__PURE__ */ jsx("span", { style: {
      display: "inline-block",
      background: "#FEE2E2",
      padding: "12px 30px",
      borderRadius: 50,
      fontWeight: 600,
      fontSize: 16,
      color: "#EF4444",
      border: "2px solid #EF4444",
      textTransform: "capitalize"
    }, children: "Status: Declined" }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onResubmit,
        style: {
          background: "#43ACE9",
          color: "white",
          border: "none",
          padding: "14px 32px",
          borderRadius: 50,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          position: "relative",
          zIndex: 1
        },
        children: "Edit & Resubmit Verification"
      }
    )
  ] });
}
function PendingCard({ type }) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "60px 40px",
    textAlign: "center",
    color: "#23262F",
    boxShadow: "0 4px 20px rgba(67,172,233,0.15)",
    border: "2px solid #43ACE9",
    position: "relative",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "inline-block", marginBottom: "30px", position: "relative", zIndex: 1 }, children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          style: { width: 80, height: 80, color: "#43ACE9", filter: "drop-shadow(0 2px 8px rgba(67,172,233,0.3))", animation: "spin 3s linear infinite" },
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "2" }),
            /* @__PURE__ */ jsx("path", { d: "M12 6V12L16 14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` })
    ] }),
    /* @__PURE__ */ jsxs("h3", { style: { fontSize: 32, fontWeight: 700, marginBottom: 20, color: "#23262F", position: "relative", zIndex: 1 }, children: [
      type,
      " Verification Under Review"
    ] }),
    /* @__PURE__ */ jsxs("p", { style: { fontSize: 18, lineHeight: 1.8, marginBottom: 30, color: "#606060", maxWidth: 600, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }, children: [
      "Your ",
      type.toLowerCase(),
      " verification form has been successfully submitted and is currently under review. Our team at ",
      /* @__PURE__ */ jsx("strong", { style: { color: "#43ACE9" }, children: "XpertBid" }),
      " will review your information and take action within ",
      /* @__PURE__ */ jsx("strong", { style: { color: "#43ACE9" }, children: "24 hours" }),
      "."
    ] }),
    /* @__PURE__ */ jsx("span", { style: {
      display: "inline-block",
      background: "rgba(67,172,233,0.2)",
      padding: "12px 30px",
      borderRadius: 50,
      fontWeight: 600,
      fontSize: 16,
      color: "#43ACE9",
      border: "2px solid #43ACE9",
      textTransform: "capitalize",
      position: "relative",
      zIndex: 1
    }, children: "Status: Pending Review" })
  ] });
}
function UploadBox({ id, label, preview, file, onChange, onClear, existingPath }) {
  const isPdf = file?.type === "application/pdf" || !file && existingPath?.toLowerCase().endsWith(".pdf");
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "upload-box",
      onClick: () => document.getElementById(id).click(),
      style: { cursor: "pointer" },
      children: [
        preview ? /* @__PURE__ */ jsxs("div", { className: "position-relative", children: [
          isPdf ? /* @__PURE__ */ jsxs("div", { className: "pdf-preview text-center p-3", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-pdf fa-2x text-danger" }),
            /* @__PURE__ */ jsx("p", { className: "small mt-2", children: file ? file.name : existingPath?.split("/").pop() })
          ] }) : /* @__PURE__ */ jsx("img", { src: preview, className: "upload-preview", alt: label, style: { width: "100%", maxHeight: 200, objectFit: "contain" } }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "position-absolute top-0 end-0 btn btn-secondary btn-sm p-0",
              style: { width: 20, height: 20, fontSize: 10 },
              onClick: (e) => {
                e.stopPropagation();
                onClear();
              },
              children: "×"
            }
          )
        ] }) : /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "upload upload-btn button-style-3",
            onClick: (e) => {
              e.stopPropagation();
              document.getElementById(id).click();
            },
            children: label
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id,
            type: "file",
            accept: "image/png, image/jpeg, application/pdf",
            style: { display: "none" },
            onChange
          }
        )
      ]
    }
  ) });
}
function IndividualForm({ initialData, auth, countries }) {
  const initStatus = initialData?.status;
  const [showForm, setShowForm] = useState(!initStatus);
  useEffect(() => {
    if (initStatus) setShowForm(false);
  }, [initStatus]);
  const [fullLegalName, setFullLegalName] = useState(initialData?.full_legal_name || auth?.user?.name || "");
  const [dob, setDob] = useState(initialData?.dob || "");
  const [residentialAddress, setResidentialAddress] = useState(initialData?.residential_address || "");
  const [contactNumber, setContactNumber] = useState(initialData?.contact_number || auth?.user?.phone || "");
  const [emailAddress, setEmailAddress] = useState(initialData?.email_address || auth?.user?.email || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [selectedDocument, setSelectedDocument] = useState(initialData?.document_type || "NIC");
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(initialData?.id_front_path ? `/${initialData.id_front_path}` : "");
  const [backPreview, setBackPreview] = useState(initialData?.id_back_path ? `/${initialData.id_back_path}` : "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const onFrontChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("The Front ID document file size exceeds the 10MB limit.");
      return;
    }
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };
  const onBackChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("The Back ID document file size exceeds the 10MB limit.");
      return;
    }
    setBackFile(file);
    setBackPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");
    const fd = new FormData();
    fd.append("full_legal_name", fullLegalName);
    fd.append("dob", dob);
    fd.append("residential_address", residentialAddress);
    if (frontFile) fd.append("id_front", frontFile);
    if (backFile) fd.append("id_back", backFile);
    fd.append("contact_number", contactNumber);
    fd.append("email_address", emailAddress);
    fd.append("country", country);
    fd.append("document_type", selectedDocument);
    router.post(route("individual-verifications.store"), fd, {
      forceFormData: true,
      onSuccess: () => {
        setSuccessMsg("Individual verification submitted successfully!");
        setLoading(false);
        setShowForm(false);
      },
      onError: (errs) => {
        setErrors(errs);
        setErrorMsg(Object.values(errs).flat().join(" "));
        setLoading(false);
      },
      onFinish: () => setLoading(false)
    });
  };
  if (!showForm) {
    const status = initStatus?.toLowerCase();
    if (status === "verified" || status === "approved") return /* @__PURE__ */ jsx(VerifiedCard, { type: "Individual" });
    if (status === "declined" || status === "rejected") {
      return /* @__PURE__ */ jsx(DeclinedCard, { type: "Individual", declineReason: initialData?.decline_reason, onResubmit: () => setShowForm(true) });
    }
    return /* @__PURE__ */ jsx(PendingCard, { type: "Individual" });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { backgroundColor: "white", padding: "20px" }, children: [
    /* @__PURE__ */ jsx("h4", { className: "mb-5 heading", children: "Individual Verification" }),
    successMsg && /* @__PURE__ */ jsx("div", { className: "alert alert-success", children: successMsg }),
    errorMsg && /* @__PURE__ */ jsx("div", { className: "alert alert-danger", children: errorMsg }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Full Legal Name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "form-control verify_input",
          value: fullLegalName,
          onChange: (e) => setFullLegalName(e.target.value),
          placeholder: "Please enter your legal name",
          required: true
        }
      ),
      errors.full_legal_name && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.full_legal_name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Date of Birth" }),
      /* @__PURE__ */ jsx(DateOfBirthSelector, { dob, setDob, errors })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Residential Address" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "form-control verify_input",
          value: residentialAddress,
          onChange: (e) => setResidentialAddress(e.target.value),
          placeholder: "Please enter your residential address",
          required: true
        }
      ),
      errors.residential_address && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.residential_address })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 position-relative", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Select Document Type" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-control verify_input",
          value: selectedDocument,
          onChange: (e) => setSelectedDocument(e.target.value),
          required: true,
          children: [
            /* @__PURE__ */ jsx("option", { value: "NIC", children: "NIC" }),
            /* @__PURE__ */ jsx("option", { value: "Passport", children: "Passport" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "input-icon-wrapper verify_svg", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M4.07992 8.95011L10.5999 15.4701C11.3699 16.2401 12.6299 16.2401 13.3999 15.4701L19.9199 8.95011",
          stroke: "#606060",
          strokeWidth: "1.5",
          strokeMiterlimit: "10",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "identity-upload-section", children: [
      selectedDocument && /* @__PURE__ */ jsx("h4", { className: "form-label fw-bold mb-3", children: "Verify your identity with a valid identity document (NIC, Passport, Student Card, etc.)" }),
      selectedDocument && /* @__PURE__ */ jsxs("ul", { className: "liss mb-3", children: [
        /* @__PURE__ */ jsx("li", { children: "Upload any valid identity document issued in the issuing country (NIC, passport, student card, etc.)." }),
        /* @__PURE__ */ jsx("li", { children: "A clear picture where all four corners are visible." }),
        /* @__PURE__ */ jsx("li", { children: "Include the back if it has identifying information." }),
        /* @__PURE__ */ jsx("li", { children: "Certified by a witness if required." }),
        /* @__PURE__ */ jsx("li", { children: "These documents are required exclusively for verification on the XpertBid platform and will not be utilized for any other purpose." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
          /* @__PURE__ */ jsx(
            UploadBox,
            {
              id: "frontInput",
              label: "Upload Front",
              preview: frontPreview,
              file: frontFile,
              onChange: onFrontChange,
              onClear: () => {
                setFrontPreview("");
                setFrontFile(null);
              },
              existingPath: initialData?.id_front_path
            }
          ),
          errors.id_front && /* @__PURE__ */ jsx("div", { className: "text-danger mt-2", children: errors.id_front })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-md-6", children: [
          /* @__PURE__ */ jsx(
            UploadBox,
            {
              id: "backInput",
              label: "Upload Back",
              preview: backPreview,
              file: backFile,
              onChange: onBackChange,
              onClear: () => {
                setBackPreview("");
                setBackFile(null);
              },
              existingPath: initialData?.id_back_path
            }
          ),
          errors.id_back && /* @__PURE__ */ jsx("div", { className: "text-danger mt-2", children: errors.id_back })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsxs("div", { className: "my-4 col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Contact Number" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            className: "form-control verify_input",
            value: contactNumber,
            placeholder: "Please enter your contact number",
            onChange: (e) => setContactNumber(e.target.value),
            required: true
          }
        ),
        errors.contact_number && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.contact_number })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-4 col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Email Address" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            className: "form-control verify_input",
            value: emailAddress,
            onChange: (e) => setEmailAddress(e.target.value),
            required: true
          }
        ),
        errors.email_address && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.email_address })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 form-child position-relative", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Country" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-control verify_input",
          value: country,
          onChange: (e) => setCountry(e.target.value),
          required: true,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
            countries.map((c) => /* @__PURE__ */ jsx("option", { value: c.name, children: c.name }, c.id))
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "input-icon-wrapper verify_svg", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M4.07992 8.95011L10.5999 15.4701C11.3699 16.2401 12.6299 16.2401 13.3999 15.4701L19.9199 8.95011",
          stroke: "#606060",
          strokeWidth: "1.5",
          strokeMiterlimit: "10",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ) }) }),
      errors.country && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.country })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "button-style-2", disabled: loading, children: loading ? "Submitting..." : "Submit" })
  ] });
}
function CorporateForm({ initialData, countries, malls = [] }) {
  const initStatus = initialData?.status;
  const [showForm, setShowForm] = useState(!initStatus);
  useEffect(() => {
    if (initStatus) setShowForm(false);
  }, [initStatus]);
  const [legalEntityName, setLegalEntityName] = useState(initialData?.legal_entity_name || "");
  const [registeredAddress, setRegisteredAddress] = useState(initialData?.registered_address || "");
  const [incorporationDate, setIncorporationDate] = useState(initialData?.date_of_incorporation || "");
  const [entityType, setEntityType] = useState(initialData?.entity_type || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [mallId, setMallId] = useState(initialData?.mall_id ? String(initialData.mall_id) : "");
  const [businessDocuments, setBusinessDocuments] = useState([]);
  const [businessPreview, setBusinessPreview] = useState(
    Array.isArray(initialData?.business_documents) ? initialData.business_documents.map((p) => `/${p}`) : []
  );
  const [fileCountError, setFileCountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const onBusinessChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setFileCountError("You can't upload more than 3 documents.");
      e.target.value = "";
      return;
    }
    setFileCountError("");
    setBusinessDocuments(files);
    setBusinessPreview(files.map((f) => URL.createObjectURL(f)));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");
    const fd = new FormData();
    fd.append("legal_entity_name", legalEntityName);
    fd.append("registered_address", registeredAddress);
    fd.append("date_of_incorporation", incorporationDate);
    fd.append("entity_type", entityType);
    fd.append("country", country);
    if (mallId) {
      fd.append("mall_id", mallId);
    }
    businessDocuments.forEach((file) => fd.append("business_documents[]", file));
    router.post(route("corporate-verifications.store"), fd, {
      forceFormData: true,
      onSuccess: () => {
        setSuccessMsg("Corporate verification submitted successfully!");
        setLoading(false);
        setShowForm(false);
      },
      onError: (errs) => {
        setErrors(errs);
        setErrorMsg(Object.values(errs).flat().join(" "));
        setLoading(false);
      },
      onFinish: () => setLoading(false)
    });
  };
  if (!showForm) {
    const status = initStatus?.toLowerCase();
    if (status === "verified" || status === "approved") return /* @__PURE__ */ jsx(VerifiedCard, { type: "Corporate" });
    if (status === "declined" || status === "rejected") {
      return /* @__PURE__ */ jsx(DeclinedCard, { type: "Corporate", declineReason: initialData?.decline_reason, onResubmit: () => setShowForm(true) });
    }
    return /* @__PURE__ */ jsx(PendingCard, { type: "Corporate" });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { backgroundColor: "white", padding: "20px" }, children: [
    /* @__PURE__ */ jsx("h4", { className: "mb-5 heading", children: "Corporate Verification" }),
    successMsg && /* @__PURE__ */ jsx("div", { className: "alert alert-success", children: successMsg }),
    errorMsg && /* @__PURE__ */ jsx("div", { className: "alert alert-danger", children: errorMsg }),
    /* @__PURE__ */ jsxs("div", { className: "row", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Legal Entity Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "form-control verify_input",
            value: legalEntityName,
            onChange: (e) => setLegalEntityName(e.target.value),
            placeholder: "Please enter your legal entity name",
            required: true
          }
        ),
        errors.legal_entity_name && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.legal_entity_name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-3 col-md-6", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Registered Address" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "form-control verify_input",
            value: registeredAddress,
            onChange: (e) => setRegisteredAddress(e.target.value),
            placeholder: "Please enter your registered address",
            required: true
          }
        ),
        errors.registered_address && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.registered_address })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Date of Incorporation" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "date",
          className: "form-control verify_input",
          value: incorporationDate,
          onChange: (e) => setIncorporationDate(e.target.value),
          required: true
        }
      ),
      errors.date_of_incorporation && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.date_of_incorporation })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Type of Entity" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: "form-control verify_input",
          value: entityType,
          onChange: (e) => setEntityType(e.target.value),
          placeholder: "Please enter your type of entity",
          required: true
        }
      ),
      errors.entity_type && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.entity_type })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "identity-upload-section mb-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "form-label fw-bold mb-3", children: "Upload your documents" }),
      /* @__PURE__ */ jsxs("ul", { className: "liss mb-3", children: [
        /* @__PURE__ */ jsx("li", { children: "Click the box below to select files." }),
        /* @__PURE__ */ jsx("li", { children: "Only PNG/JPEG images accepted." }),
        /* @__PURE__ */ jsx("li", { children: "You can't upload more than 3 documents." }),
        /* @__PURE__ */ jsx("li", { children: "These documents are required exclusively for verification on the XpertBid platform and will not be utilized for any other purpose." })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "upload-box",
          onClick: () => document.getElementById("businessInput").click(),
          style: { cursor: "pointer" },
          children: [
            businessPreview.length > 0 ? /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap", children: businessPreview.map((src, i) => {
              const file = businessDocuments[i];
              const isPdf = file && file.type === "application/pdf" || !file && src.toLowerCase().endsWith(".pdf");
              return /* @__PURE__ */ jsxs("div", { className: "position-relative m-1", children: [
                isPdf ? /* @__PURE__ */ jsxs("div", { className: "pdf-preview p-2 border text-center", style: { width: 120 }, children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-file-pdf fa-2x text-danger" }),
                  /* @__PURE__ */ jsx("p", { className: "small mt-1 text-truncate", style: { maxWidth: 110 }, children: file ? file.name : src.split("/").pop() })
                ] }) : /* @__PURE__ */ jsx(
                  "img",
                  {
                    src,
                    className: "upload-preview",
                    alt: `Doc ${i + 1}`,
                    style: { width: 120, height: 90, objectFit: "contain" }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "position-absolute top-0 end-0 btn btn-secondary btn-sm p-0",
                    style: { width: 20, height: 20, fontSize: 10 },
                    onClick: (e) => {
                      e.stopPropagation();
                      const newPreviews = [...businessPreview];
                      const newDocuments = [...businessDocuments];
                      newPreviews.splice(i, 1);
                      newDocuments.splice(i, 1);
                      setBusinessPreview(newPreviews);
                      setBusinessDocuments(newDocuments);
                    },
                    children: "×"
                  }
                )
              ] }, `doc-${i}`);
            }) }) : /* @__PURE__ */ jsx("button", { type: "button", className: "upload upload-btn button-style-3", children: "Upload Business Documents" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "businessInput",
                type: "file",
                accept: "image/png, image/jpeg, application/pdf",
                multiple: true,
                style: { display: "none" },
                onChange: onBusinessChange
              }
            )
          ]
        }
      ),
      fileCountError && /* @__PURE__ */ jsx("div", { className: "text-danger mt-2", children: fileCountError }),
      errors.business_documents && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.business_documents })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 form-child position-relative", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label fw-bold", children: "Country" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-control verify_input",
          value: country,
          onChange: (e) => setCountry(e.target.value),
          required: true,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
            countries.map((c) => /* @__PURE__ */ jsx("option", { value: c.name, children: c.name }, c.id))
          ]
        }
      ),
      errors.country && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.country })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 form-child position-relative", children: [
      /* @__PURE__ */ jsxs("label", { className: "form-label fw-bold", children: [
        "Mall ",
        /* @__PURE__ */ jsx("span", { className: "text-muted fw-normal", children: "(optional)" })
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "form-control verify_input",
          value: mallId,
          onChange: (e) => setMallId(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Mall" }),
            malls.map((mall) => /* @__PURE__ */ jsx("option", { value: mall.id, children: mall.name }, mall.id))
          ]
        }
      ),
      errors.mall_id && /* @__PURE__ */ jsx("div", { className: "text-danger", children: errors.mall_id })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "button-style-2", disabled: loading, children: loading ? "Submitting..." : "Submit" })
  ] });
}
function IdentityVerificationSection() {
  const { individualVerification, corporateVerification, auth, malls = [] } = usePage().props;
  const [tab, setTab] = useState("individual");
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const isPending = (v) => v && v.status !== "verified" && v.status !== "approved" && v.status !== "declined" && v.status !== "rejected";
    if (isPending(individualVerification) || isPending(corporateVerification)) {
      const interval = setInterval(() => {
        router.reload({ only: ["individualVerification", "corporateVerification"] });
      }, 1e4);
      return () => clearInterval(interval);
    }
  }, [individualVerification, corporateVerification]);
  useEffect(() => {
    axios.get("/get-countries").then((res) => {
      let list = res.data?.country || res.data || [];
      list.sort((a, b) => {
        const priorityIds = [166, 229];
        const ap = priorityIds.includes(a.id);
        const bp = priorityIds.includes(b.id);
        if (ap && !bp) return -1;
        if (!ap && bp) return 1;
        return 0;
      });
      setCountries(list);
    }).catch(() => {
    });
  }, []);
  const tabs = [
    { key: "individual", label: "Individual" },
    { key: "corporate", label: "Corporate" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "container p-0", children: [
    /* @__PURE__ */ jsx("ul", { className: "nav nav-tabs mb-4", children: tabs.map((t) => /* @__PURE__ */ jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: `nav-link ${tab === t.key ? "active-tabs" : ""}`,
        onClick: () => setTab(t.key),
        style: { background: "none", backgroundColor: "transparent" },
        children: t.label
      }
    ) }, t.key)) }),
    tab === "individual" ? /* @__PURE__ */ jsx(
      IndividualForm,
      {
        initialData: individualVerification,
        auth,
        countries
      }
    ) : /* @__PURE__ */ jsx(
      CorporateForm,
      {
        initialData: corporateVerification,
        countries,
        malls
      }
    )
  ] });
}
export {
  IdentityVerificationSection as default
};
