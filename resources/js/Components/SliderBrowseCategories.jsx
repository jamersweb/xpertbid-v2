import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";

export default function SliderBrowseCategories({ categories }) {
       // categories passed from parent (Home.jsx -> Controller)

       return (
              <section className="browsecategories pt-4 pb-4" style={{ backgroundColor: "#F7F8F9" }}>
                     <div className="container-fluid">
                            {/* Combined Grid View for Desktop */}
                            <div className="categories-grid-container d-none d-md-block">
                                   {categories.map((cat, i) => (
                                          <div className="category-item-wrapper" key={i}>
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
                                          </div>
                                   ))}
                            </div>

                            {/* Mobile Slider View */}
                            <div className="d-md-none">
                                   <Swiper
                                          modules={[Autoplay, Grid]}
                                          grid={{
                                                 rows: 2,
                                                 fill: "row",
                                          }}
                                          autoplay={{ delay: 3000, disableOnInteraction: false }}
                                          slidesPerView={3.5}
                                          spaceBetween={10}
                                          breakpoints={{
                                                 360: { slidesPerView: 4, spaceBetween: 10 },
                                                 480: { slidesPerView: 5.5, spaceBetween: 10 },
                                          }}
                                          className="categories-swiper-no-nav p-2"
                                   >
                                          {categories.map((cat, i) => (
                                                 <SwiperSlide key={i}>
                                                        <Link
                                                               href={`/marketplace?category=${cat.slug}`}
                                                               className="text-decoration-none category-link"
                                                        >
                                                               <div className="category-item-wrapper mobile-item">
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
                                                               </div>
                                                        </Link>
                                                 </SwiperSlide>
                                          ))}
                                   </Swiper>
                            </div>
                     </div>

                     <style>{`
        .section-title {
          font-weight: 700;
          color: #002f34;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .categories-grid-container {
          grid-template-columns: repeat(8, 1fr);
          gap: 25px;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
            .categories-grid-container {
                display: grid !important;
            }
        }

        .category-item-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s ease;
        }
        
        .mobile-item {
            width: 100%;
        }

        .category-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          width: 100%;
        }
        
        .image-circle {
          width: 120px; 
          height: 120px;
          border-radius: 15%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          overflow: hidden;
          background-color: #f2f4f5;
        }

        .category-icon {
          width: 80%;
          height: 80%;
          object-fit: cover;
          border-radius: 10%;
        }

        .category-title-wrapper {
          width: 120px;
          display: flex;
          justify-content: center;
        }

        .category-name {
          font-weight: 700;
          font-size: 14px;
          color: #002f34;
          margin: 0;
          line-height: 1.3;
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

        @media (max-width: 768px) {
           .image-circle {
               width: 80px;
               height: 80px;
           }
           .category-name {
               font-size: 13px;
           }
           .category-title-wrapper {
               width: 90px;
           }
        }
        
        .categories-swiper-no-nav .swiper-button-next,
        .categories-swiper-no-nav .swiper-button-prev { display: none !important; }
      `}</style>
              </section>
       );
}
