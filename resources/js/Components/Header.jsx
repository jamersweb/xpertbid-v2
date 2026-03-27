import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CartPopup from '@/Components/CartPopup';
import DesktopCategoriesDropdown from '@/Components/DesktopCategoriesDropdown';
import CategoriesDropdown from '@/Components/CategoriesDropdown';
import CurrencyPicker from '@/Components/CurrencyPicker';
import NotificationDropdown from '@/Components/NotificationDropdown';
import Search from '@/Components/Search';
import { useAuthModal } from '@/Contexts/AuthModalContext';


export default function Header() {
       const { auth } = usePage().props;
       const { url } = usePage();
       const user = auth?.user;
       const { openLogin, openRegister } = useAuthModal();

       const userProfileRefDesktop = useRef(null);
       const userProfileRefMobile = useRef(null);
       const mobileMenuRef = useRef(null);

       const [isUserSettingsOpenDesktop, setUserSettingsOpenDesktop] = useState(false);
       const [isUserSettingsOpenMobile, setUserSettingsOpenMobile] = useState(false);
       const [isSearchOpen, setSearchOpen] = useState(false);
       const [isMenuOpen, setIsMenuOpen] = useState(false);

       const toggleUserSettingPopupDesktop = () => {
              setUserSettingsOpenDesktop(prev => !prev);
       };

       const toggleUserSettingPopupMobile = () => {
              setUserSettingsOpenMobile(prev => !prev);
       };

       const closeMobileMenu = () => {
              setIsMenuOpen(false);
       };

       const handleLogout = () => {
              router.post(route('logout'));
       };

       const handleSellClick = (e) => {
              e.preventDefault();
              if (!user) {
                     openLogin();
              } else {
                     router.visit(route('auctions.create'));
              }
       };

       useEffect(() => {
              const handleClickOutside = (event) => {
                     if (
                            userProfileRefDesktop.current &&
                            !userProfileRefDesktop.current.contains(event.target) &&
                            !event.target.closest("#header-profile-dropdown")
                     ) {
                            setUserSettingsOpenDesktop(false);
                     }
                     if (
                            userProfileRefMobile.current &&
                            !userProfileRefMobile.current.contains(event.target) &&
                            !event.target.closest(".user-profile-setting")
                     ) {
                            setUserSettingsOpenMobile(false);
                     }

                     if (
                            mobileMenuRef.current &&
                            isMenuOpen &&
                            !mobileMenuRef.current.contains(event.target) &&
                            !event.target.closest(".navbar-toggler")
                     ) {
                            setIsMenuOpen(false);
                     }
              };

              document.addEventListener("mousedown", handleClickOutside);
              return () => document.removeEventListener("mousedown", handleClickOutside);
       }, [isMenuOpen]);

       useEffect(() => {
              setIsMenuOpen(false);
       }, [url]);

       return (
              <>
                     <Search
                            isOpen={isSearchOpen}
                            onClose={() => setSearchOpen(false)}
                     />

                     <header className="bg-white " style={{ zIndex: 1050 }}>
                            <nav className="navbar navbar-expand-lg navbar-light bg-white py-2" id="mainNavbar">
                                   <div className="container-fluid px-lg-5 my-3">
                                          <Link className="navbar-brand d-flex align-items-center me-0 me-lg-4" href="/">
                                                 <img
                                                        src="/assets/images/header-logo.png"
                                                        alt="XpertBid Logo"
                                                        width={180}
                                                        height={50}
                                                        className="logo-image"
                                                        style={{ height: 'auto', width: 'auto' }}
                                                 />
                                          </Link>

                                          {/* Mobile Actions: Always visible on mobile, hidden on desktop */}
                                          <div className="mobile-header-actions d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
                                                 <button
                                                        type="button"
                                                        className="btn btn-link p-0 text-muted"
                                                        onClick={() => setSearchOpen(true)}
                                                        aria-label="Search"
                                                 >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
                                                               <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                               <path d="M18.3332 18.3332L16.6665 16.6665" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                 </button>
                                                 <CartPopup />
                                                 {user && <NotificationDropdown />}
                                          </div>

                                          <button
                                                 className="navbar-toggler d-none"
                                                 type="button"
                                                 onClick={() => setIsMenuOpen(prev => !prev)}
                                                 aria-controls="navbarSupportedContent"
                                                 aria-expanded={isMenuOpen}
                                                 aria-label="Toggle navigation"
                                          >
                                                 <span className="navbar-toggler-icon"></span>
                                          </button>

                                          <div ref={mobileMenuRef} className={`navbar-collapse xpert-mobile-menu ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                                                 <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
                                                        {/* Desktop Search Trigger */}
                                                        <li className="nav-item d-none d-lg-block me-3">
                                                               <div
                                                                      className="search-trigger px-3 py-1  bg-light d-flex align-items-center "
                                                                      onClick={() => setSearchOpen(true)}
                                                                      style={{ cursor: 'pointer', minWidth: '200px' }}
                                                               >
                                                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                                                                             <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                             <path d="M18.3332 18.3332L16.6665 16.6665" stroke="#606060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                      </svg>
                                                                      <span className="ms-2 text-muted small">Search auctions</span>
                                                               </div>
                                                        </li>

                                                        <li className="nav-item dropdown">
                                                               <div className="d-none d-lg-block">
                                                                      <DesktopCategoriesDropdown />
                                                               </div>
                                                               <div className="d-block d-lg-none">
                                                                      <CategoriesDropdown />
                                                               </div>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('auctions.one_rupee')} className="nav-link" onClick={closeMobileMenu}>1 Rupee Auction</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('about')} className="nav-link" onClick={closeMobileMenu}>About</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('contact')} className="nav-link" onClick={closeMobileMenu}>Contact Us</Link>
                                                        </li>
                                                 </ul>

                                                 <div className="d-flex align-items-center mt-3 mt-lg-0">
                                                        <div className="d-none d-lg-flex align-items-center mt-2">
                                                               {/* Aligned with xpertbid-frontend: Cart then Currency */}
                                                               <div className="me-3">
                                                                      <CartPopup />
                                                               </div>
                                                               {/* <CurrencyPicker /> */}
                                                               {user && (
                                                                      <div className="ms-3">
                                                                             <NotificationDropdown />
                                                                      </div>
                                                               )}
                                                        </div>

                                                        {!user ? (
                                                               <div className="registration-btns d-flex align-items-center">
                                                                      <button className="login me-4" onClick={openLogin}>Login</button>
                                                                      <button className="signup me-2" onClick={openRegister}>Sign Up</button>
                                                                      <button
                                                                             className="sellnow mx-3 px-3 d-none d-lg-inline-flex"
                                                                             onClick={handleSellClick}
                                                                      >
                                                                             Sell Now
                                                                      </button>
                                                               </div>
                                                        ) : (
                                                               <div className="d-flex align-items-center">
                                                                      <div className="user-profile-setting-container d-none d-lg-block ms-3" ref={userProfileRefDesktop}>
                                                                             <button
                                                                                    className="user-profile-setting btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                                                                    id="header-profile-dropdown"
                                                                                    onClick={toggleUserSettingPopupDesktop}
                                                                             >
                                                                                    <img
                                                                                           src={user.profile_pic || "/assets/images/user.jpg"}
                                                                                           alt="Profile"
                                                                                           className="rounded-circle border"
                                                                                           width="35"
                                                                                           height="35"
                                                                                    />
                                                                                    <i className="fa-solid fa-chevron-down small text-muted"></i>
                                                                             </button>

                                                                             {isUserSettingsOpenDesktop && (
                                                                                    <div id="userProfileSettingPopup" className="user-profile-setting-popup show" style={{ position: 'absolute', right: 0, top: '100%' }}>
                                                                                           <div className="user-profile-setting-content" style={{ padding: '20px' }}>
                                                                                                  <ul className="user-setting-menu" style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 0, width: '100%' }}>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('profile.edit')}>
                                                                                                                       <img src="/assets/images/profile-setting.svg" alt="Settings" width={20} height={20} /> Account Settings
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('chat.index')}>
                                                                                                                       <i className="fa-solid fa-comment-dots text-center" style={{ width: '20px', fontSize: '18px' }}></i> Messages
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('favorites.index')}>
                                                                                                                       <img src="/assets/images/setting-heart.svg" alt="Favorites" width={20} height={20} /> My Favorites
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('auctions.mylistings')}>
                                                                                                                       <img src="/assets/images/mainListing.svg" alt="Listings" width={20} height={20} /> My Listings
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('bids.index')}>
                                                                                                                       <img src="/assets/images/myBids.svg" alt="Bids" width={20} height={20} /> My Bids
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('orders.index')}>
                                                                                                                       <i className="fa-solid fa-box-open text-center" style={{ width: '20px', fontSize: '18px' }}></i> My Orders
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('payment_requests.index')}>
                                                                                                                       <i className="fa-solid fa-money-check text-center" style={{ width: '20px', fontSize: '18px' }}></i> Payment Request
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: '#24282B', fontFamily: '"Inter", sans-serif' }} href={route('verification.identity')}>
                                                                                                                       <i className="fa-solid fa-id-card text-center" style={{ width: '20px', fontSize: '18px' }}></i> Verification
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px', marginTop: '14px' }}>
                                                                                                                <button className="transparent-button d-flex align-items-center gap-2 border-0 bg-transparent p-0" style={{ color: '#E94343', fontFamily: '"Inter", sans-serif' }} onClick={handleLogout}>
                                                                                                                       <img src="/assets/images/logout.svg" alt="Logout" /> Log Out
                                                                                                                </button>
                                                                                                         </li>
                                                                                                  </ul>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                      <button
                                                                             className="sellnow ms-3 px-3 d-none d-lg-inline-flex"
                                                                             onClick={handleSellClick}
                                                                      >
                                                                             Sell Now
                                                                      </button>
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </nav>
                     </header>

                     <style>{`
                        .no-caret::after {
                            display: none !important;
                        }
                        .dropdown-menu {
                            border: none;
                            border-radius: 12px;
                        }
                        .dropdown-item:active {
                            background-color: #0d6efd;
                        }
                        
                        .user-profile-setting-popup {
                            position: absolute;
                            top: 100%;
                            right: 0;
                            background-color: #FAFAFA;
                            box-shadow: 17px 17px 61px 0 #00000023;
                            width: 300px;
                            border-radius: 12px;
                            z-index: 1000;
                            margin-top: 10px;
                            display: none;
                        }
                        .user-profile-setting-popup.show {
                            display: block;
                        }
                        .user-setting-menu li a:hover {
                            opacity: 0.8;
                        }
                        
                        @media (min-width: 992px) {
                            .xpert-mobile-menu {
                                display: flex !important;
                                flex-basis: auto;
                            }
                        }

                        @media (max-width: 991px) {
                            .mobile-header-actions {
                                flex-shrink: 0;
                            }
                            .mobile-user-dropdown {
                                display: inline-flex;
                                align-items: center;
                            }
                            .mobile-user-trigger {
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                            }
                            .mobile-user-avatar {
                                width: 28px;
                                height: 28px;
                                object-fit: cover;
                                border: 1px solid #e5e7eb;
                            }
                            .mobile-user-menu {
                                min-width: 220px;
                                margin-top: 10px;
                            }
                            .xpert-mobile-menu {
                                display: none;
                                width: 100%;
                            }
                            .xpert-mobile-menu.show {
                                display: block;
                            }
                            .navbar-collapse {
                                background: white;
                                padding: 1rem;
                                border-radius: 0 0 12px 12px;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                            }
                            .navbar-nav .dropdown > div {
                                display: inline-flex;
                                align-items: center;
                            }
                            .navbar-nav .nav-link,
                            .navbar-nav .btn.nav-link.dropdown-toggle {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                            }
                        }
            `}</style>
              </>
       );
}
