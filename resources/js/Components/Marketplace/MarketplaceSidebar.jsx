import React from 'react';

const parseDynamicOptions = (options) => {
       if (Array.isArray(options)) {
              return options.filter((item) => String(item || '').trim() !== '');
       }

       if (typeof options === 'string') {
              const trimmed = options.trim();
              if (trimmed === '') {
                     return [];
              }

              try {
                     const parsed = JSON.parse(trimmed);
                     if (Array.isArray(parsed)) {
                            return parsed.filter((item) => String(item || '').trim() !== '');
                     }
              } catch (error) {
                     // Fallback to comma split for non-JSON values.
              }

              return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
       }

       return [];
};

const getSubCategories = (category) => {
       const list = category?.sub_categories || category?.subCategories;
       return Array.isArray(list) ? list : [];
};

const getChildCategories = (subCategory) => {
       const list = subCategory?.child_categories || subCategory?.childCategories;
       return Array.isArray(list) ? list : [];
};

export default function MarketplaceSidebar({
       isOpen = false,
       onClose,
       categories = [],
       currentCategory = null,
       currentTopCategory = null,
       currentSubcategory = null,
       subcategoryTabs = [],
       childCategoryTabs = [],
       onSelectAllCategories,
       onSelectCategory,
       countries = [],
       states = [],
       cities = [],
       selectedCountryId = '',
       onChangeCountry,
       selectedStateId = '',
       onChangeState,
       selectedCityId = '',
       onChangeCity,
       priceMin = '',
       onChangePriceMin,
       priceMax = '',
       onChangePriceMax,
       dynamicFields = [],
       dynamicFilterValues = {},
       onChangeDynamicValue,
       onChangeCheckboxDynamic,
       onApplyFilters,
       onClearFilters,
       activeFilterCount = 0,
}) {
       const handleCategoryClick = (categoryObj) => {
              onSelectCategory(categoryObj);
              onClose?.();
       };

       const handleAllClick = () => {
              onSelectAllCategories();
              onClose?.();
       };

       const handlePriceKeyDown = (e) => {
              if (e.key === 'Enter') {
                     e.preventDefault();
                     onApplyFilters();
              }
       };

       const currentSlug = currentCategory?.slug || '';
       const isAllSelected = !currentCategory && !currentTopCategory;
       const showChildLevel = Boolean(currentTopCategory && currentSubcategory && childCategoryTabs.length > 0);
       const activeSubcategories = currentTopCategory
              ? (subcategoryTabs.length > 0 ? subcategoryTabs : getSubCategories(currentTopCategory))
              : [];

       return (
              <>
                     <div
                            className={`mp-sidebar-backdrop d-lg-none ${isOpen ? 'is-open' : ''}`}
                            onClick={onClose}
                            aria-hidden="true"
                     />

                     <aside
                            className={`mp-sidebar ${isOpen ? 'is-open' : ''}`}
                            aria-label="Categories and filters"
                     >
                            <div className="mp-sidebar-mobile-head d-flex d-lg-none">
                                   <div className="d-flex align-items-center gap-2">
                                          <i className="fa-solid fa-sliders mp-accent-icon" aria-hidden="true" />
                                          <h3>Categories &amp; Filters</h3>
                                          {activeFilterCount > 0 && (
                                                 <span className="mp-filter-count-pill">{activeFilterCount}</span>
                                          )}
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
                                   {/* Daraz-style Drill-down Scrollable Categories Section */}
                                   <section className="mp-sidebar-section">
                                          <div className="mp-sidebar-section-head">
                                                 <h4>
                                                        {showChildLevel
                                                               ? currentSubcategory.name
                                                               : currentTopCategory
                                                                      ? currentTopCategory.name
                                                                      : 'Categories'}
                                                 </h4>
                                                 {!isAllSelected && (
                                                        <button
                                                               type="button"
                                                               className="mp-sidebar-reset-link"
                                                               onClick={handleAllClick}
                                                        >
                                                               All Categories
                                                        </button>
                                                 )}
                                          </div>

                                          <div className="mp-cat-scroll-list">
                                                 {!currentTopCategory ? (
                                                        <>
                                                               <button
                                                                      type="button"
                                                                      onClick={handleAllClick}
                                                                      className={`mp-cat-item mp-cat-root-btn ${isAllSelected ? 'is-active' : ''}`}
                                                               >
                                                                      <span className="mp-cat-label">All Categories</span>
                                                               </button>

                                                               {categories.map((root) => (
                                                                      <button
                                                                             key={root.id}
                                                                             type="button"
                                                                             onClick={() => handleCategoryClick(root)}
                                                                             className={`mp-cat-row mp-cat-root-btn ${currentSlug === root.slug ? 'is-active' : ''}`}
                                                                      >
                                                                             <span className="mp-cat-label">{root.name}</span>
                                                                             <i className="fa-solid fa-chevron-right mp-cat-chevron" aria-hidden="true" />
                                                                      </button>
                                                               ))}
                                                        </>
                                                 ) : showChildLevel ? (
                                                        <>
                                                               <button
                                                                      type="button"
                                                                      onClick={() => handleCategoryClick(currentTopCategory)}
                                                                      className="mp-cat-back-btn"
                                                               >
                                                                      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                                                                      <span>Back to {currentTopCategory.name}</span>
                                                               </button>

                                                               <button
                                                                      type="button"
                                                                      onClick={() => handleCategoryClick(currentSubcategory)}
                                                                      className={`mp-cat-item mp-cat-root-btn ${currentSlug === currentSubcategory.slug ? 'is-active' : ''}`}
                                                               >
                                                                      <span className="mp-cat-label">All {currentSubcategory.name}</span>
                                                               </button>

                                                               {childCategoryTabs.map((child) => (
                                                                      <button
                                                                             key={child.id}
                                                                             type="button"
                                                                             onClick={() => handleCategoryClick(child)}
                                                                             className={`mp-cat-row mp-cat-root-btn ${currentSlug === child.slug ? 'is-active' : ''}`}
                                                                      >
                                                                             <span className="mp-cat-label">{child.name}</span>
                                                                      </button>
                                                               ))}
                                                        </>
                                                 ) : (
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
                                                                      onClick={() => handleCategoryClick(currentTopCategory)}
                                                                      className={`mp-cat-item mp-cat-root-btn ${currentSlug === currentTopCategory.slug ? 'is-active' : ''}`}
                                                               >
                                                                      <span className="mp-cat-label">All {currentTopCategory.name}</span>
                                                               </button>

                                                               {activeSubcategories.length > 0 ? (
                                                                      activeSubcategories.map((sub) => {
                                                                             const hasChildren = getChildCategories(sub).length > 0;
                                                                             return (
                                                                                    <button
                                                                                           key={sub.id}
                                                                                           type="button"
                                                                                           onClick={() => handleCategoryClick(sub)}
                                                                                           className={`mp-cat-row mp-cat-root-btn ${currentSlug === sub.slug ? 'is-active' : ''}`}
                                                                                    >
                                                                                           <span className="mp-cat-label">{sub.name}</span>
                                                                                           {hasChildren && (
                                                                                                  <i className="fa-solid fa-chevron-right mp-cat-chevron" aria-hidden="true" />
                                                                                           )}
                                                                                    </button>
                                                                             );
                                                                      })
                                                               ) : (
                                                                      <p className="mp-cat-empty-hint mb-0">
                                                                             No subcategories in this category.
                                                                      </p>
                                                               )}
                                                        </>
                                                 )}
                                          </div>
                                   </section>

                                   {/* Filters Section Right Below Categories */}
                                   <section className="mp-sidebar-section mp-sidebar-filters-section">
                                          <div className="mp-sidebar-section-head">
                                                 <div className="d-flex align-items-center gap-2">
                                                        <h4>Filters</h4>
                                                        {activeFilterCount > 0 && (
                                                               <span className="mp-filter-count-pill">{activeFilterCount}</span>
                                                        )}
                                                 </div>
                                                 {activeFilterCount > 0 && (
                                                        <button
                                                               type="button"
                                                               className="mp-sidebar-reset-link"
                                                               onClick={onClearFilters}
                                                        >
                                                               Clear All
                                                        </button>
                                                 )}
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
                                                               onKeyDown={handlePriceKeyDown}
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
                                                               onKeyDown={handlePriceKeyDown}
                                                               aria-label="Maximum price"
                                                        />
                                                 </div>
                                          </div>

                                          <div className="mp-filter-group">
                                                 <label htmlFor="mp-filter-country">Country</label>
                                                 <select
                                                        id="mp-filter-country"
                                                        value={selectedCountryId}
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
                                                        value={selectedStateId}
                                                        onChange={(e) => onChangeState(e.target.value)}
                                                        disabled={!selectedCountryId}
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
                                                        value={selectedCityId}
                                                        onChange={(e) => onChangeCity(e.target.value)}
                                                        disabled={!selectedStateId}
                                                 >
                                                        <option value="">All Cities</option>
                                                        {cities.map((city) => (
                                                               <option key={city.id} value={city.id}>
                                                                      {city.name}
                                                               </option>
                                                        ))}
                                                 </select>
                                          </div>

                                          {dynamicFields.map((field) => {
                                                 const key = `df_${field.id}`;
                                                 const inputType = String(field.input_type || '').toLowerCase();
                                                 const options = parseDynamicOptions(field.options);

                                                 if (options.length === 0) {
                                                        return null;
                                                 }

                                                 const fieldLabel = field.label || field.field_name || `Field ${field.id}`;
                                                 const selectedValue = dynamicFilterValues[key];

                                                 return (
                                                        <div className="mp-filter-group" key={field.id}>
                                                               <label>{fieldLabel}</label>

                                                               {inputType === 'radio' ? (
                                                                      <div className="mp-filter-options">
                                                                             {options.map((option) => (
                                                                                    <label key={`${field.id}-${option}`} className="mp-filter-option-row">
                                                                                           <input
                                                                                                  type="radio"
                                                                                                  name={`dynamic-radio-${field.id}`}
                                                                                                  value={option}
                                                                                                  checked={String(selectedValue || '') === option}
                                                                                                  onChange={() => onChangeDynamicValue(key, option)}
                                                                                           />
                                                                                           <span>{option}</span>
                                                                                    </label>
                                                                             ))}
                                                                      </div>
                                                               ) : inputType === 'checkbox' ? (
                                                                      <div className="mp-filter-options">
                                                                             {options.map((option) => {
                                                                                    const values = Array.isArray(selectedValue)
                                                                                           ? selectedValue
                                                                                           : selectedValue
                                                                                                  ? [String(selectedValue)]
                                                                                                  : [];

                                                                                    return (
                                                                                           <label key={`${field.id}-${option}`} className="mp-filter-option-row">
                                                                                                  <input
                                                                                                         type="checkbox"
                                                                                                         checked={values.includes(option)}
                                                                                                         onChange={(e) => onChangeCheckboxDynamic(field.id, option, e.target.checked)}
                                                                                                  />
                                                                                                  <span>{option}</span>
                                                                                           </label>
                                                                                    );
                                                                             })}
                                                                      </div>
                                                               ) : (
                                                                      <select
                                                                             value={Array.isArray(selectedValue) ? '' : selectedValue || ''}
                                                                             onChange={(e) => onChangeDynamicValue(key, e.target.value)}
                                                                      >
                                                                             <option value="">All</option>
                                                                             {options.map((option) => (
                                                                                    <option key={`${field.id}-${option}`} value={option}>
                                                                                           {option}
                                                                                    </option>
                                                                             ))}
                                                                      </select>
                                                               )}
                                                        </div>
                                                 );
                                          })}
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
