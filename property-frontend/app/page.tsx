import { HeroSection } from "@/components/HeroSection";
import { HomePropertySection } from "@/components/HomePropertySection";
import {
  getFeaturedProperties,
  getProperties,
  getPropertyCategories,
} from "@/lib/api/client";
import type { CategoryNode, PropertyCard } from "@/types/property";

export const revalidate = 120;

const SECTION_LIMIT = 3;

type ChildMatch = {
  slug: string;
  name: string;
  parentSlug?: string;
};

function flattenChildren(tree: CategoryNode | null): Array<CategoryNode & { parentSlug?: string }> {
  if (!tree) return [];
  const out: Array<CategoryNode & { parentSlug?: string }> = [];

  for (const sub of tree.children || []) {
    for (const child of sub.children || []) {
      out.push({ ...child, parentSlug: sub.slug });
    }
  }

  return out;
}

function findChildCategory(
  tree: CategoryNode | null,
  patterns: string[]
): ChildMatch | null {
  const children = flattenChildren(tree);
  const normalized = patterns.map((p) => p.toLowerCase());

  const byExactSlug = children.find((c) =>
    normalized.includes((c.slug || "").toLowerCase())
  );
  if (byExactSlug) {
    return {
      slug: byExactSlug.slug,
      name: byExactSlug.name,
      parentSlug: byExactSlug.parentSlug,
    };
  }

  const byIncludes = children.find((c) => {
    const slug = (c.slug || "").toLowerCase();
    const name = (c.name || "").toLowerCase();
    return normalized.some((p) => slug.includes(p) || name.includes(p));
  });

  if (!byIncludes) return null;

  return {
    slug: byIncludes.slug,
    name: byIncludes.name,
    parentSlug: byIncludes.parentSlug,
  };
}

async function safeProperties(
  filters: Parameters<typeof getProperties>[0]
): Promise<PropertyCard[]> {
  try {
    const result = await getProperties({
      ...filters,
      per_page: SECTION_LIMIT,
      sort: "latest",
      listing_type: filters.listing_type || "normal",
    });
    return result.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  let featured: PropertyCard[] = [];
  let forSale: PropertyCard[] = [];
  let forRent: PropertyCard[] = [];
  let apartments: PropertyCard[] = [];
  let lands: PropertyCard[] = [];
  let tree: CategoryNode | null = null;

  try {
    tree = await getPropertyCategories();
  } catch {
    tree = null;
  }

  const apartmentCat = findChildCategory(tree, [
    "apartment",
    "apartments",
    "flat",
    "flats",
  ]);
  const landCat = findChildCategory(tree, [
    "land",
    "lands",
    "plot",
    "plots",
    "agricultural-land",
  ]);

  try {
    const [featuredRes, saleRes, rentRes, aptRes, landRes] = await Promise.all([
      getFeaturedProperties(SECTION_LIMIT).catch(() => [] as PropertyCard[]),
      safeProperties({ sub_category: "for-sale" }),
      safeProperties({ sub_category: "for-rent" }),
      apartmentCat
        ? safeProperties({
            child_category: apartmentCat.slug,
            ...(apartmentCat.parentSlug
              ? { sub_category: apartmentCat.parentSlug }
              : {}),
          })
        : Promise.resolve([] as PropertyCard[]),
      landCat
        ? safeProperties({
            child_category: landCat.slug,
            ...(landCat.parentSlug ? { sub_category: landCat.parentSlug } : {}),
          })
        : Promise.resolve([] as PropertyCard[]),
    ]);

    featured = featuredRes;
    forSale = saleRes;
    forRent = rentRes;
    apartments = aptRes;
    lands = landRes;
  } catch {
    // sections stay empty
  }

  const hasAny =
    featured.length ||
    forSale.length ||
    forRent.length ||
    apartments.length ||
    lands.length;

  const apartmentHref = apartmentCat
    ? `/properties?${new URLSearchParams({
        ...(apartmentCat.parentSlug
          ? { sub_category: apartmentCat.parentSlug }
          : {}),
        child_category: apartmentCat.slug,
        listing_type: "normal",
      }).toString()}`
    : "/properties?listing_type=normal";

  const landHref = landCat
    ? `/properties?${new URLSearchParams({
        ...(landCat.parentSlug ? { sub_category: landCat.parentSlug } : {}),
        child_category: landCat.slug,
        listing_type: "normal",
      }).toString()}`
    : "/properties?listing_type=normal";

  return (
    <div className="home-page">
      <HeroSection />

      {!hasAny ? (
        <section className="featured-product home-property-section" style={{ backgroundColor: "#F1F1F1" }}>
          <div className="container-fluid px-3 px-lg-5">
            <div className="property-empty">
              No properties available yet. Ensure the Laravel API is running.
            </div>
          </div>
        </section>
      ) : null}

      <HomePropertySection
        title="Featured Properties"
        viewAllHref="/properties?featured=1&listing_type=normal"
        properties={featured}
        tone="default"
      />

      <HomePropertySection
        title="For Sale"
        viewAllHref="/properties?sub_category=for-sale&listing_type=normal"
        properties={forSale}
        tone="alt"
      />

      <HomePropertySection
        title="For Rent"
        viewAllHref="/properties?sub_category=for-rent&listing_type=normal"
        properties={forRent}
        tone="default"
      />

      <HomePropertySection
        title={apartmentCat?.name || "Apartment"}
        viewAllHref={apartmentHref}
        properties={apartments}
        tone="alt"
      />

      <HomePropertySection
        title={landCat?.name || "Lands"}
        viewAllHref={landHref}
        properties={lands}
        tone="default"
      />
    </div>
  );
}
