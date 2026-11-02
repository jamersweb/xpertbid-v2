function publicBuyerRequestLocation(item) {
  if (!item) return "";
  const rawCity = String(item.city || "").trim();
  const cityParts = rawCity.split(",").map((part) => part.trim()).filter(Boolean);
  const city = cityParts.length > 1 ? cityParts[cityParts.length - 1] : rawCity;
  const country = String(item.country || "").trim();
  return [city, country].filter(Boolean).join(", ");
}
export {
  publicBuyerRequestLocation as p
};
