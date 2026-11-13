import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { MarketplaceWorkspace } from "@/components/MarketplaceWorkspace";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import { getProperties, getPropertyCategories, getCountries } from "@/lib/api/client";
import type { CategoryNode, PropertyFilters } from "@/types/property";

export const revalidate = 120;

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): PropertyFilters {
  const num = (key: string) => {
    const v = first(sp[key]);
    return v && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  };

  const listingType = first(sp.listing_type) || "normal";

  return {
    page: 1,
    per_page: 12,
    q: first(sp.q),
    city: first(sp.city),
    city_id: num("city_id"),
    state_id: num("state_id"),
    country_id: num("country_id"),
    type: first(sp.type),
    purpose: first(sp.purpose),
    bedrooms: num("bedrooms"),
    price_min: num("price_min"),
    price_max: num("price_max"),
    sub_category: first(sp.sub_category),
    child_category: first(sp.child_category),
    listing_type: listingType as PropertyFilters["listing_type"],
    featured: first(sp.featured) === "1" ? 1 : undefined,
    sort: (first(sp.sort) as PropertyFilters["sort"]) || "latest",
  };
}

function findPurpose(tree: CategoryNode | null, slug?: string) {
  if (!tree || !slug) return null;
  return (tree.children || []).find((c) => c.slug === slug) || null;
}

function findChild(purpose: CategoryNode | null, slug?: string) {
  if (!purpose || !slug) return null;
  return (purpose.children || []).find((c) => c.slug === slug) || null;
}

function findPurposeForChild(tree: CategoryNode | null, childSlug?: string) {
  if (!tree || !childSlug) return null;
  for (const purpose of tree.children || []) {
    const child = (purpose.children || []).find((c) => c.slug === childSlug);
    if (child) return { purpose, child };
  }
  return null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  try {
    const tree = await getPropertyCategories();
    const purpose = findPurpose(tree, filters.sub_category);
    const selectedChild = findChild(purpose, filters.child_category);
    const active = selectedChild || purpose || tree;
    if (active?.meta_title || active?.meta_description) {
      return {
        title: active.meta_title || active.name,
        description: active.meta_description || undefined,
      };
    }
  } catch {
    // fall through
  }

  const sub = first(sp.sub_category);
  const child = first(sp.child_category);

  if (sub === "for-sale") {
    return {
      title: child ? `${child.replace(/-/g, " ")} for sale` : "Properties for sale",
    };
  }
  if (sub === "for-rent") {
    return {
      title: child ? `${child.replace(/-/g, " ")} for rent` : "Properties for rent",
    };
  }

  return { title: "Browse properties" };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);

  let tree: CategoryNode | null = null;
  let countries: Awaited<ReturnType<typeof getCountries>> = [];
  try {
    [tree, countries] = await Promise.all([
      getPropertyCategories(),
      getCountries(),
    ]);
  } catch {
    tree = null;
    countries = [];
  }

  const childMatch =
    !filters.sub_category && filters.child_category
      ? findPurposeForChild(tree, filters.child_category)
      : null;
  const purpose =
    findPurpose(tree, filters.sub_category) || childMatch?.purpose || null;
  const selectedChild =
    findChild(purpose, filters.child_category) || childMatch?.child || null;
  const purposeCategories = [...(tree?.children || [])].sort((a, b) => {
    if (a.slug === "for-sale") return -1;
    if (b.slug === "for-sale") return 1;
    if (a.slug === "for-rent") return -1;
    if (b.slug === "for-rent") return 1;
    return a.name.localeCompare(b.name);
  });

  let result: Awaited<ReturnType<typeof getProperties>> = {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  };

  try {
    result = await getProperties(filters);
  } catch {
    // empty
  }

  const activeCategoryNode = selectedChild || purpose || null;
  const title = selectedChild?.name || purpose?.name || "Properties";
  const schemaMarkup =
    activeCategoryNode?.schema_markup || tree?.schema_markup;

  const loadMoreKey = [
    filters.q,
    filters.city,
    filters.city_id,
    filters.state_id,
    filters.country_id,
    filters.sub_category,
    filters.child_category,
    filters.listing_type,
    filters.bedrooms,
    filters.price_min,
    filters.price_max,
    filters.sort,
    filters.featured,
  ].join("|");

  return (
    <div className="marketplace-page-shell pb-5">
      <JsonLdScripts markup={schemaMarkup} idPrefix="properties-schema" />
      <HeroSection fluid className="my-4" />
      <MarketplaceWorkspace
        purposeCategories={purposeCategories}
        currentSubcategory={purpose}
        currentChildCategory={selectedChild}
        headingTitle={title}
        seoShortContent={activeCategoryNode?.seo_short_content}
        seoContent={activeCategoryNode?.seo_content}
        countries={countries}
        filters={filters}
        initialItems={result.data}
        initialMeta={result.meta}
        loadMoreKey={loadMoreKey}
      />
    </div>
  );
}
