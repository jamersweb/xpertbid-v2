import React from "react";
import { Link, router } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import Price from "@/Components/Price";
import axios from 'axios';

const AuctionCard = ({ auction, activeTab = "active" }) => {
       const isWonAuction = activeTab === "won";

       const handleCheckout = async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (auction.status === 'closed') {
                     alert('This product is closed and cannot be checked out.');
                     return;
              }

              // In Inertia, we add to cart via POST and redirect
              router.post(route('cart.add'), {
                     auction_id: auction.id,
                     quantity: 1
              }, {
                     onSuccess: () => router.visit(route('checkout.index'))
              });
       };

       // Get winning bid amount for won auctions
       const winningBidAmount = isWonAuction
              ? (auction.current_highest_bid || auction.reserve_price || auction.minimum_bid || 0)
              : null;

       // Robust image parser logic from FeaturedProducts
       let imgPath = "";
       try {
              let albumData = auction.album || auction.image;
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

       return (
              <div className="mkt-child h-100">
                     <div className="market-card h-100 d-flex flex-column">
                            <Link href={`/product/${auction.slug}`} className="flex-grow-1 d-flex flex-column">
                                   <div className="mkt-img" style={{ position: 'relative' }}>
                                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                 <img
                                                        src={imgPath ? `/${imgPath}` : "/assets/images/WebsiteBanner2.png"}
                                                        alt={auction.title || auction.name || 'Auction item'}
                                                        style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover' }}
                                                        className="img-fluid"
                                                        loading="lazy"
                                                 />
                                          </div>
                                          {/* Discount Badge */}
                                          {auction.list_type === 'normal_list' && auction.discount_type && auction.discount_value > 0 && (
                                                 <div style={{
                                                        position: 'absolute', top: '10px', left: '10px',
                                                        background: 'rgba(220, 53, 69, 0.9)', color: 'white',
                                                        padding: '5px 10px', borderRadius: '4px',
                                                        fontSize: '12px', fontWeight: 'bold', zIndex: 10
                                                 }}>
                                                        {auction.discount_type === 'percent' ? `${Math.round(auction.discount_value)}% OFF` : 'SALE'}
                                                 </div>
                                          )}

                                          {isWonAuction ? (
                                                 <div style={{
                                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                                        background: 'rgba(40, 167, 69, 0.9)', color: 'white',
                                                        padding: '10px 15px', textAlign: 'center',
                                                        fontWeight: '600', fontSize: '14px'
                                                 }}>
                                                        Awarded
                                                 </div>
                                          ) : (
                                                 auction.list_type !== 'normal_list' && (
                                                        <CountdownTimer startDate={auction.start_date} endDate={auction.end_date} />
                                                 )
                                          )}
                                   </div>
                                   <div className="mkt-body p-3 flex-grow-1 d-flex flex-column">
                                          <div className="mkt-pro-head mb-2">
                                                 <h3 className="m-0" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{auction.title}</h3>
                                          </div>

                                          <OwnerInfoRow
                                                 owner={auction.user}
                                                 fallbackName={auction.user?.name}
                                                 fallbackAvatar={auction.user?.profile_pic}
                                          />

                                          <div className="mkt-detail mt-auto pt-3 d-flex justify-content-between align-items-end">
                                                 <div className="mkt-crt-bid">
                                                        <span className="crnt-bid d-block text-muted" style={{ fontSize: '0.8rem' }}>
                                                               {isWonAuction
                                                                      ? "Winning Bid"
                                                                      : (auction.list_type === 'normal_list' ? "Price" : (Number(auction.current_highest_bid || 0) > 0 ? "Current Bid" : "Minimum Bid"))
                                                               }
                                                        </span>
                                                        <div className="mkt-bid-price">
                                                               {isWonAuction ? (
                                                                      <Price amountAED={winningBidAmount} />
                                                               ) : (
                                                                      (() => {
                                                                             let finalPrice = Number(auction.current_highest_bid || auction.minimum_bid || 0);
                                                                             const originalPrice = finalPrice;
                                                                             if (auction.list_type === 'normal_list' && auction.discount_type && auction.discount_value > 0) {
                                                                                    if (auction.discount_type === 'percent') finalPrice = originalPrice - (originalPrice * (auction.discount_value / 100));
                                                                                    else if (auction.discount_type === 'flat') finalPrice = originalPrice - auction.discount_value;
                                                                                    if (finalPrice < 0) finalPrice = 0;
                                                                                    return (
                                                                                           <div className="d-flex flex-column">
                                                                                                  <span className="text-decoration-line-through text-muted" style={{ fontSize: '0.7em' }}><Price amountAED={originalPrice} /></span>
                                                                                                  <span className="text-danger fw-bold"><Price amountAED={finalPrice} /></span>
                                                                                           </div>
                                                                                    );
                                                                             }
                                                                             return <span className="fw-bold"><Price amountAED={finalPrice} /></span>;
                                                                      })()
                                                               )}
                                                        </div>
                                                 </div>
                                                 <div className="mkt-bid-btn">
                                                        {isWonAuction ? (
                                                               <button
                                                                      onClick={handleCheckout}
                                                                      disabled={auction.status === 'closed'}
                                                                      className="btn btn-dark btn-sm w-100 py-2"
                                                                      style={{ fontWeight: '600' }}
                                                               >
                                                                      Checkout
                                                               </button>
                                                        ) : (
                                                               <div className="pro-bid-btn">
                                                                      <Link href={`/product/${auction.slug}`} className="btn btn-outline-dark btn-sm px-3">
                                                                             {auction.list_type === 'normal_list' ? "Buy Now" : "Place Bid"}
                                                                      </Link>
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </Link>
                     </div>
                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .market-card {
                                   border: 1px solid #f0f0f0;
                                   border-radius: 12px;
                                   overflow: hidden;
                                   transition: all 0.3s ease;
                                   background: #fff;
                            }
                            .market-card:hover {
                                   box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                                   transform: translateY(-5px);
                            }
                            .mkt-body h3 {
                                   color: #23262F;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                                   white-space: nowrap;
                            }
                     `}} />
              </div>
       );
};

export default AuctionCard;
