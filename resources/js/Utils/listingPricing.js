export function normalizeListingType(item) {
       return String(item?.list_type || item?.listing_type || "").trim().toLowerCase();
}

export function isSoldOutListing(item) {
       return String(item?.status || "").trim().toLowerCase() === "sold_out";
}

export function isDirectBuyListing(item) {
       const normalized = normalizeListingType(item);
       return ["normal", "normal_list", "business", "business_list"].includes(normalized);
}

export function isBusinessListing(item) {
       const normalized = normalizeListingType(item);
       return ["business", "business_list"].includes(normalized);
}

export function getBaseListingPrice(item) {
       const candidates = [
              item?.price,
              item?.buy_now_price,
              item?.listing_data?.price,
              item?.listing_data?.buy_now_price,
              item?.minimum_bid,
              item?.listing_data?.minimum_bid,
              item?.listing_data?.start_price,
              item?.reserve_price,
              item?.listing_data?.reserve_price,
       ];

       for (const candidate of candidates) {
              const value = Number(candidate);
              if (Number.isFinite(value) && value > 0) {
                     return value;
              }
       }

       // Variation-only products: use the lowest positive variation price.
       const variations = getListingVariations(item);
       const variationPrices = variations
              .map((variation) => Number(variation?.price))
              .filter((value) => Number.isFinite(value) && value > 0);

       if (variationPrices.length > 0) {
              return Math.min(...variationPrices);
       }

       return 0;
}

/** Price shown on home/marketplace cards (matches product detail fallbacks). */
export function getCardDisplayPrice(item) {
       const maxBid = Number(item?.current_highest_bid ?? item?.bids_max_bid_amount ?? 0);
       const hasMaxBid = Number.isFinite(maxBid) && maxBid > 0;
       const discountMeta = getDiscountMeta(item);

       if (isDirectBuyListing(item)) {
              return {
                     amount: discountMeta.hasDiscount ? discountMeta.finalPrice : getBaseListingPrice(item),
                     labelKey: "Price",
                     hasMaxBid: false,
                     discountMeta,
              };
       }

       if (hasMaxBid) {
              return {
                     amount: maxBid,
                     labelKey: "Current Bid",
                     hasMaxBid: true,
                     discountMeta,
              };
       }

       return {
              amount: getBaseListingPrice(item),
              labelKey: "Minimum Bid",
              hasMaxBid: false,
              discountMeta,
       };
}

export function getDiscountMeta(item) {
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
                     badgeText: "",
              };
       }

       let finalPrice = basePrice;

       if (discountType === "percent") {
              finalPrice = basePrice - (basePrice * (discountValue / 100));
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
              badgeText: discountType === "percent" ? `${Math.round(discountValue)}% OFF` : "SALE",
       };
}

export function getListingVariations(item) {
       const raw = Array.isArray(item?.variations) && item.variations.length > 0
              ? item.variations
              : (Array.isArray(item?.listing_data?.variations) ? item.listing_data.variations : []);

       return raw
              .map((variation, index) => {
                     const name = String(variation?.name || "").trim();
                     if (!name) {
                            return null;
                     }

                     const parts = name.split(" / ").map((part) => part.trim()).filter(Boolean);
                     const hasSplit = parts.length >= 2;

                     return {
                            id: variation?.id ?? index,
                            name,
                            price: variation?.price ?? "",
                            discount_type: variation?.discount_type || "",
                            discount_value: variation?.discount_value ?? "",
                            color: hasSplit ? parts[0] : "",
                            size: hasSplit ? parts.slice(1).join(" / ") : name,
                     };
              })
              .filter(Boolean);
}

export function getVariationPriceMeta(variation, item) {
       const originalPrice = Number(variation?.price ?? getBaseListingPrice(item) ?? 0);
       const discountType = String(variation?.discount_type || item?.discount_type || "").trim().toLowerCase();
       const discountValue = Number(variation?.discount_value ?? item?.discount_value ?? 0);
       const hasDiscount = originalPrice > 0 && discountValue > 0 && ["percent", "flat"].includes(discountType);
       let finalPrice = originalPrice;

       if (hasDiscount && discountType === "percent") {
              finalPrice = originalPrice - (originalPrice * (discountValue / 100));
       } else if (hasDiscount && discountType === "flat") {
              finalPrice = originalPrice - discountValue;
       }

       return {
              hasDiscount,
              discountType: hasDiscount ? discountType : "",
              discountValue: hasDiscount ? discountValue : 0,
              originalPrice,
              finalPrice: Math.max(0, Number.isFinite(finalPrice) ? finalPrice : 0),
              badgeText: hasDiscount
                     ? (discountType === "percent" ? `${Math.round(discountValue)}% OFF` : "SALE")
                     : "",
       };
}
