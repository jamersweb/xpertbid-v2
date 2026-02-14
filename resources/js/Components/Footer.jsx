import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Oval } from "react-loader-spinner";
import axios from 'axios';
import { useState, useEffect } from "react";

export default function Footer() {
       const [cats, setCats] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
              // In Inertia, we might pass categories as props from HandleInertiaRequests middleware
              // But for now, keeping the API call valid or mocking it if route exists
              // The route /api/get-category was ported to web.php as /get-category.
              axios
                     .get("/get-category")
                     .then(res => setCats(res.data.categories || []))
                     .catch(err => {
                            console.error(err);
                            setError("Could not load categories.");
                     })
                     .finally(() => setLoading(false));
       }, []);

       return (
              <footer className="footer">
                     <div className="container-fluid">
                            <div id="qlwapp" className="qlwapp qlwapp-free qlwapp-button qlwapp-bottom-left qlwapp-all qlwapp-rounded qlwapp-js-ready desktop" >
                                   <div className="qlwapp-container" >

                                          <a className="qlwapp-toggle" data-action="open" data-phone="923022113202" data-message="" role="button" tabIndex="0" target="_blank" href="https://wa.me/923022113202" >
                                                 <span className="fa-brands fa-whatsapp gameon"></span>
                                          </a>
                                   </div>
                            </div>          <div className="row ">
                                   <div className="col-xl-4  col-sm-6 footer-child1">
                                          <div className="logo">
                                                 <Link href="/">
                                                        <img
                                                               src="/assets/images/footer-logo.png"
                                                               alt="XpertBid Footer Logo"
                                                               width={200}
                                                               height={60}
                                                               className="quality-90"
                                                        />
                                                 </Link>
                                          </div>
                                          <p>First ever UAE  based auction platform, providing you a one stop shop, auction marketplace/ Platform. From RealEstate, Vehicles, bulk goods and much more, XpertBid powers auctions that deliver value, security, and results one auction at a time.
                                          </p>              <div className="social-icons my-3">
                                                 <a href="https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq" target="_blank"
                                                        rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                                                 <a
                                                        href="https://www.linkedin.com/company/xpertbid/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                 >
                                                        <i className="fa-brands fa-linkedin"></i>
                                                 </a>
                                                 <a href="https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></a>
                                          </div>
                                   </div>
                                   <div className="col-xl-4   col-sm-6 footer-child3">
                                          <div className="footer-menu ps-0 ps-sm-4">
                                                 <p className="foot-menu-heading my-4"> Get To Know Us</p>
                                                 <ul>
                                                        <li><Link href={route('faq')}>FAQ</Link></li>
                                                        <li><Link href={route('blogs.index')}>Blogs</Link></li>
                                                        <li><Link href={route('about')}>About Us</Link></li>
                                                        <li><Link href={route('contact')}> Contact Us</Link></li>

                                                 </ul>
                                          </div>
                                   </div>
                                   <div className="col-xl-4   col-sm-6 footer-child3 mt-0 mt-sm-3">
                                          <div className="footer-menu ps-0 ps-sm-4 mt-0 mt-sm-5">
                                                 <ul>
                                                        <li><Link href={route('refund.policy')}>Refund Policy</Link></li>
                                                        <li><Link href={route('shipping.policy')}>Shipping Policy</Link></li>
                                                        <li><Link href={route('privacy.policy')}>Privacy Policy</Link></li>
                                                        <li><Link href={route('terms')}>Terms & Conditions</Link></li>
                                                 </ul>
                                          </div>
                                   </div>
                                   <div className="col-xl-3 col-sm-6 footer-child3 mt-0 mt-sm-5">
                                          <div className="footer-menu ps-0 ps-sm-4 mt-0 mt-lg-3" >
                                                 {loading && (
                                                        <div className="d-flex justify-content-center">
                                                               <Oval height={30} width={30} ariaLabel="Loading categories" />
                                                        </div>
                                                 )}
                                                 {error && <p className="text-danger">{error}</p>}
                                          </div>
                                   </div>

                            </div>
                     </div>
              </footer>
       );
}
