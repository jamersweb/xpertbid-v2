import React, { useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import HeroSection from '@/Components/HeroSection';
import AuctionCard from '@/Components/AuctionCard';
import MarketplaceSidebar from '@/Components/Marketplace/MarketplaceSidebar';
import { getCategoryBrowseUrl } from '@/Utils/categoryBrowseUrl';
import JsonLdScripts from '@/Components/JsonLdScripts';

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

const EmptyProductsState = ({ hasActiveFilters, onReset }) => (
       <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-3 px-3">
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
              <p className="text-muted mb-3">We couldn't find any products matching your current selection.</p>
              <button
                     type="button"
                     onClick={onReset}
                     className="mp-empty-reset-btn"
              >
                     {hasActiveFilters ? 'Clear Active Filters' : 'Browse All Categories'}
              </button>
       </div>
);

const LatestProductsGrid = ({
       items = [],
       hasMore = false,
       loading = false,
       onLoadMore,
       hasActiveFilters = false,
       onResetEmpty,
}) => (
       <section className="marketplace-latest-grid-section">
              {items.length === 0 ? (
                     <EmptyProductsState hasActiveFilters={hasActiveFilters} onReset={onResetEmpty} />
              ) : (
                     <>
                            <div className="row g-3 g-md-4">
                                   {items.map((product) => (
                                          <div className="col-12 col-sm-6 col-xl-4" key={product.id}>
                                                 <AuctionCard
                                                        auction={product}
                                                        showPropertyMeta
                                                        titleMaxLength={18}
                                                        singleLineTitle
                                                        inlineDiscountPrice
                                                 />
                                          </div>
                                   ))}
                            </div>

                            {hasMore && (
                                   <div className="d-flex justify-content-center mt-4">
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
       filters = {},
       currentType: serverCurrentType = 'auction',
       pageSeo = null,
}) {
       const {
              propertyFrontendUrl,
              propertyRootCategoryId,
              renovationFrontendUrl,
              renovationRootCategoryId,
              builderRootCategoryId,
       } = usePage().props;

       const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
       const [selectedCountryId, setSelectedCountryId] = useState(filters?.country_id ? String(filters.country_id) : '');
       const [selectedStateId, setSelectedStateId] = useState(filters?.state_id ? String(filters.state_id) : '');
       const [selectedCityId, setSelectedCityId] = useState(filters?.city_id ? String(filters.city_id) : '');
       const [priceMin, setPriceMin] = useState(filters?.priceMin ? String(filters.priceMin) : '');
       const [priceMax, setPriceMax] = useState(filters?.priceMax ? String(filters.priceMax) : '');
       const [states, setStates] = useState([]);
       const [cities, setCities] = useState([]);
       const [dynamicFilterValues, setDynamicFilterValues] = useState(() => getInitialDynamicFilters(filters));
       const [latestGridProducts, setLatestGridProducts] = useState(products?.data || []);
       const [nextProductsPageUrl, setNextProductsPageUrl] = useState(products?.next_page_url || null);
       const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);

       const currentType = serverCurrentType || filters?.type || 'auction';
       const sectionMode = String(filters?.section || '').toLowerCase();
       const isSectionOnlyView = ['featured', 'latest_auctions', 'latest_vehicles', 'latest_properties', 'latest_listings'].includes(sectionMode);
       const seoShortContent = sanitizeSeoHtml(currentCategory?.seo_short_content);
       const seoContent = sanitizeSeoHtml(currentCategory?.seo_content);
       const schemaMarkupSource =
              currentCategory?.schema_markup
              || currentTopCategory?.schema_markup
              || pageSeo?.schema_markup;

       useEffect(() => {
              if (typeof window === 'undefined') return undefined;

              const handleResize = () => {
                     if (window.innerWidth >= 992) {
                            setIsMobileSidebarOpen(false);
                     }
              };

              window.addEventListener('resize', handleResize);
              return () => window.removeEventListener('resize', handleResize);
       }, []);

       useEffect(() => {
              if (typeof document === 'undefined') {
                     return undefined;
              }

              const previousOverflow = document.body.style.overflow;
              if (isMobileSidebarOpen && window.innerWidth < 992) {
                     document.body.style.overflow = 'hidden';
              }

              return () => {
                     document.body.style.overflow = previousOverflow;
              };
       }, [isMobileSidebarOpen]);

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

       const resolveListingTypeParam = (type = currentType) => {
              if (['normal', 'normal_list'].includes(type)) return 'normal';
              if (['business', 'business_list'].includes(type)) return 'business';
              return 'auction';
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

       const cleanFilters = (nextFilters = filters, { stripDynamic = false } = {}) => {
              const cleaned = { ...nextFilters };
              delete cleaned.type;
              delete cleaned.category;
              delete cleaned.page;
              delete cleaned.section;

              if (stripDynamic) {
                     Object.keys(cleaned).forEach((key) => {
                            if (key.startsWith('df_')) {
                                   delete cleaned[key];
                            }
                     });
              }

              return cleaned;
       };

       // When no category slug, type lives in the query string (path has no typeSlug).
       const marketplaceQuery = (type = currentType, extra = {}, baseFilters = filters, options = {}) => {
              const cleaned = cleanFilters(baseFilters, options);
              if (!currentCategory?.slug && !options.hasTargetSlug) {
                     cleaned.type = resolveListingTypeParam(type);
              }
              return { ...cleaned, ...extra };
       };

       const handleTabChange = (type) => {
              const query = marketplaceQuery(type);
              delete query.featured;

              router.get(marketplaceUrl(type), query, {
                     preserveState: true,
                     preserveScroll: true,
              });
       };

       const handleSelectCategory = (matchedCategory) => {
              const slug = matchedCategory?.slug;
              const browse = getCategoryBrowseUrl(matchedCategory, {
                     propertyFrontendUrl,
                     propertyRootCategoryId,
                     renovationFrontendUrl,
                     renovationRootCategoryId,
                     builderRootCategoryId,
              });

              if (browse.external) {
                     window.location.assign(browse.href);
                     return;
              }

              const nextQuery = cleanFilters(filters, { stripDynamic: true });
              router.get(
                     marketplaceUrl(currentType, slug),
                     nextQuery,
                     {
                            preserveState: true,
                            preserveScroll: false,
                     }
              );
       };

       const handleSelectAllCategories = () => {
              const nextQuery = marketplaceQuery(
                     currentType,
                     {},
                     filters,
                     { stripDynamic: true, hasTargetSlug: false }
              );
              nextQuery.type = resolveListingTypeParam(currentType);

              router.get(
                     route('marketplace.index'),
                     nextQuery,
                     {
                            preserveState: true,
                            preserveScroll: false,
                     }
              );
       };

       useEffect(() => {
              setSelectedCountryId(filters?.country_id ? String(filters.country_id) : '');
              setSelectedStateId(filters?.state_id ? String(filters.state_id) : '');
              setSelectedCityId(filters?.city_id ? String(filters.city_id) : '');
              setPriceMin(filters?.priceMin ? String(filters.priceMin) : '');
              setPriceMax(filters?.priceMax ? String(filters.priceMax) : '');
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
                     page: 1,
              };

              if (selectedCountryId) nextFilters.country_id = selectedCountryId;
              else delete nextFilters.country_id;

              if (selectedStateId) nextFilters.state_id = selectedStateId;
              else delete nextFilters.state_id;

              if (selectedCityId) nextFilters.city_id = selectedCityId;
              else delete nextFilters.city_id;

              if (String(priceMin).trim() !== '') nextFilters.priceMin = String(priceMin).trim();
              else delete nextFilters.priceMin;

              if (String(priceMax).trim() !== '') nextFilters.priceMax = String(priceMax).trim();
              else delete nextFilters.priceMax;

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

              router.get(marketplaceUrl(), marketplaceQuery(currentType, {}, nextFilters), {
                     preserveState: true,
                     preserveScroll: true,
              });

              setIsMobileSidebarOpen(false);
       };

       const clearFilters = (includeSearch = false) => {
              setSelectedCountryId('');
              setSelectedStateId('');
              setSelectedCityId('');
              setPriceMin('');
              setPriceMax('');
              setStates([]);
              setCities([]);
              setDynamicFilterValues({});

              const nextFilters = {
                     ...filters,
                     page: 1,
              };

              delete nextFilters.country_id;
              delete nextFilters.state_id;
              delete nextFilters.city_id;
              delete nextFilters.priceMin;
              delete nextFilters.priceMax;
              if (includeSearch) {
                     delete nextFilters.search;
              }
              Object.keys(nextFilters).forEach((key) => {
                     if (key.startsWith('df_')) {
                            delete nextFilters[key];
                     }
              });

              router.get(marketplaceUrl(), marketplaceQuery(currentType, {}, nextFilters), {
                     preserveState: true,
                     preserveScroll: true,
              });

              setIsMobileSidebarOpen(false);
       };

       const removeSingleFilter = (keysToRemove = []) => {
              const nextFilters = { ...filters, page: 1 };
              keysToRemove.forEach((k) => {
                     delete nextFilters[k];
              });

              router.get(marketplaceUrl(), marketplaceQuery(currentType, {}, nextFilters), {
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

       const activeFilterChips = useMemo(() => {
              const chips = [];

              if (filters?.search) {
                     chips.push({
                            key: 'search',
                            label: `Search: "${filters.search}"`,
                            onRemove: () => removeSingleFilter(['search']),
                     });
              }

              if (filters?.priceMin || filters?.priceMax) {
                     const minLabel = filters?.priceMin ? filters.priceMin : '0';
                     const maxLabel = filters?.priceMax ? filters.priceMax : 'Any';
                     chips.push({
                            key: 'price',
                            label: `Price: ${minLabel} - ${maxLabel}`,
                            onRemove: () => removeSingleFilter(['priceMin', 'priceMax']),
                     });
              }

              if (filters?.country_id) {
                     const countryName = countries.find((c) => String(c.id) === String(filters.country_id))?.name;
                     chips.push({
                            key: 'country',
                            label: `Country: ${countryName || filters.country_id}`,
                            onRemove: () => removeSingleFilter(['country_id', 'state_id', 'city_id']),
                     });
              }

              if (filters?.state_id) {
                     const stateName = states.find((s) => String(s.id) === String(filters.state_id))?.name;
                     chips.push({
                            key: 'state',
                            label: `State: ${stateName || filters.state_id}`,
                            onRemove: () => removeSingleFilter(['state_id', 'city_id']),
                     });
              }

              if (filters?.city_id) {
                     const cityName = cities.find((c) => String(c.id) === String(filters.city_id))?.name;
                     chips.push({
                            key: 'city',
                            label: `City: ${cityName || filters.city_id}`,
                            onRemove: () => removeSingleFilter(['city_id']),
                     });
              }

              Object.entries(filters || {}).forEach(([key, value]) => {
                     if (!key.startsWith('df_') || value === null || value === undefined || String(value).trim() === '') {
                            return;
                     }
                     const fieldId = Number(key.replace('df_', ''));
                     const matchedField = dynamicFields.find((f) => Number(f.id) === fieldId);
                     const label = matchedField?.label || matchedField?.field_name || 'Filter';
                     chips.push({
                            key,
                            label: `${label}: ${value}`,
                            onRemove: () => removeSingleFilter([key]),
                     });
              });

              return chips;
       }, [filters, countries, states, cities, dynamicFields]);

       const sidebarFilterCount = useMemo(() => (
              activeFilterChips.filter((chip) => chip.key !== 'search').length
       ), [activeFilterChips]);

       const totalProductsCount = products?.total ?? latestGridProducts.length;

       const breadcrumbItems = useMemo(() => {
              const list = [{ label: 'Marketplace', onClick: handleSelectAllCategories, active: !currentCategory && !currentTopCategory }];
              if (currentTopCategory) {
                     list.push({
                            label: currentTopCategory.name,
                            onClick: () => handleSelectCategory(currentTopCategory),
                            active: currentCategory?.slug === currentTopCategory.slug,
                     });
              }
              if (currentSubcategory && currentSubcategory.slug !== currentTopCategory?.slug) {
                     list.push({
                            label: currentSubcategory.name,
                            onClick: () => handleSelectCategory(currentSubcategory),
                            active: currentCategory?.slug === currentSubcategory.slug,
                     });
              }
              if (
                     currentCategory
                     && currentCategory.slug !== currentTopCategory?.slug
                     && currentCategory.slug !== currentSubcategory?.slug
              ) {
                     list.push({
                            label: currentCategory.name,
                            onClick: () => handleSelectCategory(currentCategory),
                            active: true,
                     });
              }
              return list;
       }, [currentCategory, currentTopCategory, currentSubcategory]);

       return (
              <AppLayout title={currentCategory?.meta_title || pageSeo?.meta_title || 'Marketplace'}>
                     <Head>
                            <title>{currentCategory?.meta_title || pageSeo?.meta_title || 'Marketplace | XpertBid'}</title>
                            <meta
                                   name="description"
                                   content={currentCategory?.meta_description || pageSeo?.meta_description || 'Explore our marketplace for the best deals.'}
                            />
                     </Head>
                     <JsonLdScripts markup={schemaMarkupSource} idPrefix="marketplace-schema" />

                     <div className="marketplace-page-shell pb-5 min-vh-100">
                            {/* Home Page Slide-Based Hero Banners */}
                            <HeroSection fluid className="my-4" />

                            {/* Daraz-style Sidebar + Main Product Workspace */}
                            <div className="container-fluid px-3 px-lg-5">
                                   <div className="marketplace-workspace">
                                          <MarketplaceSidebar
                                                 isOpen={isMobileSidebarOpen}
                                                 onClose={() => setIsMobileSidebarOpen(false)}
                                                 categories={categories}
                                                 currentCategory={currentCategory}
                                                 currentTopCategory={currentTopCategory}
                                                 currentSubcategory={currentSubcategory}
                                                 subcategoryTabs={subcategoryTabs}
                                                 childCategoryTabs={childCategoryTabs}
                                                 onSelectAllCategories={handleSelectAllCategories}
                                                 onSelectCategory={handleSelectCategory}
                                                 countries={countries}
                                                 states={states}
                                                 cities={cities}
                                                 selectedCountryId={selectedCountryId}
                                                 onChangeCountry={(val) => {
                                                        setSelectedCountryId(val);
                                                        setSelectedStateId('');
                                                        setSelectedCityId('');
                                                 }}
                                                 selectedStateId={selectedStateId}
                                                 onChangeState={(val) => {
                                                        setSelectedStateId(val);
                                                        setSelectedCityId('');
                                                 }}
                                                 selectedCityId={selectedCityId}
                                                 onChangeCity={setSelectedCityId}
                                                 priceMin={priceMin}
                                                 onChangePriceMin={setPriceMin}
                                                 priceMax={priceMax}
                                                 onChangePriceMax={setPriceMax}
                                                 dynamicFields={dynamicFields}
                                                 dynamicFilterValues={dynamicFilterValues}
                                                 onChangeDynamicValue={(key, val) =>
                                                        setDynamicFilterValues((prev) => ({
                                                               ...prev,
                                                               [key]: val,
                                                        }))
                                                 }
                                                 onChangeCheckboxDynamic={handleCheckboxDynamicChange}
                                                 onApplyFilters={applyFilters}
                                                 onClearFilters={() => clearFilters(false)}
                                                 activeFilterCount={sidebarFilterCount}
                                          />

                                          <div className="mkt-right marketplace-main-content">
                                                 {/* Marketplace Control Header: Breadcrumb, Heading, Type Switcher & Mobile Sidebar Trigger */}
                                                 <div className="mp-workspace-toolbar">
                                                        <div className="mp-toolbar-top-row">
                                                               <div className="mp-title-block">
                                                                      <nav className="mp-breadcrumbs" aria-label="Breadcrumb">
                                                                             {breadcrumbItems.map((crumb, idx) => (
                                                                                    <React.Fragment key={`${crumb.label}-${idx}`}>
                                                                                           {idx > 0 && <span className="mp-breadcrumb-sep">/</span>}
                                                                                           {crumb.active ? (
                                                                                                  <span className="mp-breadcrumb-current">{crumb.label}</span>
                                                                                           ) : (
                                                                                                  <button
                                                                                                         type="button"
                                                                                                         className="mp-breadcrumb-link"
                                                                                                         onClick={crumb.onClick}
                                                                                                  >
                                                                                                         {crumb.label}
                                                                                                  </button>
                                                                                           )}
                                                                                    </React.Fragment>
                                                                             ))}
                                                                      </nav>

                                                                      <div className="mp-heading-wrap">
                                                                             <h1>{currentCategory?.name || currentTopCategory?.name || 'All Marketplace'}</h1>
                                                                             <span className="mp-result-badge">
                                                                                    {totalProductsCount} {totalProductsCount === 1 ? 'listing' : 'listings'}
                                                                             </span>
                                                                      </div>
                                                               </div>

                                                               <div className="mp-toolbar-actions">
                                                                      <button
                                                                             type="button"
                                                                             className="mp-mobile-drawer-trigger d-lg-none"
                                                                             onClick={() => setIsMobileSidebarOpen(true)}
                                                                      >
                                                                             <i className="fa-solid fa-sliders" aria-hidden="true" />
                                                                             <span>Categories &amp; Filters</span>
                                                                             {sidebarFilterCount > 0 && (
                                                                                    <span className="mp-filter-count-pill">{sidebarFilterCount}</span>
                                                                             )}
                                                                      </button>

                                                                      <div className="marketplace-top-tabs" role="tablist" aria-label="Listing types">
                                                                             {tabs.map((tab) => {
                                                                                    const isActive =
                                                                                           (tab.key === 'auction' && currentType === 'auction') ||
                                                                                           (tab.key === 'normal' && ['normal', 'normal_list'].includes(currentType)) ||
                                                                                           (tab.key === 'business' && ['business', 'business_list'].includes(currentType));

                                                                                    return (
                                                                                           <button
                                                                                                  key={tab.key}
                                                                                                  type="button"
                                                                                                  role="tab"
                                                                                                  aria-selected={isActive}
                                                                                                  onClick={() => handleTabChange(tab.key)}
                                                                                                  className={`marketplace-top-tab ${isActive ? 'is-active' : ''}`}
                                                                                           >
                                                                                                  <span className="d-none d-sm-inline">{tab.label}</span>
                                                                                                  <span className="d-inline d-sm-none">{tab.mobileLabel || tab.label}</span>
                                                                                           </button>
                                                                                    );
                                                                             })}
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        {activeFilterChips.length > 0 && (
                                                               <div className="mp-active-chips-row">
                                                                      {activeFilterChips.map((chip) => (
                                                                             <button
                                                                                    key={chip.key}
                                                                                    type="button"
                                                                                    className="mp-active-chip"
                                                                                    onClick={chip.onRemove}
                                                                                    title="Remove filter"
                                                                             >
                                                                                    <span>{chip.label}</span>
                                                                                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                                                                             </button>
                                                                      ))}
                                                                      <button
                                                                             type="button"
                                                                             className="mp-clear-all-chips-btn"
                                                                             onClick={() => clearFilters(true)}
                                                                      >
                                                                             Clear All
                                                                      </button>
                                                               </div>
                                                        )}
                                                 </div>

                                                 {!isSectionOnlyView && seoShortContent && (
                                                        <div className="content-wrapper content-wrapper-short mb-4 text-dark">
                                                               <div dangerouslySetInnerHTML={{ __html: seoShortContent }} />
                                                        </div>
                                                 )}

                                                 <LatestProductsGrid
                                                        items={latestGridProducts}
                                                        hasMore={Boolean(nextProductsPageUrl)}
                                                        loading={isLoadingMoreProducts}
                                                        onLoadMore={loadMoreProducts}
                                                        hasActiveFilters={activeFilterChips.length > 0}
                                                        onResetEmpty={() => (
                                                               activeFilterChips.length > 0
                                                                      ? clearFilters(true)
                                                                      : handleSelectAllCategories()
                                                        )}
                                                 />

                                                 {!isSectionOnlyView && seoContent && (
                                                        <div className="content-wrapper content-wrapper-long mt-5 text-dark">
                                                               <div dangerouslySetInnerHTML={{ __html: seoContent }} />
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style>{`
                            .marketplace-page-shell {
                                   background-color: #F7F8F9;
                                   padding-top: 1px;
                            }

                            /* Two-column Sidebar + Main Workspace */
                            .marketplace-workspace {
                                   display: grid;
                                   grid-template-columns: 296px minmax(0, 1fr);
                                   gap: 24px;
                                   align-items: start;
                            }
                            .marketplace-main-content {
                                   min-width: 0;
                            }

                            /* Daraz-style Sidebar (Desktop inline + Mobile drawer) */
                            .mp-sidebar {
                                   position: sticky;
                                   top: 8px;
                                   background: #ffffff;
                                   border: 1px solid #ECEFF2;
                                   border-radius: 20px;
                                   box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
                                   display: flex;
                                   flex-direction: column;
                                   height: calc(100vh - 16px);
                                   height: calc(100dvh - 16px);
                                   max-height: calc(100vh - 16px);
                                   max-height: calc(100dvh - 16px);
                                   overflow: hidden;
                            }
                            .mp-sidebar-scroll-body {
                                   flex: 1;
                                   overflow-y: auto;
                                   padding: 18px 16px;
                                   scrollbar-width: thin;
                                   scrollbar-color: #CBD5E1 transparent;
                            }
                            .mp-sidebar-scroll-body::-webkit-scrollbar,
                            .mp-cat-scroll-list::-webkit-scrollbar {
                                   width: 5px;
                            }
                            .mp-sidebar-scroll-body::-webkit-scrollbar-thumb,
                            .mp-cat-scroll-list::-webkit-scrollbar-thumb {
                                   background: #CBD5E1;
                                   border-radius: 999px;
                            }
                            .mp-sidebar-section + .mp-sidebar-section {
                                   margin-top: 18px;
                                   padding-top: 18px;
                                   border-top: 1px solid #EEF2F6;
                            }
                            .mp-sidebar-section-head {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   margin-bottom: 12px;
                            }
                            .mp-sidebar-section-head h4 {
                                   margin: 0;
                                   font-size: 15px;
                                   font-weight: 800;
                                   color: #23262F;
                                   letter-spacing: -0.01em;
                            }
                            .mp-sidebar-reset-link {
                                   border: none;
                                   background: transparent;
                                   padding: 0;
                                   font-size: 12.5px;
                                   font-weight: 600;
                                   color: #43ACE9;
                                   cursor: pointer;
                            }
                            .mp-sidebar-reset-link:hover {
                                   text-decoration: underline;
                            }

                            /* Scrollable Daraz-style Categories List */
                            .mp-cat-scroll-list {
                                   max-height: 36vh;
                                   min-height: 180px;
                                   overflow-y: auto;
                                   padding-right: 4px;
                                   display: flex;
                                   flex-direction: column;
                                   gap: 2px;
                                   scrollbar-width: thin;
                                   scrollbar-color: #CBD5E1 transparent;
                            }
                            .mp-cat-group {
                                   display: flex;
                                   flex-direction: column;
                            }
                            .mp-cat-item,
                            .mp-cat-row {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 6px;
                                   width: 100%;
                                   border-radius: 10px;
                                   transition: background-color 0.16s ease, color 0.16s ease;
                            }
                            .mp-cat-root-btn {
                                   border: none;
                                   background: transparent;
                                   padding: 8px 10px;
                                   font-size: 13.5px;
                                   font-weight: 600;
                                   color: #475569;
                                   text-align: left;
                            }
                            .mp-cat-name-btn {
                                   flex: 1;
                                   min-width: 0;
                                   border: none;
                                   background: transparent;
                                   padding: 7px 10px;
                                   text-align: left;
                                   font-size: 13.5px;
                                   font-weight: 500;
                                   color: #475569;
                                   display: flex;
                                   align-items: center;
                                   border-radius: 10px;
                            }
                            .mp-cat-label {
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                                   white-space: nowrap;
                            }
                            .mp-cat-back-btn {
                                   display: flex;
                                   align-items: center;
                                   gap: 8px;
                                   width: 100%;
                                   border: none;
                                   background: #F8FAFC;
                                   color: #23262F;
                                   font-size: 13px;
                                   font-weight: 700;
                                   padding: 8px 10px;
                                   border-radius: 10px;
                                   margin-bottom: 6px;
                                   text-align: left;
                                   transition: background-color 0.16s ease, color 0.16s ease;
                            }
                            .mp-cat-back-btn:hover {
                                   background: rgba(67, 172, 233, 0.10);
                                   color: #0D8FD9;
                            }
                            .mp-cat-chevron {
                                   flex-shrink: 0;
                                   font-size: 11px;
                                   color: #94A3B8;
                            }
                            .mp-cat-row.is-active .mp-cat-chevron {
                                   color: #0D8FD9;
                            }
                            .mp-cat-empty-hint {
                                   padding: 8px 10px;
                                   font-size: 12.5px;
                                   color: #94A3B8;
                            }
                            .mp-cat-row:hover,
                            .mp-cat-root-btn:hover {
                                   background: #F8FAFC;
                                   color: #43ACE9;
                            }
                            .mp-cat-row.is-active,
                            .mp-cat-root-btn.is-active {
                                   background: rgba(67, 172, 233, 0.12);
                                   box-shadow: inset 3px 0 0 #43ACE9;
                                   color: #0D8FD9;
                                   font-weight: 700;
                            }

                            /* Sidebar Filters */
                            .mp-filter-count-pill {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   min-width: 20px;
                                   height: 20px;
                                   padding: 0 6px;
                                   border-radius: 999px;
                                   background: #43ACE9;
                                   color: #fff;
                                   font-size: 11px;
                                   font-weight: 700;
                            }
                            .mp-filter-group {
                                   margin-bottom: 14px;
                            }
                            .mp-filter-group:last-child {
                                   margin-bottom: 0;
                            }
                            .mp-filter-group > label {
                                   display: block;
                                   margin-bottom: 6px;
                                   font-size: 12.5px;
                                   font-weight: 700;
                                   color: #23262F;
                            }
                            .mp-filter-group select,
                            .mp-price-range-row input {
                                   width: 100%;
                                   height: 40px;
                                   border-radius: 10px;
                                   border: 1px solid #D9E1EC;
                                   background: #F8FAFC;
                                   color: #23262F;
                                   font-size: 13px;
                                   padding: 0 10px;
                                   transition: border-color 0.18s ease, background-color 0.18s ease;
                            }
                            .mp-filter-group select:focus,
                            .mp-price-range-row input:focus {
                                   outline: none;
                                   border-color: #43ACE9;
                                   background: #fff;
                            }
                            .mp-filter-group select:disabled {
                                   opacity: 0.55;
                                   cursor: not-allowed;
                            }
                            .mp-price-range-row {
                                   display: grid;
                                   grid-template-columns: 1fr auto 1fr;
                                   gap: 8px;
                                   align-items: center;
                            }
                            .mp-price-sep {
                                   color: #94A3B8;
                                   font-weight: 600;
                            }
                            .mp-filter-options {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 7px;
                            }
                            .mp-filter-option-row {
                                   display: flex;
                                   align-items: center;
                                   gap: 8px;
                                   font-size: 13px;
                                   color: #475569;
                                   cursor: pointer;
                            }
                            .mp-filter-option-row input {
                                   accent-color: #43ACE9;
                            }
                            .mp-sidebar-footer {
                                   display: flex;
                                   gap: 10px;
                                   padding: 12px 16px 14px;
                                   border-top: 1px solid #EEF2F6;
                                   background: #fff;
                            }
                            .mp-filter-clear-btn,
                            .mp-filter-apply-btn {
                                   flex: 1;
                                   min-height: 40px;
                                   border-radius: 10px;
                                   font-size: 13px;
                                   font-weight: 700;
                                   transition: all 0.18s ease;
                            }
                            .mp-filter-clear-btn {
                                   border: 1px solid #CBD5E1;
                                   background: #fff;
                                   color: #475569;
                            }
                            .mp-filter-clear-btn:hover {
                                   border-color: #94A3B8;
                                   color: #23262F;
                            }
                            .mp-filter-apply-btn {
                                   border: none;
                                   background: #23262F;
                                   color: #fff;
                            }
                            .mp-filter-apply-btn:hover {
                                   background: #43ACE9;
                            }

                            /* Right Workspace Header Toolbar */
                            .mp-workspace-toolbar {
                                   background: #ffffff;
                                   border: 1px solid #ECEFF2;
                                   border-radius: 20px;
                                   padding: 18px 20px;
                                   margin-bottom: 24px;
                                   box-shadow: 0 6px 22px rgba(15, 23, 42, 0.04);
                            }
                            .mp-toolbar-top-row {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 16px;
                            }
                            .mp-breadcrumbs {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: center;
                                   gap: 6px;
                                   margin-bottom: 6px;
                                   font-size: 12.5px;
                            }
                            .mp-breadcrumb-link {
                                   border: none;
                                   background: transparent;
                                   padding: 0;
                                   color: #606060;
                                   font-weight: 500;
                            }
                            .mp-breadcrumb-link:hover {
                                   color: #43ACE9;
                            }
                            .mp-breadcrumb-sep {
                                   color: #CBD5E1;
                            }
                            .mp-breadcrumb-current {
                                   color: #43ACE9;
                                   font-weight: 600;
                            }
                            .mp-heading-wrap {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: baseline;
                                   gap: 10px;
                            }
                            .mp-heading-wrap h1 {
                                   margin: 0;
                                   font-size: 24px;
                                   font-weight: 800;
                                   color: #23262F;
                                   letter-spacing: -0.02em;
                                   line-height: 1.2;
                            }
                            .mp-result-badge {
                                   font-size: 13px;
                                   font-weight: 600;
                                   color: #64748B;
                            }
                            .mp-toolbar-actions {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: center;
                                   gap: 10px;
                            }
                            .marketplace-top-tabs {
                                   display: inline-grid;
                                   grid-template-columns: repeat(3, minmax(0, auto));
                                   gap: 4px;
                                   padding: 4px;
                                   border-radius: 14px;
                                   background: #F1F5F9;
                                   border: 1px solid #E2E8F0;
                            }
                            .marketplace-top-tab {
                                   min-height: 40px;
                                   padding: 0 16px;
                                   border-radius: 10px;
                                   border: none;
                                   background: transparent;
                                   color: #606060;
                                   font-size: 13.5px;
                                   font-weight: 600;
                                   transition: all 0.18s ease;
                                   white-space: nowrap;
                            }
                            .marketplace-top-tab:hover {
                                   color: #43ACE9;
                            }
                            .marketplace-top-tab.is-active {
                                   background: #23262F;
                                   color: #ffffff;
                                   box-shadow: 0 4px 12px rgba(35, 38, 47, 0.18);
                            }
                            .mp-mobile-drawer-trigger {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 8px;
                                   min-height: 42px;
                                   padding: 0 14px;
                                   border-radius: 12px;
                                   border: 1px solid #43ACE9;
                                   background: rgba(67, 172, 233, 0.08);
                                   color: #23262F;
                                   font-size: 13.5px;
                                   font-weight: 700;
                            }
                            .mp-active-chips-row {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: center;
                                   gap: 8px;
                                   margin-top: 14px;
                                   padding-top: 14px;
                                   border-top: 1px solid #EEF2F6;
                            }
                            .mp-active-chip {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 7px;
                                   padding: 5px 11px;
                                   border-radius: 999px;
                                   border: 1px solid rgba(67, 172, 233, 0.35);
                                   background: rgba(67, 172, 233, 0.10);
                                   color: #23262F;
                                   font-size: 12.5px;
                                   font-weight: 600;
                            }
                            .mp-active-chip i {
                                   font-size: 11px;
                                   color: #43ACE9;
                            }
                            .mp-clear-all-chips-btn {
                                   border: none;
                                   background: transparent;
                                   color: #64748B;
                                   font-size: 12.5px;
                                   font-weight: 600;
                                   text-decoration: underline;
                                   padding: 4px 6px;
                            }
                            .mp-empty-reset-btn {
                                   border: none;
                                   background: #23262F;
                                   color: #fff;
                                   border-radius: 12px;
                                   padding: 10px 22px;
                                   font-size: 14px;
                                   font-weight: 700;
                            }
                            .mp-empty-reset-btn:hover {
                                   background: #43ACE9;
                            }

                            /* SEO Content Blocks */
                            .content-wrapper {
                                   position: relative;
                                   overflow: hidden;
                                   color: #212529 !important;
                                   background: #ffffff;
                                   border: 1px solid #ECEFF2;
                                   box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
                                   border-radius: 22px;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
                            }
                            .content-wrapper::before {
                                   content: "";
                                   position: absolute;
                                   inset: 0 auto auto 0;
                                   width: 100%;
                                   height: 4px;
                                   background: linear-gradient(90deg, #23262F 0%, #43ACE9 100%);
                            }
                            .content-wrapper-short {
                                   padding: 24px 30px;
                                   text-align: center;
                            }
                            .content-wrapper-long {
                                   padding: 32px 36px;
                            }
                            .content-wrapper > div {
                                   position: relative;
                                   z-index: 1;
                            }
                            .content-wrapper p {
                                   margin-bottom: 0;
                                   color: #475569 !important;
                                   line-height: 1.85;
                                   font-size: 1rem;
                            }
                            .content-wrapper p + p {
                                   margin-top: 14px;
                            }
                            .content-wrapper-short strong,
                            .content-wrapper-short b {
                                   display: block;
                                   margin-bottom: 8px;
                                   color: #23262F !important;
                                   font-size: clamp(1.3rem, 1.8vw, 1.75rem);
                                   line-height: 1.25;
                                   font-weight: 800;
                            }
                            .content-wrapper-long h1,
                            .content-wrapper-long h2,
                            .content-wrapper-long h3,
                            .content-wrapper-long h4 {
                                   color: #23262F !important;
                                   font-weight: 800;
                                   line-height: 1.25;
                                   margin-bottom: 14px;
                            }
                            .content-wrapper-long ul,
                            .content-wrapper-long ol {
                                   margin: 18px 0;
                                   padding-left: 0;
                                   list-style: none;
                                   display: grid;
                                   gap: 10px;
                            }
                            .content-wrapper-long li {
                                   position: relative;
                                   display: flex;
                                   align-items: center;
                                   padding-left: 28px;
                                   color: #475569 !important;
                                   line-height: 1.75;
                            }
                            .content-wrapper-long li:empty,
                            .content-wrapper-long p:empty,
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
                                   width: 16px;
                                   height: 16px;
                                   border-radius: 50%;
                                   background: #43ACE9;
                            }
                            .content-wrapper-long li::after {
                                   content: "";
                                   position: absolute;
                                   left: 6px;
                                   top: 50%;
                                   transform: translateY(-50%);
                                   width: 4px;
                                   height: 4px;
                                   border-radius: 50%;
                                   background: #fff;
                            }

                            /* Product Cards & Grid */
                            .marketplace-main-content .product-card-wrapper {
                                   padding: 14px;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-image {
                                   height: auto !important;
                                   margin-bottom: 0 !important;
                            }
                            .marketplace-main-content .product-card-wrapper .owner-info-row {
                                   margin: 12px 0 8px !important;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-title {
                                   margin-bottom: 6px;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-title h2,
                            .marketplace-main-content .product-card-wrapper .pro-title h2.mp-card-title-single {
                                   display: block;
                                   height: auto !important;
                                   font-size: 15.5px;
                                   line-height: 1.35;
                                   margin-bottom: 0;
                                   word-break: normal;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-title h2 a {
                                   display: block;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-meta {
                                   margin-top: auto;
                                   padding-top: 4px;
                                   gap: 8px;
                                   align-items: flex-end !important;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-price {
                                   min-width: 0;
                                   line-height: 1.2 !important;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-price > span {
                                   display: block;
                                   font-size: 12px;
                                   line-height: 1.2;
                                   margin-bottom: 3px;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-meta .price {
                                   font-size: 15.5px;
                                   font-weight: 700;
                                   line-height: 1.2 !important;
                                   margin: 0 !important;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-price .price span {
                                   font-size: inherit;
                                   font-weight: inherit;
                                   line-height: inherit;
                                   color: inherit;
                            }
                            .marketplace-main-content .product-card-wrapper .mp-discount-price-row {
                                   display: flex;
                                   flex-wrap: wrap;
                                   align-items: baseline;
                                   column-gap: 6px;
                                   row-gap: 2px;
                                   line-height: 1.2;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-meta .price .mp-sale-price {
                                   order: 1;
                                   font-size: 15.5px;
                                   font-weight: 700;
                                   color: #23262F !important;
                                   white-space: nowrap;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-meta .price .mp-original-price {
                                   order: 2;
                                   font-size: 12px;
                                   font-weight: 500;
                                   color: #94A3B8 !important;
                                   white-space: nowrap;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-buy-btn {
                                   flex-shrink: 0;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-bid-btn a {
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   font-size: 14px;
                                   line-height: 1.2;
                                   padding: 10px 16px;
                                   white-space: nowrap;
                            }
                            .marketplace-main-content .product-card-wrapper .pro-buy-btn > button,
                            .marketplace-main-content .product-card-wrapper .pro-bid-btn > span {
                                   font-size: 14px !important;
                                   line-height: 1.2 !important;
                                   padding: 10px 16px !important;
                                   border-radius: 8px !important;
                                   white-space: nowrap;
                            }
                            .marketplace-latest-grid-section {
                                   margin-top: 4px;
                                   margin-bottom: 36px;
                            }
                            .marketplace-load-more-btn {
                                   min-width: 176px;
                                   min-height: 46px;
                                   border: none;
                                   border-radius: 12px;
                                   background: #23262F;
                                   color: #ffffff;
                                   font-size: 14px;
                                   font-weight: 700;
                                   padding: 0 28px;
                                   box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
                                   transition: transform 0.2s ease, background 0.2s ease;
                            }
                            .marketplace-load-more-btn:hover:not(:disabled) {
                                   transform: translateY(-2px);
                                   background: #43ACE9;
                            }
                            .marketplace-load-more-btn:disabled {
                                   cursor: wait;
                                   opacity: 0.7;
                            }

                            @media (max-width: 991px) {
                                   .marketplace-workspace {
                                          display: block;
                                   }
                                   .mp-sidebar-backdrop {
                                          position: fixed;
                                          inset: 0;
                                          z-index: 100002;
                                          background: rgba(15, 23, 42, 0.48);
                                          opacity: 0;
                                          pointer-events: none;
                                          transition: opacity 0.3s ease;
                                   }
                                   .mp-sidebar-backdrop.is-open {
                                          opacity: 1;
                                          pointer-events: auto;
                                   }
                                   .mp-sidebar {
                                          position: fixed;
                                          top: 0;
                                          left: 0;
                                          bottom: 0;
                                          width: 340px;
                                          max-width: 92vw;
                                          height: 100dvh;
                                          max-height: 100dvh;
                                          z-index: 100003;
                                          border-radius: 0 20px 20px 0;
                                          border: none;
                                          box-shadow: 12px 0 32px rgba(15, 23, 42, 0.22);
                                          transform: translateX(-105%);
                                          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
                                          will-change: transform;
                                   }
                                   .mp-sidebar.is-open {
                                          transform: translateX(0);
                                   }
                                   .mp-sidebar-mobile-head {
                                          align-items: center;
                                          justify-content: space-between;
                                          padding: 16px;
                                          border-bottom: 1px solid #EEF2F6;
                                          background: #fff;
                                   }
                                   .mp-sidebar-mobile-head h3 {
                                          margin: 0;
                                          font-size: 17px;
                                          font-weight: 800;
                                          color: #23262F;
                                   }
                                   .mp-accent-icon {
                                          color: #43ACE9;
                                   }
                                   .mp-sidebar-close-btn {
                                          width: 36px;
                                          height: 36px;
                                          border: none;
                                          border-radius: 10px;
                                          background: #F1F5F9;
                                          color: #23262F;
                                          display: inline-flex;
                                          align-items: center;
                                          justify-content: center;
                                          font-size: 17px;
                                   }
                                   .mp-cat-scroll-list {
                                          max-height: none;
                                   }
                                   .mp-sidebar-footer {
                                          padding-bottom: calc(14px + env(safe-area-inset-bottom));
                                   }
                            }

                            /* Mobile Layout */
                            @media (max-width: 767px) {
                                   .mp-workspace-toolbar {
                                          padding: 14px;
                                          border-radius: 16px;
                                          margin-bottom: 18px;
                                   }
                                   .mp-heading-wrap h1 {
                                          font-size: 20px;
                                   }
                                   .mp-toolbar-actions {
                                          width: 100%;
                                          flex-direction: column;
                                          align-items: stretch;
                                   }
                                   .mp-mobile-drawer-trigger {
                                          width: 100%;
                                   }
                                   .marketplace-top-tabs {
                                          width: 100%;
                                          display: grid;
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                   }
                                   .marketplace-top-tab {
                                          padding: 0 8px;
                                          font-size: 12.5px;
                                          min-height: 38px;
                                   }
                                   .mp-sidebar {
                                          width: 100%;
                                          max-width: 100%;
                                          border-radius: 0;
                                   }
                                   .content-wrapper-short {
                                          padding: 20px 16px;
                                          border-radius: 18px;
                                   }
                                   .content-wrapper-long {
                                          padding: 24px 16px;
                                          border-radius: 18px;
                                   }
                            }
                     `}</style>
              </AppLayout>
       );
}
