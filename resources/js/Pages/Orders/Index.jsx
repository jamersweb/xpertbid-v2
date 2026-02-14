import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import Price from "@/Components/Price";

// Helper for date formatting
const formatDate = (dateString) => {
       const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
       return new Date(dateString).toLocaleDateString(undefined, options);
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

export default function Index({ orders }) {
       return (
              <AppLayout title="My Orders">
                     <div className="container py-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                   <h3 style={{ fontWeight: '700', color: '#1a1a1a', margin: 0 }}>My Orders</h3>
                            </div>

                            {orders.data.length === 0 ? (
                                   <div className="text-center py-5 bg-white rounded-3 border">
                                          <div className="mb-4">
                                                 <i className="fa-solid fa-box-open" style={{ fontSize: "60px", color: "#ddd" }}></i>
                                          </div>
                                          <h4 style={{ color: "#666" }}>No orders found</h4>
                                          <p style={{ color: "#999", marginBottom: "30px" }}>
                                                 You haven't placed any orders yet.
                                          </p>
                                          <Link
                                                 href="/search"
                                                 className="btn btn-primary px-4 py-2 fw-bold"
                                                 style={{ borderRadius: '8px' }}
                                          >
                                                 Start Shopping
                                          </Link>
                                   </div>
                            ) : (
                                   <div className="d-flex flex-column gap-4">
                                          {orders.data.map((order) => (
                                                 <div
                                                        key={order.id}
                                                        className="order-card p-4 bg-white rounded-4 border shadow-sm transition-all"
                                                 >
                                                        {/* Order Header */}
                                                        <div className="d-flex justify-content-between flex-wrap pb-3 mb-3 border-bottom align-items-center">
                                                               <div>
                                                                      <h5 className="mb-1 fw-bold" style={{ color: "#1a1a1a" }}>
                                                                             Order #{order.order_number}
                                                                      </h5>
                                                                      <span className="text-muted small">
                                                                             <i className="fa-regular fa-clock me-1"></i>
                                                                             {formatDate(order.created_at)}
                                                                      </span>
                                                               </div>
                                                               <div className="text-end d-flex flex-column align-items-end">
                                                                      <span
                                                                             className="badge rounded-pill mb-2"
                                                                             style={{
                                                                                    backgroundColor: order.status === 'completed' ? '#dcfce7' :
                                                                                           order.status === 'pending' ? '#fef9c3' :
                                                                                                  order.status === 'cancelled' ? '#fee2e2' : '#e0f2fe',
                                                                                    color: order.status === 'completed' ? '#166534' :
                                                                                           order.status === 'pending' ? '#854d0e' :
                                                                                                  order.status === 'cancelled' ? '#991b1b' : '#075985',
                                                                                    fontSize: '12px',
                                                                                    padding: '6px 14px',
                                                                                    fontWeight: '600',
                                                                                    textTransform: 'uppercase'
                                                                             }}
                                                                      >
                                                                             {order.status || 'Pending'}
                                                                      </span>
                                                                      <div className="fw-bolder h5" style={{ color: '#1a1a1a' }}>
                                                                             <Price amountAED={order.total} />
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        {/* Order Items */}
                                                        <div className="order-items">
                                                               {order.items.map((item, idx) => {
                                                                      const imgUrl = getImageUrl(item.auction);
                                                                      return (
                                                                             <div key={idx} className="d-flex align-items-center mb-3 p-2 rounded-3" style={{ backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                                                                                    <div className="me-3" style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #eee' }}>
                                                                                           {imgUrl ? (
                                                                                                  <img src={imgUrl} alt={item.product_name} className="w-100 h-100 object-fit-cover" />
                                                                                           ) : (
                                                                                                  <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted bg-light">
                                                                                                         <i className="fa-solid fa-image fa-lg"></i>
                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                                    <div className="flex-grow-1">
                                                                                           <h6 className="mb-1 fw-bold" style={{ fontSize: '15px', color: '#333' }}>
                                                                                                  {item.auction?.title || "Product"}
                                                                                           </h6>
                                                                                           <div className="text-muted small">
                                                                                                  Qty: <span className="fw-semibold">{item.quantity}</span> &times; <span className="fw-semibold"><Price amountAED={item.price} /></span>
                                                                                           </div>
                                                                                    </div>
                                                                                    <div className="ms-auto">
                                                                                           <Link
                                                                                                  href={route('orders.show', order.order_number)}
                                                                                                  className="btn btn-dark btn-sm rounded-pill px-4"
                                                                                           >
                                                                                                  View Details
                                                                                           </Link>
                                                                                    </div>
                                                                             </div>
                                                                      );
                                                               })}
                                                        </div>
                                                 </div>
                                          ))}

                                          {/* Pagination */}
                                          {orders.links && orders.links.length > 3 && (
                                                 <div className="d-flex justify-content-center mt-4">
                                                        <nav>
                                                               <ul className="pagination">
                                                                      {orders.links.map((link, i) => (
                                                                             <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                                                    <button
                                                                                           className="page-link"
                                                                                           onClick={() => link.url && router.get(link.url)}
                                                                                           dangerouslySetInnerHTML={{ __html: link.label }}
                                                                                    />
                                                                             </li>
                                                                      ))}
                                                               </ul>
                                                        </nav>
                                                 </div>
                                          )}
                                   </div>
                            )}
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .order-card {
                                   transition: all 0.3s ease;
                            }
                            .order-card:hover {
                                   box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
                                   transform: translateY(-2px);
                                   border-color: #e5e5e5 !important;
                            }
                            .transition-all {
                                   transition: all 0.3s ease;
                            }
                            .object-fit-cover {
                                   object-fit: cover;
                            }
                     `}} />
              </AppLayout>
       );
}
