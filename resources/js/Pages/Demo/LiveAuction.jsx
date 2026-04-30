import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import YoutubeLiveEmbed from '@/Components/ProductDetails/YoutubeLiveEmbed';
import BidSection from '@/Components/ProductDetails/BidSection';
import BidHistory from '@/Components/ProductDetails/BidHistory';
import ListingLiveChat from '@/Components/ProductDetails/ListingLiveChat';

export default function LiveAuction({
    auction,
    bids,
    highestBid,
    winnerDetails,
    isFavorite,
    youtubeVideoId,
    standardProductUrl,
}) {
    const refreshAuctionProps = () => {
        router.reload({
            only: ['auction', 'bids', 'highestBid', 'winnerDetails', 'isFavorite'],
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={`Live demo — ${auction.title}`}>
            <Head title={`Live demo — ${auction.title}`} />

            <div className="container-fluid py-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                    <div>
                        <span className="badge bg-primary me-2">Demo</span>
                        <h1 className="h4 d-inline m-0">Live stream + room chat + bidding</h1>
                        <p className="text-muted small mb-0 mt-1">
                            Same listing as{' '}
                            <a href={standardProductUrl}>the standard product page</a>. Bids and chat are on XpertBid; video is embedded from YouTube.
                        </p>
                    </div>
                    <a className="btn btn-outline-secondary btn-sm" href={standardProductUrl}>
                        Open classic layout
                    </a>
                </div>

                <div className="row g-4">
                    <div className="col-lg-6">
                        <h2 className="h6 text-uppercase text-muted mb-2">Live video</h2>
                        <YoutubeLiveEmbed videoId={youtubeVideoId} title={auction.title} />
                        <p className="small text-muted mt-2 mb-0">
                            If you set a <strong>YouTube Live / video</strong> on this listing in Admin, that stream is used here. Otherwise a
                            default 24/7 stream is shown for the demo layout.
                        </p>
                    </div>

                    <div className="col-lg-3">
                        <h2 className="h6 text-uppercase text-muted mb-2">Room chat</h2>
                        <ListingLiveChat listingId={auction.id} listingSlug={auction.slug} />
                    </div>

                    <div className="col-lg-3">
                        <h2 className="h6 text-uppercase text-muted mb-2">Bid on XpertBid</h2>
                        <div className="border rounded-3 p-2 p-md-3 bg-light bg-opacity-25">
                            <BidSection
                                product={auction}
                                highestBidProp={highestBid}
                                onBidPlaced={refreshAuctionProps}
                                winnerDetails={winnerDetails}
                                isFavoriteProp={isFavorite}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-4 mt-1">
                    <div className="col-12">
                        <h2 className="h6 text-uppercase text-muted mb-2">Bid history</h2>
                        <BidHistory bids={bids} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
