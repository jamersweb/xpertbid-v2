import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductHeader from '@/Components/ProductDetails/ProductHeader';
import ProductImages from '@/Components/ProductDetails/ProductImages';
import BidSection from '@/Components/ProductDetails/BidSection';
import BidHistory from '@/Components/ProductDetails/BidHistory';
import RelatedItems from '@/Components/ProductDetails/RelatedItems';
import ListingLiveChat from '@/Components/ProductDetails/ListingLiveChat';
import { useState } from 'react';
import axios from 'axios';

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

export default function Show({ auction, bids, related, highestBid, winnerDetails, isFavorite, dynamicFields = [] }) {
       const { auth } = usePage().props;
       const listingType = String(auction?.listing_type || '').toLowerCase();
       const listingStatus = String(auction?.status || '').trim().toLowerCase();
       const isAuctionLikeListing = ['auction', 'live_auction'].includes(listingType);
       const showLiveChat = isAuctionLikeListing && listingStatus === 'active';

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

                     if (!formatted) return null;

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

       const fallbackRows = Object.entries(categoryFeatures)
              .filter(([key, value]) => !mappedKeys.has(key) && formatFeatureValue(value))
              .map(([key, value]) => ({
                     key,
                     label: prettifyKey(key),
                     value: formatFeatureValue(value),
              }));

       const allFeatureRows = [...dynamicFeatureRows, ...fallbackRows];

       return (
              <AppLayout title={auction.title}>
                     <Head>
                            <meta name="description" content={auction.description?.substring(0, 160)} />
                     </Head>

                     <ProductHeader
                            views={auction.views}
                            productId={auction.id}
                            slug={auction.slug}
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
