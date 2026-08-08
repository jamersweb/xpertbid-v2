import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import SummaryCard from './SummaryCard';
import 'react-quill/dist/quill.snow.css';

export default function DetailsForm({
       listType,
       formData,
       setFormData,
       countries = [],
       states = [],
       cities = [],
       summaryData,
       dynamicFields = [],
       onContinue,
       onBack,
       onEditListType,
       onEditCategory,
       onSaveDraft,
       isSavingDraft,
       progressPercent = 0
}) {
       const [errors, setErrors] = useState({});

       const parseFieldOptions = (options) => {
              if (Array.isArray(options)) return options;
              if (typeof options === 'string') {
                     try {
                            const parsed = JSON.parse(options);
                            return Array.isArray(parsed) ? parsed : [];
                     } catch {
                            return [];
                     }
              }
              return [];
       };

       const normalizedFieldName = (field) => {
              const raw = String(field?.field_name || '').trim();
              return raw || `field_${field?.id}`;
       };

       const getSafeFeatures = () => {
              const rawFeatures = formData?.category_features;
              if (!rawFeatures || typeof rawFeatures !== 'object' || Array.isArray(rawFeatures)) {
                     return {};
              }
              return rawFeatures;
       };

       const fieldNameCounts = (dynamicFields || []).reduce((acc, field) => {
              const base = normalizedFieldName(field);
              acc[base] = (acc[base] || 0) + 1;
              return acc;
       }, {});

       const getIdFeatureKey = (field) => `field_${field?.id}`;

       const getFeatureKey = (field) => {
              const base = normalizedFieldName(field);
              const idKey = getIdFeatureKey(field);
              return fieldNameCounts[base] > 1 ? `${base}__${field.id}` : (base || idKey);
       };

       const getFeatureValue = (field) => {
              const features = getSafeFeatures();
              const idKey = getIdFeatureKey(field);
              const key = getFeatureKey(field);
              const base = normalizedFieldName(field);
              return features[idKey] ?? features[key] ?? features[base] ?? '';
       };

       const updateFeatureValue = (field, value) => {
              const base = normalizedFieldName(field);
              const key = getFeatureKey(field);
              const idKey = getIdFeatureKey(field);
              const isDuplicateFieldName = fieldNameCounts[base] > 1;

              setFormData((prev) => {
                     const prevFeatures =
                            prev?.category_features && typeof prev.category_features === 'object' && !Array.isArray(prev.category_features)
                                   ? prev.category_features
                                   : {};

                     const nextFeatures = {
                            ...prevFeatures,
                            [idKey]: value,
                            [key]: value,
                     };

                     // Keep human-readable field_name key only when unique to avoid collisions.
                     if (!isDuplicateFieldName && base) {
                            nextFeatures[base] = value;
                     }

                     return {
                            ...prev,
                            category_features: nextFeatures,
                     };
              });
       };

       const handleChange = (e) => {
              const { name, value } = e.target;
              setFormData(prev => {
                     const next = { ...prev, [name]: value };

                     if (name === 'country_id') {
                            next.state_id = '';
                            next.city_id = '';
                     } else if (name === 'state_id') {
                            next.city_id = '';
                     }

                     return next;
              });
              if (errors[name]) {
                     setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[name];
                            return newErrors;
                     });
              }
       };

       const handleQuillChange = (content) => {
              setFormData(prev => ({ ...prev, description: content }));
       };

       const handleAddVariation = () => {
              const newVariations = [...(formData.variations || []), { name: '', price: '', discount_type: '', discount_value: '' }];
              setFormData(prev => ({ ...prev, variations: newVariations }));
       };

       const handleRemoveVariation = (index) => {
              const newVariations = [...formData.variations];
              newVariations.splice(index, 1);
              setFormData(prev => ({ ...prev, variations: newVariations }));
       };

       const handleVariationChange = (index, field, value) => {
              const newVariations = [...formData.variations];
              newVariations[index][field] = value;
              setFormData(prev => ({ ...prev, variations: newVariations }));
       };

       const validate = () => {
              const newErrors = {};
              const isBlank = (value) => value === null || value === undefined || String(value).trim() === '';
              const isValidNumber = (value) => {
                     if (isBlank(value)) return false;
                     const n = Number(value);
                     return Number.isFinite(n);
              };
              const isPositiveNumber = (value) => isValidNumber(value) && Number(value) >= 0;

              if (isBlank(formData.title)) newErrors.title = 'Title is required';
              if (isBlank(formData.description) || formData.description === '<p><br></p>') {
                     newErrors.description = 'Description is required';
              }

              if (listType === 'auction') {
                     if (!isPositiveNumber(formData.minimum_bid)) {
                            newErrors.minimum_bid = 'Starting bid must be a valid number';
                     }
                     if (!isPositiveNumber(formData.reserve_price)) {
                            newErrors.reserve_price = 'Market price must be a valid number';
                     }
                     if (isBlank(formData.start_date)) newErrors.start_date = 'Start date is required';
                     if (isBlank(formData.end_date)) newErrors.end_date = 'End date is required';
                     if (formData.start_date && formData.end_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
                            newErrors.end_date = 'End date must be after start date';
                     }
              }

              if (listType === 'normal_list' || listType === 'business_list') {
                     if (!formData.variations || formData.variations.length === 0) {
                            if (!isPositiveNumber(formData.minimum_bid)) {
                                   newErrors.minimum_bid = 'Price must be a valid number';
                            }
                     } else {
                            formData.variations.forEach((variation, index) => {
                                   if (isBlank(variation?.name)) {
                                          newErrors[`variation_${index}_name`] = 'Variation name is required';
                                   }
                                   if (!isPositiveNumber(variation?.price)) {
                                          newErrors[`variation_${index}_price`] = 'Variation price must be a valid number';
                                   }
                            });
                     }

                     if (!isBlank(formData.discount_value) && !isPositiveNumber(formData.discount_value)) {
                            newErrors.discount_value = 'Discount must be a valid number';
                     }
              }

              if (listType === 'business_list') {
                     if (!isValidNumber(formData.stock) || Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
                            newErrors.stock = 'Stock must be a whole number';
                     }
                     if (!isValidNumber(formData.quantity) || Number(formData.quantity) < 1 || !Number.isInteger(Number(formData.quantity))) {
                            newErrors.quantity = 'Quantity must be a whole number (min 1)';
                     }
              }

              // Dynamic fields validation (type-aware)
              (dynamicFields || []).forEach((field) => {
                     const inputType = String(field.input_type || 'text').trim().toLowerCase();
                     const value = getFeatureValue(field);
                     const key = `field_${field.id}`;

                     if (field.is_required && (value === null || value === undefined || String(value).trim() === '' || value === false)) {
                            newErrors[key] = `${field.label} is required`;
                            return;
                     }

                     if (isBlank(value) && value !== false) {
                            return;
                     }

                     if (inputType === 'number' && !isValidNumber(value)) {
                            newErrors[key] = `${field.label} must be a valid number`;
                     }

                     if (inputType === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
                            newErrors[key] = `${field.label} must be a valid email`;
                     }

                     if (inputType === 'url' && value) {
                            try {
                                   // eslint-disable-next-line no-new
                                   new URL(String(value));
                            } catch {
                                   newErrors[key] = `${field.label} must be a valid URL`;
                            }
                     }
              });

              setErrors(newErrors);
              return Object.keys(newErrors).length === 0;
       };

       const handleNext = (e) => {
              e.preventDefault();
              if (validate()) {
                     onContinue();
              } else {
                     window.scrollTo({ top: 0, behavior: 'smooth' });
              }
       };

       return (
              <section className="details-stage py-5">
                     <div className="details-stage-header text-center position-relative mb-5">
                            {onSaveDraft && (
                                   <button
                                          type="button"
                                          className="btn btn-black save-draft-btn-header"
                                          onClick={onSaveDraft}
                                          disabled={isSavingDraft}
                                   >
                                          {isSavingDraft ? (
                                                 <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Saving...
                                                 </>
                                          ) : (
                                                 'Save as Draft'
                                          )}
                                   </button>
                            )}
                            <h1 className="up-listing mb-2 text-dark">Listing Details</h1>
                            <p className="details-stage-subtitle">
                                   Fill in the information below to describe your product.
                            </p>
                            <div className="px-3 pb-2 bg-white">
                                   <div className="progress" style={{ height: '8px' }}>
                                          <div
                                                 className="progress-bar bg-primary"
                                                 role="progressbar"
                                                 style={{ width: `${progressPercent}%` }}
                                                 aria-valuenow={progressPercent}
                                                 aria-valuemin="0"
                                                 aria-valuemax="100"
                                          />
                                   </div>
                            </div>
                     </div>

                     <form className="details-form" onSubmit={handleNext} noValidate>
                            <div className="sell-form-inner">
                                   {Object.keys(errors).length > 0 && (
                                          <div className="alert alert-danger mb-4" role="alert">
                                                 Please fix the highlighted fields before continuing.
                                          </div>
                                   )}

                                   <SummaryCard
                                          type="List Type"
                                          title={summaryData.listType}
                                          subtitle={summaryData.listTypeDescription}
                                          onEdit={onEditListType}
                                   />

                                   <SummaryCard
                                          type="Category"
                                          title={summaryData.category?.name || 'Category'}
                                          subtitle={
                                                 `${summaryData.subCategory?.name || ''}${summaryData.childCategory ? ' > ' + summaryData.childCategory.name : ''}`
                                          }
                                          icon={summaryData.categoryIcon}
                                          onEdit={onEditCategory}
                                   />

                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">Product Title <span className="text-danger">*</span></label>
                                          <input
                                                 type="text"
                                                 name="title"
                                                 className="form-control verify_input"
                                                 placeholder="e.g. 2024 Rolex Submariner"
                                                 value={formData.title || ''}
                                                 onChange={handleChange}
                                          />
                                          {errors.title && <p className="text-danger small mt-1">{errors.title}</p>}
                                   </div>

                                   <div className="form-group mb-4 r-quill">
                                          <label className="form-label fw-bold">Product Description <span className="text-danger">*</span></label>
                                                 <ReactQuill
                                                        theme="snow"
                                                        value={formData.description || ''}
                                                        onChange={handleQuillChange}
                                                        placeholder="Provide a detailed description of your product..."
                                                 />
                                          {errors.description && <p className="text-danger small mt-1">{errors.description}</p>}
                                   </div>

                                   <div className="details-row mb-4">
                                          <div className="form-group flex-fill mb-0">
                                                 <label className="form-label fw-bold">Country</label>
                                                 <select
                                                        name="country_id"
                                                        className="form-control verify_input"
                                                        value={formData.country_id || ''}
                                                        onChange={handleChange}
                                                 >
                                                        <option value="">Select Country</option>
                                                        {countries.map((country) => (
                                                               <option key={country.id} value={country.id}>{country.name}</option>
                                                        ))}
                                                 </select>
                                          </div>
                                          <div className="form-group flex-fill mb-0">
                                                 <label className="form-label fw-bold">State</label>
                                                 <select
                                                        name="state_id"
                                                        className="form-control verify_input"
                                                        value={formData.state_id || ''}
                                                        onChange={handleChange}
                                                        disabled={!formData.country_id}
                                                 >
                                                        <option value="">Select State</option>
                                                        {states.map((state) => (
                                                               <option key={state.id} value={state.id}>{state.name}</option>
                                                        ))}
                                                 </select>
                                          </div>
                                   </div>

                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">City</label>
                                          <select
                                                 name="city_id"
                                                 className="form-control verify_input"
                                                 value={formData.city_id || ''}
                                                 onChange={handleChange}
                                                 disabled={!formData.state_id}
                                          >
                                                 <option value="">Select City</option>
                                                 {cities.map((city) => (
                                                        <option key={city.id} value={city.id}>{city.name}</option>
                                                 ))}
                                          </select>
                                   </div>

                                   {listType === 'auction' && (
                                          <>
                                                 <div className="details-row mb-4">
                                                        <div className="form-group flex-fill mb-0">
                                                               <label className="form-label fw-bold">Starting Bid <span className="text-danger">*</span></label>
                                                               <input
                                                                      type="number"
                                                                      name="minimum_bid"
                                                                      className="form-control verify_input"
                                                                      value={formData.minimum_bid || ''}
                                                                      onChange={handleChange}
                                                               />
                                                               {errors.minimum_bid && <p className="text-danger small mt-1">{errors.minimum_bid}</p>}
                                                        </div>
                                                        <div className="form-group flex-fill mb-0">
                                                               <label className="form-label fw-bold">Market Price <span className="text-danger">*</span></label>
                                                               <input
                                                                      type="number"
                                                                      name="reserve_price"
                                                                      className="form-control verify_input"
                                                                      value={formData.reserve_price || ''}
                                                                      onChange={handleChange}
                                                               />
                                                               {errors.reserve_price && <p className="text-danger small mt-1">{errors.reserve_price}</p>}
                                                        </div>
                                                 </div>
                                                 <div className="details-row mb-4">
                                                        <div className="form-group flex-fill mb-0">
                                                               <label className="form-label fw-bold">Start Date <span className="text-danger">*</span></label>
                                                               <input
                                                                      type="datetime-local"
                                                                      name="start_date"
                                                                      className="form-control verify_input"
                                                                      value={formData.start_date || ''}
                                                                      onChange={handleChange}
                                                                      min={new Date().toISOString().slice(0, 16)}
                                                               />
                                                               {errors.start_date && <p className="text-danger small mt-1">{errors.start_date}</p>}
                                                        </div>
                                                        <div className="form-group flex-fill mb-0">
                                                               <label className="form-label fw-bold">End Date <span className="text-danger">*</span></label>
                                                               <input
                                                                      type="datetime-local"
                                                                      name="end_date"
                                                                      className="form-control verify_input"
                                                                      value={formData.end_date || ''}
                                                                      onChange={handleChange}
                                                                      min={formData.start_date || new Date().toISOString().slice(0, 16)}
                                                               />
                                                               {errors.end_date && <p className="text-danger small mt-1">{errors.end_date}</p>}
                                                        </div>
                                                 </div>
                                          </>
                                   )}

                                   {(listType === 'normal_list' || listType === 'business_list') && (
                                          <>
                                                 <div className="form-group mb-4">
                                                        {(!formData.variations || formData.variations.length === 0) && (
                                                               <button
                                                                      type="button"
                                                                      className="btn btn-sm btn-outline-primary mb-4"
                                                                      onClick={handleAddVariation}
                                                               >
                                                                      <i className="fa-solid fa-plus me-1"></i> Add Variation
                                                               </button>
                                                        )}

                                                        {formData.variations?.length > 0 && (
                                                               <div className="mb-4">
                                                                      <label className="mb-2 fw-bold text-dark">Variations</label>
                                                                      {(formData.variations || []).map((variation, index) => (
                                                                             <div className="d-flex gap-2 mb-2 align-items-center flex-wrap" key={index}>
                                                                                    <div className="flex-grow-1">
                                                                                           <input
                                                                                                  type="text"
                                                                                                  placeholder="Variation (e.g. Size L)"
                                                                                                  className="form-control verify_input"
                                                                                                  value={variation.name}
                                                                                                  onChange={(e) => handleVariationChange(index, "name", e.target.value)}
                                                                                           />
                                                                                           {errors[`variation_${index}_name`] && <p className="text-danger small mt-1">{errors[`variation_${index}_name`]}</p>}
                                                                                    </div>
                                                                                    <div style={{ width: '120px' }}>
                                                                                           <input
                                                                                                  type="number"
                                                                                                  placeholder="Price"
                                                                                                  className="form-control verify_input"
                                                                                                  value={variation.price}
                                                                                                  onChange={(e) => handleVariationChange(index, "price", e.target.value)}
                                                                                           />
                                                                                           {errors[`variation_${index}_price`] && <p className="text-danger small mt-1">{errors[`variation_${index}_price`]}</p>}
                                                                                    </div>
                                                                                    <div style={{ width: '120px' }}>
                                                                                           <select
                                                                                                  className="form-control verify_input"
                                                                                                  value={variation.discount_type || ""}
                                                                                                  onChange={(e) => handleVariationChange(index, "discount_type", e.target.value)}
                                                                                           >
                                                                                                  <option value="">No Disc</option>
                                                                                                  <option value="percent">% Off</option>
                                                                                                  <option value="flat">Flat Off</option>
                                                                                           </select>
                                                                                    </div>
                                                                                    <div style={{ width: '100px' }}>
                                                                                           <input
                                                                                                  type="number"
                                                                                                  placeholder="Value"
                                                                                                  className="form-control verify_input"
                                                                                                  value={variation.discount_value || ""}
                                                                                                  onChange={(e) => handleVariationChange(index, "discount_value", e.target.value)}
                                                                                                  disabled={!variation.discount_type}
                                                                                           />
                                                                                    </div>
                                                                                    <button
                                                                                           type="button"
                                                                                           className="btn text-danger p-0 border-0 ms-2"
                                                                                           onClick={() => handleRemoveVariation(index)}
                                                                                    >
                                                                                           <i className="fa-solid fa-trash"></i>
                                                                                    </button>
                                                                             </div>
                                                                      ))}
                                                                      <button
                                                                             type="button"
                                                                             className="btn btn-sm btn-outline-primary mt-3"
                                                                             onClick={handleAddVariation}
                                                                      >
                                                                             <i className="fa-solid fa-plus me-1"></i> Add Another Variation
                                                                      </button>
                                                               </div>
                                                        )}

                                                        {(!formData.variations || formData.variations.length === 0) && (
                                                               <>
                                                                      <div className="form-group mb-4">
                                                                             <label className="form-label fw-bold">Price <span className="text-danger">*</span></label>
                                                                             <input
                                                                                    type="number"
                                                                                    name="minimum_bid"
                                                                                    className="form-control verify_input"
                                                                                    value={formData.minimum_bid || ''}
                                                                                    onChange={handleChange}
                                                                             />
                                                                             {errors.minimum_bid && <p className="text-danger small mt-1">{errors.minimum_bid}</p>}
                                                                      </div>

                                                                      <div className="form-group mb-4">
                                                                             <label className="form-label fw-bold">Discount (Optional)</label>
                                                                             <div className="d-flex gap-2">
                                                                                    <select
                                                                                           name="discount_type"
                                                                                           className="form-control verify_input"
                                                                                           value={formData.discount_type || ''}
                                                                                           onChange={handleChange}
                                                                                           style={{ flex: 1 }}
                                                                                    >
                                                                                           <option value="">No Discount</option>
                                                                                           <option value="percent">Percentage (%)</option>
                                                                                           <option value="flat">Flat Amount</option>
                                                                                    </select>
                                                                                    <input
                                                                                           type="number"
                                                                                           name="discount_value"
                                                                                           placeholder="Discount Value"
                                                                                           className="form-control verify_input"
                                                                                           value={formData.discount_value || ''}
                                                                                           onChange={handleChange}
                                                                                           style={{ flex: 1 }}
                                                                                           disabled={!formData.discount_type}
                                                                                    />
                                                                             </div>
                                                                      </div>
                                                               </>
                                                        )}
                                                 </div>

                                                 {listType === 'business_list' && (
                                                        <div className="details-row mb-4">
                                                               <div className="form-group flex-fill mb-0">
                                                                      <label className="form-label fw-bold">Stock SKU <span className="text-danger">*</span></label>
                                                                      <input
                                                                             type="text"
                                                                             name="stock"
                                                                             className="form-control verify_input"
                                                                             placeholder="e.g. SKU-12345"
                                                                             value={formData.stock || ''}
                                                                             onChange={handleChange}
                                                                      />
                                                                      {errors.stock && <p className="text-danger small mt-1">{errors.stock}</p>}
                                                               </div>
                                                               <div className="form-group flex-fill mb-0">
                                                                      <label className="form-label fw-bold">Available Quantity <span className="text-danger">*</span></label>
                                                                      <input
                                                                             type="number"
                                                                             name="quantity"
                                                                             className="form-control verify_input"
                                                                             placeholder="e.g. 100"
                                                                             value={formData.quantity || ''}
                                                                             onChange={handleChange}
                                                                      />
                                                                      {errors.quantity && <p className="text-danger small mt-1">{errors.quantity}</p>}
                                                               </div>
                                                        </div>
                                                 )}
                                          </>
                                   )}

                                   {/* Dynamic Fields Section */}
                                   {dynamicFields && dynamicFields.length > 0 && (
                                          <div className="dynamic-fields-section mb-4">
                                                 <div className="row">
                                                        {dynamicFields.map((field) => {
                                                               const inputType = String(field.input_type || 'text').trim().toLowerCase();
                                                               const fieldOptions = parseFieldOptions(field.options);

                                                               return (
                                                               <div className="col-md-6 mb-4" key={field.id}>
                                                                      <label className="form-label fw-bold">
                                                                             {field.label} {field.is_required ? <span className="text-danger">*</span> : ''}
                                                                      </label>
                                                                     {inputType === 'select' ? (
                                                                             <select
                                                                                    className="form-control verify_input"
                                                                                    value={getFeatureValue(field)}
                                                                                    onChange={(e) => updateFeatureValue(field, e.target.value)}
                                                                                    required={field.is_required}
                                                                             >
                                                                                    <option value="">Select {field.label}</option>
                                                                                    {fieldOptions.map((opt, i) => (
                                                                                           <option key={i} value={opt}>{opt}</option>
                                                                                    ))}
                                                                             </select>
                                                                      ) : inputType === 'radio' ? (
                                                                             <div className="pt-2">
                                                                                    {fieldOptions.map((opt, i) => {
                                                                                           const radioId = `field_${field.id}_${i}`;
                                                                                           const currentValue = getFeatureValue(field);
                                                                                           return (
                                                                                                  <div className="form-check mb-2 d-inline-flex align-items-center gap-2" key={radioId}>
                                                                                                         <input
                                                                                                                className="form-check-input m-0 align-self-center"
                                                                                                                type="radio"
                                                                                                                id={radioId}
                                                                                                                name={`field_${field.id}`}
                                                                                                                value={opt}
                                                                                                                checked={currentValue === opt}
                                                                                                                onChange={(e) => updateFeatureValue(field, e.target.value)}
                                                                                                         />
                                                                                                         <label className="form-check-label small m-0 text-dark d-flex align-items-center" style={{ color: '#23262F', opacity: 1, lineHeight: 1.2 }} htmlFor={radioId}>
                                                                                                                {opt}
                                                                                                         </label>
                                                                                                  </div>
                                                                                           );
                                                                                    })}
                                                                             </div>
                                                                      ) : inputType === 'textarea' ? (
                                                                             <textarea
                                                                                    className="form-control verify_input"
                                                                                    value={getFeatureValue(field)}
                                                                                    onChange={(e) => updateFeatureValue(field, e.target.value)}
                                                                                    required={field.is_required}
                                                                             />
                                                                     ) : inputType === 'checkbox' ? (
                                                                             <div className="form-check pt-2">
                                                                                    <input
                                                                                           className="form-check-input"
                                                                                           type="checkbox"
                                                                                           checked={!!getFeatureValue(field)}
                                                                                           onChange={(e) => updateFeatureValue(field, e.target.checked)}
                                                                                           id={`field_${field.id}`}
                                                                                    />
                                                                                    <label className="form-check-label small ms-2" htmlFor={`field_${field.id}`}>
                                                                                           Enable {field.label}
                                                                                    </label>
                                                                             </div>
                                                                      ) : (
                                                                             <input
                                                                                    type={['number', 'email', 'url', 'tel', 'date', 'datetime-local'].includes(inputType) ? inputType : 'text'}
                                                                                    className="form-control verify_input"
                                                                                    value={getFeatureValue(field)}
                                                                                    onChange={(e) => updateFeatureValue(field, e.target.value)}
                                                                                    required={field.is_required}
                                                                             />
                                                                      )}
                                                                      {errors[`field_${field.id}`] && <p className="text-danger small mt-1">{errors[`field_${field.id}`]}</p>}
                                                               </div>
                                                        )})}
                                                 </div>
                                          </div>
                                   )}

                                   <div className="details-stage-actions d-flex justify-content-between align-items-center mt-5">
                                          <button
                                                 type="button"
                                                 className="btn btn-black px-4"
                                                 onClick={onBack}
                                          >
                                                 Back
                                          </button>
                                          <button type="submit" className="btn btn-black px-5">
                                                 Confirm
                                          </button>
                                   </div>
                            </div>
                     </form>
              </section>
       );
}
