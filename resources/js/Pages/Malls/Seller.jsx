import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AuctionCard from '@/Components/AuctionCard';
import MallHeroBanner from '@/Components/MallHeroBanner';
import useTranslate from '@/hooks/useTranslate';

const SELLER_BANNER = '/assets/images/WebsiteBanner3.png';

export default function Seller({ mall, seller, listings }) {
       const { t } = useTranslate();
       const listingItems = Array.isArray(listings?.data) ? listings.data : [];
       const paginationLinks = Array.isArray(listings?.links) ? listings.links : [];
       const sellerLabel = seller?.label || seller?.company_name || seller?.name || t('Seller');
       const [sortBy, setSortBy] = useState('latest');

       const sortedItems = useMemo(() => {
              const items = [...listingItems];
              if (sortBy === 'price_asc' || sortBy === 'price_desc') {
                     items.sort((a, b) => {
                            const priceA = Number(a?.price || a?.buy_now_price || a?.minimum_bid || 0);
                            const priceB = Number(b?.price || b?.buy_now_price || b?.minimum_bid || 0);
                            return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA;
                     });
              } else if (sortBy === 'title') {
                     items.sort((a, b) => String(a?.title || '').localeCompare(String(b?.title || '')));
              }
              return items;
       }, [listingItems, sortBy]);

       return (
              <AppLayout title={sellerLabel}>
                     <Head title={`${sellerLabel} | ${mall?.name || t('Malls')}`} />

                     <section className="mall-seller-page">
                            <MallHeroBanner
                                   image={SELLER_BANNER}
                                   eyebrow={mall?.name}
                                   title={sellerLabel}
                                   subtitle={t('Products from this seller')}
                            />

                            <div className="container py-4 py-lg-5">
                                   <Link
                                          href={route('malls.show', mall.slug)}
                                          className="mall-seller-page__back"
                                   >
                                          ← {mall?.name}
                                   </Link>

                                   <div className="mall-seller-toolbar">
                                          <span className="mall-seller-toolbar__count">
                                                 {listings?.total ?? sortedItems.length}{' '}
                                                 {(listings?.total ?? sortedItems.length) === 1
                                                        ? t('product')
                                                        : t('products')}
                                          </span>
                                          <label className="mall-seller-toolbar__sort">
                                                 <span>{t('Sort by')}</span>
                                                 <select
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                 >
                                                        <option value="latest">{t('Most relevant')}</option>
                                                        <option value="title">{t('Name A–Z')}</option>
                                                        <option value="price_asc">{t('Price: Low to High')}</option>
                                                        <option value="price_desc">{t('Price: High to Low')}</option>
                                                 </select>
                                          </label>
                                   </div>

                                   {sortedItems.length > 0 ? (
                                          <div className="row g-4 mall-seller-products">
                                                 {sortedItems.map((listing) => (
                                                        <div className="col-12 col-sm-6 col-lg-4" key={listing.id}>
                                                               <div className="mall-seller-product-card h-100">
                                                                      <AuctionCard auction={listing} showPropertyMeta />
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   ) : (
                                          <div className="mall-seller-page__empty text-center py-5">
                                                 <p className="mb-0">{t('This seller has no active listings yet.')}</p>
                                          </div>
                                   )}

                                   {paginationLinks.length > 3 && (
                                          <div className="d-flex justify-content-center mt-5">
                                                 <nav aria-label="Seller listings pagination">
                                                        <ul className="pagination">
                                                               {paginationLinks.map((link, i) => (
                                                                      <li
                                                                             key={i}
                                                                             className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                                                      >
                                                                             <button
                                                                                    type="button"
                                                                                    className="page-link"
                                                                                    disabled={!link.url}
                                                                                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                             />
                                                                      </li>
                                                               ))}
                                                        </ul>
                                                 </nav>
                                          </div>
                                   )}
                            </div>
                     </section>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .mall-seller-page {
                                   background: #fff;
                                   min-height: 60vh;
                            }
                            .mall-seller-page__back {
                                   display: inline-block;
                                   margin-bottom: 16px;
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                                   text-decoration: none;
                            }
                            .mall-seller-page__back:hover {
                                   color: #23262F;
                            }
                            .mall-seller-toolbar {
                                   display: flex;
                                   align-items: center;
                                   justify-content: space-between;
                                   gap: 16px;
                                   flex-wrap: wrap;
                                   padding: 14px 0;
                                   margin-bottom: 20px;
                                   border-top: 1px solid #ECEEF2;
                                   border-bottom: 1px solid #ECEEF2;
                            }
                            .mall-seller-toolbar__count {
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                            }
                            .mall-seller-toolbar__sort {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 10px;
                                   margin: 0;
                                   color: #777E91;
                                   font-size: 13px;
                                   font-weight: 600;
                            }
                            .mall-seller-toolbar__sort select {
                                   border: 1px solid #D0D5DD;
                                   border-radius: 8px;
                                   padding: 8px 12px;
                                   background: #fff;
                                   color: #23262F;
                                   font-size: 13px;
                                   font-weight: 600;
                                   min-width: 160px;
                            }
                            .mall-seller-product-card {
                                   background: transparent;
                                   padding: 0;
                                   border: none;
                                   border-radius: 0;
                                   height: 100%;
                            }
                            .mall-seller-page__empty {
                                   color: #777E91;
                                   font-size: 15px;
                                   font-weight: 500;
                                   background: #F9F9F9;
                                   border-radius: 16px;
                                   border: 1px solid #ECEEF2;
                            }
                     `}} />
              </AppLayout>
       );
}
