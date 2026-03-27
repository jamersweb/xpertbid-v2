import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ListTypeSelection({ onSelect, onSaveDraft, isSavingDraft }) {
    const [infoTab, setInfoTab] = useState(null);

    const listingTypes = [
        {
            id: "auction",
            title: "Auction Product",
            copy: "Let buyers compete and place bids on your listing.",
            description: "An auction listing allows buyers to compete by placing progressively higher bids. You set a starting price and a duration. Once the auction ends, the highest bidder over the reserve price wins the item. This is perfect for high-demand items, collectibles, or unique products where the market value might be higher than expected.",
            iconClass: "list-type-option--auction",
            icon: "fa-gavel"
        },
        {
            id: "normal_list",
            title: "Normal Product",
            copy: "Set a fixed price and receive direct purchase requests.",
            description: "A normal listing is a standard 'Buy It Now' format. You set a fixed price for your product. Buyers can purchase the item immediately at that price. You can also add variations like color and size, and set specific discounts. This is ideal for everyday items with a clear market price.",
            iconClass: "list-type-option--normal",
            icon: "fa-tags"
        },
        {
            id: "business_list",
            title: "Business Product",
            copy: "Manage inventory, stock, and business-specific details.",
            description: "Business listings are designed for professional sellers and shops. They include advanced inventory management features such as SKU tracking and multi-quantity stock control. This format allows you to list products that you have in bulk and manage your business stock levels directly through the platform.",
            iconClass: "list-type-option--business",
            icon: "fa-briefcase"
        }
    ];

    const openModal = (e, id) => {
        e.stopPropagation();
        setInfoTab(id);
    };

    const closeModal = () => setInfoTab(null);

    const activeInfo = listingTypes.find(t => t.id === infoTab);

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

                    <div className="list-type-grid">
                        {listingTypes.map((type, index) => (
                            <div 
                                key={type.id} 
                                className={`list-type-option-wrapper ${index === 2 ? 'list-type-option-wrapper--wide' : ''}`}
                            >
                                <button
                                    type="button"
                                    className={`list-type-option ${type.iconClass}`}
                                    onClick={() => onSelect(type.id)}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2 w-100">
                                        <span className="list-type-option-title">{type.title}</span>
                                        <div 
                                            className="info-toggle-btn p-1"
                                            onClick={(e) => openModal(e, type.id)}
                                            title="Click for more info"
                                        >
                                            <i className="fa-solid fa-circle-info mt-1"></i>
                                        </div>
                                    </div>
                                    <span className="list-type-option-copy text-start w-100">
                                        {type.copy}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Modal */}
                {infoTab && (
                    <div className="list-type-modal-overlay" onClick={closeModal}>
                        <div className="list-type-modal-content shadow-lg" onClick={e => e.stopPropagation()}>
                            <div className="list-type-modal-header d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`modal-icon-circle ${activeInfo.iconClass}`}>
                                        <i className={`fa-solid ${activeInfo.icon}`}></i>
                                    </div>
                                    <h2 className="m-0 h4 fw-bold text-dark">{activeInfo.title}</h2>
                                </div>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="list-type-modal-body">
                                <p className="text-muted leading-relaxed mb-4">
                                    {activeInfo.description}
                                </p>
                                <button 
                                    type="button" 
                                    className="btn btn-black w-100 py-3 fw-bold"
                                    onClick={() => {
                                        onSelect(activeInfo.id);
                                        closeModal();
                                    }}
                                >
                                    Select This Listing Type
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sell-back-home-wrapper sell-back-home-wrapper--list-type">
                    <Link href="/" className="btn btn-black sell-back-home-btn">
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
}
