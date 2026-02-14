import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

export default function ProductImages({ albumImages, videos = null, status, mainImage }) {
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

       const allMedia = [...processedAlbum, ...processedVideos];

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
                                                        {media.type === 'image' ? (
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
                            `}</style>
                     </div>

                     <div className="product-images-album" style={{ height: "auto", marginTop: '15px', paddingBottom: '5px' }}>
                            <Swiper
                                   onSwiper={setThumbsSwiper}
                                   loop={allMedia.length > 4}
                                   spaceBetween={10}
                                   slidesPerView={4}
                                   freeMode={true}
                                   watchSlidesProgress={true}
                                   modules={[FreeMode, Navigation, Thumbs]}
                                   className="mySwiper"
                            >
                                   {allMedia.map((media, index) => (
                                          <SwiperSlide key={index}>
                                                 <div className="pro-image" style={{ height: "100%", position: "relative", minHeight: "80px" }}>
                                                        {media.type === 'image' ? (
                                                               <img
                                                                      src={getUrl(media.src)}
                                                                      alt={`Thumb ${index}`}
                                                                      style={{ width: '100%', height: '100%', minHeight: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                                      onError={(e) => { e.target.src = '/assets/images/hero-prodcut1.jpg'; }}
                                                               />
                                                        ) : (
                                                               <div style={{
                                                                      position: "relative",
                                                                      width: "100%",
                                                                      height: "100%",
                                                                      minHeight: "80px",
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
              </div>
       );
}
