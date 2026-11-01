"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BrStyles,
  categoryLine,
  formatPostedDate,
  statusPill,
  stripHtml,
} from "@/components/buyer-requests/BrUi";
import { listMyBuyerRequests, type BuyerRequestItem } from "@/lib/api/buyerRequests";

export default function MyBuyerRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const [items, setItems] = useState<BuyerRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navFilter, setNavFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const json = await listMyBuyerRequests();
      setItems(json?.data || []);
    } catch (e) {
      setError((e as Error).message || "Failed to load");
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
    const pendingOffers = items.filter((r) =>
      (r.offers || []).some((o) => o.status === "pending")
    ).length;
    const active = items.filter((r) => r.status === "open").length;
    const archive = items.filter((r) => r.status === "closed" || r.status === "fulfilled").length;
    return { all, pendingOffers, active, archive };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    const q = search.trim().toLowerCase();

    if (navFilter === "pending") {
      list = list.filter((r) => (r.offers || []).some((o) => o.status === "pending"));
    } else if (navFilter === "active") {
      list = list.filter((r) => r.status === "open");
    } else if (navFilter === "archive") {
      list = list.filter((r) => r.status === "closed" || r.status === "fulfilled");
    }

    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }

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

    if (sortBy === "offers") {
      list.sort((a, b) => Number(b.offers_count || 0) - Number(a.offers_count || 0));
    } else {
      list.sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    }

    return list;
  }, [items, navFilter, statusFilter, sortBy, search]);

  const tabs = [
    { key: "all", label: "All Requests", count: counts.all },
    { key: "pending", label: "Pending Offers", count: counts.pendingOffers },
    { key: "active", label: "Active Bids", count: counts.active },
    { key: "archive", label: "Archive / History", count: counts.archive },
  ];

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
            <h1 className="br-title mb-2">My Buyer Requests</h1>
            <p className="br-sub mb-3">Log in to create and manage property requests.</p>
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
        <div className="br-header">
          <div className="min-w-0">
            <h1 className="br-title">My Buyer Requests</h1>
            <p className="br-sub d-none d-sm-block">
              Track your requests, review offers, and manage open leads.
            </p>
          </div>
          <Link href="/buyer-requests/new" className="br-btn br-btn--dark">
            <i className="fa-solid fa-plus" aria-hidden />
            <span className="d-none d-sm-inline">New Request</span>
            <span className="d-sm-none">New</span>
          </Link>
        </div>

        {error ? <div className="br-alert br-alert--danger">{error}</div> : null}

        <div className="br-filters">
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
                placeholder="Search requests..."
              />
            </div>
            <div className="br-selects">
              <label className="br-select">
                <span className="visually-hidden">Status</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Status: All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </label>
              <label className="br-select">
                <span className="visually-hidden">Sort</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Sort By: Newest</option>
                  <option value="offers">Most Offers</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="br-sub">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="br-empty text-center">
            <i className="fa-solid fa-clipboard-list br-empty__icon" aria-hidden />
            <h2 className="br-empty__title">
              {items.length === 0 ? "No requests yet" : "No matching requests"}
            </h2>
            <p className="br-empty__text">
              {items.length === 0
                ? "Post what you need and let sellers compete with offers."
                : "Try another filter or clear your search."}
            </p>
            {items.length === 0 ? (
              <Link href="/buyer-requests/new" className="br-btn br-btn--dark mt-3">
                <i className="fa-solid fa-plus" aria-hidden />
                Create request
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="br-grid">
            {filtered.map((item) => {
              const description = stripHtml(item.description || "");
              const thumbs = (item.images || []).slice(0, 4);
              const extraImages = Math.max(0, (item.images || []).length - 3);
              const previewThumbs = extraImages > 0 ? thumbs.slice(0, 3) : thumbs;
              const pill = statusPill(item.status);

              return (
                <article key={item.id} className="br-card">
                  <div>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <span
                        className="br-pill"
                        style={{
                          background: pill.bg,
                          color: pill.color,
                          boxShadow: `inset 0 0 0 1px ${pill.ring}`,
                        }}
                      >
                        {item.status}
                      </span>
                      <span className="br-pill br-pill--muted">
                        {item.offers_count || 0} offers
                      </span>
                    </div>

                    <h2 className="br-card__title">{item.title}</h2>

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
                    </div>

                    {description ? <p className="br-card__desc">{description}</p> : null}

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

                  <div
                    className={`br-card__footer ${
                      item.status !== "fulfilled" ? "is-split" : ""
                    }`}
                  >
                    {item.status !== "fulfilled" ? (
                      <Link
                        href={`/buyer-requests/${item.slug}/edit`}
                        className="br-btn br-btn--outline w-100"
                      >
                        <i className="fa-solid fa-pen" aria-hidden />
                        Edit
                      </Link>
                    ) : null}
                    <Link href={`/buyer-requests/${item.slug}`} className="br-btn br-btn--dark w-100">
                      View Request
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
