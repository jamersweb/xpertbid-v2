import React from "react";
import { Link, router } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import Price from "@/Components/Price";
import { getDiscountMeta, isDirectBuyListing, isSoldOutListing } from "@/Utils/listingPricing";
import { buildProductHref } from "@/Utils/productUrl";

const FavoriteCard = ({ favorite }) => {
       const handleRemove = (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm('Are you sure you want to remove this from your favorites?')) {
                     router.post(route('favorites.toggle'), { listing_id: favorite.id }, {
                            preserveScroll: true
                     });
              }
       };

       const imgPath = favorite.image || "/assets/images/placeholder.jpg";

       const title = favorite.title || favorite.name || 'Product';
       const directBuyListing = isDirectBuyListing(favorite);
       const isSoldOut = isSoldOutListing(favorite);
       const discountMeta = getDiscountMeta(favorite);
       const displayLabel = directBuyListing ? "Price" : (Number(favorite.current_bid) > 0 ? "Current Bid" : "Minimum Bid");

       return (
              <div className="col-lg-4 col-md-6 col-sm-12 mkt-child">
                     <div className="market-card">
                            <div className="mkt-img">
                                   <Link href={buildProductHref(favorite.slug)} className="product-box">
                                          <img
                                                 src={imgPath}
                                                 alt={title}
                                                 loading="lazy"
                                          />
                                   </Link>

                                   {favorite.end_date && !isSoldOut && !directBuyListing && (
                                          <CountdownTimer startDate={favorite.start_date} endDate={favorite.end_date} />
                                   )}

                                   {isSoldOut && (
                                          <div
                                                 style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        left: "10px",
                                                        background: "#111827",
                                                        color: "white",
                                                        padding: "5px 10px",
                                                        borderRadius: "999px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        zIndex: 10,
                                                 }}
                                          >
                                                 Sold Out
                                          </div>
                                   )}

                                   {!isSoldOut && discountMeta.hasDiscount && (
                                          <div
                                                 style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        left: "10px",
                                                        background: "rgba(220, 53, 69, 0.9)",
                                                        color: "white",
                                                        padding: "5px 10px",
                                                        borderRadius: "999px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        zIndex: 10,
                                                 }}
                                          >
                                                 {discountMeta.badgeText}
                                          </div>
                                   )}

                                   <div className="favourite-icon" onClick={handleRemove} title="Remove from favorites">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 24 24" fill="#FF4D4D">
                                                 <path d="M16.44 3.1001C14.63 3.1001 13.01 3.9801 12 5.3301C10.99 3.9801 9.37 3.1001 7.56 3.1001C4.49 3.1001 2 5.6001 2 8.6901C2 9.8801 2.19 10.9801 2.52 12.0001C4.1 17.0001 8.97 19.9901 11.38 20.8101C11.72 20.9301 12.28 20.9301 12.62 20.8101C15.03 19.9901 19.9 17.0001 21.48 12.0001C21.81 10.9801 22 9.8801 22 8.6901C22 5.6001 19.51 3.1001 16.44 3.1001Z" />
                                          </svg>
                                   </div>
                            </div>

                            <div className="mkt-body">
                                   <div className="mkt-pro-head">
                                          <h3>
                                                 <Link href={buildProductHref(favorite.slug)}>
                                                        {title}
                                                 </Link>
                                          </h3>
                                   </div>

                                   <OwnerInfoRow
                                          owner={favorite.owner}
                                          fallbackName={favorite.user_name}
                                          fallbackAvatar={favorite.profile_pic}
                                          isFeatured={Boolean(favorite?.featured_name)}
                                   />

                                          <div className="mkt-detail">
                                         <div className="mkt-crt-bid">
                                                <span className="crnt-bid">{displayLabel}</span>
                                                <div className="mkt-bid-price">
                                                        {isSoldOut ? (
                                                               <span className="price text-muted fw-bold">Sold Out</span>
                                                        ) : directBuyListing && discountMeta.hasDiscount ? (
                                                               <div className="d-flex flex-column">
                                                                      <span className="text-decoration-line-through text-muted" style={{ fontSize: "0.8em", lineHeight: 1 }}>
                                                                             <Price className="price" amountAED={discountMeta.originalPrice} />
                                                                      </span>
                                                                      <span className="text-danger">
                                                                             <Price className="price" amountAED={discountMeta.finalPrice} />
                                                                      </span>
                                                               </div>
                                                        ) : (
                                                               <Price
                                                                      className="price"
                                                                      amountAED={favorite.current_bid || favorite.minimum_bid}
                                                               />
                                                        )}
                                                 </div>
                                          </div>
                                          <div className="mkt-bid-btn">
                                                 {isSoldOut ? (
                                                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", padding: "12px 18px", background: "#9ca3af", color: "#fff", fontWeight: 600, cursor: "not-allowed" }}>
                                                               Sold Out
                                                        </span>
                                                 ) : (
                                                        <Link href={buildProductHref(favorite.slug)}>
                                                               {directBuyListing ? "Buy Now" : "Place Bid"}
                                                        </Link>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default FavoriteCard;
