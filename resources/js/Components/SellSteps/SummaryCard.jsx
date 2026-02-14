import React from 'react';

/**
 * Reusable summary card for the Sell flow steps.
 * Matches the design in sell.css and sell.js reference.
 */
export default function SummaryCard({ type, title, subtitle, icon, onEdit, initial }) {
       const renderIcon = () => {
              if (icon) {
                     return <img src={icon} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />;
              }
              return (
                     <span className="list-type-initial">
                            {initial || (title ? title.slice(0, 1).toUpperCase() : 'L')}
                     </span>
              );
       };

       return (
              <div className="details-summary-card shadow-sm mb-4">
                     <div className="d-flex align-items-center gap-3">
                            <div className="sell-summary-thumb">
                                   {renderIcon()}
                            </div>
                            <div className="flex-grow-1">
                                   <p className="sell-summary-label mb-1">{type}</p>
                                   <h3 className="sell-summary-title mb-0">{title}</h3>
                                   {subtitle && <p className="sell-summary-subtitle mb-0 text-muted small">{subtitle}</p>}
                            </div>
                            {onEdit && (
                                   <button
                                          type="button"
                                          className="btn btn-link ms-auto sell-summary-change"
                                          onClick={onEdit}
                                   >
                                          Change
                                   </button>
                            )}
                     </div>
              </div>
       );
}
