"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { CountdownTimer } from "@/components/CountdownTimer";

type Props = {
  images: string[];
  title: string;
  status?: string;
  listingType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  youtubeVideoId?: string | null;
};

function isVideoFile(filename: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv"];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return videoExtensions.includes(extension);
}

function mediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path.replace(/^\/+/, "")}`;
}

export function Gallery({
  images,
  title,
  status,
  listingType,
  startDate,
  endDate,
  youtubeVideoId,
}: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const list = images.filter(Boolean);
  const youtubeMedia =
    youtubeVideoId && youtubeVideoId.length === 11
      ? [{ type: "youtube" as const, src: youtubeVideoId }]
      : [];

  const albumMedia = list.map((src) => ({
    type: isVideoFile(src) ? ("video" as const) : ("image" as const),
    src,
  }));

  const allMedia = [...youtubeMedia, ...albumMedia];
  const statusNorm = String(status || "").trim().toLowerCase();
  const isAuction = ["auction", "live_auction"].includes(
    String(listingType || "").toLowerCase()
  );

  if (!allMedia.length) {
    return (
      <div
        className="product-images-parent m-0 bg-light rounded-4"
        style={{ minHeight: 280 }}
      />
    );
  }

  return (
    <div className="product-images-parent m-0">
      <div className="product-main-image" style={{ position: "relative" }}>
        {(statusNorm === "awarded" || statusNorm === "awarded ") && (
          <div
            className="awardedBadge"
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              background: "linear-gradient(135deg, #43ACE9 0%, #0ea5e9 100%)",
              color: "white",
              padding: "8px 24px",
              borderRadius: 50,
              fontWeight: 800,
              fontSize: "0.9rem",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              boxShadow: "0 10px 15px -3px rgba(67, 172, 233, 0.4)",
              whiteSpace: "nowrap",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            AWARDED
          </div>
        )}

        {(statusNorm === "sold_out" || statusNorm === "sold out") && (
          <div
            className="soldOutBadge"
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              background: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
              color: "white",
              padding: "8px 24px",
              borderRadius: 50,
              fontWeight: 800,
              fontSize: "0.9rem",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.35)",
              whiteSpace: "nowrap",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            SOLD OUT
          </div>
        )}

        {isAuction && endDate && statusNorm !== "sold_out" && statusNorm !== "sold out" ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 18,
              zIndex: 15,
              pointerEvents: "none",
            }}
          >
            <CountdownTimer endDate={endDate} className="detail-image-timer" />
          </div>
        ) : null}

        <button
          ref={prevRef}
          type="button"
          className="btn-prev"
          aria-label="Previous image"
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          ‹
        </button>
        <button
          ref={nextRef}
          type="button"
          className="btn-next"
          aria-label="Next image"
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          ›
        </button>

        <Swiper
          style={{ margin: 0 }}
          loop={allMedia.length > 1}
          spaceBetween={10}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2 m-0"
        >
          {allMedia.map((media, index) => (
            <SwiperSlide key={`${media.type}-${media.src}-${index}`} style={{ margin: 0 }}>
              <div className="pro-image-main" style={{ position: "relative", width: "100%", minHeight: 500 }}>
                {media.type === "youtube" ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      minHeight: 500,
                      background: "#000",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      title={`${title} video`}
                      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.src)}?rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                    />
                  </div>
                ) : media.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(media.src)}
                    alt={`${title} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 500,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/hero-prodcut1.jpg";
                    }}
                  />
                ) : (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: 500,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  >
                    <source src={mediaUrl(media.src)} type="video/mp4" />
                  </video>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
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
        `}</style>
      </div>

      {allMedia.length > 1 ? (
        <div className="product-images-album" style={{ height: "auto", marginTop: 15, paddingBottom: 5 }}>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={allMedia.length > 4}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper product-thumb-swiper"
          >
            {allMedia.map((media, index) => (
              <SwiperSlide key={`thumb-${media.type}-${media.src}-${index}`} className="product-thumb-slide">
                <div className="pro-image product-thumb-frame">
                  {media.type === "youtube" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        background: `url(https://img.youtube.com/vi/${media.src}/hqdefault.jpg) center/cover`,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "rgba(220, 38, 38, 0.92)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                        }}
                      >
                        <i className="fa-solid fa-play" style={{ fontSize: 13, marginLeft: 2 }} />
                      </span>
                    </div>
                  ) : media.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(media.src)}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/hero-prodcut1.jpg";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        background: "#000",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa-solid fa-play text-white" />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : null}

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
