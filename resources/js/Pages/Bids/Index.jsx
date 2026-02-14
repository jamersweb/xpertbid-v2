import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import TabNavigation from "@/Components/TabNavigation";
import AuctionCard from "@/Components/AuctionCard";
import { Head, router } from "@inertiajs/react";

export default function Index({ auctions, activeTab }) {
       const tabs = [
              { id: "active", label: "Active Bids", imageSrc: "/assets/images/active_bids.png" },
              { id: "won", label: "Won Auctions", imageSrc: "/assets/images/won_bids.png" },
              { id: "lost", label: "Lost Auctions", imageSrc: "/assets/images/lost_bids.png" },
       ];

       const handleTabChange = (tabId) => {
              router.get(route('bids.index'), { status: tabId }, {
                     preserveState: true,
                     replace: true
              });
       };

       const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

       return (
              <AppLayout title="My Bids">
                     <section className="biddings-tabs py-5">
                            <div className="container">
                                   <div className="mb-4">
                                          <TabNavigation
                                                 tabs={tabs}
                                                 activeTab={activeTab}
                                                 onTabChange={handleTabChange}
                                          />
                                   </div>

                                   <div className="tab-content mt-4">
                                          <div className="row g-4">
                                                 {auctions.data.length > 0 ? (
                                                        auctions.data.map((auction) => (
                                                               <div className="col-12 col-md-6 col-lg-4" key={auction.id}>
                                                                      <AuctionCard
                                                                             auction={auction}
                                                                             activeTab={activeTab}
                                                                      />
                                                               </div>
                                                        ))
                                                 ) : (
                                                        <div className="col-12 text-center py-5">
                                                               {currentTab.imageSrc && (
                                                                      <img
                                                                             src={currentTab.imageSrc}
                                                                             alt={currentTab.id}
                                                                             className="mb-4"
                                                                             style={{ maxWidth: '200px', opacity: 0.6 }}
                                                                      />
                                                               )}
                                                               <h4 className="text-muted">
                                                                      {activeTab === "active" && "You have no active bids yet."}
                                                                      {activeTab === "won" && "You haven't won any auctions yet."}
                                                                      {activeTab === "lost" && "You haven't lost any auctions yet."}
                                                               </h4>
                                                        </div>
                                                 )}
                                          </div>

                                          {/* Pagination */}
                                          {auctions.links && auctions.links.length > 3 && (
                                                 <div className="d-flex justify-content-center mt-5">
                                                        <nav aria-label="Page navigation">
                                                               <ul className="pagination">
                                                                      {auctions.links.map((link, i) => (
                                                                             <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                                                    <button
                                                                                           className="page-item"
                                                                                           onClick={() => link.url && router.get(link.url)}
                                                                                           dangerouslySetInnerHTML={{ __html: link.label }}
                                                                                           style={{
                                                                                                  padding: '8px 16px',
                                                                                                  border: '1px solid #dee2e6',
                                                                                                  background: link.active ? '#000' : '#fff',
                                                                                                  color: link.active ? '#fff' : '#000',
                                                                                                  cursor: link.url ? 'pointer' : 'default'
                                                                                           }}
                                                                                    />
                                                                             </li>
                                                                      ))}
                                                               </ul>
                                                        </nav>
                                                 </div>
                                          )}
                                   </div>
                            </div>
                     </section>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .bid-tabs-child {
                                   border-bottom: 2px solid #f0f0f0;
                                   display: flex;
                                   gap: 10px;
                            }
                            .bid-tabs-anchor .nav-link {
                                   border: none !important;
                                   background: none !important;
                                   color: #666;
                                   font-weight: 600;
                                   padding: 15px 20px;
                                   position: relative;
                                   transition: color 0.3s ease;
                            }
                            .bid-tabs-anchor .nav-link.active {
                                   color: #000;
                            }
                            .bid-tabs-anchor .nav-link.active::after {
                                   content: '';
                                   position: absolute;
                                   bottom: -2px;
                                   left: 0;
                                   right: 0;
                                   height: 2px;
                                   background: #000;
                            }
                            @media (max-width: 576px) {
                                   .bid-tabs-child {
                                          flex-direction: column;
                                   }
                            }
                     `}} />
              </AppLayout>
       );
}
