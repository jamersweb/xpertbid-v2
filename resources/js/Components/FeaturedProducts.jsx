import { useState, useMemo } from "react";
import { Link } from '@inertiajs/react'; // Inertia Link
import CountdownTimer from "@/Components/CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";

// Shimmer effect
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str) =>
       typeof window === 'undefined'
              ? Buffer.from(str).toString('base64')
              : window.btoa(str);


export default function FeaturedProducts({ products }) {
       // Products are passed as props from Home -> Controller

       const [vw, setVw] = useState(0);

       // Track viewport width (CSR only)
       // We can use a simple useEffect or just CSS for responsiveness if possible, 
       // but Swiper needs logical breakpoints sometimes.
       // Actually, Swiper has 'breakpoints' prop which is better than manual VW tracking.
       // Converting logic to Swiper breakpoints:
       /*
         if (vw >= 1300) return { spv: 3.2, gap: 40 };
         if (vw >= 1024) return { spv: 3.1, gap: 32 };
         if (vw >= 640) return { spv: 2.1, gap: 24 };
         return { spv: 1.2, gap: 16 };
       */

       const total = products?.length || 0;
       // If products is null/undefined, default to empty array
       const displayProducts = products || [];

       return (
              <>
                     <section className="featured-product">
                            <div className="container-fluid p-0">
                                   <div className="featured-heading"><h2>Featured Listings</h2></div>

                                   <div className="swiper-featured-product">
                                          {total > 0 ? (
                                                 <div style={{ overflow: "visible" }}>
                                                        <Swiper
                                                               modules={[Navigation, Autoplay]}
                                                               navigation
                                                               loop={total > 1}
                                                               centeredSlides={false}
                                                               autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                               speed={600}
                                                               breakpoints={{
                                                                      320: { slidesPerView: 1.2, spaceBetween: 16 },
                                                                      640: { slidesPerView: 2.1, spaceBetween: 24 },
                                                                      1024: { slidesPerView: 3.1, spaceBetween: 32 },
                                                                      1300: { slidesPerView: 3.2, spaceBetween: 40 },
                                                               }}
                                                        >
                                                               {displayProducts.map((product, index) => {
                                                                      const maxBid = Number(product?.bids_max_bid_amount ?? 0);
                                                                      const minBid = Number(product?.minimum_bid ?? 0);
                                                                      const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;

                                                                      const displayLabel = product.list_type === 'normal_list'
                                                                             ? "Price"
                                                                             : (hasMaxBid ? "Current Bid" : "Minimum Bid");
                                                                      const displayAmount = hasMaxBid ? maxBid : minBid; // AED (major) expected

                                                                      let imgPath = "";
                                                                      try {
                                                                             // Check if album is JSON string or array
                                                                             let albumData = product.album;
                                                                             if (typeof albumData === 'string') {
                                                                                    try {
                                                                                           albumData = JSON.parse(albumData);
                                                                                    } catch (e) {
                                                                                           // If not JSON, treat as string
                                                                                    }
                                                                             }

                                                                             if (Array.isArray(albumData)) {
                                                                                    imgPath = albumData[0];
                                                                             } else {
                                                                                    imgPath = albumData;
                                                                             }

                                                                             // Remove leading slashes if present
                                                                             imgPath = imgPath?.replace(/^\/+/, "");
                                                                      } catch {
                                                                             imgPath = "";
                                                                      }

                                                                      return (

                                                                             <SwiperSlide key={`${product.slug}-${index}`}>
                                                                                    <div className="product-card-wrapper">
                                                                                           <div className="pro-image" style={{ position: 'relative' }}>
                                                                                                  <Link href={`/product/${product.slug}`} className="product-box">
                                                                                                         <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                                                                                {/* Using standard img tag for simplicity in Inertia unless we setup an Image component */}
                                                                                                                <img
                                                                                                                       src={`/${imgPath}`}
                                                                                                                       alt={product.title || product.name || 'Product'}
                                                                                                                       style={{
                                                                                                                              width: '100%',
                                                                                                                              height: 'auto',
                                                                                                                              aspectRatio: '4/3',
                                                                                                                              objectFit: 'cover'
                                                                                                                       }}
                                                                                                                       className="object-cover img-fluid"
                                                                                                                       loading={index === 0 ? "eager" : "lazy"}
                                                                                                                />
                                                                                                         </div>
                                                                                                  </Link>
                                                                                                  {/* Discount Badge */}
                                                                                                  {product.list_type === 'normal_list' && product.discount_type && product.discount_value > 0 && (
                                                                                                         <div style={{
                                                                                                                position: 'absolute',
                                                                                                                top: '10px',
                                                                                                                left: '10px',
                                                                                                                background: 'rgba(220, 53, 69, 0.9)',
                                                                                                                color: 'white',
                                                                                                                padding: '5px 10px',
                                                                                                                borderRadius: '4px',
                                                                                                                fontSize: '12px',
                                                                                                                fontWeight: 'bold',
                                                                                                                zIndex: 10
                                                                                                         }}>
                                                                                                                {product.discount_type === 'percent' ? `${Math.round(product.discount_value)}% OFF` : 'SALE'}
                                                                                                         </div>
                                                                                                  )}
                                                                                                  {product.list_type !== 'normal_list' && (
                                                                                                         <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                                                                                                  )}
                                                                                           </div>

                                                                                           <div className="pro-title" style={{ color: "black" }}>
                                                                                                  <h2>
                                                                                                         <Link href={`/product/${product.slug}`} className="text-color-black">
                                                                                                                {product.title}
                                                                                                         </Link>
                                                                                                  </h2>
                                                                                           </div>

                                                                                           <OwnerInfoRow
                                                                                                  owner={product.user} // Changed from product.owner to product.user as it's eager loaded
                                                                                                  fallbackName={product.user?.name}
                                                                                                  fallbackAvatar={product.user?.profile_pic}
                                                                                           />


                                                                                           <div className="pro-meta">
                                                                                                  <div className="pro-price">
                                                                                                         <span>{displayLabel}</span>
                                                                                                         <div className="price">
                                                                                                                {(() => {
                                                                                                                       let finalPrice = Number(displayAmount);
                                                                                                                       const originalPrice = finalPrice;

                                                                                                                       if (product.list_type === 'normal_list' && product.discount_type && product.discount_value > 0) {
                                                                                                                              if (product.discount_type === 'percent') {
                                                                                                                                     finalPrice = originalPrice - (originalPrice * (product.discount_value / 100));
                                                                                                                              } else if (product.discount_type === 'flat') {
                                                                                                                                     finalPrice = originalPrice - product.discount_value;
                                                                                                                              }
                                                                                                                              if (finalPrice < 0) finalPrice = 0;

                                                                                                                              return (
                                                                                                                                     <div className="d-flex flex-column">
                                                                                                                                            <span className="text-decoration-line-through text-muted" style={{ fontSize: '0.8em', lineHeight: 1 }}>
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
                                                                                                                       {product.list_type === 'normal_list' ? "Buy Now" : "Place Bid"}
                                                                                                                </Link>
                                                                                                         </div>
                                                                                                  </div>
                                                                                           </div>
                                                                                    </div>
                                                                             </SwiperSlide>
                                                                      );
                                                               })}
                                                        </Swiper>
                                                 </div>
                                          ) : (
                                                 <p>No products found.</p>
                                          )}
                                   </div>
                            </div>
                     </section>
                     <style>{`
        @media (max-width: 767px) {
          .featured-product .swiper-button-prev,
          .featured-product .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
              </>
       );
}
