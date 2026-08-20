import type { Metadata } from "next";
import Link from "next/link";
import { LoadMoreProperties } from "@/components/LoadMoreProperties";
import { MarketplaceBrowseChrome } from "@/components/MarketplaceBrowseChrome";
import { getProperties, getPropertyCategories, getCountries } from "@/lib/api/client";
import type { CategoryNode, PropertyFilters } from "@/types/property";

export const revalidate = 120;

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): PropertyFilters {
  const num = (key: string) => {
    const v = first(sp[key]);
    return v && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  };

  const listingType = first(sp.listing_type) || "normal";

  return {
    page: 1,
    per_page: 12,
    q: first(sp.q),
    city: first(sp.city),
    city_id: num("city_id"),
    state_id: num("state_id"),
    country_id: num("country_id"),
    type: first(sp.type),
    purpose: first(sp.purpose),
    bedrooms: num("bedrooms"),
    price_min: num("price_min"),
    price_max: num("price_max"),
    sub_category: first(sp.sub_category),
    child_category: first(sp.child_category),
    listing_type: listingType as PropertyFilters["listing_type"],
    featured: first(sp.featured) === "1" ? 1 : undefined,
    sort: (first(sp.sort) as PropertyFilters["sort"]) || "latest",
  };
}

function findPurpose(tree: CategoryNode | null, slug?: string) {
  if (!tree || !slug) return null;
  return (tree.children || []).find((c) => c.slug === slug) || null;
}

function findChild(purpose: CategoryNode | null, slug?: string) {
  if (!purpose || !slug) return null;
  return (purpose.children || []).find((c) => c.slug === slug) || null;
}

function hrefWith(
  filters: PropertyFilters,
  patch: Partial<PropertyFilters> & Record<string, string | number | undefined | null>
) {
  const merged = { ...filters, ...patch };
  const qs = new URLSearchParams();
  const keys: (keyof PropertyFilters)[] = [
    "q",
    "city",
    "city_id",
    "state_id",
    "country_id",
    "sub_category",
    "child_category",
    "listing_type",
    "bedrooms",
    "price_min",
    "price_max",
    "sort",
    "featured",
  ];
  keys.forEach((key) => {
    const value = merged[key];
    if (value === undefined || value === null || value === "") return;
    qs.set(String(key), String(value));
  });
  const s = qs.toString();
  return s ? `/properties?${s}` : "/properties";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const sub = first(sp.sub_category);
  const child = first(sp.child_category);

  if (sub === "for-sale") {
    return {
      title: child ? `${child.replace(/-/g, " ")} for sale` : "Properties for sale",
    };
  }
  if (sub === "for-rent") {
    return {
      title: child ? `${child.replace(/-/g, " ")} for rent` : "Properties for rent",
    };
  }

  return { title: "Browse properties" };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  let tree: CategoryNode | null = null;
  let countries: Awaited<ReturnType<typeof getCountries>> = [];
  try {
    [tree, countries] = await Promise.all([
      getPropertyCategories(),
      getCountries(),
    ]);
  } catch {
    tree = null;
    countries = [];
  }

  const purpose = findPurpose(tree, filters.sub_category);
  const selectedChild = findChild(purpose, filters.child_category);
  const childOptions = purpose?.children || [];
  const purposeTabs = tree?.children || [];

  let result: Awaited<ReturnType<typeof getProperties>> = {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  };

  try {
    result = await getProperties(filters);
  } catch {
    // empty
  }

  const title = selectedChild?.name || purpose?.name || "Properties";
  const heroImage =
    selectedChild?.image_url || purpose?.image_url || tree?.image_url || FALLBACK_HERO;

  const listingTabs = [
    { key: "auction", label: "Auctions", mobileLabel: "Auction" },
    { key: "normal", label: "Normal Products", mobileLabel: "Normal" },
  ] as const;

  const currentListing = filters.listing_type || "normal";
  const loadMoreKey = [
    filters.q,
    filters.city,
    filters.city_id,
    filters.state_id,
    filters.country_id,
    filters.sub_category,
    filters.child_category,
    filters.listing_type,
    filters.bedrooms,
    filters.price_min,
    filters.price_max,
    filters.sort,
    filters.featured,
  ].join("|");

  return (
    <div className="pb-5 bg-light min-vh-100">
      <div
        className="marketplace-topbar-wrap"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.38)), url("${heroImage}")`,
        }}
      >
        <div className="container-fluid px-lg-5">
          <div className="marketplace-topbar p-3 p-lg-4">
            <div className="marketplace-selected-category mb-3">{title}</div>

            {!purpose ? (
              <div className="marketplace-subcategory-tabs mb-3">
                {purposeTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={hrefWith(filters, {
                      sub_category: tab.slug,
                      child_category: undefined,
                      page: undefined,
                    })}
                    className="marketplace-subcategory-tab"
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="marketplace-subcategory-tabs mb-3">
                <Link
                  href="/properties"
                  className="marketplace-subcategory-back"
                  aria-label="Back to all properties"
                >
                  <span aria-hidden="true">&larr;</span>
                </Link>

                <Link
                  href={hrefWith(filters, {
                    sub_category: purpose.slug,
                    child_category: undefined,
                    page: undefined,
                  })}
                  className={`marketplace-subcategory-tab${!filters.child_category ? " is-active" : ""}`}
                >
                  All {purpose.name}
                </Link>

                {childOptions.map((child) => (
                  <Link
                    key={child.id}
                    href={hrefWith(filters, {
                      sub_category: purpose.slug,
                      child_category: child.slug,
                      page: undefined,
                    })}
                    className={`marketplace-subcategory-tab${
                      filters.child_category === child.slug ? " is-active" : ""
                    }`}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}

            <MarketplaceBrowseChrome
              countries={countries}
              defaults={{
                q: filters.q,
                country_id: filters.country_id,
                state_id: filters.state_id,
                city_id: filters.city_id,
                bedrooms: filters.bedrooms,
                price_min: filters.price_min,
                price_max: filters.price_max,
                sort: filters.sort,
                sub_category: filters.sub_category,
                child_category: filters.child_category,
                listing_type: filters.listing_type || "normal",
              }}
            />

            <div className="marketplace-top-tabs">
              {listingTabs.map((tab) => {
                const active = currentListing === tab.key;
                return (
                  <Link
                    key={tab.key}
                    href={hrefWith(filters, {
                      listing_type: tab.key,
                      page: undefined,
                    })}
                    className={`marketplace-top-tab${active ? " is-active" : ""}`}
                  >
                    <span className="d-none d-md-inline">{tab.label}</span>
                    <span className="d-inline d-md-none">{tab.mobileLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-lg-5 pt-4">
        <section className="marketplace-latest-grid-section">
          <div className="marketplace-curated-header">
            <h3>Latest {purpose?.name || "Properties"}</h3>
          </div>

          {result.data.length ? (
            <>
              <p className="text-muted mb-3">
                {result.meta.total} result{result.meta.total === 1 ? "" : "s"}
              </p>
              <LoadMoreProperties
                key={loadMoreKey}
                initialItems={result.data}
                initialMeta={result.meta}
                filters={filters}
              />
            </>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border mt-2">
              <h3 className="h5 fw-bold text-dark">No Products Found</h3>
              <p className="text-muted mb-3">
                We couldn&apos;t find any products matching your current filters.
              </p>
              <Link href="/properties" className="btn btn-dark rounded-3 px-4 py-2">
                Clear All Filters
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
