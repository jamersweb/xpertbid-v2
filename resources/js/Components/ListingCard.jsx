import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import ListPackeg from "@/Components/ListPackeg";
import Price from "@/Components/Price";
import axios from "axios";
import Swal from "sweetalert2";

const ListingCard = ({ listing, onDeleted }) => {
       const [isListPackegOpen, setIsListPackegOpen] = useState(false);
       const [isPromoteDisabled, setIsPromoteDisabled] = useState(
              listing.featured_name === "home_featured"
       );
       const [isPromoted, setIsPromoted] = useState(false);

       // Check for cancelled status. Case-insensitive check.
       const isCancelled = (listing.status || "").toLowerCase() === "cancelled";
       const localStorageKey = `promoted_${listing.id}`;

       useEffect(() => {
              const promoted = localStorage.getItem(localStorageKey);
              if (promoted === "true") {
                     setIsPromoteDisabled(true);
                     setIsPromoted(true);
              }
       }, [localStorageKey]);

       const handleClick = () => {
              if (isPromoteDisabled) return;
              setIsPromoted(true);
              setIsListPackegOpen(true);
       };

       const handlePurchaseSuccess = () => {
              setIsListPackegOpen(false);
              setIsPromoteDisabled(true);
              localStorage.setItem(localStorageKey, "true");
       };

       const handlePopupClose = () => {
              setIsListPackegOpen(false);
       };

       const handleDelete = async () => {
              const result = await Swal.fire({
                     title: "Are you sure?",
                     text: "This listing will be cancelled and removed from your active list.",
                     icon: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#3085d6",
                     cancelButtonColor: "#d33",
                     confirmButtonText: "Yes, cancel it!",
              });

              if (result.isConfirmed) {
                     try {
                            const listingKey = listing.slug || listing.id;

                            await axios.post(`/auctions/${listingKey}/cancel`);

                            Swal.fire("Cancelled!", "Listing has been cancelled.", "success");

                            if (onDeleted) onDeleted(listing.id);
                     } catch (error) {
                            console.error("Cancel error:", error);
                            Swal.fire("Error", "Failed to cancel listing.", "error");
                     }
              }
       };

       const BADGE_MAP = {
              Active: "badge rounded-pill text-bg-success",
              Inactive: "badge rounded-pill text-bg-secondary",
              Resubmit: "badge rounded-pill text-bg-info",
              Decline: "badge rounded-pill text-bg-danger",
              Cancelled: "badge rounded-pill text-bg-dark",
              Draft: "badge rounded-pill text-bg-warning",
       };

       const isDraft = listing.is_draft === true;
       const normalizedListType = (listing.list_type || listing.listing_type || "").toLowerCase();
       const isNormalList = normalizedListType === "normal_list" || normalizedListType === "normal";

       // Amounts are stored in AED (or base currency) — render with <Price /> for multi-currency
       const highestBidAED =
              typeof listing?.currentBid === "number" ? listing.currentBid : 0;

       // Default values for missing data
       const listingTitle = listing?.title || "Untitled Listing";
       const listingAlbum = listing?.album || null;
       const listingStartDate = listing?.start_date || "Not set";
       const listingEndDate = listing?.end_date || "Not set";

       return (
              <div
                     className={`listing-card col-12${listing.featured_name === "home_featured" ? " listing_promoted" : ""
                            }${isCancelled ? " listing_cancelled" : ""}`}
                     style={{
                            border: isCancelled ? "2px solid #ddd" : "1px solid #ddd",
                            opacity: isCancelled ? 0.6 : 1,
                            pointerEvents: isCancelled ? "none" : "auto",
                     }}
              >
                     <div className="row">
                            <div className="col-lg-7 listing-detail">
                                   <div className="row">
                                          <div className="col-md-3">
                                                 <div className="listing-img" style={{ position: 'relative', width: '100%', height: '130px', overflow: 'hidden' }}>
                                                        {/* Discount Badge */}
                                                        {listing.list_type === 'normal_list' && listing.discount_type && listing.discount_value > 0 && (
                                                               <div style={{
                                                                      position: 'absolute',
                                                                      top: '5px',
                                                                      left: '5px',
                                                                      background: 'rgba(220, 53, 69, 0.9)',
                                                                      color: 'white',
                                                                      padding: '3px 8px',
                                                                      borderRadius: '4px',
                                                                      fontSize: '11px',
                                                                      fontWeight: 'bold',
                                                                      zIndex: 10
                                                               }}>
                                                                      {listing.discount_type === 'percent' ? `${Math.round(listing.discount_value)}%` : 'SALE'}
                                                               </div>
                                                        )}                                                         {(() => {
                                                                const imageSrc = listing?.image_url;

                                                                if (imageSrc) {
                                                                       return (
                                                                              <img
                                                                                     src={imageSrc}
                                                                                     alt={listingTitle}
                                                                                     style={{
                                                                                            width: '100%',
                                                                                            height: '100%',
                                                                                            objectFit: 'cover'
                                                                                     }}
                                                                                     onError={(e) => {
                                                                                            e.target.style.display = 'none';
                                                                                            const parent = e.target.parentElement;
                                                                                            if (parent) {
                                                                                                   parent.innerHTML = '<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">No Image</div>';
                                                                                            }
                                                                                     }}
                                                                              />
                                                                       );
                                                                }

                                                                return (
                                                                       <div style={{
                                                                              width: '100%',
                                                                              height: '100%',
                                                                              backgroundColor: '#f0f0f0',
                                                                              display: 'flex',
                                                                              alignItems: 'center',
                                                                              justifyContent: 'center',
                                                                              color: '#999',
                                                                              fontSize: '14px'
                                                                       }}>
                                                                              No Image
                                                                       </div>
                                                                );
                                                         })()}
                                                 </div>
                                          </div>
                                          <div className="col-md-9">
                                                 <h3 className="listing-product-title d-flex align-items-center gap-2">
                                                        {listingTitle}
                                                        <span
                                                               className="badge rounded-pill"
                                                               style={{
                                                                      fontSize: '12px',
                                                                      padding: '4px 12px',
                                                                      textTransform: 'capitalize',
                                                                      fontWeight: '600',
                                                                      ...(listing?.status?.toLowerCase() === 'active' 
                                                                             ? { backgroundColor: '#E3F9E5', color: '#1B7C25', border: '1px solid #1B7C25' }
                                                                             : listing?.status?.toLowerCase() === 'inactive'
                                                                             ? { backgroundColor: '#F0F2F5', color: '#64748b', border: '1px solid #64748b' }
                                                                             : listing?.status?.toLowerCase() === 'pending'
                                                                             ? { backgroundColor: '#FFF4E5', color: '#B76E00', border: '1px solid #B76E00' }
                                                                             : listing?.status?.toLowerCase() === 'decline'
                                                                             ? { backgroundColor: '#FFEBEB', color: '#D32F2F', border: '1px solid #D32F2F' }
                                                                             : { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #475569' }
                                                                      )
                                                               }}
                                                        >
                                                               {listing?.status || "Draft"}
                                                        </span>
                                                 </h3>

                                                 <div className="listing-product-bid-time">
                                                        <div className="row">
                                                               <div className="col-sm-5 bid-and-price">
                                                                       <p className="listing-bid-label">
                                                                      {isNormalList ? "Price" : (highestBidAED > 0 ? "Highest Bid" : "Starting Bid")}
                                                                       </p>
                                                                      <div className="listingPrice">
                                                                             <span className="ms-1 listingPriceNumber">
                                                                                    {/* 🔁 Multi-currency display */}
                                                                                    {isNormalList ? (
                                                                                           (() => {
                                                                                                  let finalPrice = Number(listing.reserve_price || listing.minimum_bid || 0);
                                                                                                  const originalPrice = finalPrice;
                                                                                                  if (listing.discount_type && listing.discount_value > 0) {
                                                                                                         if (listing.discount_type === 'percent') {
                                                                                                                finalPrice = originalPrice - (originalPrice * (listing.discount_value / 100));
                                                                                                         } else if (listing.discount_type === 'flat') {
                                                                                                                finalPrice = originalPrice - listing.discount_value;
                                                                                                         }
                                                                                                         if (finalPrice < 0) finalPrice = 0;

                                                                                                         return (
                                                                                                                <span className="d-flex align-items-center gap-2">
                                                                                                                       <span className="text-decoration-line-through text-muted fs-6">
                                                                                                                              <Price amountAED={originalPrice} />
                                                                                                                       </span>
                                                                                                                       <span className="text-danger">
                                                                                                                              <Price amountAED={finalPrice} />
                                                                                                                       </span>
                                                                                                                </span>
                                                                                                         );
                                                                                                  }
                                                                                                  return <Price amountAED={finalPrice} />;
                                                                                           })()
                                                                                    ) : (
                                                                                            highestBidAED > 0 ? (
                                                                                                   <Price amountAED={highestBidAED} />
                                                                                            ) : (
                                                                                                   <Price amountAED={listing.minimum_bid || 0} />
                                                                                            )
                                                                                    )}
                                                                             </span>
                                                                      </div>
                                                               </div>
                                                               <div className="col-sm-7 bid-and-time">
                                                                      {!isNormalList && (
                                                                             <>
                                                                                    <p className="listing-bid-end-label">{isDraft ? "Created" : "End in"}</p>
                                                                                    <p className="listingTime">
                                                                                           {isDraft ? (
                                                                                                  <span className="listingDate">{listingStartDate || "Not set"}</span>
                                                                                           ) : (
                                                                                                  <>
                                                                                                         <span className="listingDate">
                                                                                                                 {listingEndDate && !isNaN(new Date(listingEndDate)) ? new Date(listingEndDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : "Not set"}
                                                                                                          </span>{" "}
                                                                                                          at <span className="lisitngTime">
                                                                                                                 {listingEndDate && !isNaN(new Date(listingEndDate)) ? new Date(listingEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not set"}
                                                                                                          </span>
                                                                                                  </>
                                                                                           )}
                                                                                    </p>
                                                                             </>
                                                                      )}
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>

                            {isPromoted && (
                                   <span className="badge bg-success ms-2 d-none">Promoted</span>
                            )}

                            {/* Right Side Actions */}
                            <div className="col-lg-5 edit-promote d-flex align-items-center">
                                   {/* Promote Button - Only show if Active */}
                                   {(listing.status || "").toLowerCase() === 'active' && (
                                          <span
                                                 className="listingPromote"
                                                 onClick={!isPromoteDisabled ? handleClick : undefined}
                                                 style={{
                                                        cursor: isPromoteDisabled ? "not-allowed" : "pointer",
                                                        opacity: isPromoteDisabled ? 0.6 : 1,
                                                        backgroundColor: isPromoteDisabled ? "#12D18E" : "#52d4862e",
                                                        color: isPromoteDisabled ? "#fff" : "#32A861",
                                                 }}
                                          >
                                                 {isPromoteDisabled ? (
                                                        <svg
                                                               xmlns="http://www.w3.org/2000/svg"
                                                               width="20"
                                                               height="20"
                                                               viewBox="0 0 20 20"
                                                               fill="none"
                                                        >
                                                               <path
                                                                      d="M14.9257 8.93341H12.3507V2.93341C12.3507 1.53341 11.5924 1.25008 10.6674 2.30008L10.0007 3.05841L4.35908 9.47508C3.58408 10.3501 3.90908 11.0667 5.07574 11.0667H7.65074V17.0667C7.65074 18.4667 8.40907 18.7501 9.33407 17.7001L10.0007 16.9417L15.6424 10.5251C16.4174 9.65008 16.0924 8.93341 14.9257 8.93341Z"
                                                                      fill="white"
                                                               />
                                                        </svg>
                                                 ) : (
                                                        <img
                                                               src="/assets/images/flash.svg"
                                                               alt="Promote"
                                                               width={20}
                                                               height={20}
                                                        />
                                                 )}
                                                 Promote
                                          </span>
                                   )}

                                   {/* View Button - Only show for published listings */}
                                   {!isDraft && listing.slug && (
                                          <Link href={`/product/${listing.slug}`} className="ms-2">
                                                 <button className="button-style-1 editListing">
                                                        View
                                                 </button>
                                          </Link>
                                   )}

                                   {/* Edit Button - For drafts and published, both go to edit page */}
                                   <Link href={`/auctions/${listing.slug}/edit`} className="ms-2">
                                          <button className="button-style-1 editListing">
                                                 Edit
                                          </button>
                                   </Link>

                                   {/* 🗑️ Delete Button */}
                                   <button
                                          className="button-style-1 editListing ms-2"
                                          style={{ backgroundColor: "#dc3545", color: "#fff", border: "1px solid #dc3545" }}
                                          onClick={handleDelete}
                                   >
                                          <i className="fa fa-trash"></i>
                                   </button>

                                   {/* Promotion Modal */}
                                   {isListPackegOpen && (
                                          <ListPackeg
                                                 isOpen={isListPackegOpen}
                                                 onPurchaseSuccess={handlePurchaseSuccess}
                                                 onClose={handlePopupClose}
                                                 listing={listing}
                                          />
                                   )}
                            </div>
                     </div>
              </div >
       );
};

export default ListingCard;
