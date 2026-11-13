"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadMoreProperties } from "@/components/LoadMoreProperties";
import {
  MarketplaceSidebar,
  type CategorySelection,
} from "@/components/MarketplaceSidebar";
import { getCities, getStates } from "@/lib/api/client";
import type {
  CategoryNode,
  LocationItem,
  PaginationMeta,
  PropertyCard,
  PropertyFilters,
} from "@/types/property";

type Props = {
  purposeCategories: CategoryNode[];
  currentSubcategory: CategoryNode | null;
  currentChildCategory: CategoryNode | null;
  headingTitle: string;
  seoShortContent?: string | null;
  seoContent?: string | null;
  countries: LocationItem[];
  filters: PropertyFilters;
  initialItems: PropertyCard[];
  initialMeta: PaginationMeta;
  loadMoreKey: string;
};

type BreadcrumbItem = {
  label: string;
  active: boolean;
  selection?: CategorySelection;
};

type FilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

function sanitizeSeoHtml(html?: string | null) {
  if (typeof html !== "string" || html.trim() === "") return "";
  return html
    .replace(
      /<li\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/li>/gi,
      ""
    )
    .replace(
      /<p\b[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>|<span\b[^>]*>\s*<\/span>)*<\/p>/gi,
      ""
    )
    .replace(/<ul\b([^>]*)>\s*<\/ul>/gi, "<ul$1></ul>")
    .replace(/<ol\b([^>]*)>\s*<\/ol>/gi, "<ol$1></ol>");
}

function buildPropertiesHref(
  params: Record<string, string | number | undefined | null>
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    qs.set(key, String(value));
  });
  const s = qs.toString();
  return s ? `/properties?${s}` : "/properties";
}

const SORT_LABELS: Record<string, string> = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  featured: "Featured",
};

export function MarketplaceWorkspace({
  purposeCategories,
  currentSubcategory,
  currentChildCategory,
  headingTitle,
  seoShortContent,
  seoContent,
  countries,
  filters,
  initialItems,
  initialMeta,
  loadMoreKey,
}: Props) {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(filters.q || "");
  const [countryId, setCountryId] = useState(
    filters.country_id ? String(filters.country_id) : ""
  );
  const [stateId, setStateId] = useState(
    filters.state_id ? String(filters.state_id) : ""
  );
  const [cityId, setCityId] = useState(
    filters.city_id ? String(filters.city_id) : ""
  );
  const [states, setStates] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [bedrooms, setBedrooms] = useState(
    filters.bedrooms != null ? String(filters.bedrooms) : ""
  );
  const [priceMin, setPriceMin] = useState(
    filters.price_min != null ? String(filters.price_min) : ""
  );
  const [priceMax, setPriceMax] = useState(
    filters.price_max != null ? String(filters.price_max) : ""
  );
  const [sort, setSort] = useState<string>(filters.sort || "latest");

  const currentListing = filters.listing_type || "normal";

  useEffect(() => {
    setSearchTerm(filters.q || "");
    setCountryId(filters.country_id ? String(filters.country_id) : "");
    setStateId(filters.state_id ? String(filters.state_id) : "");
    setCityId(filters.city_id ? String(filters.city_id) : "");
    setBedrooms(filters.bedrooms != null ? String(filters.bedrooms) : "");
    setPriceMin(filters.price_min != null ? String(filters.price_min) : "");
    setPriceMax(filters.price_max != null ? String(filters.price_max) : "");
    setSort(filters.sort || "latest");
  }, [
    filters.q,
    filters.country_id,
    filters.state_id,
    filters.city_id,
    filters.bedrooms,
    filters.price_min,
    filters.price_max,
    filters.sort,
  ]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobileSidebarOpen || window.innerWidth >= 992) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    let cancelled = false;
    async function loadStates() {
      if (!countryId) {
        setStates([]);
        setStateId("");
        setCities([]);
        setCityId("");
        return;
      }
      try {
        const next = await getStates(Number(countryId));
        if (cancelled) return;
        setStates(next);
        if (stateId && !next.find((s) => String(s.id) === stateId)) {
          setStateId("");
          setCities([]);
          setCityId("");
        }
      } catch {
        if (!cancelled) {
          setStates([]);
        }
      }
    }
    loadStates();
    return () => {
      cancelled = true;
    };
  }, [countryId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    async function loadCities() {
      if (!stateId) {
        setCities([]);
        setCityId("");
        return;
      }
      try {
        const next = await getCities(Number(stateId));
        if (cancelled) return;
        setCities(next);
        if (cityId && !next.find((c) => String(c.id) === cityId)) {
          setCityId("");
        }
      } catch {
        if (!cancelled) {
          setCities([]);
        }
      }
    }
    loadCities();
    return () => {
      cancelled = true;
    };
  }, [stateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const baseCategoryParams = () => ({
    sub_category: filters.sub_category || currentSubcategory?.slug || undefined,
    child_category: filters.child_category || currentChildCategory?.slug || undefined,
    listing_type: currentListing,
  });

  const navigateWithPatch = (
    patch: Record<string, string | number | undefined | null>
  ) => {
    const merged: Record<string, string | number | undefined | null> = {
      ...baseCategoryParams(),
      q: filters.q,
      country_id: filters.country_id,
      state_id: filters.state_id,
      city_id: filters.city_id,
      city: filters.city,
      bedrooms: filters.bedrooms,
      price_min: filters.price_min,
      price_max: filters.price_max,
      sort: filters.sort && filters.sort !== "latest" ? filters.sort : undefined,
      featured: filters.featured,
      ...patch,
    };
    setIsMobileSidebarOpen(false);
    router.push(buildPropertiesHref(merged));
  };

  const handleSelectAllCategories = () => {
    navigateWithPatch({
      sub_category: undefined,
      child_category: undefined,
    });
  };

  const handleSelectCategory = (selection: CategorySelection) => {
    navigateWithPatch({
      sub_category: selection.sub_category,
      child_category: selection.child_category,
    });
  };

  const handleApplyFilters = () => {
    navigateWithPatch({
      q: searchTerm.trim() || undefined,
      country_id: countryId || undefined,
      state_id: stateId || undefined,
      city_id: cityId || undefined,
      bedrooms: bedrooms || undefined,
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
      sort: sort && sort !== "latest" ? sort : undefined,
    });
  };

  const handleClearFilters = (keepCategory = true) => {
    setSearchTerm("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setStates([]);
    setCities([]);
    setBedrooms("");
    setPriceMin("");
    setPriceMax("");
    setSort("latest");

    setIsMobileSidebarOpen(false);
    router.push(
      buildPropertiesHref({
        ...(keepCategory ? baseCategoryParams() : { listing_type: currentListing }),
      })
    );
  };

  const listingTabs = [
    { key: "auction", label: "Auctions", mobileLabel: "Auction" },
    { key: "normal", label: "Normal Products", mobileLabel: "Normal" },
  ] as const;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "All Properties",
      active: !currentSubcategory && !currentChildCategory,
    },
  ];

  if (currentSubcategory) {
    breadcrumbs.push({
      label: currentSubcategory.name,
      active: !currentChildCategory,
      selection: { sub_category: currentSubcategory.slug },
    });
  }
  if (currentChildCategory) {
    breadcrumbs.push({
      label: currentChildCategory.name,
      active: true,
      selection: {
        sub_category: currentSubcategory?.slug,
        child_category: currentChildCategory.slug,
      },
    });
  }

  const activeFilterChips: FilterChip[] = [];

  if (filters.q) {
    activeFilterChips.push({
      key: "q",
      label: `Search: ${filters.q}`,
      onRemove: () => navigateWithPatch({ q: undefined }),
    });
  }

  if (filters.price_min != null || filters.price_max != null) {
    const priceLabel =
      filters.price_min != null && filters.price_max != null
        ? `Price: ${filters.price_min} - ${filters.price_max}`
        : filters.price_min != null
          ? `Min Price: ${filters.price_min}`
          : `Max Price: ${filters.price_max}`;
    activeFilterChips.push({
      key: "price",
      label: priceLabel,
      onRemove: () =>
        navigateWithPatch({ price_min: undefined, price_max: undefined }),
    });
  }

  if (filters.bedrooms != null) {
    activeFilterChips.push({
      key: "bedrooms",
      label: `Bedrooms: ${filters.bedrooms}+`,
      onRemove: () => navigateWithPatch({ bedrooms: undefined }),
    });
  }

  if (filters.country_id) {
    const countryName =
      countries.find((c) => String(c.id) === String(filters.country_id))?.name ||
      "Selected";
    activeFilterChips.push({
      key: "country",
      label: `Country: ${countryName}`,
      onRemove: () =>
        navigateWithPatch({
          country_id: undefined,
          state_id: undefined,
          city_id: undefined,
        }),
    });
  }

  if (filters.state_id) {
    const stateName =
      states.find((s) => String(s.id) === String(filters.state_id))?.name ||
      "Selected";
    activeFilterChips.push({
      key: "state",
      label: `State: ${stateName}`,
      onRemove: () =>
        navigateWithPatch({ state_id: undefined, city_id: undefined }),
    });
  }

  if (filters.city_id || filters.city) {
    const cityName =
      cities.find((c) => String(c.id) === String(filters.city_id))?.name ||
      filters.city ||
      "Selected";
    activeFilterChips.push({
      key: "city",
      label: `City: ${cityName}`,
      onRemove: () =>
        navigateWithPatch({ city_id: undefined, city: undefined }),
    });
  }

  if (filters.sort && filters.sort !== "latest" && SORT_LABELS[filters.sort]) {
    activeFilterChips.push({
      key: "sort",
      label: `Sort: ${SORT_LABELS[filters.sort]}`,
      onRemove: () => navigateWithPatch({ sort: undefined }),
    });
  }

  if (filters.featured === 1) {
    activeFilterChips.push({
      key: "featured",
      label: "Featured Only",
      onRemove: () => navigateWithPatch({ featured: undefined }),
    });
  }

  const sidebarFilterCount = activeFilterChips.length;
  const cleanShortSeo = sanitizeSeoHtml(seoShortContent);
  const cleanLongSeo = sanitizeSeoHtml(seoContent);

  return (
    <div className="container-fluid px-3 px-lg-5 pb-4">
      <div className="marketplace-workspace">
        <MarketplaceSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          purposeCategories={purposeCategories}
          currentSubcategory={currentSubcategory}
          currentChildCategory={currentChildCategory}
          onSelectAllCategories={handleSelectAllCategories}
          onSelectCategory={handleSelectCategory}
          searchTerm={searchTerm}
          onChangeSearchTerm={setSearchTerm}
          priceMin={priceMin}
          onChangePriceMin={setPriceMin}
          priceMax={priceMax}
          onChangePriceMax={setPriceMax}
          bedrooms={bedrooms}
          onChangeBedrooms={setBedrooms}
          countries={countries}
          states={states}
          cities={cities}
          countryId={countryId}
          onChangeCountry={(val) => {
            setCountryId(val);
            setStateId("");
            setCityId("");
          }}
          stateId={stateId}
          onChangeState={(val) => {
            setStateId(val);
            setCityId("");
          }}
          cityId={cityId}
          onChangeCity={setCityId}
          sort={sort}
          onChangeSort={setSort}
          onApplyFilters={handleApplyFilters}
          onClearFilters={() => handleClearFilters(true)}
          activeFilterCount={sidebarFilterCount}
        />

        <div className="mkt-right marketplace-main-content">
          <div className="mp-workspace-toolbar">
            <div className="mp-toolbar-top-row">
              <div className="mp-title-block">
                <nav className="mp-breadcrumbs" aria-label="Breadcrumb">
                  {breadcrumbs.map((crumb, idx) => (
                    <Fragment key={`${crumb.label}-${idx}`}>
                      {idx > 0 ? <span className="mp-breadcrumb-sep">/</span> : null}
                      {crumb.active ? (
                        <span className="mp-breadcrumb-current">{crumb.label}</span>
                      ) : (
                        <button
                          type="button"
                          className="mp-breadcrumb-link"
                          onClick={() =>
                            crumb.selection
                              ? handleSelectCategory(crumb.selection)
                              : handleSelectAllCategories()
                          }
                        >
                          {crumb.label}
                        </button>
                      )}
                    </Fragment>
                  ))}
                </nav>

                <div className="mp-heading-wrap">
                  <h1>{headingTitle}</h1>
                  <span className="mp-result-badge">
                    {initialMeta.total}{" "}
                    {initialMeta.total === 1 ? "listing" : "listings"}
                  </span>
                </div>
              </div>

              <div className="mp-toolbar-actions">
                <button
                  type="button"
                  className="mp-mobile-drawer-trigger d-lg-none"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <i className="fa-solid fa-sliders" aria-hidden="true" />
                  <span>Categories &amp; Filters</span>
                  {sidebarFilterCount > 0 ? (
                    <span className="mp-filter-count-pill">{sidebarFilterCount}</span>
                  ) : null}
                </button>

                <div className="marketplace-top-tabs" role="tablist" aria-label="Listing types">
                  {listingTabs.map((tab) => {
                    const active = currentListing === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => navigateWithPatch({ listing_type: tab.key })}
                        className={`marketplace-top-tab${active ? " is-active" : ""}`}
                      >
                        <span className="d-none d-sm-inline">{tab.label}</span>
                        <span className="d-inline d-sm-none">{tab.mobileLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {activeFilterChips.length > 0 ? (
              <div className="mp-active-chips-row">
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className="mp-active-chip"
                    onClick={chip.onRemove}
                    title="Remove filter"
                  >
                    <span>{chip.label}</span>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </button>
                ))}
                <button
                  type="button"
                  className="mp-clear-all-chips-btn"
                  onClick={() => handleClearFilters(true)}
                >
                  Clear All
                </button>
              </div>
            ) : null}
          </div>

          {cleanShortSeo ? (
            <div className="content-wrapper content-wrapper-short mb-4 text-dark">
              <div dangerouslySetInnerHTML={{ __html: cleanShortSeo }} />
            </div>
          ) : null}

          <section className="marketplace-latest-grid-section">
            {initialItems.length ? (
              <LoadMoreProperties
                key={loadMoreKey}
                initialItems={initialItems}
                initialMeta={initialMeta}
                filters={filters}
                gridClassName="row g-3 g-md-4"
                itemClassName="col-12 col-sm-6 col-xl-4"
                titleMaxLength={18}
                singleLineTitle
                inlineDiscountPrice
              />
            ) : (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border mt-3 px-3">
                <h3 className="h5 fw-bold text-dark">No Properties Found</h3>
                <p className="text-muted mb-3">
                  We couldn&apos;t find any listings matching your current selection.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    activeFilterChips.length > 0
                      ? handleClearFilters(true)
                      : handleSelectAllCategories()
                  }
                  className="mp-empty-reset-btn"
                >
                  {activeFilterChips.length > 0
                    ? "Clear Active Filters"
                    : "Browse All Categories"}
                </button>
              </div>
            )}
          </section>

          {cleanLongSeo ? (
            <div className="content-wrapper content-wrapper-long mt-5 text-dark">
              <div dangerouslySetInnerHTML={{ __html: cleanLongSeo }} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

