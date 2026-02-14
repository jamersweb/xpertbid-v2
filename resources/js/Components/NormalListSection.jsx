import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";

export default function NormalListSection({ products }) {
       const total = products?.length || 0;
       const displayProducts = products || [];

       if (total === 0) return null;

       return (
              <section className="featured-product">
                     <div className="container-fluid p-0">
                            <div className="featured-heading">
                                   <h2>Latest Listings</h2>
                            </div>
                            <div className="swiper-featured-product">
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
                                                        const price = Number(product?.minimum_bid ?? 0);

                                                        let imgPath = "";
                                                        try {
                                                               let albumData = product.album;
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
                                                               <SwiperSlide key={`${product.slug}-${index}`}>
                                                                      <div className="product-card-wrapper">
                                                                             <div className="pro-image" style={{ position: 'relative' }}>
                                                                                    {/* Discount Badge */}
                                                                                    {product.discount_type && product.discount_value > 0 && (
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
                                                                                    <Link href={`/product/${product.slug}`} className="product-box">
                                                                                           <div className="relative aspect-[4/3] w-full overflow-hidden">
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
                                                                                                         loading="lazy"
                                                                                                  />
                                                                                           </div>
                                                                                    </Link>
                                                                             </div>

                                                                             <div className="pro-title" style={{ color: "black" }}>
                                                                                    <h2>
                                                                                           <Link href={`/product/${product.slug}`} className="text-color-black">
                                                                                                  {product.title || product.name}
                                                                                           </Link>
                                                                                    </h2>
                                                                             </div>

                                                                             <OwnerInfoRow
                                                                                    owner={product.user}
                                                                                    fallbackName={product.user?.name}
                                                                                    fallbackAvatar={product.user?.profile_pic}
                                                                             />

                                                                             <div className="pro-meta">
                                                                                    <div className="pro-price">
                                                                                           <span>Price</span>
                                                                                           <div className="price">
                                                                                                  <span className="me-1" style={{ color: "#23262F" }}>
                                                                                                         {(() => {
                                                                                                                if (product.discount_type && product.discount_value > 0) {
                                                                                                                       let finalPrice = price;
                                                                                                                       const originalPrice = price;

                                                                                                                       if (product.discount_type === 'percent') {
                                                                                                                              finalPrice = originalPrice - (originalPrice * (product.discount_value / 100));
                                                                                                                       } else if (product.discount_type === 'flat') {
                                                                                                                              finalPrice = originalPrice - product.discount_value;
                                                                                                                       }
                                                                                                                       if (finalPrice < 0) finalPrice = 0;

                                                                                                                       return (
                                                                                                                              <span className="d-flex align-items-center gap-2">
                                                                                                                                     <span className="text-decoration-line-through text-muted fs-6" style={{ fontSize: '0.8em' }}>
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
                                                                                                  <Link href={`/product/${product.slug}`}>Buy Now</Link>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               </SwiperSlide>
                                                        );
                                                 })}
                                          </Swiper>
                                   </div>
                            </div>
                     </div>
                     <style>{`
        @media (max-width: 767px) {
          .featured-product .swiper-button-prev,
          .featured-product .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
              </section>
       );
}
