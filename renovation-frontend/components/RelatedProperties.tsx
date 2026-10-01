"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { PropertyCard } from "@/types/property";
import { PropertyCardView } from "@/components/PropertyCard";

type Props = {
  items: PropertyCard[];
};

export function RelatedProperties({ items }: Props) {
  if (!items?.length) return null;

  return (
    <section className="featured-product related-items-section">
      <div className="container-fluid ps-sm-5">
        <div className="product-detail">
          <h2>Other items of interest</h2>
        </div>

        <div className="swiper-featured-product related-items-slider">
          <Swiper
            modules={[Navigation]}
            navigation={items.length > 4}
            spaceBetween={30}
            loop={items.length > 4}
            breakpoints={{
              390: { slidesPerView: 1 },
              550: { slidesPerView: 2 },
              888: { slidesPerView: 2 },
              1024: { slidesPerView: 3.2 },
              1367: { slidesPerView: 3.6 },
              1567: { slidesPerView: 4 },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <PropertyCardView property={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
