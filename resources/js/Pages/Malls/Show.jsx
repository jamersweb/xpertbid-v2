import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AlphabetDirectory from '@/Components/AlphabetDirectory';
import MallHeroBanner from '@/Components/MallHeroBanner';
import useTranslate from '@/hooks/useTranslate';

const MALL_BANNER = '/assets/images/WebsiteBanner1.png';

export default function Show({ mall, sellers = [] }) {
       const { t } = useTranslate();

       const items = (sellers || []).map((seller) => ({
              id: seller.id,
              label: seller.label || seller.company_name || seller.name,
              userId: seller.id,
       }));

       return (
              <AppLayout title={mall?.name || t('Malls')}>
                     <Head title={`${mall?.name || t('Malls')} | ${t('Sellers')}`} />

                     <section className="mall-directory">
                            <MallHeroBanner
                                   image={MALL_BANNER}
                                   eyebrow={t('Mall')}
                                   title={mall?.name}
                                   subtitle={t('Select a verified seller to view their products.')}
                            />

                            <div className="container py-4 py-lg-5">
                                   <Link href={route('malls.index')} className="mall-directory__back">
                                          ← {t('All Malls')}
                                   </Link>

                                   <AlphabetDirectory
                                          items={items}
                                          emptyMessage={t('No verified corporate sellers for this mall yet.')}
                                          onSelect={(item) =>
                                                 router.get(route('malls.seller', {
                                                        mall: mall.slug,
                                                        user: item.userId,
                                                 }))
                                          }
                                   />
                            </div>
                     </section>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .mall-directory {
                                   background: #F9F9F9;
                                   min-height: 60vh;
                            }
                            .mall-directory__back {
                                   display: inline-block;
                                   margin-bottom: 16px;
                                   color: #777E91;
                                   font-size: 14px;
                                   font-weight: 600;
                                   text-decoration: none;
                            }
                            .mall-directory__back:hover {
                                   color: #23262F;
                            }
                     `}} />
              </AppLayout>
       );
}
