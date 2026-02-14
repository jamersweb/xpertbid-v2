import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AboutUs() {
       return (
              <AppLayout>
                     <Head title="About Us" />

                     <section className="py-5 bg-light about-bg-image about-bg-image-top">
                            <div className=""></div>
                            <div className="container">
                                   <div className="row align-items-center">
                                          {/* Text Column */}
                                          <div className="col-md-6 mb-4 mb-md-0">
                                                 <h2 className="h1 mb-4 text-gray-900">About Us</h2>
                                                 <p className="mb-3 text-secondary">
                                                        Welcome to XpertBid, a newly refined medium to buy, sell, lease, or rent properties
                                                        through a secure, transparent auction platform. Headquartered in the UAE, we connect
                                                        property owners, investors, landlords, and tenants in a competitive environment where
                                                        everyone can decide the value of a deal, not just the market.
                                                 </p>
                                                 <p className="text-secondary">
                                                        But Real Estate is just the beginning. XpertBid also enables users to auction vehicles,
                                                        services, and a wide range of wholesale goods including textiles, pharmaceuticals,
                                                        building materials, and much more — making it a powerful, all-in-one platform for
                                                        business transactions and asset sales.
                                                 </p>
                                          </div>
                                          {/* Image Column */}
                                          <div className="col-md-6 text-md-end">
                                                 <img
                                                        src="/assets/images/about_main.png"
                                                        alt="Team discussion"
                                                        className="img-fluid rounded-3"
                                                 />
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 about-bg-image" style={{ backgroundColor: "#f3f4f6" }}>
                            <div className="container">
                                   <div className="row justify-content-center text-center">
                                          <div className="col-lg-12 py-5">
                                                 {/* Top icon */}
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="95" height="88" viewBox="0 0 95 88" fill="none" className="mx-auto d-block">
                                                        <path d="M80.6235 87.2321H63.0009L43.616 67.8472L52.8679 59.4764L80.6235 87.2321Z" fill="#141416" />
                                                        <path d="M0 24.2312H18.0632L36.1264 42.4216L27.3151 51.9868L0 24.2312Z" fill="#141416" />
                                                        <path d="M74.0144 12.3358L0.439941 87.232H17.622L84.1474 20.266L89.4342 30.399L94.2804 0L63.0002 6.16792L74.0144 12.3358Z" fill="#43ACE9" />
                                                 </svg>
                                                 {/* Heading */}
                                                 <h2 className="h1 fw-bold my-3 text-gray-900">Our Mission</h2>

                                                 {/* Paragraph */}
                                                 <p className="text-secondary mb-0">
                                                        We created XpertBid to break away from outdated Real Estate practices
                                                        that limit flexibility and transparency. Our mission is to put pricing
                                                        power back in the customers’ hands, enabling smarter property decisions
                                                        whether you’re buying, renting, or selling. And by extending this model
                                                        to other assets, from cars to stock lots, we empower businesses and
                                                        individuals to unlock value in new ways.
                                                 </p>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs" style={{ backgroundColor: "#F9F9F9" }}>
                            <div className="container sbs">
                                   {/* Heading */}
                                   <div className="text-center mb-5">
                                          <h2 className=" main-heading-about text-gray-900">What We Do</h2>
                                          <p className="text-secondary about-title">
                                                 XpertBid revolutionizes how real estate is traded by making it:
                                          </p>
                                   </div>

                                   {/* Cards */}
                                   <div className="row g-4">
                                          {/* Transparent */}
                                          <div className="col-md-6 col-lg-4">
                                                 <div className="card border-0  h-100 text-center p-5 about-box">
                                                        <img
                                                               src="/assets/images/message-circle-heart.png"
                                                               alt="Transparent"
                                                               className="mb-3 mx-auto"
                                                               style={{ width: "40px", height: "auto" }}
                                                        />
                                                        <h5 className="about-box-title text-gray-900">Transparent</h5>
                                                        <p className="text-secondary mb-0">
                                                               Auctions let the market decide the price, not closed-door negotiations.
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* Flexible */}
                                          <div className="col-md-6 col-lg-4">
                                                 <div className="card border-0  h-100 text-center p-5 about-box">
                                                        <img
                                                               src="/assets/images/send-to-back.png"
                                                               alt="Flexible"
                                                               className="mb-3 mx-auto"
                                                               style={{ width: "40px", height: "auto" }}
                                                        />
                                                        <h5 className="about-box-title text-gray-900">Flexible</h5>
                                                        <p className="text-secondary mb-0">
                                                               Owners can sell or lease, while renters and buyers bid based on what they’re willing to pay.
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* Accessible */}
                                          <div className="col-md-6 col-lg-4 mx-auto mx-lg-0">
                                                 <div className="card border-0 h-100 text-center p-5 about-box">
                                                        <img
                                                               src="/assets/images/scan-face.png"
                                                               alt="Accessible"
                                                               className="mb-3 mx-auto"
                                                               style={{ width: "40px", height: "auto" }}
                                                        />
                                                        <h5 className="about-box-title text-gray-900">Accessible</h5>
                                                        <p className="text-secondary mb-0">
                                                               Whether you’re a landlord, developer, or first-time renter, our platform is open to everyone.
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs" style={{ backgroundColor: "#23262F" }}>
                            <div className="container sbs">
                                   {/* Heading */}
                                   <div className="text-center mb-5">
                                          <h2 className=" main-heading-about-uniqe" style={{ color: "#ffff" }}>Beyond property, XpertBid also hosts auctions for</h2>

                                   </div>

                                   {/* Cards */}
                                   <div className="row g-4">
                                          {/* Transparent */}
                                          <div className="col-md-6 col-lg-4">
                                                 <div className="card border-0  h-100 text-center p-5 about-box">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none" className="mx-auto">
                                                               <path d="M38.5 14.6667L34.8333 18.3334M34.8333 18.3334L32.0833 11.5501C31.824 10.8559 31.3604 10.2565 30.7536 9.83105C30.1468 9.40559 29.4254 9.17398 28.6843 9.16674H15.4C14.6529 9.14958 13.9184 9.3611 13.2949 9.77296C12.6714 10.1848 12.1886 10.7774 11.9112 11.4712L9.16667 18.3334M34.8333 18.3334H9.16667M34.8333 18.3334C36.8584 18.3334 38.5 19.975 38.5 22.0001V29.3334C38.5 31.3584 36.8584 33.0001 34.8333 33.0001M9.16667 18.3334L5.5 14.6667M9.16667 18.3334C7.14162 18.3334 5.5 19.975 5.5 22.0001V29.3334C5.5 31.3584 7.14162 33.0001 9.16667 33.0001M12.8333 25.6667H12.8517M31.1667 25.6667H31.185M34.8333 33.0001H9.16667M34.8333 33.0001V36.6667M9.16667 33.0001V36.6667" stroke="#43ACE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h5 className="about-box-title text-gray-900">Vehicles</h5>
                                                        <p className="text-secondary mb-0">
                                                               From commercial fleets to personal cars.
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* Flexible */}
                                          <div className="col-md-6 col-lg-4">
                                                 <div className="card border-0  h-100 text-center p-5 about-box">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none" className="mx-auto">
                                                               <path d="M31.1665 33.0001H32.9998M21.9998 33.0001H23.8332M12.8332 33.0001H14.6665M3.6665 36.6667C3.6665 37.6392 4.05281 38.5718 4.74045 39.2595C5.42808 39.9471 6.36071 40.3334 7.33317 40.3334H36.6665C37.639 40.3334 38.5716 39.9471 39.2592 39.2595C39.9469 38.5718 40.3332 37.6392 40.3332 36.6667V14.6667L27.4998 23.8334V14.6667L14.6665 23.8334V7.33341C14.6665 6.36095 14.2802 5.42832 13.5926 4.74069C12.9049 4.05306 11.9723 3.66675 10.9998 3.66675H7.33317C6.36071 3.66675 5.42808 4.05306 4.74045 4.74069C4.05281 5.42832 3.6665 6.36095 3.6665 7.33341V36.6667Z" stroke="#43ACE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h5 className="about-box-title text-gray-900">Wholesale Stock</h5>
                                                        <p className="text-secondary mb-0">
                                                               Excess, seasonal, or liquidation inventory across multiple industries.
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* Accessible */}
                                          <div className="col-md-6 col-lg-4 mx-auto mx-lg-0">
                                                 <div className="card border-0 h-100 text-center p-5 about-box">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none" className="mx-auto">
                                                               <path d="M21.9998 36.6667C25.8897 36.6667 29.6202 35.1215 32.3707 32.371C35.1213 29.6204 36.6665 25.8899 36.6665 22.0001C36.6665 18.1102 35.1213 14.3797 32.3707 11.6292C29.6202 8.87865 25.8897 7.33341 21.9998 7.33341M21.9998 36.6667C18.11 36.6667 14.3795 35.1215 11.6289 32.371C8.8784 29.6204 7.33317 25.8899 7.33317 22.0001M21.9998 36.6667V40.3334M21.9998 7.33341C18.11 7.33341 14.3795 8.87865 11.6289 11.6292C8.8784 14.3797 7.33317 18.1102 7.33317 22.0001M21.9998 7.33341V3.66675M7.33317 22.0001H3.6665M25.6665 22.0001C25.6665 22.9725 25.2802 23.9052 24.5926 24.5928C23.9049 25.2804 22.9723 25.6667 21.9998 25.6667C21.0274 25.6667 20.0947 25.2804 19.4071 24.5928C18.7195 23.9052 18.3332 22.9725 18.3332 22.0001C18.3332 21.0276 18.7195 20.095 19.4071 19.4074C20.0947 18.7197 21.0274 18.3334 21.9998 18.3334C22.9723 18.3334 23.9049 18.7197 24.5926 19.4074C25.2802 20.095 25.6665 21.0276 25.6665 22.0001ZM25.6665 22.0001H40.3332M31.1665 37.8767L29.3332 34.7051M20.1665 18.8284L12.8332 6.12341M37.8765 31.1667L34.7048 29.3334M6.12317 12.8334L9.29484 14.6667M37.8765 12.8334L34.7048 14.6667M6.12317 31.1667L9.29484 29.3334M31.1665 6.12341L29.3332 9.29508M20.1665 25.1717L12.8332 37.8767" stroke="#43ACE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h5 className="about-box-title text-gray-900">Professional Services</h5>
                                                        <p className="text-secondary mb-0">
                                                               Auction service contracts or project based work.
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs " style={{ backgroundColor: "#ffff" }}>
                            <div className="container  py-4">
                                   {/* Section Title */}
                                   <h2 className="text-center  main-heading-about mb-5 text-gray-900">Why Choose XpertBid?</h2>

                                   <div className="row align-items-center">
                                          {/* Text Column */}
                                          <div className="col-md-6">
                                                 <div className="mb-4">
                                                        <h5 className="asksub text-gray-900">1. A New Way to Trade Property</h5>
                                                        <p className="text-secondary mb-0">
                                                               We’re building the first auction platform in the region where you can rent
                                                               or buy property at your given price. Our tools give you real-time market
                                                               feedback and unmatched flexibility, whether you’re leasing an apartment
                                                               or selling commercial real estate.
                                                        </p>
                                                 </div>
                                                 <div className="mb-4">
                                                        <h5 className="asksub text-gray-900">2. Cross-Category Power</h5>
                                                        <p className="text-secondary mb-0">
                                                               Real estate may be our focus, but XpertBid brings auction power to everything,
                                                               enabling businesses to move goods, assets, and services quickly and efficiently,
                                                               all under one roof.
                                                        </p>
                                                 </div>
                                                 <div className="mb-4">
                                                        <h5 className="asksub text-gray-900">3. Security and Trust Built In</h5>
                                                        <p className="text-secondary mb-0">
                                                               With escrow-backed payments, verified users, and secure bidding, we’ve built
                                                               trust into every transaction, giving peace of mind to landlords, tenants,
                                                               buyers, and sellers alike.
                                                        </p>
                                                 </div>
                                          </div>

                                          {/* Image Column */}
                                          <div className="col-md-6 text-md-end">
                                                 <img
                                                        src="/assets/images/sky.png"
                                                        alt="Skyscraper background"
                                                        className="img-fluid rounded-3"
                                                 />
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs about-bg-image" style={{ backgroundColor: "#23262F" }}>
                            <div className="container sbs py-5">
                                   <div className="row justify-content-center text-center">
                                          <div className="col-lg-12">
                                                 {/* Heading */}
                                                 <h2 className="h1 fw-bold my-3" style={{ color: "#ffffff" }}>Our Story</h2>

                                                 {/* Paragraph */}
                                                 <p className=" mb-0" style={{ color: "#ffffff" }}>
                                                        XpertBid was founded with a vision: to make business-to-business transactions more efficient and to minimize the waste of valuable goods. Born from an understanding of the challenges faced by companies with unsold inventory, we wanted to create a platform that bridges the gap between buyers and sellers in a way that’s simple, transparent, and effective.
                                                 </p>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs" style={{ backgroundColor: "#F9F9F9" }}>
                            <div className="container ">
                                   {/* Title + Subtitle */}
                                   <div className="text-center mb-5">
                                          <h2 className=" main-heading-about text-gray-900">How it Works</h2>
                                          <p className="text-secondary mb-0">
                                                 Our auction system is designed to keep things fair, fast, and easy.
                                          </p>
                                   </div>

                                   {/* Four Feature Cards */}
                                   <div className="row g-4">
                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Escrow Services</h5>
                                                        <p className="text-secondary mb-0">
                                                               Funds are held safely until all parties fulfill their terms.
                                                        </p>
                                                 </div>
                                          </div>

                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Verified Sellers and Landlords</h5>
                                                        <p className="text-secondary mb-0">
                                                               Only verified users can list properties or goods.
                                                        </p>
                                                 </div>
                                          </div>

                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Flexible Auctions</h5>
                                                        <p className="text-secondary mb-0">
                                                               Set your starting bid and let the market respond. Perfect for rentals,
                                                               distressed sales, or fast turnarounds.
                                                        </p>
                                                 </div>
                                          </div>

                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Full Transparency</h5>
                                                        <p className="text-secondary mb-0">
                                                               No hidden fees, no backdoor deals, everything happens with complete
                                                               transparency.
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 sbs about-bg-image" style={{ backgroundColor: "#F9F9F9" }}>
                            <div className="container  py-5">
                                   <div className="row justify-content-center text-center">
                                          <div className="col-lg-12 p-5" style={{ backgroundColor: "#23262F", borderRadius: "40px" }}>
                                                 {/* Heading */}
                                                 <h2 className="h1 fw-bold my-3" style={{ color: "#ffffff" }}>Our Vision</h2>

                                                 {/* Paragraph */}
                                                 <p className=" my-4" style={{ color: "#ffffff" }}>
                                                        XpertBid is redefining the property market. Our goal is to become the go-to platform for real estate auctions across the Middle East, South Asia, and beyond, creating a global marketplace where fair value and smart decisions drive every deal.
                                                 </p>
                                                 <p className=" my-4" style={{ color: "#ffffff" }}>
                                                        And as we grow, we will continue expanding our auction model to empower businesses in automotive, wholesale, and services with the same speed and transparency.
                                                 </p>
                                          </div>
                                   </div>
                            </div>
                     </section>

                     <section className="py-5 " style={{ backgroundColor: "#F9F9F9" }}>
                            <div className="container">
                                   {/* Four Feature Cards */}
                                   <div className="row g-4">
                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Join the Movement</h5>
                                                        <p className="about-last mb-0">
                                                               Whether you are a landlord looking to rent out a unit, a business with commercial property to sell, or a buyer ready to name your price XpertBid is your gateway to smarter real estate transactions. Transparent. Efficient. Empowering.
                                                        </p>
                                                 </div>
                                          </div>

                                          <div className="col-md-6">
                                                 <div className="card border-0 shadow-sm h-100 p-4 about-box">
                                                        <h5 className="asksub text-gray-900">Join Us</h5>
                                                        <p className="about-last mb-0">
                                                               XpertBid is more than a marketplace—it’s a movement toward smarter, more sustainable business practices. Whether you are looking to buy, sell, or simply explore, we invite you to join us and see how XpertBid can transform the way you do business. Ready to take control of your deals? Reach us at xpertbidofficial@gmail.com
                                                        </p>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </section>
              </AppLayout>
       );
}
