"use client";

import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { assetImage, mainUrl } from "@/lib/site";

const heroSlides = [
  {
    image: assetImage("newwban1.png"),
    mobileImage: assetImage("mob1.png"),
    href: mainUrl("/1-rupee-auctions"),
    external: true,
  },
  {
    image: assetImage("newwban2.png"),
    mobileImage: assetImage("mob2.png"),
    href: "/properties?listing_type=normal",
    external: false,
  },
  {
    image: assetImage("newwban3.png"),
    mobileImage: assetImage("mob3.png"),
    href: "/properties?sub_category=for-sale&listing_type=normal",
    external: false,
  },
];

export function HeroSection() {
  return (
    <section className="final-banner-section my-5">
      <div className="container-fluid px-3 px-lg-5 property-hero-container">
        <div className="hero-banner-shell">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop
            speed={1000}
            className="hero-slider"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={slide.image}>
                {slide.external ? (
                  <a href={slide.href} className="hero-banner-link">
                    <picture>
                      <source
                        media="(max-width: 767px)"
                        srcSet={slide.mobileImage || slide.image}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={`Hero Banner ${index + 1}`}
                        className="hero-banner-image"
                      />
                    </picture>
                  </a>
                ) : (
                  <Link href={slide.href} className="hero-banner-link">
                    <picture>
                      <source
                        media="(max-width: 767px)"
                        srcSet={slide.mobileImage || slide.image}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={`Hero Banner ${index + 1}`}
                        className="hero-banner-image"
                      />
                    </picture>
                  </Link>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
