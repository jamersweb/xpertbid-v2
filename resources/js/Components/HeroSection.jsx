import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

const heroSlides = [
       {
              image: "/assets/images/1_rupee.png",
              mobileImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
              href: "/1-rupee-auctions",
       },
       {
              image: "/assets/images/WebsiteBanner1.png",
              mobileImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80",
              href: "/marketplace",
       },
       {
              image: "/assets/images/WebsiteBanner2.png",
              mobileImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
              href: "/search",
       },
       {
              image: "/assets/images/WebsiteBanner3.png",
              mobileImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
              href: "/marketplace",
       },
];

export default function HeroSection() {
       return (
              <>
                     <section className="final-banner-section my-5">
                            <div className="container">
                                   <div className="hero-banner-shell">
                                          <Swiper
                                                 modules={[Autoplay, EffectFade]}
                                                 effect="fade"
                                                 autoplay={{
                                                        delay: 3000,
                                                        disableOnInteraction: false,
                                                 }}
                                                 loop={true}
                                                 speed={1000}
                                                 className="hero-slider"
                                          >
                                                 {heroSlides.map((slide, index) => (
                                                        <SwiperSlide key={slide.image}>
                                                               <Link href={slide.href} className="hero-banner-link">
                                                                      <picture>
                                                                             <source media="(max-width: 767px)" srcSet={slide.mobileImage || slide.image} />
                                                                             <img src={slide.image} alt={`Hero Banner ${index + 1}`} className="hero-banner-image" />
                                                                      </picture>
                                                               </Link>
                                                        </SwiperSlide>
                                                 ))}
                                          </Swiper>
                                   </div>
                            </div>
                     </section>

                     <style>{`
        .hero-banner-shell {
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-slider,
        .hero-slider .swiper-wrapper,
        .hero-slider .swiper-slide {
          border-radius: 32px;
        }

        /* Override global swiper flex-centering so slide content can stretch full width */
        .hero-slider .swiper-slide {
          display: block !important;
        }

        .hero-banner-link {
          display: block;
          width: 100%;
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-banner-image {
          width: 100%;
       //    height: 520px;
          object-fit: cover;
          display: block;
        }

        .hero-slider .swiper-button-prev,
        .hero-slider .swiper-button-next {
          display: none !important;
        }

        @media (min-width: 1500px) {
          .final-banner-section .container {
            max-width: 1380px;
          }
        }

        @media (max-width: 991px) {
          .hero-banner-image {
            height: 430px;
          }

          .hero-banner-content {
            left: 28px;
            right: 28px;
            bottom: 28px;
          }
        }

        @media (max-width: 767px) {
          .final-banner-section {
            margin-top: 24px !important;
            margin-bottom: 24px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .final-banner-section .container {
            --bs-gutter-x: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide,
          .hero-banner-link {
            border-radius: 24px;
          }
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-banner-shell {
            box-shadow: none;
            background: transparent;
            margin-left: 0;
            margin-right: 0;
          }
          .hero-slider .swiper-slide {
            background: transparent;
          }
          .hero-banner-link picture {
            display: block;
            line-height: 0;
          }

          .hero-banner-image {
            height: 210px;
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
              </>
       );
}
