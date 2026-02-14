import React from "react";
import { Link, router } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import Price from "@/Components/Price";

const FavoriteCard = ({ favorite }) => {
       const handleRemove = (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm('Are you sure you want to remove this from your favorites?')) {
                     router.post(route('favorites.toggle'), {
                            auction_id: favorite.id
                     }, {
                            preserveScroll: true
                     });
              }
       };

       // Robust image parser logic (from AuctionCard)
       let imgPath = "";
       try {
              let albumData = favorite.image; // Controller maps auction.image to favorite.image
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
              <div className="col-sm-6 col-md-4 col-lg-4 mkt-child mb-4">
                     <div className="market-card h-100 d-flex flex-column shadow-sm border rounded-3 overflow-hidden">
                            <Link href={`/product/${favorite.slug}`} className="flex-grow-1 d-flex flex-column text-decoration-none color-inherit">
                                   <div className="mkt-img position-relative">
                                          <div className="aspect-ratio-box" style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
                                                 <img
                                                        src={imgPath ? `/${imgPath}` : "/assets/images/WebsiteBanner2.png"}
                                                        alt={favorite.title}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                        className="img-fluid"
                                                        loading="lazy"
                                                 />
                                          </div>

                                          <button
                                                 onClick={handleRemove}
                                                 className="btn btn-light rounded-circle shadow-sm position-absolute"
                                                 style={{ top: '10px', right: '10px', width: '35px', height: '35px', padding: 0, zIndex: 10 }}
                                                 title="Remove from favorites"
                                          >
                                                 <i className="fa-solid fa-heart text-danger"></i>
                                          </button>

                                          {favorite.end_date && (
                                                 <CountdownTimer startDate={favorite.start_date} endDate={favorite.end_date} />
                                          )}
                                   </div>
                                   <div className="mkt-body p-3 flex-grow-1 d-flex flex-column">
                                          <div className="mkt-pro-head mb-2">
                                                 <h3 className="m-0 h5 text-dark fw-bold text-truncate">{favorite.title}</h3>
                                          </div>

                                          <div className="mkt-detail mt-auto pt-2 d-flex justify-content-between align-items-center">
                                                 <div className="mkt-crt-bid">
                                                        <span className="crnt-bid d-block text-muted small">
                                                               {Number(favorite.current_bid) > 0 ? "Current Bid" : "Minimum Bid"}
                                                        </span>
                                                        <div className="mkt-bid-price fw-bold text-primary">
                                                               <Price amountAED={favorite.current_bid || favorite.minimum_bid} />
                                                        </div>
                                                 </div>
                                                 <div className="mkt-bid-btn">
                                                        <span className="btn btn-outline-primary btn-sm rounded-pill px-3">View Details</span>
                                                 </div>
                                          </div>
                                   </div>
                            </Link>
                     </div>
                     <style dangerouslySetInnerHTML={{
                            __html: `
                .market-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .market-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
                }
                .color-inherit {
                    color: inherit;
                }
            `}} />
              </div>
       );
};

export default FavoriteCard;
