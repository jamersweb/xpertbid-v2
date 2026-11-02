/**
 * Public buyer-request location: city + country only (never exact address / coords).
 */
export function publicBuyerRequestLocation(item) {
       if (!item) return '';

       const rawCity = String(item.city || '').trim();
       // city is sometimes stored as "area, city" — keep the last segment as the city name
       const cityParts = rawCity
              .split(',')
              .map((part) => part.trim())
              .filter(Boolean);
       const city = cityParts.length > 1 ? cityParts[cityParts.length - 1] : rawCity;
       const country = String(item.country || '').trim();

       return [city, country].filter(Boolean).join(', ');
}
