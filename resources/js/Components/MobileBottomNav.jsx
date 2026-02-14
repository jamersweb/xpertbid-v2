import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef } from 'react';

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
                     router.visit(route('login'));
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
                                   <span className="mobile-bottom-nav__label">Home</span>
                            </Link>

                            <Link
                                   href="/marketplace"
                                   className={`mobile-bottom-nav__item ${isActive('/marketplace') ? 'mobile-bottom-nav__item--active' : ''}`}
                                   aria-label="Marketplace"
                            >
                                   <i className="fa-solid fa-compass mobile-bottom-nav__icon" />
                                   <span className="mobile-bottom-nav__label">Explore</span>
                            </Link>

                            <button
                                   onClick={handleSellClick}
                                   className={`mobile-bottom-nav__item mobile-bottom-nav__item--action ${isActive('/auctions/create') ? 'mobile-bottom-nav__item--active' : ''}`}
                                   aria-label="Sell"
                                   style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                            >
                                   <i className="fa-solid fa-plus mobile-bottom-nav__icon" />
                                   <span className="mobile-bottom-nav__label">Sell</span>
                            </button>

                            <Link
                                   href="/"
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
                                                 <span className="mobile-bottom-nav__label">Profile</span>
                                          </button>

                                          {isUserMenuOpen && (
                                                 <div className="mobile-bottom-nav__dropdown shadow">
                                                        <ul className="user-setting-menu list-unstyled m-0 p-0">
                                                               <li><Link href={route('dashboard')} onClick={() => setIsUserMenuOpen(false)}>Dashboard</Link></li>
                                                               <li><Link href={route('profile.edit')} onClick={() => setIsUserMenuOpen(false)}>Settings</Link></li>
                                                               <li><Link href={route('favorites.index')} onClick={() => setIsUserMenuOpen(false)}>Favorites</Link></li>
                                                               <li><Link href={route('auctions.mylistings')} onClick={() => setIsUserMenuOpen(false)}>My Listings</Link></li>
                                                               <li><Link href={route('bids.index')} onClick={() => setIsUserMenuOpen(false)}>My Bids</Link></li>
                                                               <li><Link href={route('cart.index')} onClick={() => setIsUserMenuOpen(false)}>My Cart</Link></li>
                                                               <li><Link href={route('orders.index')} onClick={() => setIsUserMenuOpen(false)}>My Orders</Link></li>
                                                               <li><button className="btn btn-link dropdown-item text-danger" onClick={handleLogout}>Log Out</button></li>
                                                        </ul>
                                                 </div>
                                          )}
                                   </div>
                            ) : (
                                   <Link
                                          href={route('login')}
                                          className="mobile-bottom-nav__item"
                                          aria-label="Login"
                                   >
                                          <i className="fa-regular fa-user mobile-bottom-nav__icon" />
                                          <span className="mobile-bottom-nav__label">Profile</span>
                                   </Link>
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
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    background: white;
                    border-radius: 12px 12px 0 0;
                    min-width: 180px;
                    padding: 10px 0;
                    margin-bottom: 8px;
                    border: 1px solid #eee;
                }

                .user-setting-menu li a, .user-setting-menu li button {
                    display: block;
                    padding: 10px 20px;
                    color: #333;
                    text-decoration: none;
                    font-size: 13px;
                    text-align: left;
                    width: 100%;
                    border: none;
                    background: none;
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
