export const buildProductHref = (slugOrListing, maybeListing = null) => {
       const listing = (typeof slugOrListing === 'object' && slugOrListing !== null)
              ? slugOrListing
              : maybeListing;
       const slug = (typeof slugOrListing === 'string')
              ? slugOrListing
              : (listing?.slug || '');

       if (!slug) {
              return '#';
       }

       // Direct renovation URL from backend
       if (listing?.renovation_url) {
              return listing.renovation_url;
       }

       // Direct property URL from backend
       if (listing?.property_url) {
              return listing.property_url;
       }

       const renovationRootIds = [
              Number(typeof window !== 'undefined' && window.renovationRootCategoryId) || 1176,
              Number(typeof window !== 'undefined' && window.builderRootCategoryId) || 1307,
       ].filter((id) => Number.isFinite(id) && id > 0);

       // If listing is flagged as renovation or belongs to renovation/builder categories
       const isRenovation = listing?.is_renovation === true ||
              renovationRootIds.includes(Number(listing?.category_id)) ||
              listing?.category?.slug?.includes('renovation') ||
              listing?.category?.slug?.includes('builder');

       if (isRenovation) {
              const renovationBase = (typeof window !== 'undefined' && (window.__RENOVATION_FRONTEND_URL__ || window.renovationFrontendUrl))
                     || 'https://home.xpertbid.com';
              return `${renovationBase.replace(/\/+$/, '')}/properties/${encodeURIComponent(slug)}`;
       }

       // If listing is flagged as property or belongs to property category
       const isProperty = listing?.is_property === true ||
              listing?.category?.slug === 'properties' ||
              listing?.category?.name?.toLowerCase()?.includes('propert') ||
              listing?.category_id === 222;

       if (isProperty) {
              const propertyBase = (typeof window !== 'undefined' && (window.__PROPERTY_FRONTEND_URL__ || window.propertyFrontendUrl))
                     || 'https://property.xpertbid.com';
              return `${propertyBase.replace(/\/+$/, '')}/properties/${encodeURIComponent(slug)}`;
       }

       const url = new URL(`/product/${slug}`, 'http://localhost');

       return `${url.pathname}${url.search}${url.hash}`;
};
