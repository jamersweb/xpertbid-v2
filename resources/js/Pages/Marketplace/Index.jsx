import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Filter from './Components/Filter';
import ExploreProducts from './Components/ExploreProducts';
import Pagination from '@/Components/Pagination'; // Assuming exists, otherwise I'll need to create/port it

export default function Index({ products = { data: [], links: [] }, categories = [], currentCategory = null, filters = {} }) {
       const handlePageChange = (url) => {
              if (!url) return;
              router.get(url, {}, {
                     preserveState: true,
                     preserveScroll: true,
              });
       };

       // Use filters prop instead of window.location to avoid SSR issues
       const currentType = filters?.type || 'auction';

       const handleTabChange = (type) => {
              const url = new URL(window.location.href);
              url.searchParams.set('type', type);
              url.searchParams.set('page', 1); // Reset to page 1 on tab switch
              router.get(url.toString(), {}, {
                     preserveState: true,
                     preserveScroll: true,
              });
       };

       return (
              <AppLayout title={currentCategory?.meta_title || "Marketplace"}>
                     <Head>
                            <title>{currentCategory?.meta_title || "Marketplace | XpertBid"}</title>
                            <meta name="description" content={currentCategory?.meta_description || "Explore our marketplace for the best deals."} />
                     </Head>

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container-fluid px-lg-5">
                                   {/* Tabs for Auction vs Normal */}
                                   <div className="d-flex justify-content-center mb-4">
                                          <div className="bg-white p-1 rounded-pill shadow-sm border d-inline-flex">
                                                 <button
                                                        onClick={() => handleTabChange('auction')}
                                                        className={`btn rounded-pill px-4 fw-bold ${currentType === 'auction' ? 'btn-dark' : 'btn-light text-muted'}`}
                                                        style={{ minWidth: '160px' }}
                                                 >
                                                        Auction Listings
                                                 </button>
                                                 <button
                                                        onClick={() => handleTabChange('normal_list')}
                                                        className={`btn rounded-pill px-4 fw-bold ${currentType === 'normal_list' ? 'btn-dark' : 'btn-light text-muted'}`}
                                                        style={{ minWidth: '160px' }}
                                                 >
                                                        Direct Buy Listings
                                                 </button>
                                          </div>
                                   </div>

                                   {currentCategory?.seo_short_content && (
                                          <div className="bg-white rounded-4 p-4 shadow-sm mb-4 border text-center text-dark content-wrapper">
                                                 <div dangerouslySetInnerHTML={{ __html: currentCategory.seo_short_content }} />
                                          </div>
                                   )}

                                   <div className="row g-4">
                                          <div className="col-lg-4 mkt-left">
                                                 <Filter categories={categories} filters={filters} />
                                          </div>

                                          <div className="col-lg-8 mkt-right">
                                                 <div className="mkt-page-plc-hdig mb-4 bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center justify-content-between">
                                                        <h2 className="h4 fw-bold text-dark m-0">
                                                               {currentCategory?.name ? `${currentCategory.name}` : "All Items"}
                                                               <span className="text-muted fs-6 ms-2 fw-normal">
                                                                      ({currentType === 'auction' ? 'Auctions' : 'Direct Buy'})
                                                               </span>
                                                               <span className="badge bg-light text-primary ms-2 fs-6 fw-normal border">
                                                                      {products?.total || 0} products
                                                               </span>
                                                        </h2>

                                                        <div className="d-flex gap-2">
                                                               {/* Sort dropdown could go here */}
                                                        </div>
                                                 </div>

                                                 <ExploreProducts products={products.data} />

                                                 {products.links && (
                                                        <div className="mt-5 d-flex justify-content-center">
                                                               <Pagination links={products.links} />
                                                        </div>
                                                 )}

                                                 {currentCategory?.seo_content && (
                                                        <div className="bg-white rounded-4 p-5 shadow-sm mt-5 border text-dark content-wrapper">
                                                               <div dangerouslySetInnerHTML={{ __html: currentCategory.seo_content }} />
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>
                     <style>{`
                            .content-wrapper {
                                   color: #212529 !important;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                     `}</style>
              </AppLayout>
       );
}
