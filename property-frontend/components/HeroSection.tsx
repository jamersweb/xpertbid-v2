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
    image: assetImage("newwban1.webp"),
    mobileImage: assetImage("mob1.webp"),
    href: mainUrl("/1-rupee-auctions"),
    external: true,
  },
  {
    image: assetImage("newwban2.webp"),
    mobileImage: assetImage("mob2.webp"),
    href: "/properties?listing_type=normal",
    external: false,
  },
  {
    image: assetImage("newwban3.webp"),
    mobileImage: assetImage("mob3.webp"),
    href: "/properties?sub_category=for-sale&listing_type=normal",
    external: false,
  },
];

type HeroSectionProps = {
  fluid?: boolean;
  className?: string;
};

export function HeroSection({
  fluid = true,
  className = "my-5",
}: HeroSectionProps = {}) {
  const containerClass = fluid
    ? "container-fluid px-3 px-lg-5 property-hero-container"
    : "container property-hero-container";

  return (
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
            loop
            speed={1000}
            className="hero-slider"
          >
            {heroSlides.map((slide, index) => {
              const isFirst = index === 0;
              const content = (
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={slide.mobileImage || slide.image}
                    type="image/webp"
                    width={768}
                    height={480}
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
              );

              return (
                <SwiperSlide key={slide.image}>
                  {slide.external ? (
                    <a href={slide.href} className="hero-banner-link">
                      {content}
                    </a>
                  ) : (
                    <Link href={slide.href} className="hero-banner-link">
                      {content}
                    </Link>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
