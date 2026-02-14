import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Price from '@/Components/Price';
import CountdownTimer from '@/Components/CountdownTimer';
import OwnerInfoRow from '@/Components/OwnerInfoRow';
import { FaSearch, FaGavel, FaCheckCircle, FaChevronRight } from 'react-icons/fa';

export default function Index({ auctions, auth }) {
       const [activeModal, setActiveModal] = useState(null);

       return (
              <AppLayout title="1 Rupee Auction">
                     <Head>
                            <title>1 Rupee Auction | XpertBid</title>
                            <meta name="description" content="Real products. Real bidding. Starting from Rs. 1." />
                     </Head>

                     <main className="mainContainer">
                            <section className="heroBanner" style={{ marginBottom: '50px' }}>
                                   <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                                          <img
                                                 src="/assets/images/1_rupee.png"
                                                 alt="1 Rupee Auction"
                                                 style={{ width: '100%', height: 'auto', display: 'block' }}
                                          />
                                   </div>
                            </section>

                            {/* Live Auctions Section */}
                            <section className="section">
                                   <h2 className="sectionTitle">
                                          Live Auctions You Can Bid On
                                   </h2>

                                   <div className="auctionGrid">
                                          {auctions.map((item) => (
                                                 <LandingAuctionCard key={item.id} item={item} />
                                          ))}
                                   </div>

                                   <div className="footerNote" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
                                          *More items added regularly.
                                   </div>
                            </section>

                            {/* How to Win Section */}
                            <section className="howToWinSection">
                                   <h2 className="sectionTitle">
                                          How to Win on XpertBid
                                   </h2>

                                   <div className="stepsContainer">
                                          <div className="stepCard">
                                                 <div className="icon blueIcon"><FaSearch /></div>
                                                 <span className="stepText">Pick any live auction item</span>
                                          </div>

                                          <div className="stepCard">
                                                 <div className="icon yellowIcon"><FaGavel /></div>
                                                 <span className="stepText">Place your bid (starting from Rs. 1)</span>
                                          </div>

                                          <div className="checkmarks">
                                                 <div className="checkItem">
                                                        <FaCheckCircle /> No brokers
                                                 </div>
                                                 <div className="checkItem">
                                                        <FaCheckCircle /> No fixed prices
                                                 </div>
                                          </div>
                                   </div>

                                   <div className="ctaSection">
                                          <h3 className="ctaTitle">This Is Not a Giveaway. This Is a Real Auction.</h3>
                                          <p className="ctaText">You don't need luck. You need timing and smart bidding.</p>

                                          {!auth.user && (
                                                 <Link href={route('register')} className="joinButton">
                                                        Join XpertBid & Start Bidding <FaChevronRight style={{ fontSize: '0.875rem' }} />
                                                 </Link>
                                          )}
                                   </div>
                            </section>
                     </main>

                     <style>{`
                .mainContainer {
                    min-height: 100vh;
                    padding-bottom: 2.5rem;
                    font-family: sans-serif;
                    background: linear-gradient(to bottom, #ffffff, #eff6ff, #dbeafe);
                }
                .heroBanner {
                    margin-bottom: 50px;
                }
                .section {
                    padding-left: 1rem;
                    padding-right: 1rem;
                    max-width: 72rem;
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 3rem;
                }
                .sectionTitle {
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-align: center;
                    color: #1a2b4b;
                    margin-bottom: 1.5rem;
                }
                .auctionGrid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                    padding: 1rem;
                }
                @media (min-width: 640px) {
                    .auctionGrid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .auctionGrid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                .footerNote {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: #6b7280;
                }
                .howToWinSection {
                    padding-left: 1rem;
                    padding-right: 1rem;
                    max-width: 42rem;
                    margin-left: auto;
                    margin-right: auto;
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .stepsContainer {
                    text-align: left;
                    background-color: rgba(255, 255, 255, 0.5);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    backdrop-filter: blur(4px);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .stepCard {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background-color: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border: 1px solid #eff6ff;
                }
                .icon {
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .blueIcon { color: #3b82f6; }
                .yellowIcon { color: #eab308; }
                .stepText {
                    color: #374151;
                    font-weight: 500;
                }
                .checkmarks {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    padding-top: 0.5rem;
                }
                .checkItem {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #16a34a;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .ctaSection { margin-top: 2rem; }
                .ctaTitle {
                    font-weight: 700;
                    color: #1a2b4b;
                    font-size: 1.125rem;
                    margin-bottom: 0.25rem;
                }
                .ctaText {
                    color: #4b5563;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                }
                .joinButton {
                    background: #000000;
                    color: white;
                    font-weight: 700;
                    font-size: 1.125rem;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-left: auto;
                    margin-right: auto;
                    transition: background-color 0.3s, box-shadow 0.3s;
                    width: 100%;
                    text-decoration: none;
                }
                @media (min-width: 640px) {
                    .joinButton { width: auto; }
                }
                .joinButton:hover {
                    background-color: #333333;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    color: white;
                }

                /* Auction Card Styles */
                .marketCard {
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #eee;
                }
                .marketCard:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                .mktImg {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                    overflow: hidden;
                    background-color: #f8f9fa;
                }
                .mktImg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .marketCard:hover .mktImg img {
                    transform: scale(1.05);
                }
                .mktBody {
                    padding: 15px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .mktProHead h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a2b4b;
                    margin-bottom: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .mktDetail {
                    margin-top: auto;
                }
                .mktCrtBid {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .crntBid {
                    font-size: 13px;
                    color: #6c757d;
                }
                .mktBidPrice {
                    font-weight: 700;
                    color: #23262f;
                }
                .bidButton {
                    width: 100%;
                    background-color: #000000;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    text-align: center;
                    display: block;
                    font-size: 14px;
                    text-decoration: none;
                }
                .bidButton:hover {
                    background-color: #333333;
                    color: white;
                }
                .discountBadge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(220, 53, 69, 0.9);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 10;
                }
                .awardedBadge {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #43ACE9 0%, #0ea5e9 100%);
                    color: white;
                    padding: 8px 24px;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    box-shadow: 0 10px 15px -3px rgba(67, 172, 233, 0.4);
                    z-index: 20;
                    white-space: nowrap;
                    animation: pulseGlow 2s infinite;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                .winnerSection {
                    width: 100%;
                    text-align: center;
                    animation: slideUpFade 0.6s ease-out;
                    background: #f0f9ff;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px dashed #43ACE9;
                }
                .winnerText {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0284c7;
                    margin-top: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .trophyIcon {
                    color: #eab308;
                    font-size: 1.2rem;
                }
                
                @keyframes pulseGlow {
                    0% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0.7); }
                    50% { transform: translateX(-50%) scale(1.05); box-shadow: 0 0 0 10px rgba(67, 172, 233, 0); }
                    100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 0 0 rgba(67, 172, 233, 0); }
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Countdown Timer Styling Overrides */
                .mktImg .counter {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(28, 29, 32, 0.9);
                    padding: 8px 12px;
                    border-radius: 8px;
                    z-index: 10;
                    width: 90%;
                    max-width: 320px;
                    box-sizing: border-box;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                }
                .mktImg .counter-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    width: 100%;
                    align-items: stretch;
                }
                .mktImg .counter-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 0;
                }
                .mktImg .counter-value {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.2;
                    text-align: center;
                    white-space: nowrap;
                    display: block;
                    margin-bottom: 2px;
                }
                .mktImg .counter-label {
                    color: #fff;
                    font-size: 9px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    opacity: 0.9;
                    text-align: center;
                    white-space: nowrap;
                    display: block;
                }
            `}</style>
              </AppLayout>
       );
}

function LandingAuctionCard({ item }) {
       // Helper for image URL
       const getImageUrl = (imagePath) => {
              if (!imagePath) return '/assets/images/product-fallback.png';
              if (imagePath.startsWith('http')) return imagePath;
              // Check if admin URL should be used or local
              // Using logic similar to RelatedItems
              try {
                     return `https://admin.xpertbid.com/${imagePath.replace(/^\/+/, "")}`;
              } catch (e) {
                     return imagePath;
              }
       };

       const imageUrl = getImageUrl(item.image);

       return (
              <Link href={route('product.show', item.slug)} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                     <div className="marketCard">
                            <div className="mktImg">
                                   <img
                                          src={imageUrl}
                                          alt={item.title || item.name}
                                          onError={(e) => { e.target.src = '/assets/images/product-fallback.png'; }}
                                   />

                                   {(item.status === 'awarded' || item.status === 'awarded ') ? (
                                          <div className="awardedBadge">
                                                 AWARDED
                                          </div>
                                   ) : (
                                          <CountdownTimer endDate={item.end_date} />
                                   )}

                                   {/* Assuming ID 1 logic or similar for 1 Rupee specific badge if needed, 
                        or rely on item.is_1_rupee if available. 
                        For now matching reference logic `item.id === 1` but likely generic `Starts From Rs. 1` 
                        should apply to all on this page? 
                        The reference only showed it for item.id === 1. I'll keep it or make it generic.
                        Let's check if there's a property. 
                        The reference page says "1 Rupee Auction", so maybe all of them are?
                        I'll leave the badge logic as strictly ported or conditional.
                        Reference used `item.id === 1`. I'll copy that strictly for now.
                    */}
                                   {(item.minimum_bid == 1 || item.id === 1) && (
                                          <div className="discountBadge">
                                                 Starts From Rs. 1
                                          </div>
                                   )}
                            </div>

                            <div className="mktBody">
                                   <div className="mktProHead">
                                          <h3>{(item.title || item.name)?.length > 25 ? (item.title || item.name).substring(0, 15) + "..." : (item.title || item.name)}</h3>
                                   </div>

                                   <OwnerInfoRow
                                          owner={item.owner || item.user}
                                          fallbackName={item.owner?.name || item.user?.name}
                                          fallbackAvatar={item.owner?.avatar || item.user?.profile_pic}
                                   />

                                   <div className="mktDetail">
                                          {(item.status === 'awarded' || item.status === 'awarded ') ? (
                                                 <div className="winnerSection">
                                                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1" style={{ fontSize: '0.75rem', color: '#6b7280' }}>Winning Bidder</p>
                                                        <div className="winnerText">
                                                               <span className="trophyIcon">🏆</span>
                                                               Establishing contact with the highest bidder
                                                        </div>
                                                 </div>
                                          ) : (
                                                 <>
                                                        <div className="mktCrtBid">
                                                               <span className="crntBid">
                                                                      {Number(item.bids_max_bid_amount) > 0 ? "Current Bid" : "Result"}
                                                               </span>
                                                               <div className="mktBidPrice">
                                                                      <Price amountAED={Number(item.bids_max_bid_amount) > 0 ? item.bids_max_bid_amount : item.minimum_bid} />
                                                               </div>
                                                        </div>
                                                        <div className="w-100">
                                                               <div className="bidButton">
                                                                      Bid Now
                                                               </div>
                                                        </div>
                                                 </>
                                          )}
                                   </div>
                            </div>
                     </div>
              </Link>
       );
}
