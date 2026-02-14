import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import ListPackeg from "@/Components/ListPackeg";
import Price from "@/Components/Price";
import axios from "axios";
import Swal from "sweetalert2";

const ListingCard = ({ listing, onDeleted }) => {
       const { auth } = usePage().props;
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
              if (!auth?.user?.token) {
                     Swal.fire("Error", "Please login first!", "error");
                     return;
              }

              const result = await Swal.fire({
                     title: "Are you sure?",
                     text: "You won't be able to revert this!",
                     icon: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#3085d6",
                     cancelButtonColor: "#d33",
                     confirmButtonText: "Yes, cancel it!",
              });

              if (result.isConfirmed) {
                     try {
                            await axios.post(
                                   `https://admin.xpertbid.com/api/listings/${listing.id}/cancel`,
                                   {},
                                   { headers: { Authorization: `Bearer ${auth.user.token}` } }
                            );

                            Swal.fire("Cancelled!", "Listing has been cancelled.", "success");

                            if (onDeleted) onDeleted(listing.id);
                            // Optionally reload or let parent handle removal
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
                                                        )}

                                                        {(() => {
                                                               try {
                                                                      let firstImage = null;

                                                                      // Try to get image from album
                                                                      if (listingAlbum) {
                                                                             let album = listingAlbum;
                                                                             if (typeof listingAlbum === 'string') {
                                                                                    try {
                                                                                           // First try parsing as-is
                                                                                           album = JSON.parse(listingAlbum);
                                                                                    } catch (e1) {
                                                                                           try {
                                                                                                  // If that fails, remove backslashes and try again
                                                                                                  const cleanedAlbum = listingAlbum.replace(/\\/g, '');
                                                                                                  album = JSON.parse(cleanedAlbum);
                                                                                           } catch (e2) {
                                                                                                  console.error('Failed to parse album:', e2, listingAlbum);
                                                                                                  album = [];
                                                                                           }
                                                                                    }
                                                                             }

                                                                             if (Array.isArray(album) && album.length > 0) {
                                                                                    firstImage = album[0];
                                                                             }
                                                                      }

                                                                      // Fallback to listing.image if album doesn't have image
                                                                      if (!firstImage && listing?.image) {
                                                                             firstImage = listing.image;
                                                                      }

                                                                      if (firstImage && typeof firstImage === 'string') {
                                                                             // Clean the path - remove any extra backslashes
                                                                             let cleanPath = firstImage.replace(/\\/g, '');
                                                                             let imageSrc = cleanPath;

                                                                             // If already a full URL, use it as is
                                                                             if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
                                                                                    imageSrc = cleanPath;
                                                                             }
                                                                             // If starts with /, add domain
                                                                             else if (cleanPath.startsWith('/')) {
                                                                                    imageSrc = `https://admin.xpertbid.com${cleanPath}`;
                                                                             }
                                                                             // Otherwise, add domain and slash
                                                                             else {
                                                                                    imageSrc = `https://admin.xpertbid.com/${cleanPath}`;
                                                                             }

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
                                                                                                  // Fallback if image fails to load
                                                                                                  e.target.style.display = 'none';
                                                                                                  const parent = e.target.parentElement;
                                                                                                  if (parent) {
                                                                                                         parent.innerHTML = '<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">No Image</div>';
                                                                                                  }
                                                                                           }}
                                                                                    />
                                                                             );
                                                                      }
                                                               } catch (e) {
                                                                      console.error('Error parsing album:', e, 'Album data:', listingAlbum);
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
                                                 <h3 className="listing-product-title ">
                                                        {listingTitle}
                                                        <span
                                                               className={
                                                                      BADGE_MAP[listing?.status] || "ms-3 badge  text-bg-secondary"
                                                               }
                                                        >
                                                               {listing?.status || "Draft"}
                                                        </span>
                                                 </h3>

                                                 <div className="listing-product-bid-time">
                                                        <div className="row">
                                                               <div className="col-sm-5 bid-and-price">
                                                                      <p className="listing-bid-label">
                                                                             {listing.list_type === "normal_list" ? "Price" : "Highest Bid"}
                                                                      </p>
                                                                      <div className="listingPrice">
                                                                             <span className="ms-1 listingPriceNumber">
                                                                                    {/* 🔁 Multi-currency display */}
                                                                                    {listing.list_type === "normal_list" ? (
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
                                                                                                  <span>No bids yet</span>
                                                                                           )
                                                                                    )}
                                                                             </span>
                                                                      </div>
                                                               </div>
                                                               <div className="col-sm-7 bid-and-time">
                                                                      {listing.list_type !== "normal_list" && (
                                                                             <>
                                                                                    <p className="listing-bid-end-label">{isDraft ? "Created" : "End in"}</p>
                                                                                    <p className="listingTime">
                                                                                           {isDraft ? (
                                                                                                  <span className="listingDate">{listingStartDate || "Not set"}</span>
                                                                                           ) : (
                                                                                                  <>
                                                                                                         <span className="listingDate">{listingStartDate}</span>{" "}
                                                                                                         at <span className="lisitngTime">{listingEndDate}</span>
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
                                   <Link href={`/auctions/${listing.id}/edit`} className="ms-2">
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
