import { Head } from '@inertiajs/react';

const cleanDescription = (description, limit = 160) => {
    if (!description) return 'Discover verified listings, online auctions, and marketplace deals in Pakistan on XpertBid.';
    const clean = String(description)
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return clean.length > limit ? `${clean.slice(0, limit - 1).trim()}…` : clean;
};

const resolveAbsoluteUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://xpertbid.com';
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
};

export default function ProductSeoHead({ auction }) {
    if (!auction) return null;

    const siteName = 'XpertBid';
    const rawTitle = String(auction.title || '').trim();
    const location = String(auction.product_location || '').trim();
    const displayTitle = rawTitle
        ? (location ? `${rawTitle} in ${location} | ${siteName}` : `${rawTitle} | ${siteName}`)
        : siteName;

    const description = cleanDescription(auction.description, 160);

    const rawImage = auction.image_url || (Array.isArray(auction.album_urls) && auction.album_urls[0]) || '/assets/images/WebsiteBanner2.png';
    const imageUrl = resolveAbsoluteUrl(rawImage);

    const canonicalUrl = auction.slug
        ? resolveAbsoluteUrl(`/product/${auction.slug}`)
        : (typeof window !== 'undefined' ? window.location.href : resolveAbsoluteUrl('/'));

    return (
        <Head>
            <title>{displayTitle}</title>
            <meta name="description" content={description} head-key="description" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" head-key="og:type" />
            <meta property="og:site_name" content={siteName} head-key="og:site_name" />
            <meta property="og:title" content={displayTitle} head-key="og:title" />
            <meta property="og:description" content={description} head-key="og:description" />
            <meta property="og:url" content={canonicalUrl} head-key="og:url" />
            {imageUrl && <meta property="og:image" content={imageUrl} head-key="og:image" />}
            {imageUrl && <meta property="og:image:secure_url" content={imageUrl} head-key="og:image:secure_url" />}
            {rawTitle && <meta property="og:image:alt" content={rawTitle} head-key="og:image:alt" />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" head-key="twitter:card" />
            <meta name="twitter:title" content={displayTitle} head-key="twitter:title" />
            <meta name="twitter:description" content={description} head-key="twitter:description" />
            {imageUrl && <meta name="twitter:image" content={imageUrl} head-key="twitter:image" />}

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} head-key="canonical" />
        </Head>
    );
}

