import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ListingCard from '@/Components/ListingCard';

export default function MyListings({ auctions }) {
       // Local state to handle UI updates after deletion if we want immediate feedback
       // However, since props come from Inertia, a reload is often better or we can rely on router.reload()
       // For now, let's just use the props. If we want to remove from view, we can use local state initialized from props.
       // But standard Inertia way is usually reload.

       return (
              <AppLayout title="My Listings">
                     <section className="listing">
                            <div className="container-fluid">
                                   <div className="listing-main-heading">
                                          <h2>My Listings</h2>
                                          <Link
                                                 href={route('auctions.create')}
                                                 className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                          >
                                                 Create New Listing
                                          </Link>
                                   </div>

                                   <div className="row">
                                          {auctions && auctions.length > 0 ? (
                                                 auctions.map((auction) => (
                                                        <ListingCard
                                                               key={auction.id}
                                                               listing={auction}
                                                               onDeleted={() => window.location.reload()}
                                                        />
                                                 ))
                                          ) : (
                                                 <p className="text-center py-5">No listings found.</p>
                                          )}
                                   </div>
                            </div>
                     </section>
              </AppLayout>
       );
}
