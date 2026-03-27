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
                            <div className="fav-like-hdig pt-4 mb-4">
                                <h2 className="fw-bold">My Favorites</h2>
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
                .marketplace {
                    padding: 40px 0;
                }
                .fav-like-hdig h2 {
                    font-size: 32px;
                    color: #23262F;
                    margin-bottom: 20px;
                }
                .makt-parent {
                    display: flex;
                    flex-wrap: wrap;
                    margin-left: -15px;
                    margin-right: -15px;
                }
                /* Ported mkt- styles */
                .mkt-child {
                    margin-bottom: 30px;
                }
                .market-card {
                    background: #FFFFFF;
                    border: 1px solid #E6E8EC;
                    border-radius: 20px;
                    padding: 12px;
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .market-card:hover {
                    box-shadow: 0 12px 32px rgba(31, 47, 70, 0.12);
                    transform: translateY(-4px);
                }
                .mkt-img {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                }
                .mkt-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .favourite-icon {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #FFFFFF;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 11;
                }
                .mkt-body {
                    padding: 12px 4px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .mkt-pro-head h3 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #23262F;
                    margin-bottom: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .mkt-detail {
                    margin-top: auto;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    background: #F4F5F6;
                    border-radius: 12px;
                    padding: 12px;
                }
                .crnt-bid {
                    font-size: 11px;
                    color: #777E91;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 4px;
                }
                .mkt-bid-price .price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #23262F;
                }
                .mkt-bid-btn a {
                    background: #43ACE9;
                    color: #FFFFFF;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .mkt-bid-btn a:hover {
                    background: #35a0dc;
                }

                /* Countdown Timer Styling */
                .mkt-img .counter {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(28, 29, 32, 0.85);
                    padding: 8px 12px;
                    border-radius: 10px;
                    z-index: 10;
                    width: auto !important;
                    min-width: 180px;
                }
                .counter-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }
                .counter-box {
                    text-align: center;
                }
                .counter-value {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                }
                .counter-label {
                    color: #fff;
                    font-size: 8px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }

                /* Owner Info Row */
                .owner-info-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 8px 0 12px;
                }
                .owner-info-row img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .owner-info-row span {
                    font-size: 14px;
                    color: #23262F;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}} />
        </AppLayout>
    );
}
