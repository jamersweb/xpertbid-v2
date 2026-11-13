"use client";

import type { KeyboardEvent } from "react";
import type { CategoryNode, LocationItem } from "@/types/property";

export type CategorySelection = {
  type?: string;
  sub_category?: string;
  child_category?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  rootCategories: CategoryNode[];
  fallbackCategories?: CategoryNode[];
  currentMainCategory: CategoryNode | null;
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

function slugMatches(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (left === right) return true;
  if (left.startsWith(`${right}-p`) || left.startsWith(`${right}-s`)) return true;
  if (right.startsWith(`${left}-p`) || right.startsWith(`${left}-s`)) return true;
  return false;
}

export function MarketplaceSidebar({
  isOpen,
  onClose,
  rootCategories,
  fallbackCategories = [],
  currentMainCategory,
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
  const activeRootList =
    rootCategories.length > 0 ? rootCategories : fallbackCategories;
  const usingMainVerticals = rootCategories.length > 0;

  const subLevelList = currentMainCategory?.children || [];
  const childLevelList = currentSubcategory?.children || [];
  const showChildLevel = Boolean(currentSubcategory && childLevelList.length > 0);
  const showSubLevel = !showChildLevel && Boolean(currentMainCategory);

  const sectionHeading = showChildLevel
    ? currentSubcategory?.name || "Categories"
    : currentMainCategory
      ? currentMainCategory.name
      : "Categories";

  const hasAnyCategorySelected = Boolean(
    currentMainCategory || currentSubcategory || currentChildCategory
  );

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
              <h4>{sectionHeading}</h4>
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
                    onClick={() =>
                      currentMainCategory
                        ? handleSelect({ type: currentMainCategory.slug })
                        : handleAllClick()
                    }
                    className="mp-cat-back-btn"
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    <span>
                      {currentMainCategory
                        ? `Back to ${currentMainCategory.name}`
                        : "All Categories"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelect({
                        type: currentMainCategory?.slug,
                        sub_category: currentSubcategory.slug,
                      })
                    }
                    className={`mp-cat-item mp-cat-root-btn${
                      !currentChildCategory ? " is-active" : ""
                    }`}
                  >
                    <span className="mp-cat-label">All {currentSubcategory.name}</span>
                  </button>

                  {childLevelList.map((child) => {
                    const active = slugMatches(currentChildCategory?.slug, child.slug);
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          handleSelect({
                            type: currentMainCategory?.slug,
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
              ) : showSubLevel && currentMainCategory ? (
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
                    onClick={() => handleSelect({ type: currentMainCategory.slug })}
                    className={`mp-cat-item mp-cat-root-btn${
                      !currentSubcategory ? " is-active" : ""
                    }`}
                  >
                    <span className="mp-cat-label">All {currentMainCategory.name}</span>
                  </button>

                  {subLevelList.length > 0 ? (
                    subLevelList.map((sub) => {
                      const active = slugMatches(currentSubcategory?.slug, sub.slug);
                      const hasChildren = (sub.children || []).length > 0;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() =>
                            handleSelect({
                              type: currentMainCategory.slug,
                              sub_category: sub.slug,
                            })
                          }
                          className={`mp-cat-row mp-cat-root-btn${active ? " is-active" : ""}`}
                        >
                          <span className="mp-cat-label">{sub.name}</span>
                          {hasChildren ? (
                            <i
                              className="fa-solid fa-chevron-right mp-cat-chevron"
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className="mp-cat-empty-hint mb-0">
                      No subcategories in this category.
                    </p>
                  )}
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
                    <span className="mp-cat-label">All Categories</span>
                  </button>

                  {activeRootList.map((item) => {
                    const hasChildren = (item.children || []).length > 0;
                    const active = usingMainVerticals
                      ? slugMatches(currentMainCategory?.slug, item.slug)
                      : slugMatches(currentSubcategory?.slug, item.slug);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSelect(
                            usingMainVerticals
                              ? { type: item.slug }
                              : { sub_category: item.slug }
                          )
                        }
                        className={`mp-cat-row mp-cat-root-btn${active ? " is-active" : ""}`}
                      >
                        <span className="mp-cat-label">{item.name}</span>
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
                placeholder="Search products..."
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

