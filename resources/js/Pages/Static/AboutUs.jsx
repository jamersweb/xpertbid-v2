import { Head } from '@inertiajs/react';
import {
    LuArrowLeftRight,
    LuBriefcase,
    LuBuilding2,
    LuCar,
    LuGlobe,
    LuHammer,
    LuHandshake,
    LuLayers,
    LuPackage,
    LuShoppingBag,
    LuSparkles,
    LuTrendingUp,
} from 'react-icons/lu';
import AppLayout from '@/Layouts/AppLayout';
import useTranslate from '@/hooks/useTranslate';

const MARKETPLACE_CATEGORIES = [
    {
        key: 'property',
        title: 'Property',
        description: 'Explore properties for sale, rent, and lease.',
        Icon: LuBuilding2,
    },
    {
        key: 'xpertbuild',
        title: 'XpertBuild',
        description: 'Discover construction materials, home improvement products, and related services.',
        Icon: LuHammer,
    },
    {
        key: 'vehicles',
        title: 'Vehicles',
        description: 'Buy, sell, and explore personal and commercial vehicles.',
        Icon: LuCar,
    },
    {
        key: 'wholesale',
        title: 'Wholesale & Bulk',
        description: 'Connect with suppliers and discover products across different industries.',
        Icon: LuPackage,
    },
    {
        key: 'services',
        title: 'Business & Professional Services',
        description: 'Find service providers and explore business opportunities.',
        Icon: LuBriefcase,
    },
    {
        key: 'ecommerce',
        title: 'E-commerce & More',
        description: 'Discover products across a growing range of categories.',
        Icon: LuShoppingBag,
    },
];

const DIFFERENTIATORS = [
    {
        key: 'categories',
        title: 'Multiple Categories',
        description: 'Explore different products, properties, and services through one platform.',
        Icon: LuLayers,
    },
    {
        key: 'opportunities',
        title: 'More Opportunities',
        description: 'Help businesses showcase their offerings and reach potential customers.',
        Icon: LuTrendingUp,
    },
    {
        key: 'transactions',
        title: 'Flexible Transactions',
        description: 'Explore direct listings, buyer requests, and auction-based opportunities.',
        Icon: LuArrowLeftRight,
    },
    {
        key: 'connections',
        title: 'Convenient Connections',
        description: 'Bring buyers and sellers closer through a digital marketplace.',
        Icon: LuHandshake,
    },
    {
        key: 'ecosystem',
        title: 'Growing Ecosystem',
        description: 'Supporting individuals and businesses across Pakistan, with an expanding presence in international markets.',
        Icon: LuGlobe,
    },
];

export default function AboutUs() {
    const { t } = useTranslate();

    // Fall back to verified copy when cached or older translation maps omit the new about_page keys.
    const tr = (key, fallback) => {
        const value = t(key);
        return !value || value === key ? fallback : value;
    };

    const metaTitle = tr('about_page.meta_title', 'About XpertBid — One Platform. Endless Possibilities.');

    return (
        <AppLayout>
            <Head title={metaTitle} />

            <style>{`
                .xb-about-page {
                    color: #23262F;
                }
                .xb-about-h1 {
                    font-family: Inter, sans-serif;
                    color: #23262F !important;
                    font-size: clamp(28px, 3vw, 38px);
                    font-weight: 800;
                    line-height: 1.18;
                    letter-spacing: -0.02em;
                }
                .xb-about-h2 {
                    font-family: Inter, sans-serif;
                    color: #23262F !important;
                    font-size: clamp(24px, 2.2vw, 30px);
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                }
                .xb-about-vision-heading {
                    color: #FFFFFF !important;
                    line-height: 1.2 !important;
                }
                .xb-about-hero {
                    background: linear-gradient(135deg, #f8fbff 0%, #ffffff 55%, #eef7fd 100%);
                    border-bottom: 1px solid #eef2f6;
                }
                .xb-about-tagline {
                    display: inline-block;
                    color: #43ACE9;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }
                .xb-about-lead {
                    color: #353945;
                    font-size: 15.5px;
                    line-height: 1.65;
                }
                .xb-about-media-card {
                    background: #ffffff;
                    border: 1px solid #e6edf5;
                    border-radius: 22px;
                    padding: 10px;
                    box-shadow: 0 16px 40px rgba(35, 38, 47, 0.06);
                    width: 100%;
                    display: flex;
                }
                .xb-about-media-inner {
                    position: relative;
                    width: 100%;
                    border-radius: 16px;
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                }
                .xb-about-media-inner img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                @media (min-width: 992px) {
                    .xb-about-media-card.xb-about-stretch {
                        flex: 1 1 auto;
                        height: 100%;
                    }
                    .xb-about-media-card.xb-about-stretch .xb-about-media-inner {
                        aspect-ratio: auto;
                        min-height: 260px;
                        height: 100%;
                    }
                    .xb-about-media-card.xb-about-stretch .xb-about-media-inner img {
                        position: absolute;
                        inset: 0;
                    }
                }
                .xb-about-category-card {
                    background: #ffffff;
                    border: 1px solid #eceff4;
                    border-radius: 18px;
                    padding: 22px;
                    height: 100%;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                    box-shadow: 0 8px 24px rgba(35, 38, 47, 0.04);
                }
                .xb-about-category-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(67, 172, 233, 0.45);
                    box-shadow: 0 16px 36px rgba(35, 38, 47, 0.08);
                }
                .xb-about-icon-badge {
                    width: 46px;
                    height: 46px;
                    border-radius: 12px;
                    background: rgba(67, 172, 233, 0.12);
                    color: #43ACE9;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .xb-about-diff-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    background: #f9fafb;
                    border: 1px solid #edf0f5;
                    border-radius: 16px;
                    padding: 14px 18px;
                    transition: border-color 0.2s ease, background-color 0.2s ease;
                }
                .xb-about-diff-item:hover {
                    background: #ffffff;
                    border-color: rgba(67, 172, 233, 0.4);
                }
                .xb-about-diff-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 11px;
                    background: #23262F;
                    color: #ffffff;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .xb-about-vision-card {
                    background: #23262F;
                    border-radius: 28px;
                    position: relative;
                    overflow: hidden;
                }
                .xb-about-cta-card {
                    background: linear-gradient(135deg, #f8fbff 0%, #eef7fd 100%);
                    border: 1px solid rgba(67, 172, 233, 0.28);
                    border-radius: 24px;
                }
                @media (max-width: 767px) {
                    .xb-about-tagline {
                        font-size: 16px;
                    }
                    .xb-about-lead {
                        font-size: 14.5px;
                    }
                    .xb-about-vision-card {
                        border-radius: 22px;
                    }
                }
            `}</style>

            <div className="xb-about-page">
            {/* 1. Hero — About XpertBid */}
            <section className="py-4 py-lg-5 xb-about-hero">
                <div className="container py-lg-2">
                    <div className="row align-items-stretch g-4">
                        <div className="col-lg-7 d-flex flex-column justify-content-center">
                            <h1 className="xb-about-h1 mb-1">
                                {tr('about_page.hero_title', 'About XpertBid')}
                            </h1>
                            <p className="xb-about-tagline mb-3">
                                {tr('about_page.hero_tagline', 'One Platform. Endless Possibilities.')}
                            </p>

                            <div className="d-flex flex-column gap-2">
                                <p className="xb-about-lead mb-0">
                                    {tr(
                                        'about_page.hero_p1',
                                        'XpertBid is a growing digital marketplace in Pakistan, designed to bring buyers, sellers, businesses, and service providers together on one platform.'
                                    )}
                                </p>
                                <p className="xb-about-lead mb-0">
                                    {tr(
                                        'about_page.hero_p2',
                                        'From properties and construction materials to vehicles, wholesale products, business supplies, and professional services, XpertBid makes it easier to discover opportunities, showcase offerings, and connect with the right people.'
                                    )}
                                </p>
                                <p className="xb-about-lead mb-0">
                                    {tr(
                                        'about_page.hero_p3',
                                        "Whether you're a business looking to expand your reach, a property owner looking to sell or rent, or a customer searching for the right product or service, XpertBid brings multiple marketplace solutions together in one place."
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-5 d-flex">
                            <div className="xb-about-media-card xb-about-stretch">
                                <div className="xb-about-media-inner">
                                    <img
                                        src="/assets/images/about_main.png"
                                        alt={tr('about_page.hero_image_alt', 'XpertBid digital marketplace')}
                                        width={713}
                                        height={561}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. More Than a Marketplace */}
            <section className="py-4 py-lg-5" style={{ backgroundColor: '#F9F9F9' }}>
                <div className="container py-lg-2">
                    <div className="text-center mx-auto mb-4" style={{ maxWidth: '720px' }}>
                        <h2 className="xb-about-h2 mb-2">
                            {tr('about_page.marketplace_title', 'More Than a Marketplace')}
                        </h2>
                        <p className="xb-about-lead mb-1">
                            {tr(
                                'about_page.marketplace_subtitle_1',
                                'We believe buying and selling should be simpler, more accessible, and more flexible.'
                            )}
                        </p>
                        <p className="about-last mb-0" style={{ fontSize: '15.5px' }}>
                            {tr(
                                'about_page.marketplace_subtitle_2',
                                "That's why XpertBid brings together multiple marketplace categories and services, including:"
                            )}
                        </p>
                    </div>

                    <div className="row g-3 g-lg-4">
                        {MARKETPLACE_CATEGORIES.map(({ key, title, description, Icon }) => (
                            <div key={key} className="col-12 col-md-6 col-lg-4">
                                <div className="xb-about-category-card">
                                    <div className="xb-about-icon-badge mb-2">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="fw-bold mb-1" style={{ color: '#23262F', fontSize: '18px' }}>
                                        {tr(`about_page.categories.${key}.title`, title)}
                                    </h3>
                                    <p className="about-last mb-0" style={{ fontSize: '14.5px', lineHeight: 1.6 }}>
                                        {tr(`about_page.categories.${key}.text`, description)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. What Makes XpertBid Different? */}
            <section className="py-4 py-lg-5" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="container py-lg-2">
                    <div className="row align-items-stretch g-4">
                        <div className="col-lg-5 d-flex flex-column">
                            <h2 className="xb-about-h2 mb-3">
                                {tr('about_page.different_title', 'What Makes XpertBid Different?')}
                            </h2>
                            <div className="xb-about-media-card xb-about-stretch">
                                <div className="xb-about-media-inner">
                                    <img
                                        src="/assets/images/sky.png"
                                        alt={tr('about_page.different_image_alt', 'What makes XpertBid different')}
                                        width={758}
                                        height={681}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7 d-flex flex-column justify-content-between gap-2">
                            {DIFFERENTIATORS.map(({ key, title, description, Icon }) => (
                                <div key={key} className="xb-about-diff-item">
                                    <div className="xb-about-diff-icon">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 fw-bold" style={{ color: '#23262F', fontSize: '16.5px' }}>
                                            {tr(`about_page.different.${key}.title`, title)}
                                        </h3>
                                        <p className="about-last mb-0" style={{ fontSize: '14px', lineHeight: 1.55 }}>
                                            {tr(`about_page.different.${key}.text`, description)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Our Vision */}
            <section className="py-4 py-lg-5" style={{ backgroundColor: '#F9F9F9' }}>
                <div className="container py-lg-2">
                    <div className="xb-about-vision-card p-4 p-md-5 text-center">
                        <div className="mx-auto" style={{ maxWidth: '800px' }}>
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: 'rgba(67, 172, 233, 0.16)',
                                    color: '#43ACE9',
                                }}
                            >
                                <LuSparkles size={22} />
                            </div>
                            <h2 className="xb-about-h2 xb-about-vision-heading text-white mb-3">
                                {tr('about_page.vision_title', 'Our Vision')}
                            </h2>
                            <p className="mb-2" style={{ color: '#E6E8EC', fontSize: '16.5px', lineHeight: 1.65 }}>
                                {tr(
                                    'about_page.vision_p1',
                                    'Our vision is to build a connected digital marketplace that makes buying, selling, and business discovery easier for everyone.'
                                )}
                            </p>
                            <p className="mb-0" style={{ color: '#B1B5C3', fontSize: '16px', lineHeight: 1.65 }}>
                                {tr(
                                    'about_page.vision_p2',
                                    'We aim to create more opportunities for individuals, entrepreneurs, suppliers, and businesses by bringing different industries together through one accessible platform.'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Be Part of XpertBid */}
            <section className="py-4 py-lg-5" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="container py-lg-2">
                    <div className="xb-about-cta-card p-4 p-md-5 text-center">
                        <div className="mx-auto" style={{ maxWidth: '720px' }}>
                            <h2 className="xb-about-h2 mb-2">
                                {tr('about_page.join_title', 'Be Part of XpertBid')}
                            </h2>
                            <p className="xb-about-lead mb-3">
                                {tr(
                                    'about_page.join_p1',
                                    "Whether you're looking to buy, sell, rent, lease, promote your business, or discover new opportunities, XpertBid gives you a place to get started."
                                )}
                            </p>
                            <p className="fw-bold mb-0" style={{ color: '#43ACE9', fontSize: '22px', letterSpacing: '0.01em' }}>
                                {tr('about_page.join_motto', 'Explore. Connect. Grow.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </AppLayout>
    );
}
