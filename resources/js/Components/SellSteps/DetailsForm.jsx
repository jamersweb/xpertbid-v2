import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import SummaryCard from './SummaryCard';
import 'react-quill/dist/quill.snow.css';

export default function DetailsForm({ listType, formData, setFormData, summaryData, dynamicFields = [], onContinue, onBack, onEditListType, onEditCategory, onSaveDraft, isSavingDraft }) {
       const [errors, setErrors] = useState({});

       const handleChange = (e) => {
              const { name, value } = e.target;
              setFormData(prev => ({ ...prev, [name]: value }));
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
              if (!formData.title) newErrors.title = "Title is required";
              if (!formData.description || formData.description === '<p><br></p>') newErrors.description = "Description is required";
              if (!formData.product_condition) newErrors.product_condition = "Product condition is required";
              if (!formData.product_year) newErrors.product_year = "Year is required";
              if (!formData.product_location) newErrors.product_location = "Location is required";

              if (listType === 'auction') {
                     if (!formData.minimum_bid) newErrors.minimum_bid = "Starting bid is required";
                     if (!formData.reserve_price) newErrors.reserve_price = "Market price is required";
                     if (!formData.start_date) newErrors.start_date = "Start date is required";
                     if (!formData.end_date) newErrors.end_date = "End date is required";
              }

              if (listType === 'normal_list' || listType === 'business_list') {
                     if (!formData.variations || formData.variations.length === 0) {
                            if (!formData.minimum_bid) newErrors.minimum_bid = "Price is required";
                     }
              }

              if (listType === 'business_list') {
                     if (!formData.stock) newErrors.stock = "Stock is required";
                     if (!formData.quantity) newErrors.quantity = "Quantity is required";
              }

              // Dynamic fields validation
              dynamicFields.forEach(field => {
                     if (field.is_required && !formData.category_features?.[field.field_name]) {
                            newErrors[`field_${field.id}`] = `${field.label} is required`;
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
                     </div>

                     <form className="details-form" onSubmit={handleNext} noValidate>
                            <div className="sell-form-inner">
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
                                                 <label className="form-label fw-bold">Condition <span className="text-danger">*</span></label>
                                                 <select
                                                        name="product_condition"
                                                        className="form-control verify_input"
                                                        value={formData.product_condition || ''}
                                                        onChange={handleChange}
                                                 >
                                                        <option value="">Select Condition</option>
                                                        <option value="New">New</option>
                                                        <option value="Like New">Like New</option>
                                                        <option value="Used">Used</option>
                                                        <option value="Refurbished">Refurbished</option>
                                                 </select>
                                                 {errors.product_condition && <p className="text-danger small mt-1">{errors.product_condition}</p>}
                                          </div>
                                          <div className="form-group flex-fill mb-0">
                                                 <label className="form-label fw-bold">Year <span className="text-danger">*</span></label>
                                                 <input
                                                        type="number"
                                                        name="product_year"
                                                        className="form-control verify_input"
                                                        placeholder="e.g. 2024"
                                                        value={formData.product_year || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.product_year && <p className="text-danger small mt-1">{errors.product_year}</p>}
                                          </div>
                                   </div>

                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">Product Location <span className="text-danger">*</span></label>
                                          <input
                                                 type="text"
                                                 name="product_location"
                                                 className="form-control verify_input"
                                                 placeholder="e.g. Dubai, UAE"
                                                 value={formData.product_location || ''}
                                                 onChange={handleChange}
                                          />
                                          {errors.product_location && <p className="text-danger small mt-1">{errors.product_location}</p>}
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
                                                                      <label className="mb-2 fw-bold">Variations</label>
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
                                                        {dynamicFields.map((field) => (
                                                               <div className="col-md-6 mb-4" key={field.id}>
                                                                      <label className="form-label fw-bold">
                                                                             {field.label} {field.is_required ? <span className="text-danger">*</span> : ''}
                                                                      </label>
                                                                      {field.input_type === 'select' ? (
                                                                             <select
                                                                                    className="form-control verify_input"
                                                                                    value={formData.category_features?.[field.field_name] || ''}
                                                                                    onChange={(e) => setFormData(prev => ({
                                                                                           ...prev,
                                                                                           category_features: {
                                                                                                  ...prev.category_features,
                                                                                                  [field.field_name]: e.target.value
                                                                                           }
                                                                                    }))}
                                                                                    required={field.is_required}
                                                                             >
                                                                                    <option value="">Select {field.label}</option>
                                                                                    {(field.options || []).map((opt, i) => (
                                                                                           <option key={i} value={opt}>{opt}</option>
                                                                                    ))}
                                                                             </select>
                                                                      ) : field.input_type === 'textarea' ? (
                                                                             <textarea
                                                                                    className="form-control verify_input"
                                                                                    value={formData.category_features?.[field.field_name] || ''}
                                                                                    onChange={(e) => setFormData(prev => ({
                                                                                           ...prev,
                                                                                           category_features: {
                                                                                                  ...prev.category_features,
                                                                                                  [field.field_name]: e.target.value
                                                                                           }
                                                                                    }))}
                                                                                    required={field.is_required}
                                                                             />
                                                                      ) : field.input_type === 'checkbox' ? (
                                                                             <div className="form-check pt-2">
                                                                                    <input
                                                                                           className="form-check-input"
                                                                                           type="checkbox"
                                                                                           checked={!!formData.category_features?.[field.field_name]}
                                                                                           onChange={(e) => setFormData(prev => ({
                                                                                                  ...prev,
                                                                                                  category_features: {
                                                                                                         ...prev.category_features,
                                                                                                         [field.field_name]: e.target.checked
                                                                                                  }
                                                                                           }))}
                                                                                           id={`field_${field.id}`}
                                                                                    />
                                                                                    <label className="form-check-label small ms-2" htmlFor={`field_${field.id}`}>
                                                                                           Enable {field.label}
                                                                                    </label>
                                                                             </div>
                                                                      ) : (
                                                                             <input
                                                                                    type={field.input_type || "text"}
                                                                                    className="form-control verify_input"
                                                                                    value={formData.category_features?.[field.field_name] || ''}
                                                                                    onChange={(e) => setFormData(prev => ({
                                                                                           ...prev,
                                                                                           category_features: {
                                                                                                  ...prev.category_features,
                                                                                                  [field.field_name]: e.target.value
                                                                                           }
                                                                                    }))}
                                                                                    required={field.is_required}
                                                                             />
                                                                      )}
                                                                      {errors[`field_${field.id}`] && <p className="text-danger small mt-1">{errors[`field_${field.id}`]}</p>}
                                                               </div>
                                                        ))}
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
                                                 Continue
                                          </button>
                                   </div>
                            </div>
                     </form>
              </section>
       );
}
