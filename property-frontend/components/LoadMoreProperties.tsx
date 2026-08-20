"use client";

import { useState } from "react";
import { PropertyCardView } from "@/components/PropertyCard";
import type { PaginationMeta, PropertyCard, PropertyFilters } from "@/types/property";

type Props = {
  initialItems: PropertyCard[];
  initialMeta: PaginationMeta;
  filters: PropertyFilters;
  gridClassName?: string;
  itemClassName?: string;
  showPropertyMeta?: boolean;
};

function buildQuery(filters: PropertyFilters, page: number) {
  const qs = new URLSearchParams();
  const payload: Record<string, string | number | undefined | null> = {
    page,
    per_page: filters.per_page ?? 12,
    q: filters.q,
    city: filters.city,
    city_id: filters.city_id,
    state_id: filters.state_id,
    country_id: filters.country_id,
    type: filters.type,
    purpose: filters.purpose,
    listing_type: filters.listing_type,
    sub_category: filters.sub_category,
    child_category: filters.child_category,
    price_min: filters.price_min,
    price_max: filters.price_max,
    bedrooms: filters.bedrooms,
    featured: filters.featured,
    sort: filters.sort,
  };

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    qs.set(key, String(value));
  });

  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function LoadMoreProperties({
  initialItems,
  initialMeta,
  filters,
  gridClassName = "row g-4 makt-parent",
  itemClassName = "col-md-6 col-xl-4 mkt-child",
  showPropertyMeta = true,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = meta.current_page < meta.last_page;

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);

    try {
      const nextPage = meta.current_page + 1;
      // Same-origin proxy avoids browser CORS (http vs https / www mismatches).
      const res = await fetch(`/api/properties${buildQuery(filters, nextPage)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Failed to load more (${res.status})`);
      }
      const json = (await res.json()) as {
        data?: PropertyCard[];
        meta?: PaginationMeta;
      };
      const nextItems = json.data ?? [];
      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        return [...prev, ...nextItems.filter((item) => !seen.has(item.id))];
      });
      if (json.meta) {
        setMeta(json.meta);
      } else {
        setMeta((prev) => ({
          ...prev,
          current_page: nextPage,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={gridClassName}>
        {items.map((property) => (
          <div key={property.id} className={itemClassName}>
            <PropertyCardView property={property} showPropertyMeta={showPropertyMeta} />
          </div>
        ))}
      </div>

      {hasMore ? (
        <div className="d-flex flex-column align-items-center gap-2 mt-4 mb-2">
          {error ? <p className="text-danger small mb-0">{error}</p> : null}
          <button
            type="button"
            className="property-load-more-btn"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : null}
    </>
  );
}
