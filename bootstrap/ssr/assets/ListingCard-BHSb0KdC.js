import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import axios from "axios";
import { S as SuccessPopup, E as ErrorPopup } from "./ErrorPopup-VSFE5nHL.js";
import { u as useCart } from "./CartContext-DXNQZwkV.js";
import { P as Price } from "./Price-CF5NSPt0.js";
import Swal from "sweetalert2";
const ListPackeg = ({ isOpen, onClose, onPurchaseSuccess, listing }) => {
  const { auth } = usePage().props;
  const { addToCart } = useCart();
  const [walletBalance, setWalletBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupMessage, setSuccessPopupMessage] = useState("");
  const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");
  const [isPlanPurchased, setIsPlanPurchased] = useState(false);
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (auth?.user) {
        try {
          const response = await axios.get("https://admin.xpertbid.com/api/wallet", {
            headers: {
              Authorization: `Bearer ${auth.user.token}`,
              "Cache-Control": "no-store"
            }
          });
          console.log("Wallet API response:", response.data);
          setWalletBalance(response.data.balance);
        } catch (err) {
          console.error("Error fetching wallet balance", err);
        }
      }
    };
    fetchWalletBalance();
  }, [auth]);
  const handleBuyPlan = async (days) => {
    router.visit(`/checkout?direct=featured&listing_id=${listing.id}&duration=${days}`);
    onClose();
  };
  useEffect(() => {
    if (!isOpen && !isPlanPurchased) {
      setShowSuccessPopup(false);
      setShowErrorPopup(false);
      setErrorMessage("");
    }
  }, [isOpen, isPlanPurchased]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "modal fade show d-block", style: { background: "rgba(0, 0, 0, 0.5)" }, children: [
    showSuccessPopup && /* @__PURE__ */ jsx(
      SuccessPopup,
      {
        isOpen: showSuccessPopup,
        onClose: () => {
          setShowSuccessPopup(false);
          if (onPurchaseSuccess) {
            onPurchaseSuccess();
          }
          onClose();
          window.location.reload();
        },
        message: successPopupMessage,
        subMessage: successPopupSubMessage
      }
    ),
    showErrorPopup && /* @__PURE__ */ jsx(
      ErrorPopup,
      {
        isOpen: showErrorPopup,
        onClose: () => setShowErrorPopup(false),
        message: errorPopupMessage,
        subMessage: errorPopupSubMessage
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "modal-dialog modal-lg modal-dialog-centered", children: /* @__PURE__ */ jsxs("div", { className: "modal-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
        /* @__PURE__ */ jsx("h5", { className: "modal-title text-dark fw-bold", children: "Purchase your package" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "btn-close", onClick: onClose })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "modal-body", children: [
        errorMessage && /* @__PURE__ */ jsx("p", { className: "text-danger text-center", children: errorMessage }),
        /* @__PURE__ */ jsxs("div", { className: "col-12 mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-center text-dark fw-bold mb-4", children: "Select a Package" }),
          /* @__PURE__ */ jsx("div", { className: "row g-3", children: [
            { days: 7, original: 500, label: "Standard" },
            { days: 15, original: 1e3, label: "Value" },
            { days: 30, original: 2e3, label: "Premium" }
          ].map((pkg) => /* @__PURE__ */ jsx("div", { className: "col-md-4", children: /* @__PURE__ */ jsxs("div", { className: "card h-100 shadow-sm border-0 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "card-header bg-transparent border-0 pt-4", children: [
              /* @__PURE__ */ jsx("h5", { className: "card-title fw-bold text-uppercase text-dark small mb-0", children: pkg.label }),
              /* @__PURE__ */ jsx("h2", { className: "display-4 my-2 fw-bold text-dark", children: pkg.days }),
              /* @__PURE__ */ jsx("span", { className: "text-secondary small", children: "Days" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
              /* @__PURE__ */ jsxs("div", { className: "price-tag mb-3 d-flex align-items-center justify-content-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-decoration-line-through text-muted fs-5", children: [
                  pkg.original,
                  " PKR"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "badge bg-success fs-6", children: "FREE" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "card-text text-muted small", children: [
                "Featured visibility for ",
                pkg.days,
                " days."
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "card-footer bg-transparent border-0 pb-4", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn btn-outline-dark w-100",
                onClick: () => handleBuyPlan(pkg.days),
                disabled: isPlanPurchased,
                children: "Buy"
              }
            ) })
          ] }) }, pkg.days)) })
        ] })
      ] })
    ] }) })
  ] });
};
const ListingCard = ({ listing, onDeleted }) => {
  const [isListPackegOpen, setIsListPackegOpen] = useState(false);
  const [isPromoteDisabled, setIsPromoteDisabled] = useState(
    listing.featured_name === "home_featured"
  );
  const [isPromoted, setIsPromoted] = useState(false);
  const isCancelled = (listing.status || "").toLowerCase() === "cancelled";
  const localStorageKey = `promoted_${listing.id}`;
  useEffect(() => {
    const promoted = localStorage.getItem(localStorageKey);
    if (promoted === "true") {
      setIsPromoteDisabled(true);
      setIsPromoted(true);
    }
  }, [localStorageKey]);
  const handleClick = () => {
    if (isPromoteDisabled) return;
    setIsPromoted(true);
    setIsListPackegOpen(true);
  };
  const handlePurchaseSuccess = () => {
    setIsListPackegOpen(false);
    setIsPromoteDisabled(true);
    localStorage.setItem(localStorageKey, "true");
  };
  const handlePopupClose = () => {
    setIsListPackegOpen(false);
  };
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This listing will be cancelled and removed from your active list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    });
    if (result.isConfirmed) {
      try {
        const listingKey = listing.slug || listing.id;
        await axios.post(`/auctions/${listingKey}/cancel`);
        Swal.fire("Cancelled!", "Listing has been cancelled.", "success");
        if (onDeleted) onDeleted(listing.id);
      } catch (error) {
        console.error("Cancel error:", error);
        Swal.fire("Error", "Failed to cancel listing.", "error");
      }
    }
  };
  const isDraft = listing.is_draft === true;
  const normalizedListType = (listing.list_type || listing.listing_type || "").toLowerCase();
  const isNormalList = normalizedListType === "normal_list" || normalizedListType === "normal";
  const highestBidAED = typeof listing?.currentBid === "number" ? listing.currentBid : 0;
  const listingTitle = listing?.title || "Untitled Listing";
  listing?.album || null;
  const listingStartDate = listing?.start_date || "Not set";
  const listingEndDate = listing?.end_date || "Not set";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `listing-card col-12${listing.featured_name === "home_featured" ? " listing_promoted" : ""}${isCancelled ? " listing_cancelled" : ""}`,
      style: {
        border: isCancelled ? "2px solid #ddd" : "1px solid #ddd",
        opacity: isCancelled ? 0.6 : 1,
        pointerEvents: isCancelled ? "none" : "auto"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
        /* @__PURE__ */ jsx("div", { className: "col-lg-7 listing-detail", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
          /* @__PURE__ */ jsx("div", { className: "col-md-3", children: /* @__PURE__ */ jsxs("div", { className: "listing-img", style: { position: "relative", width: "100%", height: "130px", overflow: "hidden" }, children: [
            listing.list_type === "normal_list" && listing.discount_type && listing.discount_value > 0 && /* @__PURE__ */ jsx("div", { style: {
              position: "absolute",
              top: "5px",
              left: "5px",
              background: "rgba(220, 53, 69, 0.9)",
              color: "white",
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "bold",
              zIndex: 10
            }, children: listing.discount_type === "percent" ? `${Math.round(listing.discount_value)}%` : "SALE" }),
            "                                                         ",
            (() => {
              const imageSrc = listing?.image_url;
              if (imageSrc) {
                return /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: imageSrc,
                    alt: listingTitle,
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    },
                    onError: (e) => {
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px;">No Image</div>';
                      }
                    }
                  }
                );
              }
              return /* @__PURE__ */ jsx("div", { style: {
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: "14px"
              }, children: "No Image" });
            })()
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "col-md-9", children: [
            /* @__PURE__ */ jsxs("h3", { className: "listing-product-title d-flex align-items-center gap-2", children: [
              listingTitle,
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "badge rounded-pill",
                  style: {
                    fontSize: "12px",
                    padding: "4px 12px",
                    textTransform: "capitalize",
                    fontWeight: "600",
                    ...listing?.status?.toLowerCase() === "active" ? { backgroundColor: "#E3F9E5", color: "#1B7C25", border: "1px solid #1B7C25" } : listing?.status?.toLowerCase() === "inactive" ? { backgroundColor: "#F0F2F5", color: "#64748b", border: "1px solid #64748b" } : listing?.status?.toLowerCase() === "pending" ? { backgroundColor: "#FFF4E5", color: "#B76E00", border: "1px solid #B76E00" } : listing?.status?.toLowerCase() === "decline" ? { backgroundColor: "#FFEBEB", color: "#D32F2F", border: "1px solid #D32F2F" } : { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #475569" }
                  },
                  children: listing?.status || "Draft"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "listing-product-bid-time", children: /* @__PURE__ */ jsxs("div", { className: "row", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-sm-5 bid-and-price", children: [
                /* @__PURE__ */ jsx("p", { className: "listing-bid-label", children: isNormalList ? "Price" : highestBidAED > 0 ? "Highest Bid" : "Starting Bid" }),
                /* @__PURE__ */ jsx("div", { className: "listingPrice", children: /* @__PURE__ */ jsx("span", { className: "ms-1 listingPriceNumber", children: isNormalList ? (() => {
                  let finalPrice = Number(listing.reserve_price || listing.minimum_bid || 0);
                  const originalPrice = finalPrice;
                  if (listing.discount_type && listing.discount_value > 0) {
                    if (listing.discount_type === "percent") {
                      finalPrice = originalPrice - originalPrice * (listing.discount_value / 100);
                    } else if (listing.discount_type === "flat") {
                      finalPrice = originalPrice - listing.discount_value;
                    }
                    if (finalPrice < 0) finalPrice = 0;
                    return /* @__PURE__ */ jsxs("span", { className: "d-flex align-items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted fs-6", children: /* @__PURE__ */ jsx(Price, { amountAED: originalPrice }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-danger", children: /* @__PURE__ */ jsx(Price, { amountAED: finalPrice }) })
                    ] });
                  }
                  return /* @__PURE__ */ jsx(Price, { amountAED: finalPrice });
                })() : highestBidAED > 0 ? /* @__PURE__ */ jsx(Price, { amountAED: highestBidAED }) : /* @__PURE__ */ jsx(Price, { amountAED: listing.minimum_bid || 0 }) }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "col-sm-7 bid-and-time", children: !isNormalList && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("p", { className: "listing-bid-end-label", children: isDraft ? "Created" : "End in" }),
                /* @__PURE__ */ jsx("p", { className: "listingTime", children: isDraft ? /* @__PURE__ */ jsx("span", { className: "listingDate", children: listingStartDate }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "listingDate", children: !isNaN(new Date(listingEndDate)) ? new Date(listingEndDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Not set" }),
                  " ",
                  "at ",
                  /* @__PURE__ */ jsx("span", { className: "lisitngTime", children: !isNaN(new Date(listingEndDate)) ? new Date(listingEndDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not set" })
                ] }) })
              ] }) })
            ] }) })
          ] })
        ] }) }),
        isPromoted && /* @__PURE__ */ jsx("span", { className: "badge bg-success ms-2 d-none", children: "Promoted" }),
        /* @__PURE__ */ jsxs("div", { className: "col-lg-5 edit-promote d-flex align-items-center", children: [
          (listing.status || "").toLowerCase() === "active" && /* @__PURE__ */ jsxs(
            "span",
            {
              className: "listingPromote",
              onClick: !isPromoteDisabled ? handleClick : void 0,
              style: {
                cursor: isPromoteDisabled ? "not-allowed" : "pointer",
                opacity: isPromoteDisabled ? 0.6 : 1,
                backgroundColor: isPromoteDisabled ? "#12D18E" : "#52d4862e",
                color: isPromoteDisabled ? "#fff" : "#32A861"
              },
              children: [
                isPromoteDisabled ? /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M14.9257 8.93341H12.3507V2.93341C12.3507 1.53341 11.5924 1.25008 10.6674 2.30008L10.0007 3.05841L4.35908 9.47508C3.58408 10.3501 3.90908 11.0667 5.07574 11.0667H7.65074V17.0667C7.65074 18.4667 8.40907 18.7501 9.33407 17.7001L10.0007 16.9417L15.6424 10.5251C16.4174 9.65008 16.0924 8.93341 14.9257 8.93341Z",
                        fill: "white"
                      }
                    )
                  }
                ) : /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/assets/images/flash.svg",
                    alt: "Promote",
                    width: 20,
                    height: 20
                  }
                ),
                "Promote"
              ]
            }
          ),
          !isDraft && listing.slug && /* @__PURE__ */ jsx(Link, { href: `/product/${listing.slug}`, className: "ms-2", children: /* @__PURE__ */ jsx("button", { className: "button-style-1 editListing", children: "View" }) }),
          /* @__PURE__ */ jsx(Link, { href: `/auctions/${listing.slug}/edit`, className: "ms-2", children: /* @__PURE__ */ jsx("button", { className: "button-style-1 editListing", children: "Edit" }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "button-style-1 editListing ms-2",
              style: { backgroundColor: "#dc3545", color: "#fff", border: "1px solid #dc3545" },
              onClick: handleDelete,
              children: /* @__PURE__ */ jsx("i", { className: "fa fa-trash" })
            }
          ),
          isListPackegOpen && /* @__PURE__ */ jsx(
            ListPackeg,
            {
              isOpen: isListPackegOpen,
              onPurchaseSuccess: handlePurchaseSuccess,
              onClose: handlePopupClose,
              listing
            }
          )
        ] })
      ] })
    }
  );
};
export {
  ListingCard as L
};
