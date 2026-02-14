import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductHeader from '@/Components/ProductDetails/ProductHeader';
import ProductImages from '@/Components/ProductDetails/ProductImages';
import BidSection from '@/Components/ProductDetails/BidSection';
import BidHistory from '@/Components/ProductDetails/BidHistory';
import RelatedItems from '@/Components/ProductDetails/RelatedItems';
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

export default function Show({ auction, bids, related, highestBid, winnerDetails }) {
       // Bids update automatically via Inertia props after a successful POST

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

                     <section className="product-image-and-brief">
                            <div className="container-fluid">
                                   <div className={`products-brief-parent${auction.featured_name === 'home_featured' ? ' listing_promoted' : ''}`}>
                                          <div className="row">
                                                 <div className="col-md-6">
                                                        <ProductImages
                                                               albumImages={auction.album}
                                                               videos={auction.video}
                                                               status={auction.status}
                                                               mainImage={auction.image}
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
                                                               {(auction.description || auction.product_year || auction.product_location) && (
                                                                      <AccordionItem title="Key Information" defaultOpen={true}>
                                                                             {auction.description && (
                                                                                    <div className="mb-3" dangerouslySetInnerHTML={{ __html: auction.description }} />
                                                                             )}
                                                                             {auction.product_year && (
                                                                                    <div className="row gx-3 gy-2 align-items-center mb-2">
                                                                                           <div className="col-auto">
                                                                                                  <span className="badge bg-dark-subtle text-dark fw-normal">Year</span>
                                                                                           </div>
                                                                                           <div className="col">
                                                                                                  <strong>{auction.product_year}</strong>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
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

                     <RelatedItems items={related} />

              </AppLayout>
       );
}
