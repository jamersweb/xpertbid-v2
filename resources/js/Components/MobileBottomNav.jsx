import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef } from 'react';
import { useAuthModal } from '@/Contexts/AuthModalContext';
import useTranslate from '@/hooks/useTranslate';

const UserProfile = () => {
       const { auth } = usePage().props;
       const user = auth?.user;
       if (!user) return null;
       return (
              <div className="d-flex flex-column align-items-center">
                     {user.profile_pic ? (
                            <img src={user.profile_pic} alt="Profile" className="rounded-circle" style={{ width: 24, height: 24, objectFit: 'cover' }} />
                     ) : (
                            <img src="/assets/images/user-icon.png" alt="Profile" className="rounded-circle" width={24} height={24} />
                     )}
              </div>
       );
};

export default function MobileBottomNav() {
       const { props, url } = usePage();
       const { auth } = props;
       const user = auth?.user;
       const { openLogin } = useAuthModal();
       const { t } = useTranslate();
       const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
       const menuRef = useRef(null);
       const isAuthenticated = Boolean(user);

       const handleLogout = () => {
              router.post(route('logout'));
              setIsUserMenuOpen(false);
       };

       useEffect(() => {
              const handleClickOutside = (event) => {
                     if (menuRef.current && !menuRef.current.contains(event.target)) {
                            setIsUserMenuOpen(false);
                     }
              };

              document.addEventListener('mousedown', handleClickOutside);
              return () => {
                     document.removeEventListener('mousedown', handleClickOutside);
              };
       }, []);

       const toggleUserMenu = () => {
              setIsUserMenuOpen((prev) => !prev);
       };

       const isActive = (path) => {
              return url === path || url.startsWith(path + '/');
       };

       const handleSellClick = (e) => {
              e.preventDefault();
              if (!isAuthenticated) {
                     openLogin();
              } else {
                     router.visit(route('auctions.create'));
              }
       };

       return (
              <>
                     <div className="mobile-bottom-nav d-lg-none">
                            <Link
                                   href="/"
                                   className={`mobile-bottom-nav__item ${url === '/' ? 'mobile-bottom-nav__item--active' : ''}`}
                                   aria-label="Home"
                            >
                                   <i className="fa-solid fa-house mobile-bottom-nav__icon" />
                                   <span className="mobile-bottom-nav__label">{t('Home')}</span>
                            </Link>

                            {isAuthenticated ? (
                                   <Link
                                          href={route('chat.index')}
                                          className={`mobile-bottom-nav__item ${isActive('/chat') ? 'mobile-bottom-nav__item--active' : ''}`}
                                          aria-label="Chat"
                                   >
                                          <i className="fa-solid fa-comment-dots mobile-bottom-nav__icon" />
                                          <span className="mobile-bottom-nav__label">{t('Chat')}</span>
                                   </Link>
                            ) : (
                                   <button
                                          type="button"
                                          onClick={openLogin}
                                          className="mobile-bottom-nav__item"
                                          aria-label="Chat"
                                   >
                                          <i className="fa-solid fa-comment-dots mobile-bottom-nav__icon" />
                                          <span className="mobile-bottom-nav__label">{t('Chat')}</span>
                                   </button>
                            )}

                            <button
                                   onClick={handleSellClick}
                                   className={`mobile-bottom-nav__item mobile-bottom-nav__item--action ${isActive('/auctions/create') ? 'mobile-bottom-nav__item--active' : ''}`}
                                   aria-label="Sell"
                                   style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                            >
                                   <i className="fa-solid fa-plus mobile-bottom-nav__icon" />
                                   <span className="mobile-bottom-nav__label">{t('Sell')}</span>
                            </button>

                            <Link
                                   href={route('auctions.one_rupee')}
                                   className={`mobile-bottom-nav__item mobile-bottom-nav__item--highlight`}
                                   aria-label="1 Rupee Auction"
                            >
                                   <i className="fa-solid fa-gavel mobile-bottom-nav__icon" />
                                   <span className="mobile-bottom-nav__label" style={{ fontSize: '10px', lineHeight: '1.1', textAlign: 'center' }}>1 Rupee</span>
                            </Link>

                            {isAuthenticated ? (
                                   <div className="mobile-bottom-nav__item mobile-bottom-nav__profile" ref={menuRef}>
                                          <button
                                                 type="button"
                                                 className="mobile-bottom-nav__profile-btn"
                                                 onClick={toggleUserMenu}
                                                 aria-label="User menu"
                                          >
                                                 <UserProfile />
                                                 <span className="mobile-bottom-nav__label">{t('Profile')}</span>
                                          </button>

                                          {isUserMenuOpen && (
                                                 <div className="mobile-bottom-nav__dropdown shadow">
                                                       <ul className="user-setting-menu list-unstyled m-0 p-0">
                                                               <li>
                                                                      <Link href={route('dashboard')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <i className="fa-solid fa-table-columns text-center" style={{ width: '20px', fontSize: '18px' }}></i>
                                                                             {t('Dashboard')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('profile.edit')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <img src="/assets/images/profile-setting.svg" alt="Settings" width={20} height={20} />
                                                                             {t('Account Settings')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('chat.index')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <i className="fa-solid fa-comment-dots text-center" style={{ width: '20px', fontSize: '18px' }}></i>
                                                                             {t('Messages')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('favorites.index')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <img src="/assets/images/setting-heart.svg" alt="Favorites" width={20} height={20} />
                                                                             {t('My Favorites')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('auctions.mylistings')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <img src="/assets/images/mainListing.svg" alt="Listings" width={20} height={20} />
                                                                             {t('My Listings')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('bids.index')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <img src="/assets/images/myBids.svg" alt="Bids" width={20} height={20} />
                                                                             {t('My Bids')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('orders.index')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <i className="fa-solid fa-box-open text-center" style={{ width: '20px', fontSize: '18px' }}></i>
                                                                             {t('My Orders')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('payment_requests.index')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <i className="fa-solid fa-money-check text-center" style={{ width: '20px', fontSize: '18px' }}></i>
                                                                             {t('Payment Request')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <Link href={route('verification.identity')} onClick={() => setIsUserMenuOpen(false)}>
                                                                             <i className="fa-solid fa-id-card text-center" style={{ width: '20px', fontSize: '18px' }}></i>
                                                                             {t('Verification')}
                                                                      </Link>
                                                               </li>
                                                               <li>
                                                                      <button className="mobile-bottom-nav__logout-btn" onClick={handleLogout}>
                                                                             <img src="/assets/images/logout.svg" alt="Logout" width={20} height={20} />
                                                                             {t('Log Out')}
                                                                      </button>
                                                               </li>
                                                        </ul>
                                                 </div>
                                          )}
                                   </div>
                            ) : (
                                   <button
                                          type="button"
                                          onClick={openLogin}
                                          className="mobile-bottom-nav__item"
                                          aria-label="Login"
                                   >
                                          <i className="fa-regular fa-user mobile-bottom-nav__icon" />
                                          <span className="mobile-bottom-nav__label">{t('Profile')}</span>
                                   </button>
                            )}
                     </div>
                     <style dangerouslySetInnerHTML={{
                            __html: `
                body {
                    padding-bottom: 70px;
                }
                @media (min-width: 992px) {
                    body {
                        padding-bottom: 0px;
                    }
                    .mobile-bottom-nav {
                        display: none !important;
                    }
                }

                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    border-top: 1px solid #e5e5e5;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 8px 10px;
                    z-index: 1050;
                    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
                }

                .mobile-bottom-nav__item {
                    flex: 1;
                    text-align: center;
                    color: #606060;
                    font-family: "Inter", sans-serif;
                    font-size: 11px;
                    font-weight: 500;
                    text-decoration: none !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    border: none;
                    background: transparent;
                }

                .mobile-bottom-nav__item--active {
                    color: #0d6efd !important;
                }

                .mobile-bottom-nav__icon {
                    font-size: 18px;
                }

                .mobile-bottom-nav__profile {
                    position: relative;
                }

                .mobile-bottom-nav__profile-btn {
                    background: transparent;
                    border: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    color: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                }

                .mobile-bottom-nav__dropdown {
                    position: fixed;
                    left: 12px;
                    right: 12px;
                    bottom: 74px;
                    background: white;
                    border-radius: 18px;
                    overflow-y: auto;
                    padding: 10px 0;
                    border: 1px solid #eee;
                    z-index: 1060;
                    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
                }

                .user-setting-menu li a, .user-setting-menu li button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px 14px 5px;
                    color: #333;
                    text-decoration: none;
                    font-size: 15px;
                    text-align: left;
                    width: 100%;
                    border: none;
                    background: none;
                }

                .user-setting-menu li:not(:last-child) {
                    border-bottom: 1px solid #ededed;
                }

                .mobile-bottom-nav__logout-btn {
                    color: #e94343 !important;
                }

                .mobile-bottom-nav__item--highlight {
                    animation: glow-pulse 1.5s infinite ease-in-out;
                }

                @keyframes glow-pulse {
                    0% { transform: scale(1); color: #0d6efd; }
                    50% { transform: scale(1.1); color: #fd7e14; }
                    100% { transform: scale(1); color: #0d6efd; }
                }
            ` }} />
              </>
       );
}
