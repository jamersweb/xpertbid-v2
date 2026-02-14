import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function Filter({ categories = [], filters = {} }) {
       const [price, setPrice] = useState(filters?.priceMax || 10000000);
       const [expandedCategory, setExpandedCategory] = useState(null);
       const [expandedSubCategory, setExpandedSubCategory] = useState(null);
       const { url } = usePage();

       // Helper to handle category change (single selection logic like reference)
       const handleCategoryChange = (slug) => {
              const currentSlug = route().params.slug;
              if (currentSlug === slug) {
                     // If clicking already selected, maybe clear it? For now, let's keep it or redirect to all
                     router.get(route('marketplace.index'), { ...filters }, { preserveState: true });
              } else {
                     router.get(route('marketplace.index', { slug: slug === 'all' ? null : slug }), { ...filters }, { preserveState: true });
              }
       };

       const toggleStatus = (status) => {
              let newStatus = [...(filters.status || [])];
              if (newStatus.includes(status)) {
                     newStatus = newStatus.filter(s => s !== status);
              } else {
                     newStatus.push(status);
              }
              const params = { ...route().params, ...filters, status: newStatus };
              router.get(route('marketplace.index', route().params), params, { preserveState: true, preserveScroll: true });
       };

       const handlePriceChange = (e) => setPrice(e.target.value);
       const applyPriceFilter = () => {
              const params = { ...route().params, ...filters, priceMax: price };
              router.get(route('marketplace.index', route().params), params, { preserveState: true, preserveScroll: true });
       };

       const toggleCategoryExpand = (slug) => setExpandedCategory(prev => (prev === slug ? null : slug));
       const toggleSubCategoryExpand = (slug) => setExpandedSubCategory(prev => (prev === slug ? null : slug));

       const isSelected = (slug) => route().params.slug === slug;

       return (
              <aside className="static-filter-sidebar p-4 bg-white">
                     {/* Category */}
                     <div className="filter-group mb-5">
                            <h4 className="fw-bold mb-3 h6 text-uppercase ls-1 text-dark">Category</h4>
                            <ul className="list-unstyled">
                                   <li className="mb-2">
                                          <label className="custom-checkbox d-flex align-items-center">
                                                 <input
                                                        type="checkbox"
                                                        checked={!route().params.slug}
                                                        onChange={() => handleCategoryChange('all')}
                                                 />
                                                 <span className="checkmark me-2"></span>
                                                 <span className={!route().params.slug ? 'fw-bold text-primary' : 'text-secondary'}>Any Category</span>
                                          </label>
                                   </li>

                                   {categories.map((cat) => (
                                          <li key={cat.id} className="mb-2">
                                                 <div className="d-flex align-items-center justify-content-between">
                                                        <label className="custom-checkbox d-flex align-items-center flex-grow-1 cursor-pointer">
                                                               <input
                                                                      type="checkbox"
                                                                      checked={isSelected(cat.slug)}
                                                                      onChange={() => handleCategoryChange(cat.slug)}
                                                               />
                                                               <span className="checkmark me-2"></span>
                                                               <span className={isSelected(cat.slug) ? 'fw-bold text-primary' : 'text-dark'}>{cat.name}</span>
                                                        </label>
                                                        {cat.sub_categories?.length > 0 && (
                                                               <button className="btn btn-sm p-0 border-0" onClick={() => toggleCategoryExpand(cat.slug)}>
                                                                      <svg
                                                                             xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                                             style={{ transform: expandedCategory === cat.slug ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.2s' }}
                                                                      >
                                                                             <path d="M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                      </svg>
                                                               </button>
                                                        )}
                                                 </div>

                                                 {expandedCategory === cat.slug && (
                                                        <ul className="list-unstyled ms-4 mt-2">
                                                               {cat.sub_categories.map((sub) => (
                                                                      <li key={sub.id} className="mb-2">
                                                                             <div className="d-flex align-items-center justify-content-between">
                                                                                    <label className="custom-checkbox d-flex align-items-center flex-grow-1 cursor-pointer">
                                                                                           <input
                                                                                                  type="checkbox"
                                                                                                  checked={isSelected(sub.slug)}
                                                                                                  onChange={() => handleCategoryChange(sub.slug)}
                                                                                           />
                                                                                           <span className="checkmark me-2"></span>
                                                                                           <span className={isSelected(sub.slug) ? 'fw-bold text-primary' : 'text-muted'}>{sub.name}</span>
                                                                                    </label>
                                                                                    {sub.child_categories?.length > 0 && (
                                                                                           <button className="btn btn-sm p-0 border-0" onClick={() => toggleSubCategoryExpand(sub.slug)}>
                                                                                                  <svg
                                                                                                         xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                                                                         style={{ transform: expandedSubCategory === sub.slug ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.2s' }}
                                                                                                  >
                                                                                                         <path d="M4.07998 8.94998L10.6 15.47C11.37 16.24 12.63 16.24 13.4 15.47L19.92 8.94999" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                                  </svg>
                                                                                           </button>
                                                                                    )}
                                                                             </div>

                                                                             {expandedSubCategory === sub.slug && (
                                                                                    <ul className="list-unstyled ms-4 mt-2">
                                                                                           {sub.child_categories.map((child) => (
                                                                                                  <li key={child.id} className="mb-1">
                                                                                                         <label className="custom-checkbox d-flex align-items-center cursor-pointer">
                                                                                                                <input
                                                                                                                       type="checkbox"
                                                                                                                       checked={isSelected(child.slug)}
                                                                                                                       onChange={() => handleCategoryChange(child.slug)}
                                                                                                                />
                                                                                                                <span className="checkmark me-2"></span>
                                                                                                                <span className={isSelected(child.slug) ? 'fw-bold text-primary' : 'text-muted'}>{child.name}</span>
                                                                                                         </label>
                                                                                                  </li>
                                                                                           ))}
                                                                                    </ul>
                                                                             )}
                                                                      </li>
                                                               ))}
                                                        </ul>
                                                 )}
                                          </li>
                                   ))}
                            </ul>
                     </div>

                     {/* Status */}
                     <div className="filter-group mb-5">
                            <h4 className="fw-bold mb-3 h6 text-uppercase ls-1 text-dark">Status</h4>
                            <ul className="list-unstyled">
                                   {['Live Auctions', 'Ending Soon', 'Recent Listings'].map((stat) => (
                                          <li className="mb-2" key={stat}>
                                                 <label className="custom-checkbox d-flex align-items-center cursor-pointer">
                                                        <input
                                                               type="checkbox"
                                                               checked={(filters?.status || []).includes(stat)}
                                                               onChange={() => toggleStatus(stat)}
                                                        />
                                                        <span className="checkmark me-2"></span>
                                                        <span className="text-secondary">{stat}</span>
                                                 </label>
                                          </li>
                                   ))}
                            </ul>
                     </div>

                     {/* Price */}
                     <div className="filter-group">
                            <h4 className="fw-bold mb-3 h6 text-uppercase ls-1 text-dark">Price Range</h4>
                            <div className="px-1">
                                   <div className="d-flex justify-content-between mb-2 align-items-end">
                                          <span className="text-muted small text-uppercase fw-bold">Max Price</span>
                                          <span className="fw-bold text-dark h5 m-0">PKR {Number(price).toLocaleString()}</span>
                                   </div>
                                   <input
                                          type="range"
                                          className="form-range"
                                          min="0"
                                          max="10000000"
                                          step="1000"
                                          value={price}
                                          onChange={handlePriceChange}
                                          onMouseUp={applyPriceFilter}
                                          onTouchEnd={applyPriceFilter}
                                   />
                                   <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                                          <span>0</span>
                                          <span>10M+</span>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                     .custom-checkbox { position: relative; cursor: pointer; user-select: none; }
                     .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
                     .checkmark { height: 18px; width: 18px; background-color: #eee; border-radius: 4px; position: relative; display: inline-block; flex-shrink: 0; }
                     .custom-checkbox:hover input ~ .checkmark { background-color: #ccc; }
                     .custom-checkbox input:checked ~ .checkmark { background-color: #0d6efd; }
                     .checkmark:after { content: ""; position: absolute; display: none; }
                     .custom-checkbox input:checked ~ .checkmark:after { display: block; }
                     .custom-checkbox .checkmark:after { left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
                     .ls-1 { letter-spacing: 1px; }
                     `}} />
              </aside>
       );
}
