import { Link } from "@inertiajs/react";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";
import FavoriteToggleButton from "@/Components/FavoriteToggleButton";
import useTranslate from "@/hooks/useTranslate";

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

export default function NormalListSection({ products }) {
       const { t } = useTranslate();
       const displayProducts = (products || []).slice(0, 3);

       if (displayProducts.length === 0) return null;

       return (
              <section className="featured-product">
                     <div className="container">
                            <div className="home-section-header">
                                   <div className="featured-heading mb-0">
                                          <h2>{t('Latest Listings')}</h2>
                                   </div>
                                   <Link href="/marketplace" className="section-view-all-btn">{t('View All')}</Link>
                            </div>

                            <div className="row g-4 home-mobile-scroll-row">
                                   {displayProducts.map((product, index) => {
                                          const normalizedListType = (product?.list_type || product?.listing_type || "").toLowerCase();
                                          const isBusinessListing = normalizedListType === "business" || normalizedListType === "business_list";
                                          const price = Number(product?.price ?? product?.buy_now_price ?? product?.minimum_bid ?? 0);
                                          const imageSrc = getProductImageSrc(product);

                                          return (
                                                 <div key={`${product.slug}-${index}`} className="col-12 col-sm-6 col-lg-4">
                                                        <div className="product-card-wrapper h-100">
                                                               <div className="pro-image" style={{ position: "relative" }}>
                                                                      <FavoriteToggleButton listingId={product.id} />
                                                                      {product.discount_type && product.discount_value > 0 && (
                                                                             <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(220, 53, 69, 0.9)", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
                                                                                    {product.discount_type === "percent" ? `${Math.round(product.discount_value)}% OFF` : "SALE"}
                                                                             </div>
                                                                      )}

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
                                                                             <span>{isBusinessListing ? t('Business Price') : t('Price')}</span>
                                                                             <div className="price">
                                                                                    <span className="me-1" style={{ color: "#23262F" }}>
                                                                                           {(() => {
                                                                                                  if (product.discount_type && product.discount_value > 0) {
                                                                                                         let finalPrice = price;
                                                                                                         const originalPrice = price;

                                                                                                         if (product.discount_type === "percent") {
                                                                                                                finalPrice = originalPrice - (originalPrice * (product.discount_value / 100));
                                                                                                         } else if (product.discount_type === "flat") {
                                                                                                                finalPrice = originalPrice - product.discount_value;
                                                                                                         }
                                                                                                         if (finalPrice < 0) finalPrice = 0;

                                                                                                         return (
                                                                                                                <span className="d-flex align-items-center gap-2">
                                                                                                                       <span className="text-decoration-line-through text-muted fs-6" style={{ fontSize: "0.8em" }}>
                                                                                                                              <Price amountAED={originalPrice} />
                                                                                                                       </span>
                                                                                                                       <span className="text-danger fw-bold">
                                                                                                                              <Price amountAED={finalPrice} />
                                                                                                                       </span>
                                                                                                                </span>
                                                                                                         );
                                                                                                  }
                                                                                                  return <Price amountAED={price} />;
                                                                                           })()}
                                                                                    </span>
                                                                             </div>
                                                                      </div>

                                                                      <div className="pro-buy-btn">
                                                                             <div className="pro-bid-btn">
                                                                                    <Link href={`/product/${product.slug}`}>
                                                                                           {isBusinessListing ? t('View Product') : t('Buy Now')}
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
