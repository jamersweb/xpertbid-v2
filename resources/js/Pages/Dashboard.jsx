import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import ListingCard from '@/Components/ListingCard';
import useTranslate from '@/hooks/useTranslate';

export default function Dashboard({ listingsCount, biddingsCount, listings }) {
    const { t } = useTranslate();

    return (
        <AppLayout title={t('Dashboard')}>
            <Head title={t('User Dashboard')} />

            <div style={{ backgroundColor: '#F9F9F9', minHeight: '100vh' }}>
                <section className="dashboard-records py-4">
                    <div className="container">
                        <div className="row">
                            <h1 className="mkt-sec mb-4 px-3" style={{ fontSize: '32px', fontWeight: '800', color: '#23262F' }}>{t('Dashboard')}</h1>

                            <div className="col-md-6 mb-4 px-3">
                                <div className="records-box d-flex align-items-center p-4 bg-white" style={{
                                    borderRadius: '25px',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                                    gap: '20px',
                                    border: '1px solid #f0f0f0'
                                }}>
                                    <img src="/assets/images/dashboard-listing.svg" alt="Listings" style={{
                                        backgroundColor: '#DCECFA',
                                        borderRadius: '100%',
                                        padding: '15px',
                                        width: '80px',
                                        height: '80px'
                                    }} />
                                    <div className="score-title">
                                        <span className="score d-block fw-bold" style={{
                                            fontSize: '38px',
                                            lineHeight: '44px',
                                            color: '#23262F',
                                            fontFamily: '"Inter", sans-serif'
                                        }}>{listingsCount}</span>
                                        <h6 className="title mb-0" style={{
                                            fontSize: '18px',
                                            lineHeight: '26px',
                                            fontWeight: '700',
                                            color: '#606060',
                                            fontFamily: '"Inter", sans-serif'
                                        }}>{t('Listings')}</h6>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-4 px-3">
                                <div className="records-box d-flex align-items-center p-4 bg-white" style={{
                                    borderRadius: '25px',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                                    gap: '20px',
                                    border: '1px solid #f0f0f0'
                                }}>
                                    <img src="/assets/images/dashboard-bidding.svg" alt="Biddings" style={{
                                        backgroundColor: '#DCECFA',
                                        borderRadius: '100%',
                                        padding: '15px',
                                        width: '80px',
                                        height: '80px'
                                    }} />
                                    <div className="score-title">
                                        <span className="score d-block fw-bold" style={{
                                            fontSize: '38px',
                                            lineHeight: '44px',
                                            color: '#23262F',
                                            fontFamily: '"Inter", sans-serif'
                                        }}>{biddingsCount}</span>
                                        <h6 className="title mb-0" style={{
                                            fontSize: '18px',
                                            lineHeight: '26px',
                                            fontWeight: '700',
                                            color: '#606060',
                                            fontFamily: '"Inter", sans-serif'
                                        }}>{t('Biddings')}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mx-4 px-3">
                        <h2 className="mb-0" style={{ fontSize: '34px', fontWeight: '700', color: '#23262F' }}>{t('My Listings')}</h2>
                        <Link className="button-style-3" href={route('auctions.mylistings')}>
                            {t('See all')}
                        </Link>
                    </div>
                </div>

                <section className="listing pb-5">
                    <div className="container dashboard-listing">
                        <div className="row g-4">
                            {listings && listings.length > 0 ? (
                                listings.map((listing) => (
                                    <div key={listing.id} className="col-12 px-3">
                                        <ListingCard listing={listing} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <p className="text-muted">{t('No listings available.')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
