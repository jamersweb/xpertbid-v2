import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import FavoriteCard from '@/Components/FavoriteCard';

export default function Index({ favorites }) {
       return (
              <AppLayout title="My Favorites">
                     <Head title="My Favorites" />

                     <div className="py-5 bg-light min-vh-100">
                            <div className="container">
                                   <div className="row justify-content-center">
                                          <div className="col-12">
                                                 <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                                                        <div>
                                                               <h1 className="h2 fw-bold text-dark mb-1">My Favorites</h1>
                                                               <p className="text-secondary mb-0">Manage and track your liked auctions</p>
                                                        </div>
                                                        <div className="badge bg-primary rounded-pill px-3 py-2">
                                                               {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'}
                                                        </div>
                                                 </div>

                                                 {favorites.length === 0 ? (
                                                        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                                                               <div className="mb-4">
                                                                      <i className="fa-regular fa-heart fa-4x text-muted opacity-25"></i>
                                                               </div>
                                                               <h2 className="h4 fw-bold text-dark mt-3">No Favorites Yet</h2>
                                                               <p className="text-muted mb-4">Items you've liked will appear here for quick access.</p>
                                                               <a href="/marketplace" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
                                                                      Discover Auctions
                                                               </a>
                                                        </div>
                                                 ) : (
                                                        <div className="row g-4 makt-parent">
                                                               {favorites.map((favorite) => (
                                                                      <FavoriteCard key={favorite.id} favorite={favorite} />
                                                               ))}
                                                        </div>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <style dangerouslySetInnerHTML={{
                            __html: `
                .markt-parent {
                    display: flex;
                    flex-wrap: wrap;
                }
            `}} />
              </AppLayout>
       );
}
