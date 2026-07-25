import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductHeader from '@/Components/ProductDetails/ProductHeader';
import ProductImages from '@/Components/ProductDetails/ProductImages';
import BidSection from '@/Components/ProductDetails/BidSection';
import BidHistory from '@/Components/ProductDetails/BidHistory';
import RelatedItems from '@/Components/ProductDetails/RelatedItems';
import ListingLiveChat from '@/Components/ProductDetails/ListingLiveChat';
import YoutubeLiveEmbed from '@/Components/ProductDetails/YoutubeLiveEmbed';
import PropertyLocationMap from '@/Components/ProductDetails/PropertyLocationMap';
import Price from '@/Components/Price';
import { CartProvider } from '@/Contexts/CartContext';
import { AuthModalProvider } from '@/Contexts/AuthModalContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { isGoogleMapsUrl } from '@/Utils/mapLocation';

const AccordionItem = ({ title, children, defaultOpen = false }) => {
       const [open, setOpen] = useState(defaultOpen);
       return (
              <div className={`xb-accordion ${open ? 'open' : ''}`}>
                     <button
                            type="button"
                            className="xb-acc-head"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                     >
                            <span>{title}</span>
                            <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                     </button>
                     {open && <div className="xb-acc-body">{children}</div>}
              </div>
       );
};

const monthNames = [
       "January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
];

function formatHuman(d) {
       if (!d) return "";
       const dt = new Date(d);
       if (isNaN(dt)) return d;
       const dd = String(dt.getDate()).padStart(2, "0");
       const mm = String(dt.getMonth() + 1).padStart(2, "0");
       const mon = monthNames[dt.getMonth()];
       return `${dd}/${mm}/${mon}`;
}

const listingImageUrl = (path) => {
       if (!path) return '/assets/images/WebsiteBanner2.png';
       if (String(path).startsWith('http') || String(path).startsWith('/')) return path;

       return `/${String(path).replace(/^\/+/, '')}`;
};

const normalizeSchemaMarkup = (schemaMarkup) => {
       if (typeof schemaMarkup !== 'string') {
              return '';
       }

       const rawMarkup = schemaMarkup.trim();
       if (!rawMarkup) {
              return '';
       }

       try {
              const parsed = JSON.parse(rawMarkup);
              return JSON.stringify(parsed);
       } catch (error) {
              const normalizedMarkup = rawMarkup
                     .replace(/^\s*html\s*/i, '')
                     .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/i, '')
                     .replace(/<\/script>\s*$/i, '')
                     .trim();

              if (!normalizedMarkup) {
                     return '';
              }

              try {
                     const parsed = JSON.parse(normalizedMarkup);
                     return JSON.stringify(parsed);
              } catch (nestedError) {
                     return '';
              }
       }
};

const extractSchemaMarkupBlocks = (schemaMarkup) => {
       if (typeof schemaMarkup !== 'string') {
              return [];
       }

       const rawMarkup = schemaMarkup.trim();
       if (!rawMarkup) {
              return [];
       }

       const scriptMatches = [...rawMarkup.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
       if (scriptMatches.length > 0) {
              return scriptMatches
                     .map((match) => normalizeSchemaMarkup(match[1] || ''))
                     .filter(Boolean);
       }

       const normalizedMarkup = normalizeSchemaMarkup(rawMarkup);
       return normalizedMarkup ? [normalizedMarkup] : [];
};

export default function Show({ auction, bids, related, highestBid, winnerDetails, isFavorite, dynamicFields = [], liveVideoId = null, liveActiveAuction = null, marketplaceBackUrl = null }) {
       const { auth } = usePage().props;
       const listingType = String(auction?.listing_type || '').toLowerCase();
       const listingStatus = String(auction?.status || '').trim().toLowerCase();
       const showLiveChat = listingType === 'live_auction' && listingStatus === 'active';
       const [mobileBidAmount, setMobileBidAmount] = useState('');
       const [mobileBidSending, setMobileBidSending] = useState(false);
       const activeLiveVideoId = liveVideoId || auction?.youtube_video_id;
       const schemaMarkupBlocks = extractSchemaMarkupBlocks(auction?.category?.schema_markup);

       // Bids update automatically via Inertia props after a successful POST
       const categoryFeatures = auction?.category_features && typeof auction.category_features === 'object'
              ? auction.category_features
              : {};

       const fieldNameCounts = dynamicFields.reduce((acc, field) => {
              const key = String(field?.field_name || '').trim();
              if (key) acc[key] = (acc[key] || 0) + 1;
              return acc;
       }, {});

       const prettifyKey = (rawKey) => String(rawKey || '')
              .replace(/^field_/, '')
              .replace(/__\d+$/, '')
              .replace(/[_-]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .replace(/\b\w/g, (c) => c.toUpperCase());

       const formatFeatureValue = (value) => {
              if (value === null || value === undefined || value === '') return '';
              if (typeof value === 'boolean') return value ? 'Yes' : 'No';
              if (Array.isArray(value)) return value.join(', ');
              return String(value);
       };

       const mappedKeys = new Set();
       const dynamicFeatureRows = dynamicFields
              .map((field) => {
                     const idKey = `field_${field.id}`;
                     const base = String(field?.field_name || '').trim();
                     const featureKey = fieldNameCounts[base] > 1 ? `${base}__${field.id}` : base;
                     const value = categoryFeatures[idKey] ?? categoryFeatures[featureKey] ?? categoryFeatures[base] ?? '';
                     const formatted = formatFeatureValue(value);

                     if (!formatted || isGoogleMapsUrl(value)) return null;

                     mappedKeys.add(idKey);
                     if (base) mappedKeys.add(base);
                     if (featureKey) mappedKeys.add(featureKey);

                     return {
                            key: idKey,
                            label: field?.label || prettifyKey(base || idKey),
                            value: formatted,
                     };
              })
              .filter(Boolean);

       const allFeatureRows = dynamicFeatureRows;

       useEffect(() => {
              if (listingType !== 'live_auction') {
                     return undefined;
              }

              const refreshLiveBids = () => {
                     router.reload({
                            only: ['auction', 'bids', 'highestBid', 'winnerDetails', 'liveVideoId', 'liveActiveAuction'],
                            preserveScroll: true,
                            preserveState: true,
                            showProgress: false,
                     });
              };

              const timer = window.setInterval(refreshLiveBids, 2500);
              return () => window.clearInterval(timer);
       }, [listingType]);

       useEffect(() => {
              if (listingType === 'live_auction' && listingStatus === 'closed') {
                     router.visit('/live-auctions', {
                            replace: true,
                            preserveScroll: false,
                            preserveState: false,
                     });
                     return;
              }

              if (
                     listingType === 'live_auction'
                     && liveActiveAuction?.slug
                     && liveActiveAuction.slug !== auction?.slug
              ) {
                     router.visit(route('product.show', liveActiveAuction.slug), {
                            replace: true,
                            preserveScroll: false,
                            preserveState: false,
                     });
              }
       }, [listingType, listingStatus, liveActiveAuction?.slug, auction?.slug]);

       const handleMobileLiveBid = () => {
              if (!auth?.user) {
                     window.alert('Please login to place a bid');
                     return;
              }

              if (!mobileBidAmount || Number(mobileBidAmount) <= Number(highestBid || 0)) {
                     window.alert('Bid must be higher than the current highest bid');
                     return;
              }

              setMobileBidSending(true);
              router.post('/bids', {
                     listing_id: auction.id,
                     bid_amount: mobileBidAmount,
                     bid_source: 'web',
              }, {
                     preserveScroll: true,
                     onSuccess: () => {
                            setMobileBidAmount('');
                            router.reload({
                                   only: ['auction', 'bids', 'highestBid', 'winnerDetails', 'liveVideoId', 'liveActiveAuction'],
                                   preserveScroll: true,
                                   preserveState: true,
                                   showProgress: false,
                            });
                     },
                     onError: (errors) => {
                            const message = Object.values(errors || {}).flat().join('\n') || 'Failed to place bid';
                            window.alert(message);
                     },
                     onFinish: () => setMobileBidSending(false),
              });
       };

       if (listingType === 'live_auction') {
              return (
                     <CartProvider>
                            <AuthModalProvider>
                           <Head>
                                   <title>{auction.title}</title>
                                   <meta name="description" content={auction.description?.substring(0, 160)} />
                                   {schemaMarkupBlocks.map((schemaMarkup, index) => (
                                          <script
                                                 key={`auction-schema-${index}`}
                                                 type="application/ld+json"
                                                 dangerouslySetInnerHTML={{ __html: schemaMarkup }}
                                          />
                                   ))}
                            </Head>

                            <main className="live-product-detail-page">
                                   <div className="live-product-detail-grid">
                                          <div className="live-product-mobile-video-panel">
                                                 <Link href="/live-auctions" className="live-product-back-btn live-product-mobile-back-btn">
                                                        <i className="fa-solid fa-arrow-left"></i>
                                                        <span>Back to Live Auction</span>
                                                 </Link>
                                                 <div className="live-product-video-wrap">
                                                        {activeLiveVideoId ? (
                                                               <YoutubeLiveEmbed videoId={activeLiveVideoId} title={auction.title} />
                                                        ) : (
                                                               <img src={listingImageUrl(auction.image_url)} alt={auction.title} />
                                                        )}
                                                 </div>
                                          </div>

                                          <div className="live-product-mobile-controls">
                                                 <h1>{auction.title}</h1>
                                                 <div className="live-product-mobile-highest">
                                                        <span>Highest Bid</span>
                                                        <strong><Price amountAED={highestBid || 0} /></strong>
                                                 </div>
                                                 <input
                                                        type="number"
                                                        placeholder="Enter amount"
                                                        value={mobileBidAmount}
                                                        onChange={(e) => setMobileBidAmount(e.target.value)}
                                                        disabled={mobileBidSending}
                                                 />
                                                 <button type="button" onClick={handleMobileLiveBid} disabled={mobileBidSending}>
                                                        {mobileBidSending ? 'Placing Bid...' : 'Place Bid'}
                                                 </button>
                                                 <div className="live-product-mobile-prices">
                                                        <span>Starting bid price: <b><Price amountAED={auction.minimum_bid || auction.listing_data?.start_price || 0} /></b></span>
                                                        <span>Market Value: <b><Price amountAED={auction.reserve_price || auction.listing_data?.reserve_price || 0} /></b></span>
                                                 </div>
                                          </div>

                                          <div className="live-product-main-panel">
                                                 <div className="live-product-video-wrap">
                                                        {activeLiveVideoId ? (
                                                               <YoutubeLiveEmbed videoId={activeLiveVideoId} title={auction.title} />
                                                        ) : (
                                                               <img src={listingImageUrl(auction.image_url)} alt={auction.title} />
                                                        )}
                                                 </div>

                                                 <BidSection
                                                        product={auction}
                                                        highestBidProp={highestBid}
                                                        onBidPlaced={() => {
                                                               router.reload({
                                                                      only: ['auction', 'bids', 'highestBid', 'winnerDetails', 'liveVideoId', 'liveActiveAuction'],
                                                                      preserveScroll: true,
                                                                      preserveState: true,
                                                                      showProgress: false,
                                                               });
                                                        }}
                                                        winnerDetails={winnerDetails}
                                                        isFavoriteProp={isFavorite}
                                                 />
                                          </div>

                                          <aside className="live-product-side-panel live-product-chat-panel">
                                                 <div className="live-product-chat-actions">
                                                        <Link href="/live-auctions" className="live-product-back-btn">
                                                               <i className="fa-solid fa-arrow-left"></i>
                                                               <span>Back to Live Auction</span>
                                                        </Link>
                                                 </div>
                                                 <div className="live-product-panel-heading">
                                                        <h2>Live Chat</h2>
                                                 </div>
                                                 <ListingLiveChat listingId={auction.id} listingSlug={auction.slug} />
                                          </aside>

                                          <aside className="live-product-side-panel live-product-bids-panel">
                                                 <BidHistory bids={bids} />
                                          </aside>
                                   </div>
                            </main>

                            <style>{`
                                   html,
                                   body {
                                          overflow: hidden;
                                   }

                                   .live-product-detail-page {
                                          background: #f5f7fb;
                                          padding: 8px 16px 14px;
                                          min-height: 100vh;
                                          height: 100vh;
                                          display: flex;
                                          flex-direction: column;
                                          overflow: hidden;
                                   }

                                   .live-product-back-btn {
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          gap: 6px;
                                          min-height: 34px;
                                          padding: 0 12px;
                                          border-radius: 8px;
                                          background: #f8fafc;
                                          color: #111827;
                                          border: 1px solid #e5e7eb;
                                          text-decoration: none;
                                          font-size: 12px;
                                          font-weight: 900;
                                   }

                                   .live-product-detail-grid {
                                          width: min(1480px, 100%);
                                          margin: 0 auto;
                                          display: grid;
                                          grid-template-columns: minmax(420px, 1.25fr) minmax(300px, 0.75fr) minmax(320px, 0.8fr);
                                          gap: 16px;
                                          align-items: stretch;
                                          flex: 1 1 auto;
                                          min-height: 0;
                                   }

                                   .live-product-main-panel,
                                   .live-product-mobile-video-panel,
                                   .live-product-mobile-controls,
                                   .live-product-side-panel {
                                          background: #ffffff;
                                          border: 1px solid #e5e7eb;
                                          border-radius: 10px;
                                          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
                                          overflow: hidden;
                                   }

                                   .live-product-mobile-video-panel {
                                          display: none;
                                          padding: 10px;
                                    }

                                   .live-product-mobile-controls {
                                          display: none;
                                   }

                                   .live-product-main-panel {
                                          padding: 14px;
                                          min-height: 0;
                                          overflow-y: auto;
                                   }

                                   .live-product-video-wrap {
                                          margin-bottom: 14px;
                                          height: clamp(230px, 39vh, 390px);
                                          background: #000000;
                                          border-radius: 10px;
                                          overflow: hidden;
                                   }

                                   .live-product-video-wrap .xb-youtube-embed,
                                   .live-product-video-wrap .ratio {
                                          height: 100% !important;
                                          padding-bottom: 0 !important;
                                          border: 0 !important;
                                          border-radius: 10px !important;
                                          box-shadow: none !important;
                                   }

                                   .live-product-video-wrap img {
                                          width: 100%;
                                          height: 100%;
                                          object-fit: cover;
                                          display: block;
                                   }

                                   .live-product-main-panel .product-details-brief-parent {
                                          padding: 0 !important;
                                   }

                                   .live-product-main-panel .product-heading {
                                          font-size: clamp(20px, 2vw, 28px);
                                          line-height: 1.05;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .owned-by-and-favoruite {
                                          display: none !important;
                                   }

                                   .live-product-main-panel .detail-auction-strip {
                                          border-radius: 10px;
                                          padding: 14px 16px;
                                          margin-bottom: 12px !important;
                                   }

                                   .live-product-main-panel .detail-auction-meta .price {
                                          font-size: clamp(24px, 2.3vw, 32px);
                                   }

                                   .live-product-main-panel .bid-input-wrap input,
                                   .live-product-main-panel .bid-input-wrap button {
                                          height: 44px !important;
                                          font-size: 15px !important;
                                   }

                                   .live-product-main-panel .min-bid-and-estimate {
                                          gap: 12px;
                                          flex-wrap: wrap;
                                   }

                                   .live-product-side-panel {
                                          padding: 18px;
                                          min-height: 0;
                                          overflow: hidden;
                                          display: flex;
                                          flex-direction: column;
                                   }

                                   .live-product-bids-panel {
                                          overflow-y: auto;
                                          order: 2;
                                   }

                                   .live-product-chat-panel {
                                          order: 3;
                                   }

                                   .live-product-side-panel .bid-history-parent {
                                          margin: 0;
                                          box-shadow: none;
                                          border: 0;
                                          padding: 0;
                                          height: 100%;
                                          min-height: 0;
                                          display: flex;
                                          flex-direction: column;
                                          flex: 1 1 auto;
                                   }

                                   .live-product-side-panel .bid-history-header {
                                          padding: 8px 0 16px;
                                          margin-bottom: 16px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-side-panel .bid-history-header .description {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          padding: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-side-panel .bid-history-scroll {
                                          max-height: none;
                                          flex: 0 0 auto;
                                          min-height: auto;
                                          overflow: visible;
                                          padding: 0 4px 4px;
                                   }

                                   .live-product-side-panel .bid-history-scroll > .text-center {
                                          min-height: 260px;
                                          border-radius: 10px;
                                          background: #f8fafc;
                                          border: 1px dashed #dbe3ee;
                                          display: flex;
                                          align-items: center;
                                          justify-content: center;
                                          color: #64748b !important;
                                          font-size: 16px;
                                          font-weight: 800;
                                          margin: 0 !important;
                                    }

                                   .live-product-side-panel .history-user.parent {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          gap: 12px;
                                          padding: 12px;
                                          margin-bottom: 10px;
                                          border: 1px solid #edf2f7;
                                          border-radius: 10px;
                                          background: #ffffff;
                                          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
                                   }

                                   .live-product-side-panel .history-user-profile {
                                          display: flex;
                                          align-items: center;
                                          min-width: 0;
                                   }

                                   .live-product-side-panel .history-user-name,
                                   .live-product-side-panel .history-no {
                                          margin: 0;
                                   }

                                   .live-product-side-panel .history-user-name {
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 900;
                                   }

                                   .live-product-side-panel .username-and-date .date {
                                          color: #64748b;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-side-panel .history-user-payAmount {
                                          flex: 0 0 auto;
                                          color: #111827;
                                          font-size: 13px;
                                          font-weight: 950;
                                   }

                                   .live-product-side-panel .history-user-payAmount .price,
                                   .live-product-side-panel .history-user-payAmount span {
                                          font-size: 16px !important;
                                          line-height: 1.1;
                                    }

                                   .live-product-panel-heading {
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                          padding: 0 0 14px;
                                          margin-bottom: 14px;
                                          border-bottom: 1px solid #e5e7eb;
                                   }

                                   .live-product-panel-heading h2 {
                                          font-size: 18px;
                                          font-weight: 950;
                                          color: #111827;
                                          margin: 0;
                                          letter-spacing: 0;
                                   }

                                   .live-product-chat-actions {
                                          display: flex;
                                          justify-content: flex-end;
                                          margin-bottom: 12px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat {
                                          min-height: 0;
                                          flex: 1 1 auto;
                                          height: auto !important;
                                          border: 0 !important;
                                          border-radius: 0 !important;
                                          box-shadow: none !important;
                                          background: transparent !important;
                                          overflow: hidden !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 10px 10px 0 0;
                                          padding: 10px 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .border-bottom .small {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          letter-spacing: 0.02em;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat .badge {
                                          background: #111827 !important;
                                          color: #ffffff !important;
                                          border-radius: 999px;
                                          padding: 5px 9px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                          background: #ffffff;
                                          border-left: 1px solid #e5e7eb;
                                          border-right: 1px solid #e5e7eb;
                                          padding: 12px !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div {
                                          border: 1px solid #edf2f7 !important;
                                          border-radius: 10px;
                                          padding: 10px 12px !important;
                                          margin-bottom: 10px !important;
                                          background: #f8fafc;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .fw-semibold {
                                          color: #111827 !important;
                                          font-size: 13px;
                                          font-weight: 900 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-muted {
                                          color: #64748b !important;
                                          font-size: 11px;
                                          font-weight: 700;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 > div .text-body {
                                          color: #334155 !important;
                                          font-size: 13px;
                                          line-height: 1.45;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form {
                                          background: #f8fafc !important;
                                          border: 1px solid #e5e7eb !important;
                                          border-radius: 0 0 10px 10px;
                                          padding: 8px !important;
                                          flex: 0 0 auto;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat > form > .d-flex {
                                          align-items: center;
                                          gap: 8px !important;
                                          min-height: 40px;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat input {
                                          height: 40px;
                                          min-height: 40px;
                                          border: 1px solid #dbe3ee;
                                          border-radius: 8px;
                                          box-shadow: none !important;
                                          font-size: 13px;
                                          padding: 0 12px !important;
                                          line-height: 40px;
                                          margin: 0 !important;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 40px;
                                          min-height: 40px;
                                          border-radius: 8px;
                                          background: #111827;
                                          border-color: #111827;
                                          font-weight: 900;
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          padding: 0 !important;
                                          margin: 0 !important;
                                          line-height: 1;
                                   }

                                   .live-product-chat-panel .xb-listing-live-chat button[type="submit"] i {
                                          font-size: 15px;
                                    }

                                   @media (max-width: 1199px) {
                                          html,
                                          body {
                                                 overflow: auto;
                                          }

                                          .live-product-detail-page {
                                                 height: auto;
                                                 min-height: 100vh;
                                                 overflow: visible;
                                          }

                                          .live-product-detail-grid {
                                                 grid-template-columns: 1fr 1fr;
                                                 overflow-y: auto;
                                          }

                                          .live-product-main-panel {
                                                 grid-column: 1 / -1;
                                                 overflow-y: visible;
                                          }
                                   }

                                   @media (max-width: 767px) {
                                          html,
                                          body {
                                                 overflow: hidden;
                                          }

                                          .live-product-detail-page {
                                                 padding: 8px 10px 16px;
                                                 height: 100vh;
                                                 min-height: 100vh;
                                                 overflow: hidden;
                                          }

                                          .live-product-video-wrap {
                                                 height: 178px;
                                                 margin-bottom: 12px;
                                          }

                                          .live-product-detail-grid {
                                                 display: flex;
                                                 flex-direction: column;
                                                 grid-template-columns: 1fr;
                                                 overflow-y: auto;
                                                 align-items: start;
                                                 padding-top: 236px;
                                                 padding-bottom: 18px;
                                          }

                                          .live-product-main-panel,
                                          .live-product-mobile-video-panel,
                                          .live-product-mobile-controls,
                                          .live-product-side-panel {
                                                 border-radius: 8px;
                                                 overflow: visible;
                                          }

                                          .live-product-mobile-video-panel {
                                                 display: block;
                                                 order: 1;
                                                 position: fixed;
                                                 top: 8px;
                                                 left: 10px;
                                                 right: 10px;
                                                 z-index: 30;
                                                 padding: 8px;
                                                 background: #ffffff;
                                                  overflow: hidden;
                                                 height: 228px;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 8px;
                                          }

                                          .live-product-mobile-back-btn {
                                                 align-self: flex-start;
                                                 min-height: 32px;
                                                 background: #ffffff;
                                          }

                                          .live-product-mobile-video-panel .live-product-video-wrap {
                                                margin-bottom: 0;
                                                 height: 170px;
                                          }

                                          .live-product-main-panel {
                                                 padding: 10px;
                                                 order: 2;
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 0;
                                                 display: none;
                                          }

                                          .live-product-main-panel > .live-product-video-wrap {
                                                 display: none;
                                          }

                                          .live-product-mobile-controls {
                                                 display: flex;
                                                 flex-direction: column;
                                                 order: 2;
                                                 padding: 12px;
                                                 gap: 12px;
                                                 margin-top: 0;
                                                 width: 100%;
                                                 align-self: stretch;
                                                 box-sizing: border-box;
                                          }

                                          .live-product-mobile-controls h1 {
                                                 color: #111827;
                                                 font-size: 20px;
                                                 font-weight: 950;
                                                 line-height: 1.2;
                                                 margin: 0;
                                          }

                                          .live-product-mobile-highest {
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 background: #f8fafc;
                                                 padding: 12px 14px;
                                          }

                                          .live-product-mobile-highest span {
                                                 display: block;
                                                 color: #64748b;
                                                 font-size: 11px;
                                                 font-weight: 800;
                                                 text-transform: uppercase;
                                                 letter-spacing: 0.04em;
                                                 margin-bottom: 6px;
                                          }

                                          .live-product-mobile-highest strong {
                                                 display: block;
                                                 color: #111827;
                                                 font-size: 28px;
                                                 line-height: 1.1;
                                                 font-weight: 950;
                                          }

                                          .live-product-mobile-controls input {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 1px solid #e5e7eb;
                                                 border-radius: 10px;
                                                 padding: 0 14px;
                                                 font-size: 14px;
                                                 outline: 0;
                                          }

                                          .live-product-mobile-controls button {
                                                 width: 100%;
                                                 height: 44px;
                                                 border: 0;
                                                 border-radius: 10px;
                                                 background: #23262f;
                                                 color: #ffffff;
                                                 font-size: 14px;
                                                 font-weight: 900;
                                          }

                                          .live-product-mobile-prices {
                                                 display: grid;
                                                 gap: 8px;
                                                 color: #64748b;
                                                 font-size: 14px;
                                          }

                                          .live-product-mobile-prices b {
                                                 color: #111827;
                                                 font-weight: 800;
                                          }

                                          .live-product-main-panel .product-details-brief-parent {
                                                 display: block !important;
                                                 padding: 0 !important;
                                          }

                                          .live-product-main-panel .product-heading {
                                                 display: block !important;
                                                 font-size: 20px !important;
                                                 line-height: 1.2 !important;
                                                 margin: 0 0 10px !important;
                                          }

                                          .live-product-main-panel .detail-auction-strip {
                                                 display: block !important;
                                                 padding: 12px 14px !important;
                                                 margin-bottom: 12px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .rank {
                                                 display: block !important;
                                                 font-size: 11px !important;
                                          }

                                          .live-product-main-panel .detail-auction-meta .price {
                                                 display: block !important;
                                                 font-size: 28px !important;
                                                 line-height: 1.1 !important;
                                          }

                                          .live-product-main-panel .product-details-brief-parent,
                                          .live-product-main-panel .bid-input-wrap,
                                          .live-product-main-panel .min-bid-and-estimate {
                                                 position: static !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap {
                                                 display: flex;
                                                 flex-direction: column;
                                                 gap: 12px;
                                                 margin-bottom: 14px !important;
                                          }

                                          .live-product-main-panel .bid-input-wrap button {
                                                 position: static !important;
                                                 inset: auto !important;
                                                 transform: none !important;
                                                 display: flex !important;
                                                 align-items: center;
                                                 justify-content: center;
                                                 width: 100% !important;
                                                 margin: 0 !important;
                                                 z-index: auto !important;
                                          }

                                          .live-product-main-panel .min-bid-and-estimate {
                                                 display: grid !important;
                                                 grid-template-columns: 1fr;
                                                 gap: 8px;
                                                 margin-top: 0 !important;
                                          }

                                          .live-product-chat-panel {
                                                 order: 3;
                                                 position: relative;
                                                 z-index: 2;
                                                 margin-top: 12px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-chat-panel .live-product-chat-actions {
                                                 display: none;
                                          }

                                          .live-product-bids-panel {
                                                 order: 4;
                                                 position: relative;
                                                 z-index: 1;
                                                 margin-top: 14px;
                                                 width: 100%;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel {
                                                 overflow: hidden;
                                          }

                                          .live-product-bids-panel .bid-history-parent {
                                                 height: auto;
                                                 min-height: auto;
                                                 flex: 0 0 auto;
                                          }

                                          .live-product-bids-panel .bid-history-scroll {
                                                 max-height: 246px;
                                                 overflow-y: auto;
                                                 padding-right: 4px;
                                          }

                                          .live-product-bids-panel .history-user.parent {
                                                 min-height: 66px;
                                          }

                                          .live-product-chat-panel .xb-listing-live-chat > .flex-grow-1 {
                                                 max-height: 252px;
                                                 min-height: 252px;
                                                 overflow-y: auto !important;
                                          }
                                   }
                            `}</style>
                            </AuthModalProvider>
                     </CartProvider>
              );
       }

       return (
              <AppLayout title={auction.title}>
                     <Head>
                            <meta name="description" content={auction.description?.substring(0, 160)} />
                            {schemaMarkupBlocks.map((schemaMarkup, index) => (
                                   <script
                                          key={`auction-live-schema-${index}`}
                                          type="application/ld+json"
                                          dangerouslySetInnerHTML={{ __html: schemaMarkup }}
                                   />
                            ))}
                     </Head>

                     <ProductHeader
                            views={auction.views}
                            productId={auction.id}
                            slug={auction.slug}
                            backHref={marketplaceBackUrl}
                     />

                     {auction.slug === 'car-showcase-4-vkxgiyxw' && (
                            <div className="container-fluid pt-3">
                                   <div className="alert alert-primary d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0" role="status">
                                          <span className="small mb-0">
                                                 <strong>Live demo:</strong> open the same auction with YouTube video, XpertBid live chat, and bidding in one layout.
                                          </span>
                                          <Link href={route('demo.live_auction_car_showcase')} className="btn btn-sm btn-light text-primary fw-semibold">
                                                 Open live demo
                                          </Link>
                                   </div>
                            </div>
                     )}

                     <section className="product-image-and-brief">
                            <div className="container-fluid">
                                   <div className={`products-brief-parent${auction.featured_name === 'home_featured' ? ' listing_promoted' : ''}`}>
                                          <div className="row">
                                                 <div className="col-md-6">
                                                        <ProductImages
                                                               albumImages={auction.album_urls}
                                                               videos={auction.video}
                                                               status={auction.status}
                                                               mainImage={auction.image_url}
                                                               listType={auction.list_type}
                                                               startDate={auction.start_date}
                                                               endDate={auction.end_date}
                                                               youtubeVideoId={auction.youtube_video_id}
                                                        />
                                                 </div>

                                                 <div className="col-md-6">
                                                        {auction.featured_name === 'home_featured' && (
                                                               <div style={{ display: 'block' }}>
                                                                      <button type="button" className="pro_feature" disabled>
                                                                             <i className="fa-solid fa-bolt me-2"></i>
                                                                             Featured
                                                                      </button>
                                                               </div>
                                                        )}

                                                        <BidSection
                                                               product={auction}
                                                               highestBidProp={highestBid}
                                                               onBidPlaced={() => { }}
                                                               winnerDetails={winnerDetails}
                                                               isFavoriteProp={isFavorite}
                                                        />
                                                 </div>
                                          </div>

                                   </div>
                            </div>
                     </section>

                     <section className="product-detailed-info">
                            <div className="container-fluid">
                                   <div className="product-detailed-info-parent">
                                          <div className="row justify-content-between">
                                                 <div className="col-lg-7 col-md-6">
                                                        <div className="x-accordions">
                                                               {/* Key Information */}
                                                               {(auction.description || auction.product_location) && (
                                                                      <AccordionItem title="Key Information" defaultOpen={true}>
                                                                             {auction.description && (
                                                                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: auction.description }} />
                                                                             )}
                                                                             <PropertyLocationMap categoryFeatures={auction.category_features} />
                                                                      </AccordionItem>
                                                               )}

                                                               {allFeatureRows.length > 0 && (
                                                                      <AccordionItem title="Additional Details" defaultOpen={true}>
                                                                             <div className="row gx-3 gy-2">
                                                                                    {allFeatureRows.map((item) => (
                                                                                           <div className="col-md-6" key={item.key}>
                                                                                                  <div className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
                                                                                                         <span className="text-muted small">{item.label}</span>
                                                                                                         <strong className="small text-dark">{item.value}</strong>
                                                                                                  </div>
                                                                                           </div>
                                                                                    ))}
                                                                             </div>
                                                                      </AccordionItem>
                                                               )}

                                                               {/* Project details */}
                                                               {(auction.developer || auction.delivery_date || auction.sale_starts || auction.payment_plan || auction.number_of_buildings || auction.government_fee) && (
                                                                      <AccordionItem title="Project by">
                                                                             {auction.developer && <div className="mb-3"><div>{auction.developer}</div></div>}
                                                                             {auction.delivery_date && <div className="mb-3"><h6 className="mb-1">Delivery Date</h6><div>{formatHuman(auction.delivery_date)}</div></div>}
                                                                             {auction.sale_starts && <div className="mb-3"><h6 className="mb-1">Sale Starts</h6><div>{formatHuman(auction.sale_starts)}</div></div>}
                                                                             {auction.payment_plan && <div className="mb-3"><h6 className="mb-1">Payment Plan</h6><div dangerouslySetInnerHTML={{ __html: auction.payment_plan }} /></div>}
                                                                             {auction.number_of_buildings && <div className="mb-3"><h6 className="mb-1">Number of Buildings</h6><div>{auction.number_of_buildings}</div></div>}
                                                                             {auction.government_fee && <div className="mb-1"><h6 className="mb-1">Government Fee</h6><div dangerouslySetInnerHTML={{ __html: auction.government_fee }} /></div>}
                                                                      </AccordionItem>
                                                               )}

                                                               {/* Location */}
                                                               {auction.location_url && (
                                                                      <AccordionItem title="Location">
                                                                             <div dangerouslySetInnerHTML={{ __html: auction.location_url }} style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }} />
                                                                      </AccordionItem>
                                                               )}

                                                               {/* Amenities/Facilities etc */}
                                                               {auction.amenities && <AccordionItem title="Amenities"><div dangerouslySetInnerHTML={{ __html: auction.amenities }} /></AccordionItem>}
                                                               {auction.facilities && <AccordionItem title="Facilities"><div dangerouslySetInnerHTML={{ __html: auction.facilities }} /></AccordionItem>}
                                                               {auction.nearby_location && <AccordionItem title="Location & Nearby Attractions"><div dangerouslySetInnerHTML={{ __html: auction.nearby_location }} /></AccordionItem>}
                                                        </div>
                                                 </div>

                                                 {auction.list_type === 'auction' && (
                                                        <div className="col-lg-4 col-md-6">
                                                               <BidHistory bids={bids} />
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </section>

                     {showLiveChat && (
                            <section className="container-fluid py-4 border-top">
                                   <h2 className="h5 fw-bold mb-3">Auction live chat</h2>
                                   <div className="row g-3">
                                          <div className="col-lg-5 col-xl-4">
                                                 <ListingLiveChat listingId={auction.id} listingSlug={auction.slug} />
                                          </div>
                                          <div className="col-lg-7 col-xl-8">
                                                 <p className="text-muted small mb-0">
                                                        Public room for this listing. Sign in to send messages; everyone can read recent
                                                        history. For private questions to the seller, use <Link href={route('chat.index')}>Messages</Link>.
                                                 </p>
                                          </div>
                                   </div>
                            </section>
                     )}

                     <RelatedItems items={related} />

              </AppLayout>
       );
}
