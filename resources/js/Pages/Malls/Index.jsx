import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AlphabetDirectory from '@/Components/AlphabetDirectory';
import MallHeroBanner from '@/Components/MallHeroBanner';
import useTranslate from '@/hooks/useTranslate';

const MALLS_BANNER = '/assets/images/WebsiteBanner2.png';

export default function Index({ malls = [] }) {
       const { t } = useTranslate();

       const mallList = Array.isArray(malls) ? malls : Object.values(malls || {});
       const items = mallList.map((mall) => ({
              id: mall.id,
              label: mall.name,
              slug: mall.slug,
       }));

       return (
              <AppLayout title={t('Malls')}>
                     <Head title={t('Malls')} />

                     <section className="mall-directory">
                            <MallHeroBanner
                                   image={MALLS_BANNER}
                                   title={t('Malls')}
                                   subtitle={t('Select a mall to view its verified corporate sellers.')}
                            />

                            <div className="container py-4 py-lg-5">
                                   <AlphabetDirectory
                                          items={items}
                                          emptyMessage={t('No malls available right now.')}
                                          onSelect={(item) => router.get(route('malls.show', item.slug))}
                                   />
                            </div>
                     </section>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .mall-directory {
                                   background: #F9F9F9;
                                   min-height: 60vh;
                            }
                     `}} />
              </AppLayout>
       );
}
