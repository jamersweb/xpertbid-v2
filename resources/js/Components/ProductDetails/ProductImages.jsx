import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import CountdownTimer from "@/Components/CountdownTimer";

export default function ProductImages({ albumImages, videos = null, status, mainImage, listType, startDate, endDate, youtubeVideoId = null }) {
       let parsedAlbum = [];
       if (Array.isArray(albumImages)) {
              parsedAlbum = albumImages;
       } else if (typeof albumImages === 'string') {
              try {
                     parsedAlbum = JSON.parse(albumImages.replace(/\\/g, ""));
              } catch (e) {
                     parsedAlbum = [];
              }
       }

       const [thumbsSwiper, setThumbsSwiper] = useState(null);

       let parsedVideos = [];
       if (Array.isArray(videos)) {
              parsedVideos = videos;
       } else if (typeof videos === 'string' && videos) {
              try {
                     parsedVideos = JSON.parse(videos.replace(/\\/g, ""));
              } catch (e) { }
       }

       const isVideoFile = (filename) => {
              if (!filename || typeof filename !== 'string') return false;
              const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
              const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
              return videoExtensions.includes(extension);
       };

       const processedAlbum = parsedAlbum.map(item => ({
              type: isVideoFile(item) ? 'video' : 'image',
              src: item
       }));

       const processedVideos = parsedVideos.map(item => ({
              type: 'video',
              src: item
       }));

       const youtubeMedia = youtubeVideoId && typeof youtubeVideoId === 'string' && youtubeVideoId.length === 11
              ? [{ type: 'youtube', src: youtubeVideoId }]
              : [];

       const allMedia = [...youtubeMedia, ...processedAlbum, ...processedVideos];

       if (allMedia.length === 0 && mainImage) {
              allMedia.push({ type: 'image', src: mainImage });
       }

       const prevRef = useRef(null);
       const nextRef = useRef(null);

       const getUrl = (path) => {
              if (!path) return '';
              if (path.startsWith('http')) return path;
              const cleanPath = path.startsWith('/') ? path.slice(1) : path;
              return `https://admin.xpertbid.com/${cleanPath}`;
       };

       return (
              <div className="product-images-parent m-0">
                     <div className="product-main-image" style={{ position: "relative" }}>
                            {(status === 'awarded' || status === 'awarded ') && (
                                   <div className="awardedBadge" style={{
                                          position: 'absolute',
                                          bottom: '20px',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          zIndex: 20,
                                          background: 'linear-gradient(135deg, #43ACE9 0%, #0ea5e9 100%)',
                                          color: 'white',
                                          padding: '8px 24px',
                                          borderRadius: '50px',
                                          fontWeight: '800',
                                          fontSize: '0.9rem',
                                          letterSpacing: '1.5px',
                                          textTransform: 'uppercase',
                                          boxShadow: '0 10px 15px -3px rgba(67, 172, 233, 0.4)',
                                          whiteSpace: 'nowrap',
                                          border: '2px solid rgba(255, 255, 255, 0.2)',
                                          animation: 'pulseGlow 2s infinite'
                                   }}>
                                          AWARDED
                                   </div>
                            )}

                            {String(listType || '').toLowerCase() === 'auction' && endDate && (
                                   <div style={{
                                          position: 'absolute',
                                          left: '0',
                                          right: '0',
                                          bottom: '18px',
                                          zIndex: 15,
                                          pointerEvents: 'none',
                                   }}>
                                          <CountdownTimer startDate={startDate} endDate={endDate} className="detail-image-timer" />
                                   </div>
                            )}

                            {/* Custom Controls */}
                            <button
                                   ref={prevRef}
                                   className="btn-prev"
                                   style={{
                                          position: "absolute",
                                          left: 8,
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          zIndex: 20,
                                          border: "none",
                                          background: "rgba(0,0,0,0.45)",
                                          color: "#fff",
                                          width: 36,
                                          height: 36,
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '24px'
                                   }}
                            >
                                   ‹
                            </button>
                            <button
                                   ref={nextRef}
                                   className="btn-next"
                                   style={{
                                          position: "absolute",
                                          right: 8,
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          zIndex: 20,
                                          border: "none",
                                          background: "rgba(0,0,0,0.45)",
                                          color: "#fff",
                                          width: 36,
                                          height: 36,
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '24px'
                                   }}
                            >
                                   ›
                            </button>

                            <Swiper
                                   style={{
                                          "--swiper-navigation-color": "#fff",
                                          "--swiper-pagination-color": "#fff",
                                          margin: "0px",
                                   }}
                                   loop={allMedia.length > 1}
                                   spaceBetween={10}
                                   navigation={{
                                          prevEl: prevRef.current,
                                          nextEl: nextRef.current,
                                   }}
                                   onBeforeInit={(swiper) => {
                                          swiper.params.navigation.prevEl = prevRef.current;
                                          swiper.params.navigation.nextEl = nextRef.current;
                                   }}
                                   thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                   modules={[FreeMode, Navigation, Thumbs]}
                                   className="mySwiper2 m-0"
                            >
                                   {allMedia.map((media, index) => (
                                          <SwiperSlide key={index} style={{ margin: "0px" }}>
                                                 <div className="pro-image-main" style={{ position: 'relative', width: '100%', minHeight: '500px' }}>
                                                        {media.type === 'youtube' ? (
                                                               <div style={{ position: 'relative', width: '100%', minHeight: '500px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
                                                                      <iframe
                                                                             title="YouTube live stream"
                                                                             src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.src)}?rel=0`}
                                                                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                             allowFullScreen
                                                                             loading="lazy"
                                                                             referrerPolicy="strict-origin-when-cross-origin"
                                                                             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                                                                      />
                                                               </div>
                                                        ) : media.type === 'image' ? (
                                                               <img
                                                                      src={getUrl(media.src)}
                                                                      alt={`Product ${index}`}
                                                                      style={{ width: '100%', height: '100%', minHeight: '500px', objectFit: 'cover', borderRadius: '10px' }}
                                                                      onError={(e) => { e.target.src = '/assets/images/hero-prodcut1.jpg'; }}
                                                               />
                                                        ) : (
                                                               <video controls style={{ width: "100%", height: '100%', minHeight: '500px', objectFit: "cover", borderRadius: '10px' }}>
                                                                      <source src={getUrl(media.src)} type="video/mp4" />
                                                               </video>
                                                        )}
                                                 </div>
                                          </SwiperSlide>
                                   ))}
                            </Swiper>

                            <style>{`
                                   @keyframes pulseGlow {
                                          0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0.7); }
                                          50% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 10px rgba(67, 172, 233, 0); }
                                          100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0); }
                                   }
                                   @keyframes timerFloat {
                                          0%, 100% { transform: translateY(0); }
                                          50% { transform: translateY(-2px); }
                                   }
                                   @keyframes timerGlow {
                                          0%, 100% { box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28); }
                                          50% { box-shadow: 0 14px 28px rgba(67, 172, 233, 0.28); }
                                   }
                                   @keyframes digitPulse {
                                          0%, 100% { transform: scale(1); opacity: 1; }
                                          50% { transform: scale(1.06); opacity: 0.96; }
                                   }
                                   .detail-image-timer.counter {
                                          position: relative;
                                          margin: 0 auto;
                                          width: calc(100% - 32px);
                                          max-width: 360px;
                                          background: rgba(28, 29, 32, 0.88);
                                          padding: 10px 14px;
                                          border-radius: 12px;
                                          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
                                          backdrop-filter: blur(4px);
                                          border: 1px solid rgba(255, 255, 255, 0.08);
                                          animation: timerFloat 2.8s ease-in-out infinite, timerGlow 2.8s ease-in-out infinite;
                                   }
                                   .detail-image-timer .counter-grid {
                                          display: grid;
                                          grid-template-columns: repeat(4, 1fr);
                                          gap: 8px;
                                          align-items: stretch;
                                   }
                                   .detail-image-timer .counter-box {
                                          display: flex;
                                          flex-direction: column;
                                          align-items: center;
                                          justify-content: center;
                                          min-width: 0;
                                   }
                                   .detail-image-timer .counter-value {
                                          color: #fff;
                                          font-size: 18px;
                                          font-weight: 800;
                                          line-height: 1.1;
                                          text-align: center;
                                          white-space: nowrap;
                                          animation: digitPulse 1.2s ease-in-out infinite;
                                    }
                                    .detail-image-timer .counter-label {
                                          color: rgba(255, 255, 255, 0.88);
                                          font-size: 9px;
                                          font-weight: 600;
                                          text-transform: uppercase;
                                          letter-spacing: 0.5px;
                                          text-align: center;
                                          white-space: nowrap;
                                   }
                                    @media (max-width: 575px) {
                                          .detail-image-timer.counter {
                                                 width: calc(100% - 20px);
                                                 padding: 8px 10px;
                                          }
                                          .detail-image-timer .counter-grid {
                                                 gap: 6px;
                                          }
                                          .detail-image-timer .counter-value {
                                                 font-size: 16px;
                                          }
                                          .detail-image-timer .counter-label {
                                                 font-size: 8px;
                                          }
                                   }
                            `}</style>
                     </div>

                     <div className="product-images-album" style={{ height: "auto", marginTop: '15px', paddingBottom: '5px' }}>
                            <Swiper
                                   onSwiper={setThumbsSwiper}
                                   loop={allMedia.length > 4}
                                   spaceBetween={10}
                                   slidesPerView="auto"
                                   freeMode={true}
                                   watchSlidesProgress={true}
                                   modules={[FreeMode, Navigation, Thumbs]}
                                   className="mySwiper product-thumb-swiper"
                            >
                                   {allMedia.map((media, index) => (
                                          <SwiperSlide key={index} className="product-thumb-slide">
                                                 <div className="pro-image product-thumb-frame">
                                                        {media.type === 'youtube' ? (
                                                               <div style={{
                                                                      position: "relative",
                                                                      width: "100%",
                                                                      height: "100%",
                                                                      background: `url(https://img.youtube.com/vi/${media.src}/hqdefault.jpg) center/cover`,
                                                                      borderRadius: "8px",
                                                                      display: 'flex',
                                                                      alignItems: 'center',
                                                                      justifyContent: 'center'
                                                               }}>
                                                                      <span style={{
                                                                             width: 34,
                                                                             height: 34,
                                                                             borderRadius: '50%',
                                                                             background: 'rgba(220, 38, 38, 0.92)',
                                                                             color: '#fff',
                                                                             display: 'flex',
                                                                             alignItems: 'center',
                                                                             justifyContent: 'center',
                                                                             boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
                                                                      }}>
                                                                             <i className="fa-solid fa-play" style={{ fontSize: 13, marginLeft: 2 }}></i>
                                                                      </span>
                                                               </div>
                                                        ) : media.type === 'image' ? (
                                                               <img
                                                                      src={getUrl(media.src)}
                                                                      alt={`Thumb ${index}`}
                                                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                                      onError={(e) => { e.target.src = '/assets/images/hero-prodcut1.jpg'; }}
                                                               />
                                                        ) : (
                                                               <div style={{
                                                                      position: "relative",
                                                                      width: "100%",
                                                                      height: "100%",
                                                                      background: "#000",
                                                                      borderRadius: "8px",
                                                                      display: 'flex',
                                                                      alignItems: 'center',
                                                                      justifyContent: 'center'
                                                               }}>
                                                                      <i className="fa-solid fa-play text-white"></i>
                                                               </div>
                                                        )}
                                                 </div>
                                          </SwiperSlide>
                                   ))}
                            </Swiper>
                     </div>
                     <style>{`
                            .product-thumb-swiper {
                                   width: 100%;
                                   padding: 2px 0 8px;
                            }
                            .product-thumb-swiper .swiper-wrapper {
                                   align-items: flex-start;
                            }
                            .product-thumb-slide {
                                   width: 76px !important;
                                   height: 88px !important;
                                   flex: 0 0 76px;
                            }
                            .product-thumb-frame {
                                   width: 76px;
                                   height: 88px;
                                   min-width: 76px;
                                   max-width: 76px;
                                   min-height: 88px;
                                   max-height: 88px;
                                   position: relative;
                                   overflow: hidden;
                                   border-radius: 8px;
                                   background: #f1f5f9;
                            }
                            .product-thumb-frame img,
                            .product-thumb-frame video {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            @media (max-width: 575px) {
                                   .product-thumb-slide {
                                          width: 64px !important;
                                          height: 76px !important;
                                          flex-basis: 64px;
                                   }
                                   .product-thumb-frame {
                                          width: 64px;
                                          height: 76px;
                                          min-width: 64px;
                                          max-width: 64px;
                                          min-height: 76px;
                                          max-height: 76px;
                                   }
                            }
                     `}</style>
              </div>
       );
}
