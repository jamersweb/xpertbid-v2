import React, { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import ListingCard from '@/Components/ListingCard';
import useTranslate from '@/hooks/useTranslate';

export default function MyListings({ auctions }) {
       const { t } = useTranslate();

       useEffect(() => {
              const reloadListings = () => {
                     if (document.visibilityState === 'visible') {
                            router.reload({
                                   only: ['auctions'],
                                   preserveScroll: true,
                                   preserveState: true,
                            });
                     }
              };

              const interval = setInterval(reloadListings, 10000);
              const handleVisibilityChange = () => reloadListings();

              document.addEventListener('visibilitychange', handleVisibilityChange);

              return () => {
                     clearInterval(interval);
                     document.removeEventListener('visibilitychange', handleVisibilityChange);
              };
       }, []);

       return (
              <AppLayout title={t('My Listings')}>
                     <section className="listing">
                            <div className="container-fluid">
                                   <div className="listing-main-heading">
                                          <h2>{t('My Listings')}</h2>
                                   </div>

                                   <div className="row">
                                          {auctions && auctions.length > 0 ? (
                                                 auctions.map((auction) => (
                                                        <ListingCard
                                                               key={auction.id}
                                                               listing={auction}
                                                               onDeleted={() =>
                                                                      router.reload({
                                                                             only: ['auctions'],
                                                                             preserveScroll: true,
                                                                      })
                                                               }
                                                        />
                                                 ))
                                          ) : (
                                                 <p className="text-center py-5">{t('No listings found.')}</p>
                                          )}
                                   </div>
                            </div>
                     </section>
              </AppLayout>
       );
}
