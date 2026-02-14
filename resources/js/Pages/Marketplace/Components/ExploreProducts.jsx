import React from 'react';
import AuctionCard from '@/Components/AuctionCard';

export default function ExploreProducts({ products }) {
       if (!products || products.length === 0) {
              return (
                     <div className="text-center py-5 bg-white rounded-3 shadow-sm border mt-4">
                            <div className="mb-3 opacity-25">
                                   <i className="fa-solid fa-box-open fa-4x"></i>
                            </div>
                            <h3 className="h5 fw-bold text-dark">No Products Found</h3>
                            <p className="text-muted">We couldn't find any products matching your current filters.</p>
                            <button
                                   onClick={() => window.location.href = route('marketplace.index')}
                                   className="btn btn-primary rounded-pill px-4 mt-2"
                            >
                                   Clear All Filters
                            </button>
                     </div>
              );
       }

       return (
              <div className="row makt-parent w-100 mx-auto">
                     {products.map((product) => (
                            <div className="col-md-6 mkt-child" key={product.id}>
                                   <AuctionCard auction={product} />
                            </div>
                     ))}
              </div>
       );
}
