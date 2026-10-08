"use client";

import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { assetImage, mainUrl } from "@/lib/site";

const MOBILE_BANNER = {
  image: assetImage("XpertBuildBanner1.png"),
  href: "/properties?listing_type=normal",
  alt: "XpertBuild — Everything your home needs in one place",
};

const desktopSlides = [
  {
    image: assetImage("newwban1.png"),
    href: mainUrl("/1-rupee-auctions"),
    external: true,
  },
  {
    image: assetImage("newwban2.png"),
    href: "/properties?listing_type=normal",
    external: false,
  },
  {
    image: assetImage("newwban3.png"),
    href: "/properties?listing_type=normal",
    external: false,
  },
];

export function HeroSection() {
  return (
    <section className="final-banner-section my-5">
      <div className="container-fluid px-3 px-lg-5 property-hero-container">
        <div className="hero-banner-shell">
          {/* Mobile: single static banner */}
          <div className="d-md-none">
            <Link href={MOBILE_BANNER.href} className="hero-banner-link">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MOBILE_BANNER.image}
                alt={MOBILE_BANNER.alt}
                className="hero-banner-image"
              />
            </Link>
          </div>

          {/* Desktop / tablet: carousel */}
          <div className="d-none d-md-block">
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
              {desktopSlides.map((slide, index) => (
                <SwiperSlide key={slide.image}>
                  {slide.external ? (
                    <a href={slide.href} className="hero-banner-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={`Hero Banner ${index + 1}`}
                        className="hero-banner-image"
                      />
                    </a>
                  ) : (
                    <Link href={slide.href} className="hero-banner-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={`Hero Banner ${index + 1}`}
                        className="hero-banner-image"
                      />
                    </Link>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
