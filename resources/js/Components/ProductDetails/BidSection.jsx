import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage, router } from '@inertiajs/react';
import Price from '@/Components/Price';
import { useCart } from '@/Contexts/CartContext';

export default function BidSection({ product, highestBidProp, onBidPlaced, winnerDetails, isFavoriteProp }) {
       const { auth, flash } = usePage().props;
       const { addToCart } = useCart();
       const [bidAmount, setBidAmount] = useState('');
       const [isPlacingBid, setIsPlacingBid] = useState(false);
       const [isAddingToCart, setIsAddingToCart] = useState(false);
       const [highestBid, setHighestBid] = useState(highestBidProp || 0);
       const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
       const [showConfirm, setShowConfirm] = useState(false);
       const [isFavorite, setIsFavorite] = useState(isFavoriteProp || false);
       const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

       const normalizedListType = String(product?.list_type || product?.listing_type || '').toLowerCase();
       const isDirectSale = normalizedListType === 'normal' || normalizedListType === 'normal_list' || normalizedListType === 'business' || normalizedListType === 'business_list';
       const baseSalePrice = Number(product.buy_now_price || product.minimum_bid || 0);
       const discountValue = Number(product.discount_value || 0);
       const hasDiscount = isDirectSale && discountValue > 0;
       const finalSalePrice = (() => {
              if (!hasDiscount) return baseSalePrice;
              if (product.discount_type === 'percent') {
                     return Math.max(0, baseSalePrice - (baseSalePrice * (discountValue / 100)));
              }
              if (product.discount_type === 'flat') {
                     return Math.max(0, baseSalePrice - discountValue);
              }
              return baseSalePrice;
       })();

       useEffect(() => {
              if (flash?.success) {
                     showNotification(flash.success, 'success');
              }
              if (flash?.error) {
                     showNotification(flash.error, 'error');
              }
       }, [flash]);

       const showNotification = (message, type = 'success') => {
              setToast({ show: true, message, type });
              setTimeout(() => {
                     setToast({ show: false, message: '', type: 'success' });
              }, 4000);
       };

       useEffect(() => {
              setHighestBid(highestBidProp);
       }, [highestBidProp]);

       useEffect(() => {
              setIsFavorite(isFavoriteProp);
       }, [isFavoriteProp]);

       const handleToggleFavorite = () => {
              if (!auth.user) {
                     showNotification('Please login to add to favorites', 'error');
                     return;
              }

              setIsTogglingFavorite(true);
              router.post(route('favorites.toggle'), {
                     listing_id: product.id
              }, {
                     preserveScroll: true,
                     onSuccess: () => {
                            setIsFavorite(!isFavorite);
                            setIsTogglingFavorite(false);
                     },
                     onError: () => {
                            setIsTogglingFavorite(false);
                            showNotification('Failed to update favorites', 'error');
                     }
              });
       };

       const isOwner = auth.user && (
              auth.user.id === product.user_id ||
              auth.user.id === product.owner_id ||
              auth.user.id === product.seller_id
       );

       const handlePlaceBid = async () => {
              if (!auth.user) {
                     showNotification('Please login to place a bid', 'error');
                     return;
              }

              if (isOwner) {
                     showNotification('You cannot bid on your own product', 'error');
                     return;
              }

              if (!bidAmount || Number(bidAmount) <= highestBid) {
                     showNotification('Bid must be higher than the current highest bid', 'error');
                     return;
              }

              setShowConfirm(true);
       };

       const handleConfirmPlaceBid = () => {
              setShowConfirm(false);
              setIsPlacingBid(true);

              router.post('/bids', {
                     listing_id: product.id,
                     bid_amount: bidAmount,
                     bid_source: 'web'
              }, {
                     onSuccess: () => {
                            setBidAmount('');
                            setIsPlacingBid(false);
                            // Flash messages are automatically available in the next visit
                            if (onBidPlaced) onBidPlaced();
                     },
                     onError: (errors) => {
                            setIsPlacingBid(false);
                            const errorMsg = Object.values(errors).join('\n');
                            showNotification(errorMsg || 'Failed to place bid', 'error');
                     },
                     onFinish: () => {
                            setIsPlacingBid(false);
                     }
              });
       };

       const handleAddToCart = async () => {
              setIsAddingToCart(true);
              const result = await addToCart(product.id, 'product', null, product);
              setIsAddingToCart(false);

              if (result.success) {
                     showNotification(result.message, 'success');
              } else {
                     showNotification(result.message, 'error');
              }
       };

       const handleBuyNow = async () => {
              setIsAddingToCart(true);
              const result = await addToCart(product.id, 'product', null, product);
              if (result.success || result.message === 'Product already in cart') {
                     router.visit(route('checkout.index'));
              } else {
                     setIsAddingToCart(false);
                     showNotification(result.message, 'error');
              }
       };

       const handleChat = async () => {
              if (!auth.user) {
                     showNotification('Please login to chat with the seller', 'error');
                     return;
              }

              if (isOwner) {
                     showNotification('You cannot chat with yourself', 'error');
                     return;
              }

              try {
                     const response = await axios.post('/chat/initiate', {
                            user_id: product.user_id || product.seller_id || product.owner_id,
                            product_id: product.id
                     });

                     if (response.data && response.data.id) {
                            router.visit(`/chat?conversation_id=${response.data.id}`);
                     }
              } catch (error) {
                     console.error("Error initiating chat:", error);
                     showNotification('Failed to start conversation. Please try again.', 'error');
              }
       };

       const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              return new Intl.DateTimeFormat("en-US", {
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                     hour: "2-digit",
                     minute: "2-digit",
                     second: "2-digit",
                     hour12: true,
              }).format(date);
       };

       const buildAvatarUrl = (avatar) => {
              if (!avatar) return '/assets/images/user-fallback.png';
              if (String(avatar).startsWith('http')) return avatar;

              const normalized = String(avatar).replace(/\\/g, '/');
              if (normalized.startsWith('/')) return normalized;

              return `/${normalized.replace(/^\/+/, '')}`;
       };

       return (
              <div className="product-details-brief-parent" style={{ padding: '0 10px' }}>
                     <h2 className="product-heading mb-3">{product.title}</h2>

                     <div className="owned-by-and-favoruite d-flex align-items-center justify-content-between mb-4">
                            <div className="owned d-flex align-items-center gap-2">
                                   <div className="customer-profile-wrap">
                                          <img
                                                 src={buildAvatarUrl(product.seller?.profile_pic || product.user?.profile_pic)}
                                                 alt="Owner"
                                                 style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }}
                                                 onError={(e) => { e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'; }}
                                          />
                                   </div>
                                   <div className="customer-name d-flex flex-column">
                                          <span className="owner text-muted small fw-semibold" style={{ fontSize: '12px' }}>Owned By</span>
                                          <p className="name mb-0 fw-bold text-dark" style={{ fontSize: '15px' }}>{product.seller?.name || product.user?.name || 'Ali'}</p>
                                   </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                   <button
                                          onClick={handleChat}
                                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                                          style={{ borderRadius: '20px', padding: '5px 15px', fontSize: '13px' }}
                                   >
                                          <i className="fa-regular fa-comment-dots"></i>
                                          Chat
                                   </button>
                                   <button
                                          onClick={handleToggleFavorite}
                                          disabled={isTogglingFavorite}
                                          className="fav-btn border-0 bg-light p-2 rounded-2"
                                   >
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} xmlns="http://www.w3.org/2000/svg">
                                                 <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke={isFavorite ? "#ef4444" : "#23262F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                   </button>
                            </div>
                     </div>

                     {product.list_type === 'auction' ? (
                            <>
                                   <div className="bid-rank-and-time detail-auction-strip mb-3">
                                          <div className="detail-auction-meta">
                                                 <span className="rank">Highest Bid</span>
                                                 <div className="price" title={String(highestBid)}>
                                                        <Price amountAED={highestBid} />
                                                 </div>
                                          </div>
                                   </div>

                                   {/* Winner details if awarded */}
                                   {(product.status === 'awarded' || product.status === 'awarded ') && (
                                          <div className="winner-section-ref mb-3">
                                                 <p className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Winning Bidder</p>
                                                 <div className="winner-text-ref">
                                                        <span className="trophy-icon-ref">🏆</span>
                                                        Establishing contact with the highest bidder
                                                 </div>
                                          </div>
                                   )}

                                   {(product.status !== 'awarded' && product.status !== 'awarded ') && (
                                          <div className="bid-input-wrap mb-3">
                                                 <input
                                                        type="number"
                                                        placeholder="Enter amount"
                                                        className="form-control border-secondary-subtle"
                                                        style={{ height: '50px', fontSize: '16px', borderRadius: '10px', padding: '0 20px' }}
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        disabled={isPlacingBid || isOwner}
                                                 />
                                                 <button
                                                        className="btn w-100 fw-bold mt-3"
                                                        style={{ height: '50px', fontSize: '18px', borderRadius: '10px', backgroundColor: '#23262F', color: '#fff', border: 'none' }}
                                                        onClick={handlePlaceBid}
                                                        disabled={isPlacingBid || isOwner}
                                                 >
                                                        {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                                                 </button>
                                          </div>
                                   )}

                                   <div className="min-bid-and-estimate d-flex justify-content-between mt-2">
                                          <div className="minimum-bid text-muted small">
                                                 Starting bid price: <span className="text-dark fw-semibold"><Price amountAED={product.minimum_bid} /></span>
                                          </div>
                                          <div className="estimate-bid text-muted small">
                                                 Market Value: <span className="text-dark fw-semibold"><Price amountAED={product.reserve_price} /></span>
                                          </div>
                                   </div>

                                   {/* Disclaimer: Hide if awarded */}
                                   {((product.is_1_rupee === 1 || product.is_1_rupee === "1") && (product.status !== 'awarded' && product.status !== 'awarded ')) && (
                                          <div className="disclaimer mt-3 bg-secondary bg-opacity-5 p-2 rounded-2">
                                                 <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                                                        <i className="fa-solid fa-circle-info me-1"></i>
                                                        In our Rs. 1 Auction, if a new bid is placed in the last 5 minutes, the auction timer will automatically reset to 15 minutes.
                                                 </p>
                                          </div>
                                   )}
                            </>
                     ) : (
                            <>
                                   <div className="normal-pricing-section">
                                          <div className="d-flex flex-wrap gap-2 mb-3">
                                                 {product.product_condition && (
                                                        <div className="px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                                                               <span className="text-muted small">Condition</span>
                                                               <span className="fw-bold text-dark text-capitalize">{product.product_condition}</span>
                                                        </div>
                                                 )}
                                                 {product.product_year && (
                                                        <div className="px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                                                               <span className="text-muted small">Year</span>
                                                               <span className="fw-bold text-dark">{product.product_year}</span>
                                                        </div>
                                                 )}
                                          </div>

                                          <div className="bid-rank-and-time bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                                                 <div className="bid-price-and-rank d-flex flex-column">
                                                        <span className="rank text-muted small fw-semibold">Price</span>
                                                        <div className="price fw-bold d-flex align-items-center gap-2">
                                                               {hasDiscount && (
                                                                      <span className="text-decoration-line-through text-muted" style={{ fontSize: '16px' }}>
                                                                             <Price amountAED={baseSalePrice} />
                                                                      </span>
                                                               )}
                                                               <span className="text-dark" style={{ fontSize: '28px' }}>
                                                                      <Price amountAED={finalSalePrice} />
                                                               </span>
                                                               {hasDiscount && (
                                                                      <span className="badge bg-danger">
                                                                             {product.discount_type === 'percent' ? `${discountValue}% OFF` : 'SALE'}
                                                                      </span>
                                                               )}
                                                        </div>
                                                 </div>
                                          </div>

                                          <div className="action-buttons d-grid gap-2 mb-3">
                                                 <button
                                                        className="btn w-100 fw-bold"
                                                        style={{ height: '50px', fontSize: '16px', borderRadius: '10px', backgroundColor: '#23262F', color: '#fff', border: 'none' }}
                                                        onClick={handleAddToCart}
                                                        disabled={isOwner || isAddingToCart}
                                                 >
                                                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                                 </button>
                                                 <button
                                                        className="btn w-100 fw-bold"
                                                        style={{ height: '50px', fontSize: '16px', borderRadius: '10px', backgroundColor: '#43ACE9', color: '#fff', border: 'none' }}
                                                        onClick={handleBuyNow}
                                                        disabled={isOwner || isAddingToCart}
                                                 >
                                                        Buy Now
                                                 </button>
                                          </div>
                                   </div>
                            </>
                     )}

                     {/* Reference Styles embedded directly */}
                     <style>{`
                            .winner-section-ref {
                                   width: 100%;
                                   text-align: center;
                                   background: #f0f9ff !important;
                                   padding: 10px;
                                   border-radius: 8px;
                                   border: 1px dashed #43ACE9 !important;
                            }
                            .winner-text-ref {
                                   font-size: 1.1rem;
                                   font-weight: 700;
                                   color: #0284c7;
                                   margin-top: 4px;
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 6px;
                            }
                            .trophy-icon-ref {
                                   color: #eab308;
                                   font-size: 1.2rem;
                            }
                            .detail-auction-strip {
                                   background: #f8fafc;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 18px;
                                   padding: 18px 20px;
                                   box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
                            }
                            .detail-auction-meta {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                                   min-width: 0;
                            }
                            .detail-auction-meta .rank {
                                   color: #6b7280;
                                   font-size: 13px;
                                   font-weight: 600;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }
                            .detail-auction-meta .price {
                                   color: #111827;
                                   font-size: clamp(24px, 3vw, 36px);
                                   font-weight: 800;
                                   line-height: 1.05;
                                   letter-spacing: -0.03em;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .detail-auction-meta .price span {
                                   color: inherit !important;
                            }
                            @media (max-width: 575px) {
                                   .detail-auction-strip {
                                          padding: 16px 14px;
                                    }
                                   .detail-auction-meta {
                                          min-width: 0;
                                   }
                                   .detail-auction-meta .price {
                                          font-size: 28px;
                                   }
                            }
                     `}</style>


                     {/* Bid Confirmation Modal */}
                     {
                            showConfirm && (
                                   <div style={{
                                          position: 'fixed',
                                          top: 0,
                                          left: 0,
                                          width: '100%',
                                          height: '100%',
                                          background: 'rgba(0, 0, 0, 0.5)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          zIndex: 10000,
                                          animation: 'fadeInOverlay 0.3s ease-out'
                                   }}>
                                          <div style={{
                                                 background: '#fff',
                                                 padding: '40px 30px',
                                                 borderRadius: '20px',
                                                 textAlign: 'center',
                                                 maxWidth: '450px',
                                                 width: '90%',
                                                 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                 animation: 'popupIn 0.3s ease-out'
                                          }}>
                                                 <div style={{ marginBottom: '20px' }}>
                                                        <div style={{
                                                               width: '60px',
                                                               height: '60px',
                                                               backgroundColor: '#f3f4f6',
                                                               borderRadius: '50%',
                                                               display: 'inline-flex',
                                                               alignItems: 'center',
                                                               justifyContent: 'center',
                                                               fontSize: '30px'
                                                        }}>
                                                               💰
                                                        </div>
                                                 </div>
                                                 <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: '#111827' }}>Confirm Your Bid</h3>
                                                 <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '30px' }}>
                                                        Are you sure you want to place a bid of <span style={{ color: '#000', fontWeight: '700' }}><Price amountAED={bidAmount} /></span>?
                                                 </p>

                                                 <div className="d-flex gap-3 justify-content-center">
                                                        <button
                                                               onClick={() => setShowConfirm(false)}
                                                               style={{
                                                                      flex: 1,
                                                                      padding: '12px',
                                                                      borderRadius: '12px',
                                                                      border: '1px solid #e5e7eb',
                                                                      background: '#fff',
                                                                      fontWeight: '600',
                                                                      color: '#374151'
                                                               }}
                                                        >
                                                               Cancel
                                                        </button>
                                                        <button
                                                               onClick={handleConfirmPlaceBid}
                                                               style={{
                                                                      flex: 1,
                                                                      padding: '12px',
                                                                      borderRadius: '12px',
                                                                      border: 'none',
                                                                      background: '#000',
                                                                      color: '#fff',
                                                                      fontWeight: '600'
                                                               }}
                                                        >
                                                               Confirm Bid
                                                        </button>
                                                 </div>
                                          </div>
                                          <style>{`
                                          @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                                          @keyframes popupIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                                   `}</style>
                                   </div>
                            )
                     }

                     {/* Premium Toast Notification */}
                     {
                            toast.show && (
                                   <div style={{
                                          position: 'fixed',
                                          right: '25px',
                                          bottom: '25px',
                                          zIndex: 9999,
                                          minWidth: '280px',
                                          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
                                          color: '#fff',
                                          padding: '16px 20px',
                                          borderRadius: '12px',
                                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          animation: 'slideIn 0.3s ease-out forwards'
                                   }}>
                                          <div style={{
                                                 width: '24px',
                                                 height: '24px',
                                                 borderRadius: '50%',
                                                 backgroundColor: 'rgba(255,255,255,0.2)',
                                                 display: 'flex',
                                                 alignItems: 'center',
                                                 justifyContent: 'center'
                                          }}>
                                                 {toast.type === 'success' ? '✓' : '!'}
                                          </div>
                                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                                 {toast.message}
                                          </div>

                                          <style>{`
                                          @keyframes slideIn {
                                                 from { transform: translateX(100%); opacity: 0; }
                                                  to { transform: translateX(0); opacity: 1; }
                                          }
                                   `}</style>
                                   </div>
                            )
                     }
              </div >
       );
}
