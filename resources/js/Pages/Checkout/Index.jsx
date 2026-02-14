import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import { useCart } from '@/Contexts/CartContext';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import SuccessPopup from '@/Components/SuccessPopup';
import ErrorPopup from '@/Components/ErrorPopup';

export default function Index({ cartItems: inertiaCartItems, user }) {
       const { clearCart } = useCart();
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
       const [states, setStates] = useState([]);
       const [cities, setCities] = useState([]);

       // Form Data
       const [billingData, setBillingData] = useState({
              name: user?.name || '',
              email: user?.email || '',
              phone: user?.phone || '',
              address_line1: user?.address_line1 || '',
              address_line2: user?.address_line2 || '',
              city: user?.city || '',
              state: user?.state || '',
              country: user?.country || '',
              postal_code: user?.postal_code || '',
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
                            setCountries(res.data.country || res.data.countries || []);
                     } catch (err) {
                            console.error("Failed to fetch countries", err);
                     }
              };
              fetchCountries();
       }, []);

       // Handle Country -> State -> City cascading
       useEffect(() => {
              if (billingData.country) {
                     const fetchStates = async () => {
                            try {
                                   const res = await axios.get(`/get-states/${billingData.country}`);
                                   setStates(res.data.state || []);
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
                                   setCities(res.data.city || []);
                            } catch (err) { console.error(err); }
                     };
                     fetchCities();
              }
       }, [billingData.state]);

       const handleReceiptChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                     setReceiptImage(file);
                     setReceiptPreview(URL.createObjectURL(file));
              }
       };

       const subtotal = inertiaCartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
       const shipping = 0; // TBD
       const total = subtotal + shipping;

       const handleSubmit = async (e) => {
              e.preventDefault();
              setProcessing(true);

              const formData = new FormData();

              const payload = {
                     items: inertiaCartItems,
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
                     shipping_city: sameAsBilling ? billingData.city : shippingData.city,
                     shipping_state: sameAsBilling ? billingData.state : shippingData.state,
                     shipping_country: sameAsBilling ? billingData.country : shippingData.country,
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
                            setOrderNumber(response.data.order_number);
                            setShowSuccess(true);
                            clearCart();
                            setTimeout(() => {
                                   router.visit(route('orders.show', response.data.order_number));
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
              <AppLayout title="Checkout">
                     <Head>
                            <title>Checkout | XpertBid</title>
                     </Head>

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <h1 className="fw-bolder display-5 mb-5 text-dark">Secure Checkout</h1>

                                   <form onSubmit={handleSubmit} className="row g-4">
                                          <div className="col-lg-8">
                                                 {/* Billing Address Card */}
                                                 <div className="card border-0 shadow-sm rounded-4 mb-4">
                                                        <div className="card-header bg-white p-4 border-bottom">
                                                               <h4 className="fw-bold mb-0">Billing Details</h4>
                                                        </div>
                                                        <div className="card-body p-4">
                                                               <div className="row g-3">
                                                                      <div className="col-md-12">
                                                                             <label className="form-label small fw-bold text-muted">Full Name *</label>
                                                                             <input type="text" className="form-control rounded-3" value={billingData.name} onChange={(e) => setBillingData({ ...billingData, name: e.target.value })} required />
                                                                      </div>
                                                                      <div className="col-md-6">
                                                                             <label className="form-label small fw-bold text-muted">Email Address *</label>
                                                                             <input type="email" className="form-control rounded-3" value={billingData.email} onChange={(e) => setBillingData({ ...billingData, email: e.target.value })} required />
                                                                      </div>
                                                                      <div className="col-md-6">
                                                                             <label className="form-label small fw-bold text-muted">Phone Number *</label>
                                                                             <input type="tel" className="form-control rounded-3" value={billingData.phone} onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })} required />
                                                                      </div>
                                                                      <div className="col-md-12">
                                                                             <label className="form-label small fw-bold text-muted">Street Address *</label>
                                                                             <input type="text" className="form-control rounded-3 mb-2" placeholder="House number and street name" value={billingData.address_line1} onChange={(e) => setBillingData({ ...billingData, address_line1: e.target.value })} required />
                                                                             <input type="text" className="form-control rounded-3" placeholder="Apartment, suite, unit, etc. (optional)" value={billingData.address_line2} onChange={(e) => setBillingData({ ...billingData, address_line2: e.target.value })} />
                                                                      </div>
                                                                      <div className="col-md-4">
                                                                             <label className="form-label small fw-bold text-muted">Country *</label>
                                                                             <select className="form-select rounded-3" value={billingData.country} onChange={(e) => setBillingData({ ...billingData, country: e.target.value, state: '', city: '' })} required>
                                                                                    <option value="">Select Country</option>
                                                                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                                             </select>
                                                                      </div>
                                                                      <div className="col-md-4">
                                                                             <label className="form-label small fw-bold text-muted">State *</label>
                                                                             <select className="form-select rounded-3" value={billingData.state} onChange={(e) => setBillingData({ ...billingData, state: e.target.value, city: '' })} required disabled={!billingData.country}>
                                                                                    <option value="">Select State</option>
                                                                                    {states.map(s => <option key={s.id} value={s.id}>{s.name || s}</option>)}
                                                                             </select>
                                                                      </div>
                                                                      <div className="col-md-4">
                                                                             <label className="form-label small fw-bold text-muted">Town / City *</label>
                                                                             <select className="form-select rounded-3" value={billingData.city} onChange={(e) => setBillingData({ ...billingData, city: e.target.value })} required disabled={!billingData.state}>
                                                                                    <option value="">Select City</option>
                                                                                    {cities.map(c => <option key={c.id} value={c.name || c}>{c.name || c}</option>)}
                                                                             </select>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Payment Method Card */}
                                                 <div className="card border-0 shadow-sm rounded-4 mb-4">
                                                        <div className="card-header bg-white p-4 border-bottom">
                                                               <h4 className="fw-bold mb-0">Payment Method</h4>
                                                        </div>
                                                        <div className="card-body p-4">
                                                               <div className="d-flex flex-column gap-3">
                                                                      <div className={`p-3 border rounded-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-light' : ''}`} onClick={() => setPaymentMethod('cod')}>
                                                                             <div className="form-check">
                                                                                    <input className="form-check-input" type="radio" name="paymentType" id="cod" checked={paymentMethod === 'cod'} readOnly />
                                                                                    <label className="form-check-label fw-bold" htmlFor="cod">Cash on Delivery (COD)</label>
                                                                             </div>
                                                                      </div>
                                                                      <div className={`p-3 border rounded-3 cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-light' : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>
                                                                             <div className="form-check mb-2">
                                                                                    <input className="form-check-input" type="radio" name="paymentType" id="bank" checked={paymentMethod === 'bank_transfer'} readOnly />
                                                                                    <label className="form-check-label fw-bold" htmlFor="bank">Direct Bank Transfer</label>
                                                                             </div>
                                                                             {paymentMethod === 'bank_transfer' && (
                                                                                    <div className="mt-3 p-3 bg-white rounded-3 border-start border-4 border-primary">
                                                                                           <p className="small text-muted mb-3">Make your payment directly into our bank account. Please use your Order ID as the payment reference.</p>
                                                                                           <div className="bg-light p-3 rounded-2 mb-3">
                                                                                                  <h6 className="fw-bold mb-2">Our Bank Details:</h6>
                                                                                                  <p className="mb-1 small"><strong>Bank:</strong> National Bank of Abu Dhabi</p>
                                                                                                  <p className="mb-1 small"><strong>Account Name:</strong> XpertBid Trading LLC</p>
                                                                                                  <p className="mb-0 small"><strong>IBAN:</strong> AE12 0000 0000 0000 0000 123</p>
                                                                                           </div>
                                                                                           <label className="form-label small fw-bold">Upload Payment Receipt *</label>
                                                                                           <input type="file" className="form-control form-control-sm" onChange={handleReceiptChange} accept="image/*" />
                                                                                           {receiptPreview && (
                                                                                                  <div className="mt-2">
                                                                                                         <img src={receiptPreview} className="rounded border shadow-sm" style={{ height: '100px' }} alt="Receipt Preview" />
                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                      <div className="p-3 border rounded-3 opacity-50 cursor-not-allowed">
                                                                             <div className="form-check">
                                                                                    <input className="form-check-input" type="radio" name="paymentType" id="stripe" disabled />
                                                                                    <label className="form-check-label fw-bold" htmlFor="stripe">
                                                                                           Credit / Debit Card (via Stripe)
                                                                                           <span className="badge bg-warning text-dark ms-2 fw-normal">Coming Soon</span>
                                                                                    </label>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>

                                          {/* Order Summary Column */}
                                          <div className="col-lg-4">
                                                 <div className="card border-0 shadow shadow-sm rounded-4 sticky-top" style={{ top: '2rem' }}>
                                                        <div className="card-body p-4">
                                                               <h4 className="fw-bold mb-4">Your Order</h4>

                                                               <div className="mb-4 max-vh-40 overflow-auto">
                                                                      {inertiaCartItems.map(item => (
                                                                             <div key={item.id} className="d-flex align-items-center mb-3">
                                                                                    <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                                                                                           <img src={item.image ? (item.image.startsWith('http') ? item.image : `https://admin.xpertbid.com/${item.image}`) : '/assets/images/placeholder.png'} className="w-100 h-100 object-fit-cover rounded border" alt="" onError={e => e.target.src = '/assets/images/WebsiteBanner2.png'} />
                                                                                    </div>
                                                                                    <div className="ms-3 flex-grow-1">
                                                                                           <p className="mb-0 small fw-bold text-truncate" style={{ maxWidth: '180px' }}>{item.title}</p>
                                                                                           <p className="mb-0 x-small text-muted">{item.variation_name || 'Standard'}</p>
                                                                                    </div>
                                                                                    <div className="fw-bold small">
                                                                                           <Price amountAED={item.price} />
                                                                                    </div>
                                                                             </div>
                                                                      ))}
                                                               </div>

                                                               <hr className="my-3" />

                                                               <div className="d-flex justify-content-between mb-2 text-muted small">
                                                                      <span>Subtotal</span>
                                                                      <Price amountAED={subtotal} />
                                                               </div>
                                                               <div className="d-flex justify-content-between mb-2 text-muted small">
                                                                      <span>Shipping</span>
                                                                      <span>FREE</span>
                                                               </div>

                                                               <div className="d-flex justify-content-between mt-3 align-items-center">
                                                                      <span className="fw-bold fs-5">Total</span>
                                                                      <span className="fw-bold fs-4 text-primary">
                                                                             <Price amountAED={total} />
                                                                      </span>
                                                               </div>

                                                               <button
                                                                      type="submit"
                                                                      disabled={processing}
                                                                      className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm mt-4 d-flex align-items-center justify-content-center"
                                                               >
                                                                      {processing ? (
                                                                             <>
                                                                                    <Oval height={20} width={20} color="#fff" strokeWidth={5} />
                                                                                    <span className="ms-3">Processing...</span>
                                                                             </>
                                                                      ) : (
                                                                             <>Place Order <i className="fa-solid fa-lock ms-2"></i></>
                                                                      )}
                                                               </button>

                                                               <div className="mt-4 p-3 bg-light rounded-3">
                                                                      <p className="x-small text-muted mb-0">By placing this order, you agree to our <Link href={route('terms')} className="text-primary">Terms & Conditions</Link> and <Link href={route('privacy.policy')} className="text-primary">Privacy Policy</Link>.</p>
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
                .object-fit-cover { object-fit: cover; }
                .cursor-pointer { cursor: pointer; }
                .cursor-not-allowed { cursor: not-allowed; }
                .transition-all { transition: all 0.2s ease; }
                .x-small { font-size: 0.75rem; }
                .max-vh-40 { max-height: 40vh; }
            `}} />
              </AppLayout>
       );
}
