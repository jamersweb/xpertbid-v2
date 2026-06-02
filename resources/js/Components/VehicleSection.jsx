import { Link } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";
import useTranslate from "@/hooks/useTranslate";
import { getDiscountMeta, isDirectBuyListing } from "@/Utils/listingPricing";

const getProductImageSrc = (product) => {
       const directImage = product?.image_url;
       if (directImage) return directImage;

       let albumData = product?.album;
       if (typeof albumData === "string") {
              try {
                     albumData = JSON.parse(albumData);
              } catch (e) {
                     // Keep original string value.
              }
       }

       const rawPath = Array.isArray(albumData) ? albumData[0] : albumData;
       if (!rawPath) return "/assets/images/placeholder.png";
       if (typeof rawPath === "string" && /^https?:\/\//i.test(rawPath)) return rawPath;
       return `/${String(rawPath).replace(/^\/+/, "")}`;
};

export default function VehicleSection({ products }) {
       const { t } = useTranslate();
       const displayProducts = (products || []).slice(0, 3);

       if (displayProducts.length === 0) return null;

       return (
              <section className="featured-product" style={{ backgroundColor: "#F9F9F9" }}>
                     <div className="container">
                            <div className="home-section-header">
                                   <div className="featured-heading mb-0">
                                          <h2>{t('Latest Vehicles')}</h2>
                                   </div>
                                   <Link href="/marketplace/vehicles?type=auction&section=latest_vehicles" className="section-view-all-btn">{t('View All')}</Link>
                            </div>

                            <div className="row g-4 home-mobile-scroll-row">
                                   {displayProducts.map((product, index) => {
                                          const maxBid = Number(product?.bids_max_bid_amount ?? 0);
                                          const minBid = Number(product?.minimum_bid ?? 0);
                                          const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
                                          const displayAmount = hasMaxBid ? maxBid : minBid;
                                          const imageSrc = getProductImageSrc(product);
                                          const directBuyListing = isDirectBuyListing(product);
                                          const discountMeta = getDiscountMeta(product);

                                          return (
                                                 <div key={`${product.slug}-${index}`} className="col-12 col-sm-6 col-lg-4">
                                                        <div className="product-card-wrapper h-100">
                                                               <div className="pro-image" style={{ position: "relative" }}>
                                                                      <FavoriteToggleButton listingId={product.id} />
                                                                      <Link href={`/product/${product.slug}`} className="product-box">
                                                                             <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                                                    <img
                                                                                           src={imageSrc}
                                                                                           alt={product.title || product.name || "Product"}
                                                                                           style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" }}
                                                                                           className="object-cover img-fluid"
                                                                                           loading="lazy"
                                                                                    />
                                                                             </div>
                                                                      </Link>
                                                                      {discountMeta.hasDiscount && (
                                                                             <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
                                                                                    {discountMeta.badgeText}
                                                                             </div>
                                                                      )}
                                                                      {!directBuyListing && (
                                                                             <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                                                                      )}
                                                               </div>

                                                               <OwnerInfoRow
                                                                      owner={product.user}
                                                                      fallbackName={product.user?.name}
                                                                      fallbackAvatar={product.user?.profile_pic}
                                                                      isFeatured={Boolean(product?.featured_name)}
                                                               />

                                                               <div className="pro-title" style={{ color: "black" }}>
                                                                      <h2>
                                                                             <Link href={`/product/${product.slug}`} className="text-color-black">
                                                                                    {product.title || product.name}
                                                                             </Link>
                                                                      </h2>
                                                               </div>

                                                              <div className="pro-meta">
                                                                     <div className="pro-price">
                                                                             <span>{directBuyListing ? t('Price') : (hasMaxBid ? t('Current Bid') : t('Minimum Bid'))}</span>
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
                                                                                           <span className="me-1" style={{ color: "#23262F" }}>
                                                                                                  <Price amountAED={displayAmount} />
                                                                                           </span>
                                                                                    )}
                                                                             </div>
                                                                     </div>

                                                                      <div className="pro-buy-btn">
                                                                            <div className="pro-bid-btn">
                                                                                   <Link href={`/product/${product.slug}`}>
                                                                                           {directBuyListing ? t('Buy Now') : t('Place Bid')}
                                                                                   </Link>
                                                                            </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          );
                                   })}
                            </div>
                     </div>
              </section>
       );
}
