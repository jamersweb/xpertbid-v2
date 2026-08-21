"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { resolveProfileImage, useAuth } from "@/components/auth/AuthProvider";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { PropertyPurposeNav } from "@/components/PropertyPurposeNav";
import { assetImage, mainUrl } from "@/lib/site";
import type { CategoryNode } from "@/types/property";

type HeaderProps = {
  purposes?: CategoryNode[];
};

const PROFILE_LINKS = [
  { label: "Account Settings", path: "/account-settings", icon: "profile-setting.svg" },
  { label: "Messages", path: "/chat", fa: "fa-comment-dots" },
  { label: "My Favorites", path: "/favorites", icon: "setting-heart.svg" },
  { label: "My Listings", path: "/my-listings", icon: "mainListing.svg" },
  { label: "My Bids", path: "/my-bids", icon: "myBids.svg" },
  { label: "My Orders", path: "/my-orders", fa: "fa-box-open" },
  { label: "Payment Request", path: "/payment-requests", fa: "fa-money-check" },
  { label: "Verification", path: "/identity-verification", fa: "fa-id-card" },
] as const;

function ProfileMenu({
  onClose,
  onLogout,
  openMainPath,
}: {
  onClose: () => void;
  onLogout: () => void;
  openMainPath: (path: string) => Promise<void>;
}) {
  return (
    <div
      id="userProfileSettingPopup"
      className="user-profile-setting-popup show"
      style={{
        position: "absolute",
        right: 0,
        top: "100%",
        backgroundColor: "#FAFAFA",
        boxShadow: "17px 17px 61px 0 #00000023",
        width: 300,
        maxWidth: "90vw",
        borderRadius: 12,
        zIndex: 1000,
        marginTop: 10,
      }}
    >
      <div className="user-profile-setting-content" style={{ padding: "18px 18px 18px 12px" }}>
        <ul
          className="user-setting-menu"
          style={{ paddingLeft: 0, listStyle: "none", marginBottom: 0, width: "100%" }}
        >
          {PROFILE_LINKS.map((item) => (
            <li
              key={item.path}
              style={{
                borderBottom: "1px solid #EDEDED",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "20px",
              }}
            >
              <button
                type="button"
                className="d-flex align-items-center gap-2 text-decoration-none border-0 bg-transparent w-100"
                style={{
                  color: "#24282B",
                  fontFamily: '"Inter", sans-serif',
                  padding: "12px 6px",
                  textAlign: "left",
                }}
                onClick={() => {
                  onClose();
                  void openMainPath(item.path);
                }}
              >
                {"icon" in item && item.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetImage(item.icon)} alt="" width={20} height={20} />
                ) : (
                  <i
                    className={`fa-solid ${"fa" in item ? item.fa : ""} text-center`}
                    style={{ width: 20, fontSize: 18 }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          <li style={{ marginTop: 14 }}>
            <button
              type="button"
              className="transparent-button d-flex align-items-center gap-2 border-0 bg-transparent p-0"
              style={{ color: "#E94343", padding: "12px 6px" }}
              onClick={onLogout}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetImage("logout.svg")} alt="Logout" />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader({ purposes = [] }: HeaderProps) {
  const { openLogin, openRegister } = useAuthModal();
  const { user, loading, logout, openMainPath } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".header-profile-root")) {
        setProfileOpen(false);
      }
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !target.closest(".navbar-toggler")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleSellClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    closeMobileMenu();
    if (!user) {
      openLogin();
      return;
    }
    void openMainPath("/sell");
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    closeMobileMenu();
    await logout();
  };

  const profileSrc = resolveProfileImage(user);

  return (
    <header className="bg-white" style={{ zIndex: 1050 }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2" id="mainNavbar">
        <div className="container-fluid px-lg-5 my-2">
          <Link className="navbar-brand d-flex align-items-center me-0 me-lg-4" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetImage("xp-prop-logo-clean.png")}
              alt="XpertBid Property"
              width={180}
              height={52}
              className="logo-image property-header-logo"
            />
          </Link>

          <div className="mobile-header-actions d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
            {user ? <NotificationDropdown /> : null}
            {!user && !loading ? (
              <>
                <button type="button" className="mobile-auth-btn mobile-auth-login" onClick={openLogin}>
                  Login
                </button>
                <button
                  type="button"
                  className="mobile-auth-btn mobile-auth-signup"
                  onClick={openRegister}
                >
                  Sign Up
                </button>
              </>
            ) : null}
            {user ? (
              <div className="header-profile-root" style={{ position: "relative" }}>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Profile menu"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileSrc}
                    alt="Profile"
                    className="rounded-circle border"
                    width={28}
                    height={28}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = assetImage("user.jpg");
                    }}
                  />
                </button>
                {profileOpen ? (
                  <ProfileMenu
                    onClose={() => setProfileOpen(false)}
                    onLogout={handleLogout}
                    openMainPath={openMainPath}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-controls="navbarSupportedContent"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
          </button>

          <div
            ref={mobileMenuRef}
            className={`navbar-collapse xpert-mobile-menu ${menuOpen ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <PropertyPurposeNav purposes={purposes} onNavigate={closeMobileMenu} />

            <div className="d-flex align-items-center mt-3 mt-lg-0 header-account-cluster">
              {!user && !loading ? (
                <div className="registration-btns d-none d-lg-flex align-items-center">
                  <button
                    type="button"
                    className="login me-4"
                    onClick={openLogin}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#23262F",
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </button>
                  <button type="button" className="signup me-2" onClick={openRegister}>
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="sellnow mx-3 px-3 d-none d-lg-inline-flex align-items-center"
                    onClick={handleSellClick}
                  >
                    Sell Now
                  </button>
                </div>
              ) : null}

              <div className="d-flex d-lg-none flex-column w-100 gap-2 mt-2 mobile-menu-extra">
                <button
                  type="button"
                  className="sellnow w-100 justify-content-center"
                  onClick={handleSellClick}
                >
                  Sell Now
                </button>
              </div>

              {user ? (
                <div
                  className="d-none d-lg-flex align-items-center header-user-actions header-profile-root"
                  style={{ position: "relative" }}
                >
                  <div className="header-action-notification me-2">
                    <NotificationDropdown />
                  </div>

                  <button
                    type="button"
                    className="user-profile-setting btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                    onClick={() => setProfileOpen((v) => !v)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileSrc}
                      alt="Profile"
                      className="rounded-circle border"
                      width={35}
                      height={35}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assetImage("user.jpg");
                      }}
                    />
                    <i className="fa-solid fa-chevron-down small text-muted d-none d-lg-inline" />
                  </button>

                  {profileOpen ? (
                    <ProfileMenu
                      onClose={() => setProfileOpen(false)}
                      onLogout={handleLogout}
                      openMainPath={openMainPath}
                    />
                  ) : null}

                  <button
                    type="button"
                    className="sellnow header-sell-btn px-3 d-none d-lg-inline-flex align-items-center ms-3"
                    onClick={handleSellClick}
                  >
                    Sell Now
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { user, openMainPath } = useAuth();

  const goMainHome = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (user) {
      void openMainPath("/");
      return;
    }
    window.location.href = mainUrl("/");
  };

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-4 col-sm-6 footer-child1">
            <div className="logo">
              <a href={mainUrl("/")} onClick={goMainHome}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetImage("footer-logo.png")}
                  alt="XpertBid Footer Logo"
                  width={200}
                  height={60}
                  className="quality-90"
                />
              </a>
            </div>
            <p>
              First ever UAE based auction platform, providing you a one stop shop,
              auction marketplace/platform. From real estate, vehicles, bulk goods
              and much more, XpertBid powers auctions that deliver value, security,
              and results one auction at a time.
            </p>
            <div className="social-icons my-3">
              <a
                href="https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href="https://www.linkedin.com/company/xpertbid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
              <a
                href="https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook" />
              </a>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 footer-child3">
            <div className="footer-menu ps-0 ps-sm-4">
              <p className="foot-menu-heading my-4">Get To Know Us</p>
              <ul>
                <li>
                  <a href={mainUrl("/faq")}>FAQ</a>
                </li>
                <li>
                  <a href={mainUrl("/blogs")}>Blogs</a>
                </li>
                <li>
                  <a href={mainUrl("/about")}>About Us</a>
                </li>
                <li>
                  <a href={mainUrl("/about-our-partner")}>About Our Partners</a>
                </li>
                <li>
                  <a href={mainUrl("/contact")}>Contact Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 footer-child3 mt-0 mt-sm-3">
            <div className="footer-menu ps-0 ps-sm-4 mt-0 mt-sm-5">
              <ul>
                <li>
                  <a href={mainUrl("/refund-policy")}>Refund Policy</a>
                </li>
                <li>
                  <a href={mainUrl("/shipping-policy")}>Shipping Policy</a>
                </li>
                <li>
                  <a href={mainUrl("/seller-policy")}>Seller Policy</a>
                </li>
                <li>
                  <a href={mainUrl("/privacy-policy")}>Privacy Policy</a>
                </li>
                <li>
                  <a href={mainUrl("/terms")}>Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <div id="qlwapp" className="qlwapp qlwapp-button qlwapp-bottom-right qlwapp-rounded">
      <a
        className="qlwapp-toggle"
        href="https://wa.me/923022113202"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <span className="fa-brands fa-whatsapp gameon" />
      </a>
    </div>
  );
}
