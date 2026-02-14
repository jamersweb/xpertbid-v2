import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaClock, FaLock, FaGlobe, FaClipboardList } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

export default function WhyChooseXpertBid() {
       const whyChooseData = [
              {
                     icon: <FaClock />, title: "Real-time Auctions", description: "Get better offers through live bidding."
              },
              {
                     icon: <FaGlobe />, title: "Wide Market Reach", description: "Pakistan, UAE & expanding regions."
              },
              {
                     icon: <FaClipboardList />, title: "Easy Listing & Tracking", description: "Tools to list and manage all your sales."
              }
       ];

       return (
              <section className="why-choose-section pt-5 bg-light">
                     <div className="container">
                            <h2 className="text-center mb-4 heading-text" style={{ fontWeight: 700, color: "#333" }}>Why Choose XpertBid?</h2>
                            <Swiper
                                   modules={[Autoplay, Pagination]}
                                   autoplay={{ delay: 3000, disableOnInteraction: false }}
                                   loop={true}
                                   pagination={{ clickable: true }}
                                   spaceBetween={30}
                                   breakpoints={{
                                          360: { slidesPerView: 1 },
                                          640: { slidesPerView: 2 },
                                          1024: { slidesPerView: 3 },
                                          1400: { slidesPerView: 3 },
                                   }}
                                   className="pb-5"
                            >
                                   {whyChooseData.map((item, index) => (
                                          <SwiperSlide key={index} className="h-auto">
                                                 <div className="card list-card text-center px-4 py-4 h-100 d-flex flex-column justify-content-center align-items-center">
                                                        <div className="icon-box mb-3">{item.icon}</div>
                                                        <h5>{item.title}</h5>
                                                        <p>{item.description}</p>
                                                 </div>
                                          </SwiperSlide>
                                   ))}
                            </Swiper>
                     </div>

                     <style>{`
        .why-choose-section {
            background-color: #f8f9fa !important; /* bg-light */
        }
        .heading-text {
          font-weight: 700;
          color: #333;
          font-size: 30px;
        }

        .swiper-slide {
          display: flex;
          height: auto;
        }

        .list-card {
          flex: 1;
          border: 2px solid transparent;
          border-radius: 10px;
          background: #f9f9f9;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 260px;
        }

        .list-card:hover {
          border: 2px solid #43ACE9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .icon-box {
          font-size: 2.5rem;
          color: #43ACE9;
          transition: transform 0.3s ease;
        }

        .list-card:hover .icon-box {
          transform: rotate(360deg);
        }

        .list-card h5 {
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .list-card p {
          color: #666;
          margin-bottom: 0;
        }

        .home-page .why-choose-section .swiper-pagination {
          margin-top: 20px;
        }

        @media (max-width: 767px) {
          .home-page .why-choose-section.py-5 {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }

          .home-page .why-choose-section .heading-text {
            margin-bottom: 20px !important;
          }

          .home-page .why-choose-section .swiper-pagination {
            display: none !important;
          }
        }
      `}</style>
              </section>
       );
}
