import { route } from 'ziggy-js';

const PROPERTY_ROOT_SLUG = 'real-estate-property-auction';

export function getPropertyRootCategoryId(explicitId) {
       const fromExplicit = Number(explicitId);
       if (Number.isFinite(fromExplicit) && fromExplicit > 0) {
              return fromExplicit;
       }

       return 222;
}

export function isPropertyCategory(category, propertyRootCategoryId = 222) {
       if (!category) return false;

       const rootId = getPropertyRootCategoryId(propertyRootCategoryId);
       const id = Number(category.id ?? category.category_id);
       const parentId = Number(category.parent_id);
       const subCategoryId = Number(category.sub_category_id);
       const slug = String(category.slug || '').trim().toLowerCase();
       const name = String(category.name || '').trim().toLowerCase();

       if (Number.isFinite(id) && id === rootId) return true;
       if (slug === PROPERTY_ROOT_SLUG) return true;
       if (name === 'properties') return true;
       if (Number.isFinite(parentId) && parentId === rootId) return true;
       if (Number.isFinite(subCategoryId) && subCategoryId === rootId) return true;

       return false;
}

const RENOVATION_ROOT_IDS = [1163, 1294];

export function isRenovationCategory(category) {
       if (!category) return false;

       const id = Number(category.id ?? category.category_id);
       const parentId = Number(category.parent_id);
       const subCategoryId = Number(category.sub_category_id);
       const slug = String(category.slug || '').trim().toLowerCase();
       const name = String(category.name || '').trim().toLowerCase();

       if (RENOVATION_ROOT_IDS.includes(id)) return true;
       if (RENOVATION_ROOT_IDS.includes(parentId)) return true;
       if (RENOVATION_ROOT_IDS.includes(subCategoryId)) return true;
       if (slug.includes('home-renovation') || slug.includes('home-builder')) return true;
       if (name.includes('renovation') || name.includes('builder')) return true;

       return false;
}

/**
 * Browse URL for a category chip/link.
 * Property-tree categories open the property frontend;
 * Renovation-tree categories open the renovation frontend;
 * everything else stays on marketplace.
 */
export function getCategoryBrowseUrl(category, options = {}) {
       const propertyFrontendUrl = String(options.propertyFrontendUrl || 'https://property.xpertbid.com').replace(/\/+$/, '');
       const propertyRootCategoryId = getPropertyRootCategoryId(options.propertyRootCategoryId);
       const renovationFrontendUrl = String(options.renovationFrontendUrl || 'https://renovation.xpertbid.com').replace(/\/+$/, '');
       const slug = category?.slug;

       if (isPropertyCategory(category, propertyRootCategoryId)) {
              const id = Number(category?.id ?? category?.category_id);
              const isRoot =
                     id === propertyRootCategoryId
                     || String(slug || '').trim().toLowerCase() === PROPERTY_ROOT_SLUG
                     || String(category?.name || '').trim().toLowerCase() === 'properties';

              return {
                     href: isRoot ? `${propertyFrontendUrl}/properties` : `${propertyFrontendUrl}/categories/${slug}`,
                     external: true,
              };
       }

       if (isRenovationCategory(category)) {
              const id = Number(category?.id ?? category?.category_id);
              const isRoot = RENOVATION_ROOT_IDS.includes(id);

              return {
                     href: isRoot
                            ? `${renovationFrontendUrl}/properties?type=${encodeURIComponent(slug)}`
                            : `${renovationFrontendUrl}/properties?sub_category=${encodeURIComponent(slug)}`,
                     external: true,
              };
       }

       if (!slug) {
              return { href: '/marketplace', external: false };
       }

       return {
              href: route('marketplace.type', { slug, typeSlug: 'auctions' }),
              external: false,
       };
}
