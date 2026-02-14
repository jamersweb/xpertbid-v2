import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import SummaryCard from './SummaryCard';
import 'react-quill/dist/quill.snow.css';

export default function DetailsForm({ listType, formData, setFormData, summaryData, onContinue, onBack, onEditListType, onEditCategory, onSaveDraft, isSavingDraft }) {
       const { categories } = usePage().props;

       const [errors, setErrors] = useState({});

       // Helper to interpret errors
       const getServerError = (field) => errors[field];

       const handleChange = (e) => {
              const { name, value } = e.target;
              setFormData(prev => ({ ...prev, [name]: value }));
       };

       const handleAddVariation = () => {
              setFormData(prev => ({ ...prev, variations: [...(prev.variations || []), { name: '', price: '', discount_type: '', discount_value: '' }] }));
       };

       const handleRemoveVariation = (index) => {
              setFormData(prev => ({
                     ...prev,
                     variations: prev.variations.filter((_, i) => i !== index)
              }));
       };

       const handleVariationChange = (index, field, value) => {
              setFormData(prev => {
                     const newVars = [...(prev.variations || [])];
                     newVars[index] = { ...newVars[index], [field]: value };
                     return { ...prev, variations: newVars };
              });
       };

       const validate = () => {
              const newErrors = {};
              if (!formData.title?.trim()) newErrors.title = "Title is required";
              if (!formData.description?.trim()) newErrors.description = "Description is required";
              if (!formData.product_year) newErrors.product_year = "Year is required";

              if (!formData.product_condition) newErrors.product_condition = "Condition is required";

              if (listType === 'auction') {
                     if (!formData.start_date) newErrors.start_date = "Start date required";
                     if (!formData.end_date) newErrors.end_date = "End date required";
                     if (!formData.minimum_bid) newErrors.minimum_bid = "Starting bid required";
                     if (!formData.reserve_price) newErrors.reserve_price = "Market price required";
              } else {
                     if (formData.variations?.length > 0) {
                            formData.variations.forEach((v, i) => {
                                   if (!v.name) newErrors[`variation_${i}_name`] = "Required";
                                   if (!v.price) newErrors[`variation_${i}_price`] = "Required";
                            });
                     } else {
                            if (!formData.minimum_bid) newErrors.minimum_bid = "Price is required";
                     }
              }

              setErrors(newErrors);
              return Object.keys(newErrors).length === 0;
       };

       const handleSubmit = (e) => {
              e.preventDefault();
              if (validate()) {
                     onContinue();
              }
       };

       return (
              <section className="details-stage py-5">
                     <div className="details-stage-header text-center position-relative">
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
                            <h1 className="up-listing mb-2">Listing Details</h1>
                            <p className="details-stage-subtitle">Share essential info about your product.</p>
                     </div>

                     <form onSubmit={handleSubmit} className="details-form">

                            <SummaryCard
                                   type="List Type"
                                   title={summaryData.listType === 'Auction' ? 'Auction Product' : 'Normal Product'}
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


                            <div className="details-form-content">
                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">Product Title <span className="text-danger">*</span></label>
                                          <input
                                                 type="text"
                                                 name="title"
                                                 className="form-control verify_input"
                                                 value={formData.title || ''}
                                                 onChange={handleChange}
                                                 placeholder="Enter your title here"
                                          />
                                          {errors.title && <p className="text-danger small mt-1">{errors.title}</p>}
                                   </div>


                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">Product Description <span className="text-danger">*</span></label>
                                          <div className="quill-editor verify_input" style={{ minHeight: '200px' }}>
                                                 <ReactQuill
                                                        theme="snow"
                                                        value={formData.description || ''}
                                                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                                        placeholder="Please write something about your item here..."
                                                        style={{ height: '150px' }}
                                                 />
                                          </div>
                                          {errors.description && <p className="text-danger small mt-5">{errors.description}</p>}
                                   </div>

                                   <div className="details-row mb-4">
                                          <div className="form-group flex-fill mb-0">
                                                 <label className="form-label fw-bold">Product Year <span className="text-danger">*</span></label>
                                                 <input
                                                        type="number"
                                                        name="product_year"
                                                        className="form-control verify_input"
                                                        value={formData.product_year || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.product_year && <p className="text-danger small mt-1">{errors.product_year}</p>}
                                          </div>
                                          <div className="form-group flex-fill mb-0">
                                                 <label className="form-label fw-bold">Location</label>
                                                 <input
                                                        type="text"
                                                        name="product_location"
                                                        className="form-control verify_input"
                                                        value={formData.product_location || ''}
                                                        onChange={handleChange}
                                                 />
                                          </div>
                                   </div>

                                   <div className="form-group mb-4">
                                          <label className="form-label fw-bold">Condition <span className="text-danger">*</span></label>
                                          <select
                                                 name="product_condition"
                                                 className="form-control verify_input"
                                                 value={formData.product_condition || ''}
                                                 onChange={handleChange}
                                          >
                                                 <option value="">Select Condition</option>
                                                 <option value="New">New</option>
                                                 <option value="Used">Used</option>
                                          </select>
                                          {errors.product_condition && <p className="text-danger small mt-1">{errors.product_condition}</p>}
                                   </div>

                                   {listType === 'auction' && (
                                          <>
                                                 <div className="details-row mb-4">
                                                        <div className="form-group flex-fill mb-0">
                                                               <label className="form-label fw-bold">Starting Bid Price <span className="text-danger">*</span></label>
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

                                   {listType === 'normal_list' && (
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
                                          </>
                                   )}
                            </div>

                            <div className="details-stage-actions d-flex justify-content-between align-items-center">
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

                     </form>
              </section>
       );
}
