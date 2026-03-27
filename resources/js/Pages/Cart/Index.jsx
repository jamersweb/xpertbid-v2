import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';
import Price from '@/Components/Price';
import { Oval } from 'react-loader-spinner';
import Swal from 'sweetalert2';

export default function Index({ cart: propCart }) {
       const { cartItems, removeFromCart, updateCartItem, getTotalPrice } = useCart();
       const [isRemoving, setIsRemoving] = useState({});
       const [isUpdating, setIsUpdating] = useState({});

       const displayItems = Array.isArray(propCart) ? propCart : (Array.isArray(cartItems) ? cartItems : []);

       const handleRemove = async (itemId) => {
              Swal.fire({
                     title: 'Are you sure?',
                     text: "You want to remove this item from cart?",
                     icon: 'warning',
                     showCancelButton: true,
                     confirmButtonColor: '#23262F',
                     cancelButtonColor: '#d33',
                     confirmButtonText: 'Yes, remove it!'
              }).then(async (result) => {
                     if (result.isConfirmed) {
                            setIsRemoving(prev => ({ ...prev, [itemId]: true }));
                            const res = await removeFromCart(itemId);
                            setIsRemoving(prev => ({ ...prev, [itemId]: false }));

                            if (!res.success) {
                                   Swal.fire('Error', res.message || 'Failed to remove item', 'error');
                            }
                     }
              });
       };

       const handleQuantityChange = async (itemId, newQty) => {
              if (newQty < 1) return;
              setIsUpdating(prev => ({ ...prev, [itemId]: true }));
              await updateCartItem(itemId, newQty);
              setIsUpdating(prev => ({ ...prev, [itemId]: false }));
       };

       const totalPrice = displayItems.reduce((total, item) => total + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

       const stripHtmlTags = (html) => {
              if (!html) return "";
              return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
       };

       return (
              <>
                     <Head>
                            <title>Shopping Cart | XpertBid</title>
                     </Head>

                     <div className="cart-page-wrapper" style={{ backgroundColor: "#F1F1F1", padding: "60px 70px", minHeight: "100vh" }}>
                            <div className="container" style={{ maxWidth: "1200px" }}>
                                   <div className="row">
                                          <div className="col-12">
                                                 <h2
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
                                                        Shopping Cart
                                                 </h2>
                                          </div>
                                   </div>

                                   {displayItems.length === 0 ? (
                                          <div className="text-center py-5">
                                                 <div className="mb-4">
                                                        <i className="fa-solid fa-cart-shopping" style={{ fontSize: "80px", color: "#606060" }}></i>
                                                 </div>
                                                 <h3 style={{ fontFamily: '"Inter", sans-serif', color: "#23262F", fontWeight: "700" }}>Your cart is empty</h3>
                                                 <p style={{ fontFamily: '"Inter", sans-serif', color: "#606060", fontSize: "16px", marginBottom: "30px" }}>
                                                        Add some products to get started!
                                                 </p>
                                                 <Link
                                                        href={route('marketplace.index')}
                                                        className="btn"
                                                        style={{
                                                               backgroundColor: "#43ACE9",
                                                               color: "#fff",
                                                               padding: "12px 24px",
                                                               borderRadius: "8px",
                                                               fontSize: "16px",
                                                               fontWeight: "600",
                                                               fontFamily: '"Inter", sans-serif',
                                                               textDecoration: "none",
                                                               display: "inline-block",
                                                        }}
                                                 >
                                                        Continue Shopping
                                                 </Link>
                                          </div>
                                   ) : (
                                          <div className="row">
                                                 <div className="col-lg-8">
                                                        <div
                                                               className="cart-items-card"
                                                               style={{
                                                                      backgroundColor: "#fff",
                                                                      borderRadius: "15px",
                                                                      padding: "25px 30px",
                                                                      boxShadow: "0 45px 90px 0 #00000026",
                                                               }}
                                                        >
                                                               {displayItems.map((item, index) => (
                                                                      <div
                                                                             key={item.id}
                                                                             className="d-flex align-items-start"
                                                                             style={{
                                                                                    minHeight: "150px",
                                                                                    paddingBottom: index < displayItems.length - 1 ? "30px" : "0",
                                                                                    marginBottom: index < displayItems.length - 1 ? "30px" : "0",
                                                                                    borderBottom: index < displayItems.length - 1 ? "1px solid #eee" : "none",
                                                                             }}
                                                                      >
                                                                             {/* Product Image */}
                                                                             <div className="me-3" style={{ width: "150px", flexShrink: 0 }}>
                                                                                    <Link href={item.slug ? route('product.show', item.slug) : '#'}>
                                                                                           <div
                                                                                                  style={{
                                                                                                         width: "100%",
                                                                                                         height: "150px",
                                                                                                         position: "relative",
                                                                                                         overflow: "hidden",
                                                                                                         borderRadius: "12px",
                                                                                                         backgroundColor: "#f8f9fa",
                                                                                                  }}
                                                                                           >
                                                                                                  <img
                                                                                                         src={item.image ? (item.image.startsWith('http') ? item.image : `https://admin.xpertbid.com/${item.image}`) : '/assets/images/placeholder.png'}
                                                                                                         alt={item.title}
                                                                                                         style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "6px" }}
                                                                                                         onError={(e) => e.target.src = '/assets/images/WebsiteBanner2.png'}
                                                                                                  />
                                                                                           </div>
                                                                                    </Link>
                                                                             </div>

                                                                             {/* Product Details */}
                                                                             <div className="flex-grow-1">
                                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                                           <div style={{ flex: 1, marginRight: "15px" }}>
                                                                                                  <h5
                                                                                                         className="mb-1"
                                                                                                         style={{
                                                                                                                fontFamily: '"Inter", sans-serif',
                                                                                                                fontSize: "18px",
                                                                                                                fontWeight: "700",
                                                                                                                color: "#23262F",
                                                                                                                marginBottom: "8px",
                                                                                                         }}
                                                                                                  >
                                                                                                         <Link
                                                                                                                href={item.slug ? route('product.show', item.slug) : '#'}
                                                                                                                style={{ textDecoration: "none", color: "inherit" }}
                                                                                                         >
                                                                                                                {item.title}
                                                                                                         </Link>
                                                                                                  </h5>
                                                                                                  <p
                                                                                                         style={{
                                                                                                                fontFamily: '"Inter", sans-serif',
                                                                                                                fontSize: "14px",
                                                                                                                color: "#606060",
                                                                                                                lineHeight: "20px",
                                                                                                                marginBottom: "12px",
                                                                                                         }}
                                                                                                  >
                                                                                                         {item.description ? stripHtmlTags(item.description).substring(0, 120) + '...' : ''}
                                                                                                  </p>
                                                                                                  {item.variation_name && (
                                                                                                         <span className="badge bg-light text-dark border mb-2">
                                                                                                                {item.variation_name}
                                                                                                         </span>
                                                                                                  )}
                                                                                           </div>
                                                                                           <button
                                                                                                  onClick={() => handleRemove(item.id)}
                                                                                                  disabled={isRemoving[item.id]}
                                                                                                  style={{
                                                                                                         background: "none",
                                                                                                         border: "none",
                                                                                                         color: "#E94343",
                                                                                                         cursor: isRemoving[item.id] ? "not-allowed" : "pointer",
                                                                                                         padding: "8px",
                                                                                                         fontSize: "18px",
                                                                                                         opacity: isRemoving[item.id] ? 0.6 : 1,
                                                                                                  }}
                                                                                           >
                                                                                                  {isRemoving[item.id] ? (
                                                                                                         <Oval height={16} width={16} color="#E94343" />
                                                                                                  ) : (
                                                                                                         <i className="fa-solid fa-trash"></i>
                                                                                                  )}
                                                                                           </button>
                                                                                    </div>

                                                                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                                                                           <div>
                                                                                                  <Price
                                                                                                         amountAED={parseFloat(item.price) || 0}
                                                                                                         className="fw-bold"
                                                                                                  />
                                                                                           </div>
                                                                                           <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1">
                                                                                                  <button onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} className="btn btn-sm border-0"><i className="fa-solid fa-minus" style={{ fontSize: '10px' }}></i></button>
                                                                                                  <span className="mx-2 fw-bold small">{item.quantity || 1}</span>
                                                                                                  <button onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)} className="btn btn-sm border-0"><i className="fa-solid fa-plus" style={{ fontSize: '10px' }}></i></button>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>

                                                 {/* Order Summary */}
                                                 <div className="col-lg-4">
                                                        <div
                                                               className="order-summary-card"
                                                               style={{
                                                                      backgroundColor: "#fff",
                                                                      borderRadius: "15px",
                                                                      padding: "0",
                                                                      boxShadow: "0 45px 90px 0 #00000026",
                                                                      position: "sticky",
                                                                      top: "20px",
                                                               }}
                                                        >
                                                               <div
                                                                      style={{
                                                                             padding: "25px 30px",
                                                                             borderBottom: "1px solid #eee",
                                                                      }}
                                                               >
                                                                      <h5
                                                                             className="mb-0"
                                                                             style={{
                                                                                    fontFamily: '"Inter", sans-serif',
                                                                                    fontSize: "22px",
                                                                                    fontWeight: "700",
                                                                                    color: "#23262F",
                                                                             }}
                                                                      >
                                                                             Order Summary
                                                                      </h5>
                                                               </div>
                                                               <div style={{ padding: "25px 30px" }}>
                                                                      <div className="d-flex justify-content-between mb-3">
                                                                             <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>
                                                                                    Subtotal:
                                                                             </span>
                                                                             <Price
                                                                                    amountAED={totalPrice}
                                                                                    className="fw-semibold"
                                                                             />
                                                                      </div>
                                                                      <div className="d-flex justify-content-between mb-3">
                                                                             <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>
                                                                                    Shipping:
                                                                             </span>
                                                                             <span style={{ fontFamily: '"Inter", sans-serif', fontSize: "16px", color: "#606060" }}>
                                                                                    FREE
                                                                             </span>
                                                                      </div>
                                                                      <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
                                                                     <div className="d-flex justify-content-between mb-4">
                                                                            <strong style={{ fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }}>
                                                                                   Total:
                                                                            </strong>
                                                                            <strong style={{ fontFamily: '"Inter", sans-serif', fontSize: "18px", fontWeight: "700", color: "#23262F" }}>
                                                                                    <Price
                                                                                           amountAED={totalPrice}
                                                                                           className="fw-bold"
                                                                                    />
                                                                             </strong>
                                                                      </div>
                                                                      <Link
                                                                             href={route('checkout.index')}
                                                                             style={{
                                                                                    display: "block",
                                                                                    textAlign: "center",
                                                                                    width: "100%",
                                                                                    padding: "14px",
                                                                                    fontSize: "16px",
                                                                                    fontWeight: "600",
                                                                                    fontFamily: '"Inter", sans-serif',
                                                                                    backgroundColor: "#43ACE9",
                                                                                    color: "#fff",
                                                                                    border: "none",
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "15px",
                                                                                    cursor: "pointer",
                                                                                    textDecoration: "none",
                                                                                    transition: "background-color 0.3s ease",
                                                                             }}
                                                                             onMouseEnter={(e) => (e.target.style.backgroundColor = "#35a0d8")}
                                                                             onMouseLeave={(e) => (e.target.style.backgroundColor = "#43ACE9")}
                                                                      >
                                                                             Proceed to Checkout
                                                                      </Link>
                                                                     <Link
                                                                            href={route('marketplace.index')}
                                                                            style={{
                                                                                   display: "block",
                                                                                   textAlign: "center",
                                                                                   padding: "14px",
                                                                                   fontSize: "16px",
                                                                                   fontWeight: "600",
                                                                                   fontFamily: '"Inter", sans-serif',
                                                                                   backgroundColor: "#23262F",
                                                                                   color: "#fff",
                                                                                   border: "1px solid #23262F",
                                                                                   borderRadius: "8px",
                                                                                   textDecoration: "none",
                                                                                   transition: "all 0.3s ease",
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                   e.target.style.backgroundColor = "#151922";
                                                                                   e.target.style.color = "#fff";
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                   e.target.style.backgroundColor = "#23262F";
                                                                                   e.target.style.color = "#fff";
                                                                            }}
                                                                     >
                                                                             Continue Shopping
                                                                     </Link>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   )}
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
               .object-fit-cover { object-fit: cover; }
               .cart-page-wrapper .fw-bold,
               .cart-page-wrapper .fw-semibold {
                   color: #23262F !important;
               }
               @media (max-width: 991px) {
                   .cart-page-wrapper {
                       padding: 40px 20px !important;
                   }
               }
           `}} />
              </>
       );
}

Index.layout = page => <AppLayout title="Shopping Cart" children={page} />;
