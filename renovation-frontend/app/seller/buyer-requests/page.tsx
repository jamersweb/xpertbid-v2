"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BrStyles,
  PublicIdentityRow,
  categoryLine,
  formatPostedDate,
  stripHtml,
} from "@/components/buyer-requests/BrUi";
import SellerLeadsHero from "@/components/buyer-requests/SellerLeadsHero";
import {
  listMatchedBuyerRequests,
  type BuyerRequestItem,
} from "@/lib/api/buyerRequests";

export default function SellerBuyerRequestsPage() {
  const { user, loading: authLoading, openMainPath } = useAuth();
  const { openLogin } = useAuthModal();
  const [items, setItems] = useState<BuyerRequestItem[]>([]);
  const [meta, setMeta] = useState<{
    is_corporate_verified?: boolean;
    has_preferences?: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navFilter, setNavFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const json = await listMatchedBuyerRequests();
      setItems(json?.data || []);
      setMeta(json?.meta || {});
    } catch (e) {
      setError((e as Error).message || "Failed to load leads");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  const counts = useMemo(() => {
    const all = items.length;
    const offered = items.filter((r) => !!r.my_offer).length;
    const available = items.filter((r) => !r.my_offer).length;
    return { all, offered, available };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    const q = search.trim().toLowerCase();

    if (navFilter === "available") list = list.filter((r) => !r.my_offer);
    else if (navFilter === "offered") list = list.filter((r) => !!r.my_offer);

    if (q) {
      list = list.filter((r) => {
        const hay = [
          r.title,
          r.location_label,
          r.category?.name,
          r.sub_category?.name,
          stripHtml(r.description || ""),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortBy === "budget") {
      list.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
    } else {
      list.sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    }

    return list;
  }, [items, navFilter, sortBy, search]);

  const tabs = [
    { key: "all", label: "All Leads", count: counts.all },
    { key: "available", label: "Open to offer", count: counts.available },
    { key: "offered", label: "My offers", count: counts.offered },
  ];

  const scrollToLeads = (filter?: string) => {
    if (filter) setNavFilter(filter);
    window.requestAnimationFrame(() => {
      document.getElementById("seller-leads-board")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (authLoading) {
    return (
      <main className="br-page">
        <div className="br-page__inner">Loading…</div>
        <BrStyles />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="br-page">
        <div className="br-page__inner">
          <div className="br-empty text-center">
            <h1 className="br-title mb-2">Request leads</h1>
            <p className="br-sub mb-3">
              Sign in as a corporate-verified seller to browse renovation buyer requests.
            </p>
            <button type="button" className="br-btn br-btn--dark" onClick={openLogin}>
              Log in
            </button>
          </div>
        </div>
        <BrStyles />
      </main>
    );
  }

  return (
    <main className="br-page">
      <div className="br-page__inner">
        <SellerLeadsHero
          items={items}
          counts={counts}
          isCorporateVerified={Boolean(meta.is_corporate_verified)}
          hasPreferences={Boolean(meta.has_preferences)}
          onBrowseOpen={() => scrollToLeads("available")}
          onBrowseAll={() => scrollToLeads("all")}
        />

        {!meta.is_corporate_verified ? (
          <div className="br-alert br-alert--warn">
            Corporate verification is required to view and offer on leads.{" "}
            <button
              type="button"
              className="br-link"
              onClick={() => void openMainPath("/identity-verification")}
            >
              Verify now
            </button>
          </div>
        ) : null}

        {error ? <div className="br-alert br-alert--danger">{error}</div> : null}

        <div id="seller-leads-board" className="br-filters" style={{ scrollMarginTop: "6rem" }}>
          <nav className="br-tabs">
            {tabs.map((tab) => {
              const active = navFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`br-tab ${active ? "is-active" : ""}`}
                  onClick={() => setNavFilter(tab.key)}
                >
                  <span className="text-truncate">{tab.label}</span>
                  <span className={`br-tab__count ${active ? "is-active" : ""}`}>{tab.count}</span>
                </button>
              );
            })}
          </nav>
          <div className="br-filters__row">
            <div className="br-search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads..."
              />
            </div>
            <div className="br-selects">
              <label className="br-select">
                <span className="visually-hidden">Sort</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Sort By: Newest</option>
                  <option value="budget">Highest budget</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="br-sub">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <div className="br-empty text-center">
            <i className="fa-solid fa-clipboard-list br-empty__icon" aria-hidden />
            <h2 className="br-empty__title">
              {items.length === 0 ? "No open requests" : "No matching leads"}
            </h2>
            <p className="br-empty__text">
              {items.length === 0
                ? "New buyer requests will appear here when available."
                : "Try another filter or clear your search."}
            </p>
          </div>
        ) : (
          <div className="br-grid">
            {filtered.map((item) => {
              const description = stripHtml(item.description || "");
              const thumbs = (item.images || []).slice(0, 4);
              const extraImages = Math.max(0, (item.images || []).length - 3);
              const previewThumbs = extraImages > 0 ? thumbs.slice(0, 3) : thumbs;

              return (
                <article key={item.id} className="br-card">
                  <div>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <span className="br-pill br-pill--open">Open</span>
                      {item.my_offer ? (
                        <span className="br-pill br-pill--amber">{item.my_offer.status}</span>
                      ) : (
                        <span className="br-pill br-pill--muted">No offer yet</span>
                      )}
                    </div>

                    <h2 className="br-card__title">{item.title}</h2>

                    <PublicIdentityRow person={item.user} role="buyer" size="sm" />

                    <div className="br-meta">
                      <div className="br-meta__row">
                        <i className="fa-solid fa-clipboard-list" aria-hidden />
                        <span>{categoryLine(item)}</span>
                      </div>
                      {item.location_label ? (
                        <div className="br-meta__row">
                          <i className="fa-solid fa-location-dot" aria-hidden />
                          <span>{item.location_label}</span>
                        </div>
                      ) : null}
                      {item.budget != null && Number(item.budget) > 0 ? (
                        <div className="br-meta__row br-meta__row--strong">
                          <i className="fa-solid fa-coins" aria-hidden />
                          <span>Target: {Number(item.budget).toLocaleString()} PKR</span>
                        </div>
                      ) : null}
                      <div className="br-meta__row">
                        <i className="fa-regular fa-calendar" aria-hidden />
                        <span>{formatPostedDate(item.created_at)}</span>
                      </div>
                      {Number(item.offers_count || 0) > 0 ? (
                        <div className="br-meta__row">
                          <i className="fa-solid fa-handshake" aria-hidden />
                          <span>
                            {Number(item.offers_count)}{" "}
                            {Number(item.offers_count) === 1 ? "offer so far" : "offers so far"}
                            {!item.my_offer ? " — you can still bid" : ""}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {description ? <p className="br-card__desc">{description}</p> : null}

                    {item.my_offer ? (
                      <p className="br-sub mt-2 mb-0" style={{ fontWeight: 600 }}>
                        Your offer: {Number(item.my_offer.price).toLocaleString()} PKR
                      </p>
                    ) : null}

                    {previewThumbs.length > 0 ? (
                      <div className="br-thumbs">
                        {previewThumbs.map((img, idx) => (
                          <div key={img.id || idx} className="br-thumb">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" />
                            {extraImages > 0 && idx === previewThumbs.length - 1 ? (
                              <span className="br-thumb__more">+{extraImages}</span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="br-card__footer">
                    <Link href={`/buyer-requests/${item.slug}`} className="br-btn br-btn--dark w-100">
                      {item.my_offer ? "View / update offer" : "View & offer"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <BrStyles />
    </main>
  );
}
