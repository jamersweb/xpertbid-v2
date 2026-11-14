import { Head, Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

const heroSlides = [
       {
              image: "/assets/images/newwban1.webp",
              mobileImage: "/assets/images/mob1.webp",
              href: "/1-rupee-auctions",
       },
       {
              image: "/assets/images/newwban2.webp",
              mobileImage: "/assets/images/mob2.webp",
              href: "/marketplace",
       },
       {
              image: "/assets/images/newwban3.webp",
              mobileImage: "/assets/images/mob3.webp",
              href: "/marketplace?type=auction",
       },
];

export default function HeroSection({ fluid = false, className = "my-5" } = {}) {
       const containerClass = fluid
              ? "container-fluid px-3 px-lg-5 hero-container-target"
              : "container hero-container-target";

       return (
              <>
                     <Head>
                            <link
                                   rel="preload"
                                   as="image"
                                   href={heroSlides[0].image}
                                   media="(min-width: 768px)"
                                   type="image/webp"
                                   fetchPriority="high"
                            />
                            <link
                                   rel="preload"
                                   as="image"
                                   href={heroSlides[0].mobileImage}
                                   media="(max-width: 767px)"
                                   type="image/webp"
                                   fetchPriority="high"
                            />
                     </Head>

                     <section className={`final-banner-section ${className}`}>
                            <div className={containerClass}>
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
                                                 {heroSlides.map((slide, index) => {
                                                        const isFirst = index === 0;
                                                        return (
                                                               <SwiperSlide key={slide.image}>
                                                                      <Link href={slide.href} className="hero-banner-link">
                                                                             <picture>
                                                                                    <source
                                                                                           media="(max-width: 767px)"
                                                                                           srcSet={slide.mobileImage || slide.image}
                                                                                           type="image/webp"
                                                                                           width="768"
                                                                                           height="480"
                                                                                    />
                                                                                    <img
                                                                                           src={slide.image}
                                                                                           alt={`Hero Banner ${index + 1}`}
                                                                                           width={1440}
                                                                                           height={465}
                                                                                           loading={isFirst ? "eager" : "lazy"}
                                                                                           fetchPriority={isFirst ? "high" : "low"}
                                                                                           decoding={isFirst ? "sync" : "async"}
                                                                                           className="hero-banner-image"
                                                                                    />
                                                                             </picture>
                                                                      </Link>
                                                               </SwiperSlide>
                                                        );
                                                 })}
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
          height: 420px;
        }

        /* Override global swiper flex-centering so slide content can stretch full width */
        .hero-slider .swiper-slide {
          display: block !important;
        }

        .hero-banner-link {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
        }

        .hero-banner-link picture {
          display: block;
          width: 100%;
          height: 100%;
          line-height: 0;
        }

        .hero-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1440 / 465;
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
            height: 100%;
          }

          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 360px;
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
          .final-banner-section .hero-container-target {
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
            height: 100%;
            width: 100%;
            max-width: 100%;
            aspect-ratio: 768 / 480;
          }

          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 210px;
          }
        }
      `}</style>
              </>
       );
}
