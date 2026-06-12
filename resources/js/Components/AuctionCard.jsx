import React from "react";
import { Link, router } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import Price from "@/Components/Price";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";
import { useCart } from "@/Contexts/CartContext";
import { getDiscountMeta, isDirectBuyListing, isSoldOutListing } from "@/Utils/listingPricing";
import { buildProductHref } from "@/Utils/productUrl";

const AuctionCard = ({ auction, activeTab = "active", showPropertyMeta = false }) => {
       const { addToCart } = useCart();
       const isWonAuction = activeTab === "won";
       const listingKind = auction?.list_type || auction?.listing_type;
       const isLiveAuction = listingKind === "live_auction";
       const isSoldOut = isSoldOutListing(auction);
       const directBuyListing = isDirectBuyListing(auction);
       const discountMeta = getDiscountMeta(auction);
       const categoryFeatures = auction?.category_features && typeof auction.category_features === "object" ? auction.category_features : {};
       const isPropertyListing = String(auction?.category_id || "") === "222";

       const getFeatureValue = (...keys) => {
              for (const key of keys) {
                     const value = categoryFeatures?.[key];
                     if (value !== undefined && value !== null && String(value).trim() !== "") {
                            return String(value).trim();
                     }
              }
              return "";
       };

       // Property dynamic-field mapping:
       // 1=Bedrooms, 2=Bathrooms, 5=Area unit, 6=Area
       const beds = getFeatureValue("field_1", "1");
       const baths = getFeatureValue("field_2", "2");
       const areaSize = getFeatureValue("field_6", "6");
       const areaUnit = getFeatureValue("field_5", "5");
       const area = [areaSize, areaUnit].filter(Boolean).join(" ");
       const shouldRenderPropertyMeta = showPropertyMeta && isPropertyListing && (beds || baths || area);

       const handleCheckout = async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (auction.status === 'closed') {
                     alert('This product is closed and cannot be checked out.');
                     return;
              }

              // Use addToCart which handles both auth and guest
              const result = await addToCart(auction.id, 'product', null, auction);
              if (result.success || result.message === 'Product already in cart') {
                     router.visit(route('checkout.index'));
              } else {
                     alert(result.message);
              }
       };

       const winningBidAmount = isWonAuction
              ? (auction.current_highest_bid || auction.reserve_price || auction.minimum_bid || 0)
              : null;

       const imgPath = auction.image_url
              || (isLiveAuction && auction.youtube_video_id ? `https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg` : null)
              || "/assets/images/WebsiteBanner2.png";
       const maxBid = Number(auction?.current_highest_bid || auction?.bids_max_bid_amount || 0);
       const minBid = Number(auction?.minimum_bid || auction?.price || 0);
       const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
       const displayAmount = isWonAuction ? winningBidAmount : (hasMaxBid ? maxBid : minBid);
       const displayLabel = isWonAuction
              ? "Winning Bid"
              : (directBuyListing ? "Price" : (isLiveAuction ? (hasMaxBid ? "Live Bid" : "Start Price") : (hasMaxBid ? "Current Bid" : "Minimum Bid")));

       return (
              <div className="product-card-wrapper h-100">
                     <div className="pro-image m-0" style={{ position: "relative" }}>
                            <FavoriteToggleButton listingId={auction.id} />
                            <Link href={buildProductHref(auction.slug)} className="product-box">
                                   <div className="relative aspect-[4/3] w-full overflow-hidden">
                                          <img
                                                 src={imgPath}
                                                 alt={auction.title || auction.name || "Auction item"}
                                                 style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", borderRadius: "18px" }}
                                                 className="img-fluid object-cover"
                                                 loading="lazy"
                                          />
                                   </div>
                            </Link>

                            {isLiveAuction && (
                                   <span
                                          className="badge rounded-pill bg-danger text-white"
                                          style={{ position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px" }}
                                   >
                                          <i className="fa-solid fa-circle me-1" style={{ fontSize: 8 }}></i>
                                          Live Auction
                                   </span>
                            )}

                            {isSoldOut && (
                                   <span
                                          className="badge rounded-pill bg-dark text-white"
                                          style={{ position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px" }}
                                   >
                                          Sold Out
                                   </span>
                            )}

                            {!isSoldOut && discountMeta.hasDiscount && (
                                   <span
                                          className="badge text-white"
                                          style={{ position: "absolute", top: 12, left: 12, zIndex: 3, fontSize: 12, padding: "7px 11px", background: "rgba(220, 53, 69, 0.9)", borderRadius: "999px" }}
                                   >
                                          {discountMeta.badgeText}
                                   </span>
                            )}

                            {!isSoldOut && !isWonAuction && !directBuyListing && !isLiveAuction && (
                                   <CountdownTimer startDate={auction.start_date} endDate={auction.end_date} />
                            )}
                     </div>

                     <OwnerInfoRow
                            owner={auction.user}
                            fallbackName={auction.user?.name}
                            fallbackAvatar={auction.user?.profile_pic}
                            isFeatured={Boolean(auction?.featured_name)}
                     />

                     <div className="pro-title" style={{ color: "black" }}>
                            <h2>
                                   <Link href={buildProductHref(auction.slug)} className="text-color-black">
                                          {auction.title || auction.name || "Untitled"}
                                   </Link>
                            </h2>
                     </div>

                     {shouldRenderPropertyMeta && (
                            <div className="d-flex flex-nowrap gap-1 mt-2 mb-2 align-items-center overflow-hidden">
                                   {beds && (
                                          <span
                                                 className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate"
                                                 style={{ maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 }}
                                          >
                                                 <i className="fa-solid fa-bed text-primary" aria-hidden="true"></i>
                                                 {beds} Beds
                                          </span>
                                   )}
                                   {baths && (
                                          <span
                                                 className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2 text-truncate"
                                                 style={{ maxWidth: "31%", fontSize: "0.92rem", minWidth: 0 }}
                                          >
                                                 <i className="fa-solid fa-bath text-primary" aria-hidden="true"></i>
                                                 {baths} Baths
                                          </span>
                                   )}
                                   {area && (
                                          <span
                                                 className="badge rounded-pill text-bg-light border text-dark d-inline-flex align-items-center gap-1 px-2 py-2"
                                                 style={{ fontSize: "0.88rem", minWidth: 0, whiteSpace: "normal", flex: "0 0 auto" }}
                                          >
                                                 <i className="fa-solid fa-ruler-combined text-primary" aria-hidden="true"></i>
                                                 {area}
                                          </span>
                                   )}
                            </div>
                     )}

                     <div className="pro-meta">
                            <div className="pro-price">
                                   <span>{displayLabel}</span>
                                   <div className="price">
                                          {directBuyListing && discountMeta.hasDiscount ? (
                                                 <div className="d-flex flex-column">
                                                        <span className="text-decoration-line-through text-muted" style={{ fontSize: "0.8em", lineHeight: 1 }}>
                                                               <Price amountAED={discountMeta.originalPrice} />
                                                        </span>
                                                        <span className="price text-danger">
                                                               <Price amountAED={discountMeta.finalPrice} />
                                                        </span>
                                                 </div>
                                          ) : (
                                                 <span className="price" style={{ color: "#23262F" }}>
                                                        <Price amountAED={displayAmount} />
                                                 </span>
                                          )}
                                   </div>
                            </div>

                            <div className="pro-buy-btn">
                                   {isWonAuction ? (
                                          isSoldOut ? (
                                                 <button
                                                        type="button"
                                                        disabled
                                                        style={{
                                                               border: "none",
                                                               background: "#9ca3af",
                                                               color: "#fff",
                                                               borderRadius: "12px",
                                                               padding: "14px 22px",
                                                               fontWeight: 600,
                                                               lineHeight: 1,
                                                               cursor: "not-allowed",
                                                        }}
                                                 >
                                                        Sold Out
                                                 </button>
                                          ) : (
                                                 <button
                                                        type="button"
                                                        onClick={handleCheckout}
                                                        disabled={auction.status === "closed"}
                                                        style={{
                                                               border: "none",
                                                               background: "#23262F",
                                                               color: "#fff",
                                                               borderRadius: "12px",
                                                               padding: "14px 22px",
                                                               fontWeight: 600,
                                                               lineHeight: 1,
                                                        }}
                                                 >
                                                        Checkout
                                                 </button>
                                          )
                                   ) : (
                                          <div className="pro-bid-btn">
                                                 {isSoldOut ? (
                                                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", padding: "14px 22px", background: "#9ca3af", color: "#fff", fontWeight: 600, cursor: "not-allowed" }}>Sold Out</span>
                                                 ) : (
                                                        <Link href={buildProductHref(auction.slug)}>
                                                               {directBuyListing ? "Buy Now" : (isLiveAuction ? "Join Live" : "Place Bid")}
                                                        </Link>
                                                 )}
                                          </div>
                                   )}
                            </div>
                     </div>
              </div>
       );
};

export default AuctionCard;
