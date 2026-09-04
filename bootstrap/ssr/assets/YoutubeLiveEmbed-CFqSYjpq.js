import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePage, router } from "@inertiajs/react";
import { P as Price } from "./Price-CF5NSPt0.js";
import { u as useCart } from "./productUrl-DG64MGAp.js";
import { c as getListingVariations, i as isSoldOutListing, d as getVariationPriceMeta, g as getDiscountMeta } from "./listingPricing-AMeF2Tun.js";
function BidSection({ product, highestBidProp, onBidPlaced, winnerDetails, isFavoriteProp }) {
  const { auth, flash } = usePage().props;
  const { addToCart } = useCart();
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [highestBid, setHighestBid] = useState(highestBidProp || 0);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const variations = getListingVariations(product);
  const [selectedVariationId, setSelectedVariationId] = useState(variations[0]?.id ?? null);
  const selectedVariation = variations.find((variation) => String(variation.id) === String(selectedVariationId)) || variations[0] || null;
  const variationColors = [...new Set(variations.map((variation) => variation.color).filter(Boolean))];
  const hasVariationMatrix = variationColors.length > 0 && variations.some((variation) => variation.size);
  const sizesForSelectedColor = variations.filter((variation) => !selectedVariation?.color || variation.color === selectedVariation.color).map((variation) => variation.size).filter(Boolean);
  const uniqueSizesForSelectedColor = [...new Set(sizesForSelectedColor)];
  const normalizedListType = String(product?.list_type || product?.listing_type || "").toLowerCase();
  const isAuctionSale = normalizedListType === "auction" || normalizedListType === "live_auction";
  const isDirectSale = normalizedListType === "normal" || normalizedListType === "normal_list" || normalizedListType === "business" || normalizedListType === "business_list";
  const isSoldOut = isSoldOutListing(product);
  const auctionStartPrice = product.minimum_bid || product.listing_data?.start_price || 0;
  const auctionReservePrice = product.reserve_price || product.listing_data?.reserve_price || 0;
  const categoryIds = [
    product?.category_id,
    product?.category?.id,
    product?.sub_category_id,
    product?.subCategory?.id,
    product?.child_category_id,
    product?.childCategory?.id
  ].map((value) => String(value || ""));
  const categoryNames = [
    product?.category?.name,
    product?.category_name,
    product?.subCategory?.name,
    product?.childCategory?.name
  ].map((value) => String(value || "").toLowerCase());
  const isPropertyOrVehicle = categoryIds.some((id) => id === "222" || id === "311") || categoryNames.some((name) => name.includes("property") || name.includes("vehicle"));
  const shouldContactSupport = isDirectSale && isPropertyOrVehicle;
  const winnerName = winnerDetails?.[0]?.name || winnerDetails?.name || product?.winner_details?.name || product?.winner_details?.[0]?.name || "the highest bidder";
  const variationPriceMeta = selectedVariation ? getVariationPriceMeta(selectedVariation, product) : getDiscountMeta(product);
  const baseSalePrice = variationPriceMeta.originalPrice;
  const hasDiscount = variationPriceMeta.hasDiscount;
  const finalSalePrice = variationPriceMeta.finalPrice;
  useEffect(() => {
    if (flash?.success) {
      showNotification(flash.success, "success");
    }
    if (flash?.error) {
      showNotification(flash.error, "error");
    }
  }, [flash]);
  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4e3);
  };
  useEffect(() => {
    setHighestBid(highestBidProp);
  }, [highestBidProp]);
  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);
  useEffect(() => {
    const nextVariations = getListingVariations(product);
    if (!nextVariations.length) {
      setSelectedVariationId(null);
      return;
    }
    setSelectedVariationId((current) => {
      const stillValid = nextVariations.some((variation) => String(variation.id) === String(current));
      return stillValid ? current : nextVariations[0].id;
    });
  }, [product?.id]);
  const selectVariationByColor = (color) => {
    const matchingSize = variations.find((variation) => variation.color === color && variation.size === selectedVariation?.size);
    const fallback = variations.find((variation) => variation.color === color);
    setSelectedVariationId((matchingSize || fallback)?.id ?? selectedVariationId);
  };
  const selectVariationBySize = (size) => {
    const matching = variations.find((variation) => variation.size === size && (!selectedVariation?.color || variation.color === selectedVariation.color));
    setSelectedVariationId(matching?.id ?? selectedVariationId);
  };
  const handleToggleFavorite = () => {
    if (!auth.user) {
      showNotification("Please login to add to favorites", "error");
      return;
    }
    setIsTogglingFavorite(true);
    router.post(route("favorites.toggle"), {
      listing_id: product.id
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsFavorite(!isFavorite);
        setIsTogglingFavorite(false);
      },
      onError: () => {
        setIsTogglingFavorite(false);
        showNotification("Failed to update favorites", "error");
      }
    });
  };
  const isOwner = auth.user && (auth.user.id === product.user_id || auth.user.id === product.owner_id || auth.user.id === product.seller_id);
  const handlePlaceBid = async () => {
    if (isSoldOut) {
      showNotification("This product is sold out", "error");
      return;
    }
    if (!auth.user) {
      showNotification("Please login to place a bid", "error");
      return;
    }
    if (isOwner) {
      showNotification("You cannot bid on your own product", "error");
      return;
    }
    if (!bidAmount || Number(bidAmount) <= highestBid) {
      showNotification("Bid must be higher than the current highest bid", "error");
      return;
    }
    setShowConfirm(true);
  };
  const handleConfirmPlaceBid = () => {
    setShowConfirm(false);
    setIsPlacingBid(true);
    router.post("/bids", {
      listing_id: product.id,
      bid_amount: bidAmount,
      bid_source: "web"
    }, {
      onSuccess: () => {
        setBidAmount("");
        setIsPlacingBid(false);
        if (onBidPlaced) onBidPlaced();
      },
      onError: (errors) => {
        setIsPlacingBid(false);
        const errorMsg = Object.values(errors).join("\n");
        showNotification(errorMsg || "Failed to place bid", "error");
      },
      onFinish: () => {
        setIsPlacingBid(false);
      }
    });
  };
  const handleAddToCart = async () => {
    if (isSoldOut) {
      showNotification("This product is sold out", "error");
      return;
    }
    if (isDirectSale && variations.length > 0 && selectedVariation == null) {
      showNotification("Please select a size or color", "error");
      return;
    }
    setIsAddingToCart(true);
    const result = await addToCart(product.id, "product", selectedVariation?.id ?? null, product);
    setIsAddingToCart(false);
    if (result.success) {
      showNotification(result.message, "success");
    } else {
      showNotification(result.message, "error");
    }
  };
  const handleBuyNow = async () => {
    if (isSoldOut) {
      showNotification("This product is sold out", "error");
      return;
    }
    if (isDirectSale && variations.length > 0 && selectedVariation == null) {
      showNotification("Please select a size or color", "error");
      return;
    }
    setIsAddingToCart(true);
    const result = await addToCart(product.id, "product", selectedVariation?.id ?? null, product);
    if (result.success || result.message === "Product already in cart") {
      router.visit(route("checkout.index"));
    } else {
      setIsAddingToCart(false);
      showNotification(result.message, "error");
    }
  };
  const handleContactSupport = () => {
    const message = encodeURIComponent(`Hello XpertBid Support, I need help with this listing: ${product?.title || ""}`);
    window.open(`https://wa.me/923022113202?text=${message}`, "_blank", "noopener,noreferrer");
  };
  const handleChat = async () => {
    if (!auth.user) {
      showNotification("Please login to chat with the seller", "error");
      return;
    }
    if (isOwner) {
      showNotification("You cannot chat with yourself", "error");
      return;
    }
    try {
      const response = await axios.post("/chat/initiate", {
        user_id: product.user_id || product.seller_id || product.owner_id,
        product_id: product.id
      });
      if (response.data && response.data.id) {
        router.visit(`/chat?conversation_id=${response.data.id}`);
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      showNotification("Failed to start conversation. Please try again.", "error");
    }
  };
  const buildAvatarUrl = (avatar) => {
    if (!avatar) return "/assets/images/user-fallback.png";
    if (String(avatar).startsWith("http")) return avatar;
    const normalized = String(avatar).replace(/\\/g, "/");
    if (normalized.startsWith("/")) return normalized;
    return `/${normalized.replace(/^\/+/, "")}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "product-details-brief-parent", style: { padding: "0 10px" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "product-heading mb-3", children: product.title }),
    isSoldOut && /* @__PURE__ */ jsxs("div", { className: "sold-out-banner mb-4", children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-box-open me-2" }),
      "Sold Out"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "owned-by-and-favoruite d-flex align-items-center justify-content-between mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "owned d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "customer-profile-wrap", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: buildAvatarUrl(product.seller?.profile_pic || product.user?.profile_pic),
            alt: "Owner",
            style: { width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" },
            onError: (e) => {
              e.target.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "customer-name d-flex flex-column", children: [
          /* @__PURE__ */ jsx("span", { className: "owner text-muted small fw-semibold", style: { fontSize: "12px" }, children: "Owned By" }),
          /* @__PURE__ */ jsx("p", { className: "name mb-0 fw-bold text-dark", style: { fontSize: "15px" }, children: product.seller?.name || product.user?.name || "Ali" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "d-flex align-items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleChat,
            className: "btn btn-outline-primary btn-sm d-flex align-items-center gap-2",
            style: { borderRadius: "20px", padding: "5px 15px", fontSize: "13px" },
            children: [
              /* @__PURE__ */ jsx("i", { className: "fa-regular fa-comment-dots" }),
              "Chat"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleToggleFavorite,
            disabled: isTogglingFavorite,
            className: "fav-btn border-0 bg-light p-2 rounded-2",
            children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: isFavorite ? "#ef4444" : "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { d: "M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z", stroke: isFavorite ? "#ef4444" : "#23262F", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
          }
        )
      ] })
    ] }),
    isAuctionSale ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "bid-rank-and-time detail-auction-strip mb-3", children: /* @__PURE__ */ jsxs("div", { className: "detail-auction-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "rank", children: "Highest Bid" }),
        /* @__PURE__ */ jsx("div", { className: "price", title: String(highestBid), children: /* @__PURE__ */ jsx(Price, { amountAED: highestBid }) })
      ] }) }),
      (product.status === "awarded" || product.status === "awarded ") && /* @__PURE__ */ jsx("div", { className: "winner-section-ref mb-3", children: /* @__PURE__ */ jsxs("div", { className: "winner-text-ref", children: [
        /* @__PURE__ */ jsx("span", { className: "trophy-icon-ref", children: "🏆" }),
        "Bid awarded to ",
        winnerName
      ] }) }),
      product.status !== "awarded" && product.status !== "awarded " && !isSoldOut && /* @__PURE__ */ jsxs("div", { className: "bid-input-wrap mb-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            placeholder: "Enter amount",
            className: "form-control border-secondary-subtle",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", padding: "0 20px" },
            value: bidAmount,
            onChange: (e) => setBidAmount(e.target.value),
            disabled: isPlacingBid || isOwner
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold mt-3",
            style: { height: "50px", fontSize: "18px", borderRadius: "10px", backgroundColor: "#23262F", color: "#fff", border: "none" },
            onClick: handlePlaceBid,
            disabled: isPlacingBid || isOwner,
            children: isPlacingBid ? "Placing Bid..." : "Place Bid"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-bid-and-estimate d-flex justify-content-between mt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "minimum-bid text-muted small", children: [
          "Starting bid price: ",
          /* @__PURE__ */ jsx("span", { className: "text-dark fw-semibold", children: /* @__PURE__ */ jsx(Price, { amountAED: auctionStartPrice }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "estimate-bid text-muted small", children: [
          "Market Value: ",
          /* @__PURE__ */ jsx("span", { className: "text-dark fw-semibold", children: /* @__PURE__ */ jsx(Price, { amountAED: auctionReservePrice }) })
        ] })
      ] }),
      (product.is_1_rupee === 1 || product.is_1_rupee === "1") && (product.status !== "awarded" && product.status !== "awarded ") && /* @__PURE__ */ jsx("div", { className: "disclaimer mt-3 bg-secondary bg-opacity-5 p-2 rounded-2", children: /* @__PURE__ */ jsxs("p", { className: "mb-0 text-muted", style: { fontSize: "12px" }, children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info me-1" }),
        "In our Rs. 1 Auction, if a new bid is placed in the last 5 minutes, the auction timer will automatically reset to 15 minutes."
      ] }) })
    ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "normal-pricing-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "d-flex flex-wrap gap-2 mb-3", children: [
        product.product_condition && /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2", style: { backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small", children: "Condition" }),
          /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark text-capitalize", children: product.product_condition })
        ] }),
        product.product_year && /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-light rounded-pill border d-flex align-items-center gap-2", style: { backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted small", children: "Year" }),
          /* @__PURE__ */ jsx("span", { className: "fw-bold text-dark", children: product.product_year })
        ] })
      ] }),
      variations.length > 0 && /* @__PURE__ */ jsx("div", { className: "product-variations mb-3", children: hasVariationMatrix ? /* @__PURE__ */ jsxs(Fragment, { children: [
        variationColors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "rank text-muted small fw-semibold d-block mb-2", children: "Color" }),
          /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2", children: variationColors.map((color) => {
            const isActive = selectedVariation?.color === color;
            return /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `btn btn-sm ${isActive ? "btn-dark" : "btn-outline-secondary"}`,
                style: { borderRadius: "20px", padding: "6px 14px" },
                onClick: () => selectVariationByColor(color),
                children: color
              },
              color
            );
          }) })
        ] }),
        uniqueSizesForSelectedColor.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "rank text-muted small fw-semibold d-block mb-2", children: "Size" }),
          /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2", children: uniqueSizesForSelectedColor.map((size) => {
            const isActive = selectedVariation?.size === size;
            return /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `btn btn-sm ${isActive ? "btn-dark" : "btn-outline-secondary"}`,
                style: { borderRadius: "20px", padding: "6px 14px" },
                onClick: () => selectVariationBySize(size),
                children: size
              },
              size
            );
          }) })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "rank text-muted small fw-semibold d-block mb-2", children: "Variations" }),
        /* @__PURE__ */ jsx("div", { className: "d-flex flex-wrap gap-2", children: variations.map((variation) => {
          const isActive = String(selectedVariation?.id) === String(variation.id);
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `btn btn-sm ${isActive ? "btn-dark" : "btn-outline-secondary"}`,
              style: { borderRadius: "20px", padding: "6px 14px" },
              onClick: () => setSelectedVariationId(variation.id),
              children: variation.name
            },
            variation.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bid-rank-and-time bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center", children: /* @__PURE__ */ jsxs("div", { className: "bid-price-and-rank d-flex flex-column", children: [
        /* @__PURE__ */ jsx("span", { className: "rank text-muted small fw-semibold", children: "Price" }),
        /* @__PURE__ */ jsxs("div", { className: "price fw-bold d-flex align-items-center gap-2", children: [
          hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-decoration-line-through text-muted", style: { fontSize: "16px" }, children: /* @__PURE__ */ jsx(Price, { amountAED: baseSalePrice }) }),
          /* @__PURE__ */ jsx("span", { className: "text-dark", style: { fontSize: "28px" }, children: /* @__PURE__ */ jsx(Price, { amountAED: finalSalePrice }) }),
          hasDiscount && /* @__PURE__ */ jsx("span", { className: "badge bg-danger", children: variationPriceMeta.badgeText })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "action-buttons d-grid gap-2 mb-3", children: isSoldOut ? /* @__PURE__ */ jsxs("div", { className: "sold-out-action-box", children: [
        /* @__PURE__ */ jsx("span", { className: "sold-out-action-label", children: "Sold Out" }),
        /* @__PURE__ */ jsx("p", { className: "mb-0 text-muted", style: { fontSize: "13px" }, children: "This listing is no longer available for purchase or bidding." })
      ] }) : shouldContactSupport ? /* @__PURE__ */ jsxs(
        "button",
        {
          className: "btn w-100 fw-bold",
          style: { height: "50px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#25D366", color: "#fff", border: "none" },
          onClick: handleContactSupport,
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-brands fa-whatsapp me-2" }),
            "Contact to Support"
          ]
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#23262F", color: "#fff", border: "none" },
            onClick: handleAddToCart,
            disabled: isOwner || isAddingToCart,
            children: isAddingToCart ? "Adding..." : "Add to Cart"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "btn w-100 fw-bold",
            style: { height: "50px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#43ACE9", color: "#fff", border: "none" },
            onClick: handleBuyNow,
            disabled: isOwner || isAddingToCart,
            children: "Buy Now"
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                            .winner-section-ref {
                                   width: 100%;
                                   text-align: center;
                                   background: #f0f9ff !important;
                                   padding: 10px;
                                   border-radius: 8px;
                                   border: 1px dashed #43ACE9 !important;
                            }
                            .winner-text-ref {
                                   font-size: 1.1rem;
                                   font-weight: 700;
                                   color: #0284c7;
                                   margin-top: 4px;
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;
                                   gap: 6px;
                            }
                            .trophy-icon-ref {
                                   color: #eab308;
                                   font-size: 1.2rem;
                            }
                            .detail-auction-strip {
                                   background: #f8fafc;
                                   border: 1px solid #e5e7eb;
                                   border-radius: 18px;
                                   padding: 18px 20px;
                                   box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
                            }
                            .detail-auction-meta {
                                   display: flex;
                                   flex-direction: column;
                                   gap: 8px;
                                   min-width: 0;
                            }
                            .detail-auction-meta .rank {
                                   color: #6b7280;
                                   font-size: 13px;
                                   font-weight: 600;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }
                            .detail-auction-meta .price {
                                   color: #111827;
                                   font-size: clamp(24px, 3vw, 36px);
                                   font-weight: 800;
                                   line-height: 1.05;
                                   letter-spacing: -0.03em;
                                   white-space: nowrap;
                                   overflow: hidden;
                                   text-overflow: ellipsis;
                            }
                            .sold-out-banner {
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 8px;
                                   padding: 10px 18px;
                                   border-radius: 999px;
                                   background: linear-gradient(135deg, #991b1b, #dc2626);
                                   color: #fff;
                                   font-size: 14px;
                                   font-weight: 800;
                                   letter-spacing: 0.08em;
                                   text-transform: uppercase;
                                   box-shadow: 0 10px 20px rgba(220, 38, 38, 0.18);
                            }
                            .sold-out-action-box {
                                   padding: 16px 18px;
                                   border-radius: 16px;
                                   border: 1px solid #fecaca;
                                   background: #fff1f2;
                                   text-align: center;
                            }
                            .sold-out-action-label {
                                   display: inline-block;
                                   margin-bottom: 8px;
                                   padding: 6px 14px;
                                   border-radius: 999px;
                                   background: #dc2626;
                                   color: #fff;
                                   font-size: 12px;
                                   font-weight: 800;
                                   letter-spacing: 0.08em;
                                   text-transform: uppercase;
                            }
                            .detail-auction-meta .price span {
                                   color: inherit !important;
                            }
                            @media (max-width: 575px) {
                                   .detail-auction-strip {
                                          padding: 16px 14px;
                                    }
                                   .detail-auction-meta {
                                          min-width: 0;
                                   }
                                   .detail-auction-meta .price {
                                          font-size: 28px;
                                   }
                            }
                     ` }),
    showConfirm && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e4,
      animation: "fadeInOverlay 0.3s ease-out"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff",
        padding: "40px 30px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "450px",
        width: "90%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: "popupIn 0.3s ease-out"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: { marginBottom: "20px" }, children: /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: "#f3f4f6",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px"
        }, children: "💰" }) }),
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "24px", fontWeight: "800", marginBottom: "10px", color: "#111827" }, children: "Confirm Your Bid" }),
        /* @__PURE__ */ jsxs("p", { style: { color: "#6b7280", fontSize: "16px", marginBottom: "30px" }, children: [
          "Are you sure you want to place a bid of ",
          /* @__PURE__ */ jsx("span", { style: { color: "#000", fontWeight: "700" }, children: /* @__PURE__ */ jsx(Price, { amountAED: bidAmount }) }),
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "d-flex gap-3 justify-content-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowConfirm(false),
              style: {
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontWeight: "600",
                color: "#374151"
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleConfirmPlaceBid,
              style: {
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "#000",
                color: "#fff",
                fontWeight: "600"
              },
              children: "Confirm Bid"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
                                          @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
                                          @keyframes popupIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                                   ` })
    ] }),
    toast.show && /* @__PURE__ */ jsxs("div", { style: {
      position: "fixed",
      right: "25px",
      bottom: "25px",
      zIndex: 9999,
      minWidth: "280px",
      backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
      color: "#fff",
      padding: "16px 20px",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "slideIn 0.3s ease-out forwards"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: toast.type === "success" ? "✓" : "!" }),
      /* @__PURE__ */ jsx("div", { style: { fontWeight: "600", fontSize: "14px" }, children: toast.message }),
      /* @__PURE__ */ jsx("style", { children: `
                                          @keyframes slideIn {
                                                 from { transform: translateX(100%); opacity: 0; }
                                                  to { transform: translateX(0); opacity: 1; }
                                          }
                                   ` })
    ] })
  ] });
}
function BidHistory({ bids }) {
  const defaultProfileImage = "/assets/images/user.jpg";
  const getUrl = (path) => {
    if (!path) return defaultProfileImage;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/${cleanPath}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "bid-history-parent", children: [
    /* @__PURE__ */ jsx("div", { className: "bid-history-header", children: /* @__PURE__ */ jsx("h2", { className: "description", children: "Bid History" }) }),
    /* @__PURE__ */ jsx("div", { className: "bid-history-scroll", children: Array.isArray(bids) && bids.length > 0 ? bids.map((bid) => {
      const user = bid.user || {};
      const userImage = user.profile_pic || user.image;
      const img = getUrl(userImage);
      const amountAED = Number(bid.bid_amount || bid.amount) || 0;
      const dateStr = new Date(bid.created_at).toLocaleTimeString(void 0, {
        hour: "2-digit",
        minute: "2-digit"
      });
      return /* @__PURE__ */ jsxs("div", { className: "history-user parent", children: [
        /* @__PURE__ */ jsxs("div", { className: "history-user-profile", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: img,
              alt: "Bidder",
              referrerPolicy: "no-referrer",
              style: {
                width: "30px",
                height: "30px",
                borderRadius: "40%",
                objectFit: "cover"
              },
              onError: (e) => {
                e.target.src = defaultProfileImage;
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "username-and-date ms-3", children: [
            /* @__PURE__ */ jsx("p", { className: "history-user-name", children: user.name ? user.name.length > 15 ? user.name.substring(0, 15) + "..." : user.name : "Unknown" }),
            /* @__PURE__ */ jsx("span", { className: "date", children: dateStr })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "history-user-payAmount", children: /* @__PURE__ */ jsx("p", { className: "history-no", children: /* @__PURE__ */ jsx(Price, { amountAED }) }) })
      ] }, bid.id);
    }) : /* @__PURE__ */ jsx("p", { className: "text-center text-muted my-4", children: "No Bid History" }) })
  ] });
}
function YoutubeLiveEmbed({ videoId, title = "Live stream" }) {
  if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
    return null;
  }
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;
  return /* @__PURE__ */ jsx("div", { className: "xb-youtube-embed rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "ratio ratio-16x9", style: { position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx(
    "iframe",
    {
      title,
      src,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      loading: "lazy",
      referrerPolicy: "strict-origin-when-cross-origin",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: 0
      }
    }
  ) }) });
}
export {
  BidSection as B,
  YoutubeLiveEmbed as Y,
  BidHistory as a
};
