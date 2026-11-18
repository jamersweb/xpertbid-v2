import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTranslate from '@/hooks/useTranslate';

export default function Footer() {
       const { t } = useTranslate();

       return (
              <footer className="footer content-visibility-auto">
                     <div className="container-fluid">
                            <div id="qlwapp" className="qlwapp qlwapp-free qlwapp-button qlwapp-bottom-left qlwapp-all qlwapp-rounded qlwapp-js-ready desktop" >
                                   <div className="qlwapp-container" >

                                          <a className="qlwapp-toggle" data-action="open" data-phone="923022113202" data-message="" target="_blank" rel="noopener noreferrer" href="https://wa.me/923022113202" aria-label="Contact us on WhatsApp">
                                                 <span className="fa-brands fa-whatsapp gameon" aria-hidden="true"></span>
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
                                          <p>{t('XpertBid is your all-in-one smart marketplace ecosystem, bringing together verified properties, home building, vehicles, commercial goods, and buyer requests. We connect buyers and sellers through a transparent, secure, and seamless experience.')}
                                          </p>              <div className="social-icons my-3">
                                                 <a href="https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq" target="_blank"
                                                        rel="noopener noreferrer" aria-label="Follow XpertBid on Instagram"><i className="fa-brands fa-instagram" aria-hidden="true"></i></a>
                                                 <a
                                                        href="https://www.linkedin.com/company/xpertbid/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="Follow XpertBid on LinkedIn"
                                                 >
                                                        <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                                                 </a>
                                                 <a href="https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Follow XpertBid on Facebook"><i className="fa-brands fa-facebook" aria-hidden="true"></i></a>
                                          </div>
                                   </div>
                                   <div className="col-xl-4   col-sm-6 footer-child3">
                                          <div className="footer-menu ps-0 ps-sm-4">
                                                 <p className="foot-menu-heading my-4"> {t('Get To Know Us')}</p>
                                                 <ul>
                                                        <li><Link href={route('faq')}>{t('FAQ')}</Link></li>
                                                        <li><Link href={route('blogs.index')}>{t('Blogs')}</Link></li>
                                                        <li><Link href={route('about')}>{t('About Us')}</Link></li>
                                                        <li><Link href={route('about.partners')}>{t('About Our Partners')}</Link></li>
                                                        <li><Link href={route('contact')}>{t('Contact Us')}</Link></li>

                                                 </ul>
                                          </div>
                                   </div>
                                   <div className="col-xl-4   col-sm-6 footer-child3 mt-0 mt-sm-3">
                                          <div className="footer-menu ps-0 ps-sm-4 mt-0 mt-sm-5">
                                                 <ul>
                                                        <li><Link href={route('refund.policy')}>{t('Refund Policy')}</Link></li>
                                                        <li><Link href={route('shipping.policy')}>{t('Shipping Policy')}</Link></li>
                                                        <li><Link href={route('seller.policy')}>{t('Seller Policy')}</Link></li>
                                                        <li><Link href={route('privacy.policy')}>{t('Privacy Policy')}</Link></li>
                                                        <li><Link href={route('terms')}>{t('Terms & Conditions')}</Link></li>
                                                 </ul>
                                          </div>
                                   </div>

                            </div>
                     </div>
              </footer>
       );
}
