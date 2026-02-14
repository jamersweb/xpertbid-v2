import React from 'react';
import { Link } from '@inertiajs/react';

export default function ListTypeSelection({ onSelect, onSaveDraft, isSavingDraft }) {
       return (
              <section className="list-type-stage">
                     <div className="list-type-stage-inner">
                            <div className="list-type-card shadow-lg position-relative">
                                   {onSaveDraft && (
                                          <button
                                                 type="button"
                                                 className="btn btn-black save-draft-btn-header my-3 me-3"
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
                                   <h1 className="list-type-title">What would you like to list?</h1>
                                   <p className="list-type-subtitle">
                                          Select the listing format that suits your product.
                                   </p>
                                   <div className="list-type-options">
                                          <button
                                                 type="button"
                                                 className="list-type-option list-type-option--auction"
                                                 onClick={() => onSelect("auction")}
                                          >
                                                 <span className="list-type-option-title">Auction Product</span>
                                                 <span className="list-type-option-copy">
                                                        Let buyers compete and place bids on your listing.
                                                 </span>
                                          </button>
                                          <button
                                                 type="button"
                                                 className="list-type-option list-type-option--normal"
                                                 onClick={() => onSelect("normal_list")}
                                          >
                                                 <span className="list-type-option-title">Normal Product</span>
                                                 <span className="list-type-option-copy">
                                                        Set a fixed price and receive direct purchase requests.
                                                 </span>
                                          </button>
                                   </div>
                            </div>
                            <div className="sell-back-home-wrapper sell-back-home-wrapper--list-type">
                                   <Link href="/" className="btn btn-black sell-back-home-btn">
                                          Back to Home
                                   </Link>
                            </div>
                     </div>
              </section>
       );
}
