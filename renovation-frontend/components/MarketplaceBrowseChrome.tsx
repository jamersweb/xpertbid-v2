"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCities, getStates } from "@/lib/api/client";
import type { LocationItem } from "@/types/property";

type Props = {
  countries: LocationItem[];
  defaults: {
    q?: string;
    country_id?: number;
    state_id?: number;
    city_id?: number;
    bedrooms?: number;
    price_min?: number;
    price_max?: number;
    sort?: string;
    sub_category?: string;
    child_category?: string;
    listing_type?: string;
  };
};

function buildHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, value);
  });
  const s = qs.toString();
  return s ? `/properties?${s}` : "/properties";
}

export function MarketplaceBrowseChrome({ countries, defaults }: Props) {
  const router = useRouter();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRafRef = useRef<number | null>(null);

  const [searchTerm, setSearchTerm] = useState(defaults.q || "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);

  const [countryId, setCountryId] = useState(
    defaults.country_id ? String(defaults.country_id) : ""
  );
  const [stateId, setStateId] = useState(
    defaults.state_id ? String(defaults.state_id) : ""
  );
  const [cityId, setCityId] = useState(
    defaults.city_id ? String(defaults.city_id) : ""
  );
  const [states, setStates] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);

  const [bedrooms, setBedrooms] = useState(
    defaults.bedrooms != null ? String(defaults.bedrooms) : ""
  );
  const [priceMin, setPriceMin] = useState(
    defaults.price_min != null ? String(defaults.price_min) : ""
  );
  const [priceMax, setPriceMax] = useState(
    defaults.price_max != null ? String(defaults.price_max) : ""
  );
  const [sort, setSort] = useState(defaults.sort || "latest");

  const baseParams = {
    sub_category: defaults.sub_category,
    child_category: defaults.child_category,
    listing_type: defaults.listing_type || "normal",
  };

  const filterParams = () => ({
    ...baseParams,
    q: searchTerm.trim() || undefined,
    country_id: countryId || undefined,
    state_id: stateId || undefined,
    city_id: cityId || undefined,
    bedrooms: bedrooms || undefined,
    price_min: priceMin || undefined,
    price_max: priceMax || undefined,
    sort: sort || undefined,
  });

  const openDrawer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openRafRef.current) {
      cancelAnimationFrame(openRafRef.current);
      openRafRef.current = null;
    }

    setDrawerMounted(true);
    setDrawerOpen(false);

    openRafRef.current = requestAnimationFrame(() => {
      openRafRef.current = null;
      requestAnimationFrame(() => setDrawerOpen(true));
    });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (drawerOpen) {
      setDrawerMounted(true);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      return;
    }

    if (drawerMounted) {
      closeTimerRef.current = setTimeout(() => {
        setDrawerMounted(false);
        closeTimerRef.current = null;
      }, 350);
    }
  }, [drawerOpen, drawerMounted]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (openRafRef.current) cancelAnimationFrame(openRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    setSearchTerm(defaults.q || "");
    setCountryId(defaults.country_id ? String(defaults.country_id) : "");
    setStateId(defaults.state_id ? String(defaults.state_id) : "");
    setCityId(defaults.city_id ? String(defaults.city_id) : "");
    setBedrooms(defaults.bedrooms != null ? String(defaults.bedrooms) : "");
    setPriceMin(defaults.price_min != null ? String(defaults.price_min) : "");
    setPriceMax(defaults.price_max != null ? String(defaults.price_max) : "");
    setSort(defaults.sort || "latest");
  }, [
    defaults.q,
    defaults.country_id,
    defaults.state_id,
    defaults.city_id,
    defaults.bedrooms,
    defaults.price_min,
    defaults.price_max,
    defaults.sort,
  ]);

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
        if (!next.find((s) => String(s.id) === stateId)) {
          setStateId("");
          setCities([]);
          setCityId("");
        }
      } catch {
        if (!cancelled) {
          setStates([]);
          setStateId("");
          setCities([]);
          setCityId("");
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
        if (!next.find((c) => String(c.id) === cityId)) {
          setCityId("");
        }
      } catch {
        if (!cancelled) {
          setCities([]);
          setCityId("");
        }
      }
    }

    loadCities();
    return () => {
      cancelled = true;
    };
  }, [stateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(buildHref(filterParams()));
  };

  const applyFilters = () => {
    closeDrawer();
    router.push(buildHref(filterParams()));
  };

  const clearFilters = () => {
    setCountryId("");
    setStateId("");
    setCityId("");
    setStates([]);
    setCities([]);
    setBedrooms("");
    setPriceMin("");
    setPriceMax("");
    setSort("latest");
    closeDrawer();
    router.push(
      buildHref({
        ...baseParams,
        q: searchTerm.trim() || undefined,
      })
    );
  };

  return (
    <>
      <form onSubmit={submitSearch} className="marketplace-searchbar mb-3">
        <div className="marketplace-searchbar-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
          />
          <button
            type="button"
            className="marketplace-filter-btn"
            onClick={openDrawer}
            aria-label="Open filters"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </form>

      {drawerMounted ? (
        <>
          <div
            className={`marketplace-filter-backdrop${drawerOpen ? " is-open" : ""}`}
            onClick={closeDrawer}
            aria-hidden={!drawerOpen}
          />

          <aside
            className={`marketplace-filter-drawer${drawerOpen ? " is-open" : ""}`}
            aria-hidden={!drawerOpen}
          >
            <div className="marketplace-filter-header">
              <h3>Filters</h3>
              <button type="button" onClick={closeDrawer} aria-label="Close filters">
                &times;
              </button>
            </div>

            <div className="marketplace-filter-body">
              <div className="marketplace-filter-group">
                <label htmlFor="filter-country">Country</label>
                <select
                  id="filter-country"
                  value={countryId}
                  onChange={(e) => {
                    setCountryId(e.target.value);
                    setStateId("");
                    setCityId("");
                  }}
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-state">State</label>
                <select
                  id="filter-state"
                  value={stateId}
                  onChange={(e) => {
                    setStateId(e.target.value);
                    setCityId("");
                  }}
                  disabled={!countryId}
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-city">City</label>
                <select
                  id="filter-city"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  disabled={!stateId}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-bedrooms">Bedrooms</label>
                <select
                  id="filter-bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={String(n)}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-price-min">Min price</label>
                <input
                  id="filter-price-min"
                  type="number"
                  min={0}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                />
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-price-max">Max price</label>
                <input
                  id="filter-price-max"
                  type="number"
                  min={0}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                />
              </div>

              <div className="marketplace-filter-group">
                <label htmlFor="filter-sort">Sort</label>
                <select
                  id="filter-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price ↑</option>
                  <option value="price_desc">Price ↓</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>

            <div className="marketplace-filter-footer">
              <button type="button" className="filter-clear-btn" onClick={clearFilters}>
                Clear
              </button>
              <button type="button" className="filter-apply-btn" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
