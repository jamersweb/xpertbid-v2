import { useState } from "react";
import { Link, usePage, router } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useAuthModal } from '@/Contexts/AuthModalContext';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

export default function HeroSection() {
       const { auth } = usePage().props;
       const user = auth.user;
       const { openLogin } = useAuthModal();

       const [activeIndex, setActiveIndex] = useState(0);

       const handleSellClick = (e) => {
              e.preventDefault();
              if (!user) {
                     openLogin();
              } else {
                     router.visit("/sell");
              }
       };

       return (
              <>
                     <div className="final-banner-section">
                            <div className="container-fluid p-0">
                                   <div className="banner-image-wrapper" style={{ position: 'relative', width: '100%' }}>

                                          <Swiper
                                                 modules={[Autoplay, EffectFade]}
                                                 effect="fade"
                                                 autoplay={{
                                                        delay: 4000,
                                                        disableOnInteraction: false,
                                                 }}
                                                 loop={true}
                                                 speed={1000}
                                                 className="hero-slider"
                                                 onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                          >
                                                 <SwiperSlide>
                                                        <Link href="/1-rupee-auctions" style={{ cursor: "pointer", display: "block" }}>
                                                               <img
                                                                      src="/assets/images/1_rupee.png"
                                                                      alt="1 Rupee Auction Banner"
                                                                      style={{ width: '100%', height: 'auto', display: 'block' }}
                                                               />
                                                        </Link>
                                                 </SwiperSlide>
                                                 <SwiperSlide>
                                                        <img
                                                               src="/assets/images/WebsiteBanner1.png"
                                                               alt="Hero Banner 1"
                                                               style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        />
                                                 </SwiperSlide>
                                                 <SwiperSlide>
                                                        <img
                                                               src="/assets/images/WebsiteBanner2.png"
                                                               alt="Hero Banner 2"
                                                               style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        />
                                                 </SwiperSlide>
                                                 <SwiperSlide>
                                                        <img
                                                               src="/assets/images/WebsiteBanner3.png"
                                                               alt="Hero Banner 3"
                                                               style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        />
                                                 </SwiperSlide>
                                          </Swiper>

                                          {activeIndex !== 0 && (
                                                 <div className="banner-buttons d-none d-md-flex">
                                                        <Link href="/marketplace" className="banner-btn bid-now-btn">
                                                               Bid Now
                                                        </Link>
                                                        <button onClick={handleSellClick} className="banner-btn sell-now-btn">
                                                               Sell Now
                                                        </button>
                                                 </div>
                                          )}
                                   </div>
                            </div>
                     </div>

                     <style>{`
        .banner-image-wrapper {
          position: relative !important;
          width: 100% !important;
        }

        .banner-buttons {
          position: absolute !important;
          bottom: 17% !important;
          left: 45px !important;
          display: flex ;
          gap: 15px !important;
          flex-wrap: wrap !important;
          z-index: 10 !important;
        }

        .banner-btn {
          padding: 0 !important;
          width: 180px !important;
          height: 50px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          border: 2px solid transparent !important;
        }

        .bid-now-btn {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
        }

        .bid-now-btn:hover {
          background-color: #111111 !important;
          border-color: #111111 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }

        .sell-now-btn {
          background-color: transparent !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }

        .sell-now-btn:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }

        @media (max-width: 992px) {
          .banner-btn {
            width: 160px !important;
            height: 45px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 768px) {
          .banner-buttons {
            bottom: 15% !important;
            left: 20px !important;
            gap: 12px !important;
            justify-content: flex-start !important;
          }

          .banner-btn {
            width: 140px !important;
            height: 42px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 576px) {
          .banner-buttons {
            bottom: 10% !important;
            left: 15px !important;
            right: 15px !important;
            gap: 10px !important;
          }

          .banner-btn {
            width: calc(20% - 5px) !important;
            height: 40px !important;
            font-size: 13px !important;
          }

          .sell-now-btn {
            color: #fff !important;
            background-color: #000 !important;
          }
        }

        @media (max-width: 480px) {
          .banner-buttons {
            gap: 8px !important;
          }

          .banner-btn {
            height: 38px !important;
            font-size: 12px !important;
          }
        }

        .hero-slider .swiper-wrapper {
          margin: 0 !important;
        }
      `}</style>
              </>
       );
}
