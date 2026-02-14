import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage, router } from "@inertiajs/react";
import useCurrencyList from "@/Utils/useCurrencyList";
import SuccessPopup from "@/Components/SuccessPopup";
import ErrorPopup from "@/Components/ErrorPopup";
import { useCart } from "@/Contexts/CartContext";

const ListPackeg = ({ isOpen, onClose, onPurchaseSuccess, listing }) => {
       const { auth } = usePage().props;
       const { addToCart } = useCart();
       // const { selected: currentCurrency } = useCurrencyList();
       const [walletBalance, setWalletBalance] = useState(0);
       const [errorMessage, setErrorMessage] = useState("");

       // Popup states for success and error
       const [showSuccessPopup, setShowSuccessPopup] = useState(false);
       const [successPopupMessage, setSuccessPopupMessage] = useState("");
       const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");

       const [showErrorPopup, setShowErrorPopup] = useState(false);
       const [errorPopupMessage, setErrorPopupMessage] = useState("");
       const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

       // Flag state: tracks if the plan is purchased so that the promote button remains disabled if purchased
       const [isPlanPurchased, setIsPlanPurchased] = useState(false);

       // Fetch the wallet balance when component mounts or when session changes
       useEffect(() => {
              const fetchWalletBalance = async () => {
                     if (auth?.user) {
                            try {
                                   const response = await axios.get("https://admin.xpertbid.com/api/wallet", {
                                          headers: {
                                                 Authorization: `Bearer ${auth.user.token}`,
                                                 "Cache-Control": "no-store",
                                          },
                                   });
                                   console.log("Wallet API response:", response.data); // Debug: log the response data
                                   setWalletBalance(response.data.balance);
                            } catch (err) {
                                   console.error("Error fetching wallet balance", err);
                            }
                     }
              };
              fetchWalletBalance();
       }, [auth]);

       // Handler for buying a plan with a given price
       const handleBuyPlan = async (days) => {
              // Redirect to checkout directly for promotion
              // In Inertia, we navigate. Assuming checkout route exists or handled via specialized page.
              // The reference uses: router.push(`/checkout?direct=featured&auction_id=${listing.id}&duration=${days}`);
              // We will do the same with Inertia.
              router.visit(`/checkout?direct=featured&auction_id=${listing.id}&duration=${days}`);
              onClose();
       };

       // Reset transient states when modal closes (if plan wasn't purchased)
       useEffect(() => {
              if (!isOpen && !isPlanPurchased) {
                     setShowSuccessPopup(false);
                     setShowErrorPopup(false);
                     setErrorMessage("");
              }
       }, [isOpen, isPlanPurchased]);

       if (!isOpen) return null;

       return (
              <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                     {/* Success Popup */}
                     {showSuccessPopup && (
                            <SuccessPopup
                                   isOpen={showSuccessPopup}
                                   onClose={() => {
                                          setShowSuccessPopup(false);
                                          // After closing the success popup, trigger parent's onPurchaseSuccess callback and then close this modal.
                                          if (onPurchaseSuccess) {
                                                 onPurchaseSuccess();
                                          }
                                          onClose();
                                          window.location.reload(); // Refresh the page when the popup is closed
                                   }}
                                   message={successPopupMessage}
                                   subMessage={successPopupSubMessage}
                            />
                     )}
                     {/* Error Popup */}
                     {showErrorPopup && (
                            <ErrorPopup
                                   isOpen={showErrorPopup}
                                   onClose={() => setShowErrorPopup(false)}
                                   message={errorPopupMessage}
                                   subMessage={errorPopupSubMessage}
                            />
                     )}
                     <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                   {/* Modal Header */}
                                   <div className="modal-header">
                                          <h5 className="modal-title">Purchase your package</h5>
                                          <button type="button" className="btn-close" onClick={onClose}></button>
                                   </div>
                                   {/* Modal Body */}
                                   <div className="modal-body">
                                          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                                          <div className="col-12 mb-4">
                                                 <h3 className="text-center mb-4">Select a Package</h3>
                                                 <div className="row g-3">
                                                        {[
                                                               { days: 7, original: 500, label: "Standard" },
                                                               { days: 15, original: 1000, label: "Value" },
                                                               { days: 30, original: 2000, label: "Premium" },
                                                        ].map((pkg) => (
                                                               <div className="col-md-4" key={pkg.days}>
                                                                      <div className="card h-100 shadow-sm border-0 text-center">
                                                                             <div className="card-header bg-transparent border-0 pt-4">
                                                                                    <h5 className="card-title fw-bold text-uppercase text-muted small mb-0">
                                                                                           {pkg.label}
                                                                                    </h5>
                                                                                    <h2 className="display-4 my-2 fw-bold text-dark">
                                                                                           {pkg.days}
                                                                                    </h2>
                                                                                    <span className="text-muted small">Days</span>
                                                                             </div>
                                                                             <div className="card-body">
                                                                                    <div className="price-tag mb-3 d-flex align-items-center justify-content-center gap-2">
                                                                                           <span className="text-decoration-line-through text-muted fs-5">
                                                                                                  {pkg.original} PKR
                                                                                           </span>
                                                                                           <span className="badge bg-success fs-6">FREE</span>
                                                                                    </div>
                                                                                    <p className="card-text text-muted small">
                                                                                           Featured visibility for {pkg.days} days.
                                                                                    </p>
                                                                             </div>
                                                                             <div className="card-footer bg-transparent border-0 pb-4">
                                                                                    <button
                                                                                           className="btn btn-outline-dark w-100"
                                                                                           onClick={() => handleBuyPlan(pkg.days)}
                                                                                           disabled={isPlanPurchased}
                                                                                    >
                                                                                           Buy
                                                                                    </button>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </div>
                                          </div>
                                   </div>
                                   {/* Optionally, add a modal footer here */}
                            </div>
                     </div>
              </div>
       );
};

export default ListPackeg;
