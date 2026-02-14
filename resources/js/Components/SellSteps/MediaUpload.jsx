import React, { useState, useRef } from 'react';
import SummaryCard from './SummaryCard';

export default function MediaUpload({ files, setFiles, existingFiles = [], setExistingFiles, summaryData, onContinue, onBack, onEditListType, onEditCategory, onEditDetails, onEditVerification, onSaveDraft, isSavingDraft }) {
       const fileInputRef = useRef(null);
       const [error, setError] = useState("");

       const handleFileChange = (e) => {
              const selectedFiles = Array.from(e.target.files || []);
              if (selectedFiles.length === 0) return;

              // Validation logic
              const validFiles = [];
              let err = "";

              selectedFiles.forEach(file => {
                     const isVideo = file.type === "video/mp4";
                     const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB video, 10MB image

                     if (!["image/png", "image/jpeg", "image/webp", "video/mp4"].includes(file.type)) {
                            err = "Only PNG, JPG, WEBP, and MP4 files are allowed.";
                     } else if (file.size > maxSize) {
                            err = isVideo ? "Video file size must be less than 50MB." : "Image file size must be less than 10MB.";
                     } else {
                            validFiles.push(file);
                     }
              });

              if (err) setError(err);
              else setError("");

              setFiles([...files, ...validFiles]);
       };

       const removeFile = (index) => {
              const newFiles = [...files];
              newFiles.splice(index, 1);
              setFiles(newFiles);
       };

       const getPreview = (file) => {
              return URL.createObjectURL(file);
       };

       const handleNext = (e) => {
              e.preventDefault();
              onContinue();
       };

       return (
              <section className="media-stage py-5">
                     <div className="media-stage-header text-center position-relative mb-5">
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
                            <h1 className="up-listing mb-2">Upload Media</h1>
                            <p className="media-stage-subtitle">
                                   Add images or videos for your listing.
                            </p>
                     </div>

                     <form className="media-form" onSubmit={handleNext}>

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

                            {(summaryData.category?.id === 222 || summaryData.category?.id === 311 || String(summaryData.category?.id) === '222' || String(summaryData.category?.id) === '311') && (
                                   <SummaryCard
                                          type="Verification"
                                          title={summaryData.category?.id === 222 || String(summaryData.category?.id) === '222' ? "Property Verified" : "Vehicle Verified"}
                                          onEdit={onEditVerification}
                                   />
                            )}

                            {/* Upload Area */}
                            <div
                                   className="upload-dropzone p-5 text-center border rounded cursor-pointer mb-4"
                                   style={{ borderStyle: 'dashed', backgroundColor: '#f9f9f9' }}
                                   onClick={() => fileInputRef.current?.click()}
                            >
                                   <input
                                          type="file"
                                          hidden
                                          ref={fileInputRef}
                                          multiple
                                          accept="image/png, image/jpeg, image/webp, video/mp4"
                                          onChange={handleFileChange}
                                   />
                                   <div className="upload-dropzone-content">
                                          <i className="fa-solid fa-cloud-arrow-up fa-3x mb-3 text-muted"></i>
                                          <h5 className="fw-bold text-dark">Click to upload or drag and drop</h5>
                                          <p className="text-dark small mb-0">SVG, PNG, JPG or GIF (max. 10MB) / MP4 (max. 50MB)</p>
                                   </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            {/* Previews using sell.css grid */}
                            {(files.length > 0 || existingFiles.length > 0) && (
                                   <div className="upload-preview-grid mt-4">
                                          {/* Existing Files */}
                                          {existingFiles.map((url, idx) => {
                                                 const isVideo = url.toLowerCase().endsWith('.mp4');
                                                 const fullUrl = url.startsWith('http') ? url : `https://admin.xpertbid.com${url}`;

                                                 return (
                                                        <div key={`existing-${idx}`} className="upload-preview-item position-relative">
                                                               {isVideo ? (
                                                                      <video src={fullUrl} className="w-100 h-100 object-fit-cover rounded" />
                                                               ) : (
                                                                      <img src={fullUrl} alt="preview" className="w-100 h-100 object-fit-cover rounded" />
                                                               )}
                                                               <span className="position-absolute bottom-0 start-0 m-2 badge bg-primary">Saved</span>
                                                               <button
                                                                      type="button"
                                                                      className="btn-close position-absolute top-0 end-0 m-2 bg-white p-2"
                                                                      aria-label="Remove"
                                                                      onClick={() => {
                                                                             if (setExistingFiles) {
                                                                                    const newExisting = [...existingFiles];
                                                                                    newExisting.splice(idx, 1);
                                                                                    setExistingFiles(newExisting);
                                                                             }
                                                                      }}
                                                                      style={{ opacity: 0.8 }}
                                                               ></button>
                                                        </div>
                                                 );
                                          })}

                                          {/* New Files */}
                                          {files.map((file, idx) => (
                                                 <div key={`new-${idx}`} className="upload-preview-item position-relative">
                                                        {file.type.startsWith('video') ? (
                                                               <video src={getPreview(file)} className="w-100 h-100 object-fit-cover rounded" />
                                                        ) : (
                                                               <img src={getPreview(file)} alt="preview" className="w-100 h-100 object-fit-cover rounded" />
                                                        )}
                                                        <span className="position-absolute bottom-0 start-0 m-2 badge bg-success">New</span>
                                                        <button
                                                               type="button"
                                                               className="btn-close position-absolute top-0 end-0 m-2 bg-white p-2"
                                                               aria-label="Remove"
                                                               onClick={() => removeFile(idx)}
                                                               style={{ opacity: 0.8 }}
                                                        ></button>
                                                 </div>
                                          ))}
                                   </div>
                            )}

                            <div className="media-stage-actions d-flex justify-content-between align-items-center mt-5">
                                   <button
                                          type="button"
                                          className="btn btn-black px-4"
                                          onClick={onBack}
                                   >
                                          Back
                                   </button>
                                   <button
                                          type="submit"
                                          className="btn btn-black px-5"
                                          disabled={files.length === 0 && existingFiles.length === 0}
                                   >
                                          Continue
                                   </button>
                            </div>
                     </form>
              </section>
       );
}
