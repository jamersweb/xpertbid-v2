import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AuctionCard from '@/Components/AuctionCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const parseDynamicOptions = (options) => {
       if (Array.isArray(options)) {
              return options.filter((item) => String(item || '').trim() !== '');
       }

       if (typeof options === 'string') {
              const trimmed = options.trim();
              if (trimmed === '') {
                     return [];
              }

              try {
                     const parsed = JSON.parse(trimmed);
                     if (Array.isArray(parsed)) {
                            return parsed.filter((item) => String(item || '').trim() !== '');
                     }
              } catch (error) {
                     // Fallback to comma split for non-JSON values.
              }

              return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
       }

       return [];
};

const getInitialDynamicFilters = (filters = {}) => {
       const initial = {};
       Object.entries(filters || {}).forEach(([key, value]) => {
              if (!String(key).startsWith('df_')) {
                     return;
              }

              if (Array.isArray(value)) {
                     initial[key] = value.map((item) => String(item));
                     return;
              }

              if (value === null || value === undefined || value === '') {
                     return;
              }

              const text = String(value);
              initial[key] = text.includes(',') ? text.split(',').map((item) => item.trim()).filter(Boolean) : text;
       });
       return initial;
};

const sanitizeSeoHtml = (html) => {
       if (typeof html !== 'string' || html.trim() === '') {
              return '';
       }

       return html
              .replace(/<li\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/li>/gi, '')
              .replace(/<p\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/p>/gi, '')
              .replace(/<ul\b([^>]*)>\s*<\/ul>/gi, '<ul$1></ul>')
              .replace(/<ol\b([^>]*)>\s*<\/ol>/gi, '<ol$1></ol>');
};

const CuratedMarketplaceSection = ({ title, items = [], slider = false }) => {
       if (!items || items.length === 0) {
              return null;
       }

       return (
              <section className="marketplace-curated-section">
                     <div className="marketplace-curated-header">
                            <h3>{title}</h3>
                     </div>

                     {slider ? (
                            <div className="marketplace-curated-slider">
                                   <Swiper
                                          modules={[Navigation]}
                                          navigation={items.length > 3}
                                          spaceBetween={20}
                                          loop={items.length > 4}
                                          breakpoints={{
                                                 360: { slidesPerView: 1.05 },
                                                 550: { slidesPerView: 1.4 },
                                                 768: { slidesPerView: 2 },
                                                 1024: { slidesPerView: 2.6 },
                                                 1280: { slidesPerView: 3 },
                                          }}
                                   >
                                          {items.map((item) => (
                                                 <SwiperSlide key={`curated-${title}-${item.id}`}>
                                                        <AuctionCard auction={item} showPropertyMeta />
                                                 </SwiperSlide>
                                          ))}
                                   </Swiper>
                            </div>
                     ) : (
                            <div className="row">
                                   {items.map((item) => (
                                          <div className="col-md-6 col-xl-4 mb-4" key={`curated-${title}-${item.id}`}>
                                                 <AuctionCard auction={item} showPropertyMeta />
                                          </div>
                                   ))}
                            </div>
                     )}
              </section>
       );
};

const EmptyProductsState = () => (
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

const LatestProductsGrid = ({ title, items = [], hasMore = false, loading = false, onLoadMore }) => (
       <section className="marketplace-latest-grid-section">
              <div className="marketplace-curated-header">
                     <h3>{title}</h3>
              </div>

              {items.length === 0 ? (
                     <EmptyProductsState />
              ) : (
                     <>
                            <div className="row makt-parent w-100 mx-auto">
                                   {items.map((product) => (
                                          <div className="col-md-6 col-xl-4 mkt-child mb-4" key={product.id}>
                                                 <AuctionCard auction={product} showPropertyMeta />
                                          </div>
                                   ))}
                            </div>

                            {hasMore && (
                                   <div className="d-flex justify-content-center mt-2">
                                          <button
                                                 type="button"
                                                 className="marketplace-load-more-btn"
                                                 onClick={onLoadMore}
                                                 disabled={loading}
                                          >
                                                 {loading ? 'Loading...' : 'Load More'}
                                          </button>
                                   </div>
                            )}
                     </>
              )}
       </section>
);

export default function Index({
       products = { data: [], links: [] },
       categories = [],
       currentCategory = null,
       currentTopCategory = null,
       subcategoryTabs = [],
       currentSubcategory = null,
       childCategoryTabs = [],
       countries = [],
       dynamicFields = [],
       featuredProducts = [],
       mostViewedProducts = [],
       filters = {},
       currentType: serverCurrentType = 'auction',
}) {
       const [searchTerm, setSearchTerm] = useState(filters?.search || '');
       const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
       const [selectedCountryId, setSelectedCountryId] = useState(filters?.country_id ? String(filters.country_id) : '');
       const [selectedStateId, setSelectedStateId] = useState(filters?.state_id ? String(filters.state_id) : '');
       const [selectedCityId, setSelectedCityId] = useState(filters?.city_id ? String(filters.city_id) : '');
       const [states, setStates] = useState([]);
       const [cities, setCities] = useState([]);
       const [dynamicFilterValues, setDynamicFilterValues] = useState(() => getInitialDynamicFilters(filters));
       const [latestGridProducts, setLatestGridProducts] = useState(products?.data || []);
       const [nextProductsPageUrl, setNextProductsPageUrl] = useState(products?.next_page_url || null);
       const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
       const fallbackHeroImage = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80';
       const heroImage = currentTopCategory?.image_url || currentCategory?.image_url || fallbackHeroImage;
       const currentType = serverCurrentType || filters?.type || 'auction';
       const showChildTabs = Boolean(currentSubcategory);
       const showMainCategoryTabs = !currentTopCategory && !currentCategory && categories.length > 0;
       const sectionEntityName = currentTopCategory?.name || currentCategory?.name || 'Products';
       const sectionMode = String(filters?.section || '').toLowerCase();
       const isSectionOnlyView = ['featured', 'latest_auctions', 'latest_vehicles', 'latest_properties', 'latest_listings'].includes(sectionMode);
       const sectionTitleMap = {
              featured: 'Featured Products',
              latest_auctions: 'Latest Auctions',
              latest_vehicles: 'Latest Vehicles',
              latest_properties: 'Latest Properties',
              latest_listings: 'Latest Listings',
       };
       const latestGridTitle = sectionTitleMap[sectionMode] || `Latest ${sectionEntityName}`;
       const seoShortContent = sanitizeSeoHtml(currentCategory?.seo_short_content);
       const seoContent = sanitizeSeoHtml(currentCategory?.seo_content);

       const tabs = [
              { key: 'auction', label: 'Auction', mobileLabel: 'Auction' },
              { key: 'normal', label: 'Normal Products', mobileLabel: 'Normal' },
              { key: 'business', label: 'Business Products', mobileLabel: 'Business' },
       ];

       const typeSlugMap = {
              auction: 'auctions',
              normal: 'normal-products',
              normal_list: 'normal-products',
              business: 'business-products',
              business_list: 'business-products',
       };

       const marketplaceUrl = (type = currentType, slug = currentCategory?.slug) => {
              if (slug) {
                     return route('marketplace.type', {
                            slug,
                            typeSlug: typeSlugMap[type] || 'auctions',
                     });
              }

              return route('marketplace.index');
       };

       const cleanFilters = (nextFilters = filters) => {
              const cleaned = { ...nextFilters };
              delete cleaned.type;
              delete cleaned.category;
              delete cleaned.page;
              delete cleaned.section;

              return cleaned;
       };

       const handleTabChange = (type) => {
              router.get(
                     marketplaceUrl(type),
                     {
                            ...cleanFilters(),
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
       };

       const handleSearchSubmit = (e) => {
              e.preventDefault();

              router.get(
                     marketplaceUrl(),
                     {
                            ...cleanFilters(),
                            search: searchTerm,
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
       };

       const handleCategoryTabChange = (slug) => {
              router.get(
                     marketplaceUrl(currentType, slug),
                     {
                            ...cleanFilters(),
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
       };

       const handleMainCategoriesBack = () => {
              router.get(
                     route('marketplace.index'),
                     {
                            ...cleanFilters(),
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
       };

       useEffect(() => {
              setSearchTerm(filters?.search || '');
              setSelectedCountryId(filters?.country_id ? String(filters.country_id) : '');
              setSelectedStateId(filters?.state_id ? String(filters.state_id) : '');
              setSelectedCityId(filters?.city_id ? String(filters.city_id) : '');
              setDynamicFilterValues(getInitialDynamicFilters(filters));
       }, [filters]);

       useEffect(() => {
              const nextItems = products?.data || [];

              if ((products?.current_page || 1) <= 1) {
                     setLatestGridProducts(nextItems);
              } else {
                     setLatestGridProducts((previousItems) => {
                            const seen = new Set(previousItems.map((item) => item.id));
                            const appended = nextItems.filter((item) => !seen.has(item.id));
                            return [...previousItems, ...appended];
                     });
              }

              setNextProductsPageUrl(products?.next_page_url || null);
              setIsLoadingMoreProducts(false);
       }, [products]);

       useEffect(() => {
              let cancelled = false;

              const loadStates = async () => {
                     if (!selectedCountryId) {
                            setStates([]);
                            setSelectedStateId('');
                            setCities([]);
                            setSelectedCityId('');
                            return;
                     }

                     try {
                            const response = await fetch(`/get-states/${selectedCountryId}`);
                            const data = await response.json();
                            if (cancelled) {
                                   return;
                            }

                            const nextStates = Array.isArray(data?.state) ? data.state : [];
                            setStates(nextStates);

                            if (!nextStates.find((state) => String(state.id) === String(selectedStateId))) {
                                   setSelectedStateId('');
                                   setCities([]);
                                   setSelectedCityId('');
                            }
                     } catch (error) {
                            if (!cancelled) {
                                   setStates([]);
                                   setSelectedStateId('');
                                   setCities([]);
                                   setSelectedCityId('');
                            }
                     }
              };

              loadStates();

              return () => {
                     cancelled = true;
              };
       }, [selectedCountryId]);

       useEffect(() => {
              let cancelled = false;

              const loadCities = async () => {
                     if (!selectedStateId) {
                            setCities([]);
                            setSelectedCityId('');
                            return;
                     }

                     try {
                            const response = await fetch(`/get-cities/${selectedStateId}`);
                            const data = await response.json();
                            if (cancelled) {
                                   return;
                            }

                            const nextCities = Array.isArray(data?.city) ? data.city : [];
                            setCities(nextCities);
                            if (!nextCities.find((city) => String(city.id) === String(selectedCityId))) {
                                   setSelectedCityId('');
                            }
                     } catch (error) {
                            if (!cancelled) {
                                   setCities([]);
                                   setSelectedCityId('');
                            }
                     }
              };

              loadCities();

              return () => {
                     cancelled = true;
              };
       }, [selectedStateId]);

       const applyFilters = () => {
              const nextFilters = {
                     ...filters,
                     search: searchTerm,
                     page: 1,
              };

              if (selectedCountryId) nextFilters.country_id = selectedCountryId;
              else delete nextFilters.country_id;

              if (selectedStateId) nextFilters.state_id = selectedStateId;
              else delete nextFilters.state_id;

              if (selectedCityId) nextFilters.city_id = selectedCityId;
              else delete nextFilters.city_id;

              dynamicFields.forEach((field) => {
                     const key = `df_${field.id}`;
                     const value = dynamicFilterValues[key];
                     if (Array.isArray(value)) {
                            if (value.length > 0) {
                                   nextFilters[key] = value.join(',');
                            } else {
                                   delete nextFilters[key];
                            }
                            return;
                     }

                     if (value !== undefined && value !== null && String(value).trim() !== '') {
                            nextFilters[key] = value;
                     } else {
                            delete nextFilters[key];
                     }
              });

              router.get(marketplaceUrl(), cleanFilters(nextFilters), {
                     preserveState: true,
                     preserveScroll: true,
              });

              setIsFilterDrawerOpen(false);
       };

       const clearFilters = () => {
              setSelectedCountryId('');
              setSelectedStateId('');
              setSelectedCityId('');
              setStates([]);
              setCities([]);
              setDynamicFilterValues({});

              const nextFilters = {
                     ...filters,
                     search: searchTerm,
                     page: 1,
              };

              delete nextFilters.country_id;
              delete nextFilters.state_id;
              delete nextFilters.city_id;
              Object.keys(nextFilters).forEach((key) => {
                     if (key.startsWith('df_')) {
                            delete nextFilters[key];
                     }
              });

              router.get(marketplaceUrl(), cleanFilters(nextFilters), {
                     preserveState: true,
                     preserveScroll: true,
              });
       };

       const handleCheckboxDynamicChange = (fieldId, option, checked) => {
              const key = `df_${fieldId}`;
              setDynamicFilterValues((prev) => {
                     const previousValue = prev[key];
                     const currentValues = Array.isArray(previousValue)
                            ? previousValue
                            : previousValue
                                   ? [String(previousValue)]
                                   : [];
                     const nextValues = checked
                            ? Array.from(new Set([...currentValues, option]))
                            : currentValues.filter((item) => item !== option);

                     return {
                            ...prev,
                            [key]: nextValues,
                     };
              });
       };

       const loadMoreProducts = () => {
              if (!nextProductsPageUrl || isLoadingMoreProducts) {
                     return;
              }

              setIsLoadingMoreProducts(true);
              router.get(nextProductsPageUrl, {}, {
                     preserveState: true,
                     preserveScroll: true,
                     only: ['products'],
                     onFinish: () => setIsLoadingMoreProducts(false),
              });
       };

       return (
              <AppLayout title={currentCategory?.meta_title || 'Marketplace'}>
                     <Head>
                            <title>{currentCategory?.meta_title || 'Marketplace | XpertBid'}</title>
                            <meta
                                   name="description"
                                   content={currentCategory?.meta_description || 'Explore our marketplace for the best deals.'}
                            />
                     </Head>

                     <div className="pb-5 bg-light min-vh-100">
                            <div
                                   className="marketplace-topbar-wrap"
                                   style={
                                          heroImage
                                                 ? {
                                                          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url("${heroImage}")`,
                                                   }
                                                 : undefined
                                   }
                            >
                                   <div className="container-fluid px-lg-5">
                                          <div className="marketplace-topbar p-3 p-lg-4">
                                                 <div className="marketplace-selected-category mb-3">
                                                        {currentCategory?.name || currentTopCategory?.name || 'Marketplace'}
                                                 </div>

                                                 {showMainCategoryTabs && (
                                                        <div className="marketplace-subcategory-tabs mb-3">
                                                               {categories.map((mainCategory) => (
                                                                      <button
                                                                             key={mainCategory.id}
                                                                             type="button"
                                                                             onClick={() => handleCategoryTabChange(mainCategory.slug)}
                                                                             className="marketplace-subcategory-tab"
                                                                      >
                                                                             {mainCategory.name}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 )}

                                                 {currentTopCategory && !showChildTabs && (
                                                        <div className="marketplace-subcategory-tabs mb-3">
                                                               <button
                                                                      type="button"
                                                                      onClick={handleMainCategoriesBack}
                                                                      className="marketplace-subcategory-back"
                                                                      aria-label="Back to main categories"
                                                               >
                                                                      <span aria-hidden="true">&larr;</span>
                                                               </button>

                                                               <button
                                                                      type="button"
                                                                      onClick={() => handleCategoryTabChange(currentTopCategory.slug)}
                                                                      className={`marketplace-subcategory-tab ${currentCategory?.slug === currentTopCategory.slug ? 'is-active' : ''}`}
                                                               >
                                                                      All {currentTopCategory.name}
                                                               </button>

                                                               {subcategoryTabs.map((subcategory) => (
                                                                      <button
                                                                             key={subcategory.id}
                                                                             type="button"
                                                                             onClick={() => handleCategoryTabChange(subcategory.slug)}
                                                                             className={`marketplace-subcategory-tab ${currentCategory?.slug === subcategory.slug ? 'is-active' : ''}`}
                                                                      >
                                                                             {subcategory.name}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 )}

                                                 {currentTopCategory && showChildTabs && (
                                                        <div className="marketplace-subcategory-tabs mb-3">
                                                               <button
                                                                      type="button"
                                                                      onClick={() => handleCategoryTabChange(currentTopCategory.slug)}
                                                                      className="marketplace-subcategory-back"
                                                                      aria-label="Back to subcategories"
                                                               >
                                                                      <span aria-hidden="true">&larr;</span>
                                                               </button>

                                                               {childCategoryTabs.map((childCategory) => (
                                                                      <button
                                                                             key={childCategory.id}
                                                                             type="button"
                                                                             onClick={() => handleCategoryTabChange(childCategory.slug)}
                                                                             className={`marketplace-subcategory-tab ${currentCategory?.slug === childCategory.slug ? 'is-active' : ''}`}
                                                                      >
                                                                             {childCategory.name}
                                                                      </button>
                                                               ))}
                                                        </div>
                                                 )}

                                                 <form onSubmit={handleSearchSubmit} className="marketplace-searchbar mb-3">
                                                        <div className="marketplace-searchbar-row">
                                                               <input
                                                                      type="text"
                                                                      value={searchTerm}
                                                                      onChange={(e) => setSearchTerm(e.target.value)}
                                                                      placeholder="Search products..."
                                                               />
                                                               <button
                                                                      type="button"
                                                                      className="marketplace-filter-btn"
                                                                      onClick={() => setIsFilterDrawerOpen(true)}
                                                                      aria-label="Open filters"
                                                               >
                                                                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                                             <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                                                      </svg>
                                                               </button>
                                                        </div>
                                                 </form>

                                                 <div className="marketplace-top-tabs">
                                                       {tabs.map((tab) => {
                                                              const isActive =
                                                                      (tab.key === 'auction' && currentType === 'auction') ||
                                                                      (tab.key === 'normal' && ['normal', 'normal_list'].includes(currentType)) ||
                                                                      (tab.key === 'business' && ['business', 'business_list'].includes(currentType));

                                                               const tabType =
                                                                      tab.key === 'normal'
                                                                             ? 'normal'
                                                                             : tab.key === 'business'
                                                                                   ? 'business'
                                                                                   : tab.key;

                                                               return (
                                                                      <button
                                                                             key={tab.key}
                                                                             type="button"
                                                                             onClick={() => handleTabChange(tabType)}
                                                                             className={`marketplace-top-tab ${isActive ? 'is-active' : ''}`}
                                                                      >
                                                                             <span className="d-none d-md-inline">{tab.label}</span>
                                                                             <span className="d-inline d-md-none">{tab.mobileLabel || tab.label}</span>
                                                                      </button>
                                                               );
                                                        })}
                                                 </div>
                                          </div>
                                   </div>
                            </div>

                            <div className="container-fluid px-3 px-lg-5 pt-4">
                                   {!isSectionOnlyView && seoShortContent && (
                                          <div className="content-wrapper content-wrapper-short mb-4 text-dark">
                                                 <div dangerouslySetInnerHTML={{ __html: seoShortContent }} />
                                          </div>
                                   )}

                                   <div className="mkt-right">
                                          {!isSectionOnlyView && (
                                                 <CuratedMarketplaceSection
                                                        title={`Featured ${sectionEntityName}`}
                                                        items={featuredProducts}
                                                        slider
                                                 />
                                          )}

                                          {!isSectionOnlyView && (
                                                 <CuratedMarketplaceSection
                                                        title={`Most Viewed ${sectionEntityName}`}
                                                        items={mostViewedProducts}
                                                        slider
                                                 />
                                          )}

                                          <LatestProductsGrid
                                                 title={latestGridTitle}
                                                 items={latestGridProducts}
                                                 hasMore={Boolean(nextProductsPageUrl)}
                                                 loading={isLoadingMoreProducts}
                                                 onLoadMore={loadMoreProducts}
                                          />

                                          {!isSectionOnlyView && seoContent && (
                                                 <div className="content-wrapper content-wrapper-long mt-5 text-dark">
                                                        <div dangerouslySetInnerHTML={{ __html: seoContent }} />
                                                 </div>
                                          )}
                                   </div>
                            </div>

                            {isFilterDrawerOpen && (
                                   <>
                                          <div className="marketplace-filter-backdrop" onClick={() => setIsFilterDrawerOpen(false)} />
                                          <aside className="marketplace-filter-drawer">
                                                 <div className="marketplace-filter-header">
                                                        <h3>Filters</h3>
                                                        <button type="button" onClick={() => setIsFilterDrawerOpen(false)} aria-label="Close filters">
                                                               &times;
                                                        </button>
                                                 </div>

                                                 <div className="marketplace-filter-body">
                                                        <div className="marketplace-filter-group">
                                                               <label>Country</label>
                                                               <select
                                                                      value={selectedCountryId}
                                                                      onChange={(e) => {
                                                                             const value = e.target.value;
                                                                             setSelectedCountryId(value);
                                                                             setSelectedStateId('');
                                                                             setSelectedCityId('');
                                                                      }}
                                                               >
                                                                      <option value="">All Countries</option>
                                                                      {countries.map((country) => (
                                                                             <option key={country.id} value={country.id}>
                                                                                    {country.name}
                                                                             </option>
                                                                      ))}
                                                               </select>
                                                        </div>

                                                        <div className="marketplace-filter-group">
                                                               <label>State</label>
                                                               <select
                                                                      value={selectedStateId}
                                                                      onChange={(e) => {
                                                                             setSelectedStateId(e.target.value);
                                                                             setSelectedCityId('');
                                                                      }}
                                                                      disabled={!selectedCountryId}
                                                               >
                                                                      <option value="">All States</option>
                                                                      {states.map((state) => (
                                                                             <option key={state.id} value={state.id}>
                                                                                    {state.name}
                                                                             </option>
                                                                      ))}
                                                               </select>
                                                        </div>

                                                        <div className="marketplace-filter-group">
                                                               <label>City</label>
                                                               <select
                                                                      value={selectedCityId}
                                                                      onChange={(e) => setSelectedCityId(e.target.value)}
                                                                      disabled={!selectedStateId}
                                                               >
                                                                      <option value="">All Cities</option>
                                                                      {cities.map((city) => (
                                                                             <option key={city.id} value={city.id}>
                                                                                    {city.name}
                                                                             </option>
                                                                      ))}
                                                               </select>
                                                        </div>

                                                        {dynamicFields.map((field) => {
                                                               const key = `df_${field.id}`;
                                                               const inputType = String(field.input_type || '').toLowerCase();
                                                               const options = parseDynamicOptions(field.options);

                                                               if (options.length === 0) {
                                                                      return null;
                                                               }

                                                               const fieldLabel = field.label || field.field_name || `Field ${field.id}`;
                                                               const selectedValue = dynamicFilterValues[key];

                                                               return (
                                                                      <div className="marketplace-filter-group" key={field.id}>
                                                                             <label>{fieldLabel}</label>

                                                                             {inputType === 'select' && (
                                                                                    <select
                                                                                           value={Array.isArray(selectedValue) ? '' : selectedValue || ''}
                                                                                           onChange={(e) =>
                                                                                                  setDynamicFilterValues((prev) => ({
                                                                                                         ...prev,
                                                                                                         [key]: e.target.value,
                                                                                                  }))
                                                                                           }
                                                                                    >
                                                                                           <option value="">All</option>
                                                                                           {options.map((option) => (
                                                                                                  <option key={`${field.id}-${option}`} value={option}>
                                                                                                         {option}
                                                                                                  </option>
                                                                                           ))}
                                                                                    </select>
                                                                             )}

                                                                             {inputType === 'radio' && (
                                                                                    <div className="marketplace-filter-options">
                                                                                           {options.map((option) => (
                                                                                                  <label key={`${field.id}-${option}`} className="marketplace-filter-option-row">
                                                                                                         <input
                                                                                                                type="radio"
                                                                                                                name={`dynamic-radio-${field.id}`}
                                                                                                                value={option}
                                                                                                                checked={String(selectedValue || '') === option}
                                                                                                                onChange={() =>
                                                                                                                       setDynamicFilterValues((prev) => ({
                                                                                                                              ...prev,
                                                                                                                              [key]: option,
                                                                                                                       }))
                                                                                                                }
                                                                                                         />
                                                                                                         <span>{option}</span>
                                                                                                  </label>
                                                                                           ))}
                                                                                    </div>
                                                                             )}

                                                                             {inputType === 'checkbox' && (
                                                                                    <div className="marketplace-filter-options">
                                                                                           {options.map((option) => {
                                                                                                  const values = Array.isArray(selectedValue)
                                                                                                         ? selectedValue
                                                                                                         : selectedValue
                                                                                                                ? [String(selectedValue)]
                                                                                                                : [];

                                                                                                  return (
                                                                                                         <label key={`${field.id}-${option}`} className="marketplace-filter-option-row">
                                                                                                                <input
                                                                                                                       type="checkbox"
                                                                                                                       checked={values.includes(option)}
                                                                                                                       onChange={(e) =>
                                                                                                                              handleCheckboxDynamicChange(field.id, option, e.target.checked)
                                                                                                                       }
                                                                                                                />
                                                                                                                <span>{option}</span>
                                                                                                         </label>
                                                                                                  );
                                                                                           })}
                                                                                    </div>
                                                                             )}

                                                                             {!['select', 'radio', 'checkbox'].includes(inputType) && (
                                                                                    <select
                                                                                           value={Array.isArray(selectedValue) ? '' : selectedValue || ''}
                                                                                           onChange={(e) =>
                                                                                                  setDynamicFilterValues((prev) => ({
                                                                                                         ...prev,
                                                                                                         [key]: e.target.value,
                                                                                                  }))
                                                                                           }
                                                                                    >
                                                                                           <option value="">All</option>
                                                                                           {options.map((option) => (
                                                                                                  <option key={`${field.id}-${option}`} value={option}>
                                                                                                         {option}
                                                                                                  </option>
                                                                                           ))}
                                                                                    </select>
                                                                             )}
                                                                      </div>
                                                               );
                                                        })}
                                                 </div>

                                                 <div className="marketplace-filter-footer">
                                                        <button type="button" className="filter-clear-btn" onClick={clearFilters}>
                                                               Clear
                                                        </button>
                                                        <button type="button" className="filter-apply-btn" onClick={applyFilters}>
                                                               Apply Filters
                                                        </button>
                                                 </div>
                                          </aside>
                                   </>
                            )}
                     </div>

                     <style>{`
                            .content-wrapper {
                                   position: relative;
                                   overflow: hidden;
                                   color: #212529 !important;
                                   background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
                                   border: 1px solid rgba(226, 232, 240, 0.95);
                                   box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
                                   border-radius: 28px;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                            .content-wrapper::before {
                                   content: "";
                                   position: absolute;
                                   inset: 0 auto auto 0;
                                   width: 100%;
                                   height: 5px;
                                   background: linear-gradient(90deg, #020617 0%, #0f172a 32%, #1d4ed8 68%, #0ea5e9 100%);
                            }
                            .content-wrapper-short {
                                   padding: 28px 36px;
                                   text-align: center;
                            }
                            .content-wrapper-long {
                                   padding: 38px 42px;
                            }
                            .content-wrapper > div {
                                   position: relative;
                                   z-index: 1;
                            }
                            .content-wrapper p {
                                   margin-bottom: 0;
                                   color: #475569 !important;
                                   line-height: 1.9;
                                   font-size: 1.05rem;
                            }
                            .content-wrapper p + p {
                                   margin-top: 16px;
                            }
                            .content-wrapper-short p {
                                   max-width: 1100px;
                                   margin-left: auto;
                                   margin-right: auto;
                                   font-size: 1.08rem;
                            }
                            .content-wrapper-short strong,
                            .content-wrapper-short b {
                                   display: block;
                                   margin-bottom: 10px;
                                   color: #0f172a !important;
                                   font-size: clamp(1.45rem, 2vw, 2rem);
                                   line-height: 1.25;
                                   font-weight: 800;
                                   letter-spacing: -0.02em;
                            }
                            .content-wrapper-long h1,
                            .content-wrapper-long h2,
                            .content-wrapper-long h3,
                            .content-wrapper-long h4 {
                                   color: #0f172a !important;
                                   font-weight: 800;
                                   line-height: 1.2;
                                   letter-spacing: -0.03em;
                                   margin-bottom: 16px;
                            }
                            .content-wrapper-long h1 {
                                   font-size: clamp(2rem, 3vw, 3rem);
                            }
                            .content-wrapper-long h2 {
                                   font-size: clamp(1.7rem, 2.4vw, 2.35rem);
                            }
                            .content-wrapper-long h3 {
                                   font-size: clamp(1.35rem, 1.8vw, 1.7rem);
                            }
                            .content-wrapper-long ul,
                            .content-wrapper-long ol {
                                   margin: 20px 0;
                                   padding-left: 0;
                                   list-style: none;
                                   display: grid;
                                   gap: 12px;
                            }
                            .content-wrapper-long li {
                                   position: relative;
                                   display: flex;
                                   align-items: center;
                                   padding-left: 34px;
                                   color: #475569 !important;
                                   line-height: 1.8;
                                   min-height: 24px;
                            }
                            .content-wrapper-long li:empty,
                            .content-wrapper-long p:empty {
                                   display: none !important;
                            }
                            .content-wrapper-long li:has(> br:only-child),
                            .content-wrapper-long p:has(> br:only-child) {
                                   display: none !important;
                            }
                            .content-wrapper-long li::before {
                                   content: "";
                                   position: absolute;
                                   left: 0;
                                   top: 50%;
                                   transform: translateY(-50%);
                                   width: 18px;
                                   height: 18px;
                                   border-radius: 50%;
                                   background: linear-gradient(135deg, #0f172a, #334155);
                                   box-shadow: 0 8px 18px rgba(15, 23, 42, 0.15);
                            }
                            .content-wrapper-long li::after {
                                   content: "";
                                   position: absolute;
                                   left: 7px;
                                   top: 50%;
                                   transform: translateY(-50%);
                                   width: 4px;
                                   height: 4px;
                                   border-radius: 50%;
                                   background: #fff;
                            }
                            .marketplace-topbar-wrap {
                                   width: 100%;
                                   background-color: #fff;
                                   background-position: center;
                                   background-repeat: no-repeat;
                                   background-size: cover;
                                   border-bottom: none;
                                   box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
                                   padding-top: 22px;
                                   padding-bottom: 22px;
                            }
                            .marketplace-topbar {
                                   width: 100%;
                                   border-radius: 28px;
                                   background: rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(5px);
                                   -webkit-backdrop-filter: blur(5px);
                                   min-height: 340px;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                                   align-items: center;
                                   text-align: center;
                            }
                            .marketplace-topbar > * {
                                   width: 100%;
                            }
                            .marketplace-selected-category {
                                   color: #fff;
                                   font-size: 36px;
                                   font-weight: 800;
                                   line-height: 1.1;
                                   text-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);
                            }
                            .marketplace-searchbar input {
                                   width: 100%;
                                   height: 62px;
                                   border: none;
                                   border-radius: 16px;
                                   background: rgba(255, 255, 255, 0.92);
                                   padding: 0 20px;
                                   font-size: 15px;
                                   color: #111827;
                                   box-shadow: none;
                            }
                            .marketplace-searchbar input:focus {
                                   outline: none;
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-searchbar-row {
                                   display: grid;
                                   grid-template-columns: 1fr 58px;
                                   gap: 10px;
                                   align-items: center;
                            }
                            .marketplace-filter-btn {
                                   width: 58px;
                                   height: 58px;
                                   border: none;
                                   border-radius: 16px;
                                   background: #0f172a;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-filter-btn:hover {
                                   background: #111827;
                            }
                            .marketplace-filter-btn svg {
                                   width: 22px;
                                   height: 22px;
                            }
                            .marketplace-filter-backdrop {
                                   position: fixed;
                                   inset: 0;
                                   z-index: 1040;
                                   background: rgba(15, 23, 42, 0.42);
                            }
                            .marketplace-filter-drawer {
                                   position: fixed;
                                   top: 0;
                                   right: 0;
                                   width: 360px;
                                   max-width: 94vw;
                                   height: 100vh;
                                   z-index: 1050;
                                   background: #fff;
                                   box-shadow: -12px 0 28px rgba(15, 23, 42, 0.2);
                                   display: flex;
                                   flex-direction: column;
                            }
                            .marketplace-filter-header {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   padding: 20px 18px 14px;
                                   border-bottom: 1px solid #e5e7eb;
                            }
                            .marketplace-filter-header h3 {
                                   margin: 0;
                                   font-size: 20px;
                                   font-weight: 800;
                                   color: #0f172a;
                            }
                            .marketplace-filter-header button {
                                   width: 36px;
                                   height: 36px;
                                   border: none;
                                   border-radius: 10px;
                                   background: #f3f4f6;
                                   font-size: 24px;
                                   line-height: 1;
                                   color: #0f172a;
                            }
                            .marketplace-filter-body {
                                   flex: 1;
                                   overflow-y: auto;
                                   padding: 16px 18px;
                            }
                            .marketplace-filter-group {
                                   margin-bottom: 14px;
                            }
                            .marketplace-filter-group > label {
                                   display: block;
                                   margin-bottom: 8px;
                                   font-size: 13px;
                                   font-weight: 700;
                                   color: #0f172a;
                            }
                            .marketplace-filter-group select {
                                   width: 100%;
                                   height: 46px;
                                   border-radius: 12px;
                                   border: 1px solid #d1d5db;
                                   background: #fff;
                                   color: #111827;
                                   padding: 0 12px;
                            }
                            .marketplace-filter-options {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                            }
                            .marketplace-filter-option-row {
                                   display: flex;
                                   align-items: center;
                                   gap: 8px;
                                   font-size: 14px;
                                   color: #111827;
                            }
                            .marketplace-filter-footer {
                                   display: flex;
                                   gap: 10px;
                                   border-top: 1px solid #e5e7eb;
                                   padding: 14px 18px 16px;
                            }
                            .filter-clear-btn,
                            .filter-apply-btn {
                                   flex: 1;
                                   min-height: 44px;
                                   border-radius: 12px;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .filter-clear-btn {
                                   border: 1px solid #cbd5e1;
                                   background: #fff;
                                   color: #334155;
                            }
                            .filter-apply-btn {
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-top-tabs {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                            }
                            .marketplace-top-tab {
                                   min-height: 58px;
                                   border-radius: 16px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #5f6c80;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                                   box-shadow: none;
                            }
                            .marketplace-top-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                                   color: #435168;
                            }
                            .marketplace-top-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-tabs {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px;
                                   justify-content: center;
                            }
                            .marketplace-subcategory-tab {
                                   min-height: 50px;
                                   padding: 0 20px;
                                   border-radius: 14px;
                                   border: none;
                                   background: rgba(255, 255, 255, 0.88);
                                   color: #435168;
                                   font-size: 14px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-tab:hover {
                                   background: rgba(255, 255, 255, 0.96);
                            }
                            .marketplace-subcategory-tab.is-active {
                                   background: #111827;
                                   color: #fff;
                            }
                            .marketplace-subcategory-back {
                                   width: 50px;
                                   min-width: 50px;
                                   height: 50px;
                                   border-radius: 14px;
                                   border: none;
                                   background: #111827;
                                   color: #fff;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   font-size: 20px;
                                   font-weight: 700;
                                   transition: all 0.2s ease;
                            }
                            .marketplace-subcategory-back:hover {
                                   background: #0b1220;
                            }
                            .marketplace-curated-section {
                                   margin-bottom: 38px;
                                   overflow: hidden;
                            }
                            .marketplace-latest-grid-section {
                                   margin-top: 6px;
                                   margin-bottom: 42px;
                            }
                            .marketplace-curated-header {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   margin-bottom: 14px;
                            }
                            .marketplace-curated-header h3 {
                                   margin: 0;
                                   font-size: 28px;
                                   font-weight: 800;
                                   color: #0f172a;
                            }
                            .marketplace-curated-slider {
                                   position: relative;
                            }
                            .marketplace-curated-slider .swiper {
                                   overflow: hidden;
                                   padding: 4px 2px 78px;
                            }
                            .marketplace-curated-slider .swiper-slide {
                                   height: auto;
                            }
                            .marketplace-curated-slider .swiper-button-prev,
                            .marketplace-curated-slider .swiper-button-next {
                                   top: auto !important;
                                   bottom: 14px !important;
                                   left: auto !important;
                                   right: auto !important;
                                   transform: none !important;
                                   width: 44px;
                                   height: 40px;
                                   border-radius: 0;
                                   background: #ffffff;
                                   color: #111827;
                                   box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
                                   border: 1px solid #e5e7eb;
                                   z-index: 5;
                            }
                            .marketplace-curated-slider .swiper-button-prev {
                                   left: calc(50% - 43px) !important;
                                   border-top-left-radius: 12px;
                                   border-bottom-left-radius: 12px;
                                   margin-right: 0 !important;
                            }
                            .marketplace-curated-slider .swiper-button-next {
                                   left: calc(50% + 3px) !important;
                                   border-top-right-radius: 12px;
                                   border-bottom-right-radius: 12px;
                                   border-left: none;
                            }
                            .marketplace-curated-slider .swiper-button-prev::after,
                            .marketplace-curated-slider .swiper-button-next::after {
                                   font-size: 16px;
                                   font-weight: 700;
                            }
                            .marketplace-curated-slider .swiper-button-disabled {
                                   opacity: 1 !important;
                                   color: #cbd5e1 !important;
                                   background: #ffffff !important;
                            }
                            .marketplace-load-more-btn {
                                   min-width: 168px;
                                   min-height: 48px;
                                   border: none;
                                   border-radius: 12px;
                                   background: #111827;
                                   color: #ffffff;
                                   font-size: 14px;
                                   font-weight: 800;
                                   padding: 0 28px;
                                   box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
                                   transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                            }
                            .marketplace-load-more-btn:hover:not(:disabled) {
                                   transform: translateY(-2px);
                                   background: #020617;
                                   box-shadow: 0 16px 34px rgba(15, 23, 42, 0.2);
                            }
                            .marketplace-load-more-btn:disabled {
                                   cursor: wait;
                                   opacity: 0.7;
                            }
                            @media (max-width: 767px) {
                                   .mkt-right {
                                          padding-inline: 4px;
                                   }
                                   .content-wrapper-short {
                                          padding: 22px 18px;
                                          border-radius: 22px;
                                   }
                                   .content-wrapper-long {
                                          padding: 26px 18px;
                                          border-radius: 22px;
                                   }
                                   .content-wrapper p,
                                   .content-wrapper-short p {
                                          font-size: 0.98rem;
                                          line-height: 1.8;
                                   }
                                   .content-wrapper-short strong,
                                   .content-wrapper-short b {
                                          margin-bottom: 8px;
                                          font-size: 1.25rem;
                                   }
                                   .marketplace-topbar {
                                          padding-inline: 0;
                                          min-height: 380px;
                                   }
                                   .marketplace-selected-category {
                                          font-size: 28px;
                                   }
                                   .marketplace-top-tabs {
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                          gap: 8px;
                                   }
                                   .marketplace-top-tab {
                                          min-height: 46px;
                                          padding: 0 10px;
                                          font-size: 12px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-searchbar-row {
                                          grid-template-columns: 1fr 52px;
                                          gap: 8px;
                                   }
                                   .marketplace-filter-btn {
                                          width: 52px;
                                          height: 52px;
                                          border-radius: 12px;
                                   }
                                   .marketplace-filter-drawer {
                                          width: 100%;
                                          max-width: 100%;
                                   }
                                   .marketplace-subcategory-tabs {
                                          display: flex;
                                          flex-wrap: nowrap;
                                          justify-content: center;
                                          align-items: center;
                                          gap: 10px;
                                          overflow-x: auto;
                                          padding-bottom: 4px;
                                          scrollbar-width: none;
                                   }
                                   .marketplace-subcategory-tabs::-webkit-scrollbar {
                                          display: none;
                                   }
                                   .marketplace-subcategory-tab {
                                          min-height: 44px;
                                          white-space: nowrap;
                                          flex: 0 0 auto;
                                          font-size: 13px;
                                   }
                                   .marketplace-subcategory-back {
                                          width: 44px;
                                          min-width: 44px;
                                          height: 44px;
                                          flex: 0 0 auto;
                                   }
                                   .marketplace-curated-header h3 {
                                          font-size: 22px;
                                   }
                                   .marketplace-curated-slider {
                                          padding-bottom: 2px;
                                   }
                                   .marketplace-curated-slider .swiper {
                                          padding-bottom: 8px;
                                   }
                                   .marketplace-curated-slider .swiper-button-prev,
                                   .marketplace-curated-slider .swiper-button-next {
                                          display: none !important;
                                   }
                            }
                     `}</style>
              </AppLayout>
       );
}
