import { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useCart } from '@/Contexts/CartContext';
import Price from '@/Components/Price';
import { Oval } from 'react-loader-spinner';
import Swal from 'sweetalert2';

export default function CartPopup() {
       const { cartItems, loading, getTotalPrice, removeFromCart } = useCart();
       const [isOpen, setIsOpen] = useState(false);
       const [updating, setUpdating] = useState({});
       const popupRef = useRef(null);

       const displayItems = Array.isArray(cartItems) ? cartItems : [];

       // Close popup when clicking outside
       useEffect(() => {
              const handleClickOutside = (event) => {
                     if (popupRef.current && !popupRef.current.contains(event.target)) {
                            setIsOpen(false);
                     }
              };

              if (isOpen) {
                     document.addEventListener('mousedown', handleClickOutside);
                     return () => document.removeEventListener('mousedown', handleClickOutside);
              }
       }, [isOpen]);

       const handleRemoveItem = async (cartItemId) => {
              setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
              const response = await removeFromCart(cartItemId);
              setUpdating((prev) => ({ ...prev, [cartItemId]: false }));

              if (!response.success) {
                     Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: response.message || "Failed to remove item",
                     });
              }
       };

       const totalAmount = displayItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);

       return (
              <div className="position-relative" ref={popupRef}>
                     {/* Cart Icon Button */}
                     <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="cart-icon-btn position-relative d-flex align-items-center justify-content-center p-2"
                            style={{
                                   background: 'none',
                                   border: 'none',
                                   cursor: 'pointer',
                                   transition: 'transform 0.2s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                     >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                   <circle cx="9" cy="21" r="1"></circle>
                                   <circle cx="20" cy="21" r="1"></circle>
                                   <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {displayItems.length > 0 && (
                                   <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: "#43ACE9", fontSize: "10px", padding: "4px 6px" }}>
                                          {displayItems.length}
                                   </span>
                            )}
                     </button>

                     {/* Cart Popup */}
                     {isOpen && (
                            <div className="cart-popup-container">
                                   <div className="cart-popup-content shadow-lg border-0 rounded-4">
                                          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                                 <h5 className="mb-0 fw-bold" style={{ color: '#23262F', fontFamily: '"Inter", sans-serif' }}>
                                                        Shopping Cart
                                                 </h5>
                                                 <button onClick={() => setIsOpen(false)} className="btn-close btn-sm shadow-none"></button>
                                          </div>

                                          {loading ? (
                                                 <div className="text-center py-5">
                                                        <Oval height={40} width={40} color="#43ACE9" />
                                                 </div>
                                          ) : displayItems.length === 0 ? (
                                                 <div className="text-center py-5">
                                                        <div className="mb-3 opacity-25">
                                                               <i className="fa-solid fa-cart-shopping fa-4x text-muted"></i>
                                                        </div>
                                                        <p className="text-muted fw-medium mb-4">Your Cart is empty</p>
                                                        <Link
                                                               href={route('marketplace.index')}
                                                               className="btn btn-dark rounded-pill px-4 py-2 small fw-bold"
                                                               onClick={() => setIsOpen(false)}
                                                               style={{ backgroundColor: '#23262F' }}
                                                        >
                                                               Browse Products
                                                        </Link>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div className="cart-items-scroll pe-2" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                                               {displayItems.map((item) => (
                                                                      <div key={item.id} className="d-flex gap-3 mb-4 last-child-mb-0">
                                                                             <div className="flex-shrink-0" style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                                                                    <img
                                                                                           src={item.image ? (item.image.startsWith('http') ? item.image : `https://admin.xpertbid.com/${item.image}`) : '/assets/images/placeholder.png'}
                                                                                           alt={item.title}
                                                                                           className="w-100 h-100 object-fit-cover"
                                                                                           onError={(e) => e.target.src = '/assets/images/WebsiteBanner2.png'}
                                                                                    />
                                                                             </div>
                                                                             <div className="flex-grow-1 min-width-0">
                                                                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                                                                           <h6 className="mb-0 fw-bold text-truncate" style={{ fontSize: '14px', color: '#23262F' }}>{item.title}</h6>
                                                                                           <button 
                                                                                                  onClick={() => handleRemoveItem(item.id)} 
                                                                                                  disabled={updating[item.id]}
                                                                                                  className="btn btn-link text-danger p-0 border-0 shadow-none"
                                                                                           >
                                                                                                  {updating[item.id] ? <Oval height={14} width={14} color="#dc3545" /> : <i className="fa-solid fa-trash-can small"></i>}
                                                                                           </button>
                                                                                    </div>
                                                                                    <p className="small text-muted mb-1">{item.variation_name || 'Standard'}</p>
                                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                                           <span className="fw-bold text-dark"><Price amountAED={item.price} /></span>
                                                                                           <span className="small text-muted">Qty: {item.quantity || 1}</span>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>

                                                        <div className="mt-4 pt-3 border-top">
                                                               <div className="d-flex justify-content-between align-items-center mb-4">
                                                                      <span className="text-muted fw-medium">Subtotal</span>
                                                                      <span className="fw-bold fs-5" style={{ color: '#43ACE9' }}><Price amountAED={totalAmount} /></span>
                                                               </div>
                                                               <div className="d-grid gap-2">
                                                                      <Link
                                                                             href={route('cart.index')}
                                                                             onClick={() => setIsOpen(false)}
                                                                             className="btn btn-outline-dark rounded-pill py-2 fw-bold small border-2"
                                                                      >
                                                                             View Cart
                                                                      </Link>
                                                                      <Link
                                                                             href={route('checkout.index')}
                                                                             onClick={() => setIsOpen(false)}
                                                                             className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm"
                                                                             style={{ backgroundColor: '#23262F', border: 'none' }}
                                                                      >
                                                                             Checkout
                                                                      </Link>
                                                               </div>
                                                        </div>
                                                 </>
                                          )}
                                   </div>
                            </div>
                     )}

                     <style dangerouslySetInnerHTML={{ __html: `
                            .cart-popup-container {
                                   position: absolute;
                                   top: 100%;
                                   right: 0;
                                   margin-top: 15px;
                                   width: 380px;
                                   max-width: 90vw;
                                   z-index: 1050;
                             }
                             .cart-popup-content {
                                   background-color: #fff;
                                   padding: 25px;
                                   animation: popupFadeIn 0.3s ease-out;
                             }
                             .cart-items-scroll::-webkit-scrollbar { width: 4px; }
                             .cart-items-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
                             .cart-items-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
                             .last-child-mb-0:last-child { margin-bottom: 0 !important; }
                             @keyframes popupFadeIn {
                                   from { opacity: 0; transform: translateY(-10px); }
                                   to { opacity: 1; transform: translateY(0); }
                             }
                             @media (max-width: 576px) {
                                   .cart-popup-container {
                                          position: fixed;
                                          top: 80px;
                                          left: 50%;
                                          transform: translateX(-50%);
                                          width: 95%;
                                   }
                             }
                      `}} />
              </div>
       );
}
