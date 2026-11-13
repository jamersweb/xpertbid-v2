"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";

type Props = {
  onNavigate?: () => void;
};

export function RequestNavDropdown({ onNavigate }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPostActive = Boolean(pathname?.startsWith("/buyer-requests/new"));
  const isViewActive = Boolean(pathname?.startsWith("/seller/buyer-requests"));
  const isTriggerActive = isOpen || isPostActive || isViewActive;

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth < 992) return;
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth < 992) return;
    clearCloseTimer();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handlePostRequestClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    onNavigate?.();
    if (!user) {
      e.preventDefault();
      openLogin();
    }
  };

  const handleViewRequestClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <li
      ref={dropdownRef}
      className={`nav-item request-nav-item ${isOpen ? "is-open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`nav-link property-nav-link request-nav-trigger d-inline-flex align-items-center gap-1 ${
          isTriggerActive ? "is-active" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Request</span>
        <i
          className={`fa-solid fa-chevron-down request-nav-chevron ${isOpen ? "is-open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          className="request-dropdown-menu"
          role="menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="/buyer-requests/new"
            className={`request-dropdown-item ${isPostActive ? "is-active" : ""}`}
            role="menuitem"
            onClick={handlePostRequestClick}
          >
            <i className="fa-solid fa-pen-to-square request-dropdown-icon" aria-hidden="true" />
            <span>Post Request</span>
          </Link>
          <Link
            href="/seller/buyer-requests"
            className={`request-dropdown-item ${isViewActive ? "is-active" : ""}`}
            role="menuitem"
            onClick={handleViewRequestClick}
          >
            <i className="fa-solid fa-list-check request-dropdown-icon" aria-hidden="true" />
            <span>View Request</span>
          </Link>
        </div>
      ) : null}
    </li>
  );
}

