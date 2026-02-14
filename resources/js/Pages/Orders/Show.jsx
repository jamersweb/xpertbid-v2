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
const getImageUrl = (auction) => {
       let imgPath = "";
       try {
              let albumData = auction?.album || auction?.image;
              if (typeof albumData === 'string') {
                     try { albumData = JSON.parse(albumData); } catch (e) { }
              }
              if (Array.isArray(albumData)) {
                     imgPath = albumData[0];
              } else {
                     imgPath = albumData;
              }
              imgPath = imgPath?.replace(/^\/+/, "");
       } catch {
              imgPath = "";
       }
       return imgPath ? `/${imgPath}` : null;
};

export default function Show({ order }) {
       return (
              <AppLayout title={`Order #${order.order_number}`}>
                     <main className="container py-5">
                            <div className="mb-4">
                                   <Link href={route('orders.index')} className="text-decoration-none text-muted">
                                          <i className="fa-solid fa-arrow-left me-2"></i> Back to Orders
                                   </Link>
                            </div>

                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                   <div className="card-header bg-white p-4 border-bottom">
                                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                 <div>
                                                        <h4 className="mb-1 fw-bold">Order #{order.order_number}</h4>
                                                        <p className="text-muted mb-0 small">{formatDate(order.created_at)}</p>
                                                 </div>
                                                 <span
                                                        className="badge rounded-pill px-4 py-2"
                                                        style={{
                                                               backgroundColor: order.status === 'completed' ? '#4CAF50' :
                                                                      order.status === 'pending' ? '#FFC107' :
                                                                             order.status === 'cancelled' ? '#F44336' : '#2196F3',
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
                                                        <div className="p-4 bg-light rounded-4 h-100 border">
                                                               <h6 className="fw-bold mb-3"><i className="fa-solid fa-file-invoice me-2 text-primary"></i>{order.is_promotion ? 'User Details' : 'Billing Address'}</h6>
                                                               <p className="mb-1 fw-bold">{order.billing_name}</p>
                                                               <p className="mb-1">{order.billing_email}</p>
                                                               {!order.is_promotion && (
                                                                      <>
                                                                             <p className="mb-1 text-muted">{order.billing_address_line1}</p>
                                                                             {order.billing_address_line2 && <p className="mb-1 text-muted">{order.billing_address_line2}</p>}
                                                                             <p className="mb-1 text-muted">{order.billing_city}, {order.billing_state} {order.billing_postal_code}</p>
                                                                             <p className="mb-1 text-muted">{order.billing_country}</p>
                                                                      </>
                                                               )}
                                                               <p className="mb-0 mt-3 pt-2 border-top"><i className="fa-solid fa-phone me-2 text-muted"></i>{order.billing_phone}</p>
                                                        </div>
                                                 </div>
                                                 {!order.is_promotion && (
                                                        <div className="col-md-6">
                                                               <div className="p-4 bg-light rounded-4 h-100 border">
                                                                      <h6 className="fw-bold mb-3"><i className="fa-solid fa-truck-fast me-2 text-primary"></i>Shipping Address</h6>
                                                                      <p className="mb-1 fw-bold">{order.shipping_name}</p>
                                                                      <p className="mb-1 text-muted">{order.shipping_address_line1}</p>
                                                                      {order.shipping_address_line2 && <p className="mb-1 text-muted">{order.shipping_address_line2}</p>}
                                                                      <p className="mb-1 text-muted">{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                                                                      <p className="mb-1 text-muted">{order.shipping_country}</p>
                                                                      <p className="mb-0 mt-3 pt-2 border-top"><i className="fa-solid fa-phone me-2 text-muted"></i>{order.shipping_phone}</p>
                                                               </div>
                                                        </div>
                                                 )}

                                                 {/* Order Items */}
                                                 <div className="col-12 mt-5">
                                                        <h5 className="fw-bold mb-3">Order Items</h5>
                                                        <div className="table-responsive">
                                                               <table className="table table-hover align-middle">
                                                                      <thead className="bg-light">
                                                                             <tr>
                                                                                    <th className="border-0 px-4 py-3" style={{ width: '50%' }}>Product</th>
                                                                                    <th className="text-center border-0 py-3">Price</th>
                                                                                    <th className="text-center border-0 py-3">Quantity</th>
                                                                                    <th className="text-end border-0 px-4 py-3">Total</th>
                                                                             </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                             {order.items.map((item) => {
                                                                                    const imgUrl = getImageUrl(item.auction);
                                                                                    return (
                                                                                           <tr key={item.id}>
                                                                                                  <td className="px-4">
                                                                                                         <div className="d-flex align-items-center">
                                                                                                                <div className="me-3 border rounded-3 overflow-hidden bg-white" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                                                                                                       {imgUrl ? (
                                                                                                                              <img src={imgUrl} alt={item.product_name} className="w-100 h-100 object-fit-cover" />
                                                                                                                       ) : (
                                                                                                                              <div className="d-flex w-100 h-100 align-items-center justify-content-center text-muted"><i className="fa-solid fa-image"></i></div>
                                                                                                                       )}
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                       <Link href={item.auction?.slug ? `/product/${item.auction.slug}` : '#'} className="text-decoration-none text-dark fw-bold">
                                                                                                                              {item.product_name || item.auction?.title || "Product"}
                                                                                                                       </Link>
                                                                                                                </div>
                                                                                                         </div>
                                                                                                  </td>
                                                                                                  <td className="text-center"><Price amountAED={item.price} /></td>
                                                                                                  <td className="text-center">{item.quantity}</td>
                                                                                                  <td className="text-end px-4 fw-bold"><Price amountAED={item.subtotal} /></td>
                                                                                           </tr>
                                                                                    );
                                                                             })}
                                                                      </tbody>
                                                                      <tfoot className="border-top-2">
                                                                             <tr>
                                                                                    <td colSpan="3" className="text-end border-0 pt-4 px-4">Subtotal</td>
                                                                                    <td className="text-end border-0 pt-4 px-4"><Price amountAED={order.subtotal || order.total} /></td>
                                                                             </tr>
                                                                             {Number(order.tax) > 0 && (
                                                                                    <tr>
                                                                                           <td colSpan="3" className="text-end border-0 px-4">Tax</td>
                                                                                           <td className="text-end border-0 px-4"><Price amountAED={order.tax} /></td>
                                                                                    </tr>
                                                                             )}
                                                                             {Number(order.shipping_cost) > 0 && (
                                                                                    <tr>
                                                                                           <td colSpan="3" className="text-end border-0 px-4">Shipping</td>
                                                                                           <td className="text-end border-0 px-4"><Price amountAED={order.shipping_cost} /></td>
                                                                                    </tr>
                                                                             )}
                                                                             <tr>
                                                                                    <td colSpan="3" className="text-end border-0 px-4 pt-3 fw-bold fs-5">Total</td>
                                                                                    <td className="text-end border-0 px-4 pt-3 fw-bold fs-5 text-primary"><Price amountAED={order.total} /></td>
                                                                             </tr>
                                                                      </tfoot>
                                                               </table>
                                                        </div>
                                                 </div>

                                                 {/* Payment Info */}
                                                 <div className="col-12 mt-4">
                                                        <div className="p-4 border rounded-4 bg-light">
                                                               <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                                                      <div>
                                                                             <h6 className="fw-bold mb-2">Payment Information</h6>
                                                                             <p className="mb-0 text-muted">
                                                                                    Method: <span className="text-dark fw-semibold">{
                                                                                           order.payment_method === 'cod' ? 'Cash on Delivery' :
                                                                                                  order.payment_method === 'stripe' ? 'Credit Card (Stripe)' :
                                                                                                         order.payment_method === 'bank_transfer' ? 'Bank Transfer' : order.payment_method
                                                                                    }</span>
                                                                             </p>
                                                                             {order.transaction_id && <small className="text-muted d-block mt-2">ID: {order.transaction_id}</small>}
                                                                      </div>
                                                                      <div className="text-end">
                                                                             <div className="small text-muted mb-1">Payment Status</div>
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
                            .object-fit-cover { object-fit: cover; }
                            .border-top-2 { border-top: 2px solid #f0f0f0 !important; }
                     `}} />
              </AppLayout>
       );
}
