import React, { useState } from 'react';
import SummaryCard from './SummaryCard';

export default function VerificationStep({ categoryId, formData, setFormData, summaryData, onContinue, onBack, onEditListType, onEditCategory, onEditDetails, onSaveDraft, isSavingDraft }) {
       const isProperty = String(categoryId) === '222';
       const isVehicle = String(categoryId) === '311';
       const existingPropertyDocs = formData.existing_property_documents || [];
       const existingVehicleDocs = formData.existing_vehicle_documents || [];

       // Local state for file validations/errors
       const [errors, setErrors] = useState({});

       const handleDocsChange = (e, fieldName) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 3) {
                     setErrors(prev => ({ ...prev, [fieldName]: "Max 3 documents allowed" }));
                     return;
              }
              setErrors(prev => ({ ...prev, [fieldName]: "" }));
              setFormData(prev => ({ ...prev, [fieldName]: files }));
       };

       const handleChange = (e) => {
              const { name, value } = e.target;
              setFormData(prev => ({ ...prev, [name]: value }));
       };

       const validate = () => {
              const newErrors = {};
              if (isProperty) {
                     if (!formData.property_type) newErrors.property_type = "Required";
                     if (!formData.property_address) newErrors.property_address = "Required";
                     if (!formData.title_deed_number) newErrors.title_deed_number = "Required";
                     if (!formData.property_documents?.length && !existingPropertyDocs.length) newErrors.property_documents = "Upload documents";
              }
              if (isVehicle) {
                     if (!formData.vehicle_make_model) newErrors.vehicle_make_model = "Required";
                     if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "Required";
                     if (!formData.chassis_vin) newErrors.chassis_vin = "Required";
                     if (!formData.vehicle_documents?.length && !existingVehicleDocs.length) newErrors.vehicle_documents = "Upload documents";
              }
              setErrors(newErrors);
              return Object.keys(newErrors).length === 0;
       };

       const handleNext = (e) => {
              e.preventDefault();
              if (validate()) {
                     onContinue();
              }
       };

       if (!isProperty && !isVehicle) return null;

       const getDocumentUrl = (doc) => {
              if (!doc) return '#';
              if (typeof doc === 'string' && (doc.startsWith('http://') || doc.startsWith('https://'))) {
                     return doc;
              }
              return `/${String(doc).replace(/^\/+/, '')}`;
       };

       const getDocumentLabel = (doc, idx) => {
              if (!doc) return `Document ${idx + 1}`;
              if (typeof doc !== 'string') return `Document ${idx + 1}`;
              const parts = doc.split('/');
              return parts[parts.length - 1] || `Document ${idx + 1}`;
       };

       return (
              <section className="verification-stage py-5">
                     <div className="verification-stage-header text-center position-relative mb-5">
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
                            <h1 className="up-listing mb-2">
                                   {isProperty ? "Property Verification" : "Vehicle Verification"}
                            </h1>
                            <p className="verification-stage-subtitle">
                                   Provide verification details before continuing.
                            </p>
                     </div>

                     <form className="verification-form" onSubmit={handleNext} noValidate>
                            <div className="sell-form-inner">

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

                            <SummaryCard
                                   type="Listing Details"
                                   title={summaryData.listingTitle || 'Untitled Listing'}
                                   onEdit={onEditDetails}
                            />

                            {isProperty && (
                                   <>
                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Property Type</label>
                                                 <input
                                                        type="text"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter property type"
                                                        name="property_type"
                                                        value={formData.property_type || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.property_type && <p className="text-danger small mt-1">{errors.property_type}</p>}
                                          </div>

                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Property Address</label>
                                                 <input
                                                        type="text"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter property address"
                                                        name="property_address"
                                                        value={formData.property_address || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.property_address && <p className="text-danger small mt-1">{errors.property_address}</p>}
                                          </div>

                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Title Deed Number</label>
                                                 <input
                                                        type="text"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter title deed number"
                                                        name="title_deed_number"
                                                        value={formData.title_deed_number || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.title_deed_number && <p className="text-danger small mt-1">{errors.title_deed_number}</p>}
                                          </div>

                                          <div className="identity-upload-section mb-4">
                                                 <h4 className="form-label fw-bold mb-3">Upload Ownership & NOC Documents</h4>
                                                 <ul className="liss mb-3 small" style={{ color: '#4b5563' }}>
                                                        <li>Click the box to select your files (PNG/JPG).</li>
                                                        <li>Maximum 3 documents.</li>
                                                 </ul>

                                                 <div
                                                        className="upload-dropzone p-4 text-center border rounded cursor-pointer"
                                                        onClick={() => document.getElementById('propertyDocsInput')?.click()}
                                                        style={{ borderStyle: 'dashed', backgroundColor: '#f9f9f9' }}
                                                 >
                                                        <input
                                                               id="propertyDocsInput"
                                                               type="file"
                                                               hidden
                                                               multiple
                                                               accept=".pdf, .jpg, .png"
                                                               onChange={(e) => handleDocsChange(e, 'property_documents')}
                                                        />
                                                        <div className="upload-dropzone-content">
                                                               <i className="fa-solid fa-cloud-arrow-up fa-2x mb-3" style={{ color: '#6b7280' }}></i>
                                                               <p className="mb-1 fw-bold text-dark">Drag & drop or click to upload documents</p>
                                                               <span className="text-dark small">PNG, JPG formats only. Max 3 files.</span>
                                                        </div>
                                                 </div>
                                                 {errors.property_documents && <p className="text-danger small mt-2">{errors.property_documents}</p>}

                                                 {/* Preview Area */}
                                                 {existingPropertyDocs.length > 0 && (
                                                        <div className="mt-3">
                                                               <p className="small fw-bold mb-2" style={{ color: '#111827' }}>Existing Documents:</p>
                                                               <ul className="list-unstyled mb-0">
                                                                      {existingPropertyDocs.map((doc, idx) => (
                                                                             <li key={`existing-property-${idx}`} className="small mb-1">
                                                                                    <a
                                                                                           href={getDocumentUrl(doc)}
                                                                                           target="_blank"
                                                                                           rel="noreferrer"
                                                                                           className="text-decoration-underline text-dark"
                                                                                    >
                                                                                           {getDocumentLabel(doc, idx)}
                                                                                    </a>
                                                                             </li>
                                                                      ))}
                                                               </ul>
                                                        </div>
                                                 )}
                                                 {formData.property_documents && formData.property_documents.length > 0 && (
                                                        <div className="mt-3">
                                                               <p className="small fw-bold mb-2" style={{ color: '#111827' }}>Selected Files:</p>
                                                               <ul className="list-unstyled">
                                                                      {Array.from(formData.property_documents).map((file, idx) => (
                                                                             <li key={idx} className="small" style={{ color: '#374151' }}>{file.name}</li>
                                                                      ))}
                                                               </ul>
                                                        </div>
                                                 )}
                                          </div>
                                   </>
                            )}

                            {isVehicle && (
                                   <>
                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Vehicle Make & Model</label>
                                                 <input
                                                        type="text"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter vehicle make & model"
                                                        name="vehicle_make_model"
                                                        value={formData.vehicle_make_model || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.vehicle_make_model && <p className="text-danger small mt-1">{errors.vehicle_make_model}</p>}
                                          </div>

                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Year of Manufacture</label>
                                                 <input
                                                        type="number"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter year of manufacture"
                                                        name="year_of_manufacture"
                                                        value={formData.year_of_manufacture || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.year_of_manufacture && <p className="text-danger small mt-1">{errors.year_of_manufacture}</p>}
                                          </div>

                                          <div className="form-group mb-4">
                                                 <label className="form-label fw-bold">Chassis / VIN</label>
                                                 <input
                                                        type="text"
                                                        className="form-control verify_input"
                                                        placeholder="Please enter chassis / VIN"
                                                        name="chassis_vin"
                                                        value={formData.chassis_vin || ''}
                                                        onChange={handleChange}
                                                 />
                                                 {errors.chassis_vin && <p className="text-danger small mt-1">{errors.chassis_vin}</p>}
                                          </div>

                                          <div className="identity-upload-section mb-4">
                                                 <h4 className="form-label fw-bold mb-3">Upload Vehicle Documents</h4>
                                                 <ul className="liss mb-3 small" style={{ color: '#4b5563' }}>
                                                        <li>Upload up to 3 documents for verification.</li>
                                                        <li>Accepted formats: PNG/JPG/PDF.</li>
                                                 </ul>

                                                 <div
                                                        className="upload-dropzone p-4 text-center border rounded cursor-pointer"
                                                        onClick={() => document.getElementById('vehicleDocsInput')?.click()}
                                                        style={{ borderStyle: 'dashed', backgroundColor: '#f9f9f9' }}
                                                 >
                                                        <input
                                                               id="vehicleDocsInput"
                                                               type="file"
                                                               hidden
                                                               multiple
                                                               accept=".pdf, .jpg, .png"
                                                               onChange={(e) => handleDocsChange(e, 'vehicle_documents')}
                                                        />
                                                        <div className="upload-dropzone-content">
                                                               <i className="fa-solid fa-cloud-arrow-up fa-2x mb-3" style={{ color: '#6b7280' }}></i>
                                                               <p className="mb-1 fw-bold" style={{ color: '#111827' }}>Drag & drop or click to upload documents</p>
                                                               <span className="text-dark small">PNG, JPG, PDF formats only. Max 3 files.</span>
                                                        </div>
                                                 </div>
                                                 {errors.vehicle_documents && <p className="text-danger small mt-2">{errors.vehicle_documents}</p>}

                                                 {/* Preview Area */}
                                                 {existingVehicleDocs.length > 0 && (
                                                        <div className="mt-3">
                                                               <p className="small fw-bold mb-2" style={{ color: '#111827' }}>Existing Documents:</p>
                                                               <ul className="list-unstyled mb-0">
                                                                      {existingVehicleDocs.map((doc, idx) => (
                                                                             <li key={`existing-vehicle-${idx}`} className="small mb-1">
                                                                                    <a
                                                                                           href={getDocumentUrl(doc)}
                                                                                           target="_blank"
                                                                                           rel="noreferrer"
                                                                                           className="text-decoration-underline text-dark"
                                                                                    >
                                                                                           {getDocumentLabel(doc, idx)}
                                                                                    </a>
                                                                             </li>
                                                                      ))}
                                                               </ul>
                                                        </div>
                                                 )}
                                                 {formData.vehicle_documents && formData.vehicle_documents.length > 0 && (
                                                        <div className="mt-3">
                                                               <p className="small fw-bold mb-2" style={{ color: '#111827' }}>Selected Files:</p>
                                                               <ul className="list-unstyled">
                                                                      {Array.from(formData.vehicle_documents).map((file, idx) => (
                                                                             <li key={idx} className="small" style={{ color: '#374151' }}>{file.name}</li>
                                                                      ))}
                                                               </ul>
                                                        </div>
                                                 )}
                                          </div>
                                   </>
                            )}

                            <div className="verification-stage-actions d-flex justify-content-between align-items-center mt-5">
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
