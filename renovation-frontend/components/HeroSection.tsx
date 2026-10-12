"use client";

import Link from "next/link";
import { assetImage } from "@/lib/site";

const MOBILE_BANNER = {
  image: assetImage("XpertBuildBanner1.png"),
  href: "/properties?listing_type=normal",
  alt: "XpertBuild — Everything your home needs in one place",
};

const DESKTOP_BANNER = {
  image: assetImage("herobanner.png"),
  href: "/properties?listing_type=normal",
  alt: "XpertBuild — Everything your home needs in one place",
};

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

          {/* Desktop / tablet: single herobanner */}
          <div className="d-none d-md-block">
            <Link href={DESKTOP_BANNER.href} className="hero-banner-link">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DESKTOP_BANNER.image}
                alt={DESKTOP_BANNER.alt}
                className="hero-banner-image"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
