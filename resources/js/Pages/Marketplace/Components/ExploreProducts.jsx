import React from 'react';
import AuctionCard from '@/Components/AuctionCard';

export default function ExploreProducts({ products }) {
       if (!products || products.length === 0) {
              return (
                     <div className="text-center py-5 bg-white rounded-3 shadow-sm border mt-4">
                            <div className="mb-3 d-flex justify-content-center">
                                   <svg
                                          width="64"
                                          height="64"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                   >
                                          <path d="M3 8.5L12 3L21 8.5M3 8.5V15.5L12 21M3 8.5L12 14M21 8.5V15.5L12 21M21 8.5L12 14M12 14V21" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                            </div>
                            <h3 className="h5 fw-bold text-dark">No Products Found</h3>
                            <p className="text-muted">We couldn't find any products matching your current filters.</p>
                            <button
                                   onClick={() => window.location.href = route('marketplace.index')}
                                   className="btn btn-dark rounded-3 px-4 py-2 mt-2"
                            >
                                   Clear All Filters
                            </button>
                     </div>
              );
       }

       return (
              <div className="row makt-parent w-100 mx-auto">
                     {products.map((product) => (
                            <div className="col-md-6 col-xl-4 mkt-child mb-4" key={product.id}>
                                   <AuctionCard auction={product} showPropertyMeta />
                            </div>
                     ))}
              </div>
       );
}
