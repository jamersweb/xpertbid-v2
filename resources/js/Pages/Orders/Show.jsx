import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import Price from "@/Components/Price";

// Helper for date formatting
const formatDate = (dateString) => {
       return new Date(dateString).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
       });
};

// Robust image parser logic
const getImageUrl = (listing) => {
       return listing?.image_url || null;
};

export default function Show({ order }) {
       return (
              <AppLayout title={`Order #${order.order_number}`}>
                     <main className="container py-5">
                            <div className="mb-4">
                                   <Link href={route('orders.index')} className="text-decoration-none" style={{ color: '#23262F', fontWeight: '600', fontSize: '16px' }}>
                                          <i className="fa-solid fa-arrow-left me-2"></i> Back to Orders
                                   </Link>
                            </div>

                             <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ boxShadow: '0 45px 90px 0 #00000026' }}>
                                   <div className="card-header bg-white p-4" style={{ borderBottom: '1px solid #eee' }}>
                                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                 <div>
                                                        <h4 className="mb-1 fw-bold" style={{ color: '#23262F', fontFamily: '"Inter", sans-serif' }}>Order #{order.order_number}</h4>
                                                        <p className="mb-0 small" style={{ color: '#777E90', fontWeight: '500' }}>{formatDate(order.created_at)}</p>
                                                 </div>
                                                 <span
                                                        className="badge rounded-pill px-4 py-2"
                                                        style={{
                                                               backgroundColor: order.status === 'completed' ? '#4CAF50' :
                                                                      order.status === 'pending' ? '#FFC107' :
                                                                             order.status === 'cancelled' ? '#F44336' : '#2196F3',
                                                               color: order.status === 'pending' ? '#000' : '#fff',
                                                               fontSize: '14px',
                                                               fontWeight: '700'
                                                        }}
                                                 >
                                                        {order.status?.toUpperCase() || 'PENDING'}
                                                 </span>
                                          </div>
                                   </div>

                                   <div className="card-body p-4">
                                          <div className="row g-4">
                                                 {/* Addresses */}
                                                 <div className={order.is_promotion ? "col-md-12" : "col-md-6"}>
                                                        <div className="p-4 bg-white rounded-4 h-100 border" style={{ borderColor: '#eee !important' }}>
                                                               <h6 className="fw-bold mb-3" style={{ color: '#23262F', fontSize: '18px' }}><i className="fa-solid fa-file-invoice me-2" style={{ color: '#43ACE9' }}></i>{order.is_promotion ? 'User Details' : 'Billing Address'}</h6>
                                                               <p className="mb-1 fw-bold" style={{ color: '#23262F' }}>{order.billing_name}</p>
                                                               <p className="mb-1" style={{ color: '#23262F' }}>{order.billing_email}</p>
                                                               {!order.is_promotion && (
                                                                      <>
                                                                             <p className="mb-1" style={{ color: '#777E90' }}>{order.billing_address_line1}</p>
                                                                             {order.billing_address_line2 && <p className="mb-1" style={{ color: '#777E90' }}>{order.billing_address_line2}</p>}
                                                                             <p className="mb-1" style={{ color: '#777E90' }}>{order.billing_city}, {order.billing_state} {order.billing_postal_code}</p>
                                                                             <p className="mb-1" style={{ color: '#777E90' }}>{order.billing_country}</p>
                                                                      </>
                                                               )}
                                                               <p className="mb-0 mt-3 pt-2 border-top" style={{ color: '#23262F' }}><i className="fa-solid fa-phone me-2" style={{ color: '#777E90' }}></i>{order.billing_phone}</p>
                                                        </div>
                                                 </div>
                                                 {!order.is_promotion && (
                                                        <div className="col-md-6">
                                                               <div className="p-4 bg-white rounded-4 h-100 border" style={{ borderColor: '#eee !important' }}>
                                                                      <h6 className="fw-bold mb-3" style={{ color: '#23262F', fontSize: '18px' }}><i className="fa-solid fa-truck-fast me-2" style={{ color: '#43ACE9' }}></i>Shipping Address</h6>
                                                                      <p className="mb-1 fw-bold" style={{ color: '#23262F' }}>{order.shipping_name}</p>
                                                                      <p className="mb-1" style={{ color: '#777E90' }}>{order.shipping_address_line1}</p>
                                                                      {order.shipping_address_line2 && <p className="mb-1" style={{ color: '#777E90' }}>{order.shipping_address_line2}</p>}
                                                                      <p className="mb-1" style={{ color: '#777E90' }}>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                                                                      <p className="mb-1" style={{ color: '#777E90' }}>{order.shipping_country}</p>
                                                                      <p className="mb-0 mt-3 pt-2 border-top" style={{ color: '#23262F' }}><i className="fa-solid fa-phone me-2" style={{ color: '#777E90' }}></i>{order.shipping_phone}</p>
                                                               </div>
                                                        </div>
                                                 )}

                                                 {/* Order Items */}
                                                 <div className="col-12 mt-5">
                                                        <h5 className="fw-bold mb-3" style={{ color: '#23262F' }}>Order Items</h5>
                                                        <div className="table-responsive">
                                                               <table className="table table-hover align-middle">
                                                                      <thead style={{ backgroundColor: '#F8F8F8' }}>
                                                                             <tr>
                                                                                    <th className="border-0 px-4 py-3" style={{ width: '50%', color: '#23262F', fontWeight: '600' }}>Product</th>
                                                                                    <th className="text-center border-0 py-3" style={{ color: '#23262F', fontWeight: '600' }}>Price</th>
                                                                                    <th className="text-center border-0 py-3" style={{ color: '#23262F', fontWeight: '600' }}>Quantity</th>
                                                                                    <th className="text-end border-0 px-4 py-3" style={{ color: '#23262F', fontWeight: '600' }}>Total</th>
                                                                             </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                             {order.items.map((item) => {
                                                                                    const imgUrl = getImageUrl(item.listing);
                                                                                    return (
                                                                                           <tr key={item.id}>
                                                                                                  <td className="px-4">
                                                                                                         <div className="d-flex align-items-center">
                                                                                                                <div className="me-3 border rounded-3 overflow-hidden bg-white" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                                                                                                       {imgUrl ? (
                                                                                                                              <img src={imgUrl} alt={item.product_name} className="w-100 h-100 object-fit-cover" />
                                                                                                                       ) : (
                                                                                                                              <div className="d-flex w-100 h-100 align-items-center justify-content-center" style={{ color: '#777E90' }}><i className="fa-solid fa-image"></i></div>
                                                                                                                       )}
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                       <Link href={item.listing?.slug ? `/product/${item.listing.slug}` : '#'} className="text-decoration-none fw-bold" style={{ color: '#23262F' }}>
                                                                                                                              {item.product_name || item.listing?.title || "Product"}
                                                                                                                       </Link>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                  </td>
                                                                                                  <td className="text-center" style={{ color: '#23262F' }}><Price amountAED={item.price} /></td>
                                                                                                  <td className="text-center" style={{ color: '#23262F' }}>{item.quantity}</td>
                                                                                                  <td className="text-end px-4 fw-bold" style={{ color: '#23262F' }}><Price amountAED={item.subtotal} /></td>
                                                                                           </tr>
                                                                                    );
                                                                             })}
                                                                      </tbody>
                                                                      <tfoot style={{ borderTop: '2px solid #eee' }}>
                                                                             <tr>
                                                                                    <td colSpan="3" className="text-end border-0 pt-4 px-4" style={{ color: '#777E90', fontWeight: '500' }}>Subtotal</td>
                                                                                    <td className="text-end border-0 pt-4 px-4" style={{ color: '#23262F', fontWeight: '600' }}><Price amountAED={order.subtotal || order.total} /></td>
                                                                             </tr>
                                                                             {Number(order.tax) > 0 && (
                                                                                    <tr>
                                                                                           <td colSpan="3" className="text-end border-0 px-4" style={{ color: '#777E90', fontWeight: '500' }}>Tax</td>
                                                                                           <td className="text-end border-0 px-4" style={{ color: '#23262F', fontWeight: '600' }}><Price amountAED={order.tax} /></td>
                                                                                    </tr>
                                                                             )}
                                                                             {Number(order.shipping_cost) > 0 && (
                                                                                    <tr>
                                                                                           <td colSpan="3" className="text-end border-0 px-4" style={{ color: '#777E90', fontWeight: '500' }}>Shipping</td>
                                                                                           <td className="text-end border-0 px-4" style={{ color: '#23262F', fontWeight: '600' }}><Price amountAED={order.shipping_cost} /></td>
                                                                                    </tr>
                                                                             )}
                                                                             <tr>
                                                                                    <td colSpan="3" className="text-end border-0 px-4 pt-3 fw-bold fs-5" style={{ color: '#23262F' }}>Total</td>
                                                                                    <td className="text-end border-0 px-4 pt-3 fw-bold fs-5" style={{ color: '#43ACE9' }}><Price amountAED={order.total} /></td>
                                                                             </tr>
                                                                      </tfoot>
                                                               </table>
                                                        </div>
                                                 </div>

                                                 {/* Payment Info */}
                                                 <div className="col-12 mt-4">
                                                        <div className="p-4 border rounded-4 bg-white" style={{ borderColor: '#eee !important' }}>
                                                               <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                                                      <div>
                                                                             <h6 className="fw-bold mb-2" style={{ color: '#23262F' }}>Payment Information</h6>
                                                                             <p className="mb-0" style={{ color: '#777E90' }}>
                                                                                    Method: <span style={{ color: '#23262F', fontWeight: '600' }}>{
                                                                                           order.payment_method === 'cod' ? 'Cash on Delivery' :
                                                                                                  order.payment_method === 'stripe' ? 'Credit/Debit Card (Stripe)' :
                                                                                                         order.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                                                                                                                order.payment_method === 'payfast' ? 'PayFast' : order.payment_method
                                                                                    }</span>
                                                                             </p>
                                                                             {order.transaction_id && <small className="d-block mt-2" style={{ color: '#777E90' }}>Transaction ID: {order.transaction_id}</small>}
                                                                      </div>
                                                                      <div className="text-end">
                                                                             <div className="small mb-1" style={{ color: '#777E90', fontWeight: '500' }}>Payment Status</div>
                                                                             <span className={`badge rounded-pill px-3 py-2 ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontWeight: '700' }}>
                                                                                    {order.payment_status?.toUpperCase() || 'PENDING'}
                                                                             </span>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>

                                          </div>
                                   </div>
                            </div>
                     </main>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            body { background-color: #F1F1F1 !important; }
                            .object-fit-cover { object-fit: cover; }
                            .border-top-2 { border-top: 2px solid #f0f0f0 !important; }
                            .card { border-radius: 15px !important; }
                     `}} />
              </AppLayout>
       );
}
