import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

export default function HeroSwiper({ slides }) {
       return (
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
                     {slides.map((slide, index) => {
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
                                                               fetchpriority={isFirst ? "high" : "low"}
                                                               decoding={isFirst ? "sync" : "async"}
                                                               className="hero-banner-image"
                                                        />
                                                 </picture>
                                          </Link>
                                   </SwiperSlide>
                            );
                     })}
              </Swiper>
       );
}

