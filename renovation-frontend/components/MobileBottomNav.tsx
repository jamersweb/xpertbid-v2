"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { resolveProfileImage, useAuth } from "@/components/auth/AuthProvider";
import { assetImage } from "@/lib/site";
import type { CategoryNode } from "@/types/property";

type Props = {
  purposes?: CategoryNode[];
};

type Vertical = "renovation" | "builder";

const VERTICAL_KEY = "home_vertical";

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

function findPurpose(purposes: CategoryNode[], hint: "renovation" | "builder") {
  return (
    purposes.find(
      (p) =>
        p.slug?.toLowerCase().includes(hint) ||
        p.name?.toLowerCase().includes(hint)
    ) || null
  );
}

function matchesVertical(slug: string | null | undefined, hint: Vertical) {
  if (!slug) return false;
  const value = slug.toLowerCase();
  return value.includes(hint) || value.includes(hint.replace("renovation", "home-renovation"));
}

function readStoredVertical(): Vertical | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(VERTICAL_KEY);
  return value === "renovation" || value === "builder" ? value : null;
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [storedVertical, setStoredVertical] = useState<Vertical | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const renovation = findPurpose(purposes, "renovation");
  const builder = findPurpose(purposes, "builder");

  const renovationSlug = renovation?.slug || "home-renovation";
  const builderSlug = builder?.slug || "home-builder";

  const renovationHref = `/properties?type=${encodeURIComponent(renovationSlug)}&listing_type=normal`;
  const builderHref = `/properties?type=${encodeURIComponent(builderSlug)}&listing_type=normal`;

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

    // Defer so the same tap that opens the menu does not immediately close it.
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
    const typeParam = searchParams.get("type") || "";
    if (matchesVertical(typeParam, "renovation") || typeParam === renovationSlug) {
      storeVertical("renovation");
      setStoredVertical("renovation");
      return;
    }
    if (matchesVertical(typeParam, "builder") || typeParam === builderSlug) {
      storeVertical("builder");
      setStoredVertical("builder");
    }
  }, [searchParams, renovationSlug, builderSlug]);

  const typeParam = searchParams.get("type") || "";
  const onBrowse = pathname === "/properties" || pathname.startsWith("/properties/");
  const isHome = pathname === "/";

  const typeIsRenovation =
    typeParam === renovationSlug || matchesVertical(typeParam, "renovation");
  const typeIsBuilder =
    typeParam === builderSlug || matchesVertical(typeParam, "builder");

  const activeVertical: Vertical | null = typeIsRenovation
    ? "renovation"
    : typeIsBuilder
      ? "builder"
      : onBrowse
        ? storedVertical
        : null;

  const isRenovationActive = onBrowse && activeVertical === "renovation";
  const isBuilderActive = onBrowse && activeVertical === "builder";

  const selectVertical = (vertical: Vertical) => {
    storeVertical(vertical);
    setStoredVertical(vertical);
  };

  const handleSell = () => {
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
        href={renovationHref}
        className={`mobile-bottom-nav__item ${isRenovationActive ? "mobile-bottom-nav__item--active" : ""}`}
        aria-label="Renovation"
        onClick={() => selectVertical("renovation")}
      >
        <i className="fa-solid fa-paint-roller mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Renovation</span>
      </Link>

      <button
        type="button"
        className="mobile-bottom-nav__item mobile-bottom-nav__item--action"
        aria-label="Sell"
        onClick={handleSell}
      >
        <i className="fa-solid fa-plus mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Sell</span>
      </button>

      <Link
        href={builderHref}
        className={`mobile-bottom-nav__item ${isBuilderActive ? "mobile-bottom-nav__item--active" : ""}`}
        aria-label="Builder"
        onClick={() => selectVertical("builder")}
      >
        <i className="fa-solid fa-trowel-bricks mobile-bottom-nav__icon" />
        <span className="mobile-bottom-nav__label">Builder</span>
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
