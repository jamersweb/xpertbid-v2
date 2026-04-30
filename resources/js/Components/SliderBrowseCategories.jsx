import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslate from "@/hooks/useTranslate";
import "swiper/css";

export default function SliderBrowseCategories({ categories }) {
       const { t } = useTranslate();
       const displayCategories = (categories || []).slice(0, 12);

       if (!displayCategories.length) return null;

       return (
              <section className="browsecategories pt-4 pb-4" style={{ backgroundColor: "#F7F8F9" }}>
                     <div className="container-fluid">
                            <div className="home-section-header mb-3">
                                   <div className="featured-heading mb-0">
                                          <h2>{t('Categories')}</h2>
                                   </div>
                                   <Link href={route('categories.page')} className="section-view-all-btn">{t('View All')}</Link>
                            </div>

                            <Swiper
                                   className="categories-slider"
                                   spaceBetween={14}
                                   slidesPerView={3.1}
                                   breakpoints={{
                                          576: { slidesPerView: 3.6, spaceBetween: 14 },
                                          768: { slidesPerView: 5, spaceBetween: 18 },
                                          992: { slidesPerView: 6, spaceBetween: 20 },
                                          1200: { slidesPerView: 7, spaceBetween: 20 },
                                   }}
                            >
                                   {displayCategories.map((cat, i) => (
                                          <SwiperSlide className="category-item-wrapper" key={cat.id || i}>
                                                 <Link
                                                        href={`/marketplace?category=${cat.slug}`}
                                                        className="text-decoration-none category-link"
                                                 >
                                                        <div className="image-circle">
                                                               <img
                                                                      src={`${cat.image?.startsWith("/") ? "" : "/"}${cat.image ?? "images/placeholder.png"}`}
                                                                      alt={cat.name}
                                                                      className="category-icon"
                                                               />
                                                        </div>
                                                        <div className="category-title-wrapper">
                                                               <h3 className="category-name">{cat.name}</h3>
                                                        </div>
                                                 </Link>
                                          </SwiperSlide>
                                   ))}
                            </Swiper>
                     </div>

                     <style>{`
        .section-title {
          font-weight: 700;
          color: #002f34;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .categories-slider {
          padding: 0 6px;
        }

        .category-item-wrapper {
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .category-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          width: 100%;
        }
        
        .image-circle {
          width: 100%;
          max-width: 110px;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          overflow: hidden;
          background-color: #f2f4f5;
        }

        .category-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .category-title-wrapper {
          width: 100%;
          max-width: 110px;
          display: flex;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 13px;
          color: #002f34;
          margin: 0;
          line-height: 1.25;
          text-transform: capitalize;
          word-wrap: break-word;
          
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-item-wrapper:hover .category-name {
            color: #3a77ff;
        }

        @media (min-width: 768px) {
          .categories-slider { padding: 0; }
          .image-circle,
          .category-title-wrapper {
            max-width: 150px;
          }
          .category-name {
            font-size: 14px;
          }
        }
      `}</style>
              </section>
       );
}
