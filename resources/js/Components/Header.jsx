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
       const user = auth?.user;
       const { openLogin, openRegister } = useAuthModal();

       const userProfileRefDesktop = useRef(null);
       const userProfileRefMobile = useRef(null);

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
              };

              document.addEventListener("mousedown", handleClickOutside);
              return () => document.removeEventListener("mousedown", handleClickOutside);
       }, []);

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
                                                 {user && (
                                                        <div className="dropdown ms-1">
                                                               <button
                                                                      className="btn btn-link p-0 text-decoration-none dropdown-toggle no-caret"
                                                                      onClick={toggleUserSettingPopupMobile}
                                                               >
                                                                      <img
                                                                             src={user.profile_pic || "/assets/images/user.jpg"}
                                                                             alt="User"
                                                                             className="rounded-circle"
                                                                             width="30"
                                                                             height="30"
                                                                      />
                                                               </button>
                                                               {isUserSettingsOpenMobile && (
                                                                      <div className="dropdown-menu dropdown-menu-end show shadow" style={{ position: 'absolute', right: 0 }}>
                                                                             <Link className="dropdown-item" href={route('dashboard')}>Dashboard</Link>
                                                                             <Link className="dropdown-item" href={route('profile.edit')}>Settings</Link>
                                                                             <Link className="dropdown-item" href={route('favorites.index')}>Favorites</Link>
                                                                             <div className="dropdown-divider"></div>
                                                                             <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                                                      </div>
                                                               )}
                                                        </div>
                                                 )}
                                          </div>

                                          <button
                                                 className="navbar-toggler"
                                                 type="button"
                                                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                 aria-controls="navbarSupportedContent"
                                                 aria-expanded={isMenuOpen}
                                                 aria-label="Toggle navigation"
                                          >
                                                 <span className="navbar-toggler-icon"></span>
                                          </button>

                                          <div className={` navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
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
                                                               <Link href={route('auctions.one_rupee')} className="nav-link">1 Rupee Auction</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('about')} className="nav-link">About</Link>
                                                        </li>
                                                        <li className="nav-item">
                                                               <Link href={route('contact')} className="nav-link">Contact Us</Link>
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
                                                                             className="sellnow mx-3 px-3"
                                                                             onClick={handleSellClick}
                                                                      >
                                                                             Sell Now
                                                                      </button>
                                                               </div>
                                                        ) : (
                                                               <div className="d-flex align-items-center">
                                                                      <div className="user-profile-setting-container d-none d-lg-block ms-3" ref={userProfileRefDesktop}>
                                                                             <button
                                                                                    className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
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
                                                                                    <div className="dropdown-menu dropdown-menu-end show shadow border-0 mt-2" style={{ position: 'absolute', right: 0, minWidth: '220px' }}>
                                                                                           <Link className="dropdown-item py-2" href={route('dashboard')}>
                                                                                                  <i className="fa-solid fa-gauge me-2 text-primary"></i> Dashboard
                                                                                           </Link>
                                                                                           <Link className="dropdown-item py-2" href={route('profile.edit')}>
                                                                                                  <i className="fa-solid fa-user-gear me-2 text-primary"></i> Account Settings
                                                                                           </Link>
                                                                                           <Link className="dropdown-item py-2" href={route('favorites.index')}>
                                                                                                  <i className="fa-solid fa-heart me-2 text-primary"></i> My Favorites
                                                                                           </Link>
                                                                                           <Link className="dropdown-item py-2" href={route('auctions.mylistings')}>
                                                                                                  <i className="fa-solid fa-list me-2 text-primary"></i> My Listings
                                                                                           </Link>
                                                                                           <Link className="dropdown-item py-2" href={route('invoices.index')}>
                                                                                                  <i className="fa-solid fa-file-invoice me-2 text-primary"></i> My Invoices
                                                                                           </Link>
                                                                                           <div className="dropdown-divider"></div>
                                                                                           <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                                                                                                  <i className="fa-solid fa-right-from-bracket me-2"></i> Log Out
                                                                                           </button>
                                                                                    </div>
                                                                             )}
                                                                      </div>
                                                                      <button
                                                                             className="sellnow ms-3 px-3"
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
                        
                        @media (max-width: 991px) {
                            .navbar-collapse {
                                background: white;
                                padding: 1rem;
                                border-radius: 0 0 12px 12px;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                            }
                        }
            `}</style>
              </>
       );
}
