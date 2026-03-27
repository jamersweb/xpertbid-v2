import React from "react";
import { Link, router } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import Price from "@/Components/Price";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";
import { useCart } from "@/Contexts/CartContext";

const AuctionCard = ({ auction, activeTab = "active" }) => {
       const { addToCart } = useCart();
       const isWonAuction = activeTab === "won";
       const listingKind = auction?.list_type || auction?.listing_type;
       const isDirectBuyListing = ["normal", "normal_list", "business", "business_list"].includes(listingKind);

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

       const imgPath = auction.image_url || "/assets/images/WebsiteBanner2.png";
       const maxBid = Number(auction?.current_highest_bid || auction?.bids_max_bid_amount || 0);
       const minBid = Number(auction?.minimum_bid || auction?.price || 0);
       const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
       const displayAmount = isWonAuction ? winningBidAmount : (hasMaxBid ? maxBid : minBid);
       const displayLabel = isWonAuction
              ? "Winning Bid"
              : (isDirectBuyListing ? "Price" : (hasMaxBid ? "Current Bid" : "Minimum Bid"));

       return (
              <div className="product-card-wrapper h-100">
                     <div className="pro-image m-0" style={{ position: "relative" }}>
                            <FavoriteToggleButton listingId={auction.id} />
                            <Link href={`/product/${auction.slug}`} className="product-box">
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

                            {!isWonAuction && !isDirectBuyListing && (
                                   <CountdownTimer startDate={auction.start_date} endDate={auction.end_date} />
                            )}
                     </div>

                     <OwnerInfoRow
                            owner={auction.user}
                            fallbackName={auction.user?.name}
                            fallbackAvatar={auction.user?.profile_pic}
                     />

                     <div className="pro-title" style={{ color: "black" }}>
                            <h2>
                                   <Link href={`/product/${auction.slug}`} className="text-color-black">
                                          {auction.title || auction.name || "Untitled"}
                                   </Link>
                            </h2>
                     </div>

                     <div className="pro-meta">
                            <div className="pro-price">
                                   <span>{displayLabel}</span>
                                   <div className="price">
                                          <span className="price" style={{ color: "#23262F" }}>
                                                 <Price amountAED={displayAmount} />
                                          </span>
                                   </div>
                            </div>

                            <div className="pro-buy-btn">
                                   {isWonAuction ? (
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
                                   ) : (
                                          <div className="pro-bid-btn">
                                                 <Link href={`/product/${auction.slug}`}>
                                                        {isDirectBuyListing ? "Buy Now" : "Place Bid"}
                                                 </Link>
                                          </div>
                                   )}
                            </div>
                     </div>
              </div>
       );
};

export default AuctionCard;
