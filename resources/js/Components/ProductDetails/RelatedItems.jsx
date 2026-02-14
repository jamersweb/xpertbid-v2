import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Price from '@/Components/Price';
import CountdownTimer from '@/Components/CountdownTimer';
import OwnerInfoRow from '@/Components/OwnerInfoRow';
import 'swiper/css';
import 'swiper/css/navigation';

export default function RelatedItems({ items }) {
       if (!items || items.length === 0) return null;

       return (
              <>
                     <section className="featured-product">
                            <div className="container-fluid ps-sm-5">
                                   <div className="product-detail">
                                          <h2>Other items of interest</h2>
                                   </div>
                                   <div className="swiper-featured-product">
                                          <Swiper
                                                 modules={[Navigation]}
                                                 navigation={true}
                                                 spaceBetween={30}
                                                 loop={true}
                                                 breakpoints={{
                                                        390: { slidesPerView: 1 },
                                                        550: { slidesPerView: 2 },
                                                        888: { slidesPerView: 2 },
                                                        1024: { slidesPerView: 3.4 },
                                                        1367: { slidesPerView: 4.2 },
                                                        1567: { slidesPerView: 5 },
                                                 }}
                                          >
                                                 {items.map((item, index) => {
                                                        const ownerName = item.owner?.name || item.user?.name || 'User';
                                                        const userName = ownerName.split(' ').slice(0, 10).join(' ');
                                                        const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                                                        const displayName = userName.split(' ').map(word => capitalizeFirst(word)).join(' ');

                                                        // Handle Image
                                                        let imageUrl = '/assets/images/user.jpg';
                                                        try {
                                                               if (item.album && item.album.trim() !== '') {
                                                                      const albumArray = JSON.parse(typeof item.album === 'string' ? item.album.replace(/\\/g, '') : JSON.stringify(item.album));
                                                                      if (Array.isArray(albumArray) && albumArray.length > 0 && albumArray[0]) {
                                                                             imageUrl = `https://admin.xpertbid.com/${albumArray[0].replace(/^\/+/, "")}`;
                                                                      }
                                                               } else if (item.image) {
                                                                      imageUrl = `https://admin.xpertbid.com/${item.image.replace(/^\/+/, "")}`;
                                                               }
                                                        } catch (e) { }

                                                        const maxBid = Number(item.bids_max_bid_amount ?? item.current_highest_bid ?? 0);
                                                        const minBid = Number(item.minimum_bid ?? 0);
                                                        const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;

                                                        const isNormalList = item.list_type === 'normal_list';
                                                        const displayLabel = isNormalList ? "Price" : (hasMaxBid ? "Current Bid" : "Minimum Bid");
                                                        const displayAmount = hasMaxBid ? maxBid : minBid;

                                                        return (
                                                               <SwiperSlide key={index}>
                                                                      <Link href={route('product.show', item.slug)} className="product-box">
                                                                             <div className="pro-image" style={{ position: 'relative' }}>
                                                                                    <img
                                                                                           src={imageUrl}
                                                                                           alt={item.title}
                                                                                           onError={(e) => { e.target.src = '/assets/images/user.jpg'; }}
                                                                                    />
                                                                                    {!isNormalList && (
                                                                                           <CountdownTimer startDate={item.start_date} endDate={item.end_date} />
                                                                                    )}
                                                                             </div>
                                                                             <div className="pro-title">
                                                                                    <h2>{item.title}</h2>
                                                                             </div>

                                                                             <OwnerInfoRow
                                                                                    owner={item.owner || item.user}
                                                                                    fallbackName={displayName}
                                                                                    fallbackAvatar={item.profile_pic}
                                                                             />

                                                                             <div className="pro-meta">
                                                                                    <div className="pro-price">
                                                                                           <span>{displayLabel}</span>
                                                                                           <p className="price">
                                                                                                  <span className="me-1" style={{ color: "#23262F" }}>
                                                                                                         <Price amountAED={displayAmount} />
                                                                                                  </span>
                                                                                           </p>
                                                                                    </div>
                                                                                    <div className="pro-buy-btn">
                                                                                           <div className="pro-bid-btn">
                                                                                                  <Link href={route('product.show', item.slug)}>
                                                                                                         {isNormalList ? "Buy Now" : "Place Bid"}
                                                                                                  </Link>
                                                                                           </div>
                                                                                    </div>
                                                                             </div>
                                                                      </Link>
                                                               </SwiperSlide>
                                                        );
                                                 })}
                                          </Swiper>
                                   </div>
                            </div>
                     </section>
                     <style>{`
                            .product-box {
                                   text-decoration: none !important;
                            }
                            .product-box:hover .pro-title h2 {
                                   color: #111827 !important;
                            }
                            .pro-title h2 {
                                   color: #23262F;
                                   transition: color 0.3s ease;
                                   font-size: 18px;
                                   font-weight: 700;
                            }
                     `}</style>
              </>
       );
}
