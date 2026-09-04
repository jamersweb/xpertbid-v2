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
                                   <span
                                          className="cart-badge position-absolute badge rounded-pill"
                                          style={{
                                                 backgroundColor: "#43ACE9",
                                                 fontSize: "10px",
                                                 padding: "4px 6px",
                                                 top: "1px",
                                                 right: "-2px",
                                                 transform: "none",
                                          }}
                                   >
                                          {displayItems.length}
                                   </span>
                            )}
                     </button>

                     {/* Cart Popup */}
                     {isOpen && (
                            <div className="cart-popup-container">
                                   <div className="cart-popup-content shadow-lg border-0">
                                          <div className="d-flex justify-content-between align-items-center cart-popup-header">
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
                                                               className="btn btn-dark px-4 py-2 small fw-bold"
                                                               onClick={() => setIsOpen(false)}
                                                               style={{ backgroundColor: '#23262F', borderRadius: '12px' }}
                                                        >
                                                               Browse Products
                                                        </Link>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div className="cart-items-scroll pe-2" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                                               {displayItems.map((item) => (
                                                                      <div key={item.id} className="cart-popup-item d-flex gap-3 mb-3 last-child-mb-0">
                                                                             <div className="flex-shrink-0 cart-popup-item-image">
                                                                                    <img
                                                                                           src={item.image ? (item.image.startsWith('http') ? item.image : `/${item.image.replace(/^\/+/, '')}`) : '/assets/images/placeholder.png'}
                                                                                           alt={item.title}
                                                                                           className="w-100 h-100 object-fit-cover"
                                                                                           onError={(e) => e.target.src = '/assets/images/WebsiteBanner2.png'}
                                                                                    />
                                                                             </div>
                                                                             <div className="cart-popup-item-details flex-grow-1 min-width-0">
                                                                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                                                           <h6 className="mb-0 fw-bold cart-popup-item-title">{item.title}</h6>
                                                                                           <button 
                                                                                                  onClick={() => handleRemoveItem(item.id)} 
                                                                                                  disabled={updating[item.id]}
                                                                                                  className="btn btn-link text-danger p-0 border-0 shadow-none cart-popup-remove-btn"
                                                                                           >
                                                                                                  {updating[item.id] ? <Oval height={14} width={14} color="#dc3545" /> : <i className="fa-solid fa-trash-can small"></i>}
                                                                                           </button>
                                                                                    </div>
                                                                                    <div className={`cart-popup-item-meta ${item.variation_name ? '' : 'is-compact'}`}>
                                                                                           {item.variation_name && (
                                                                                                  <p className="small text-muted mb-0 cart-popup-item-variation">{item.variation_name}</p>
                                                                                           )}
                                                                                             <span className="fw-bold text-dark cart-popup-item-price me-auto"><Price amountAED={item.price} /></span>
                                                                                           <span className="small text-muted cart-popup-item-qty">Qty: {item.quantity || 1}</span>
                                                                                    </div>
                                                                                  
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>

                                                        <div className="cart-popup-footer">
                                                               <div className="d-flex justify-content-between align-items-center mb-3">
                                                                      <span className="text-muted fw-medium">Subtotal</span>
                                                                      <span className="fw-bold fs-5" style={{ color: '#43ACE9' }}><Price amountAED={totalAmount} /></span>
                                                               </div>
                                                               <div className="d-grid gap-2">
                                                                      <Link
                                                                             href={route('cart.index')}
                                                                             onClick={() => setIsOpen(false)}
                                                                             className="btn cart-popup-action-btn cart-popup-action-btn--dark fw-bold small"
                                                                      >
                                                                             View Cart
                                                                      </Link>
                                                                      <Link
                                                                             href={route('checkout.index')}
                                                                             onClick={() => setIsOpen(false)}
                                                                             className="btn cart-popup-action-btn cart-popup-action-btn--blue fw-bold shadow-sm"
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
                                   padding: 22px;
                                   border-radius: 20px;
                                   animation: popupFadeIn 0.3s ease-out;
                             }
                             .cart-popup-header {
                                   margin-bottom: 18px;
                                   padding-bottom: 14px;
                                   border-bottom: 1px solid #eceff3;
                             }
                             .cart-popup-item {
                                   padding: 12px 0;
                                   border-bottom: 1px solid #f3f4f6;
                             }
                             .cart-popup-item-image {
                                   width: 74px;
                                   height: 74px;
                                   border-radius: 14px;
                                   overflow: hidden;
                                   border: 1px solid #f0f0f0;
                                   background: #f8fafc;
                             }
                             .cart-popup-item-details {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr);
                                   align-content: start;
                                   min-width: 0;
                             }
                             .cart-popup-item-title {
                                   font-size: 16px;
                                   line-height: 1.35;
                                   color: #23262F;
                                   white-space: normal;
                                   word-break: break-word;
                                   padding-right: 8px;
                             }
                             .cart-popup-item-meta {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 12px;
                                   margin-bottom: 8px;
                             }
                             .cart-popup-item-meta.is-compact {
                                   justify-content: flex-end;
                                   margin-bottom: 4px;
                              }
                             .cart-popup-item-variation {
                                   flex: 1;
                                   text-align: left;
                             }
                             .cart-popup-item-bottom {
                                   display: flex;
                                   align-items: center;
                                   justify-content: flex-start;
                             }
                             .cart-popup-item-price {
                                   font-size: 15px;
                             }
                             .cart-popup-item-qty {
                                   min-width: fit-content;
                                   white-space: nowrap;
                                   text-align: right;
                             }
                             .cart-popup-remove-btn {
                                   min-width: 18px;
                                   flex-shrink: 0;
                                   margin-top: 2px;
                             }
                             .cart-popup-footer {
                                   margin-top: 18px;
                                   padding-top: 18px;
                                   border-top: 1px solid #eceff3;
                             }
                             .cart-popup-action-btn {
                                   min-height: 48px;
                                   border-radius: 12px;
                                   font-size: 15px;
                                   padding: 10px 16px;
                                   border: none;
                             }
                             .cart-popup-action-btn--dark {
                                   background: #23262F;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--dark:hover {
                                   background: #151922;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue {
                                   background: #43ACE9;
                                   color: #fff;
                             }
                             .cart-popup-action-btn--blue:hover {
                                   background: #2f9cdb;
                                   color: #fff;
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
                                          top: 74px;
                                          left: 50%;
                                          transform: translateX(-50%);
                                          width: 95%;
                                   }
                                   .cart-popup-content {
                                          padding: 18px;
                                          border-radius: 18px;
                                   }
                                   .cart-popup-item-title {
                                          font-size: 15px;
                                    }
                                   .cart-popup-item-meta {
                                          align-items: flex-start;
                                   }
                                   .cart-popup-action-btn {
                                          min-height: 44px;
                                          border-radius: 10px;
                                          font-size: 14px;
                                   }
                             }
                      `}} />
              </div>
       );
}
