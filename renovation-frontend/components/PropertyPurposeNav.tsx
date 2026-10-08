"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CategoryNode } from "@/types/property";

type Props = {
  purposes: CategoryNode[];
  onNavigate?: () => void;
};

export function PropertyPurposeNav({ purposes, onNavigate }: Props) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<number | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdownId(id);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 250);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const toggleMobileExpand = (id: number) => {
    setMobileExpandedId((prev) => (prev === id ? null : id));
  };

  const handleLinkClick = () => {
    setOpenDropdownId(null);
    if (onNavigate) {
      onNavigate();
    }
  };

  if (!purposes || purposes.length === 0) {
    return null;
  }

  return (
    <ul
      ref={navRef}
      className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center property-purpose-nav"
    >
      {purposes.map((category) => {
        const isOpen = openDropdownId === category.id;
        const isMobileOpen = mobileExpandedId === category.id;
        const subcategories = category.children || [];

        return (
          <li
            key={category.id}
            className={`nav-item category-nav-item ${isOpen ? "show" : ""}`}
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.innerWidth >= 992) {
                handleMouseEnter(category.id);
              }
            }}
            onMouseLeave={() => {
              if (typeof window !== "undefined" && window.innerWidth >= 992) {
                handleMouseLeave();
              }
            }}
          >
            {/* Desktop / Mobile Main Toggle */}
            <div className="d-flex align-items-center justify-content-between w-100">
              <Link
                href={`/properties?type=${encodeURIComponent(category.slug)}&listing_type=normal`}
                className="nav-link property-nav-link d-inline-flex align-items-center gap-1"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const hint = category.slug?.toLowerCase().includes("builder")
                      ? "builder"
                      : "renovation";
                    window.sessionStorage.setItem("home_vertical", hint);
                  }
                  handleLinkClick();
                }}
              >
                <span>{category.name}</span>
              </Link>
              <button
                type="button"
                className="btn btn-link nav-dropdown-toggle p-0 ms-1 d-inline-flex align-items-center justify-content-center"
                aria-expanded={isOpen || isMobileOpen}
                aria-label={`Toggle ${category.name} menu`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDropdown(category.id);
                  toggleMobileExpand(category.id);
                }}
              >
                <i
                  className={`fa-solid fa-chevron-down nav-chevron ${
                    isOpen || isMobileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu (Desktop & Mobile) */}
            <div
              className={`category-dropdown-menu ${
                isOpen ? "desktop-show" : ""
              } ${isMobileOpen ? "mobile-show" : ""}`}
              onMouseEnter={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 992) {
                  handleMouseEnter(category.id);
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 992) {
                  handleMouseLeave();
                }
              }}
            >
              <div className="dropdown-inner-card">
                <div className="dropdown-header-row d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2.5">
                    <span
                      className="category-header-badge d-inline-flex align-items-center"
                      style={{
                        fontSize: "13px",
                        backgroundColor: "#F0F7FD",
                        color: "#0284C7",
                        border: "1px solid #BAE6FD",
                        fontWeight: 600,
                        padding: "6px 14px",
                        borderRadius: "20px",
                        gap: "8px",
                      }}
                    >
                      <i
                        className={
                          category.slug.includes("builder")
                            ? "fa-solid fa-trowel-bricks"
                            : "fa-solid fa-paint-roller"
                        }
                        style={{ fontSize: "14px", color: "#0284C7" }}
                      />
                      <span>{category.name}</span>
                    </span>
                    <span
                      className="text-muted small fw-medium d-none d-md-inline ms-3 ps-1"
                      style={{ fontSize: "13.5px", color: "#64748B" }}
                    >
                      {subcategories.length} Subcategories
                    </span>
                  </div>
                  <Link
                    href={`/properties?type=${encodeURIComponent(category.slug)}&listing_type=normal`}
                    className="view-all-mega-btn"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const hint = category.slug?.toLowerCase().includes("builder")
                          ? "builder"
                          : "renovation";
                        window.sessionStorage.setItem("home_vertical", hint);
                      }
                      handleLinkClick();
                    }}
                  >
                    <span>Browse All {category.name}</span>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>

                <div className="subcategories-grid">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/properties?type=${encodeURIComponent(
                        category.slug
                      )}&sub_category=${encodeURIComponent(
                        sub.slug
                      )}&listing_type=normal`}
                      className="subcategory-item-link"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const hint = category.slug?.toLowerCase().includes("builder")
                            ? "builder"
                            : "renovation";
                          window.sessionStorage.setItem("home_vertical", hint);
                        }
                        handleLinkClick();
                      }}
                    >
                      <i className="fa-solid fa-chevron-right subcategory-bullet" />
                      <span className="subcategory-name">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
