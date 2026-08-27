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

/**
 * Browse URL for a category chip/link.
 * Property-tree categories open the property frontend; everything else stays on marketplace.
 */
export function getCategoryBrowseUrl(category, options = {}) {
       const propertyFrontendUrl = String(options.propertyFrontendUrl || 'https://property.xpertbid.com').replace(/\/+$/, '');
       const propertyRootCategoryId = getPropertyRootCategoryId(options.propertyRootCategoryId);
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

       if (!slug) {
              return { href: '/marketplace', external: false };
       }

       return {
              href: route('marketplace.type', { slug, typeSlug: 'auctions' }),
              external: false,
       };
}
