import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-CKzCZqB6.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import { u as useCart } from "./CartContext-DXNQZwkV.js";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { S as SuccessPopup, E as ErrorPopup } from "./ErrorPopup-VSFE5nHL.js";
import "ziggy-js";
import "sweetalert2";
import "./CurrencyPicker-KgG9a2BI.js";
import "./useCurrencyList-Ce5tJXO9.js";
function Index({ cartItems: inertiaCartItems = [], user }) {
  const { auth } = usePage().props;
  const authUser = auth?.user || user || null;
  const { clearCart, cartItems: contextCartItems } = useCart();
  const displayItems = Array.isArray(inertiaCartItems) && inertiaCartItems.length > 0 ? inertiaCartItems : Array.isArray(contextCartItems) ? contextCartItems : [];
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [countries, setCountries] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [billingCities, setBillingCities] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [billingData, setBillingData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    address_line1: authUser?.address_line1 || "",
    address_line2: authUser?.address_line2 || "",
    city: authUser?.city || "",
    state: authUser?.state || "",
    country: authUser?.country || "",
    postal_code: authUser?.postal_code || ""
  });
  const [shippingData, setShippingData] = useState({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: ""
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("/get-countries");
        const allCountries = res.data.country || res.data.countries || [];
        const priorityNames = ["United Arab Emirates", "Pakistan"];
        const priorityCountries = allCountries.filter((c) => priorityNames.includes(c.name));
        const otherCountries = allCountries.filter((c) => !priorityNames.includes(c.name));
        setCountries([...priorityCountries, ...otherCountries]);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    if (billingData.country) {
      const fetchStates = async () => {
        try {
          const res = await axios.get(`/get-states/${billingData.country}`);
          setBillingStates(res.data.state || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStates();
    }
  }, [billingData.country]);
  useEffect(() => {
    if (billingData.state) {
      const fetchCities = async () => {
        try {
          const res = await axios.get(`/get-cities/${billingData.state}`);
          setBillingCities(res.data.city || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCities();
    }
  }, [billingData.state]);
  useEffect(() => {
    if (shippingData.country && !sameAsBilling) {
      const fetchStates = async () => {
        try {
          const res = await axios.get(`/get-states/${shippingData.country}`);
          setShippingStates(res.data.state || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStates();
    }
  }, [shippingData.country, sameAsBilling]);
  useEffect(() => {
    if (shippingData.state && !sameAsBilling) {
      const fetchCities = async () => {
        try {
          const res = await axios.get(`/get-cities/${shippingData.state}`);
          setShippingCities(res.data.city || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCities();
    }
  }, [shippingData.state, sameAsBilling]);
  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };
  const subtotal = displayItems.reduce((total2, item) => total2 + (parseFloat(item.price) || 0), 0);
  const shipping = 0;
  const total = subtotal + shipping;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "bank_transfer" && !receiptImage) {
      setErrorMessage("Please upload the bank transfer receipt.");
      setShowError(true);
      return;
    }
    if (!billingData.phone || billingData.phone.trim().length < 7) {
      setErrorMessage("A valid phone number is required to place an order.");
      setShowError(true);
      return;
    }
    setProcessing(true);
    const formData = new FormData();
    const payload = {
      items: displayItems,
      payment_method: paymentMethod,
      total,
      subtotal,
      shipping_cost: shipping,
      billing_name: billingData.name,
      billing_email: billingData.email,
      billing_phone: billingData.phone,
      billing_address_line1: billingData.address_line1,
      billing_address_line2: billingData.address_line2,
      billing_city: billingData.city,
      billing_state: billingData.state,
      billing_country: billingData.country,
      billing_postal_code: billingData.postal_code,
      shipping_name: sameAsBilling ? billingData.name : shippingData.name,
      shipping_email: sameAsBilling ? billingData.email : shippingData.email,
      shipping_phone: sameAsBilling ? billingData.phone : shippingData.phone,
      shipping_address_line1: sameAsBilling ? billingData.address_line1 : shippingData.address_line1,
      shipping_address_line2: sameAsBilling ? billingData.address_line2 : shippingData.address_line2,
      shipping_city: sameAsBilling ? billingData.city : shippingData.city,
      shipping_state: sameAsBilling ? billingData.state : shippingData.state,
      shipping_country: sameAsBilling ? billingData.country : shippingData.country,
      shipping_postal_code: sameAsBilling ? billingData.postal_code : shippingData.postal_code
    };
    formData.append("order_data", JSON.stringify(payload));
    if (receiptImage) {
      formData.append("receipt_image", receiptImage);
    }
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] !== "object") {
        formData.append(key, payload[key]);
      }
    });
    try {
      const response = await axios.post(route("checkout.process"), formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        setOrderNumber(response.data.order_number);
        setShowSuccess(true);
        clearCart();
        setTimeout(() => {
          if (authUser) {
            router.visit(route("orders.show", response.data.order_number));
          } else {
            router.visit(route("home"));
          }
        }, 3e3);
      } else {
        setErrorMessage(response.data.message || "Failed to place order");
        setShowError(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "An error occurred while processing your order.";
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "Checkout | XpertBid" }) }),
    /* @__PURE__ */ jsx("div", { className: "checkout-page-wrapper", style: { backgroundColor: "#F1F1F1", padding: "60px 70px", minHeight: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "container", style: { maxWidth: "1200px" }, children: [
      /* @__PURE__ */ jsx(
        "h1",
        {
          className: "mb-4",
          style: {
            fontFamily: '"Inter", sans-serif',
            fontSize: "46px",
            fontWeight: "800",
            lineHeight: "64px",
            color: "#23262F",
            marginBottom: "40px"
          },
          children: "Checkout"
        }
      ),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "row", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-lg-8", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "card mb-4",
              style: {
                backgroundColor: "#fff",
                borderRadius: "15px",
                padding: "0",
                boxShadow: "0 45px 90px 0 #00000026",
                border: "none"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "card-header",
                    style: {
                      padding: "25px 30px",
                      borderBottom: "1px solid #eee",
                      backgroundColor: "transparent"
                    },
                    children: /* @__PURE__ */ jsx(
                      "h5",
                      {
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "22px",
                          fontWeight: "700",
                          color: "#23262F",
                          margin: 0
                        },
                        children: "Billing Details"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "card-body", style: { padding: "25px 30px" }, children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Full Name *" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", value: billingData.name, onChange: (e) => setBillingData({ ...billingData, name: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Email Address *" }),
                    /* @__PURE__ */ jsx("input", { type: "email", className: "form-control verify_input", value: billingData.email, onChange: (e) => setBillingData({ ...billingData, email: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Phone Number *" }),
                    /* @__PURE__ */ jsx("input", { type: "tel", className: "form-control verify_input", value: billingData.phone, onChange: (e) => setBillingData({ ...billingData, phone: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Country *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: billingData.country, onChange: (e) => setBillingData({ ...billingData, country: e.target.value, state: "", city: "" }), required: true, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
                      countries.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-12 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Address Line 1 *" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", placeholder: "House number and street name", value: billingData.address_line1, onChange: (e) => setBillingData({ ...billingData, address_line1: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-12 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Address Line 2" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", placeholder: "Apartment, suite, unit, etc. (optional)", value: billingData.address_line2, onChange: (e) => setBillingData({ ...billingData, address_line2: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "State *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: billingData.state, onChange: (e) => setBillingData({ ...billingData, state: e.target.value, city: "" }), required: true, disabled: !billingData.country, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select State" }),
                      billingStates.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name || s }, s.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Town / City *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: billingData.city, onChange: (e) => setBillingData({ ...billingData, city: e.target.value }), required: true, disabled: !billingData.state, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
                      billingCities.map((c) => /* @__PURE__ */ jsx("option", { value: c.name || c, children: c.name || c }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Postal Code" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", value: billingData.postal_code, onChange: (e) => setBillingData({ ...billingData, postal_code: e.target.value }) })
                  ] })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "card mb-4",
              style: {
                backgroundColor: "#fff",
                borderRadius: "15px",
                padding: "0",
                boxShadow: "0 45px 90px 0 #00000026",
                border: "none"
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "card-header",
                    style: {
                      padding: "25px 30px",
                      borderBottom: "1px solid #eee",
                      backgroundColor: "transparent"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "h5",
                        {
                          style: {
                            fontFamily: '"Inter", sans-serif',
                            fontSize: "22px",
                            fontWeight: "700",
                            color: "#23262F",
                            margin: 0,
                            marginBottom: "15px"
                          },
                          children: "Shipping Details"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "form-check d-flex align-items-center gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            className: "form-check-input",
                            type: "checkbox",
                            id: "sameAsBilling",
                            checked: sameAsBilling,
                            onChange: (e) => setSameAsBilling(e.target.checked),
                            style: { cursor: "pointer" }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "label",
                          {
                            className: "form-check-label",
                            htmlFor: "sameAsBilling",
                            style: {
                              cursor: "pointer",
                              fontFamily: '"Inter", sans-serif',
                              fontSize: "14px",
                              color: "#606060"
                            },
                            children: "Same as billing address"
                          }
                        )
                      ] })
                    ]
                  }
                ),
                !sameAsBilling && /* @__PURE__ */ jsx("div", { className: "card-body", style: { padding: "25px 30px" }, children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Full Name *" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", value: shippingData.name, onChange: (e) => setShippingData({ ...shippingData, name: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Email Address *" }),
                    /* @__PURE__ */ jsx("input", { type: "email", className: "form-control verify_input", value: shippingData.email, onChange: (e) => setShippingData({ ...shippingData, email: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Phone Number *" }),
                    /* @__PURE__ */ jsx("input", { type: "tel", className: "form-control verify_input", value: shippingData.phone, onChange: (e) => setShippingData({ ...shippingData, phone: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Country *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: shippingData.country, onChange: (e) => setShippingData({ ...shippingData, country: e.target.value, state: "", city: "" }), required: true, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
                      countries.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-12 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Address Line 1 *" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", placeholder: "House number and street name", value: shippingData.address_line1, onChange: (e) => setShippingData({ ...shippingData, address_line1: e.target.value }), required: true })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-12 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Address Line 2" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", placeholder: "Apartment, suite, unit, etc. (optional)", value: shippingData.address_line2, onChange: (e) => setShippingData({ ...shippingData, address_line2: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "State *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: shippingData.state, onChange: (e) => setShippingData({ ...shippingData, state: e.target.value, city: "" }), required: true, disabled: !shippingData.country, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select State" }),
                      shippingStates.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name || s }, s.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Town / City *" }),
                    /* @__PURE__ */ jsxs("select", { className: "form-control verify_input", value: shippingData.city, onChange: (e) => setShippingData({ ...shippingData, city: e.target.value }), required: true, disabled: !shippingData.state, children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select City" }),
                      shippingCities.map((c) => /* @__PURE__ */ jsx("option", { value: c.name || c, children: c.name || c }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-md-6 mb-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "form-label checkout-label", children: "Postal Code" }),
                    /* @__PURE__ */ jsx("input", { type: "text", className: "form-control verify_input", value: shippingData.postal_code, onChange: (e) => setShippingData({ ...shippingData, postal_code: e.target.value }) })
                  ] })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "card mb-4",
              style: {
                backgroundColor: "#fff",
                borderRadius: "15px",
                padding: "0",
                boxShadow: "0 45px 90px 0 #00000026",
                border: "none"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "card-header",
                    style: {
                      padding: "25px 30px",
                      borderBottom: "1px solid #eee",
                      backgroundColor: "transparent"
                    },
                    children: /* @__PURE__ */ jsx(
                      "h5",
                      {
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "22px",
                          fontWeight: "700",
                          color: "#23262F",
                          margin: 0
                        },
                        children: "Payment Method"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "card-body", style: { padding: "25px 30px" }, children: total > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "form-check mb-3", style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        className: "form-check-input",
                        type: "radio",
                        name: "paymentMethod",
                        id: "cod",
                        value: "cod",
                        checked: paymentMethod === "cod",
                        onChange: (e) => setPaymentMethod(e.target.value),
                        style: { margin: 0, flexShrink: 0, cursor: "pointer" }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        className: "form-check-label",
                        htmlFor: "cod",
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "16px",
                          color: "#23262F",
                          margin: 0,
                          cursor: "pointer"
                        },
                        children: "Cash on Delivery (COD)"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "form-check", style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        className: "form-check-input",
                        type: "radio",
                        name: "paymentMethod",
                        id: "bank_transfer",
                        value: "bank_transfer",
                        checked: paymentMethod === "bank_transfer",
                        onChange: (e) => setPaymentMethod(e.target.value),
                        style: { margin: 0, flexShrink: 0, cursor: "pointer" }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        className: "form-check-label",
                        htmlFor: "bank_transfer",
                        style: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "16px",
                          color: "#23262F",
                          margin: 0,
                          cursor: "pointer"
                        },
                        children: "XpertBid Bank Transfer"
                      }
                    )
                  ] }),
                  paymentMethod === "bank_transfer" && /* @__PURE__ */ jsxs("div", { className: "mt-4", style: {
                    backgroundColor: "#F8F8F8",
                    padding: "20px",
                    borderRadius: "12px"
                  }, children: [
                    /* @__PURE__ */ jsxs("div", { className: "alert alert-info py-2 px-3 mb-3", style: { fontSize: "13px", borderRadius: "8px", backgroundColor: "#e1f5fe", border: "none", color: "#01579b" }, children: [
                      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info me-2" }),
                      "Please transfer the total amount to the bank account below and upload a screenshot of the receipt."
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bank-details", style: { fontSize: "14px", lineHeight: "1.6", color: "#23262F" }, children: [
                      /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-1", children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "#777E90" }, children: "Bank Name:" }),
                        /* @__PURE__ */ jsx("span", { className: "fw-bold", style: { color: "#23262F" }, children: "Bank al habib islamic Dha phase VIII karachi" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-1", children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "#777E90" }, children: "Account Title:" }),
                        /* @__PURE__ */ jsx("span", { className: "fw-bold", style: { color: "#23262F" }, children: "Xpertbid technologies private limited" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-1", children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "#777E90" }, children: "Account Number:" }),
                        /* @__PURE__ */ jsx("span", { className: "fw-bold", style: { color: "#23262F" }, children: "5054-0081-000892-01" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                      /* @__PURE__ */ jsx("label", { className: "form-label mb-2", style: { fontSize: "14px", fontWeight: "600", color: "#23262F" }, children: "Upload Receipt Screenshot" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "file",
                          className: "form-control",
                          accept: "image/*",
                          onChange: handleReceiptChange,
                          style: { fontSize: "13px", borderRadius: "6px" }
                        }
                      ),
                      receiptPreview && /* @__PURE__ */ jsxs("div", { className: "mt-2 position-relative", style: { width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }, children: [
                        /* @__PURE__ */ jsx("img", { src: receiptPreview, alt: "Preview", style: { width: "100%", height: "100%", objectFit: "cover" } }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "btn btn-sm btn-danger position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center",
                            style: { width: "18px", height: "18px", borderRadius: "50%", fontSize: "10px" },
                            onClick: () => {
                              setReceiptImage(null);
                              setReceiptPreview(null);
                            },
                            children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-xmark" })
                          }
                        )
                      ] })
                    ] })
                  ] })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "alert alert-success d-flex align-items-center mb-0", style: { borderRadius: "12px", padding: "20px" }, children: [
                  /* @__PURE__ */ jsx("div", { className: "me-3", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-gift fa-2x" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h6", { className: "mb-1 fw-bold", children: "Free Promotion!" }),
                    /* @__PURE__ */ jsx("p", { className: "mb-0", style: { fontSize: "14px" }, children: "This promotion is currently free. No payment is required. Simply place the order to activate your feature." })
                  ] })
                ] }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-lg-4", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "card border-0 shadow-sm rounded-4 sticky-top",
            style: {
              backgroundColor: "#fff",
              borderRadius: "15px",
              padding: "0",
              boxShadow: "0 45px 90px 0 #00000026",
              top: "20px"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "card-header",
                  style: {
                    padding: "25px 30px",
                    borderBottom: "1px solid #eee",
                    backgroundColor: "transparent"
                  },
                  children: /* @__PURE__ */ jsx(
                    "h5",
                    {
                      style: {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#23262F",
                        margin: 0
                      },
                      children: "Order Summary"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "card-body", style: { padding: "25px 30px" }, children: [
                /* @__PURE__ */ jsx("div", { className: "mb-4 max-vh-40 overflow-auto pe-2", children: displayItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "d-flex mb-3 pb-3 border-bottom", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", style: { width: "80px", height: "80px" }, children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: item.image ? item.image.startsWith("http") ? item.image : `https://admin.xpertbid.com/${item.image}` : "/assets/images/placeholder.png",
                      className: "w-100 h-100 object-fit-cover rounded-3 border",
                      alt: item.title,
                      onError: (e) => e.target.src = "/assets/images/WebsiteBanner2.png"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "ms-3 flex-grow-1", children: [
                    /* @__PURE__ */ jsx(
                      "h6",
                      {
                        style: {
                          fontSize: "14px",
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: "700",
                          color: "#23262F",
                          marginBottom: item.variation_name ? "4px" : "10px",
                          lineHeight: "1.4"
                        },
                        children: item.title
                      }
                    ),
                    item.variation_name && /* @__PURE__ */ jsx("p", { className: "mb-2 x-small text-muted", children: item.variation_name }),
                    /* @__PURE__ */ jsx("div", { className: "fw-bold", style: { fontSize: "14px", color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: item.price }) })
                  ] })
                ] }, item.id)) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-2", children: [
                    /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "Subtotal:" }),
                    /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: /* @__PURE__ */ jsx(Price, { amountAED: subtotal }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-2", children: [
                    /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "Shipping:" }),
                    /* @__PURE__ */ jsx("span", { style: { fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }, children: "FREE" })
                  ] }),
                  /* @__PURE__ */ jsx("hr", { style: { margin: "20px 0", borderColor: "#eee" } }),
                  /* @__PURE__ */ jsxs("div", { className: "d-flex justify-content-between mb-3", children: [
                    /* @__PURE__ */ jsx("strong", { style: { fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }, children: "Total:" }),
                    /* @__PURE__ */ jsx("strong", { style: { fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }, children: /* @__PURE__ */ jsx(Price, { amountAED: total }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: processing,
                    className: "btn w-100 d-flex align-items-center justify-content-center",
                    style: {
                      padding: "14px",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: "#23262F",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      transition: "background-color 0.3s ease",
                      opacity: processing ? 0.7 : 1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    },
                    children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Oval, { height: 20, width: 20, color: "#fff", strokeWidth: 5 }),
                      /* @__PURE__ */ jsx("span", { className: "ms-3", children: "Processing..." })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      "Place Order - ",
                      /* @__PURE__ */ jsx(Price, { amountAED: total })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-light rounded-3", children: /* @__PURE__ */ jsxs("p", { className: "x-small text-muted mb-0", style: { lineHeight: "1.5" }, children: [
                  "By placing this order, you agree to our ",
                  /* @__PURE__ */ jsx(Link, { href: route("terms"), className: "text-primary text-decoration-none fw-bold", children: "Terms & Conditions" }),
                  " and ",
                  /* @__PURE__ */ jsx(Link, { href: route("privacy.policy"), className: "text-primary text-decoration-none fw-bold", children: "Privacy Policy" }),
                  "."
                ] }) })
              ] })
            ]
          }
        ) })
      ] })
    ] }) }),
    showSuccess && /* @__PURE__ */ jsx(SuccessPopup, { message: "Order Placed Successfully!", subMessage: `Our team will contact you shortly. Order Number: ${orderNumber}` }),
    showError && /* @__PURE__ */ jsx(ErrorPopup, { message: "Submission Failed", subMessage: errorMessage, onClose: () => setShowError(false) }),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: {
      __html: `
                .checkout-page-wrapper .verify_input {
                    border-radius: 12px !important;
                    background: #F8F8F8 !important;
                    padding-block: 15px !important;
                    padding-inline: 15px !important;
                    border: none !important;
                    font-family: "Inter", sans-serif !important;
                    font-size: 14px !important;
                    color: #23262F !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
                .checkout-page-wrapper .verify_input:focus {
                    outline: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: #F8F8F8 !important;
                }
                .checkout-label {
                    font-family: "Inter", sans-serif !important;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    color: #23262F !important;
                    margin-bottom: 8px !important;
                }
                .object-fit-cover { object-fit: cover; }
                .cursor-pointer { cursor: pointer; }
                .cursor-not-allowed { cursor: not-allowed; }
                .transition-all { transition: all 0.2s ease; }
                .x-small { font-size: 0.75rem; }
                .max-vh-40 { max-height: 40vh; }
                
                @media (max-width: 991px) {
                    .checkout-page-wrapper {
                        padding: 40px 20px !important;
                    }
                }
            `
    } })
  ] });
}
Index.layout = (page) => /* @__PURE__ */ jsx(AppLayout, { children: page });
export {
  Index as default
};
