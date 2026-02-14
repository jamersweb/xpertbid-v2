import { Link } from '@inertiajs/react'; // Inertia Link
import CountdownTimer from "@/Components/CountdownTimer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Price from "@/Components/Price";
import OwnerInfoRow from "@/Components/OwnerInfoRow";

export default function AuctionSection({ products }) {
       const total = products?.length || 0;
       const displayProducts = products || [];

       if (total === 0) return null;

       return (
              <>
                     <section className="featured-product" style={{ backgroundColor: "#F9F9F9" }}>
                            <div className="container-fluid p-0">
                                   <div className="featured-heading">
                                          <h2>Latest Auctions</h2>
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
                                                               const maxBid = Number(product?.bids_max_bid_amount ?? 0);
                                                               const minBid = Number(product?.minimum_bid ?? 0);
                                                               const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
                                                               const displayLabel = hasMaxBid ? "Current Bid" : "Minimum Bid";
                                                               const displayAmount = hasMaxBid ? maxBid : minBid; // AED (major) expected

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
                                                                                           {product.list_type !== 'normal_list' && (
                                                                                                  <CountdownTimer startDate={product.start_date} endDate={product.end_date} />
                                                                                           )}
                                                                                    </div>

                                                                                    <div className="pro-title" style={{ color: "black" }}>
                                                                                           <h2>
                                                                                                  <Link href={`/product/${product.slug}`} className="text-color-black">
                                                                                                         {product.title || product.name || "Untitled"}
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
                                                                                                         <span className="price" style={{ color: "#23262F" }}><Price amountAED={displayAmount} /></span>
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
