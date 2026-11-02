"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { resolveProfileImage, useAuth } from "@/components/auth/AuthProvider";
import { assetImage } from "@/lib/site";
import type { CategoryNode } from "@/types/property";

type Props = {
  purposes?: CategoryNode[];
};

type Vertical = "sale" | "rent";

const VERTICAL_KEY = "property_home_vertical";

const LOCAL_PROFILE_PATHS = new Set([
  "/buyer-requests",
  "/seller/buyer-requests",
  "/seller/buyer-request-preferences",
]);

const PROFILE_LINKS = [
  { label: "Account Settings", path: "/account-settings", icon: "profile-setting.svg" },
  { label: "Messages", path: "/chat", fa: "fa-comment-dots" },
  { label: "My Favorites", path: "/favorites", icon: "setting-heart.svg" },
  { label: "My Listings", path: "/my-listings", icon: "mainListing.svg" },
  { label: "Buyer Requests", path: "/buyer-requests", fa: "fa-clipboard-list", local: true },
  { label: "Request Leads", path: "/seller/buyer-requests", fa: "fa-handshake", local: true },
  { label: "My Bids", path: "/my-bids", icon: "myBids.svg" },
  { label: "My Orders", path: "/my-orders", fa: "fa-box-open" },
  { label: "Payment Request", path: "/payment-requests", fa: "fa-money-check" },
  { label: "Verification", path: "/identity-verification", fa: "fa-id-card" },
] as const;

function findPurpose(purposes: CategoryNode[], hint: "sale" | "rent") {
  return (
    purposes.find(
      (p) =>
        p.slug?.toLowerCase().includes(hint === "sale" ? "sale" : "rent") ||
        p.name?.toLowerCase().includes(hint === "sale" ? "sale" : "rent")
    ) || null
  );
}

function matchesVertical(slug: string | null | undefined, hint: Vertical) {
  if (!slug) return false;
  const value = slug.toLowerCase();
  return hint === "sale" ? value.includes("sale") : value.includes("rent");
}

function readStoredVertical(): Vertical | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(VERTICAL_KEY);
  return value === "sale" || value === "rent" ? value : null;
}

function storeVertical(vertical: Vertical | null) {
  if (typeof window === "undefined") return;
  if (!vertical) {
    window.sessionStorage.removeItem(VERTICAL_KEY);
    return;
  }
  window.sessionStorage.setItem(VERTICAL_KEY, vertical);
}

export function MobileBottomNav({ purposes = [] }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openLogin } = useAuthModal();
  const { user, logout, openMainPath } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [storedVertical, setStoredVertical] = useState<Vertical | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const sale = findPurpose(purposes, "sale");
  const rent = findPurpose(purposes, "rent");
  const saleSlug = sale?.slug || "for-sale";
  const rentSlug = rent?.slug || "for-rent";

  const saleHref = `/properties?sub_category=${encodeURIComponent(saleSlug)}&listing_type=normal`;
  const rentHref = `/properties?sub_category=${encodeURIComponent(rentSlug)}&listing_type=normal`;

  useEffect(() => {
    setStoredVertical(readStoredVertical());
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!profileOpen) return;

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("click", onDocClick);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onDocClick);
    };
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sub = searchParams.get("sub_category") || "";
    if (matchesVertical(sub, "sale") || sub === saleSlug) {
      storeVertical("sale");
      setStoredVertical("sale");
      return;
    }
    if (matchesVertical(sub, "rent") || sub === rentSlug) {
      storeVertical("rent");
      setStoredVertical("rent");
    }
  }, [searchParams, saleSlug, rentSlug]);

  const subParam = searchParams.get("sub_category") || "";
  const onBrowse = pathname === "/properties" || pathname.startsWith("/properties/");
  const isHome = pathname === "/";

  const typeIsSale = subParam === saleSlug || matchesVertical(subParam, "sale");
  const typeIsRent = subParam === rentSlug || matchesVertical(subParam, "rent");

  const activeVertical: Vertical | null = typeIsSale
    ? "sale"
    : typeIsRent
      ? "rent"
      : onBrowse
        ? storedVertical
        : null;

  const isSaleActive = onBrowse && activeVertical === "sale";
  const isRentActive = onBrowse && activeVertical === "rent";

  const selectVertical = (vertical: Vertical) => {
    storeVertical(vertical);
    setStoredVertical(vertical);
  };

  const handleSellClick = () => {
    if (!user) {
      openLogin();
      return;
    }
    void openMainPath("/sell");
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  const profileSrc = resolveProfileImage(user);

  return (
    <nav className="mobile-bottom-nav d-lg-none" aria-label="Mobile footer navigation">
      <Link
        href="/"
        className={`mobile-bottom-nav__item ${isHome ? "mobile-bottom-nav__item--active" : ""}`}
        aria-label="Home"
        onClick={() => {
          storeVertical(null);
          setStoredVertical(null);
        }}
      >
        <i className="fa-solid fa-house mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Home</span>
      </Link>

      <Link
        href={saleHref}
        className={`mobile-bottom-nav__item ${isSaleActive ? "mobile-bottom-nav__item--active" : ""}`}
        aria-label="For Sale"
        onClick={() => selectVertical("sale")}
      >
        <i className="fa-solid fa-house-chimney mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Sale</span>
      </Link>

      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--action"
        aria-label="Sell"
        onClick={handleSellClick}
      >
        <i className="fa-solid fa-plus mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Sell</span>
      </button>

      <Link
        href={rentHref}
        className={`mobile-bottom-nav__item ${isRentActive ? "mobile-bottom-nav__item--active" : ""}`}
        aria-label="For Rent"
        onClick={() => selectVertical("rent")}
      >
        <i className="fa-solid fa-key mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Rent</span>
      </Link>

      {user ? (
        <div
          className={`mobile-bottom-nav__item mobile-bottom-nav__profile ${
            profileOpen ? "mobile-bottom-nav__item--active" : ""
          }`}
          ref={menuRef}
        >
          <button
            type="button"
            className="mobile-bottom-nav__profile-btn"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setProfileOpen((open) => !open);
            }}
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileSrc}
              alt=""
              className="rounded-circle"
              width={24}
              height={24}
              style={{ objectFit: "cover" }}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = assetImage("user.jpg");
              }}
            />
            <span className="mobile-bottom-nav__label">Profile</span>
          </button>

          {profileOpen ? (
            <div className="mobile-bottom-nav__dropdown shadow">
              <ul className="user-setting-menu list-unstyled m-0 p-0">
                {PROFILE_LINKS.map((item) => (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        const isLocal =
                          ("local" in item && item.local) || LOCAL_PROFILE_PATHS.has(item.path);
                        if (isLocal) {
                          router.push(item.path);
                          return;
                        }
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
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="mobile-bottom-nav__logout-btn"
                    onClick={() => void handleLogout()}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assetImage("logout.svg")} alt="" width={20} height={20} />
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          className="mobile-bottom-nav__item"
          aria-label="Login"
          onClick={openLogin}
        >
          <i className="fa-regular fa-user mobile-bottom-nav__icon" />
          <span className="mobile-bottom-nav__label">Profile</span>
        </button>
      )}
    </nav>
  );
}
