import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function PartnerImage({ src, alt, backgroundColor, objectFit = 'none' }) {
    return (
        <div
            className="partner-image-container rounded shadow-sm w-100 mx-auto"
            style={{
                height: '300px',
                backgroundColor,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img
                src={src}
                alt={alt}
                className="object-contain"
                style={{
                    width: '100%',
                    height: '100%',
                    objectPosition: 'center',
                    objectFit: objectFit === 'contain' ? 'contain' : 'none',
                }}
            />
        </div>
    );
}

export default function AboutOurPartner() {
    return (
        <AppLayout>
            <Head title="About Our Partners" />
            <section className="py-5 sbs position-relative bg-light our-partner">
                <div className="container">
                    <h2 className="text-center main-heading-about mb-3 text-gray-900">About Our Partners</h2>

                    {/* Row 1: Text Left, Image Right — Craxx */}
                    <div className="row align-items-center py-5 mb-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Established in 2020, Craxx is a fashion brand created for all those who enjoy indulging themselves in the latest lifestyle trends as a mean to express themselves.Craxx has separate product lines in order to cater to all segments and their growing demands, be it men or women. Within each line, a variety of products are offered catering to a range of different styles and preferences, from highly fashionable on trend pieces to more casual, every day attire and basic apparel.
                            </p>
                            <p className="text-secondary">
                                This makes us a customer&rsquo;s one-stop high-street destination for all western wearwardrobe demands. Furthermore, Craxx believes in providing its clients affordable good quality clothing all in one package. A package of excellent quality and service to cater your everyday looks. Craxx denim is designed to grasp your body structure and provide a comfortable fit to enhance your look. Our products promise to deliver at all times.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/craxx.jpg" alt="Craxx" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 2: Image Left, Text Right — Patex */}
                    <div className="row align-items-center py-5 mb-5 g-4">
                        <div className="col-md-5 order-md-1 mb-4 mb-md-0">
                            <PartnerImage src="/assets/images/patex.jpg" alt="Patex" backgroundColor="#000" objectFit="contain" />
                        </div>
                        <div className="col-md-6 order-md-2">
                            <p className="mb-4 text-secondary">
                                Pakitex Boards (Pvt) Ltd., a family-owned company in Pakistan, has established itself as a leader in the production of quality engineered wood products.  We take pride in our &apos;PATEX&apos; brand, which has gained widespread recognition for its premium Chipboard.
                            </p>
                            <p className="text-secondary">
                                Patex Studios is a melamine tableware brand offering stylish and high-quality products. Our Melamine Dinner ware feature a double-glazed finish, ensuring a scratch-resistant and elegant look for any occasion.
                            </p>
                        </div>
                    </div>

                    {/* Row 3: Text Left, Image Right — Nobel */}
                    <div className="row align-items-center py-5 mb-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                NOBLE TEXTILE MILLS Setting Uniform Trends Since 1973 Manufacturer of Uniform Fabric for Schools, Colleges, Restaurants, Hospitals and Corporate. a company of NOBLE GROUP Noble Textile Mills are the pioneers of uniform textile in Pakistan, known for their high quality fabric and fine stitching of garments.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/nobel.png" alt="Nobel" backgroundColor="#FF2701" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 4: DAMAC */}
                    <div className="row align-items-center py-5 mb-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                A well-respected name in luxury real estate, DAMAC Properties builds renowned properties worldwide, especially in Dubai. With iconic communities like DAMAC Hills and DAMAC Lagoons, DAMAC Properties is transforming modern living through world-class design, quality, and innovation.
                                In collaboration with DAMAC, XpertBid is bringing international real estate to your doorstep direct from Dubai and offering buyers and investors in Pakistan direct access to premium properties. We break down barriers to global investment, making it simple through our trusted platform secure to transact, monitor and manage property investment.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/Damac_Logo.png" alt="Damac" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 5: Arif Habib */}
                    <div className="row align-items-center py-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Arif Habib Group is one of Pakistan&apos;s most recognizable business conglomerates with strong interests in financial services, real estate, energy, cement, and infrastructure. While known for stability and long-term thinking, the group has a long history of being a pillar of Pakistan&apos;s economic progress.
                                Our collaboration with Arif Habib Group enables XpertBid to provide investors with opportunities that have the trust and credibility of a name that has shaped Pakistan&apos;s development for decades. Together, we are making responsible investment options more attainable and impactful than ever.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/Arif_Habib_logo.jpeg" alt="Arif Habib" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 6: Samana */}
                    <div className="row align-items-center py-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Samana Developers is one of Dubai&apos;s most trusted and innovative real estate developers, recognized for delivering luxurious yet affordable properties with exceptional quality and timely delivery. Known for their customer-centric approach and unique architectural designs, Samana Developers have set new benchmarks in the UAE property market.

                                Our collaboration with Samana Developers enables XpertBid to offer investors exclusive access to premium international real estate opportunities backed by a developer known for excellence, transparency, and reliability. Together, we are redefining global real estate investment by making it more accessible, secure, and rewarding.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/samana.jpg" alt="Samana Developers" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 7: Danube */}
                    <div className="row align-items-center py-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Danube Properties is one of the most respected and fast-growing real estate developers in the UAE, renowned for delivering high-quality homes that combine luxury, innovation, and affordability. With a strong reputation for on-time delivery and customer satisfaction, Danube has become a trusted name among investors and homeowners alike.

                                Our collaboration with Danube Properties allows XpertBid to bring investors exclusive access to premium real estate projects backed by a developer known for its integrity, excellence, and commitment to value. Together, we are making world-class real estate investment opportunities more reliable, attainable, and rewarding.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/danube.png" alt="Danube Properties" backgroundColor="#000" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 8: Greens */}
                    <div className="row align-items-center py-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Greens Real Estate is a trusted name in the property market, known for its commitment to delivering quality, value, and exceptional client experiences. With a focus on transparency, professionalism, and customer satisfaction, Greens Real Estate has built a strong reputation for connecting investors and homeowners with the right opportunities.

                                Our collaboration with Greens Real Estate enables XpertBid to provide clients with access to reliable and high-potential real estate investments backed by a partner that values integrity and long-term success. Together, we are creating a more transparent, accessible, and rewarding property investment experience.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/greens.png" alt="Greens Real Estate" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>

                    {/* Row 9: Cloud */}
                    <div className="row align-items-center py-5 g-4">
                        <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                            <p className="mb-4 text-secondary">
                                Cloud Real Estate is an emerging leader in the property industry, recognized for its modern approach, innovative marketing strategies, and commitment to delivering exceptional real estate solutions. With a strong focus on trust, transparency, and client satisfaction, Cloud Real Estate continues to build a reputation for connecting investors with high-value property opportunities.

                                Our collaboration with Cloud Real Estate allows XpertBid to offer investors reliable and forward-thinking real estate investment options backed by a partner known for professionalism and innovation. Together, we are shaping a smarter, more connected, and rewarding real estate future.
                            </p>
                        </div>
                        <div className="col-md-5 order-md-1 text-center">
                            <PartnerImage src="/assets/images/cloud.png" alt="Cloud Real Estate" backgroundColor="#fff" objectFit="none" />
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
