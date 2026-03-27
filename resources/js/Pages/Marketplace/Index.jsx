import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ExploreProducts from './Components/ExploreProducts';
import Pagination from '@/Components/Pagination';

export default function Index({
       products = { data: [], links: [] },
       categories = [],
       currentCategory = null,
       currentTopCategory = null,
       subcategoryTabs = [],
       currentSubcategory = null,
       childCategoryTabs = [],
       filters = {},
}) {
       const [searchTerm, setSearchTerm] = useState(filters?.search || '');
       const heroImage = currentTopCategory?.image_url || currentCategory?.image_url || null;
       const currentType = filters?.type || 'auction';
       const showChildTabs = Boolean(currentSubcategory);

       const tabs = [
              { key: 'auction', label: 'Auction', mobileLabel: 'Auction' },
              { key: 'normal', label: 'Normal Products', mobileLabel: 'Normal' },
              { key: 'business', label: 'Business Products', mobileLabel: 'Business' },
       ];

       const handleTabChange = (type) => {
              router.get(
                     route('marketplace.index', route().params),
                     {
                            ...filters,
                            type,
                            page: 1,
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
                     route('marketplace.index', route().params),
                     {
                            ...filters,
                            search: searchTerm,
                            page: 1,
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
       };

       const handleCategoryTabChange = (slug) => {
              router.get(
                     route('marketplace.index', { slug }),
                     {
                            ...filters,
                            page: 1,
                     },
                     {
                            preserveState: true,
                            preserveScroll: true,
                     }
              );
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
                                                          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url(${heroImage})`,
                                                   }
                                                 : undefined
                                   }
                            >
                                   <div className="container-fluid px-lg-5">
                                          <div className="marketplace-topbar p-3 p-lg-4">
                                                 <div className="marketplace-selected-category mb-3">
                                                        {currentCategory?.name || currentTopCategory?.name || 'Marketplace'}
                                                 </div>

                                                 {currentTopCategory && !showChildTabs && (
                                                        <div className="marketplace-subcategory-tabs mb-3">
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
                                                        <input
                                                               type="text"
                                                               value={searchTerm}
                                                               onChange={(e) => setSearchTerm(e.target.value)}
                                                               placeholder="Search products..."
                                                        />
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
                                                                                   : 'auction';

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

                            <div className="container-fluid px-lg-5 pt-4">
                                   {currentCategory?.seo_short_content && (
                                          <div className="bg-white rounded-4 p-4 shadow-sm mb-4 border text-center text-dark content-wrapper">
                                                 <div dangerouslySetInnerHTML={{ __html: currentCategory.seo_short_content }} />
                                          </div>
                                   )}

                                   <div className="mkt-right">
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

                     <style>{`
                            .content-wrapper {
                                   color: #212529 !important;
                            }
                            .content-wrapper * {
                                   color: #212529 !important;
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
                            @media (max-width: 767px) {
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
                            }
                     `}</style>
              </AppLayout>
       );
}
