import { Link } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";
import useTranslate from "@/hooks/useTranslate";
import { getCardDisplayPrice, isDirectBuyListing, isSoldOutListing } from "@/Utils/listingPricing";
import { buildProductHref } from "@/Utils/productUrl";

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

export default function FeaturedProducts({ products }) {
       const { t } = useTranslate();
       const displayProducts = (products || []).slice(0, 3);

       return (
              <section className="featured-product">
                     <div className="container">
                            <div className="home-section-header">
                                   <div className="featured-heading mb-0">
                                          <h2>{t('Featured Listings')}</h2>
                                   </div>
                                   <Link href="/marketplace?featured=home_featured&section=featured" className="section-view-all-btn">{t('View All')}</Link>
                            </div>

                            {displayProducts.length > 0 ? (
                                   <div className="row g-4 home-mobile-scroll-row">
                                          {displayProducts.map((product, index) => {
                                                 const directBuyListing = isDirectBuyListing(product);
                                                 const isSoldOut = isSoldOutListing(product);
                                                 const { amount: displayAmount, labelKey, discountMeta } = getCardDisplayPrice(product);
                                                 const displayLabel = t(labelKey);
                                                 const imageSrc = getProductImageSrc(product);

                                                 return (
                                                        <div key={`${product.slug}-${index}`} className="col-12 col-sm-6 col-lg-4">
                                                               <div className="product-card-wrapper h-100">
                                                                      <div className="pro-image" style={{ position: "relative" }}>
                                                                             <FavoriteToggleButton listingId={product.id} />
                                                                             <Link href={buildProductHref(product.slug)} className="product-box">
                                                                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                                                           <img
                                                                                                  src={imageSrc}
                                                                                                  alt={product.title || product.name || "Product"}
                                                                                                  style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover" }}
                                                                                                  className="object-cover img-fluid"
                                                                                                  loading={index === 0 ? "eager" : "lazy"}
                                                                                           />
                                                                                    </div>
                                                                             </Link>

                                                                             {isSoldOut && (
                                                                                    <div style={{ position: "absolute", top: "10px", left: "10px", background: "#111827", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
                                                                                           Sold Out
                                                                                    </div>
                                                                             )}
                                                                             {!isSoldOut && discountMeta.hasDiscount && (
                                                                                    <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
                                                                                           {discountMeta.badgeText}
                                                                                    </div>
                                                                             )}

                                                                             {!isSoldOut && !directBuyListing && (
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
                                                                             <Link href={buildProductHref(product.slug)} className="text-color-black">
                                                                                           {product.title}
                                                                                    </Link>
                                                                             </h2>
                                                                      </div>

                                                                      <div className="pro-meta">
                                                                             <div className="pro-price">
                                                                                    <span>{displayLabel}</span>
                                                                                    <div className="price">
                                                                                           {(() => {
                                                                                                  let finalPrice = Number(displayAmount);
                                                                                                  const originalPrice = finalPrice;

                                                                                                  if (directBuyListing && discountMeta.hasDiscount) {
                                                                                                         return (
                                                                                                                <div className="d-flex flex-column">
                                                                                                                       <span className="text-decoration-line-through text-muted" style={{ fontSize: "0.8em", lineHeight: 1 }}>
                                                                                                                              <Price amountAED={discountMeta.originalPrice} />
                                                                                                                       </span>
                                                                                                                       <span className="price text-danger">
                                                                                                                              <Price amountAED={discountMeta.finalPrice} />
                                                                                                                       </span>
                                                                                                                </div>
                                                                                                         );
                                                                                                  }

                                                                                                  return <span className="price" style={{ color: "#23262F" }}><Price amountAED={finalPrice} /></span>;
                                                                                           })()}
                                                                                    </div>
                                                                             </div>

                                                                      <div className="pro-buy-btn">
                                                                            <div className="pro-bid-btn">
                                                                                   {isSoldOut ? (
                                                                                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", padding: "14px 22px", background: "#9ca3af", color: "#fff", fontWeight: 600, cursor: "not-allowed" }}>
                                                                                                 {t('Sold Out')}
                                                                                          </span>
                                                                                   ) : (
                                                                                          <Link href={buildProductHref(product.slug)}>
                                                                                                 {directBuyListing ? t('Buy Now') : t('Place Bid')}
                                                                                          </Link>
                                                                                   )}
                                                                            </div>
                                                                     </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 );
                                          })}
                                   </div>
                            ) : (
                                   <p>{t('No products found.')}</p>
                            )}
                     </div>
              </section>
       );
}
