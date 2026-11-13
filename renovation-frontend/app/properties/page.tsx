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

function slugMatches(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  if (left === right) return true;
  // Seeded slugs often look like `kitchen-renovation-p1176`
  if (left.startsWith(`${right}-p`) || left.startsWith(`${right}-s`)) return true;
  if (right.startsWith(`${left}-p`) || right.startsWith(`${left}-s`)) return true;
  return false;
}

function findMainCategory(tree: CategoryNode | null, slug?: string) {
  if (!tree || !slug) return null;
  const mains = tree.main_categories?.length
    ? tree.main_categories
    : tree.slug
      ? [tree]
      : [];

  const exact =
    mains.find(
      (main) =>
        slugMatches(main.slug, slug) ||
        main.name?.toLowerCase() === slug.toLowerCase()
    ) || null;
  if (exact) return exact;

  const value = slug.toLowerCase();
  if (value.includes("builder")) {
    return (
      mains.find(
        (main) =>
          main.slug?.toLowerCase().includes("builder") ||
          main.name?.toLowerCase().includes("builder")
      ) || null
    );
  }
  if (value.includes("renovation")) {
    return (
      mains.find(
        (main) =>
          main.slug?.toLowerCase().includes("renovation") ||
          main.name?.toLowerCase().includes("renovation")
      ) || null
    );
  }

  return null;
}

function findMainForSubcategory(tree: CategoryNode | null, subSlug?: string) {
  if (!tree?.main_categories?.length || !subSlug) return null;
  for (const main of tree.main_categories) {
    if ((main.children || []).some((child) => slugMatches(child.slug, subSlug))) {
      return main;
    }
  }
  return null;
}

function findPurpose(tree: CategoryNode | null, slug?: string, mainSlug?: string) {
  if (!tree || !slug) return null;
  if (tree.main_categories && tree.main_categories.length > 0) {
    const mains = mainSlug
      ? tree.main_categories.filter((main) => slugMatches(main.slug, mainSlug))
      : tree.main_categories;
    for (const main of mains) {
      const found = (main.children || []).find((c) => slugMatches(c.slug, slug));
      if (found) return found;
    }
  }
  return (tree.children || []).find((c) => slugMatches(c.slug, slug)) || null;
}

function findChild(purpose: CategoryNode | null, slug?: string) {
  if (!purpose || !slug) return null;
  return (purpose.children || []).find((c) => slugMatches(c.slug, slug)) || null;
}

function findByChildSlug(tree: CategoryNode | null, childSlug?: string) {
  if (!tree || !childSlug) return null;
  const mains = tree.main_categories?.length
    ? tree.main_categories
    : tree.slug
      ? [tree]
      : [];
  for (const main of mains) {
    for (const sub of main.children || []) {
      const child = (sub.children || []).find((c) => slugMatches(c.slug, childSlug));
      if (child) return { main, sub, child };
    }
  }
  return null;
}

/** Fallback title when API slug lookup fails but `type` is in the URL. */
function titleFromTypeParam(type?: string | null) {
  if (!type) return null;
  const value = type.toLowerCase();
  if (value.includes("builder")) return "Home Builder";
  if (value.includes("renovation")) return "Home Renovation";
  return type
    .replace(/-p\d+/gi, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
    const purpose = findPurpose(tree, filters.sub_category, filters.type);
    const mainCategory =
      findMainCategory(tree, filters.type) ||
      findMainForSubcategory(tree, filters.sub_category);
    const selectedChild = findChild(purpose, filters.child_category);
    const active = selectedChild || purpose || mainCategory || tree;
    if (active?.meta_title || active?.meta_description) {
      return {
        title: active.meta_title || active.name,
        description: active.meta_description || undefined,
      };
    }
    if (selectedChild || purpose || mainCategory) {
      return {
        title: selectedChild
          ? `${selectedChild.name} | ${purpose?.name || mainCategory?.name}`
          : purpose?.name || mainCategory?.name,
      };
    }

    const fromType = titleFromTypeParam(filters.type);
    if (fromType) return { title: fromType };
  } catch {
    // fall through
  }

  return { title: titleFromTypeParam(filters.type) || "Browse Home Renovation & Builder Products" };
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
      ? findByChildSlug(tree, filters.child_category)
      : null;
  const purpose =
    findPurpose(tree, filters.sub_category, filters.type) ||
    childMatch?.sub ||
    null;
  const mainCategory =
    findMainCategory(tree, filters.type) ||
    findMainForSubcategory(tree, filters.sub_category) ||
    childMatch?.main ||
    null;
  const selectedChild =
    findChild(purpose, filters.child_category) || childMatch?.child || null;
  const mainVerticals = (tree?.main_categories || []).filter((category) => {
    const slug = category.slug?.toLowerCase() || "";
    const name = category.name?.toLowerCase() || "";
    return (
      slug.includes("home-renovation") ||
      slug.includes("home-builder") ||
      name.includes("home renovation") ||
      name.includes("home builder")
    );
  });

  const rootCategories =
    mainVerticals.length > 0 ? mainVerticals : tree?.main_categories || [];
  const fallbackCategories = tree?.children || [];

  let result: Awaited<ReturnType<typeof getProperties>> = {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  };

  try {
    result = await getProperties(filters);
  } catch {
    // empty
  }

  const activeCategoryNode = selectedChild || purpose || mainCategory || null;
  const title =
    selectedChild?.name ||
    purpose?.name ||
    mainCategory?.name ||
    titleFromTypeParam(filters.type) ||
    "Home Renovation & Builder";
  const schemaMarkup =
    activeCategoryNode?.schema_markup || tree?.schema_markup;

  const loadMoreKey = [
    filters.q,
    filters.city,
    filters.city_id,
    filters.state_id,
    filters.country_id,
    filters.type,
    filters.sub_category,
    filters.child_category,
    filters.listing_type,
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
        rootCategories={rootCategories}
        fallbackCategories={fallbackCategories}
        currentMainCategory={mainCategory}
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
