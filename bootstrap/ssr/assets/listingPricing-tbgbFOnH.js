function normalizeListingType(item) {
  return String(item?.list_type || item?.listing_type || "").trim().toLowerCase();
}
function isDirectBuyListing(item) {
  const normalized = normalizeListingType(item);
  return ["normal", "normal_list", "business", "business_list"].includes(normalized);
}
function isBusinessListing(item) {
  const normalized = normalizeListingType(item);
  return ["business", "business_list"].includes(normalized);
}
function getBaseListingPrice(item) {
  const directPrice = Number(
    item?.price ?? item?.buy_now_price ?? item?.listing_data?.price ?? item?.minimum_bid ?? item?.listing_data?.start_price ?? 0
  );
  return Number.isFinite(directPrice) ? directPrice : 0;
}
function getDiscountMeta(item) {
  const discountType = String(item?.discount_type || "").trim().toLowerCase();
  const rawDiscountValue = Number(item?.discount_value ?? 0);
  const discountValue = Number.isFinite(rawDiscountValue) ? rawDiscountValue : 0;
  const basePrice = getBaseListingPrice(item);
  const hasDiscount = isDirectBuyListing(item) && basePrice > 0 && discountValue > 0 && ["percent", "flat"].includes(discountType);
  if (!hasDiscount) {
    return {
      hasDiscount: false,
      discountType: "",
      discountValue: 0,
      originalPrice: basePrice,
      finalPrice: basePrice,
      badgeText: ""
    };
  }
  let finalPrice = basePrice;
  if (discountType === "percent") {
    finalPrice = basePrice - basePrice * (discountValue / 100);
  } else if (discountType === "flat") {
    finalPrice = basePrice - discountValue;
  }
  finalPrice = Math.max(0, finalPrice);
  return {
    hasDiscount: true,
    discountType,
    discountValue,
    originalPrice: basePrice,
    finalPrice,
    badgeText: discountType === "percent" ? `${Math.round(discountValue)}% OFF` : "SALE"
  };
}
export {
  getBaseListingPrice as a,
  isBusinessListing as b,
  getDiscountMeta as g,
  isDirectBuyListing as i
};
