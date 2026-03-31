import { Link } from "@inertiajs/react";
import CountdownTimer from "@/Components/CountdownTimer";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";

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
       const displayProducts = (products || []).slice(0, 3);

       return (
              <section className="featured-product">
                     <div className="container">
                            <div className="home-section-header">
                                   <div className="featured-heading mb-0">
                                          <h2>Featured Listings</h2>
                                   </div>
                                   <Link href="/marketplace?featured=home_featured" className="section-view-all-btn">View All</Link>
                            </div>

                            {displayProducts.length > 0 ? (
                                   <div className="row g-4 home-mobile-scroll-row">
                                          {displayProducts.map((product, index) => {
                                                 const maxBid = Number(product?.bids_max_bid_amount ?? 0);
                                                 const minBid = Number(product?.minimum_bid ?? 0);
                                                 const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
                                                 const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
                                                 const isNormalList = normalizedListType === "normal" || normalizedListType === "normal_list";
                                                 const displayLabel = isNormalList ? "Price" : (hasMaxBid ? "Current Bid" : "Minimum Bid");
                                                 const displayAmount = hasMaxBid ? maxBid : minBid;
                                                 const imageSrc = getProductImageSrc(product);

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
                                                                                                  loading={index === 0 ? "eager" : "lazy"}
                                                                                           />
                                                                                    </div>
                                                                             </Link>

                                                                             {isNormalList && product.discount_type && product.discount_value > 0 && (
                                                                                    <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
                                                                                           {product.discount_type === "percent" ? `${Math.round(product.discount_value)}% OFF` : "SALE"}
                                                                                    </div>
                                                                             )}

                                                                             {!isNormalList && (
                                                                                    <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                                                                             )}
                                                                      </div>

                                                                      <OwnerInfoRow
                                                                             owner={product.user}
                                                                             fallbackName={product.user?.name}
                                                                             fallbackAvatar={product.user?.profile_pic}
                                                                      />

                                                                      <div className="pro-title" style={{ color: "black" }}>
                                                                             <h2>
                                                                                    <Link href={`/product/${product.slug}`} className="text-color-black">
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

                                                                                                  if (isNormalList && product.discount_type && product.discount_value > 0) {
                                                                                                         if (product.discount_type === "percent") {
                                                                                                                finalPrice = originalPrice - (originalPrice * (product.discount_value / 100));
                                                                                                         } else if (product.discount_type === "flat") {
                                                                                                                finalPrice = originalPrice - product.discount_value;
                                                                                                         }
                                                                                                         if (finalPrice < 0) finalPrice = 0;

                                                                                                         return (
                                                                                                                <div className="d-flex flex-column">
                                                                                                                       <span className="text-decoration-line-through text-muted" style={{ fontSize: "0.8em", lineHeight: 1 }}>
                                                                                                                              <Price amountAED={originalPrice} />
                                                                                                                       </span>
                                                                                                                       <span className="price text-danger">
                                                                                                                              <Price amountAED={finalPrice} />
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
                                                                                           <Link href={`/product/${product.slug}`}>
                                                                                                  {isNormalList ? "Buy Now" : "Place Bid"}
                                                                                           </Link>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 );
                                          })}
                                   </div>
                            ) : (
                                   <p>No products found.</p>
                            )}
                     </div>
              </section>
       );
}
