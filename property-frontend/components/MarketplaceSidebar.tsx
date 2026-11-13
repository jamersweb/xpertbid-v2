"use client";

import type { KeyboardEvent } from "react";
import type { CategoryNode, LocationItem } from "@/types/property";

export type CategorySelection = {
  sub_category?: string;
  child_category?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  purposeCategories: CategoryNode[];
  currentSubcategory: CategoryNode | null;
  currentChildCategory: CategoryNode | null;
  onSelectAllCategories: () => void;
  onSelectCategory: (selection: CategorySelection) => void;
  searchTerm: string;
  onChangeSearchTerm: (value: string) => void;
  priceMin: string;
  onChangePriceMin: (value: string) => void;
  priceMax: string;
  onChangePriceMax: (value: string) => void;
  bedrooms: string;
  onChangeBedrooms: (value: string) => void;
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
  countryId: string;
  onChangeCountry: (value: string) => void;
  stateId: string;
  onChangeState: (value: string) => void;
  cityId: string;
  onChangeCity: (value: string) => void;
  sort: string;
  onChangeSort: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  activeFilterCount: number;
};

export function MarketplaceSidebar({
  isOpen,
  onClose,
  purposeCategories,
  currentSubcategory,
  currentChildCategory,
  onSelectAllCategories,
  onSelectCategory,
  searchTerm,
  onChangeSearchTerm,
  priceMin,
  onChangePriceMin,
  priceMax,
  onChangePriceMax,
  bedrooms,
  onChangeBedrooms,
  countries,
  states,
  cities,
  countryId,
  onChangeCountry,
  stateId,
  onChangeState,
  cityId,
  onChangeCity,
  sort,
  onChangeSort,
  onApplyFilters,
  onClearFilters,
  activeFilterCount,
}: Props) {
  const childList = currentSubcategory?.children || [];
  const showChildLevel = Boolean(currentSubcategory && childList.length > 0);
  const hasAnyCategorySelected = Boolean(currentSubcategory || currentChildCategory);

  const handleAllClick = () => {
    onSelectAllCategories();
    onClose();
  };

  const handleSelect = (selection: CategorySelection) => {
    onSelectCategory(selection);
    onClose();
  };

  const handleEnterApply = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApplyFilters();
    }
  };

  return (
    <>
      <div
        className={`mp-sidebar-backdrop d-lg-none${isOpen ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`mp-sidebar${isOpen ? " is-open" : ""}`}
        aria-label="Categories and filters"
      >
        <div className="mp-sidebar-mobile-head d-flex d-lg-none">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-sliders mp-accent-icon" aria-hidden="true" />
            <h3>Categories &amp; Filters</h3>
            {activeFilterCount > 0 ? (
              <span className="mp-filter-count-pill">{activeFilterCount}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="mp-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close categories and filters"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="mp-sidebar-scroll-body">
          {/* Daraz-style Drill-down Scrollable Categories */}
          <section className="mp-sidebar-section">
            <div className="mp-sidebar-section-head">
              <h4>{showChildLevel ? currentSubcategory?.name : "Categories"}</h4>
              {hasAnyCategorySelected ? (
                <button
                  type="button"
                  className="mp-sidebar-reset-link"
                  onClick={handleAllClick}
                >
                  All Categories
                </button>
              ) : null}
            </div>

            <div className="mp-cat-scroll-list">
              {showChildLevel && currentSubcategory ? (
                <>
                  <button
                    type="button"
                    onClick={handleAllClick}
                    className="mp-cat-back-btn"
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    <span>All Categories</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelect({ sub_category: currentSubcategory.slug })
                    }
                    className={`mp-cat-item mp-cat-root-btn${
                      !currentChildCategory ? " is-active" : ""
                    }`}
                  >
                    <span className="mp-cat-label">All {currentSubcategory.name}</span>
                  </button>

                  {childList.map((child) => {
                    const active = currentChildCategory?.slug === child.slug;
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          handleSelect({
                            sub_category: currentSubcategory.slug,
                            child_category: child.slug,
                          })
                        }
                        className={`mp-cat-row mp-cat-root-btn${active ? " is-active" : ""}`}
                      >
                        <span className="mp-cat-label">{child.name}</span>
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAllClick}
                    className={`mp-cat-item mp-cat-root-btn${
                      !hasAnyCategorySelected ? " is-active" : ""
                    }`}
                  >
                    <span className="mp-cat-label">All Properties</span>
                  </button>

                  {purposeCategories.map((purpose) => {
                    const hasChildren = (purpose.children || []).length > 0;
                    const active = currentSubcategory?.slug === purpose.slug;
                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        onClick={() =>
                          handleSelect({ sub_category: purpose.slug })
                        }
                        className={`mp-cat-row mp-cat-root-btn${active ? " is-active" : ""}`}
                      >
                        <span className="mp-cat-label">{purpose.name}</span>
                        {hasChildren ? (
                          <i
                            className="fa-solid fa-chevron-right mp-cat-chevron"
                            aria-hidden="true"
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </section>

          {/* Filters Section */}
          <section className="mp-sidebar-section mp-sidebar-filters-section">
            <div className="mp-sidebar-section-head">
              <div className="d-flex align-items-center gap-2">
                <h4>Filters</h4>
                {activeFilterCount > 0 ? (
                  <span className="mp-filter-count-pill">{activeFilterCount}</span>
                ) : null}
              </div>
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  className="mp-sidebar-reset-link"
                  onClick={onClearFilters}
                >
                  Clear All
                </button>
              ) : null}
            </div>

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-search">Search</label>
              <input
                id="mp-filter-search"
                type="text"
                value={searchTerm}
                onChange={(e) => onChangeSearchTerm(e.target.value)}
                onKeyDown={handleEnterApply}
                placeholder="Search properties..."
              />
            </div>

            <div className="mp-filter-group">
              <label>Price Range</label>
              <div className="mp-price-range-row">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => onChangePriceMin(e.target.value)}
                  onKeyDown={handleEnterApply}
                  aria-label="Minimum price"
                />
                <span className="mp-price-sep">-</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => onChangePriceMax(e.target.value)}
                  onKeyDown={handleEnterApply}
                  aria-label="Maximum price"
                />
              </div>
            </div>

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-bedrooms">Bedrooms</label>
              <select
                id="mp-filter-bedrooms"
                value={bedrooms}
                onChange={(e) => onChangeBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}+ Bedrooms
                  </option>
                ))}
              </select>
            </div>

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-country">Country</label>
              <select
                id="mp-filter-country"
                value={countryId}
                onChange={(e) => onChangeCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-state">State</label>
              <select
                id="mp-filter-state"
                value={stateId}
                onChange={(e) => onChangeState(e.target.value)}
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

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-city">City</label>
              <select
                id="mp-filter-city"
                value={cityId}
                onChange={(e) => onChangeCity(e.target.value)}
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

            <div className="mp-filter-group">
              <label htmlFor="mp-filter-sort">Sort By</label>
              <select
                id="mp-filter-sort"
                value={sort}
                onChange={(e) => onChangeSort(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </section>
        </div>

        <div className="mp-sidebar-footer">
          <button type="button" className="mp-filter-clear-btn" onClick={onClearFilters}>
            Clear
          </button>
          <button type="button" className="mp-filter-apply-btn" onClick={onApplyFilters}>
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}

