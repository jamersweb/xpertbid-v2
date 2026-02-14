import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

const OTHER_CATEGORY_OPTION = {
       id: "other_category",
       name: "Other",
       isOther: true,
};

const OTHER_SUBCATEGORY_OPTION = {
       id: "other_subcategory",
       name: "Other",
       isOther: true,
};

const OTHER_CHILD_CATEGORY_OPTION = {
       id: "other_childcategory",
       name: "Other",
       isOther: true,
};

export default function CategorySelection({ categories: initialCategories, onSelect, onBack, onSaveDraft, isSavingDraft }) {
       const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

       const [categories, setCategories] = useState(initialCategories || []);
       const [subCategories, setSubCategories] = useState([]);
       const [childCategories, setChildCategories] = useState([]);

       const [selectedCategory, setSelectedCategory] = useState(null);
       const [selectedSubCategory, setSelectedSubCategory] = useState(null);
       const [selectedChildCategory, setSelectedChildCategory] = useState(null);

       const [customCategoryBase, setCustomCategoryBase] = useState({
              category: "",
              sub: "",
              child: ""
       });

       // Helpers similar to sell.js
       const buildAbsoluteMediaUrl = (path) => {
              if (!path) return "https://admin.xpertbid.com/assets/images/category_images/1750684943_6859550f2948f.png";
              if (path.startsWith("http://") || path.startsWith("https://")) return path;
              const clean = path.replace(/^\/+/, "");
              return `https://admin.xpertbid.com/${clean}`;
       };

       const getCategoryMedia = (item) => {
              const candidate = item?.image || item?.icon || item?.thumbnail || item?.photo || item?.media;
              return buildAbsoluteMediaUrl(candidate);
       };

       const loadSubCategories = async (categoryId) => {
              if (!categoryId || categoryId === 'other_category') {
                     setSubCategories([]);
                     return;
              }
              try {
                     const response = await axios.get(`/get-subcategories/${categoryId}`);
                     setSubCategories(response.data.subcategories || []);
              } catch (error) {
                     console.error("Error loading subcategories", error);
              }
       };

       const loadChildCategories = async (subCategoryId) => {
              if (!subCategoryId || subCategoryId === 'other_subcategory') {
                     setChildCategories([]);
                     return;
              }
              try {
                     const response = await axios.get(`/get-childern/${subCategoryId}`);
                     setChildCategories(response.data.subcategories || []);
              } catch (error) {
                     console.error("Error loading child categories", error);
              }
       };

       const handleGridCategoryClick = (cat) => {
              setSelectedCategory(cat);
              setViewMode('list');

              setSelectedSubCategory(null);
              setSelectedChildCategory(null);
              setChildCategories([]);

              if (cat.id === 'other_category') {
                     setSubCategories([]);
              } else {
                     loadSubCategories(cat.id);
              }
       };

       const handleSubCategoryClick = (sub) => {
              setSelectedSubCategory(sub);
              setSelectedChildCategory(null);

              if (sub.id === 'other_subcategory') {
                     setChildCategories([]);
              } else {
                     loadChildCategories(sub.id);
              }
       };

       const handleChildCategoryClick = (child) => {
              setSelectedChildCategory(child);
       };

       // Custom input handler
       const handleCustomInputChange = (e, level) => {
              setCustomCategoryBase(prev => ({ ...prev, [level]: e.target.value }));
       };

       const canProceed = () => {
              if (!selectedCategory) return false;
              // Add logic: if subcategories exist, must select one. etc.
              // For sync purposes, we allow proceed if leaf is reached or no children exist
              if (selectedCategory.id === 'other_category') return !!customCategoryBase.category;

              if (subCategories.length > 0) {
                     if (!selectedSubCategory) return false;
                     if (selectedSubCategory.id === 'other_subcategory') return !!customCategoryBase.sub;

                     if (childCategories.length > 0) {
                            if (!selectedChildCategory) return false;
                            if (selectedChildCategory.id === 'other_childcategory') return !!customCategoryBase.child;
                     }
              }
              return true;
       };

       const handleContinue = () => {
              onSelect({
                     category: selectedCategory,
                     subCategory: selectedSubCategory,
                     childCategory: selectedChildCategory,
                     customInputs: customCategoryBase
              });
       };

       // Options Preparation
       const categoryOptions = [...categories, OTHER_CATEGORY_OPTION];
       const subCategoryOptions = selectedCategory ? [...subCategories, OTHER_SUBCATEGORY_OPTION] : [];
       const childCategoryOptions = selectedSubCategory ? [...childCategories, OTHER_CHILD_CATEGORY_OPTION] : [];

       // Grid View
       if (viewMode === 'grid') {
              return (
                     <section className="category-stage category-stage--active">
                            <div className="category-stage-header text-center position-relative">
                                   <button
                                          type="button"
                                          className="btn btn-black save-draft-btn-header"
                                          onClick={onSaveDraft}
                                          disabled={isSavingDraft || !onSaveDraft}
                                   >
                                          {isSavingDraft ? (
                                                 <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Saving...
                                                 </>
                                          ) : (
                                                 'Save Draft'
                                          )}
                                   </button>
                                   <h1 className="up-listing mb-2">Post Your Listing</h1>
                                   <p className="category-stage-subtitle">
                                          Choose a category that best matches your product.
                                   </p>

                                   {/* Summary Card Placeholder - skipped for brevity or added if needed */}
                            </div>

                            <div className="category-grid">
                                   {categoryOptions.map((category) => {
                                          const media = getCategoryMedia(category);
                                          return (
                                                 <button
                                                        type="button"
                                                        key={category.id}
                                                        className="category-grid-card shadow-sm"
                                                        onClick={() => handleGridCategoryClick(category)}
                                                 >
                                                        <div className="category-grid-thumb">
                                                               <img src={media} alt={category.name} />
                                                        </div>
                                                        <span className="category-grid-title">
                                                               {category.name}
                                                        </span>
                                                 </button>
                                          );
                                   })}
                            </div>

                            <div className="sell-back-home-wrapper sell-back-home-wrapper--secondary">
                                   <button onClick={onBack} className="btn btn-outline-secondary sell-back-home-btn me-2">Back</button>
                            </div>
                     </section>
              );
       }

       // List View
       return (
              <section className="category-stage category-stage--active">
                     <div className="category-stage-header text-center position-relative">
                            <button
                                   type="button"
                                   className="btn btn-black save-draft-btn-header"
                                   onClick={onSaveDraft}
                                   disabled={isSavingDraft || !onSaveDraft}
                            >
                                   {isSavingDraft ? (
                                          <>
                                                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                 Saving...
                                          </>
                                   ) : (
                                          'Save Draft'
                                   )}
                            </button>
                            <h1 className="up-listing mb-2">Post Your Listing</h1>
                            <p className="category-stage-subtitle">
                                   Choose a category that best matches your product.
                            </p>
                     </div>

                     <div className="category-list-wrapper">
                            <div className="category-columns">
                                   {/* Categories Column */}
                                   <div className="category-column">
                                          <div className="category-column-header">
                                                 <h3>Categories</h3>
                                          </div>
                                          <div className="category-column-body">
                                                 {categoryOptions.map((category) => {
                                                        const media = getCategoryMedia(category);
                                                        const isActive = selectedCategory && String(selectedCategory.id) === String(category.id);
                                                        return (
                                                               <button
                                                                      key={category.id}
                                                                      type="button"
                                                                      className={`category-list-item ${isActive ? "is-active" : ""}`}
                                                                      onClick={() => handleGridCategoryClick(category)}
                                                               >
                                                                      <div className="category-list-thumb">
                                                                             <img src={media} alt={category.name} />
                                                                      </div>
                                                                      <span>{category.name}</span>
                                                                      <i className="fa-solid fa-chevron-right"></i>
                                                               </button>
                                                        );
                                                 })}
                                          </div>
                                          {selectedCategory && selectedCategory.id === 'other_category' && (
                                                 <div className="custom-category-input mt-3">
                                                        <label>Create Your Own Category</label>
                                                        <input
                                                               type="text"
                                                               className="form-control"
                                                               placeholder="Enter custom category"
                                                               value={customCategoryBase.category}
                                                               onChange={(e) => handleCustomInputChange(e, 'category')}
                                                        />
                                                 </div>
                                          )}
                                   </div>

                                   {/* Subcategories Column */}
                                   {selectedCategory && selectedCategory.id !== 'other_category' && (
                                          <div className="category-column">
                                                 <div className="category-column-header">
                                                        <h3>Subcategories</h3>
                                                 </div>
                                                 <div className="category-column-body">
                                                        {(!subCategories || subCategories.length === 0) ? (
                                                               <p className="category-empty-state">No subcategories found. Choose "Other" to add your own.</p>
                                                        ) : null}

                                                        {subCategoryOptions.map((subCategory) => {
                                                               const isActive = selectedSubCategory && String(selectedSubCategory.id) === String(subCategory.id);
                                                               return (
                                                                      <button
                                                                             key={subCategory.id}
                                                                             type="button"
                                                                             className={`category-list-item ${isActive ? "is-active" : ""}`}
                                                                             onClick={() => handleSubCategoryClick(subCategory)}
                                                                      >
                                                                             <span>{subCategory.name}</span>
                                                                             <i className="fa-solid fa-chevron-right"></i>
                                                                      </button>
                                                               );
                                                        })}
                                                 </div>
                                                 {selectedSubCategory && selectedSubCategory.id === 'other_subcategory' && (
                                                        <div className="custom-category-input mt-3">
                                                               <label>Create Your Own Subcategory</label>
                                                               <input
                                                                      type="text"
                                                                      className="form-control"
                                                                      placeholder="Enter custom subcategory"
                                                                      value={customCategoryBase.sub}
                                                                      onChange={(e) => handleCustomInputChange(e, 'sub')}
                                                               />
                                                        </div>
                                                 )}
                                          </div>
                                   )}

                                   {/* Child Categories Column */}
                                   {selectedSubCategory && selectedSubCategory.id !== 'other_subcategory' && (
                                          <div className="category-column">
                                                 <div className="category-column-header">
                                                        <h3>Child Categories</h3>
                                                 </div>
                                                 <div className="category-column-body">
                                                        {(!childCategories || childCategories.length === 0) ? (
                                                               <p className="category-empty-state">No child categories found. Choose "Other" to add your own.</p>
                                                        ) : null}

                                                        {childCategoryOptions.map((child) => {
                                                               const isActive = selectedChildCategory && String(selectedChildCategory.id) === String(child.id);
                                                               return (
                                                                      <button
                                                                             key={child.id}
                                                                             type="button"
                                                                             className={`category-list-item ${isActive ? "is-active" : ""}`}
                                                                             onClick={() => handleChildCategoryClick(child)}
                                                                      >
                                                                             <span>{child.name}</span>
                                                                      </button>
                                                               );
                                                        })}
                                                 </div>
                                                 {selectedChildCategory && selectedChildCategory.id === 'other_childcategory' && (
                                                        <div className="custom-category-input mt-3">
                                                               <label>Create Your Own Child Category</label>
                                                               <input
                                                                      type="text"
                                                                      className="form-control"
                                                                      placeholder="Enter custom child category"
                                                                      value={customCategoryBase.child}
                                                                      onChange={(e) => handleCustomInputChange(e, 'child')}
                                                               />
                                                        </div>
                                                 )}
                                          </div>
                                   )}
                            </div>

                            <div className="category-stage-actions d-flex justify-content-between align-items-center">
                                   <button
                                          type="button"
                                          className="btn btn-black"
                                          onClick={() => setViewMode('grid')}
                                   >
                                          Back
                                   </button>
                                   <button
                                          type="button"
                                          className="btn btn-black"
                                          disabled={!canProceed()}
                                          onClick={handleContinue}
                                   >
                                          Continue
                                   </button>
                            </div>
                     </div>
              </section>
       );
}
