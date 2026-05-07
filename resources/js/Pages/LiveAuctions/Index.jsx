import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const thumbnailFor = (auction) => {
       if (auction?.youtube_video_id) {
              return `https://img.youtube.com/vi/${auction.youtube_video_id}/hqdefault.jpg`;
       }

       return auction?.image_url || "/assets/images/WebsiteBanner2.png";
};

const thumbnailForVideoId = (videoId, fallbackAuction = null) => {
       if (videoId) {
              return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
       }

       return thumbnailFor(fallbackAuction);
};

const relativeTimeAgo = (value) => {
       if (!value) return "";
       const then = new Date(value).getTime();
       if (!Number.isFinite(then)) return "";

       const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
       if (seconds < 60) return "just now";

       const minutes = Math.floor(seconds / 60);
       if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

       const hours = Math.floor(minutes / 60);
       if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

       const days = Math.floor(hours / 24);
       return `${days} day${days === 1 ? "" : "s"} ago`;
};

const formatDateTime = (value) => {
       if (!value) return "";
       const date = new Date(value);
       if (Number.isNaN(date.getTime())) return "";

       return date.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
       });
};

function JoinLiveButton({ activeSlug }) {
       const { auth } = usePage().props;
       const isLoggedIn = Boolean(auth?.user);

       const handleJoin = () => {
              if (!activeSlug) return;

              if (!isLoggedIn) {
                     router.visit("/live-auctions?auth=register", {
                            preserveScroll: true,
                            preserveState: true,
                     });
                     return;
              }

              router.visit(route("product.show", activeSlug));
       };

       return (
              <button type="button" className={`live-auctions-primary ${!activeSlug ? "is-disabled" : ""}`} onClick={handleJoin} disabled={!activeSlug}>
                     <i className="fa-solid fa-bolt"></i>
                     {activeSlug ? "Join Live Auction" : "No Live Auction"}
              </button>
       );
}

export default function LiveAuctionsIndex({ session, activeAuction = null }) {
       const [, setTimeTick] = useState(0);
       const sessionStatus = String(session?.status || "").trim().toLowerCase();
       const activeStatus = String(activeAuction?.status || "").trim().toLowerCase();
       const activeSlug = sessionStatus === "active" && activeStatus === "active" ? activeAuction?.slug : null;
       const hasActiveLive = Boolean(activeSlug);
       const isComingSoon = sessionStatus === "soon";
       const isClosed = sessionStatus === "closed";
       const isIdle = !hasActiveLive && !isComingSoon && !isClosed;
       const liveSetupThumbnail = thumbnailForVideoId(session?.youtube_video_id, activeAuction);
       const scheduledLabel = formatDateTime(session?.scheduled_at);
       const closedLabel = isClosed ? relativeTimeAgo(session?.closed_at || session?.updated_at) : "";
       const heroTitle = hasActiveLive
              ? "Live auction is on"
              : isComingSoon
                    ? "Live auction coming soon"
                    : isClosed
                          ? "Live auction closed"
                          : "No live auction right now";
       const heroCopy = hasActiveLive
              ? "Watch the stream, follow the active product, and place bids in real time."
              : isComingSoon
                    ? scheduledLabel
                          ? `The next live auction is scheduled for ${scheduledLabel}.`
                          : "The next live auction is being prepared. Check back soon."
                    : isClosed && closedLabel
                          ? `This live auction closed ${closedLabel}.`
                          : "Please check back later for the next live auction.";

       useEffect(() => {
              const refreshLiveState = () => {
                     router.reload({
                            only: ["session", "liveAuctions", "activeAuction"],
                            preserveScroll: true,
                            preserveState: true,
                            showProgress: false,
                     });
                     setTimeTick((tick) => tick + 1);
              };

              const timer = window.setInterval(refreshLiveState, 2500);
              return () => window.clearInterval(timer);
       }, []);

       return (
              <AppLayout title="Live Auctions | XpertBid">
                     <main className={`live-auctions-page state-${sessionStatus || "idle"}`}>
                            <section className="live-auctions-hero">
                                   <div className="live-auctions-hero-copy">
                                          <span className={`live-auctions-kicker ${hasActiveLive ? "is-live" : ""}`}>
                                                 <i className={hasActiveLive ? "fa-solid fa-circle" : "fa-regular fa-circle"}></i>
                                                 Live Auction Room
                                          </span>
                                          <h1>{heroTitle}</h1>
                                          <p>{heroCopy}</p>

                                          <div className="live-auctions-actions">
                                                 {hasActiveLive ? <JoinLiveButton activeSlug={activeSlug} /> : null}
                                                 {isComingSoon ? <span className="live-auctions-pill">Starting Soon</span> : null}
                                                 {isClosed && closedLabel ? <span className="live-auctions-pill">Closed {closedLabel}</span> : null}
                                                 {isIdle ? <span className="live-auctions-pill">Awaiting Schedule</span> : null}
                                          </div>
                                   </div>

                                   <div className="live-auctions-feature">
                                          {hasActiveLive || isComingSoon ? (
                                                 <>
                                                        <img src={liveSetupThumbnail} alt={activeAuction?.title || "Live auction"} />
                                                        <div className="live-auctions-feature-overlay">
                                                               <span>{hasActiveLive ? "Streaming Now" : "Preview"}</span>
                                                               <i className="fa-solid fa-play"></i>
                                                        </div>
                                                 </>
                                          ) : (
                                                 <div className="live-auctions-empty-feature">
                                                        <i className="fa-solid fa-tower-broadcast"></i>
                                                        <span>No live stream right now</span>
                                                 </div>
                                          )}
                                   </div>
                            </section>

                     </main>

                     <style>{`
                            .live-auctions-page {
                                   background:
                                          linear-gradient(180deg, rgba(67, 172, 233, 0.08) 0%, rgba(247, 248, 249, 0.96) 34%, #f7f8f9 100%);
                                   padding: 28px 0 30px;
                                   min-height: auto;
                            }
                            .live-auctions-hero {
                                   width: min(1200px, calc(100% - 32px));
                                   margin: 0 auto;
                            }
                            .live-auctions-hero {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr) minmax(360px, 0.82fr);
                                   gap: 28px;
                                   align-items: stretch;
                                   background: rgba(255, 255, 255, 0.9);
                                   border: 1px solid rgba(203, 213, 225, 0.8);
                                   border-radius: 26px;
                                   padding: 28px;
                                   box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
                                   backdrop-filter: blur(12px);
                            }
                            .live-auctions-hero-copy {
                                   min-height: 310px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                            }
                            .live-auctions-kicker {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 9px;
                                   width: max-content;
                                   color: #64748b;
                                   font-weight: 900;
                                   font-size: 12px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.08em;
                                   margin-bottom: 14px;
                            }
                            .live-auctions-kicker.is-live {
                                   color: #dc2626;
                            }
                            .live-auctions-kicker i {
                                   font-size: 8px;
                            }
                            .live-auctions-kicker.is-live i {
                                   filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.55));
                            }
                            .live-auctions-hero h1 {
                                   max-width: 620px;
                                   font-size: clamp(36px, 5vw, 68px);
                                   line-height: 0.94;
                                   color: #0f172a;
                                   font-weight: 950;
                                   margin: 0 0 18px;
                                   letter-spacing: 0;
                            }
                            .live-auctions-hero p {
                                   color: #52637a;
                                   font-size: 17px;
                                   line-height: 1.7;
                                   max-width: 650px;
                                   margin: 0;
                            }
                            .live-auctions-actions {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   margin-top: 26px;
                            }
                            .live-auctions-primary,
                            .live-auctions-pill {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 9px;
                                   min-height: 50px;
                                   padding: 0 22px;
                                   border-radius: 14px;
                                   font-weight: 900;
                                   text-decoration: none;
                                   border: none;
                            }
                            .live-auctions-primary {
                                   background: #111827;
                                   color: #ffffff;
                                   cursor: pointer;
                                   box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
                                   transition: transform 0.2s ease, box-shadow 0.2s ease;
                            }
                            .live-auctions-primary:hover:not(:disabled) {
                                   transform: translateY(-2px);
                                   box-shadow: 0 18px 38px rgba(15, 23, 42, 0.22);
                            }
                            .live-auctions-primary.is-disabled {
                                   background: #94a3b8;
                                   cursor: not-allowed;
                            }
                            .live-auctions-pill {
                                   background: #eaf6fd;
                                   color: #0369a1;
                            }
                            .live-auctions-feature {
                                   min-height: 310px;
                                   border-radius: 20px;
                                   overflow: hidden;
                                   position: relative;
                                   background: #111827;
                                   box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
                            }
                            .live-auctions-feature img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                            }
                            .live-auctions-feature-overlay {
                                   position: absolute;
                                   inset: auto 18px 18px 18px;
                                   min-height: 58px;
                                   border-radius: 16px;
                                   background: rgba(15, 23, 42, 0.78);
                                   color: #fff;
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   padding: 0 16px;
                                   font-weight: 900;
                                   backdrop-filter: blur(8px);
                            }
                            .live-auctions-feature-overlay i {
                                   width: 40px;
                                   height: 40px;
                                   border-radius: 50%;
                                   background: #43ace9;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                            }
                            .live-auctions-empty-feature {
                                   min-height: 310px;
                                   display: flex;
                                   flex-direction: column;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 12px;
                                   text-align: center;
                                   background:
                                          linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.96)),
                                          radial-gradient(circle at 50% 30%, rgba(67, 172, 233, 0.22), transparent 34%);
                                   color: #ffffff;
                                   font-weight: 900;
                            }
                            .live-auctions-empty-feature i {
                                   font-size: 44px;
                                   color: #43ace9;
                            }
                            @media (max-width: 991px) {
                                   .live-auctions-hero {
                                          grid-template-columns: 1fr;
                                   }
                            }
                            @media (max-width: 640px) {
                                   .live-auctions-page {
                                          padding-top: 16px;
                                          padding-bottom: 22px;
                                   }
                                   .live-auctions-hero {
                                          width: min(100% - 20px, 1200px);
                                   }
                                   .live-auctions-hero {
                                          padding: 18px;
                                          border-radius: 20px;
                                   }
                                   .live-auctions-hero-copy {
                                          min-height: auto;
                                   }
                                   .live-auctions-feature {
                                          min-height: 230px;
                                   }
                            }
                     `}</style>
              </AppLayout>
       );
}
