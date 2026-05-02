import React from "react";
import { Link } from "@inertiajs/react";
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

export default function LiveAuctionsIndex({ session, liveAuctions = [], activeAuction = null }) {
       const activeSlug = activeAuction?.slug || liveAuctions.find((auction) => auction?.status === "active")?.slug || liveAuctions[0]?.slug;
       const liveSetupThumbnail = thumbnailForVideoId(session?.youtube_video_id, activeAuction);

       return (
              <AppLayout title="Live Auctions | XpertBid">
                     <main className="live-auctions-page">
                            <section className="live-auctions-hero">
                                   <div>
                                          <span className="live-auctions-kicker">
                                                 <i className="fa-solid fa-circle"></i>
                                                 Live Auction Room
                                          </span>
                                          <h1>Join the current live auction</h1>
                                          <p>
                                                 Watch the live stream, follow the selected products, and place bids on the product that is active right now.
                                          </p>
                                          <div className="live-auctions-actions">
                                                 {activeSlug ? (
                                                        <Link href={route("product.show", activeSlug)} className="live-auctions-primary">
                                                               Join Live
                                                        </Link>
                                                 ) : (
                                                        <span className="live-auctions-primary is-disabled">No Live Auction</span>
                                                 )}
                                          </div>
                                   </div>

                                   <div className="live-auctions-feature">
                                          {activeAuction ? (
                                                 <>
                                                        <img src={liveSetupThumbnail} alt={activeAuction.title || "Active live auction"} />
                                                 </>
                                          ) : (
                                                 <div className="live-auctions-empty-feature">No active live auction selected yet.</div>
                                          )}
                                   </div>
                            </section>
                     </main>

                     <style>{`
                            .live-auctions-page {
                                   background: #f5f7fb;
                                   padding: 32px 0 56px;
                                   min-height: 80vh;
                            }
                            .live-auctions-hero,
                            .live-auctions-section {
                                   width: min(1200px, calc(100% - 32px));
                                   margin: 0 auto;
                            }
                            .live-auctions-hero {
                                   display: grid;
                                   grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
                                   gap: 24px;
                                   align-items: stretch;
                                   background: #ffffff;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 8px;
                                   padding: 28px;
                                   box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
                            }
                            .live-auctions-kicker {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 8px;
                                   color: #dc2626;
                                   font-weight: 900;
                                   font-size: 13px;
                                   text-transform: uppercase;
                                   margin-bottom: 12px;
                            }
                            .live-auctions-kicker i {
                                   font-size: 8px;
                            }
                            .live-auctions-hero h1 {
                                   font-size: clamp(30px, 4vw, 52px);
                                   line-height: 1;
                                   color: #111827;
                                   font-weight: 950;
                                   margin: 0 0 14px;
                                   letter-spacing: 0;
                            }
                            .live-auctions-hero p {
                                   color: #64748b;
                                   font-size: 16px;
                                   max-width: 620px;
                                   margin: 0;
                            }
                            .live-auctions-actions {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   margin-top: 24px;
                            }
                            .live-auctions-primary {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   min-height: 48px;
                                   padding: 0 22px;
                                   border-radius: 8px;
                                   font-weight: 900;
                                   text-decoration: none;
                            }
                            .live-auctions-primary {
                                   background: #111827;
                                   color: #ffffff;
                            }
                            .live-auctions-primary.is-disabled {
                                   background: #9ca3af;
                            }
                            .live-auctions-feature {
                                   min-height: 260px;
                                   border-radius: 8px;
                                   overflow: hidden;
                                   position: relative;
                                   background: #111827;
                            }
                            .live-auctions-feature img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                                   display: block;
                                   opacity: 1;
                            }
                            .live-auctions-empty,
                            .live-auctions-empty-feature {
                                   min-height: 220px;
                                   display: flex;
                                   flex-direction: column;
                                   align-items: center;
                                   justify-content: center;
                                   text-align: center;
                                   color: #64748b;
                            }
                            .live-auctions-empty h3 {
                                   color: #111827;
                                   font-weight: 950;
                                   margin-bottom: 4px;
                            }
                            @media (max-width: 991px) {
                                   .live-auctions-hero {
                                          grid-template-columns: 1fr;
                                   }
                            }
                     `}</style>
              </AppLayout>
       );
}
