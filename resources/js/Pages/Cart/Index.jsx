import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/Contexts/CartContext';
import Price from '@/Components/Price';
import { Oval } from 'react-loader-spinner';
import Swal from 'sweetalert2';

export default function Index({ cart: propCart }) {
       const { cartItems, removeFromCart, getTotalPrice } = useCart();
       const [isRemoving, setIsRemoving] = useState({});

       // Use items from prop (server-side) or context (client-side/guest)
       // For this page, since it's an Inertia page, propCart will have auth items.
       // If not auth, context's cartItems will have guest items.
       const displayItems = propCart || cartItems;

       const handleRemove = async (itemId) => {
              setIsRemoving(prev => ({ ...prev, [itemId]: true }));
              const result = await removeFromCart(itemId);
              setIsRemoving(prev => ({ ...prev, [itemId]: false }));

              if (!result.success) {
                     Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: result.message || 'Failed to remove item',
                     });
              }
       };

       const totalPrice = displayItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);

       const stripHtmlTags = (html) => {
              if (!html) return "";
              return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
       };

       return (
              <AppLayout title="Shopping Cart">
                     <Head>
                            <title>Shopping Cart | XpertBid</title>
                     </Head>

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="mb-5">
                                          <h1 className="fw-bolder display-5 text-dark">Shopping Cart</h1>
                                          <p className="text-muted">Review your items before proceeding to checkout.</p>
                                   </div>

                                   {displayItems.length === 0 ? (
                                          <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                                                 <div className="mb-4 opacity-25">
                                                        <i className="fa-solid fa-cart-shopping fa-5x"></i>
                                                 </div>
                                                 <h3 className="fw-bold h4">Your cart is empty</h3>
                                                 <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                                                 <Link href={route('marketplace.index')} className="btn btn-primary rounded-pill px-5 py-2 fw-bold">
                                                        Browse Marketplace
                                                 </Link>
                                          </div>
                                   ) : (
                                          <div className="row g-4">
                                                 {/* Items List */}
                                                 <div className="col-lg-8">
                                                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                                               <div className="card-body p-0">
                                                                      {displayItems.map((item, index) => (
                                                                             <div key={item.id} className={`p-4 d-flex align-items-center ${index < displayItems.length - 1 ? 'border-bottom' : ''}`}>
                                                                                    <div className="flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                                                                                           <Link href={item.slug ? route('product.show', item.slug) : '#'}>
                                                                                                  <img
                                                                                                         src={item.image ? (item.image.startsWith('http') ? item.image : `https://admin.xpertbid.com/${item.image}`) : '/assets/images/placeholder.png'}
                                                                                                         className="w-100 h-100 object-fit-cover rounded-3 border"
                                                                                                         alt={item.title}
                                                                                                         onError={(e) => e.target.src = '/assets/images/WebsiteBanner2.png'}
                                                                                                  />
                                                                                           </Link>
                                                                                    </div>

                                                                                    <div className="ms-4 flex-grow-1">
                                                                                           <div className="d-flex justify-content-between align-items-start">
                                                                                                  <div>
                                                                                                         <Link href={item.slug ? route('product.show', item.slug) : '#'} className="text-decoration-none text-dark">
                                                                                                                <h5 className="fw-bold mb-1">{item.title}</h5>
                                                                                                         </Link>
                                                                                                         {item.variation_name && (
                                                                                                                <span className="badge bg-light text-dark border mb-2">
                                                                                                                       {item.variation_name}
                                                                                                                </span>
                                                                                                         )}
                                                                                                         <div className="text-muted small mb-0 d-none d-md-block" style={{ maxWidth: '400px' }}>
                                                                                                                {item.description ? stripHtmlTags(item.description).substring(0, 100) + '...' : ''}
                                                                                                         </div>
                                                                                                  </div>
                                                                                                  <button
                                                                                                         onClick={() => handleRemove(item.id)}
                                                                                                         disabled={isRemoving[item.id]}
                                                                                                         className="btn btn-outline-danger btn-sm rounded-circle border-0 p-2"
                                                                                                         style={{ width: '36px', height: '36px' }}
                                                                                                  >
                                                                                                         {isRemoving[item.id] ? (
                                                                                                                <Oval height={18} width={18} color="#dc3545" />
                                                                                                         ) : (
                                                                                                                <i className="fa-solid fa-trash-can"></i>
                                                                                                         )}
                                                                                                  </button>
                                                                                           </div>

                                                                                           <div className="d-flex justify-content-between align-items-center mt-3">
                                                                                                  <div className="fw-bold text-primary fs-5">
                                                                                                         <Price amountAED={item.price} />
                                                                                                  </div>
                                                                                                  <div className="text-muted small">
                                                                                                         Qty: {item.quantity || 1}
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      ))}
                                                               </div>
                                                        </div>
                                                 </div>

                                                 {/* Order Summary */}
                                                 <div className="col-lg-4">
                                                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '2rem' }}>
                                                               <div className="card-body p-4">
                                                                      <h4 className="fw-bold mb-4">Order Summary</h4>

                                                                      <div className="d-flex justify-content-between mb-3 text-muted">
                                                                             <span>Subtotal</span>
                                                                             <Price amountAED={totalPrice} />
                                                                      </div>
                                                                      <div className="d-flex justify-content-between mb-3 text-muted">
                                                                             <span>Shipping</span>
                                                                             <span className="text-success small fw-bold">Calculated at checkout</span>
                                                                      </div>
                                                                      <div className="d-flex justify-content-between mb-3 text-muted">
                                                                             <span>Tax</span>
                                                                             <span className="text-success small fw-bold">Calculated at checkout</span>
                                                                      </div>

                                                                      <hr className="my-4" />

                                                                      <div className="d-flex justify-content-between mb-4 align-items-center">
                                                                             <span className="fw-bold fs-5">Total Payment</span>
                                                                             <span className="fw-bold fs-4 text-dark">
                                                                                    <Price amountAED={totalPrice} />
                                                                             </span>
                                                                      </div>

                                                                      <Link
                                                                             href={route('checkout.index')}
                                                                             className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm mb-3"
                                                                      >
                                                                             Checkout Now <i className="fa-solid fa-credit-card ms-2"></i>
                                                                      </Link>

                                                                      <Link
                                                                             href={route('marketplace.index')}
                                                                             className="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold border-0 small"
                                                                      >
                                                                             Continue Shopping
                                                                      </Link>
                                                               </div>
                                                               <div className="card-footer bg-light border-0 p-4 text-center">
                                                                      <p className="small text-muted mb-3 italic">Secure Payment Methods</p>
                                                                      <div className="d-flex justify-content-center gap-3 opacity-50">
                                                                             <i className="fa-brands fa-cc-visa fa-2x"></i>
                                                                             <i className="fa-brands fa-cc-mastercard fa-2x"></i>
                                                                             <i className="fa-brands fa-cc-stripe fa-2x"></i>
                                                                             <i className="fa-solid fa-building-columns fa-2x"></i>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   )}
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .object-fit-cover {
                    object-fit: cover;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}} />
              </AppLayout>
       );
}
