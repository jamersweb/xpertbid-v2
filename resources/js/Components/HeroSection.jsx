import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "@inertiajs/react";

const HeroSwiper = lazy(() => import("./HeroSwiper"));

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
       const [sliderReady, setSliderReady] = useState(false);
       const firstSlide = heroSlides[0];

       useEffect(() => {
              let cancelled = false;
              let idleId = null;

              const activate = () => {
                     if (!cancelled) {
                            setSliderReady(true);
                     }
              };

              const timerId = window.setTimeout(() => {
                     if ("requestIdleCallback" in window) {
                            idleId = window.requestIdleCallback(activate, { timeout: 1000 });
                     } else {
                            activate();
                     }
              }, 2500);

              return () => {
                     cancelled = true;
                     window.clearTimeout(timerId);
                     if (idleId !== null && "cancelIdleCallback" in window) {
                            window.cancelIdleCallback(idleId);
                     }
              };
       }, []);

       const handleInteraction = () => {
              if (!sliderReady) {
                     setSliderReady(true);
              }
       };

       const containerClass = fluid
              ? "container-fluid px-3 px-lg-5 hero-container-target"
              : "container hero-container-target";

       const staticFirstSlide = (
              <div className="hero-slider">
                     <Link href={firstSlide.href} className="hero-banner-link">
                            <picture>
                                   <source
                                          media="(max-width: 767px)"
                                          srcSet={firstSlide.mobileImage || firstSlide.image}
                                          type="image/webp"
                                          width="768"
                                          height="480"
                                   />
                                   <img
                                          src={firstSlide.image}
                                          alt="Hero Banner 1"
                                          width={1440}
                                          height={465}
                                          loading="eager"
                                          fetchpriority="high"
                                          decoding="sync"
                                          className="hero-banner-image"
                                   />
                            </picture>
                     </Link>
              </div>
       );

       return (
              <>
                     <section className={`final-banner-section ${className}`}>
                            <div className={containerClass}>
                                   <div
                                          className="hero-banner-shell"
                                          onPointerEnter={handleInteraction}
                                          onTouchStart={handleInteraction}
                                          onMouseDown={handleInteraction}
                                          onFocus={handleInteraction}
                                   >
                                          {sliderReady ? (
                                                 <Suspense fallback={staticFirstSlide}>
                                                        <HeroSwiper slides={heroSlides} />
                                                 </Suspense>
                                          ) : (
                                                 staticFirstSlide
                                          )}
                                   </div>
                            </div>
                     </section>

                     <style dangerouslySetInnerHTML={{ __html: `
        .hero-banner-shell {
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
          border-radius: 32px;
          overflow: hidden;
          height: 420px;
          min-height: 420px;
          position: relative;
          background-color: #f1f5f9;
        }

        .hero-slider,
        .hero-slider .swiper-wrapper,
        .hero-slider .swiper-slide {
          border-radius: 32px;
          height: 420px;
          min-height: 420px;
        }

        .hero-slider {
          overflow: hidden;
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

          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 360px;
            min-height: 360px;
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

          .hero-banner-shell,
          .hero-slider,
          .hero-slider .swiper-wrapper,
          .hero-slider .swiper-slide {
            height: 210px;
            min-height: 210px;
          }
        }
      ` }} />
              </>
       );
}
