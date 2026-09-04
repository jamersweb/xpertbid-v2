import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import { useCart } from '@/Contexts/CartContext';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import SuccessPopup from '@/Components/SuccessPopup';
import ErrorPopup from '@/Components/ErrorPopup';

export default function Index({ cartItems: inertiaCartItems = [], user }) {
    const { auth } = usePage().props;
    const authUser = auth?.user || user || null;
    const { clearCart, cartItems: contextCartItems } = useCart();
    const displayItems = Array.isArray(inertiaCartItems) && inertiaCartItems.length > 0
        ? inertiaCartItems
        : (Array.isArray(contextCartItems) ? contextCartItems : []);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Feedback States
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [orderNumber, setOrderNumber] = useState('');

    // Masters
    const [countries, setCountries] = useState([]);
    const [billingStates, setBillingStates] = useState([]);
    const [billingCities, setBillingCities] = useState([]);
    const [shippingStates, setShippingStates] = useState([]);
    const [shippingCities, setShippingCities] = useState([]);

    // Form Data
    const [billingData, setBillingData] = useState({
        name: authUser?.name || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
        address_line1: authUser?.address_line1 || '',
        address_line2: authUser?.address_line2 || '',
        city: authUser?.city || '',
        state: authUser?.state || '',
        country: authUser?.country || '',
        postal_code: authUser?.postal_code || '',
    });

    const [shippingData, setShippingData] = useState({
        name: '', email: '', phone: '', address_line1: '', address_line2: '',
        city: '', state: '', country: '', postal_code: ''
    });

    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [receiptImage, setReceiptImage] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await axios.get('/get-countries');
                const allCountries = res.data.country || res.data.countries || [];
                // Prioritize UAE (231) and Pakistan (167)
                const priorityNames = ['United Arab Emirates', 'Pakistan'];
                const priorityCountries = allCountries.filter(c => priorityNames.includes(c.name));
                const otherCountries = allCountries.filter(c => !priorityNames.includes(c.name));
                setCountries([...priorityCountries, ...otherCountries]);
            } catch (err) {
                console.error("Failed to fetch countries", err);
            }
        };
        fetchCountries();
    }, []);

    // Billing Cascading
    useEffect(() => {
        if (billingData.country) {
            const fetchStates = async () => {
                try {
                    const res = await axios.get(`/get-states/${billingData.country}`);
                    setBillingStates(res.data.state || []);
                } catch (err) { console.error(err); }
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
                } catch (err) { console.error(err); }
            };
            fetchCities();
        }
    }, [billingData.state]);

    // Shipping Cascading
    useEffect(() => {
        if (shippingData.country && !sameAsBilling) {
            const fetchStates = async () => {
                try {
                    const res = await axios.get(`/get-states/${shippingData.country}`);
                    setShippingStates(res.data.state || []);
                } catch (err) { console.error(err); }
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
                } catch (err) { console.error(err); }
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

    const subtotal = displayItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
    const shipping = 0; // TBD
    const total = subtotal + shipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (paymentMethod === 'bank_transfer' && !receiptImage) {
            setErrorMessage('Please upload the bank transfer receipt.');
            setShowError(true);
            return;
        }

        if (!billingData.phone || billingData.phone.trim().length < 7) {
            setErrorMessage('A valid phone number is required to place an order.');
            setShowError(true);
            return;
        }

        setProcessing(true);

        const formData = new FormData();

        const payload = {
            items: displayItems,
            payment_method: paymentMethod,
            total: total,
            subtotal: subtotal,
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
            shipping_postal_code: sameAsBilling ? billingData.postal_code : shippingData.postal_code,
        };

        formData.append('order_data', JSON.stringify(payload));
        if (receiptImage) {
            formData.append('receipt_image', receiptImage);
        }

        // Add direct fields for fallback validation
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] !== 'object') {
                formData.append(key, payload[key]);
            }
        });

        try {
            const response = await axios.post(route('checkout.process'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                if (response.data.redirect_url) {
                    clearCart();
                    window.location.href = response.data.redirect_url;
                    return;
                }

                setOrderNumber(response.data.order_number);
                setShowSuccess(true);
                clearCart();
                setTimeout(() => {
                    if (authUser) {
                        router.visit(route('orders.show', response.data.order_number));
                    } else {
                        router.visit(route('home'));
                    }
                }, 3000);
            } else {
                setErrorMessage(response.data.message || 'Failed to place order');
                setShowError(true);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'An error occurred while processing your order.';
            setErrorMessage(msg);
            setShowError(true);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head>
                <title>Checkout | XpertBid</title>
            </Head>

            <div className="checkout-page-wrapper" style={{ backgroundColor: "#F1F1F1", padding: "60px 70px", minHeight: "100vh" }}>
                <div className="container" style={{ maxWidth: "1200px" }}>
                    <h1
                        className="mb-4"
                        style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: "46px",
                            fontWeight: "800",
                            lineHeight: "64px",
                            color: "#23262F",
                            marginBottom: "40px",
                        }}
                    >
                        Checkout
                    </h1>

                    <form onSubmit={handleSubmit} className="row">
                        <div className="col-lg-8">
                            {/* Billing Address Card */}
                            <div
                                className="card mb-4"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "15px",
                                    padding: "0",
                                    boxShadow: "0 45px 90px 0 #00000026",
                                    border: "none",
                                }}
                            >
                                <div
                                    className="card-header"
                                    style={{
                                        padding: "25px 30px",
                                        borderBottom: "1px solid #eee",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <h5
                                        style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: "22px",
                                            fontWeight: "700",
                                            color: "#23262F",
                                            margin: 0,
                                        }}
                                    >
                                        Billing Details
                                    </h5>
                                </div>
                                <div className="card-body" style={{ padding: "25px 30px" }}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Full Name *</label>
                                            <input type="text" className="form-control verify_input" value={billingData.name} onChange={(e) => setBillingData({ ...billingData, name: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Email Address *</label>
                                            <input type="email" className="form-control verify_input" value={billingData.email} onChange={(e) => setBillingData({ ...billingData, email: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Phone Number *</label>
                                            <input type="tel" className="form-control verify_input" value={billingData.phone} onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Country *</label>
                                            <select className="form-control verify_input" value={billingData.country} onChange={(e) => setBillingData({ ...billingData, country: e.target.value, state: '', city: '' })} required>
                                                <option value="">Select Country</option>
                                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label checkout-label">Address Line 1 *</label>
                                            <input type="text" className="form-control verify_input" placeholder="House number and street name" value={billingData.address_line1} onChange={(e) => setBillingData({ ...billingData, address_line1: e.target.value })} required />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label checkout-label">Address Line 2</label>
                                            <input type="text" className="form-control verify_input" placeholder="Apartment, suite, unit, etc. (optional)" value={billingData.address_line2} onChange={(e) => setBillingData({ ...billingData, address_line2: e.target.value })} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">State *</label>
                                            <select className="form-control verify_input" value={billingData.state} onChange={(e) => setBillingData({ ...billingData, state: e.target.value, city: '' })} required disabled={!billingData.country}>
                                                <option value="">Select State</option>
                                                {billingStates.map(s => <option key={s.id} value={s.id}>{s.name || s}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Town / City *</label>
                                            <select className="form-control verify_input" value={billingData.city} onChange={(e) => setBillingData({ ...billingData, city: e.target.value })} required disabled={!billingData.state}>
                                                <option value="">Select City</option>
                                                {billingCities.map(c => <option key={c.id} value={c.name || c}>{c.name || c}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label checkout-label">Postal Code</label>
                                            <input type="text" className="form-control verify_input" value={billingData.postal_code} onChange={(e) => setBillingData({ ...billingData, postal_code: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Details Card */}
                            <div
                                className="card mb-4"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "15px",
                                    padding: "0",
                                    boxShadow: "0 45px 90px 0 #00000026",
                                    border: "none",
                                }}
                            >
                                <div
                                    className="card-header"
                                    style={{
                                        padding: "25px 30px",
                                        borderBottom: "1px solid #eee",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <h5
                                        style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: "22px",
                                            fontWeight: "700",
                                            color: "#23262F",
                                            margin: 0,
                                            marginBottom: "15px",
                                        }}
                                    >
                                        Shipping Details
                                    </h5>
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="sameAsBilling"
                                            checked={sameAsBilling}
                                            onChange={(e) => setSameAsBilling(e.target.checked)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="sameAsBilling"
                                            style={{
                                                cursor: 'pointer',
                                                fontFamily: '"Inter", sans-serif',
                                                fontSize: "14px",
                                                color: "#606060",
                                            }}
                                        >
                                            Same as billing address
                                        </label>
                                    </div>
                                </div>
                                {!sameAsBilling && (
                                    <div className="card-body" style={{ padding: "25px 30px" }}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Full Name *</label>
                                                <input type="text" className="form-control verify_input" value={shippingData.name} onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Email Address *</label>
                                                <input type="email" className="form-control verify_input" value={shippingData.email} onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Phone Number *</label>
                                                <input type="tel" className="form-control verify_input" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Country *</label>
                                                <select className="form-control verify_input" value={shippingData.country} onChange={(e) => setShippingData({ ...shippingData, country: e.target.value, state: '', city: '' })} required>
                                                    <option value="">Select Country</option>
                                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label checkout-label">Address Line 1 *</label>
                                                <input type="text" className="form-control verify_input" placeholder="House number and street name" value={shippingData.address_line1} onChange={(e) => setShippingData({ ...shippingData, address_line1: e.target.value })} required />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label checkout-label">Address Line 2</label>
                                                <input type="text" className="form-control verify_input" placeholder="Apartment, suite, unit, etc. (optional)" value={shippingData.address_line2} onChange={(e) => setShippingData({ ...shippingData, address_line2: e.target.value })} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">State *</label>
                                                <select className="form-control verify_input" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value, city: '' })} required disabled={!shippingData.country}>
                                                    <option value="">Select State</option>
                                                    {shippingStates.map(s => <option key={s.id} value={s.id}>{s.name || s}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Town / City *</label>
                                                <select className="form-control verify_input" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} required disabled={!shippingData.state}>
                                                    <option value="">Select City</option>
                                                    {shippingCities.map(c => <option key={c.id} value={c.name || c}>{c.name || c}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label checkout-label">Postal Code</label>
                                                <input type="text" className="form-control verify_input" value={shippingData.postal_code} onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method Card */}
                            <div
                                className="card mb-4"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "15px",
                                    padding: "0",
                                    boxShadow: "0 45px 90px 0 #00000026",
                                    border: "none",
                                }}
                            >
                                <div
                                    className="card-header"
                                    style={{
                                        padding: "25px 30px",
                                        borderBottom: "1px solid #eee",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <h5
                                        style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: "22px",
                                            fontWeight: "700",
                                            color: "#23262F",
                                            margin: 0,
                                        }}
                                    >
                                        Payment Method
                                    </h5>
                                </div>
                                <div className="card-body" style={{ padding: "25px 30px" }}>
                                    {total > 0 ? (
                                        <>
                                            <div className="form-check mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cod"
                                                    value="cod"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ margin: 0, flexShrink: 0, cursor: 'pointer' }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="cod"
                                                    style={{
                                                        fontFamily: '"Inter", sans-serif',
                                                        fontSize: "16px",
                                                        color: "#23262F",
                                                        margin: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Cash on Delivery (COD)
                                                </label>
                                            </div>
                                            <div className="form-check mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="payfast"
                                                    value="payfast"
                                                    checked={paymentMethod === 'payfast'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ margin: 0, flexShrink: 0, cursor: 'pointer' }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="payfast"
                                                    style={{
                                                        fontFamily: '"Inter", sans-serif',
                                                        fontSize: "16px",
                                                        color: "#23262F",
                                                        margin: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    PayFast
                                                </label>
                                            </div>
                                            <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="bank_transfer"
                                                    value="bank_transfer"
                                                    checked={paymentMethod === 'bank_transfer'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    style={{ margin: 0, flexShrink: 0, cursor: 'pointer' }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="bank_transfer"
                                                    style={{
                                                        fontFamily: '"Inter", sans-serif',
                                                        fontSize: "16px",
                                                        color: "#23262F",
                                                        margin: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    XpertBid Bank Transfer
                                                </label>
                                            </div>

                                            {paymentMethod === 'bank_transfer' && (
                                                <div className="mt-4" style={{
                                                    backgroundColor: "#F8F8F8",
                                                    padding: "20px",
                                                    borderRadius: "12px",
                                                }}>
                                                    <div className="alert alert-info py-2 px-3 mb-3" style={{ fontSize: '13px', borderRadius: '8px', backgroundColor: '#e1f5fe', border: 'none', color: '#01579b' }}>
                                                        <i className="fa-solid fa-circle-info me-2"></i>
                                                        Please transfer the total amount to the bank account below and upload a screenshot of the receipt.
                                                    </div>
                                                    <div className="bank-details" style={{ fontSize: '14px', lineHeight: '1.6', color: '#23262F' }}>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span style={{ color: '#777E90' }}>Bank Name:</span>
                                                            <span className="fw-bold" style={{ color: '#23262F' }}>Bank al habib islamic Dha phase VIII karachi</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span style={{ color: '#777E90' }}>Account Title:</span>
                                                            <span className="fw-bold" style={{ color: '#23262F' }}>Xpertbid technologies private limited</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span style={{ color: '#777E90' }}>Account Number:</span>
                                                            <span className="fw-bold" style={{ color: '#23262F' }}>5054-0081-000892-01</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <label className="form-label mb-2" style={{ fontSize: '14px', fontWeight: '600', color: '#23262F' }}>Upload Receipt Screenshot</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*"
                                                            onChange={handleReceiptChange}
                                                            style={{ fontSize: '13px', borderRadius: '6px' }}
                                                        />
                                                        {receiptPreview && (
                                                            <div className="mt-2 position-relative" style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                                <img src={receiptPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center"
                                                                    style={{ width: '18px', height: '18px', borderRadius: '50%', fontSize: '10px' }}
                                                                    onClick={() => {
                                                                        setReceiptImage(null);
                                                                        setReceiptPreview(null);
                                                                    }}
                                                                >
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Removed Stripe Coming Soon as per user request */}
                                        </>
                                    ) : (
                                        <div className="alert alert-success d-flex align-items-center mb-0" style={{ borderRadius: '12px', padding: '20px' }}>
                                            <div className="me-3">
                                                <i className="fa-solid fa-gift fa-2x"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1 fw-bold">Free Promotion!</h6>
                                                <p className="mb-0" style={{ fontSize: '14px' }}>This promotion is currently free. No payment is required. Simply place the order to activate your feature.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Column */}
                        <div className="col-lg-4">
                            <div
                                className="card border-0 shadow-sm rounded-4 sticky-top"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "15px",
                                    padding: "0",
                                    boxShadow: "0 45px 90px 0 #00000026",
                                    top: "20px",
                                }}
                            >
                                <div
                                    className="card-header"
                                    style={{
                                        padding: "25px 30px",
                                        borderBottom: "1px solid #eee",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <h5
                                        style={{
                                            fontFamily: '"Inter", sans-serif',
                                            fontSize: "22px",
                                            fontWeight: "700",
                                            color: "#23262F",
                                            margin: 0,
                                        }}
                                    >
                                        Order Summary
                                    </h5>
                                </div>
                                <div className="card-body" style={{ padding: "25px 30px" }}>
                                    <div className="mb-4 max-vh-40 overflow-auto pe-2">
                                        {displayItems.map(item => (
                                            <div key={item.id} className="d-flex mb-3 pb-3 border-bottom">
                                                <div className="flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                                                    <img
                                                        src={item.image ? (item.image.startsWith('http') ? item.image : `/${item.image.replace(/^\/+/, '')}`) : '/assets/images/placeholder.png'}
                                                        className="w-100 h-100 object-fit-cover rounded-3 border"
                                                        alt={item.title}
                                                        onError={e => e.target.src = '/assets/images/WebsiteBanner2.png'}
                                                    />
                                                </div>
                                                <div className="ms-3 flex-grow-1">
                                                    <h6
                                                        style={{
                                                            fontSize: '14px',
                                                            fontFamily: '"Inter", sans-serif',
                                                            fontWeight: "700",
                                                            color: "#23262F",
                                                            marginBottom: item.variation_name ? '4px' : '10px',
                                                            lineHeight: '1.4',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </h6>
                                                    {item.variation_name && (
                                                        <p className="mb-2 x-small text-muted">{item.variation_name}</p>
                                                    )}
                                                    <div className="fw-bold" style={{ fontSize: '14px', color: '#23262F' }}>
                                                        <Price amountAED={item.price} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>Subtotal:</span>
                                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}><Price amountAED={subtotal} /></span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>Shipping:</span>
                                            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>FREE</span>
                                        </div>
                                        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
                                        <div className="d-flex justify-content-between mb-3">
                                            <strong style={{ fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }}>Total:</strong>
                                            <strong style={{ fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }}>
                                                <Price amountAED={total} />
                                            </strong>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn w-100 d-flex align-items-center justify-content-center"
                                        style={{
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
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {processing ? (
                                            <>
                                                <Oval height={20} width={20} color="#fff" strokeWidth={5} />
                                                <span className="ms-3">Processing...</span>
                                            </>
                                        ) : (
                                            <>Place Order - <Price amountAED={total} /></>
                                        )}
                                    </button>

                                    <div className="mt-4 p-3 bg-light rounded-3">
                                        <p className="x-small text-muted mb-0" style={{ lineHeight: '1.5' }}>By placing this order, you agree to our <Link href={route('terms')} className="text-primary text-decoration-none fw-bold">Terms & Conditions</Link> and <Link href={route('privacy.policy')} className="text-primary text-decoration-none fw-bold">Privacy Policy</Link>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Popups */}
            {showSuccess && <SuccessPopup message="Order Placed Successfully!" subMessage={`Our team will contact you shortly. Order Number: ${orderNumber}`} />}
            {showError && <ErrorPopup message="Submission Failed" subMessage={errorMessage} onClose={() => setShowError(false)} />}

            <style dangerouslySetInnerHTML={{
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
            `}} />
        </>
    );
}

Index.layout = page => <AppLayout children={page} />;
