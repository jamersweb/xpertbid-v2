import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslate from "@/hooks/useTranslate";
import "swiper/css";

export default function SliderBrowseCategories({ categories }) {
       const { t } = useTranslate();
       const displayCategories = (categories || []).slice(0, 12);
       const assetSrc = (path) => {
              if (!path) return "/images/placeholder.png";
              if (path.startsWith("http")) return path;
              return `${path.startsWith("/") ? "" : "/"}${path}`;
       };

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
                                                 {(() => {
                                                        const media = cat.icon || cat.image;
                                                        const hasIcon = Boolean(cat.icon);
                                                        return (
                                                 <Link
                                                        href={route('marketplace.type', { slug: cat.slug, typeSlug: 'auctions' })}
                                                        className="text-decoration-none category-link"
                                                 >
                                                        <div className={`image-circle ${hasIcon ? 'has-icon' : ''}`}>
                                                               <img
                                                                      src={assetSrc(media)}
                                                                      alt={cat.name}
                                                                      className="category-icon"
                                                               />
                                                        </div>
                                                        <div className="category-title-wrapper">
                                                              <h3 className="category-name">{cat.name}</h3>
                                                        </div>
                                                 </Link>
                                                        );
                                                 })()}
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
          padding: 0 6px 4px;
        }

        .categories-slider .swiper-wrapper {
          align-items: flex-start;
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
          height: 136px;
          padding: 4px 4px 0;
        }
        
        .image-circle {
          width: 84px;
          height: 84px;
          aspect-ratio: 1 / 1;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(67, 172, 233, 0.18);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .category-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .image-circle.has-icon {
          background: #ffffff;
          border-color: rgba(67, 172, 233, 0.28);
          padding: 17px;
        }

        .image-circle.has-icon .category-icon {
          object-fit: contain;
          border-radius: 0;
          mix-blend-mode: multiply;
        }

        .category-title-wrapper {
          width: 100%;
          max-width: 112px;
          height: 38px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 13px;
          color: #092f36;
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
            color: #1d9ed8;
        }

        .category-link:hover .image-circle {
          transform: translateY(-3px) scale(1.02);
          border-color: rgba(67, 172, 233, 0.55);
          box-shadow: 0 14px 30px rgba(67, 172, 233, 0.18);
        }

        @media (min-width: 768px) {
          .categories-slider { padding: 0; }
          .category-link {
            height: 160px;
          }
          .image-circle {
            width: 104px;
            height: 104px;
            border-radius: 28px;
          }
          .image-circle.has-icon {
            padding: 22px;
          }
          .category-title-wrapper {
            max-width: 132px;
            height: 40px;
          }
          .category-name {
            font-size: 14px;
          }
        }
      `}</style>
              </section>
       );
}
