import { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useCart } from '@/Contexts/CartContext';
import Price from '@/Components/Price';
// import { Oval } from 'react-loader-spinner'; // Replaced with simple spinner for now to avoid dep issues
import Swal from 'sweetalert2';

export default function CartPopup() {
       const { cartItems, loading, getTotalPrice, removeFromCart } = useCart();
       const [isOpen, setIsOpen] = useState(false);
       const [updating, setUpdating] = useState({});
       const popupRef = useRef(null);

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

       const Spinner = () => (
              <div className="spinner-border spinner-border-sm text-danger" role="status">
                     <span className="visually-hidden">Loading...</span>
              </div>
       );

       return (
              <div className="position-relative" ref={popupRef}>
                     {/* Cart Icon Button */}
                     <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="cart-icon-btn position-relative"
                            style={{
                                   background: 'none',
                                   border: 'none',
                                   cursor: 'pointer',
                                   marginLeft: '3px',
                            }}
                     >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                   <circle cx="9" cy="21" r="1"></circle>
                                   <circle cx="20" cy="21" r="1"></circle>
                                   <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartItems.length > 0 && (
                                   <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                          {cartItems.length}
                                          <span className="visually-hidden">cart items</span>
                                   </span>
                            )}
                     </button>

                     {/* Cart Popup */}
                     {isOpen && (
                            <div className="cart-popup-container">
                                   <div className="cart-popup-content">
                                          <div className="mb-3">
                                                 <h5 className="mb-0" style={{ fontWeight: '600', textAlign: 'left', color: '#000' }}>
                                                        Shopping Cart
                                                 </h5>
                                          </div>

                                          {loading ? (
                                                 <div className="text-center py-4">
                                                        <div className="spinner-border text-primary" role="status">
                                                               <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                 </div>
                                          ) : cartItems.length === 0 ? (
                                                 <div className="text-center py-5">
                                                        <div style={{ marginBottom: '15px' }}>
                                                               <i className="fa-solid fa-cart-shopping" style={{ fontSize: '48px', color: '#606060' }}></i>
                                                        </div>
                                                        <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                                                               Your Cart is empty
                                                        </p>
                                                        <Link
                                                               href="/auctions" /* Adjusted link */
                                                               className="btn mt-3"
                                                               onClick={() => setIsOpen(false)}
                                                               style={{
                                                                      fontSize: '14px',
                                                                      padding: '8px 20px',
                                                                      backgroundColor: '#23262F',
                                                                      color: '#fff',
                                                                      border: 'none',
                                                                      borderRadius: '4px',
                                                                      textDecoration: 'none',
                                                                      display: 'inline-block',
                                                                      transition: 'background-color 0.3s ease',
                                                               }}
                                                               onMouseEnter={(e) => (e.target.style.backgroundColor = '#1a1d23')}
                                                               onMouseLeave={(e) => (e.target.style.backgroundColor = '#23262F')}
                                                        >
                                                               Continue Shopping
                                                        </Link>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                               {cartItems.map((item) => {
                                                                      let imageUrl = item.image || "";
                                                                      if (imageUrl) {
                                                                             // Simple cleanup if needed
                                                                             imageUrl = imageUrl.replace(/^\/+/, '');
                                                                             if (!imageUrl.startsWith('http')) imageUrl = '/' + imageUrl;
                                                                      }

                                                                      return (
                                                                             <div
                                                                                    key={item.id}
                                                                                    className="d-flex align-items-start mb-3 pb-3"
                                                                                    style={{ borderBottom: '1px solid #eee', justifyContent: 'flex-start' }}
                                                                             >
                                                                                    <div
                                                                                           style={{
                                                                                                  width: '70px',
                                                                                                  height: '70px',
                                                                                                  flexShrink: 0,
                                                                                                  borderRadius: '6px',
                                                                                                  overflow: 'hidden',
                                                                                                  backgroundColor: '#f8f9fa',
                                                                                                  marginRight: '12px',
                                                                                                  position: 'relative',
                                                                                           }}
                                                                                    >
                                                                                           {imageUrl ? (
                                                                                                  <img
                                                                                                         src={imageUrl}
                                                                                                         alt={item.title || 'Product'}
                                                                                                         style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '6px' }}
                                                                                                  />
                                                                                           ) : (
                                                                                                  <div
                                                                                                         style={{
                                                                                                                width: '100%',
                                                                                                                height: '100%',
                                                                                                                display: 'flex',
                                                                                                                alignItems: 'center',
                                                                                                                justifyContent: 'center',
                                                                                                                color: '#ccc',
                                                                                                                border: '1px solid #eee'
                                                                                                         }}
                                                                                                  >
                                                                                                         <i className="fa-solid fa-image"></i>
                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                                    <div className="flex-grow-1" style={{ minWidth: 0, textAlign: 'left' }}>
                                                                                           <div className="d-flex justify-content-between align-items-start mb-1">
                                                                                                  <h6
                                                                                                         className="mb-1 flex-grow-1"
                                                                                                         style={{
                                                                                                                fontSize: '14px',
                                                                                                                fontWeight: '500',
                                                                                                                overflow: 'hidden',
                                                                                                                textOverflow: 'ellipsis',
                                                                                                                whiteSpace: 'nowrap',
                                                                                                                textAlign: 'left',
                                                                                                                marginRight: '8px',
                                                                                                         }}
                                                                                                  >
                                                                                                         {item.title}
                                                                                                  </h6>
                                                                                                  <button
                                                                                                         onClick={() => handleRemoveItem(item.id)}
                                                                                                         disabled={updating[item.id]}
                                                                                                         style={{
                                                                                                                background: "none",
                                                                                                                border: "none",
                                                                                                                color: "#E94343",
                                                                                                                cursor: updating[item.id] ? "not-allowed" : "pointer",
                                                                                                                padding: "4px 8px",
                                                                                                                fontSize: "14px",
                                                                                                                opacity: updating[item.id] ? 0.6 : 1,
                                                                                                                flexShrink: 0,
                                                                                                         }}
                                                                                                  >
                                                                                                         {updating[item.id] ? (
                                                                                                                <Spinner />
                                                                                                         ) : (
                                                                                                                <i className="fa-solid fa-trash"></i>
                                                                                                         )}
                                                                                                  </button>
                                                                                           </div>
                                                                                           <p className="mb-0" style={{ fontSize: '14px', fontWeight: '600', textAlign: 'left' }}>
                                                                                                  <Price amountAED={parseFloat(item.price) || 0} />
                                                                                           </p>
                                                                                    </div>
                                                                             </div>
                                                                      );
                                                               })}
                                                        </div>

                                                        <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', marginTop: '15px' }}>
                                                               <div className="d-flex justify-content-between align-items-center mb-3">
                                                                      <span style={{ fontSize: '16px', fontWeight: '600' }}>Total:</span>
                                                                      <span style={{ fontSize: '18px', fontWeight: '700' }}>
                                                                             <Price amountAED={cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)} />
                                                                      </span>
                                                               </div>
                                                               <Link
                                                                      href={route('cart.index')}
                                                                      className="btn w-100 mb-2"
                                                                      onClick={() => setIsOpen(false)}
                                                                      style={{
                                                                             fontSize: '14px',
                                                                             padding: '10px',
                                                                             backgroundColor: '#23262F',
                                                                             color: '#fff',
                                                                             border: 'none',
                                                                             borderRadius: '0.25rem',
                                                                             textDecoration: 'none',
                                                                             display: 'block',
                                                                             textAlign: 'center',
                                                                             transition: 'background-color 0.3s ease',
                                                                      }}
                                                                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#1a1d23')}
                                                                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#23262F')}
                                                               >
                                                                      View Cart
                                                               </Link>
                                                               <Link
                                                                      href={route('checkout.index')}
                                                                      className="btn w-100"
                                                                      onClick={() => setIsOpen(false)}
                                                                      style={{
                                                                             fontSize: '14px',
                                                                             padding: '10px',
                                                                             backgroundColor: '#43ACE9',
                                                                             color: '#fff',
                                                                             border: 'none',
                                                                             borderRadius: '0.25rem',
                                                                             textDecoration: 'none',
                                                                             display: 'block',
                                                                             textAlign: 'center',
                                                                             transition: 'background-color 0.3s ease',
                                                                             width: '100%'
                                                                      }}
                                                                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#35a0d8')}
                                                                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#43ACE9')}
                                                               >
                                                                      Checkout
                                                               </Link>
                                                        </div>
                                                 </>
                                          )}
                                   </div>
                            </div>
                     )}

                     <style>{`
        .cart-popup-container {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 10px;
            width: 380px;
            max-width: 90vw;
            z-index: 1000;
        }

        .cart-popup-content {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile specific styles */
        @media (max-width: 576px) {
            .cart-popup-container {
                position: fixed;
                top: 70px; /* Adjust based on your header height */
                left: 50%;
                transform: translateX(-50%);
                right: auto;
                width: 95%;
                max-width: 95%;
                margin-top: 0;
            }
        }
      `}</style>
              </div>
       );
}
