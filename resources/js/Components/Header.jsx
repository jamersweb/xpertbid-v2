import '../../css/header.css';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import axios from 'axios';
import CartPopup from '@/Components/CartPopup';
import DesktopCategoriesDropdown from '@/Components/DesktopCategoriesDropdown';
import RequestNavDropdown from '@/Components/RequestNavDropdown';
import { useAuthModal } from '@/Contexts/AuthModalContext';
import useTranslate from '@/hooks/useTranslate';

const CategoriesDropdown = lazy(() => import('@/Components/CategoriesDropdown'));
const NotificationDropdown = lazy(() => import('@/Components/NotificationDropdown'));
const ChatHeaderIcon = lazy(() => import('@/Components/ChatHeaderIcon'));
const Search = lazy(() => import('@/Components/Search'));


export default function Header() {
       const { auth, locale } = usePage().props;
       const { url } = usePage();
       const user = auth?.user;
       const { openLogin, openRegister } = useAuthModal();
       const { t } = useTranslate();
       const currentLocale = locale?.current || 'en';
       const currentDirection = locale?.supported?.[currentLocale]?.direction || (currentLocale === 'ur' ? 'rtl' : 'ltr');
       const isRtl = currentDirection === 'rtl';
       const profileImageSrc = (() => {
              const src = user?.profile_pic;
              if (!src) return "/assets/images/user.jpg";
              if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
                     return src;
              }
              return `/${src.replace(/^\/+/, '')}`;
       })();

       const userProfileRefDesktop = useRef(null);
       const userProfileRefMobile = useRef(null);
       const mobileMenuRef = useRef(null);

       const [isUserSettingsOpenDesktop, setUserSettingsOpenDesktop] = useState(false);
       const [isUserSettingsOpenMobile, setUserSettingsOpenMobile] = useState(false);
       const [isSearchOpen, setSearchOpen] = useState(false);
       const [isMenuOpen, setIsMenuOpen] = useState(false);
       const [isHydrated, setIsHydrated] = useState(false);

       useEffect(() => {
              setIsHydrated(true);
       }, []);
       const profileMenuItemStyle = {
              width: '100%',
              color: '#24282B',
              fontFamily: '"Inter", sans-serif',
              direction: isRtl ? 'rtl' : 'ltr',
              flexDirection: 'row',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
              textAlign: isRtl ? 'right' : 'left',
       };
       const profileMenuButtonStyle = {
              ...profileMenuItemStyle,
              color: '#E94343',
       };
       const renderProfileMenuContent = (label, icon) => (
              isRtl ? (
                     <>
                            <span>{label}</span>
                            {icon}
                     </>
              ) : (
                     <>
                            {icon}
                            <span>{label}</span>
                     </>
              )
       );

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

       const handlePostRequestClick = (e) => {
              closeMobileMenu();
              if (!user) {
                     e.preventDefault();
                     openLogin();
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
                     {isSearchOpen && (
                            <Suspense fallback={null}>
                                   <Search
                                          isOpen={isSearchOpen}
                                          onClose={() => setSearchOpen(false)}
                                   />
                            </Suspense>
                     )}

                     <header className="bg-white " style={{ zIndex: 1050 }}>
                            <nav className="navbar navbar-expand-lg navbar-light bg-white py-2" id="mainNavbar">
                                   <div className="container-fluid px-lg-5 header-navbar-row">
                                          <Link className="navbar-brand d-flex align-items-center me-0 me-lg-4" href="/">
                                                 <img
                                                        src="/assets/images/header-logo.png"
                                                        alt="XpertBid Logo"
                                                        width={180}
                                                        height={40}
                                                        className="logo-image"
                                                 />
                                          </Link>

                                          {/* Mobile Actions: Always visible on mobile, hidden on desktop */}
                                          <div className="mobile-header-actions d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
                                                 <button
                                                        type="button"
                                                        className="btn btn-link p-0 text-muted"
                                                        onClick={() => setSearchOpen(true)}
                                                        aria-label={t('Search')}
                                                 >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
                                                               <path d="M9.58317 17.4998C13.9554 17.4998 17.4998 13.9554 17.4998 9.58317C17.4998 5.21092 13.9554 1.6665 9.58317 1.6665C5.21092 1.6665 1.6665 5.21092 1.6665 9.58317C1.6665 13.9554 5.21092 17.4998 9.58317 17.4998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                               <path d="M18.3332 18.3332L16.6665 16.6665" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                 </button>
                                                 <CartPopup />
                                                 {user && isHydrated && (
                                                        <Suspense fallback={null}>
                                                               <NotificationDropdown />
                                                        </Suspense>
                                                 )}
                                                 {!user && (
                                                        <div className="mobile-auth-buttons d-flex align-items-center gap-2">
                                                               <button
                                                                      type="button"
                                                                      className="mobile-auth-btn mobile-auth-login"
                                                                      onClick={openLogin}
                                                               >
                                                                      {t('Login')}
                                                               </button>
                                                               <button
                                                                      type="button"
                                                                      className="mobile-auth-btn mobile-auth-signup"
                                                                      onClick={openRegister}
                                                               >
                                                                      {t('Sign Up')}
                                                               </button>
                                                        </div>
                                                 )}
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

                                          <div ref={mobileMenuRef} className={`navbar-collapse xpert-mobile-menu mt-2 ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                                                 <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
                                                        <li className="nav-item dropdown">
                                                               <div className="d-none d-lg-block">
                                                                      <DesktopCategoriesDropdown />
                                                               </div>
                                                               <div className="d-block d-lg-none">
                                                                      {isMenuOpen && (
                                                                             <Suspense fallback={null}>
                                                                                    <CategoriesDropdown />
                                                                             </Suspense>
                                                                      )}
                                                               </div>
                                                        </li>
                                                        <RequestNavDropdown
                                                               isRtl={isRtl}
                                                               currentUrl={url}
                                                               onPostRequestClick={handlePostRequestClick}
                                                               onNavigate={closeMobileMenu}
                                                        />
                                                        <li className="nav-item">
                                                               <Link href={route('malls.index')} className="nav-link" onClick={closeMobileMenu}>{t('Malls')}</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('auctions.one_rupee')} className="nav-link" onClick={closeMobileMenu}>{t('1 Rupee Auctions')}</Link>
                                                        </li>
                                                 </ul>

                                                 <div className="d-flex align-items-center mt-3 mt-lg-0 header-account-cluster">
                                                       <div className="d-none d-lg-flex align-items-center header-desktop-actions">
                                                               <div className="header-action-search">
                                                                      <button
                                                                             type="button"
                                                                             className="header-search-icon-btn"
                                                                             onClick={() => setSearchOpen(true)}
                                                                             aria-label={t('Search')}
                                                                      >
                                                                             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                                    <circle cx="11" cy="11" r="8" />
                                                                                    <path d="M21 21l-4.35-4.35" />
                                                                             </svg>
                                                                      </button>
                                                               </div>
                                                               <div className="header-action-cart">
                                                                      <CartPopup />
                                                               </div>
                                                               {user && isHydrated && (
                                                                      <Suspense fallback={null}>
                                                                             <div className="header-action-chat">
                                                                                    <ChatHeaderIcon />
                                                                             </div>
                                                                             <div className="header-action-notification">
                                                                                    <NotificationDropdown />
                                                                             </div>
                                                                      </Suspense>
                                                               )}
                                                        </div>

                                                        {!user ? (
                                                               <div className="registration-btns d-flex align-items-center">
                                                                      <button className="login me-4" onClick={openLogin}>{t('Login')}</button>
                                                                      <button className="signup me-2" onClick={openRegister}>{t('Sign Up')}</button>
                                                                      <button
                                                                             className="sellnow mx-3 px-3 d-none d-lg-inline-flex"
                                                                             onClick={handleSellClick}
                                                                      >
                                                                             {t('Sell Now')}
                                                                      </button>
                                                               </div>
                                                        ) : (
                                                               <div className="d-flex align-items-center header-user-actions">
                                                                      <div className="user-profile-setting-container d-none d-lg-block" ref={userProfileRefDesktop}>
                                                                             <button
                                                                                    type="button"
                                                                                    className="user-profile-setting btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                                                                                    id="header-profile-dropdown"
                                                                                    aria-label="Account menu"
                                                                                    onClick={toggleUserSettingPopupDesktop}
                                                                             >
                                                                                    <img
                                                                                           src={profileImageSrc}
                                                                                           alt="Profile"
                                                                                           className="header-avatar-img rounded-circle"
                                                                                           width="36"
                                                                                           height="36"
                                                                                           referrerPolicy="no-referrer"
                                                                                           onError={(e) => {
                                                                                                  e.currentTarget.onerror = null;
                                                                                                  e.currentTarget.src = "/assets/images/user.jpg";
                                                                                           }}
                                                                                    />
                                                                                    <i className="fa-solid fa-chevron-down small text-muted"></i>
                                                                             </button>

                                                                             {isUserSettingsOpenDesktop && (
                                                                                    <div id="userProfileSettingPopup" className="user-profile-setting-popup show" style={{ position: 'absolute', right: isRtl ? 'auto' : 0, left: isRtl ? 0 : 'auto', top: '100%' }}>
                                                                                           <div className="user-profile-setting-content" style={{ padding: isRtl ? '18px 12px 18px 18px' : '18px 18px 18px 12px', textAlign: isRtl ? 'right' : 'left' }}>
                                                                                                  <ul className="user-setting-menu" style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 0, width: '100%' }}>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('profile.edit')}>
                                                                                                                       {renderProfileMenuContent(t('Account Settings'), <img src="/assets/images/profile-setting.svg" alt="Settings" width={20} height={20} />)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('chat.index')}>
                                                                                                                       {renderProfileMenuContent(t('Messages'), <i className="fa-solid fa-comment-dots text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('favorites.index')}>
                                                                                                                       {renderProfileMenuContent(t('My Favorites'), <img src="/assets/images/setting-heart.svg" alt="Favorites" width={20} height={20} />)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('auctions.mylistings')}>
                                                                                                                       {renderProfileMenuContent(t('My Listings'), <img src="/assets/images/mainListing.svg" alt="Listings" width={20} height={20} />)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('buyer-requests.index')}>
                                                                                                                       {renderProfileMenuContent(t('Buyer Requests'), <i className="fa-solid fa-clipboard-list text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('seller.buyer-requests.browse')}>
                                                                                                                       {renderProfileMenuContent(t('Request Leads'), <i className="fa-solid fa-handshake text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('bids.index')}>
                                                                                                                       {renderProfileMenuContent(t('My Bids'), <img src="/assets/images/myBids.svg" alt="Bids" width={20} height={20} />)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('orders.index')}>
                                                                                                                       {renderProfileMenuContent(t('My Orders'), <i className="fa-solid fa-box-open text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('payment_requests.index')}>
                                                                                                                       {renderProfileMenuContent(t('Payment Request'), <i className="fa-solid fa-money-check text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ borderBottom: '1px solid #EDEDED', padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                                                <Link className="d-flex align-items-center gap-2 text-decoration-none" style={profileMenuItemStyle} href={route('verification.identity')}>
                                                                                                                       {renderProfileMenuContent(t('Verification'), <i className="fa-solid fa-id-card text-center" style={{ width: '20px', fontSize: '18px' }}></i>)}
                                                                                                                </Link>
                                                                                                         </li>
                                                                                                         <li style={{ padding: '0px 0', fontSize: '16px', fontWeight: '400', lineHeight: '20px', display: 'flex', alignItems: 'center', gap: '15px', marginTop: '14px' }}>
                                                                                                                <button className="transparent-button d-flex align-items-center gap-2 border-0 bg-transparent p-0" style={profileMenuButtonStyle} onClick={handleLogout}>
                                                                                                                       {renderProfileMenuContent(t('Log Out'), <img src="/assets/images/logout.svg" alt="Logout" width={20} height={20} />)}
                                                                                                                </button>
                                                                                                         </li>
                                                                                                  </ul>
                                                                                           </div>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                     <button
                                                                             className="sellnow header-sell-btn px-3 d-none d-lg-inline-flex"
                                                                             onClick={handleSellClick}
                                                                      >
                                                                             {t('Sell Now')}
                                                                      </button>
                                                               </div>
                                                        )}
                                                 </div>
                                          </div>
                                   </div>
                            </nav>
                     </header>
              </>
       );
}
